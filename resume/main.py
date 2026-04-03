from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Job Query Generator + Pinecone Vector Store")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "quickstart")
PINECONE_NAMESPACE = os.getenv("PINECONE_NAMESPACE", "job-queries")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in .env file")

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)


model = SentenceTransformer("all-MiniLM-L6-v2")

class JobRequest(BaseModel):
    id: int
    title: str
    company: str
    location: str
    skills: List[str]


def build_query(job: JobRequest) -> str:
    return f"{job.title} at {job.company} in {job.location} with skills {' '.join(job.skills)}"


def generate_embedding(text: str) -> List[float]:
    embedding = model.encode(text)
    return embedding.tolist()


def save_to_pinecone(job: JobRequest, generated_query: str, embedding: List[float]) -> None:
    index.upsert(
        vectors=[
            {
                "id": str(job.id),
                "values": embedding,
                "metadata": {
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "skills": job.skills,
                    "generated_query": generated_query
                }
            }
        ],
        namespace=PINECONE_NAMESPACE
    )


@app.post("/generate-query")
def generate_query_and_store(job: JobRequest):
    try:
        generated_query = build_query(job)
        embedding = generate_embedding(generated_query)

        if len(embedding) != 384:
            raise ValueError(f"Expected embedding dimension 384, got {len(embedding)}")

        save_to_pinecone(job, generated_query, embedding)

        return {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "skills": job.skills,
            "generatedQuery": generated_query,
            "embeddingLength": len(embedding),
            "message": "Generated query saved to Pinecone successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/search")
def search_similar_jobs(query: str, top_k: int = 3):
    try:
        query_embedding = generate_embedding(query)

        results = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace=PINECONE_NAMESPACE
        )

        matches = []
        for match in results.get("matches", []):
            matches.append({
                "id": match.get("id"),
                "score": match.get("score"),
                "metadata": match.get("metadata", {})
            })

        return {
            "query": query,
            "top_k": top_k,
            "matches": matches
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))