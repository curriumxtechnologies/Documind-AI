import os
import chromadb
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")

client = chromadb.PersistentClient(path=CHROMA_PATH)

collection = client.get_or_create_collection(
    name="documind_documents",
    metadata={"description": "DocuMind AI document chunks"}
)


def add_chunks_to_vector_store(chunks: list, embeddings: list):
    ids = []
    documents = []
    metadatas = []

    for chunk in chunks:
        ids.append(chunk["chunk_id"])
        documents.append(chunk["text"])
        metadatas.append({
            "document_id": chunk["document_id"],
            "page": chunk["page"] or 0,
            "section_title": chunk["section_title"],
            "chunk_id": chunk["chunk_id"]
        })

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )


def search_similar_chunks(document_id: str, question_embedding: list, top_k: int = 5):
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        where={"document_id": document_id}
    )

    sources = []

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for text, metadata, distance in zip(documents, metadatas, distances):
        sources.append({
            "text": text,
            "page": metadata.get("page"),
            "section_title": metadata.get("section_title"),
            "chunk_id": metadata.get("chunk_id"),
            "score": distance
        })

    return sources


def delete_document_vectors(document_id: str):
    collection.delete(where={"document_id": document_id})