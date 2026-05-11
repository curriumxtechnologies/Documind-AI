from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    embedding = model.encode(text)
    return embedding.tolist()


def generate_embeddings(texts: list[str]):
    embeddings = model.encode(texts)
    return [embedding.tolist() for embedding in embeddings]