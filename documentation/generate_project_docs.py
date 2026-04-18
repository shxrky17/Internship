import os
import textwrap
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence

import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch


ROOT = Path(r"e:\Internship")
DOCS_DIR = ROOT / "documentation"
ASSETS_DIR = DOCS_DIR / "assets"
PDF_PATH = DOCS_DIR / "Internship_Codebase_Documentation.pdf"
MD_PATH = DOCS_DIR / "Internship_Codebase_Documentation.md"


@dataclass
class Section:
    title: str
    body: str


def ensure_dirs() -> None:
    DOCS_DIR.mkdir(exist_ok=True)
    ASSETS_DIR.mkdir(exist_ok=True)


def save_markdown(sections: Sequence[Section], image_paths: Sequence[Path]) -> None:
    md_lines: List[str] = [
        "# Internship Project Detailed Documentation",
        "",
        "Generated from repository inspection on 2026-04-18.",
        "",
        "## Included Diagram Assets",
        "",
    ]

    for image_path in image_paths:
        rel = image_path.relative_to(DOCS_DIR).as_posix()
        md_lines.append(f"- `{rel}`")

    md_lines.append("")

    for section in sections:
        md_lines.append(f"## {section.title}")
        md_lines.append("")
        md_lines.append(section.body.strip())
        md_lines.append("")

    MD_PATH.write_text("\n".join(md_lines), encoding="utf-8")


def add_box(ax, x: float, y: float, w: float, h: float, text: str, fc: str) -> None:
    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.02,rounding_size=0.02",
        linewidth=1.5,
        edgecolor="#1f2937",
        facecolor=fc,
    )
    ax.add_patch(patch)
    ax.text(
        x + w / 2,
        y + h / 2,
        text,
        ha="center",
        va="center",
        fontsize=11,
        wrap=True,
    )


def add_arrow(ax, start, end) -> None:
    arrow = FancyArrowPatch(
        start,
        end,
        arrowstyle="->",
        mutation_scale=15,
        linewidth=1.5,
        color="#374151",
    )
    ax.add_patch(arrow)


