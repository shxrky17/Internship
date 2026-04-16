user = {
    "name": "Yash",
    "skills": ["Java", "Python"],
    "projects": 3
}

user["skills"].append("SQL")
user["projects"] += 1

print(f"User name is {user['name']}")
print(f"Skills are: {', '.join(user['skills'])}")
print(f"Total projects: {user['projects']}")