from __future__ import annotations

import json
from dataclasses import asdict
from collections.abc import Sequence
from typing import Any, Callable

from langchain_core.prompts import ChatPromptTemplate

from ..config import Settings
from ..document_store import ProjectVectorIndex, load_corpus
from ..models import ComparableProjectSet, EstimationOutput, ExternalResearchResult, ProjectProfile
from ..prompts import load_prompt
from .base import build_chat_model, build_embeddings
from .browsing_agent import BrowsingAgent
from .document_parser import DocumentParserAgent
from .query_agent import EstimateHint, QueryAgent


class EstimationOrchestrator:
    def __init__(
        self,
        document_parser: DocumentParserAgent,
        browsing_agent: BrowsingAgent,
        query_agent: QueryAgent,
        settings: Settings | None = None,
    ) -> None:
        self.settings = settings or Settings()
        self.document_parser = document_parser
        self.browsing_agent = browsing_agent
        self.query_agent = query_agent
        self.llm = build_chat_model(self.settings)
        system_prompt = load_prompt("orchestrator_system.txt", self.settings.prompts_dir)
        self.best_practices = (
            self.settings.memory_dir / "best_practices.md"
        ).read_text(encoding="utf-8")
        self.chain = (
            ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    (
                        "human",
                        "Questionnaire draft:\n{questionnaire}\n\n"
                        "Project profile:\n{project_profile}\n\n"
                        "Target fields:\n{target_fields}\n\n"
                        "Integrated field evidence packets:\n{field_evidence_packets}\n\n"
                        "Comparable project findings:\n{comparable_projects}\n\n"
                        "External research findings:\n{external_research}\n\n"
                        "Best practices:\n{best_practices}",
                    ),
                ]
            )
            | self.llm.with_structured_output(EstimationOutput, method="function_calling")
        )

    @classmethod
    def from_settings(cls, settings: Settings | None = None) -> "EstimationOrchestrator":
        settings = settings or Settings()
        embeddings = build_embeddings(settings)
        vector_index = ProjectVectorIndex.load_or_build(
            embeddings=embeddings,
            dump_path=settings.faiss_index_dir,
            documents_dir=settings.documents_dir,
            reference_projects_dir=settings.reference_projects_dir,
        )
        document_parser = DocumentParserAgent(settings=settings)
        browsing_agent = BrowsingAgent(settings=settings)
        query_agent = QueryAgent(vector_index=vector_index, settings=settings)
        return cls(
            document_parser=document_parser,
            browsing_agent=browsing_agent,
            query_agent=query_agent,
            settings=settings,
        )

    def estimate(
        self,
        questionnaire: dict[str, object],
        *,
        target_fields: Sequence[str] | None = None,
        progress_callback: Callable[[dict[str, Any]], None] | None = None,
    ) -> EstimationOutput:
        self._emit_progress(
            progress_callback,
            stage="initializing",
            progress=5,
            message="Loading project documents and profile context.",
        )
        project_documents = load_corpus(self.settings.documents_dir, corpus_name="documents")
        self._emit_progress(
            progress_callback,
            stage="parsing",
            progress=12,
            message="Parsing questionnaire and project profile.",
        )
        project_profile = self.document_parser.parse(questionnaire, project_documents)
        resolved_target_fields = list(target_fields or self._infer_missing_fields(questionnaire, project_profile))
        self._emit_progress(
            progress_callback,
            stage="aggregating",
            progress=18,
            message=f"Identified {len(resolved_target_fields)} target fields to estimate.",
            meta={"target_fields": resolved_target_fields},
        )
        estimate_hints = self._parse_estimate_hints(questionnaire)
        profile_filters = self._profile_filters(project_profile)

        comparable_packets: list[ComparableProjectSet] = []
        total_fields = max(len(resolved_target_fields), 1)
        for index, field_name in enumerate(resolved_target_fields):
            comparable_packets.append(
                self.query_agent.find_comparables(
                project_profile,
                field_name,
                estimate_hint=estimate_hints.get(field_name),
                metadata_filters=profile_filters,
            )
            )
            progress = int(20 + ((index + 1) / total_fields) * 25)
            self._emit_progress(
                progress_callback,
                stage="aggregating",
                progress=progress,
                message=f"Aggregated comparables for '{field_name}'.",
                meta={"field_name": field_name, "completed_fields": index + 1, "total_fields": total_fields},
            )

        external_packets: list[ExternalResearchResult] = []
        for index, field_name in enumerate(resolved_target_fields):
            external_packets.append(
                self.browsing_agent.research(
                project_profile,
                self._build_research_question(
                    project_profile,
                    field_name,
                    estimate_hints.get(field_name),
                ),
            ))
            progress = int(50 + ((index + 1) / total_fields) * 25)
            self._emit_progress(
                progress_callback,
                stage="browsing",
                progress=progress,
                message=f"Completed external browsing for '{field_name}'.",
                meta={"field_name": field_name, "completed_fields": index + 1, "total_fields": total_fields},
            )
        self._emit_progress(
            progress_callback,
            stage="synthesizing",
            progress=80,
            message="Synthesizing comparable and external evidence.",
        )
        field_evidence_packets = self._build_field_evidence_packets(
            resolved_target_fields,
            comparable_packets,
            external_packets,
            estimate_hints,
        )

        self._emit_progress(
            progress_callback,
            stage="thinking",
            progress=88,
            message="Final reasoning pass to generate estimates.",
        )
        result = self.chain.invoke(
            {
                "questionnaire": json.dumps(questionnaire, indent=2, default=str),
                "project_profile": project_profile.model_dump_json(indent=2),
                "target_fields": json.dumps(resolved_target_fields, indent=2),
                "field_evidence_packets": json.dumps(
                    field_evidence_packets,
                    indent=2,
                    default=str,
                ),
                "comparable_projects": json.dumps(
                    [packet.model_dump() for packet in comparable_packets],
                    indent=2,
                    default=str,
                ),
                "external_research": json.dumps(
                    [packet.model_dump() for packet in external_packets],
                    indent=2,
                    default=str,
                ),
                "best_practices": self.best_practices,
            }
        )
        self._emit_progress(
            progress_callback,
            stage="complete",
            progress=100,
            message="Estimation complete.",
            meta={"estimate_count": len(result.estimates)},
        )
        return result

    @staticmethod
    def _emit_progress(
        callback: Callable[[dict[str, Any]], None] | None,
        *,
        stage: str,
        progress: int,
        message: str,
        meta: dict[str, Any] | None = None,
    ) -> None:
        if callback is None:
            return
        payload: dict[str, Any] = {
            "stage": stage,
            "progress": max(0, min(progress, 100)),
            "message": message,
        }
        if meta:
            payload["meta"] = meta
        callback(
            stage=payload["stage"],
            progress=payload["progress"],
            message=payload["message"],
            meta=payload.get("meta"),
        )

    @staticmethod
    def _infer_missing_fields(
        questionnaire: dict[str, object],
        project_profile: ProjectProfile,
    ) -> list[str]:
        inferred = [
            field_name
            for field_name, value in questionnaire.items()
            if value in (None, "", "unknown", "Unknown", "n/a", "N/A")
        ]
        if inferred:
            return inferred
        return project_profile.missing_fields

    @staticmethod
    def _build_research_question(
        project_profile: ProjectProfile,
        field_name: str,
        estimate_hint: EstimateHint | None,
    ) -> str:
        hint_text = ""
        if estimate_hint:
            bounds = estimate_hint.to_bounds()
            if bounds:
                hint_text = (
                    f" The current analyst estimate hint is between {bounds[0]} and {bounds[1]}; "
                    "prioritize external sources that benchmark this range."
                )
        return (
            f"What external benchmarks, frameworks, or market references can help estimate "
            f"'{field_name}' for a {project_profile.subsector or project_profile.sector or 'blue finance'} "
            f"project in {project_profile.geography or 'the relevant geography'} using "
            f"{project_profile.instrument_type or 'the relevant financing instrument'}?"
            f"{hint_text}"
        )

    @staticmethod
    def _profile_filters(project_profile: ProjectProfile) -> dict[str, str]:
        filters: dict[str, str] = {}
        if project_profile.sector:
            filters["sector"] = project_profile.sector
        if project_profile.subsector:
            filters["subsector"] = project_profile.subsector
        if project_profile.geography:
            filters["geography"] = project_profile.geography
        if project_profile.instrument_type:
            filters["instrument_type"] = project_profile.instrument_type
        return filters

    @staticmethod
    def _parse_estimate_hints(questionnaire: dict[str, object]) -> dict[str, EstimateHint]:
        hints: dict[str, EstimateHint] = {}
        raw_hints = questionnaire.get("estimate_hints")
        if isinstance(raw_hints, dict):
            for field_name, payload in raw_hints.items():
                parsed = EstimationOrchestrator._coerce_hint(payload)
                if parsed:
                    hints[str(field_name)] = parsed
        for key, payload in questionnaire.items():
            if not key.endswith("_estimate_hint"):
                continue
            field_name = key[: -len("_estimate_hint")]
            parsed = EstimationOrchestrator._coerce_hint(payload)
            if parsed:
                hints[field_name] = parsed
        return hints

    @staticmethod
    def _coerce_hint(payload: object) -> EstimateHint | None:
        if isinstance(payload, (int, float)):
            return EstimateHint(value=float(payload))
        if isinstance(payload, str):
            parsed = EstimationOrchestrator._to_float(payload)
            if parsed is None:
                return None
            return EstimateHint(value=parsed)
        if not isinstance(payload, dict):
            return None
        value = EstimationOrchestrator._to_float(payload.get("value"))
        low = EstimationOrchestrator._to_float(payload.get("low"))
        high = EstimationOrchestrator._to_float(payload.get("high"))
        tolerance = EstimationOrchestrator._to_float(payload.get("tolerance_ratio"))
        if value is None and (low is None or high is None):
            return None
        return EstimateHint(
            value=value,
            low=low,
            high=high,
            tolerance_ratio=tolerance if tolerance is not None else 0.2,
        )

    @staticmethod
    def _to_float(value: object) -> float | None:
        if isinstance(value, (int, float)):
            return float(value)
        if not isinstance(value, str):
            return None
        candidate = value.strip().replace(",", "")
        if not candidate:
            return None
        try:
            return float(candidate)
        except ValueError:
            return None

    def _build_field_evidence_packets(
        self,
        target_fields: Sequence[str],
        comparable_packets: Sequence[ComparableProjectSet],
        external_packets: Sequence[ExternalResearchResult],
        estimate_hints: dict[str, EstimateHint],
    ) -> list[dict[str, object]]:
        packets: list[dict[str, object]] = []
        for index, field_name in enumerate(target_fields):
            packets.append(
                {
                    "field_name": field_name,
                    "estimate_hint": (
                        asdict(estimate_hints[field_name])
                        if field_name in estimate_hints
                        else None
                    ),
                    "best_practices_excerpt": self._best_practices_excerpt(field_name),
                    "comparable_projects": comparable_packets[index].model_dump(),
                    "external_research": external_packets[index].model_dump(),
                }
            )
        return packets

    def _best_practices_excerpt(self, field_name: str, max_lines: int = 10) -> str:
        field_tokens = {token.lower() for token in field_name.replace("_", " ").split()}
        selected_lines: list[str] = []
        for line in self.best_practices.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            normalized = stripped.lower()
            if any(token in normalized for token in field_tokens):
                selected_lines.append(stripped)
            if len(selected_lines) >= max_lines:
                break
        if selected_lines:
            return "\n".join(selected_lines)
        return self.best_practices[:1500]
