from __future__ import annotations

from langchain_core.prompts import ChatPromptTemplate

from ..config import Settings
from ..document_store import ProjectVectorIndex
from ..models import ComparableProjectSet, ProjectProfile
from ..prompts import load_prompt
from .base import build_chat_model, render_documents


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
            | self.llm.with_structured_output(ComparableProjectSet)
        )

    def find_comparables(
        self,
        project_profile: ProjectProfile,
        field_name: str,
        *,
        k: int = 4,
    ) -> ComparableProjectSet:
        search_query = (
            f"Find comparable blue finance projects for field '{field_name}'. "
            f"Sector={project_profile.sector}; subsector={project_profile.subsector}; "
            f"geography={project_profile.geography}; instrument={project_profile.instrument_type}; "
            f"use_of_proceeds={project_profile.use_of_proceeds}."
        )
        documents = self.vector_index.similarity_search(
            search_query,
            k=k,
            corpus="reference_projects",
        )
        if not documents:
            return ComparableProjectSet(
                search_query=search_query,
                takeaways=["No comparable internal projects were found in the reference corpus."],
            )
        return self.chain.invoke(
            {
                "search_query": search_query,
                "project_profile": project_profile.model_dump_json(indent=2),
                "retrieved_documents": render_documents(documents),
            }
        )
