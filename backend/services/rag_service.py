import os
from dotenv import load_dotenv
from groq import Groq

from services.embeddings import generate_embedding
from services.vector_store import search_similar_chunks

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def build_context(sources):
    context_blocks = []

    for index, source in enumerate(sources, start=1):
        context_blocks.append(
            f"""
SOURCE {index}

Page: {source.get('page')}
Section: {source.get('section_title')}

Text:
{source.get('text')}
"""
        )

    return "\n".join(context_blocks)


def answer_question(document_id: str, question: str):
    question_embedding = generate_embedding(question)

    sources = search_similar_chunks(
        document_id=document_id,
        question_embedding=question_embedding,
        top_k=5
    )

    if not sources:
        return {
            "answer": "I could not find that information in the uploaded document.",
            "sources": []
        }

    context = build_context(sources)

    system_prompt = """
You are DocuMind AI.

You MUST answer ONLY from the provided context.

Rules:
- Do NOT hallucinate
- Do NOT guess
- If the answer is not found, say:
'I could not find that information in the uploaded document.'
"""

    user_prompt = f"""
Question:
{question}

Context:
{context}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.1
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "sources": sources
    }