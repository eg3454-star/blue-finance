from __future__ import annotations

from pathlib import Path

from .config import Settings


def load_prompt(prompt_file: str, prompts_dir: Path | None = None) -> str:
    base_dir = prompts_dir or Settings().prompts_dir
    prompt_path = base_dir / prompt_file
    return prompt_path.read_text(encoding="utf-8").strip()
