from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from services.rag_service import answer_question

router = APIRouter(prefix="/ask", tags=["Ask"])


class AskRequest(BaseModel):
    document_id: str
    question: str


@router.post("")
def ask_document(request: AskRequest):
    try:
        if not request.document_id:
            raise HTTPException(status_code=400, detail="document_id is required.")

        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty.")

        result = answer_question(
            document_id=request.document_id,
            question=request.question
        )

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to answer question: {str(error)}"
        )