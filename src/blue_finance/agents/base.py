from __future__ import annotations

import json
from collections.abc import Sequence

from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from ..config import Settings


def build_chat_model(settings: Settings) -> ChatOpenAI:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required to build the chat model.")
    return ChatOpenAI(
        model=settings.openai_model,
        temperature=settings.temperature,
        api_key=settings.openai_api_key,
    )


def build_embeddings(settings: Settings) -> OpenAIEmbeddings:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required to build embeddings.")
    return OpenAIEmbeddings(
        model=settings.embedding_model,
        api_key=settings.openai_api_key,
    )


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
