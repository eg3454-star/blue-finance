from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, Sequence

from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.vectorstores import InMemoryVectorStore


SUPPORTED_EXTENSIONS = {".md", ".txt", ".json", ".pdf"}


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
        self.vector_store = InMemoryVectorStore(embeddings)

    @classmethod
    def from_documents(
        cls,
        documents: Sequence[Document],
        embeddings: Embeddings,
    ) -> "ProjectVectorIndex":
        index = cls(embeddings)
        if documents:
            index.vector_store.add_documents(list(documents))
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
        if dump_path.exists():
            index = cls(embeddings)
            index.vector_store = InMemoryVectorStore.load(str(dump_path), embeddings)
            return index
        return cls.from_paths(
            embeddings=embeddings,
            documents_dir=documents_dir,
            reference_projects_dir=reference_projects_dir,
        )

    def dump(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self.vector_store.dump(str(path))

    def add_documents(self, documents: Sequence[Document]) -> None:
        if documents:
            self.vector_store.add_documents(list(documents))

    def similarity_search(
        self,
        query: str,
        *,
        k: int = 4,
        corpus: str | None = None,
    ) -> list[Document]:
        raw_documents = self.vector_store.max_marginal_relevance_search(
            query,
            k=max(k * 3, 8),
            fetch_k=max(k * 5, 20),
        )
        if corpus is None:
            return raw_documents[:k]
        filtered = [
            document
            for document in raw_documents
            if document.metadata.get("corpus") == corpus
        ]
        return filtered[:k]
