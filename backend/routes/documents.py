import os
from fastapi import APIRouter, HTTPException
from services.vector_store import delete_document_vectors
from routes.upload import documents_registry

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("")
def get_documents():
    return {
        "documents": list(documents_registry.values())
    }


@router.delete("/{document_id}")
def delete_document(document_id: str):
    document = documents_registry.get(document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        delete_document_vectors(document_id)

        file_path = document.get("file_path")
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        del documents_registry[document_id]

        return {
            "message": "Document deleted successfully",
            "document_id": document_id
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(error)}"
        )