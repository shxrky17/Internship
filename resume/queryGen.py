from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class JobRequest(BaseModel):
    title: str
    company: str
    location: str
    skills: List[str]

@app.post("/generate-query")
def generate_query(job: JobRequest):
    query = f"{job.title} at {job.company} in {job.location} with skills {' '.join(job.skills)}"
    return {"generatedQuery": query}