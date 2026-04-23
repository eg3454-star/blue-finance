from __future__ import annotations

import json
from typing import Any

import httpx
from bs4 import BeautifulSoup
from langchain_community.tools import TavilySearchResults
from langchain_core.prompts import ChatPromptTemplate

from ..config import Settings
from ..models import ExternalResearchResult, ProjectProfile
from ..prompts import load_prompt
from .base import build_chat_model


class BrowsingAgent:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or Settings()
        self.llm = build_chat_model(self.settings)
        self.search_provider = self.settings.browsing_search_provider.strip().lower()
        self.search_tool: Any = None
        self.max_query_variants = 2
        self.max_links_total = 5
        self.max_results_per_query = 3
        system_prompt = load_prompt("browsing_agent_system.txt", self.settings.prompts_dir)
        self.chain = (
            ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    (
                        "human",
                        "Project profile:\n{project_profile}\n\n"
                        "Research question:\n{question}\n\n"
                        "Raw search output:\n{search_results}",
                    ),
                ]
            )
            | self.llm.with_structured_output(ExternalResearchResult, method="function_calling")
        )

    def research(
        self,
        project_profile: ProjectProfile,
        question: str,
    ) -> ExternalResearchResult:
        self._ensure_search_tool()
        search_payload = self._run_search_queries(
            self._build_query_candidates(project_profile, question)
        )
        search_results = json.dumps(search_payload, indent=2, default=str)
        return self.chain.invoke(
            {
                "project_profile": project_profile.model_dump_json(indent=2),
                "question": question,
                "search_results": search_results,
            }
        )

    def _ensure_search_tool(self) -> None:
        if self.search_tool is not None:
            return
        if self.search_provider == "tavily":
            if not self.settings.tavily_api_key:
                raise RuntimeError(
                    "TAVILY_API_KEY is required when BROWSING_SEARCH_PROVIDER is 'tavily'."
                )
            self.search_tool = TavilySearchResults(
                max_results=self.max_results_per_query,
                include_answer=True,
                include_raw_content=False,
                tavily_api_key=self.settings.tavily_api_key,
            )
            return
        if self.search_provider == "duckduckgo":
            # Use DuckDuckGo's HTML endpoint directly to avoid optional ddgs dependency.
            self.search_tool = "duckduckgo_html"
            return
        raise RuntimeError(
            "Unsupported BROWSING_SEARCH_PROVIDER. Use 'tavily' or 'duckduckgo'."
        )

    def _build_query_candidates(
        self,
        project_profile: ProjectProfile,
        question: str,
    ) -> list[str]:
        qualifiers = " ".join(
            part
            for part in (
                project_profile.geography,
                project_profile.subsector or project_profile.sector,
                project_profile.instrument_type,
            )
            if part
        ).strip()
        candidates = [question]
        if qualifiers:
            candidates.append(f"{question} {qualifiers}")
        candidates.append(
            (
                "blue finance benchmark guidance "
                f"{project_profile.subsector or project_profile.sector or ''} "
                f"{project_profile.geography or ''} "
                f"{project_profile.instrument_type or ''}"
            ).strip()
        )
        deduped: list[str] = []
        for candidate in candidates:
            normalized = " ".join(candidate.split())
            if normalized and normalized not in deduped:
                deduped.append(normalized)
        return deduped[: self.max_query_variants]

    def _run_search_queries(self, queries: list[str]) -> list[dict[str, Any]]:
        payloads: list[dict[str, Any]] = []
        if self.search_tool is None:
            return payloads
        remaining_links = self.max_links_total
        for query in queries:
            if remaining_links <= 0:
                break
            raw = (
                self._run_duckduckgo_search(query)
                if self.search_provider == "duckduckgo"
                else self.search_tool.invoke({"query": query})
            )
            compact_results = self._normalize_search_output(raw)
            compact_results, used_links = self._limit_payload_links(compact_results, remaining_links)
            remaining_links -= used_links
            payloads.append(
                {
                    "query": query,
                    "results": compact_results,
                }
            )
        return payloads

    def _run_duckduckgo_search(self, query: str) -> list[dict[str, Any]]:
        try:
            response = httpx.get(
                "https://duckduckgo.com/html/",
                params={"q": query},
                timeout=10.0,
                follow_redirects=True,
                headers={"User-Agent": "Mozilla/5.0"},
            )
            response.raise_for_status()
        except httpx.HTTPError as exc:
            return [{"title": "DuckDuckGo request failed", "url": None, "content": str(exc)}]
        soup = BeautifulSoup(response.text, "html.parser")
        items: list[dict[str, Any]] = []
        for result in soup.select(".result"):
            title_el = result.select_one(".result__a")
            snippet_el = result.select_one(".result__snippet")
            if title_el is None:
                continue
            href = title_el.get("href")
            if href and href.startswith("//"):
                href = f"https:{href}"
            items.append(
                {
                    "title": title_el.get_text(" ", strip=True),
                    "url": href,
                    "content": snippet_el.get_text(" ", strip=True) if snippet_el else None,
                }
            )
            if len(items) >= self.max_results_per_query:
                break
        return items

    @staticmethod
    def _normalize_search_output(raw_results: Any) -> Any:
        if isinstance(raw_results, tuple) and len(raw_results) == 2:
            _, artifact = raw_results
            raw_results = artifact
        if isinstance(raw_results, str):
            try:
                parsed = json.loads(raw_results)
            except json.JSONDecodeError:
                return {"raw_text": raw_results}
            return BrowsingAgent._compact_search_payload(parsed)
        return BrowsingAgent._compact_search_payload(raw_results)

    @staticmethod
    def _compact_search_payload(payload: Any) -> Any:
        if isinstance(payload, dict):
            compact: dict[str, Any] = {}
            if "answer" in payload:
                compact["answer"] = BrowsingAgent._truncate_text(payload.get("answer"), 500)
            results = payload.get("results")
            if isinstance(results, list):
                compact["results"] = [BrowsingAgent._compact_result(item) for item in results[:3]]
            if compact:
                return compact
        if isinstance(payload, list):
            return [BrowsingAgent._compact_result(item) for item in payload[:3]]
        return payload

    @staticmethod
    def _limit_payload_links(payload: Any, remaining_links: int) -> tuple[Any, int]:
        if remaining_links <= 0:
            return payload, 0
        if isinstance(payload, dict) and isinstance(payload.get("results"), list):
            limited_results = payload["results"][:remaining_links]
            used_links = len(limited_results)
            updated = dict(payload)
            updated["results"] = limited_results
            return updated, used_links
        if isinstance(payload, list):
            limited_results = payload[:remaining_links]
            return limited_results, len(limited_results)
        return payload, 0

    @staticmethod
    def _compact_result(item: Any) -> Any:
        if not isinstance(item, dict):
            return item
        url = item.get("url") or item.get("link")
        content = item.get("content") or item.get("snippet") or item.get("body")
        return {
            "title": item.get("title"),
            "url": url,
            "content": BrowsingAgent._truncate_text(content, 600),
            "score": item.get("score"),
            "published_date": item.get("published_date") or item.get("date"),
        }

    @staticmethod
    def _truncate_text(value: Any, limit: int) -> str | None:
        if not isinstance(value, str):
            return None
        text = " ".join(value.split())
        if len(text) <= limit:
            return text
        return text[:limit] + "...[truncated]"
