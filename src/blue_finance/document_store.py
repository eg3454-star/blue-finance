from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Callable, Sequence

from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_community.vectorstores import FAISS


SUPPORTED_EXTENSIONS = {".md", ".txt", ".json", ".pdf"}
NUMERIC_PATTERN = re.compile(r"-?\d+(?:,\d{3})*(?:\.\d+)?")


def _iter_supported_files(root: Path) -> list[Path]:
    if not root.exists():
        return []
    return [
        path
        for path in root.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    ]


def _load_text_document(path: Path, corpus_name: str) -> list[Document]:
    text = path.read_text(encoding="utf-8")
    return [
        Document(
            page_content=text,
            metadata={
                "source": str(path),
                "file_name": path.name,
                "project_name": path.stem,
                "corpus": corpus_name,
                "extension": path.suffix.lower(),
            },
        )
    ]


def _load_json_document(path: Path, corpus_name: str) -> list[Document]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    text = json.dumps(payload, indent=2, ensure_ascii=True)
    metadata = {
        "source": str(path),
        "file_name": path.name,
        "project_name": path.stem,
        "corpus": corpus_name,
        "extension": path.suffix.lower(),
    }
    if isinstance(payload, dict):
        metadata.update(_extract_case_metadata(payload))
    return [
        Document(
            page_content=text,
            metadata=metadata,
        )
    ]


def _load_pdf_document(path: Path, corpus_name: str) -> list[Document]:
    from langchain_community.document_loaders import PyPDFLoader

    loader = PyPDFLoader(str(path))
    documents = loader.load()
    for index, document in enumerate(documents, start=1):
        document.metadata.update(
            {
                "source": str(path),
                "file_name": path.name,
                "project_name": path.stem,
                "corpus": corpus_name,
                "extension": path.suffix.lower(),
                "page_number": index,
            }
        )
    return documents


def load_corpus(root: Path, corpus_name: str) -> list[Document]:
    documents: list[Document] = []
    for path in _iter_supported_files(root):
        suffix = path.suffix.lower()
        if suffix in {".md", ".txt"}:
            documents.extend(_load_text_document(path, corpus_name))
        elif suffix == ".json":
            documents.extend(_load_json_document(path, corpus_name))
        elif suffix == ".pdf":
            documents.extend(_load_pdf_document(path, corpus_name))
    return documents


class ProjectVectorIndex:
    def __init__(self, embeddings: Embeddings) -> None:
        self.embeddings = embeddings
        self.vector_store: FAISS | None = None

    @classmethod
    def from_documents(
        cls,
        documents: Sequence[Document],
        embeddings: Embeddings,
    ) -> "ProjectVectorIndex":
        index = cls(embeddings)
        if documents:
            index.vector_store = FAISS.from_documents(list(documents), embeddings)
        return index

    @classmethod
    def from_paths(
        cls,
        embeddings: Embeddings,
        documents_dir: Path,
        reference_projects_dir: Path,
    ) -> "ProjectVectorIndex":
        project_documents = load_corpus(documents_dir, corpus_name="documents")
        reference_documents = load_corpus(
            reference_projects_dir,
            corpus_name="reference_projects",
        )
        return cls.from_documents(
            [*project_documents, *reference_documents],
            embeddings=embeddings,
        )

    @classmethod
    def load_or_build(
        cls,
        embeddings: Embeddings,
        dump_path: Path,
        documents_dir: Path,
        reference_projects_dir: Path,
    ) -> "ProjectVectorIndex":
        faiss_dir = _resolve_faiss_dir(dump_path)
        if _faiss_files_exist(faiss_dir):
            index = cls(embeddings)
            index.vector_store = FAISS.load_local(
                str(faiss_dir),
                embeddings,
                allow_dangerous_deserialization=True,
            )
            return index
        return cls.from_paths(
            embeddings=embeddings,
            documents_dir=documents_dir,
            reference_projects_dir=reference_projects_dir,
        )

    def dump(self, path: Path) -> None:
        if self.vector_store is None:
            return
        index_dir = _resolve_faiss_dir(path)
        index_dir.mkdir(parents=True, exist_ok=True)
        self.vector_store.save_local(str(index_dir))

    def add_documents(self, documents: Sequence[Document]) -> None:
        if not documents:
            return
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(list(documents), self.embeddings)
        else:
            self.vector_store.add_documents(list(documents))

    def similarity_search(
        self,
        query: str,
        *,
        k: int = 4,
        corpus: str | None = None,
        metadata_filter: dict[str, Any] | None = None,
        metadata_predicate: Callable[[dict[str, Any]], bool] | None = None,
    ) -> list[Document]:
        if self.vector_store is None:
            return []
        search_filter = _compose_filter(corpus, metadata_filter, metadata_predicate)
        raw_documents = self.vector_store.max_marginal_relevance_search(
            query,
            k=max(k * 3, 8),
            fetch_k=max(k * 5, 20),
            filter=search_filter,
        )
        return raw_documents[:k]

    def similarity_search_with_scores(
        self,
        query: str,
        *,
        k: int = 4,
        corpus: str | None = None,
        metadata_filter: dict[str, Any] | None = None,
        metadata_predicate: Callable[[dict[str, Any]], bool] | None = None,
    ) -> list[tuple[Document, float]]:
        if self.vector_store is None:
            return []
        search_filter = _compose_filter(corpus, metadata_filter, metadata_predicate)
        raw_pairs = self.vector_store.similarity_search_with_score(
            query,
            k=max(k * 3, 8),
            filter=search_filter,
        )
        return raw_pairs[:k]


