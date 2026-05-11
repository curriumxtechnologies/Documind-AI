# DocuMind AI

**Tagline:** Ask questions. Get answers from your documents.

DocuMind AI is an AI-powered document assistant that allows users to upload technical documents and ask intelligent questions from them.

The system uses Retrieval-Augmented Generation (RAG) to retrieve relevant document sections and generate accurate answers grounded in uploaded content.

---

# Features

- Upload PDF, DOCX, and TXT documents
- Extract readable text from uploaded files
- Split documents into searchable chunks
- Generate free local embeddings using Sentence Transformers
- Store embeddings in ChromaDB
- Ask questions from uploaded documents
- Retrieve relevant document chunks
- Generate grounded AI answers using Groq
- Show source snippets under every answer
- Modern React SaaS-style interface
- Responsive design for mobile, tablet, and desktop

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Axios
- Lucide React Icons

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- ChromaDB
- Groq API
- Sentence Transformers
- Torch
- pypdf
- python-docx
- python-multipart
- python-dotenv

---

# AI Setup

DocuMind AI uses a free-friendly AI setup:

| Part                | Tool                    |
| ------------------- | ----------------------- |
| Embeddings          | Sentence Transformers   |
| Embedding Model     | all-MiniLM-L6-v2        |
| Vector Database     | ChromaDB                |
| Chat Model Provider | Groq                    |
| Chat Model          | llama-3.3-70b-versatile |

This means embeddings are generated locally, so you do not need paid OpenAI credits.

---

# Folder Structure

```txt
Documind-AI/
│
├── backend/
│   ├── main.py
│   ├── runtime.txt
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/
│   │   ├── upload.py
│   │   ├── ask.py
│   │   └── documents.py
│   ├── services/
│   │   ├── document_loader.py
│   │   ├── chunker.py
│   │   ├── embeddings.py
│   │   ├── vector_store.py
│   │   └── rag_service.py
│   ├── uploads/
│   └── chroma_db/
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       └── components/
│           ├── UploadBox.jsx
│           ├── ChatBox.jsx
│           ├── AnswerCard.jsx
│           ├── SourceSnippet.jsx
│           └── Sidebar.jsx
│
└── README.md
```

---

# How The System Works

1. A user uploads a document.
2. The backend saves the uploaded file.
3. The backend extracts text from the document.
4. The extracted text is split into chunks.
5. Each chunk is converted into embeddings using Sentence Transformers.
6. The embeddings and metadata are stored in ChromaDB.
7. The user asks a question.
8. The question is also converted into an embedding.
9. ChromaDB searches for the most relevant chunks.
10. The retrieved chunks are sent to Groq as context.
11. Groq generates a grounded answer using only the retrieved document context.
12. The frontend displays the answer and source snippets.

---

# Backend Setup

Move into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

## Windows

```bash
venv\Scripts\activate
```

## Mac/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_groq_api_key_here
CHROMA_PATH=./chroma_db
UPLOAD_DIR=./uploads
```

Run the backend:

```bash
uvicorn main:app --reload
```

The backend will run on:

```txt
http://localhost:8000
```

---

# Backend Requirements

Your `backend/requirements.txt` should contain:

```txt
fastapi
uvicorn
python-multipart
pypdf
python-docx
chromadb
python-dotenv
pydantic
groq
sentence-transformers
torch
```

---

# Python Version For Render

Create this file inside the backend folder:

```txt
backend/runtime.txt
```

Add:

```txt
python-3.11.9
```

This forces Render to use Python 3.11 instead of Python 3.14.

---

# Frontend Setup

Move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

The frontend will run on a Vite local URL like:

```txt
http://localhost:5173
```

If port 5173 is busy, Vite may use another port like:

```txt
http://localhost:5175
```

That is normal.

---

# API Endpoints

## GET /

Checks if the backend is running.

Example response:

```json
{
  "message": "DocuMind AI backend is running",
  "tagline": "Ask questions. Get answers from your documents."
}
```

---

## POST /upload

Uploads, extracts, chunks, embeds, and indexes a document.

Supported files:

- PDF
- DOCX
- TXT

Example response:

```json
{
  "message": "Document uploaded and indexed successfully",
  "document_id": "doc_123",
  "name": "API_Documentation.pdf",
  "file_type": "PDF",
  "chunks_created": 24,
  "status": "Indexed Successfully",
  "upload_timestamp": "2026-05-11T12:00:00"
}
```

---

## POST /ask

Asks a question from an uploaded document.

Example request:

```json
{
  "document_id": "doc_123",
  "question": "What is the system architecture?"
}
```

Example response:

```json
{
  "answer": "The system uses a layered architecture based on the retrieved document context.",
  "sources": [
    {
      "page": 3,
      "section_title": "System Architecture",
      "text": "The architecture consists of...",
      "chunk_id": "chunk_abc",
      "score": 0.21
    }
  ]
}
```

---

## GET /documents

Returns uploaded documents.

Example response:

```json
{
  "documents": [
    {
      "document_id": "doc_123",
      "name": "API_Documentation.pdf",
      "file_type": "PDF",
      "chunks_created": 24,
      "status": "Indexed Successfully"
    }
  ]
}
```

---

## DELETE /documents/{document_id}

Deletes a document and its vectors.

Example response:

```json
{
  "message": "Document deleted successfully",
  "document_id": "doc_123"
}
```

---

# Render Deployment

## Deploy Frontend On Render

Create a new **Static Site**.

Use these settings:

```txt
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Add this frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Optional rewrite rule:

```txt
Source Path: /*
Destination Path: /index.html
Action: Rewrite
```

---

## Deploy Backend On Render

Create a new **Web Service**.

Use these settings:

```txt
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Add these backend environment variables:

```env
GROQ_API_KEY=your_groq_api_key_here
CHROMA_PATH=./chroma_db
UPLOAD_DIR=./uploads
```

Make sure this file exists:

```txt
backend/runtime.txt
```

And contains:

```txt
python-3.11.9
```

---

# Common Errors And Fixes

## Tailwind PostCSS Error

If you see:

```txt
It looks like you're trying to use tailwindcss directly as a PostCSS plugin
```

Run:

```bash
npm install @tailwindcss/postcss
```

Then update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
```

---

## Vite Port Already In Use

If you see:

```txt
Port 5173 is in use, trying another one
```

That is normal. Open the URL Vite gives you.

Example:

```txt
http://localhost:5175
```

---

## OpenAI Quota Error

If you see:

```txt
insufficient_quota
```

That means your OpenAI API account has no paid credits.

This project now uses Groq and local Sentence Transformer embeddings instead, so OpenAI is no longer required.

---

## Backend Uses Python 3.14 On Render

If Render uses Python 3.14, create:

```txt
backend/runtime.txt
```

With:

```txt
python-3.11.9
```

Then redeploy.

---

# Future Improvements

- User authentication
- Persistent chat history
- Multi-document chat
- Cloud vector database
- Streaming AI responses
- OCR support for scanned PDFs
- Confidence scores
- Evaluation metrics
- Exact paragraph citations
- Collaborative workspaces
- Admin dashboard
- Document folders
- Team-based document access

---

# Portfolio Value

DocuMind AI demonstrates:

- RAG architecture
- Local embedding pipelines
- Vector database usage
- FastAPI backend development
- React frontend development
- SaaS-style UI design
- Source-grounded AI answers
- AI cost optimization
- Clean full-stack architecture

---

# Author

Built as a full-stack AI MVP project.

Project name:

```txt
DocuMind AI
```

Tagline:

```txt
Ask questions. Get answers from your documents.
```
