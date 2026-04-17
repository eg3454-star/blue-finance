from __future__ import annotations

import os
from pathlib import Path

from pydantic import BaseModel, Field


ROOT_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseModel):
    root_dir: Path = ROOT_DIR
    data_dir: Path = ROOT_DIR / "data"
    documents_dir: Path = ROOT_DIR / "data" / "documents"
    reference_projects_dir: Path = ROOT_DIR / "data" / "reference_projects"
    prompts_dir: Path = ROOT_DIR / "prompts"
    memory_dir: Path = ROOT_DIR / "memory"
    index_dump_path: Path = ROOT_DIR / "data" / "indexes" / "project_index.json"

    openai_model: str = Field(
        default_factory=lambda: os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    )
    embedding_model: str = Field(
        default_factory=lambda: os.getenv(
            "OPENAI_EMBEDDING_MODEL",
            "text-embedding-3-large",
        )
    )
    temperature: float = Field(
        default_factory=lambda: float(os.getenv("OPENAI_TEMPERATURE", "0"))
    )
    tavily_api_key: str | None = Field(
        default_factory=lambda: os.getenv("TAVILY_API_KEY")
    )
