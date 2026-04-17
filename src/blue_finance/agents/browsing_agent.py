from __future__ import annotations

import json

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
        self.search_tool = TavilySearchResults(
            max_results=5,
            include_answer=True,
            include_raw_content=True,
        )
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
            | self.llm.with_structured_output(ExternalResearchResult)
        )

    def research(
        self,
        project_profile: ProjectProfile,
        question: str,
    ) -> ExternalResearchResult:
        if not self.settings.tavily_api_key:
            raise RuntimeError("TAVILY_API_KEY is required to use the browsing agent.")
        raw_results = self.search_tool.invoke({"query": question})
        search_results = (
            raw_results
            if isinstance(raw_results, str)
            else json.dumps(raw_results, indent=2, default=str)
        )
        return self.chain.invoke(
            {
                "project_profile": project_profile.model_dump_json(indent=2),
                "question": question,
                "search_results": search_results,
            }
        )
