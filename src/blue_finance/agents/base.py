from __future__ import annotations

import json
from collections.abc import Sequence

from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from ..config import Settings


def build_chat_model(settings: Settings) -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.openai_model,
        temperature=settings.temperature,
    )


def build_embeddings(settings: Settings) -> OpenAIEmbeddings:
    return OpenAIEmbeddings(model=settings.embedding_model)


def render_documents(documents: Sequence[Document], max_characters: int = 16000) -> str:
    blocks: list[str] = []
    total = 0
    for document in documents:
        body = document.page_content.strip()
        if not body:
            continue
        header = json.dumps(document.metadata, ensure_ascii=True)
        block = f"METADATA: {header}\nCONTENT:\n{body}"
        if total + len(block) > max_characters:
            break
        blocks.append(block)
        total += len(block)
    return "\n\n---\n\n".join(blocks)
