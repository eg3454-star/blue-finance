from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate

from ..config import Settings
from ..document_store import ProjectVectorIndex, parse_estimate_from_metadata
from ..models import ComparableProjectSet, ProjectProfile
from ..prompts import load_prompt
from .base import build_chat_model, render_documents


@dataclass(slots=True)
class EstimateHint:
    value: float | None = None
    low: float | None = None
    high: float | None = None
    tolerance_ratio: float = 0.2

    def to_bounds(self) -> tuple[float, float] | None:
        if self.low is not None and self.high is not None:
            return (min(self.low, self.high), max(self.low, self.high))
        if self.value is None:
            return None
        margin = abs(self.value) * self.tolerance_ratio
        return (self.value - margin, self.value + margin)


class QueryAgent:
    def __init__(
        self,
        vector_index: ProjectVectorIndex,
        settings: Settings | None = None,
    ) -> None:
        self.vector_index = vector_index
        self.settings = settings or Settings()
        self.llm = build_chat_model(self.settings)
        system_prompt = load_prompt("query_agent_system.txt", self.settings.prompts_dir)
        self.chain = (
            ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    (
                        "human",
                        "Comparable search query:\n{search_query}\n\n"
                        "Project profile:\n{project_profile}\n\n"
                        "Retrieved comparable documents:\n{retrieved_documents}",
                    ),
                ]
            )
            | self.llm.with_structured_output(ComparableProjectSet, method="function_calling")
        )

    def find_comparables(
        self,
        project_profile: ProjectProfile,
        field_name: str,
        *,
        k: int = 4,
        estimate_hint: EstimateHint | None = None,
        metadata_filters: dict[str, str] | None = None,
    ) -> ComparableProjectSet:
        bounds = estimate_hint.to_bounds() if estimate_hint else None
        search_query = (
            f"Find comparable blue finance projects for field '{field_name}'. "
            f"Sector={project_profile.sector}; subsector={project_profile.subsector}; "
            f"geography={project_profile.geography}; instrument={project_profile.instrument_type}; "
            f"use_of_proceeds={project_profile.use_of_proceeds}; "
            f"estimate_bounds={bounds or 'not provided'}."
        )
        scored_matches = self._retrieve_scored_matches(
            search_query,
            field_name=field_name,
            estimate_hint=estimate_hint,
            metadata_filters=metadata_filters,
            k=k,
        )
        documents = [document for document, _ in scored_matches]
        fallback_note: str | None = None
        if not documents and estimate_hint:
            scored_matches = self.vector_index.similarity_search_with_scores(
                search_query,
                k=k,
                corpus="reference_projects",
                metadata_filter=metadata_filters,
            )
            documents = [document for document, _ in scored_matches]
            if documents:
                fallback_note = (
                    "No comparables matched the estimate-range hint exactly; "
                    "returned closest project analogs without range filtering."
                )
        if not documents:
            return ComparableProjectSet(
                search_query=search_query,
                takeaways=["No comparable internal projects were found in the reference corpus."],
            )
        best_distance = min(score for _, score in scored_matches)
        if best_distance > self.settings.comparable_max_distance:
            return ComparableProjectSet(
                search_query=search_query,
                takeaways=[
                    "No comparable internal projects were found with sufficient similarity.",
                    (
                        f"Best similarity distance was {best_distance:.3f}, which is above "
                        f"the configured threshold ({self.settings.comparable_max_distance:.3f})."
                    ),
                ],
            )
        result = self.chain.invoke(
            {
                "search_query": search_query,
                "project_profile": project_profile.model_dump_json(indent=2),
                "retrieved_documents": render_documents(documents),
            }
        )
        if fallback_note:
            result.takeaways.append(fallback_note)
        return result

    def _retrieve_scored_matches(
        self,
        search_query: str,
        *,
        field_name: str,
        estimate_hint: EstimateHint | None,
        metadata_filters: dict[str, str] | None,
        k: int,
    ) -> list[tuple[Document, float]]:
        return self.vector_index.similarity_search_with_scores(
            search_query,
            k=k,
            corpus="reference_projects",
            metadata_filter=metadata_filters,
            metadata_predicate=self._build_metadata_predicate(field_name, estimate_hint),
        )

    @staticmethod
    def _build_metadata_predicate(
        field_name: str,
        estimate_hint: EstimateHint | None,
    ) -> Callable[[dict[str, Any]], bool] | None:
        if estimate_hint is None:
            return None
        bounds = estimate_hint.to_bounds()
        if bounds is None:
            return None
        low, high = bounds

        def _predicate(metadata: dict[str, Any]) -> bool:
            estimate_value = parse_estimate_from_metadata(metadata, field_name)
            if estimate_value is None:
                return False
            return low <= estimate_value <= high

        return _predicate
