from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.ask import router as ask_router
from routes.documents import router as documents_router

app = FastAPI(
    title="DocuMind AI API",
    description="AI-powered document assistant using RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://documindai.curriumx.online"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(ask_router)
app.include_router(documents_router)


@app.get("/")
def root():
    return {
        "message": "DocuMind AI backend is running",
        "tagline": "Ask questions. Get answers from your documents."
    }