# DocuMind AI

**Tagline:** Ask questions. Get answers from your documents.

DocuMind AI is an AI-powered document assistant that allows users to upload technical documents and ask intelligent questions from them.

The system uses Retrieval-Augmented Generation, also called RAG, to retrieve relevant document sections and generate accurate answers grounded in uploaded content.

---

## Features

- Upload PDF, DOCX, and TXT documents
- Extract readable document text
- Split documents into overlapping chunks
- Generate OpenAI embeddings
- Store embeddings in ChromaDB
- Ask questions from uploaded documents
- Retrieve relevant chunks with semantic search
- Generate grounded AI answers
- Show source snippets under every answer
- Modern React SaaS-style interface
- Mobile responsive UI

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Axios
- Lucide React Icons

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- ChromaDB
- OpenAI API
- pypdf
- python-docx
- python-multipart
- python-dotenv

---

## Architecture

The system works in 5 main stages:

1. User uploads a document
2. Backend extracts text from the document
3. Text is split into chunks
4. Chunks are embedded and stored in ChromaDB
5. User asks a question and the system retrieves relevant chunks before generating an answer

---

## Backend Setup

Move into the backend folder:

```bash
cd backend
```
