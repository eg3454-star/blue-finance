from __future__ import annotations

import json
from collections.abc import Sequence

from langchain_core.documents import Document
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from ..config import Settings


def _normalized_provider(raw_provider: str) -> str:
    provider = raw_provider.strip().lower()
    aliases = {
        "anthropic": "anthropic",
        "claude": "anthropic",
        "gemini": "gemini",
        "google": "gemini",
        "google_genai": "gemini",
        "google-genai": "gemini",
        "openai": "openai",
    }
    return aliases.get(provider, provider)


def _resolve_provider_model(settings: Settings, provider: str) -> str:
    if settings.llm_model:
        return settings.llm_model
    if provider == "openai":
        return settings.openai_model
    if provider == "anthropic":
        return settings.anthropic_model
    if provider == "gemini":
        return settings.gemini_model
    raise RuntimeError(
        f"Unsupported LLM_PROVIDER '{settings.llm_provider}'. "
        "Use one of: openai, claude, anthropic, gemini, google."
    )


def build_chat_model(settings: Settings) -> BaseChatModel:
    provider = _normalized_provider(settings.llm_provider)
    model_name = _resolve_provider_model(settings, provider)

    if provider == "openai":
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required when LLM_PROVIDER=openai.")
        return ChatOpenAI(
            model=model_name,
            temperature=settings.temperature,
            api_key=settings.openai_api_key,
        )

    if provider == "anthropic":
        if not settings.anthropic_api_key:
            raise RuntimeError("ANTHROPIC_API_KEY is required when LLM_PROVIDER=claude.")
        try:
            from langchain_anthropic import ChatAnthropic
        except ImportError as exc:
            raise RuntimeError(
                "langchain-anthropic is required for LLM_PROVIDER=claude/anthropic. "
                "Install with `pip install langchain-anthropic`."
            ) from exc
        return ChatAnthropic(
            model=model_name,
            temperature=settings.temperature,
            api_key=settings.anthropic_api_key,
        )

    if provider == "gemini":
        if not settings.google_api_key:
            raise RuntimeError("GOOGLE_API_KEY is required when LLM_PROVIDER=gemini.")
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
        except ImportError as exc:
            raise RuntimeError(
                "langchain-google-genai is required for LLM_PROVIDER=gemini/google. "
                "Install with `pip install langchain-google-genai`."
            ) from exc
        return ChatGoogleGenerativeAI(
            model=model_name,
            temperature=settings.temperature,
            google_api_key=settings.google_api_key,
        )

    raise RuntimeError(
        f"Unsupported LLM_PROVIDER '{settings.llm_provider}'. "
        "Use one of: openai, claude, anthropic, gemini, google."
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
