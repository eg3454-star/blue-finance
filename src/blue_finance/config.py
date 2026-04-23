from __future__ import annotations

import os
from pathlib import Path

from pydantic import BaseModel, Field


ROOT_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = ROOT_DIR / ".env"


def _read_dotenv(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, raw_value = line.split("=", 1)
        key = key.strip()
        value = raw_value.strip()
        if value and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        if key:
            values[key] = value
    return values


_DOTENV_VALUES = _read_dotenv(ENV_FILE)


def _env(name: str, default: str | None = None) -> str | None:
    if name in _DOTENV_VALUES and _DOTENV_VALUES[name] != "":
        return _DOTENV_VALUES[name]
    env_value = os.getenv(name)
    if env_value not in (None, ""):
        return env_value
    return default


class Settings(BaseModel):
    root_dir: Path = ROOT_DIR
    data_dir: Path = ROOT_DIR / "data"
    documents_dir: Path = ROOT_DIR / "data" / "documents"
    reference_projects_dir: Path = ROOT_DIR / "data" / "reference_projects"
    prompts_dir: Path = ROOT_DIR / "prompts"
    memory_dir: Path = ROOT_DIR / "memory"
    index_dump_path: Path = ROOT_DIR / "data" / "indexes" / "project_index.json"
    faiss_index_dir: Path = ROOT_DIR / "data" / "indexes" / "project_index_faiss"

    llm_provider: str = Field(
        default_factory=lambda: (_env("LLM_PROVIDER", "openai") or "openai")
    )
    llm_model: str | None = Field(
        default_factory=lambda: _env("LLM_MODEL")
    )

    openai_model: str = Field(
        default_factory=lambda: _env("OPENAI_MODEL", "gpt-4.1-mini") or "gpt-4.1-mini"
    )
    openai_api_key: str | None = Field(
        default_factory=lambda: _env("OPENAI_API_KEY")
    )
    anthropic_model: str = Field(
        default_factory=lambda: _env("ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")
        or "claude-3-5-sonnet-latest"
    )
    anthropic_api_key: str | None = Field(
        default_factory=lambda: _env("ANTHROPIC_API_KEY")
    )
    gemini_model: str = Field(
        default_factory=lambda: _env("GEMINI_MODEL", "gemini-2.0-flash")
        or "gemini-2.0-flash"
    )
    google_api_key: str | None = Field(
        default_factory=lambda: _env("GOOGLE_API_KEY") or _env("GEMINI_API_KEY")
    )
    embedding_model: str = Field(
        default_factory=lambda: _env("OPENAI_EMBEDDING_MODEL", "text-embedding-3-large")
        or "text-embedding-3-large"
    )
    temperature: float = Field(
        default_factory=lambda: float(_env("OPENAI_TEMPERATURE", "0") or "0")
    )
    tavily_api_key: str | None = Field(
        default_factory=lambda: _env("TAVILY_API_KEY")
    )
    browsing_search_provider: str = Field(
        default_factory=lambda: (_env("BROWSING_SEARCH_PROVIDER", "tavily") or "tavily")
    )
    comparable_max_distance: float = Field(
        default_factory=lambda: float(_env("COMPARABLE_MAX_DISTANCE", "1.2") or "1.2")
    )
