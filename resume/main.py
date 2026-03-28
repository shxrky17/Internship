import json
from sentence_transformers import SentenceTransformer

def load_resume_json(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def extract_relevant_skills(data):
    skills_section = data.get("skills", {})

    technical_skills = skills_section.get("technical_skills", [])
    tools = skills_section.get("tools", [])
    frameworks = skills_section.get("frameworks", [])
    extracted_skills = data.get("all_extracted_skills", [])

    # Combine only relevant skill groups
    combined_skills = technical_skills + tools + frameworks + extracted_skills

    # Clean skills: strip spaces, remove empty values
    combined_skills = [skill.strip() for skill in combined_skills if skill and skill.strip()]

    # Remove duplicates case-insensitively while preserving original style
    seen = set()
    unique_skills = []
    for skill in combined_skills:
        normalized = skill.lower()
        if normalized not in seen:
            seen.add(normalized)
            unique_skills.append(skill)

    return unique_skills

def build_query_text(skills, summary="", preferred_role="software developer"):
    if not skills:
        return f"Looking for {preferred_role} jobs."

    return (
        f"Looking for entry-level {preferred_role} jobs matching these skills: "
        + ", ".join(skills)
        + f". Candidate summary: {summary}"
    )

def generate_embedding(text, model_name="all-MiniLM-L6-v2"):
    model = SentenceTransformer(model_name)
    embedding = model.encode(text)
    return embedding

if __name__ == "__main__":
    file_path = r"E:\Internship\resume\extracted_texts\Yash_Chafle_Resume_structured.json"

    # Step 1: Load JSON
    data = load_resume_json(file_path)

    # Step 2: Extract relevant skills
    skills = extract_relevant_skills(data)

    # Step 3: Get summary
    summary = data.get("summary", "")

    # Step 4: Build query text
    query_text = build_query_text(skills, summary, preferred_role="backend or full stack developer")

    # Step 5: Generate embedding
    embedding = generate_embedding(query_text)

    # Output
    print("Extracted Skills:")
    print(skills)

    print("\nQuery Text:")
    print(query_text)

    print("\nEmbedding Length:")
    print(len(embedding))

    print("\nFirst 10 embedding values:")
    print(embedding[384])