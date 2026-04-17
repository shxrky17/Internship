from io import BytesIO
import json
import os
import re
import warnings
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from groq import Groq
from pdf2image import convert_from_bytes
from pinecone import Pinecone
from pydantic import BaseModel
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import pytesseract


warnings.filterwarnings("ignore", category=FutureWarning)
load_dotenv()

# -----------------------------------------------------------------------------
# App setup
# -----------------------------------------------------------------------------
app = FastAPI(title="Resume Analyzer + Job Query Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: set only if Tesseract is not in PATH
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

OUTPUT_DIR = "extracted_texts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------------------------------------------------------
# Environment variables
# -----------------------------------------------------------------------------
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "quickstart")
PINECONE_NAMESPACE = os.getenv("PINECONE_NAMESPACE", "job-queries")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in .env file")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env file")

# -----------------------------------------------------------------------------
# External clients
# -----------------------------------------------------------------------------
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
groq_client = Groq(api_key=GROQ_API_KEY)

# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class JobRequest(BaseModel):
    id: int
    title: str
    company: str
    location: str
    skills: List[str]


# -----------------------------------------------------------------------------
# Job query + Pinecone helpers
# -----------------------------------------------------------------------------
def build_query(job: JobRequest) -> str:
    skills_text = " ".join(job.skills)
    return f"{job.title} at {job.company} in {job.location} with skills {skills_text}"


def generate_embedding(text: str) -> List[float]:
    embedding = embedding_model.encode(text)
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
                    "generated_query": generated_query,
                },
            }
        ],
        namespace=PINECONE_NAMESPACE,
    )


def search_jobs_by_query(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    query_embedding = generate_embedding(query)

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        namespace=PINECONE_NAMESPACE,
    )

    matches = []
    for match in results.get("matches", []):
        matches.append(
            {
                "id": match.get("id"),
                "score": match.get("score"),
                "metadata": match.get("metadata", {}),
            }
        )

    return matches


# -----------------------------------------------------------------------------
# Resume analyzer helpers
# -----------------------------------------------------------------------------
def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\x0c", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def extract_text_from_pdf(file_like: BytesIO) -> str:
    text_parts: List[str] = []
    file_like.seek(0)
    reader = PdfReader(file_like)

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    return clean_text("\n".join(text_parts))


def extract_text_from_scanned_pdf(file_bytes: bytes) -> str:
    pages = convert_from_bytes(file_bytes)
    text_parts: List[str] = []

    for page in pages:
        page_text = pytesseract.image_to_string(page)
        if page_text:
            text_parts.append(page_text)

    return clean_text("\n".join(text_parts))


def extract_skills_from_text(text: str) -> List[str]:
    common_skills = [
        "python", "java", "c", "c++", "javascript", "typescript", "html", "css",
        "react", "node.js", "express", "spring boot", "spring", "hibernate",
        "mysql", "postgresql", "mongodb", "sql", "git", "github", "docker",
        "kubernetes", "aws", "azure", "gcp", "fastapi", "django", "flask",
        "machine learning", "deep learning", "data analysis", "pandas", "numpy",
        "opencv", "tensorflow", "pytorch", "rest api", "microservices",
        "jmeter", "loadrunner", "k6", "performance testing", "manual testing",
        "selenium", "postman", "linux", "go", "golang", "redis", "firebase",
    ]

    lower_text = text.lower()
    found_skills = {skill for skill in common_skills if skill in lower_text}
    return sorted(found_skills)


async def get_structured_resume_json(text: str) -> Dict[str, Any]:
    prompt = f"""
You are an expert resume parser.

Extract the resume information from the text below and return ONLY valid JSON.
Do not include markdown, explanation, or code fences.

Return JSON in this exact structure:

{{
  "personal_info": {{
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  }},
  "summary": "",
  "skills": {{
    "technical_skills": [],
    "tools": [],
    "frameworks": [],
    "soft_skills": []
  }},
  "education": [
    {{
      "degree": "",
      "institution": "",
      "year": "",
      "cgpa_or_percentage": ""
    }}
  ],
  "experience": [
    {{
      "job_title": "",
      "company": "",
      "duration": "",
      "description": ""
    }}
  ],
  "projects": [
    {{
      "title": "",
      "description": "",
      "technologies": []
    }}
  ],
  "certifications": [],
  "extracurricular_activities": []
}}

Resume text:
{text}
"""

    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="openai/gpt-oss-120b",
    )

    llm_text = chat_completion.choices[0].message.content.strip()
    llm_text = re.sub(r"^```json\s*", "", llm_text)
    llm_text = re.sub(r"^```\s*", "", llm_text)
    llm_text = re.sub(r"\s*```$", "", llm_text)

    try:
        return json.loads(llm_text)
    except json.JSONDecodeError:
        return {
            "error": "LLM response was not valid JSON",
            "raw_response": llm_text,
        }


def merge_skills(structured_json: Dict[str, Any], fallback_skills: List[str]) -> List[str]:
    combined = set(fallback_skills)

    skills_obj = structured_json.get("skills", {})
    if isinstance(skills_obj, dict):
        for value in skills_obj.values():
            if isinstance(value, list):
                for item in value:
                    if isinstance(item, str) and item.strip():
                        combined.add(item.strip())

    return sorted(combined, key=str.lower)


