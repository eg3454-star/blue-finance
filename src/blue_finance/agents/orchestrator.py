from __future__ import annotations

import json
from collections.abc import Sequence

from langchain_core.prompts import ChatPromptTemplate

from ..config import Settings
from ..document_store import ProjectVectorIndex, load_corpus
from ..models import EstimationOutput, ProjectProfile
from ..prompts import load_prompt
from .base import build_chat_model, build_embeddings
from .browsing_agent import BrowsingAgent
from .document_parser import DocumentParserAgent
from .query_agent import QueryAgent


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
                        "Comparable project findings:\n{comparable_projects}\n\n"
                        "External research findings:\n{external_research}\n\n"
                        "Best practices:\n{best_practices}",
                    ),
                ]
            )
            | self.llm.with_structured_output(EstimationOutput)
        )

    @classmethod
    def from_settings(cls, settings: Settings | None = None) -> "EstimationOrchestrator":
        settings = settings or Settings()
        embeddings = build_embeddings(settings)
        vector_index = ProjectVectorIndex.load_or_build(
            embeddings=embeddings,
            dump_path=settings.index_dump_path,
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
    ) -> EstimationOutput:
        project_documents = load_corpus(self.settings.documents_dir, corpus_name="documents")
        project_profile = self.document_parser.parse(questionnaire, project_documents)
        resolved_target_fields = list(target_fields or self._infer_missing_fields(questionnaire, project_profile))

        comparable_packets = [
            self.query_agent.find_comparables(project_profile, field_name)
            for field_name in resolved_target_fields
        ]

        external_packets = [
            self.browsing_agent.research(
                project_profile,
                self._build_research_question(project_profile, field_name),
            )
            for field_name in resolved_target_fields
        ]

        return self.chain.invoke(
            {
                "questionnaire": json.dumps(questionnaire, indent=2, default=str),
                "project_profile": project_profile.model_dump_json(indent=2),
                "target_fields": json.dumps(resolved_target_fields, indent=2),
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
    ) -> str:
        return (
            f"What external benchmarks, frameworks, or market references can help estimate "
            f"'{field_name}' for a {project_profile.subsector or project_profile.sector or 'blue finance'} "
            f"project in {project_profile.geography or 'the relevant geography'} using "
            f"{project_profile.instrument_type or 'the relevant financing instrument'}?"
        )