def _extract_case_metadata(payload: dict[str, Any]) -> dict[str, str]:
    metadata: dict[str, str] = {}
    for key in ("project_name", "sector", "subsector", "geography", "instrument_type"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            metadata[key] = value.strip()

    estimate_lookup: dict[str, float] = {}
    known_estimates = payload.get("known_estimates")
    if isinstance(known_estimates, dict):
        for field_name, raw_value in known_estimates.items():
            numeric_value = _coerce_numeric(raw_value)
            if numeric_value is not None:
                estimate_lookup[str(field_name)] = numeric_value

    estimates = payload.get("estimates")
    if isinstance(estimates, list):
        for record in estimates:
            if not isinstance(record, dict):
                continue
            field_name = record.get("field_name")
            if not isinstance(field_name, str) or not field_name.strip():
                continue
            numeric_value = (
                _coerce_numeric(record.get("estimated_value"))
                or _coerce_numeric(record.get("range_mid"))
                or _coerce_numeric(record.get("range_low"))
                or _coerce_numeric(record.get("range_high"))
            )
            if numeric_value is not None:
                estimate_lookup[field_name.strip()] = numeric_value

    if estimate_lookup:
        metadata["estimate_lookup"] = json.dumps(estimate_lookup, ensure_ascii=True)
        metadata["estimate_fields"] = ",".join(sorted(estimate_lookup))
    return metadata


def parse_estimate_from_metadata(metadata: dict[str, Any], field_name: str) -> float | None:
    lookup_json = metadata.get("estimate_lookup")
    if not isinstance(lookup_json, str):
        return None
    try:
        lookup = json.loads(lookup_json)
    except json.JSONDecodeError:
        return None
    if not isinstance(lookup, dict):
        return None
    raw_value = lookup.get(field_name)
    return _coerce_numeric(raw_value)


def _coerce_numeric(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    if not isinstance(value, str):
        return None
    candidate = value.strip()
    if not candidate:
        return None
    try:
        return float(candidate.replace(",", ""))
    except ValueError:
        match = NUMERIC_PATTERN.search(candidate)
        if not match:
            return None
        return float(match.group(0).replace(",", ""))


def _compose_filter(
    corpus: str | None,
    metadata_filter: dict[str, Any] | None,
    metadata_predicate: Callable[[dict[str, Any]], bool] | None,
) -> Callable[[dict[str, Any]], bool] | dict[str, Any] | None:
    if metadata_predicate is None and corpus is None:
        return metadata_filter

    def _wrapped(metadata: dict[str, Any]) -> bool:
        if corpus is not None and metadata.get("corpus") != corpus:
            return False
        if metadata_filter is not None:
            for key, expected in metadata_filter.items():
                if metadata.get(key) != expected:
                    return False
        if metadata_predicate is not None and not metadata_predicate(metadata):
            return False
        return True

    return _wrapped


def _resolve_faiss_dir(path: Path) -> Path:
    if path.suffix:
        return path.parent / f"{path.stem}_faiss"
    return path


def _faiss_files_exist(index_dir: Path) -> bool:
    return (index_dir / "index.faiss").exists() and (index_dir / "index.pkl").exists()
