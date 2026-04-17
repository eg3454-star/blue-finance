from __future__ import annotations

import json
from collections.abc import Sequence

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate

from ..config import Settings
from ..models import ProjectProfile
from ..prompts import load_prompt
from .base import build_chat_model, render_documents


class DocumentParserAgent:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or Settings()
        self.llm = build_chat_model(self.settings)
        system_prompt = load_prompt("document_parser_system.txt", self.settings.prompts_dir)
        self.chain = (
            ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    (
                        "human",
                        "Questionnaire draft:\n{questionnaire}\n\n"
                        "Project document context:\n{document_context}",
                    ),
                ]
            )
            | self.llm.with_structured_output(ProjectProfile)
        )

    def parse(
        self,
        questionnaire: dict[str, object],
        documents: Sequence[Document],
    ) -> ProjectProfile:
        return self.chain.invoke(
            {
                "questionnaire": json.dumps(questionnaire, indent=2, default=str),
                "document_context": render_documents(documents),
            }
        )
