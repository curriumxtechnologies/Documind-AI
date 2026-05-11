import re
from uuid import uuid4


def detect_section_title(text: str):
    lines = text.split("\n")

    for line in lines[:5]:
        clean = line.strip()
        if len(clean) > 3 and len(clean) < 90:
            if clean.isupper() or re.match(r"^\d+(\.\d+)*\s+", clean):
                return clean

    return "Document Section"


def split_words_with_overlap(words, chunk_size=750, overlap=120):
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunks.append(" ".join(chunk_words))

        if end >= len(words):
            break

        start = end - overlap

    return chunks


def chunk_document(document_id: str, extracted_pages: list):
    all_chunks = []

    for page_data in extracted_pages:
        page = page_data.get("page")
        text = page_data.get("text", "")
        words = text.split()

        if not words:
            continue

        section_title = detect_section_title(text)
        chunks = split_words_with_overlap(words)

        for chunk_text in chunks:
            chunk_id = f"chunk_{uuid4().hex}"

            all_chunks.append({
                "chunk_id": chunk_id,
                "document_id": document_id,
                "page": page,
                "section_title": section_title,
                "text": chunk_text
            })

    return all_chunks