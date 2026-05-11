from pathlib import Path
from pypdf import PdfReader
from docx import Document


def extract_pdf_text(file_path: str):
    reader = PdfReader(file_path)
    pages = []

    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages.append({
                "page": index + 1,
                "text": text.strip()
            })

    return pages


def extract_docx_text(file_path: str):
    document = Document(file_path)
    text = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text.append(paragraph.text.strip())

    return [{
        "page": None,
        "text": "\n".join(text)
    }]


def extract_txt_text(file_path: str):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        text = file.read()

    return [{
        "page": None,
        "text": text.strip()
    }]


def extract_text(file_path: str):
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    if extension == ".docx":
        return extract_docx_text(file_path)

    if extension == ".txt":
        return extract_txt_text(file_path)

    raise ValueError("Unsupported file type. Only PDF, DOCX, and TXT files are allowed.")