def generate_system_architecture() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.05, 0.60, 0.18, 0.15, "User Browser\nReact UI", "#dbeafe")
    add_box(ax, 0.30, 0.60, 0.20, 0.15, "Frontend\nVite + React + Tailwind", "#e0f2fe")
    add_box(ax, 0.58, 0.60, 0.20, 0.15, "Spring Boot API\nControllers + Services", "#dcfce7")
    add_box(ax, 0.58, 0.30, 0.20, 0.15, "MySQL Database\nUsers / Profiles / Jobs", "#fee2e2")
    add_box(ax, 0.82, 0.60, 0.13, 0.15, "FastAPI AI\nResume + Query API", "#fef3c7")
    add_box(ax, 0.82, 0.30, 0.13, 0.15, "Pinecone\nVector Search", "#ede9fe")

    add_arrow(ax, (0.23, 0.675), (0.30, 0.675))
    add_arrow(ax, (0.50, 0.675), (0.58, 0.675))
    add_arrow(ax, (0.68, 0.60), (0.68, 0.45))
    add_arrow(ax, (0.78, 0.675), (0.82, 0.675))
    add_arrow(ax, (0.885, 0.60), (0.885, 0.45))

    ax.text(0.365, 0.72, "SPA routes, forms, dashboard UI", fontsize=10, ha="center")
    ax.text(0.68, 0.52, "JPA persistence", fontsize=10, ha="center")
    ax.text(0.885, 0.52, "upsert/query vectors", fontsize=10, ha="center")
    ax.text(0.70, 0.77, "REST + session cookies", fontsize=10, ha="center")

    ax.set_title("System Architecture", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "system_architecture.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_auth_workflow() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.05, 0.72, 0.18, 0.12, "1. Signup modal\nPOST /register", "#dbeafe")
    add_box(ax, 0.30, 0.72, 0.22, 0.12, "2. UserController\nnormalizes email,\nchecks duplicate", "#dcfce7")
    add_box(ax, 0.60, 0.72, 0.20, 0.12, "3. UserService\nsaves User entity", "#bbf7d0")
    add_box(ax, 0.05, 0.48, 0.18, 0.12, "4. Signin modal\nPOST /login", "#e0f2fe")
    add_box(ax, 0.30, 0.48, 0.22, 0.12, "5. UserController\nvalidates plaintext\npassword", "#fef3c7")
    add_box(ax, 0.60, 0.48, 0.25, 0.12, "6. SecurityContextHolder +\nHttpSessionSecurityContextRepository\nstore session auth", "#fde68a")
    add_box(ax, 0.05, 0.24, 0.18, 0.12, "7. Frontend\nPOST /me", "#dbeafe")
    add_box(ax, 0.30, 0.24, 0.22, 0.12, "8. AuthContext stores\nuser in localStorage", "#dcfce7")
    add_box(ax, 0.60, 0.24, 0.25, 0.12, "9. Header calls /get-profile\nand shows Add/Update Profile", "#fce7f3")

    for y in (0.78, 0.54, 0.30):
        add_arrow(ax, (0.23, y), (0.30, y))
    add_arrow(ax, (0.52, 0.78), (0.60, 0.78))
    add_arrow(ax, (0.52, 0.54), (0.60, 0.54))
    add_arrow(ax, (0.23, 0.30), (0.30, 0.30))
    add_arrow(ax, (0.52, 0.30), (0.60, 0.30))

    ax.set_title("Authentication And Session Workflow", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "auth_workflow.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_resume_pipeline() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.03, 0.58, 0.14, 0.15, "Resume PDF\nfrontend upload", "#dbeafe")
    add_box(ax, 0.21, 0.58, 0.14, 0.15, "/analyze-resume\nFastAPI", "#dcfce7")
    add_box(ax, 0.39, 0.58, 0.14, 0.15, "PyPDF2 text\nfallback OCR", "#fef3c7")
    add_box(ax, 0.57, 0.58, 0.14, 0.15, "Groq LLM\nstructured JSON", "#fde68a")
    add_box(ax, 0.75, 0.58, 0.20, 0.15, "Build resume_query\nmerge skills\nreturn preview + JSON", "#fce7f3")

    add_box(ax, 0.21, 0.25, 0.18, 0.15, "/generate-query\njob ingestion", "#dcfce7")
    add_box(ax, 0.46, 0.25, 0.18, 0.15, "SentenceTransformer\n384-dim embedding", "#e0f2fe")
    add_box(ax, 0.71, 0.25, 0.20, 0.15, "Pinecone upsert/search\nmatch metadata", "#ede9fe")

    add_arrow(ax, (0.17, 0.655), (0.21, 0.655))
    add_arrow(ax, (0.35, 0.655), (0.39, 0.655))
    add_arrow(ax, (0.53, 0.655), (0.57, 0.655))
    add_arrow(ax, (0.71, 0.655), (0.75, 0.655))
    add_arrow(ax, (0.39, 0.325), (0.46, 0.325))
    add_arrow(ax, (0.64, 0.325), (0.71, 0.325))

    ax.text(0.5, 0.47, "FastAPI service supports both candidate-side resume search and backend-side job indexing", ha="center", fontsize=10)
    ax.set_title("Resume Analysis And Semantic Matching Pipeline", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "resume_pipeline.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_frontend_routes() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.08, 0.70, 0.22, 0.14, "App.jsx\nBrowserRouter", "#dbeafe")
    add_box(ax, 0.39, 0.70, 0.22, 0.14, "/\nLandingView + Marquee + Footer", "#dcfce7")
    add_box(ax, 0.70, 0.70, 0.20, 0.14, "Auth modals\nSignin / Signup", "#fce7f3")
    add_box(ax, 0.22, 0.38, 0.22, 0.14, "/add-profile\nProfile form + PDF upload", "#e0f2fe")
    add_box(ax, 0.56, 0.38, 0.22, 0.14, "/get-jobs\nSearchJobs", "#fef3c7")
    add_box(ax, 0.22, 0.10, 0.22, 0.14, "Header\nsession check,\nprofile status", "#bbf7d0")
    add_box(ax, 0.56, 0.10, 0.22, 0.14, "AuthContext\nfetchCurrentUser,\nlocalStorage sync", "#fde68a")

    add_arrow(ax, (0.30, 0.77), (0.39, 0.77))
    add_arrow(ax, (0.61, 0.77), (0.70, 0.77))
    add_arrow(ax, (0.50, 0.70), (0.34, 0.52))
    add_arrow(ax, (0.50, 0.70), (0.67, 0.52))
    add_arrow(ax, (0.33, 0.38), (0.33, 0.24))
    add_arrow(ax, (0.67, 0.38), (0.67, 0.24))

    ax.set_title("Frontend Route And State Map", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "frontend_routes.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def wrap_paragraphs(text: str, width: int = 98) -> List[str]:
    wrapped: List[str] = []
    for block in text.strip().split("\n"):
        if not block.strip():
            wrapped.append("")
            continue
        if block.startswith("- ") or block.startswith("1. ") or block.startswith("2. ") or block.startswith("3. "):
            wrapped.extend(textwrap.wrap(block, width=width, subsequent_indent="   "))
        else:
            wrapped.extend(textwrap.wrap(block, width=width))
    return wrapped


def render_text_pages(pdf: PdfPages, section: Section) -> None:
    lines = wrap_paragraphs(section.body)
    lines_per_page = 34

    for page_index in range(0, len(lines), lines_per_page):
        chunk = lines[page_index: page_index + lines_per_page]
        fig = plt.figure(figsize=(8.27, 11.69))
        fig.patch.set_facecolor("white")
        ax = fig.add_axes([0, 0, 1, 1])
        ax.axis("off")

        ax.text(0.06, 0.96, section.title, fontsize=19, weight="bold", va="top")
        ax.text(
            0.06,
            0.92,
            "\n".join(chunk),
            fontsize=10.5,
            va="top",
            family="DejaVu Sans",
            linespacing=1.45,
        )
        ax.text(0.94, 0.03, f"{page_index // lines_per_page + 1}", ha="right", fontsize=8, color="#6b7280")
        pdf.savefig(fig)
        plt.close(fig)


def render_image_page(pdf: PdfPages, title: str, image_path: Path, caption: str) -> None:
    fig = plt.figure(figsize=(8.27, 11.69))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")
    ax.text(0.06, 0.96, title, fontsize=19, weight="bold", va="top")
    img = plt.imread(image_path)
    img_ax = fig.add_axes([0.06, 0.20, 0.88, 0.66])
    img_ax.imshow(img)
    img_ax.axis("off")
    ax.text(0.06, 0.13, caption, fontsize=10.5, va="top", wrap=True)
    pdf.savefig(fig)
    plt.close(fig)


def build_sections() -> List[Section]:
    return [
        Section(
            "Project Overview",
            """
This repository contains a multi-service internship and job matching platform. The codebase is split into three product-facing parts:
- A Spring Boot backend in `backend/demo` that exposes REST endpoints for authentication, profile creation, profile lookup, and job creation.
- A React frontend in `frontend` that provides the landing page, sign-in and sign-up modals, profile submission screen, and resume-based job search page.
- A FastAPI-based AI service in `resume` that extracts resume text, enriches it with an LLM, generates semantic search queries, creates sentence-transformer embeddings, and stores or searches vectors in Pinecone.

There are also supporting files:
- `Jenkinsfile` defines the CI/CD pipeline.
- `README.md` contains a high-level project introduction.
- `h.go` and `resume/temp.py` look like practice or sandbox files rather than production features.

Interview-ready one-line summary:
This is a full-stack internship recommendation system where the Java backend manages user and job records, the Python service handles semantic understanding and vector search, and the React frontend ties both services together into a candidate-facing experience.
            """,
        ),
        Section(
            "Repository Structure",
            """
The repository contains 116 non-generated files once standard build folders and virtual environments are excluded. The main source-bearing areas are:
- `backend/demo/src/main/java/com/app/demo`: Spring Boot application code.
- `backend/demo/src/main/resources/application.properties`: runtime configuration for server port, MySQL, Hibernate, and actuator.
- `frontend/src`: React components, auth context, utility helpers, and route composition.
- `frontend/public`: 22 SVG image assets used by the marquee.
- `resume/main.py`: the AI service entry point with all route and helper logic in one file.
- `resume/extracted_texts`: generated outputs from resume parsing runs.

The backend follows a classic layered structure:
- `Controller`: HTTP endpoints.
- `Service`: business logic plus outgoing HTTP calls.
- `Repository`: Spring Data JPA persistence interfaces.
- `Entity`: database models.
- `DTO`: transport objects between controller, service, and external APIs.
- `Config`: beans and framework configuration.

The frontend is component-driven:
- `App.jsx` defines the route tree.
- `context/AuthContext.jsx` is the main shared state for session bootstrap and current user identity.
- `components/home` holds landing and discovery UI.
- `components/layout` holds the header, footer, and auth modals.
- `components/dashboard` currently contains placeholder components returning `null`.
- `components/ui` contains Radix-style reusable primitives built with class-variance-authority.
            """,
        ),
        Section(
            "Backend Runtime And Configuration",
            """
The backend is a Spring Boot 4.0.3 application started through `DemoApplication.java`. `application.properties` sets:
- `server.port=8081`
- datasource URL `jdbc:mysql://localhost:3306/Internship`
- username `root`
- password `root`
- `spring.jpa.hibernate.ddl-auto=update`
- `spring.jpa.show-sql=true`
- `management.endpoints.web.exposure.include=*`

What this means operationally:
- The backend expects a local MySQL instance and updates the schema automatically on startup.
- SQL statements are printed to the console, which helps debugging during development.
- Actuator and Prometheus endpoints are available.
- The backend is configured for development convenience rather than production hardening.

Configuration classes:
- `AppConfig` registers a `RestTemplate` bean used by services that call other APIs.
- `SecurityConfig` disables CSRF, configures request authorization, and allows CORS from `http://localhost:5173`.
- `WebConfig` maps the physical `uploads` directory to `/uploads/**`, making uploaded files accessible if present.

Important detail:
Although security rules mention authentication, several endpoints such as `/add-profile`, `/upload`, and `/me` are also marked as `permitAll()` before a later `/me authenticated()` matcher. In Spring Security, order matters, so the earlier matcher wins. The controllers still do manual auth checks, but the route-level rule is looser than it looks.
            """,
        ),
        Section(
            "Backend Domain Model",
            """
The backend persists three main entities.

`User`:
- Table name: `users`
- Fields: `id`, `firstName`, `lastName`, `email`, `password`
- Constraints: `email` is unique and non-null
- Relationship: one-to-one with `Profile` through `profile`

`Profile`:
- Fields: `id`, `phoneNumber`, `gender`, `state`, `user`
- Relationship owner: `@OneToOne` with `@JoinColumn(name = "user_id", nullable = false)`
- Each user can have exactly one profile in the current design.

`Job`:
- Fields: `id`, `title`, `company`, `location`, `skills`
- `skills` is declared as `List<String>`.

Interview note:
`Job.skills` is not annotated with `@ElementCollection` or a converter. In standard JPA this is incomplete and may fail schema generation or persistence depending on runtime behavior. It is an important design gap to understand if asked about persistence modeling.
            """,
        ),
        Section(
            "Backend Repositories And DTOs",
            """
Repositories:
- `UserRepository extends JpaRepository<User, Integer>` with `findByEmail(String email)`.
- `ProfileRepository extends JpaRepository<Profile, Integer>` with `getProfileByUserId(Integer id)`.
- `JobRepository extends JpaRepository<Job, Integer>` with default CRUD behavior only.

DTOs used by the backend:
- `UserRegisterDTO`: incoming registration payload with id, firstName, lastName, email, password.
- `UserResponseDTO`: outgoing user projection with id, firstName, lastName, email.
- `LoginRequestDTO`: incoming email and password.
- `LoginResponseDTO`: outgoing login result containing message and success flag.
- `ProfileRequestDTO`: incoming phoneNumber, gender, state.
- `JobRequestDTO`: payload sent from Spring Boot to FastAPI for semantic job indexing.
- `JobResponseDTO`: backend response returned after saving a job and calling FastAPI.
- `PythonResponseDTO`: deserializes FastAPI output in the Java service layer.

Design interpretation:
The Java backend uses DTOs mainly for transport shaping, especially to avoid returning the full `User` entity directly and to translate the FastAPI contract into a Java object.
            """,
        ),
        Section(
            "Backend Controllers And API Routes",
            """
The backend exposes these routes.

`POST /register`
- Controller: `UserController.register`
- Input: `UserRegisterDTO`
- Flow: trims and lowercases email, checks if the email already exists, calls `UserService.register`, returns `UserResponseDTO`
- Failure mode: duplicate email returns HTTP 400 with an empty body

`POST /login`
- Controller: `UserController.login`
- Input: `LoginRequestDTO`
- Flow: normalizes email, loads user by email, compares plaintext password, creates `UsernamePasswordAuthenticationToken`, saves security context into HTTP session, returns `LoginResponseDTO`
- Failure mode: missing user returns 404, wrong password returns 400

`POST /logout`
- Controller: `UserController.logout`
- Flow: clears `SecurityContextHolder` and invalidates the current session if it exists
- Output: simple success string

`POST /me`
- Controller: `UserController.getCurrentUser`
- Purpose: session bootstrap endpoint used by the frontend to recover the current user from the server-side session
- Output: `UserResponseDTO`
- Failure mode: 401 if authentication is missing or user cannot be resolved

`GET /get-profile`
- Controller: `UserController.getProfile`
- Flow: reads current email from the security context, finds the user, then calls `profileRepository.getProfileByUserId(user.getId())`
- Output: full `Profile` entity
- Failure mode: 404 if user or profile is missing

`POST /upload`
- Controller: `ProfileController.uploadPdf`
- Input: multipart file under key `file`
- Flow: delegates to `UserService.sendPdfToFastApi`, which forwards the file to `http://localhost:8000/analyze-resume`
- Output: proxied JSON from FastAPI
- Failure mode: HTTP 500 with message and exception text

`POST /add-profile`
- Controller: `ProfileController.addProfile`
- Input: `ProfileRequestDTO`
- Flow: requires an authenticated security context, prevents duplicate profile creation, creates `Profile`, links it to the user, and saves it
- Output: plain text success message
- Failure mode: 401 if not logged in, 404 if user missing, 409 if profile already exists

`POST /create-job`
- Controller: `JobController.postJob`
- Input: `Job` entity JSON
- Flow: saves the job in MySQL, converts it to `JobRequestDTO`, calls the Python service, then returns a `JobResponseDTO`
- Output: combined persistence and semantic indexing result
            """,
        ),
        Section(
            "Backend Services And Internal Logic",
            """
`UserService.register`
- Creates a new `User` entity manually.
- Copies fields from `UserRegisterDTO`.
- Lowercases and trims the email.
- Saves through `UserRepository`.
- Returns `UserResponseDTO`.

`UserService.sendPdfToFastApi`
- Accepts a Spring `MultipartFile`.
- Rebuilds it as a `ByteArrayResource`.
- Creates a multipart/form-data request.
- Calls `http://localhost:8000/analyze-resume` using a locally instantiated `RestTemplate`.
- Returns the raw response body as `Map<String, Object>`.

`JobService.saveJobAndGenerateQuery`
- Saves the `Job` first using JPA.
- Converts the saved entity into `JobRequestDTO`.
- Sends JSON to `http://127.0.0.1:8000/generate-query`.
- Deserializes the FastAPI result into `PythonResponseDTO`.
- Repackages the final data as `JobResponseDTO`.

Interesting design choice:
The Java backend saves the job record before confirming that vector indexing succeeded. If the Python service fails, the database may still contain the job while Pinecone does not. This creates eventual inconsistency and is a good talking point in interviews.

Unused or placeholder backend code:
- `FileStorageService.java` contains only `// Removed.`
- There is no custom password encoder or user-details service.
- There is only one minimal test, `contextLoads`.
            """,
        ),
        Section(
            "Frontend Application Architecture",
            """
The frontend is a Vite React SPA.

Boot sequence:
- `main.jsx` mounts the React tree into `#root`.
- `AuthProvider` wraps the entire app.
- `App.jsx` uses `BrowserRouter` and conditionally shows a loading spinner while auth initialization is in progress.

Defined routes:
- `/`: landing page with `Header`, `LandingView`, `Marquee`, and `Footer`. Sign-in and sign-up render as modal overlays on top of this route.
- `/add-profile`: page containing `Header`, `Profile`, and `Footer`.
- `/get-jobs`: page containing the resume upload and semantic job results UI.

`AuthContext.jsx` is the state hub:
- Initializes `user` from `localStorage`.
- Calls backend `POST /me` with `credentials: 'include'` to restore the session on page load.
- Stores the normalized user object in local storage.
- Exposes `login`, `register`, `logout`, and `refetchUser`.

Important inconsistency:
- `fetchCurrentUser` uses backend port `8081`.
- `login` and `register` inside `AuthContext` use port `8080`.
- The auth modals themselves call `8081`.
This means there are two overlapping auth implementations in the frontend, and only one of them points at the configured backend port.
            """,
        ),
        Section(
            "Frontend Components And User Flows",
            """
`Header.jsx`
- Shows branding, navigation, voice and language icon buttons, auth buttons, and profile-state actions.
- If a user exists, it calls `GET /get-profile` to decide whether to show `Add Profile` or `Update Profile`.
- Includes a debugging-oriented `Check /me` button that calls the backend and pops browser alerts.
- Logout calls `POST /logout`, clears frontend auth state, navigates home, and reloads the page.

`Signin.jsx`
- Modal login form.
- Calls `POST /login` on port `8081` with cookies enabled.
- Reads the response as text rather than JSON.
- On success it shows an alert, clears form fields, closes the modal, and reloads the page.
- It also writes `data.token` to local storage even though `data` is text, so the token line is ineffective.

`Signup.jsx`
- Modal registration form.
- Calls `POST /register` on port `8081`.
- On success it clears the fields but does not auto-login the user.

`Profile.jsx`
- Collects phone number, gender, state, and an `id` field, although the backend ignores `id` in the DTO.
- `handleSubmit` sends JSON to `POST /add-profile`.
- `handleUpload` sends a multipart PDF to `POST /upload`.
- The screen combines profile creation and resume analysis into one page.

`SearchJobs.jsx`
- Uploads a resume directly to the Python service instead of going through Spring Boot.
- First calls `POST /analyze-resume`.
- Builds a query from `resume_query` or a summary-plus-skills fallback.
- Then calls `GET /search`.
- Filters matches to scores greater than `0.35`.
- Renders title, company, location, skills, and the similarity score.

Landing and marketing components:
- `LandingView.jsx`: hero section, feature cards, about section, gallery, and contact cards.
- `GalleryCarousel.jsx`: auto-rotating image carousel based on remote Unsplash images.
- `Marquee.jsx` and `MarqueeItem.jsx`: animated horizontal strip of local SVG assets.
- `Footer.jsx`: quick links, candidate links, subscription input, and basic site footer.
            """,
        ),
        Section(
            "Frontend Styling System",
            """
Tailwind is configured in `tailwind.config.js` with custom colors:
- `primary`: blue
- `secondary`: green
- `match.high`, `match.med`, `match.low`
- `text.main`, `text.muted`

Typography:
- Headings use `Outfit`.
- Body text uses `Inter`.

`src/styles/index.css` defines the visual language:
- A fixed green-blue gradient page background.
- `glass-panel` and `glass-nav` utilities for glassmorphism surfaces.
- `btn`, `btn-primary`, `btn-secondary`, `btn-success`, and auth button helpers.
- `footer-gradient`.

Reusable UI primitives:
- `Button.jsx` wraps Radix `Slot` plus CVA variants.
- `Card.jsx`, `Input.jsx`, and `Label.jsx` provide styled form building blocks.
- `utils.js` exposes `cn()` to combine class names via `clsx` and `tailwind-merge`.

Observation:
The landing area follows a richer design language than the profile and search pages, which are visually much more utilitarian. This suggests the project evolved incrementally rather than through a single design system pass.
            """,
        ),
        Section(
            "Python AI Service Architecture",
            """
The Python service in `resume/main.py` is a large single-file FastAPI application. It combines API routing, model loading, helper functions, external service clients, and persistence-side effects.

Startup behavior:
- Loads environment variables from `.env`.
- Requires both `PINECONE_API_KEY` and `GROQ_API_KEY`.
- Uses `PINECONE_INDEX_NAME` default `quickstart`.
- Uses `PINECONE_NAMESPACE` default `job-queries`.
- Configures CORS for localhost frontend origins.
- Loads `SentenceTransformer('all-MiniLM-L6-v2')`.
- Creates a Pinecone index client.
- Creates a Groq API client.
- Sets a fixed Windows Tesseract path.

Core helper responsibilities:
- `extract_text_from_pdf`: tries text extraction with `PyPDF2`.
- `extract_text_from_scanned_pdf`: OCR fallback using `pdf2image` plus `pytesseract`.
- `extract_skills_from_text`: keyword-based fallback skill extraction.
- `get_structured_resume_json`: sends a prompt to Groq and expects strict JSON.
- `merge_skills`: combines LLM-structured skills with fallback keyword matches.
- `build_query_from_resume`: assembles a semantic search query from summary, experience, projects, and skills.
- `build_query`: creates a job-side embedding sentence such as `title at company in location with skills ...`.
- `generate_embedding`: converts text into a 384-dimensional vector.
- `save_to_pinecone`: upserts vectors and metadata.
- `search_jobs_by_query`: embeds a candidate query and retrieves matches from Pinecone.
            """,
        ),
        Section(
            "Python AI Endpoints",
            """
`GET /`
- Simple health check returning `{"message": "API is running"}`.

`POST /generate-query`
- Input model: `JobRequest`
- Use case: called by Spring Boot after a job is saved in MySQL.
- Process: build query string, create embedding, validate dimension equals 384, upsert vector into Pinecone, return metadata and status.

`GET /search`
- Query params: `query`, optional `top_k`, optional `max_score`
- Process: embed the query and search Pinecone namespace `job-queries`
- Output: ranked matches with score and metadata

`POST /analyze-resume`
- Input: uploaded PDF
- Process:
  1. Verify file exists and ends with `.pdf`
  2. Read the file bytes
  3. Extract text using `PyPDF2`
  4. Fall back to OCR if extracted text is too short
  5. Persist extracted text to `resume/extracted_texts`
  6. Ask Groq to return a structured JSON representation
  7. Merge extracted skills
  8. Build `resume_query`
  9. Persist the structured JSON to disk
  10. Return a large JSON response with preview text and generated query

`POST /search-jobs-from-resume`
- Similar to `/analyze-resume` but proceeds further and immediately queries Pinecone for matches.
- It returns the resume query, top_k, max_score, extracted skills, structured JSON, and matches.

Behavior nuance:
`search_jobs_by_query` keeps matches only when `score < max_score`, while the frontend later keeps matches only when `score > 0.35`. This means the effective acceptance window is `0.35 < score < 2.5`. The in-code UI message still says `No jobs found with score greater than 2.5`, which does not match the filter logic.
            """,
        ),
        Section(
            "End-To-End Workflows",
            """
User registration workflow:
1. The signup modal posts registration data to `/register`.
2. The backend normalizes the email and saves the new `User`.
3. The frontend clears the modal fields and asks the user to sign in separately.

User login workflow:
1. The signin modal posts email and password to `/login`.
2. The backend compares raw password strings.
3. The backend writes authentication into the HTTP session.
4. The frontend reloads, and on boot `AuthContext` calls `/me`.
5. The frontend stores the returned user in local storage.
6. `Header` checks `/get-profile` and surfaces profile status.

Profile creation workflow:
1. Logged-in user navigates to `/add-profile`.
2. The profile form sends `phoneNumber`, `gender`, and `state` to `/add-profile`.
3. The backend resolves the current user from the session and creates a one-to-one `Profile`.
4. Subsequent header checks change from `Add Profile` to `Update Profile`.

Resume analysis workflow:
1. User uploads a PDF on `/add-profile` or `/get-jobs`.
2. Spring Boot can proxy the upload to `/analyze-resume`, or the frontend can call FastAPI directly.
3. FastAPI extracts text, falls back to OCR if needed, builds structured JSON with Groq, merges skills, and returns a generated query.

Job ingestion workflow:
1. An admin or external client calls `/create-job` on Spring Boot.
2. Java saves the job.
3. Java calls FastAPI `/generate-query`.
4. FastAPI creates an embedding and upserts metadata into Pinecone.
5. Java returns a combined `JobResponseDTO`.

Candidate matching workflow:
1. `SearchJobs.jsx` uploads the candidate resume to FastAPI.
2. FastAPI returns `resume_query`.
3. The frontend calls FastAPI `/search`.
4. Pinecone similarity results come back with metadata.
5. The frontend filters and renders recommended jobs.
            """,
        ),
        Section(
            "CI/CD And Operational Files",
            """
`Jenkinsfile` defines a straightforward Windows-oriented pipeline:
- Checkout source from SCM.
- Run `where py` and `py --version`.
- Build backend with `mvnw.cmd clean install -DskipTests`.
- Build frontend with `npm install` and `npm run build`.
- Compile-check the Python service with `py -m py_compile main.py`.
- Run backend tests with `mvnw.cmd test`.
- Archive backend JARs and frontend build assets.

Operationally, this means:
- The backend and frontend are treated as first-class build artifacts.
- The Python service is syntax-checked but not executed or integration-tested.
- There is no test stage for the frontend.
- There is no deployment stage in the pipeline itself.

Other notable repository files:
- `README.md` is aspirational and more polished than the current implementation in some places.
- `copilot-instructions.md` appears to be contributor or AI-assistant guidance.
- `h.go` is a standalone Go basics example unrelated to the product.
- `resume/temp.py` is a tiny Python sandbox script unrelated to the main system.
            """,
        ),
        Section(
            "Implementation Gaps, Risks, And Interview Talking Points",
            """
Security gaps:
- Passwords are stored and compared in plaintext.
- CSRF is disabled globally.
- Session auth is used, but parts of the frontend also try to write a token that does not exist.
- Some security matchers are overly permissive compared with controller intent.

Integration gaps:
- Frontend code mixes backend ports `8080` and `8081`.
- Some flows call FastAPI through Spring Boot while others call FastAPI directly.
- Job persistence and vector persistence are not transactional together.

Data-model gaps:
- `Job.skills` is not mapped with standard JPA collection annotations.
- `ProfileRepository` uses `Integer` in the repository generic but `Profile.id` is `Long`.
- The profile form includes an `id` input that is not used by `ProfileRequestDTO`.

UX and maintainability gaps:
- Several dashboard components are placeholders returning `null`.
- `Header` contains debugging alerts and a `Check /me` button that looks like a development aid.
- `Signin.jsx` parses login response as text and then tries to use `data.token`.
- Success and filter messages in job search do not fully align with the actual threshold logic.

Strong interview talking points:
- Explain why the architecture is split between transactional CRUD in Spring Boot and semantic matching in FastAPI.
- Discuss why session-based auth was used and how you would harden it for production.
- Show that you understand the OCR fallback path for scanned resumes.
- Point out that Pinecone stores vector embeddings while MySQL stores canonical business data.
- Be honest about current limitations and describe the next refactors: password hashing, unified API client, proper entity mapping, service-to-service retry handling, and better test coverage.
            """,
        ),
        Section(
            "Interview Prep Cheat Sheet",
            """
If you need a concise explanation during an interview, use this structure:

1. Product goal:
This project helps candidates find relevant internships by combining normal CRUD data management with AI-based resume understanding and vector similarity search.

2. Backend role:
The Spring Boot service owns users, profiles, jobs, sessions, and the main REST contract for the frontend.

3. AI service role:
The FastAPI service extracts text from resumes, uses an LLM to structure resume data, builds embeddings, and stores or searches those embeddings in Pinecone.

4. Frontend role:
The React app gives users the landing page, auth flows, profile submission flow, and resume-to-job recommendation flow.

5. Matching flow:
Jobs are embedded and indexed into Pinecone. Candidate resumes are converted into semantic queries. Pinecone returns the closest job vectors, and the frontend shows the best matches.

6. Honest limitations:
The code works as a proof of concept but still needs production-grade security, stronger consistency guarantees, and cleaner integration boundaries.
            """,
        ),
    ]


def build_pdf(sections: Sequence[Section], diagrams: Sequence[Path]) -> None:
    with PdfPages(PDF_PATH) as pdf:
        title_fig = plt.figure(figsize=(8.27, 11.69))
        ax = title_fig.add_axes([0, 0, 1, 1])
        ax.axis("off")
        ax.text(0.06, 0.92, "Internship Project Detailed Documentation", fontsize=24, weight="bold", va="top")
        ax.text(0.06, 0.84, "Repository-wide technical documentation generated from code inspection", fontsize=12)
        ax.text(0.06, 0.79, "Coverage", fontsize=14, weight="bold")
        ax.text(
            0.06,
            0.74,
            "\n".join(
                [
                    "- Spring Boot backend architecture and API routes",
                    "- React frontend routes, components, and state handling",
                    "- FastAPI resume analysis and semantic matching service",
                    "- Workflow diagrams, implementation notes, and interview talking points",
                ]
            ),
            fontsize=11,
            va="top",
            linespacing=1.6,
        )
        ax.text(0.06, 0.58, "Generated on 2026-04-18 from the local repository at e:\\Internship", fontsize=10.5)
        pdf.savefig(title_fig)
        plt.close(title_fig)

        render_image_page(
            pdf,
            "Architecture Diagram",
            diagrams[0],
            "High-level view of how the browser, React app, Spring Boot API, MySQL database, FastAPI service, and Pinecone vector store interact.",
        )
        render_image_page(
            pdf,
            "Authentication Workflow",
            diagrams[1],
            "Session creation begins in the signin modal and ends with frontend state hydration through `/me` plus profile-state checks through `/get-profile`.",
        )
        render_image_page(
            pdf,
            "Resume And Matching Pipeline",
            diagrams[2],
            "The AI service handles both resume understanding for candidates and vector indexing for jobs.",
        )
        render_image_page(
            pdf,
            "Frontend Route Map",
            diagrams[3],
            "This route map shows how the SPA composes the landing page, profile form, search page, header, and auth context.",
        )

        for section in sections:
            render_text_pages(pdf, section)


def main() -> None:
    ensure_dirs()
    diagrams = [
        generate_system_architecture(),
        generate_auth_workflow(),
        generate_resume_pipeline(),
        generate_frontend_routes(),
    ]
    sections = build_sections()
    save_markdown(sections, diagrams)
    build_pdf(sections, diagrams)
    print(f"Created: {PDF_PATH}")
    print(f"Created: {MD_PATH}")
    for path in diagrams:
        print(f"Created: {path}")


if __name__ == "__main__":
    main()