def build_query_from_resume(structured_json: Dict[str, Any], all_skills: List[str]) -> str:
    """
    Build a meaningful search query from the parsed resume.
    """
    parts: List[str] = []

    # Summary
    summary = structured_json.get("summary", "")
    if summary:
        parts.append(summary)

    # Experience roles
    experience = structured_json.get("experience", [])
    if isinstance(experience, list):
        for exp in experience[:3]:
            if isinstance(exp, dict):
                job_title = exp.get("job_title", "")
                if job_title:
                    parts.append(job_title)

    # Project titles
    projects = structured_json.get("projects", [])
    if isinstance(projects, list):
        for project in projects[:3]:
            if isinstance(project, dict):
                title = project.get("title", "")
                if title:
                    parts.append(title)

    # Technical skills + frameworks
    skills_obj = structured_json.get("skills", {})
    important_skills: List[str] = []

    if isinstance(skills_obj, dict):
        technical_skills = skills_obj.get("technical_skills", [])
        frameworks = skills_obj.get("frameworks", [])
        tools = skills_obj.get("tools", [])

        if isinstance(technical_skills, list):
            important_skills.extend([skill for skill in technical_skills if isinstance(skill, str)])

        if isinstance(frameworks, list):
            important_skills.extend([skill for skill in frameworks if isinstance(skill, str)])

        if isinstance(tools, list):
            important_skills.extend([skill for skill in tools if isinstance(skill, str)])

    for skill in all_skills:
        if skill not in important_skills:
            important_skills.append(skill)

    important_skills = important_skills[:20]

    if important_skills:
        parts.append("skills " + " ".join(important_skills))

    final_query = " ".join(part.strip() for part in parts if part and part.strip())
    return final_query.strip()


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
def health_check() -> Dict[str, str]:
    return {"message": "API is running"}


@app.post("/generate-query")
def generate_query_and_store(job: JobRequest) -> Dict[str, Any]:
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
            "message": "Generated query saved to Pinecone successfully",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/search")
def search_similar_jobs(query: str, top_k: int = 3) -> Dict[str, Any]:
    try:
        matches = search_jobs_by_query(query, top_k)

        return {
            "query": query,
            "top_k": top_k,
            "matches": matches,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)) -> JSONResponse:
    try:
        if not file.filename:
            return JSONResponse(
                status_code=400,
                content={"error": "No file uploaded"},
            )

        if not file.filename.lower().endswith(".pdf"):
            return JSONResponse(
                status_code=400,
                content={"error": "Only PDF files are supported"},
            )

        file_bytes = await file.read()
        file_like = BytesIO(file_bytes)

        text = extract_text_from_pdf(file_like)

        if len(text.strip()) < 20:
            text = extract_text_from_scanned_pdf(file_bytes)

        if not text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from the resume"},
            )

        filename_base = os.path.splitext(file.filename)[0]

        txt_file_path = os.path.join(OUTPUT_DIR, f"{filename_base}_extracted.txt")
        with open(txt_file_path, "w", encoding="utf-8") as text_file:
            text_file.write(text)

        structured_json = await get_structured_resume_json(text)
        fallback_skills = extract_skills_from_text(text)
        all_skills = merge_skills(structured_json, fallback_skills)

        if "error" not in structured_json:
            structured_json["all_extracted_skills"] = all_skills

        resume_query = build_query_from_resume(structured_json, all_skills)

        json_file_path = os.path.join(OUTPUT_DIR, f"{filename_base}_structured.json")
        with open(json_file_path, "w", encoding="utf-8") as json_file:
            json.dump(structured_json, json_file, indent=4)

        return JSONResponse(
            content={
                "filename": file.filename,
                "text_file": txt_file_path,
                "structured_json_file": json_file_path,
                "structured_json": structured_json,
                "all_extracted_skills": all_skills,
                "resume_query": resume_query,
                "extracted_text_preview": text[:2000],
            }
        )

    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"error": str(exc)},
        )


@app.post("/search-jobs-from-resume")
async def search_jobs_from_resume(
    file: UploadFile = File(...),
    top_k: int = 5
) -> JSONResponse:
    try:
        if not file.filename:
            return JSONResponse(
                status_code=400,
                content={"error": "No file uploaded"},
            )

        if not file.filename.lower().endswith(".pdf"):
            return JSONResponse(
                status_code=400,
                content={"error": "Only PDF files are supported"},
            )

        file_bytes = await file.read()
        file_like = BytesIO(file_bytes)

        # Step 1: Extract resume text
        text = extract_text_from_pdf(file_like)

        if len(text.strip()) < 20:
            text = extract_text_from_scanned_pdf(file_bytes)

        if not text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from the resume"},
            )

        # Step 2: Parse resume into structured JSON
        structured_json = await get_structured_resume_json(text)
        fallback_skills = extract_skills_from_text(text)
        all_skills = merge_skills(structured_json, fallback_skills)

        if "error" not in structured_json:
            structured_json["all_extracted_skills"] = all_skills

        # Step 3: Build search query from resume
        resume_query = build_query_from_resume(structured_json, all_skills)

        # Step 4: Search vector DB
        matches = search_jobs_by_query(resume_query, top_k)

        return JSONResponse(
            content={
                "filename": file.filename,
                "resume_query": resume_query,
                "top_k": top_k,
                "all_extracted_skills": all_skills,
                "structured_json": structured_json,
                "matches": matches,
            }
        )

    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"error": str(exc)},
        )