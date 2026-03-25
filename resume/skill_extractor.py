from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from pdf2image import convert_from_bytes
import pytesseract
from io import BytesIO
import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

# Load environment variables
load_dotenv()

app = FastAPI(title="Resume Analyzer")
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

# Optional: set tesseract path manually if not added in PATH
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Directory to save outputs
OUTPUT_DIR = "extracted_texts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env file")

groq_client = Groq(api_key=GROQ_API_KEY)


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\x0c", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def extract_text_from_pdf(file_like: BytesIO) -> str:
    text = ""
    file_like.seek(0)
    reader = PdfReader(file_like)

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return clean_text(text)


def extract_text_from_scanned_pdf(file_bytes: bytes) -> str:
    pages = convert_from_bytes(file_bytes)
    text = ""

    for page in pages:
        page_text = pytesseract.image_to_string(page)
        if page_text:
            text += page_text + "\n"

    return clean_text(text)


def extract_skills_from_text(text: str) -> list:
    """
    Backup regex/keyword-based skill extraction from raw resume text.
    This helps if LLM misses some skills.
    """
    common_skills = [
        "python", "java", "c", "c++", "javascript", "typescript", "html", "css",
        "react", "node.js", "express", "spring boot", "spring", "hibernate",
        "mysql", "postgresql", "mongodb", "sql", "git", "github", "docker",
        "kubernetes", "aws", "azure", "gcp", "fastapi", "django", "flask",
        "machine learning", "deep learning", "data analysis", "pandas", "numpy",
        "opencv", "tensorflow", "pytorch", "rest api", "microservices",
        "jmeter", "loadrunner", "k6", "performance testing", "manual testing",
        "selenium", "postman", "linux", "go", "golang", "redis", "firebase"
    ]

    found_skills = set()
    lower_text = text.lower()

    for skill in common_skills:
        if skill.lower() in lower_text:
            found_skills.add(skill)

    return sorted(found_skills)


async def get_structured_resume_json(text: str) -> dict:
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

    # Remove accidental markdown fences if present
    llm_text = re.sub(r"^```json\s*", "", llm_text)
    llm_text = re.sub(r"^```\s*", "", llm_text)
    llm_text = re.sub(r"\s*```$", "", llm_text)

    try:
        structured_json = json.loads(llm_text)
    except json.JSONDecodeError:
        structured_json = {
            "error": "LLM response was not valid JSON",
            "raw_response": llm_text
        }

    return structured_json


def merge_skills(structured_json: dict, fallback_skills: list) -> list:
    """
    Combines skills from LLM JSON + regex backup extraction.
    """
    combined = set(fallback_skills)

    if isinstance(structured_json, dict):
        skills_obj = structured_json.get("skills", {})
        if isinstance(skills_obj, dict):
            for value in skills_obj.values():
                if isinstance(value, list):
                    for item in value:
                        if isinstance(item, str) and item.strip():
                            combined.add(item.strip())

    return sorted(combined, key=str.lower)


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    try:
        if not file.filename:
            return JSONResponse(
                content={"error": "No file uploaded"},
                status_code=400
            )

        if not file.filename.lower().endswith(".pdf"):
            return JSONResponse(
                content={"error": "Only PDF files are supported"},
                status_code=400
            )

        file_bytes = await file.read()
        file_like = BytesIO(file_bytes)

        # Extract text from PDF
        text = extract_text_from_pdf(file_like)

        # OCR fallback for scanned resumes
        if len(text.strip()) < 20:
            text = extract_text_from_scanned_pdf(file_bytes)

        if not text.strip():
            return JSONResponse(
                content={"error": "Could not extract text from the resume"},
                status_code=400
            )

        filename_base = os.path.splitext(file.filename)[0]

        # Save extracted raw text
        txt_file_path = os.path.join(OUTPUT_DIR, f"{filename_base}_extracted.txt")
        with open(txt_file_path, "w", encoding="utf-8") as f:
            f.write(text)

        # Get structured resume JSON from LLM
        structured_json = await get_structured_resume_json(text)

        # Extract fallback skills from raw text
        fallback_skills = extract_skills_from_text(text)

        # Merge LLM skills + fallback skills
        all_skills = merge_skills(structured_json, fallback_skills)

        # Add merged skills into result
        if isinstance(structured_json, dict) and "error" not in structured_json:
            structured_json["all_extracted_skills"] = all_skills

        # Save structured JSON
        json_file_path = os.path.join(OUTPUT_DIR, f"{filename_base}_structured.json")
        with open(json_file_path, "w", encoding="utf-8") as f:
            json.dump(structured_json, f, indent=4)

        return JSONResponse(
            content={
                "filename": file.filename,
                "text_file": txt_file_path,
                "structured_json_file": json_file_path,
                "structured_json": structured_json,
                "all_extracted_skills": all_skills,
                "extracted_text_preview": text[:2000]
            }
        )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )