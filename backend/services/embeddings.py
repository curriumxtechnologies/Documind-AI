import hashlib
import math
import re
import numpy as np

EMBEDDING_DIMENSION = 384


def tokenize(text: str):
    return re.findall(r"\b[a-zA-Z0-9]+\b", text.lower())


def generate_embedding(text: str):
    """
    Lightweight free embedding function.

    This avoids OpenAI, Torch, and Sentence Transformers.
    It creates a fixed-size vector using hashed word frequencies.
    Good enough for MVP search on Render free tier.
    """
    vector = np.zeros(EMBEDDING_DIMENSION, dtype=np.float32)
    tokens = tokenize(text)

    if not tokens:
        return vector.tolist()

    for token in tokens:
        hashed = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
        index = hashed % EMBEDDING_DIMENSION
        vector[index] += 1.0

    norm = math.sqrt(float(np.dot(vector, vector)))

    if norm > 0:
        vector = vector / norm

    return vector.tolist()


def generate_embeddings(texts: list[str]):
    return [generate_embedding(text) for text in texts]