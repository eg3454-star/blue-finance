from __future__ import annotations

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from blue_finance.agents.base import build_embeddings
from blue_finance.config import Settings
from blue_finance.document_store import ProjectVectorIndex


def main() -> None:
    settings = Settings()
    embeddings = build_embeddings(settings)
    vector_index = ProjectVectorIndex.from_paths(
        embeddings=embeddings,
        documents_dir=settings.documents_dir,
        reference_projects_dir=settings.reference_projects_dir,
    )
    vector_index.dump(settings.faiss_index_dir)
    print(f"FAISS index written to {settings.faiss_index_dir}")


if __name__ == "__main__":
    main()
