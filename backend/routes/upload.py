import os
import shutil
from uuid import uuid4
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv

from services.document_loader import extract_text
from services.chunker import chunk_document
from services.embeddings import generate_embeddings
from services.vector_store import add_chunks_to_vector_store

load_dotenv()

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

documents_registry = {}


@router.post("")
async def upload_document(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")  # DEBUG
    
    allowed_extensions = [".pdf", ".docx", ".txt"]
    extension = Path(file.filename).suffix.lower()
    
    print(f"File extension: {extension}")  # DEBUG

    if extension not in allowed_extensions:
        print(f"Extension {extension} not allowed")  # DEBUG
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only PDF, DOCX, and TXT files are allowed."
        )

    document_id = f"doc_{uuid4().hex}"
    saved_filename = f"{document_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"File saved to: {file_path}")  # DEBUG

        extracted_pages = extract_text(file_path)
        print(f"Extracted pages: {len(extracted_pages) if extracted_pages else 0}")  # DEBUG

        chunks = chunk_document(
            document_id=document_id,
            extracted_pages=extracted_pages
        )
        print(f"Created chunks: {len(chunks) if chunks else 0}")  # DEBUG

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the uploaded document."
            )

        texts = [chunk["text"] for chunk in chunks]
        embeddings = generate_embeddings(texts)
        print(f"Generated embeddings: {len(embeddings)}")  # DEBUG

        add_chunks_to_vector_store(chunks, embeddings)
        print("Added to vector store")  # DEBUG

        documents_registry[document_id] = {
            "document_id": document_id,
            "name": file.filename,
            "file_type": extension.replace(".", "").upper(),
            "chunks_created": len(chunks),
            "status": "Indexed Successfully",
            "upload_timestamp": datetime.utcnow().isoformat(),
            "file_path": file_path
        }

        return {
            "message": "Document uploaded and indexed successfully",
            "document_id": document_id,
            "name": file.filename,
            "file_type": extension.replace(".", "").upper(),
            "chunks_created": len(chunks),
            "status": "Indexed Successfully",
            "upload_timestamp": documents_registry[document_id]["upload_timestamp"]
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Error: {str(error)}")  # DEBUG
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(error)}"
        )