import textwrap
from dataclasses import dataclass
from pathlib import Path
from typing import List, Sequence

import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch


ROOT = Path(r"e:\Internship")
DOCS_DIR = ROOT / "documentation"
ASSETS_DIR = DOCS_DIR / "assets"
PDF_PATH = DOCS_DIR / "Backend_Service_Detailed_Documentation.pdf"
MD_PATH = DOCS_DIR / "Backend_Service_Detailed_Documentation.md"


@dataclass
class Section:
    title: str
    body: str


def ensure_dirs() -> None:
    DOCS_DIR.mkdir(exist_ok=True)
    ASSETS_DIR.mkdir(exist_ok=True)


def add_box(ax, x: float, y: float, w: float, h: float, text: str, color: str) -> None:
    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.02,rounding_size=0.02",
        linewidth=1.3,
        edgecolor="#1f2937",
        facecolor=color,
    )
    ax.add_patch(patch)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=10.5, wrap=True)


def add_arrow(ax, start, end) -> None:
    ax.add_patch(
        FancyArrowPatch(
            start,
            end,
            arrowstyle="->",
            mutation_scale=15,
            linewidth=1.4,
            color="#374151",
        )
    )


def generate_dependency_diagram() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.36, 0.72, 0.28, 0.14, "Spring Boot Backend\n`backend/demo`", "#dbeafe")
    add_box(ax, 0.05, 0.42, 0.18, 0.14, "Spring Web MVC\ncontrollers, JSON,\nREST endpoints", "#dcfce7")
    add_box(ax, 0.27, 0.42, 0.18, 0.14, "Spring Data JPA\nrepositories and ORM", "#e0f2fe")
    add_box(ax, 0.49, 0.42, 0.18, 0.14, "Spring Security\nsession auth and\nSecurityContext", "#fef3c7")
    add_box(ax, 0.71, 0.42, 0.18, 0.14, "Actuator + Prometheus\nhealth and metrics", "#fde68a")
    add_box(ax, 0.20, 0.14, 0.22, 0.14, "MySQL + Hibernate\npersistent relational data", "#fce7f3")
    add_box(ax, 0.58, 0.14, 0.22, 0.14, "RestTemplate\ncalls Python AI service", "#bbf7d0")

    add_arrow(ax, (0.50, 0.72), (0.14, 0.56))
    add_arrow(ax, (0.50, 0.72), (0.36, 0.56))
    add_arrow(ax, (0.50, 0.72), (0.58, 0.56))
    add_arrow(ax, (0.50, 0.72), (0.80, 0.56))
    add_arrow(ax, (0.36, 0.42), (0.31, 0.28))
    add_arrow(ax, (0.67, 0.42), (0.69, 0.28))

    ax.set_title("Backend Dependency Map", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "backend_service_dependency_map.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_layer_diagram() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.06, 0.68, 0.18, 0.14, "Controllers\nUser / Profile / Job", "#dbeafe")
    add_box(ax, 0.32, 0.68, 0.18, 0.14, "Services\nUserService / JobService", "#dcfce7")
    add_box(ax, 0.58, 0.68, 0.18, 0.14, "Repositories\nUser / Profile / Job", "#e0f2fe")
    add_box(ax, 0.80, 0.68, 0.14, 0.14, "Entities\nUser / Profile / Job", "#fef3c7")

    add_box(ax, 0.18, 0.32, 0.22, 0.14, "SecurityConfig\nCORS, authorization,\nsession behavior", "#fde68a")
    add_box(ax, 0.50, 0.32, 0.18, 0.14, "AppConfig\nRestTemplate bean", "#fce7f3")
    add_box(ax, 0.75, 0.32, 0.18, 0.14, "WebConfig\nuploads resource mapping", "#bbf7d0")

    add_arrow(ax, (0.24, 0.75), (0.32, 0.75))
    add_arrow(ax, (0.50, 0.75), (0.58, 0.75))
    add_arrow(ax, (0.76, 0.75), (0.80, 0.75))
    add_arrow(ax, (0.29, 0.46), (0.20, 0.68))
    add_arrow(ax, (0.59, 0.46), (0.41, 0.68))
    add_arrow(ax, (0.84, 0.46), (0.15, 0.68))

    ax.set_title("Backend Layered Architecture", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "backend_service_layers.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_auth_diagram() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.05, 0.72, 0.18, 0.12, "POST /register\nUserController", "#dbeafe")
    add_box(ax, 0.31, 0.72, 0.18, 0.12, "UserRepository\ncheck duplicate email", "#dcfce7")
    add_box(ax, 0.57, 0.72, 0.18, 0.12, "UserService.register\nsave User", "#e0f2fe")
    add_box(ax, 0.05, 0.46, 0.18, 0.12, "POST /login\nnormalize email", "#fef3c7")
    add_box(ax, 0.31, 0.46, 0.18, 0.12, "compare plaintext\npassword", "#fde68a")
    add_box(ax, 0.57, 0.46, 0.26, 0.12, "SecurityContextHolder +\nHttpSessionSecurityContextRepository", "#fce7f3")
    add_box(ax, 0.18, 0.18, 0.18, 0.12, "POST /me\nreturn user DTO", "#bbf7d0")
    add_box(ax, 0.50, 0.18, 0.20, 0.12, "GET /get-profile\nlookup profile via auth email", "#ede9fe")

    for y in (0.78, 0.52):
        add_arrow(ax, (0.23, y), (0.31, y))
        add_arrow(ax, (0.49, y), (0.57, y))
    add_arrow(ax, (0.70, 0.46), (0.58, 0.30))
    add_arrow(ax, (0.70, 0.46), (0.36, 0.30))

    ax.set_title("Authentication And Profile Flow", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "backend_service_auth_flow.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def wrap_text(text: str, width: int = 98) -> List[str]:
    out: List[str] = []
    for raw in text.strip().split("\n"):
        line = raw.rstrip()
        if not line:
            out.append("")
            continue
        if line.startswith("- ") or line[:3] in {"1. ", "2. ", "3. ", "4. ", "5. ", "6. ", "7. ", "8. ", "9. "}:
            out.extend(textwrap.wrap(line, width=width, subsequent_indent="   "))
        else:
            out.extend(textwrap.wrap(line, width=width))
    return out


def render_text_section(pdf: PdfPages, section: Section) -> None:
    lines = wrap_text(section.body)
    per_page = 34
    for start in range(0, len(lines), per_page):
        page = lines[start:start + per_page]
        fig = plt.figure(figsize=(8.27, 11.69))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.axis("off")
        ax.text(0.06, 0.96, section.title, fontsize=18, weight="bold", va="top")
        ax.text(0.06, 0.92, "\n".join(page), fontsize=10.1, va="top", linespacing=1.45)
        pdf.savefig(fig)
        plt.close(fig)


def render_image_page(pdf: PdfPages, title: str, image_path: Path, caption: str) -> None:
    fig = plt.figure(figsize=(8.27, 11.69))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")
    ax.text(0.06, 0.96, title, fontsize=18, weight="bold", va="top")
    img_ax = fig.add_axes([0.06, 0.22, 0.88, 0.60])
    img_ax.imshow(plt.imread(image_path))
    img_ax.axis("off")
    ax.text(0.06, 0.14, caption, fontsize=10.1, va="top", wrap=True)
    pdf.savefig(fig)
    plt.close(fig)


def build_sections() -> List[Section]:
    return [
        Section(
            "Clarification",
            """
The `backend` folder does not contain Python code. It contains a Java Spring Boot service under `backend/demo`.

So this document is a deep technical explanation of the backend Java code, its Spring libraries, how the classes are wired together, and how the backend participates in the larger system.
            """,
        ),
        Section(
            "Backend Overview",
            """
This backend is the transactional service for the internship platform. Its responsibilities are:
- registering users
- logging users in and out
- restoring the current session user
- creating and reading profile data
- accepting job creation requests
- calling the Python AI service for resume analysis and job-query generation
- exposing health and metrics endpoints through Spring Actuator

Architecturally, it is a monolithic Spring Boot application with a standard layered structure:
- controllers for HTTP endpoints
- services for business logic and outbound service calls
- repositories for persistence
- entities for database mapping
- DTOs for transport
- config classes for beans, security, and static resource handling

It runs on port `8081` and uses MySQL as its database.
            """,
        ),
        Section(
            "Project Configuration Files",
            """
`pom.xml` is the Maven build descriptor. It defines:
- project coordinates `com.app:demo:0.0.1-SNAPSHOT`
- parent `spring-boot-starter-parent` version `4.0.3`
- Java version `21`

The main runtime dependencies are:
- `spring-boot-starter-webmvc`: builds REST APIs, request mapping, JSON conversion, and MVC infrastructure
- `spring-boot-starter-data-jpa`: ORM and repository support
- `mysql-connector-j`: MySQL JDBC driver
- `spring-boot-starter-security`: security filter chain, authentication context, and authorization rules
- `spring-boot-starter-actuator`: operational endpoints like health and info
- `micrometer-registry-prometheus`: Prometheus metrics export
- `lombok`: reduces boilerplate, though in this code it is only partially used

Test dependencies:
- `spring-boot-starter-data-jpa-test`
- `spring-boot-starter-webmvc-test`
- `spring-boot-starter-security-test`

Build plugins:
- `maven-compiler-plugin` with Lombok annotation processing
- `spring-boot-maven-plugin` for packaging

`application.properties` sets:
- application name `demo`
- server port `8081`
- MySQL connection to database `Internship`
- username and password both `root`
- Hibernate `ddl-auto=update`
- SQL logging enabled
- all actuator endpoints exposed
- Prometheus endpoint enabled
            """,
        ),
        Section(
            "What The Spring Libraries Do",
            """
Spring Boot:
- auto-configures the application based on the classpath and configuration
- starts the embedded server
- wires beans together using dependency injection

Spring Web MVC:
- powers `@RestController`, `@PostMapping`, `@GetMapping`, `ResponseEntity`, and request-body binding
- converts JSON request bodies into Java objects and Java objects back into JSON responses

Spring Data JPA:
- powers `JpaRepository`
- eliminates boilerplate CRUD code
- connects entity classes to relational tables through Hibernate

Hibernate:
- is the default JPA provider
- translates entity operations into SQL
- handles schema updates because `ddl-auto=update` is enabled

Spring Security:
- inserts a security filter chain in front of requests
- stores authentication in `SecurityContextHolder`
- helps support session-based login

Spring Actuator and Micrometer:
- expose backend operational data
- provide health and metrics endpoints
- export Prometheus-compatible metrics

Lombok:
- `@Data` on `User` would normally generate getters, setters, `equals`, `hashCode`, and `toString`
- but the class also includes manual getters and setters, so Lombok is not adding much value there

RestTemplate:
- is Spring’s classic synchronous HTTP client
- used here to call the Python service from the Java backend
            """,
        ),
        Section(
            "Entry Point: DemoApplication",
            """
`DemoApplication.java` is the backend entry point.

Important pieces:
- `@SpringBootApplication` marks the main class and combines component scanning, auto-configuration, and extra configuration support.
- `SpringApplication.run(DemoApplication.class, args)` boots the application context and starts the server.

Why this class exists:
- It tells Spring where to start scanning for components.
- Because it sits at package `com.app.demo`, Spring will scan nested packages like `Config`, `Controller`, `Service`, `Repository`, and `Entity`.

This class is intentionally minimal because Spring Boot encourages convention over configuration.
            """,
        ),
        Section(
            "Configuration Classes",
            """
`AppConfig.java`
- annotated with `@Configuration`
- defines a `@Bean` method returning a `RestTemplate`
- purpose: make a reusable HTTP client available for dependency injection

`SecurityConfig.java`
- annotated with `@Configuration`
- exposes a `SecurityFilterChain`
- disables CSRF
- permits actuator routes
- permits `/login`, `/register`, `/create-job`, `/me`, `/add-profile`, and `/upload`
- then also marks `/me` as authenticated
- disables form login
- defines a `CorsConfigurationSource` allowing `http://localhost:5173`

Important subtlety:
The authorization rules are ordered. Since `/me` appears in the earlier `permitAll()` matcher, the later authenticated matcher is effectively redundant. The controller still performs auth checks itself, but the route-level security declaration is looser than intended.

`WebConfig.java`
- implements `WebMvcConfigurer`
- maps `/uploads/**` to the local filesystem `uploads` directory
- purpose: if the app stores files there, they can be served back as static resources

Interesting note:
The current code does not actually save uploaded files into that directory, because file upload is proxied to the Python service instead.
            """,
        ),
        Section(
            "Entity Classes And Database Modeling",
            """
`User`
- entity mapped to table `users`
- fields: `id`, `firstName`, `lastName`, `email`, `password`
- `email` is unique and non-null
- one-to-one relationship with `Profile`

`Profile`
- fields: `id`, `phoneNumber`, `gender`, `state`
- owns the one-to-one relationship using `@JoinColumn(name = "user_id", nullable = false)`
- each profile belongs to exactly one user

`Job`
- fields: `id`, `title`, `company`, `location`, `skills`
- intended to represent job records that can later be semantically indexed

Important modeling caveats:
- `Profile.id` is `Long`, but `ProfileRepository` uses `Integer` as the repository ID type
- `Job.skills` is a `List<String>` but lacks JPA collection mapping annotations such as `@ElementCollection`

Why these matter:
- repository generic mismatches can cause confusion or type-safety issues
- unannotated collections in JPA are not a complete relational mapping and would normally need extra configuration
            """,
        ),
        Section(
            "Repository Layer",
            """
Repositories inherit from `JpaRepository`, which means Spring automatically generates CRUD implementations at runtime.

`UserRepository`
- extends `JpaRepository<User, Integer>`
- adds `findByEmail(String email)`
- Spring derives the SQL from the method name

`ProfileRepository`
- extends `JpaRepository<Profile, Integer>`
- adds `getProfileByUserId(Integer id)`
- Spring interprets this as a query across the `user` relation and its `id`

`JobRepository`
- extends `JpaRepository<Job, Integer>`
- currently uses only inherited CRUD methods

Why repositories are useful:
- they isolate persistence concerns from controllers
- they reduce boilerplate
- they let the service layer work in terms of domain objects rather than handwritten SQL
            """,
        ),
        Section(
            "DTO Classes",
            """
The DTO package defines transport models so the API does not always expose entities directly.

`UserRegisterDTO`
- incoming payload for registration
- fields: `id`, `firstName`, `lastName`, `email`, `password`

`UserResponseDTO`
- safe outward-facing user projection
- fields: `id`, `firstName`, `lastName`, `email`

`LoginRequestDTO`
- incoming login payload
- fields: `email`, `password`

`LoginResponseDTO`
- outgoing login status
- fields: `message`, `success`

`ProfileRequestDTO`
- incoming profile creation payload
- fields: `phoneNumber`, `gender`, `state`

`JobRequestDTO`
- payload sent from the Java backend to the Python AI service
- fields: `id`, `title`, `company`, `location`, `skills`

`PythonResponseDTO`
- Java-side representation of the Python service response
- fields include generated query, embedding length, and message

`JobResponseDTO`
- final response returned by the backend after saving a job and contacting Python

Why DTOs matter:
- they control shape and intent
- they prevent accidental overexposure of entity internals
- they let the backend maintain separate contracts for frontend traffic and service-to-service traffic
            """,
        ),
        Section(
            "Service Layer",
            """
`UserService`
- annotated with `@Service`
- has two main responsibilities: register users and forward PDFs to FastAPI

`register(UserRegisterDTO userRegisterDTO)`
- creates a new `User`
- copies fields from the DTO
- normalizes email to lowercase and trims it
- stores plaintext password directly
- saves the entity via `UserRepository`
- maps the saved user into `UserResponseDTO`

`sendPdfToFastApi(MultipartFile file)`
- builds a multipart/form-data request manually
- wraps uploaded bytes in `ByteArrayResource`
- posts to `http://localhost:8000/analyze-resume`
- returns the Python JSON as a raw `Map<String, Object>`

Important design note:
`UserService` constructs its own `RestTemplate` instead of using the `RestTemplate` bean from `AppConfig`, so there are two creation styles in the codebase.

`JobService`
- annotated with `@Service`
- injected with `JobRepository` and the shared `RestTemplate` bean
- owns job persistence plus semantic indexing orchestration

`saveJobAndGenerateQuery(Job job)`
- saves the `Job` first
- builds a `JobRequestDTO`
- calls `http://127.0.0.1:8000/generate-query`
- reads the Python response into `PythonResponseDTO`
- builds a `JobResponseDTO` for the caller

Consistency consideration:
If the Python call fails after the database save succeeds, the job exists in MySQL but not in Pinecone. So persistence and semantic indexing are not transactional together.

`FileStorageService`
- currently contains only a comment `// Removed.`
- this indicates either a deleted feature or an abandoned placeholder
            """,
        ),
        Section(
            "Controller Layer",
            """
`UserController`
- `@RestController`
- `@CrossOrigin` allows the frontend origin with credentials
- owns `/register`, `/logout`, `/login`, `/me`, and `/get-profile`

`POST /register`
- checks whether the email already exists
- lowercases and trims email
- delegates to `UserService.register`
- returns `400` for duplicate email

`POST /logout`
- clears `SecurityContextHolder`
- invalidates the current session
- returns a plain success string

`POST /login`
- lowercases and trims email
- loads user by email
- compares plaintext password directly
- if valid, creates `UsernamePasswordAuthenticationToken`
- stores auth in the session via `HttpSessionSecurityContextRepository`

`POST /me`
- reads the current `Authentication`
- rejects unauthenticated or anonymous access
- returns the current user as `UserResponseDTO`

`GET /get-profile`
- reads the current user email from the security context
- loads the user and then the profile
- returns `404` if either is absent

`ProfileController`
- owns `/upload` and `/add-profile`

`POST /upload`
- accepts a multipart file
- delegates to `UserService.sendPdfToFastApi`
- returns proxied JSON from Python

`POST /add-profile`
- manually checks authentication
- loads the authenticated user
- prevents duplicate profile creation
- creates and saves a `Profile`

`JobController`
- minimal controller with one endpoint
- `POST /create-job` forwards the incoming `Job` to `JobService.saveJobAndGenerateQuery`
            """,
        ),
        Section(
            "Authentication Design",
            """
This backend uses session-style authentication rather than JWT.

How it works in this code:
1. The login endpoint validates email and password.
2. It creates a `UsernamePasswordAuthenticationToken`.
3. It stores the authentication in `SecurityContextHolder`.
4. It saves the context using `HttpSessionSecurityContextRepository`.
5. Future requests carrying the session cookie can recover the authenticated principal.

Why `SecurityContextHolder` matters:
- it is Spring Security’s central thread-local store for the current request’s authentication state

Why `HttpSessionSecurityContextRepository` matters:
- it persists the security context into the server-side HTTP session

Important security caveats:
- passwords are stored unhashed
- there is no `UserDetailsService`
- no password encoder is configured
- CSRF is disabled globally
- some endpoints rely on manual controller checks because the route security is not fully aligned with intent
            """,
        ),
        Section(
            "External Integration With The Python Service",
            """
This backend integrates with the Python AI service in two places.

Resume analysis path:
- `POST /upload` in `ProfileController`
- calls `UserService.sendPdfToFastApi`
- Java builds a multipart request and forwards the file to `http://localhost:8000/analyze-resume`

Job indexing path:
- `POST /create-job` in `JobController`
- calls `JobService.saveJobAndGenerateQuery`
- Java sends JSON to `http://127.0.0.1:8000/generate-query`

Why the backend talks to Python:
- the Java service is optimized for CRUD, sessions, and relational persistence
- the Python service is optimized for resume parsing, embeddings, and vector search

This is a practical split:
- MySQL remains the source of truth for transactional records
- Pinecone remains the source of truth for semantic representations
            """,
        ),
        Section(
            "Testing And Observability",
            """
Testing:
- there is one test class, `DemoApplicationTests`
- it contains only `contextLoads()`
- this verifies that the Spring application context can start

What is missing:
- controller tests
- service tests
- repository tests
- security behavior tests
- integration tests for Python-service calls

Observability:
- actuator endpoints are exposed
- Prometheus metrics are enabled

What this gives you:
- health endpoint for uptime checks
- metrics export for dashboards or scraping

What is not present:
- custom metrics
- structured logging strategy
- distributed tracing
            """,
        ),
        Section(
            "Strengths Of The Backend",
            """
Good parts of the current backend:
- clear layered organization
- reasonable separation between controllers, services, repositories, and DTOs
- easy-to-follow request flow
- working cross-service integration with the Python AI layer
- actuator and metrics support are already present
- email normalization is handled during login and registration
- one-to-one profile modeling is straightforward

For interview discussion, these strengths show:
- knowledge of Spring conventions
- awareness of service boundaries
- ability to connect transactional and AI-oriented subsystems
            """,
        ),
        Section(
            "Risks And Improvement Ideas",
            """
Current risks:
- plaintext password storage and comparison
- permissive or inconsistent security matcher configuration
- incomplete JPA mapping for `Job.skills`
- repository generic mismatch for `Profile`
- duplicate `micrometer-registry-prometheus` dependency in `pom.xml`
- `UserService` bypasses the shared `RestTemplate` bean
- no resilience around outbound HTTP calls
- almost no tests

Improvements that would help:
- add `BCryptPasswordEncoder`
- use a proper authentication service or `UserDetailsService`
- align security matcher rules with controller intent
- annotate `Job.skills` correctly for JPA
- add exception handlers with `@ControllerAdvice`
- centralize outbound HTTP configuration, timeouts, and error handling
- expand automated tests across controller, service, and integration levels
- move hardcoded service URLs into configuration properties
            """,
        ),
        Section(
            "Interview Explanation Script",
            """
If you need to explain this backend in an interview, say:

1. The backend is a Spring Boot service that owns transactional data and session-based authentication.
2. It persists users, profiles, and jobs in MySQL through Spring Data JPA and Hibernate.
3. Controllers accept frontend requests, services implement business logic, and repositories handle persistence.
4. Spring Security is used to manage session authentication through `SecurityContextHolder` and the HTTP session.
5. When a job is created or a resume is uploaded, the backend calls a separate Python service through `RestTemplate`.
6. That Python service handles AI-specific tasks such as resume parsing and semantic indexing.

If they ask what you would improve first:
Say password hashing, stronger security rules, proper JPA mapping for job skills, and broader test coverage.
            """,
        ),
    ]


def save_markdown(sections: Sequence[Section], diagrams: Sequence[Path]) -> None:
    lines = [
        "# Backend Service Detailed Documentation",
        "",
        "Generated from local inspection of the Spring Boot backend under `backend/demo`.",
        "",
        "## Diagram Assets",
        "",
    ]
    for path in diagrams:
        lines.append(f"- `assets/{path.name}`")
    lines.append("")
    for section in sections:
        lines.append(f"## {section.title}")
        lines.append("")
        lines.append(section.body.strip())
        lines.append("")
    MD_PATH.write_text("\n".join(lines), encoding="utf-8")


def build_pdf(sections: Sequence[Section], diagrams: Sequence[Path]) -> None:
    with PdfPages(PDF_PATH) as pdf:
        title = plt.figure(figsize=(8.27, 11.69))
        ax = title.add_axes([0, 0, 1, 1])
        ax.axis("off")
        ax.text(0.06, 0.93, "Backend Service Detailed Documentation", fontsize=24, weight="bold", va="top")
        ax.text(0.06, 0.86, "Deep dive into the Java Spring Boot backend in `backend/demo`", fontsize=11.5)
        ax.text(
            0.06,
            0.76,
            "\n".join(
                [
                    "- explains the backend from top to bottom",
                    "- covers Spring libraries and why each one is present",
                    "- documents entities, repositories, services, controllers, and configs",
                    "- includes diagrams plus interview-ready talking points",
                ]
            ),
            fontsize=10.8,
            va="top",
            linespacing=1.5,
        )
        ax.text(0.06, 0.61, "Important note", fontsize=14, weight="bold")
        ax.text(0.06, 0.57, "The backend folder contains Java, not Python. This PDF documents the actual backend code present in the repository.", fontsize=10.8, va="top")
        pdf.savefig(title)
        plt.close(title)

        render_image_page(
            pdf,
            "Dependency Map",
            diagrams[0],
            "This diagram groups the main backend technologies by responsibility: web API, persistence, security, observability, and Python-service integration.",
        )
        render_image_page(
            pdf,
            "Layered Architecture",
            diagrams[1],
            "This shows how requests typically move through controllers, services, repositories, entities, and supporting configuration classes.",
        )
        render_image_page(
            pdf,
            "Authentication Flow",
            diagrams[2],
            "This summarizes the registration, login, session creation, current-user lookup, and profile retrieval flow used by the backend.",
        )

        for section in sections:
            render_text_section(pdf, section)


def main() -> None:
    ensure_dirs()
    diagrams = [
        generate_dependency_diagram(),
        generate_layer_diagram(),
        generate_auth_diagram(),
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
