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
PDF_PATH = DOCS_DIR / "Frontend_Service_Detailed_Documentation.pdf"
MD_PATH = DOCS_DIR / "Frontend_Service_Detailed_Documentation.md"


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

    add_box(ax, 0.36, 0.72, 0.28, 0.14, "Frontend App\nReact + Vite", "#dbeafe")
    add_box(ax, 0.06, 0.42, 0.18, 0.14, "React / ReactDOM\ncomponent rendering", "#dcfce7")
    add_box(ax, 0.28, 0.42, 0.18, 0.14, "React Router\nclient-side routing", "#e0f2fe")
    add_box(ax, 0.50, 0.42, 0.18, 0.14, "Tailwind CSS + PostCSS\nstyling system", "#fef3c7")
    add_box(ax, 0.72, 0.42, 0.18, 0.14, "Framer Motion + Lucide\nanimation and icons", "#fde68a")
    add_box(ax, 0.20, 0.14, 0.22, 0.14, "Radix Slot/Label + CVA\nreusable UI primitives", "#fce7f3")
    add_box(ax, 0.58, 0.14, 0.22, 0.14, "fetch + localStorage\nAPI calls and session state", "#bbf7d0")

    add_arrow(ax, (0.50, 0.72), (0.15, 0.56))
    add_arrow(ax, (0.50, 0.72), (0.37, 0.56))
    add_arrow(ax, (0.50, 0.72), (0.59, 0.56))
    add_arrow(ax, (0.50, 0.72), (0.81, 0.56))
    add_arrow(ax, (0.32, 0.42), (0.31, 0.28))
    add_arrow(ax, (0.68, 0.42), (0.69, 0.28))

    ax.set_title("Frontend Dependency Map", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "frontend_service_dependency_map.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_route_diagram() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.08, 0.72, 0.22, 0.14, "main.jsx\nReactDOM + AuthProvider", "#dbeafe")
    add_box(ax, 0.39, 0.72, 0.22, 0.14, "App.jsx\nBrowserRouter", "#dcfce7")
    add_box(ax, 0.70, 0.72, 0.20, 0.14, "AuthContext\nsession bootstrap", "#e0f2fe")

    add_box(ax, 0.07, 0.36, 0.24, 0.14, "/\nHeader + LandingView +\nMarquee + Footer", "#fef3c7")
    add_box(ax, 0.38, 0.36, 0.24, 0.14, "/add-profile\nHeader + Profile + Footer", "#fde68a")
    add_box(ax, 0.69, 0.36, 0.24, 0.14, "/get-jobs\nSearchJobs", "#fce7f3")

    add_box(ax, 0.24, 0.10, 0.20, 0.12, "Signin / Signup\nmodal overlays", "#bbf7d0")
    add_box(ax, 0.58, 0.10, 0.20, 0.12, "Header checks\n/me and /get-profile", "#ede9fe")

    add_arrow(ax, (0.30, 0.79), (0.39, 0.79))
    add_arrow(ax, (0.61, 0.79), (0.70, 0.79))
    add_arrow(ax, (0.50, 0.72), (0.19, 0.50))
    add_arrow(ax, (0.50, 0.72), (0.50, 0.50))
    add_arrow(ax, (0.50, 0.72), (0.81, 0.50))
    add_arrow(ax, (0.28, 0.36), (0.34, 0.22))
    add_arrow(ax, (0.50, 0.36), (0.68, 0.22))

    ax.set_title("Frontend Route And State Map", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "frontend_service_routes.png"
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close(fig)
    return out


def generate_resume_flow_diagram() -> Path:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.05, 0.60, 0.16, 0.14, "SearchJobs.jsx\nupload resume", "#dbeafe")
    add_box(ax, 0.28, 0.60, 0.18, 0.14, "POST /analyze-resume\nFastAPI", "#dcfce7")
    add_box(ax, 0.53, 0.60, 0.18, 0.14, "build or reuse\nresume_query", "#e0f2fe")
    add_box(ax, 0.76, 0.60, 0.18, 0.14, "GET /search\nFastAPI", "#fef3c7")

    add_box(ax, 0.18, 0.20, 0.22, 0.14, "filter matches\nscore > 0.35", "#fde68a")
    add_box(ax, 0.56, 0.20, 0.24, 0.14, "render job cards\ntitle, company,\nlocation, skills, score", "#fce7f3")

    add_arrow(ax, (0.21, 0.67), (0.28, 0.67))
    add_arrow(ax, (0.46, 0.67), (0.53, 0.67))
    add_arrow(ax, (0.71, 0.67), (0.76, 0.67))
    add_arrow(ax, (0.85, 0.60), (0.32, 0.34))
    add_arrow(ax, (0.40, 0.27), (0.56, 0.27))

    ax.set_title("Frontend Resume Matching Flow", fontsize=18, weight="bold", pad=20)
    out = ASSETS_DIR / "frontend_service_resume_flow.png"
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
The `frontend` folder does not contain Python code. It contains a React/Vite JavaScript frontend.

So this document explains the actual frontend code present in the repository: JavaScript modules, React components, routing, styling, state management, animations, and browser-side API integration.
            """,
        ),
        Section(
            "Frontend Overview",
            """
This frontend is the user-facing web application for the internship platform. It provides:
- a marketing-style landing page
- sign-in and sign-up modal flows
- profile creation and PDF upload
- resume-based job recommendation search
- shared navigation and footer elements

Architecturally, it is a single-page application built with:
- React for component rendering
- Vite for development and bundling
- React Router for client-side navigation
- Tailwind CSS for styling
- Framer Motion for animation
- Lucide icons for iconography
- a small custom AuthContext for session bootstrap and user state
            """,
        ),
        Section(
            "Configuration And Tooling Files",
            """
`package.json`
- identifies the frontend package
- sets `"type": "module"` so the project uses ES modules
- defines scripts:
  - `dev`: starts the Vite dev server
  - `build`: creates a production bundle
  - `preview`: previews the build locally

Key dependencies:
- `react`, `react-dom`: the UI framework
- `react-router-dom`: client-side routing
- `framer-motion`: animations and transitions
- `lucide-react`: SVG icon components
- `@radix-ui/react-label` and `@radix-ui/react-slot`: low-level UI composition helpers
- `class-variance-authority`, `clsx`, `tailwind-merge`: utility stack for composable class names

Dev dependencies:
- `vite`: build tool and dev server
- `@vitejs/plugin-react`: React support for Vite
- `tailwindcss`, `postcss`, `autoprefixer`: styling build pipeline

`vite.config.js`
- enables the React plugin
- defines alias `@` pointing to `./src`
- this makes imports like `@/lib/utils` possible

`tailwind.config.js`
- declares which files Tailwind should scan for class names
- extends the default theme with custom colors, fonts, animations, and keyframes
            """,
        ),
        Section(
            "How The Frontend Libraries Work",
            """
React:
- lets the app be written as reusable components
- manages state and UI updates declaratively

ReactDOM:
- mounts the React tree into the real browser DOM

React Router:
- keeps navigation inside the SPA without full page reloads
- maps URLs like `/`, `/add-profile`, and `/get-jobs` to components

Vite:
- provides fast development startup and hot module replacement
- bundles the app for production

Tailwind CSS:
- uses utility classes instead of writing most component-specific CSS by hand
- makes layout, spacing, typography, and colors fast to apply inline in JSX

Framer Motion:
- adds animated transitions
- used in the marquee and gallery carousel

Lucide React:
- provides SVG icons as React components
- used heavily in the landing page, header, footer, and search cards

Radix Slot and Label:
- support accessible, composable UI primitives

class-variance-authority, clsx, and tailwind-merge:
- help build reusable button and input components with variants
- avoid conflicting Tailwind class combinations
            """,
        ),
        Section(
            "Entry Point: main.jsx",
            """
`main.jsx` is the frontend boot file.

What it does:
- imports React and ReactDOM
- imports the root `App` component
- imports `AuthProvider`
- finds the DOM node with id `root`
- renders the app inside `React.StrictMode`

Why `AuthProvider` wraps the app:
- it exposes shared auth state and helper functions to any component through React context

Why `StrictMode` is there:
- it helps catch certain lifecycle and side-effect issues in development
- it does not render extra UI for users in production
            """,
        ),
        Section(
            "Root Composition: App.jsx",
            """
`App.jsx` defines the app shell and route structure.

Key responsibilities:
- holds local modal state for sign-in and sign-up
- reads `isInitializing` from the auth context
- shows a loading spinner while session bootstrap runs
- defines the SPA routes using `BrowserRouter`, `Routes`, and `Route`

Routes:
- `/`: landing page with `Header`, `LandingView`, `Marquee`, `Footer`, and conditional auth modals
- `/add-profile`: profile creation page with header and footer
- `/get-jobs`: resume-based job recommendation page

Interesting design choice:
- sign-in and sign-up are not standalone pages; they are modal overlays on top of the landing page route

UI behavior:
- when a modal is open, the landing content gets a blur class
- modal open/close is controlled by local state rather than global routing
            """,
        ),
        Section(
            "AuthContext: Frontend State Hub",
            """
`AuthContext.jsx` is the main shared state layer.

What it stores:
- `user`
- `isInitializing`

How it initializes:
- tries to read a saved user from `localStorage`
- on mount, calls `fetchCurrentUser()`
- `fetchCurrentUser()` sends `POST http://localhost:8081/me` with `credentials: 'include'`
- if the backend session is valid, it normalizes and stores the returned user
- if not, it clears local auth state

Provided functions:
- `login(email, password)`
- `register(payload)`
- `logout()`
- `refetchUser()`

Important inconsistency:
- `fetchCurrentUser()` talks to backend port `8081`
- `login()` and `register()` in this context point to port `8080`
- meanwhile the UI modal components themselves call `8081`

That means the codebase has two competing frontend auth strategies, and only one matches the configured backend port.
            """,
        ),
        Section(
            "Styling System",
            """
`src/styles/index.css` is the main global stylesheet and Tailwind entry file.

It begins with:
- `@tailwind base`
- `@tailwind components`
- `@tailwind utilities`

It then adds custom base styles:
- body uses a green-blue gradient background
- headings use the custom heading font and strong text styling

Reusable CSS utilities include:
- `.glass-panel`: translucent card surface with blur
- `.glass-nav`: sticky translucent navbar
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`
- `.footer-gradient`

Theme values come from `tailwind.config.js`:
- primary blue and secondary green
- semantic match colors
- text colors
- fonts `Outfit` and `Inter`
- custom animations like fade-in and horizontal scrolling

Overall visual language:
- the design leans into glassmorphism, soft gradients, and rounded surfaces
- the landing page is more polished than the data-entry pages
            """,
        ),
        Section(
            "Reusable UI Primitives",
            """
The `components/ui` folder contains low-level reusable components.

`button.jsx`
- uses `class-variance-authority` to define button variants and sizes
- uses Radix `Slot` to support `asChild`
- merges classes with `cn()`

`card.jsx`
- defines `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`
- these wrap common container styles into reusable building blocks

`input.jsx`
- wraps a styled HTML input element with `forwardRef`

`label.jsx`
- wraps Radix label primitive with shared styling

`lib/utils.js`
- defines `cn(...inputs)`
- combines `clsx` and `tailwind-merge`
- purpose: build class strings safely and avoid duplicate/conflicting Tailwind utilities
            """,
        ),
        Section(
            "Layout Components",
            """
`Header.jsx`
- shows brand identity, nav actions, auth buttons, and user badge
- uses `useNavigate()` for route changes
- uses `useAuth()` to read current user and logout helper
- checks `/get-profile` when a user is present
- conditionally shows `Add Profile` or `Update Profile`
- includes a development-oriented `Check /me` button that triggers alerts
- logout posts to `/logout`, clears local state, navigates home, and reloads the page

`Footer.jsx`
- contains quick links, candidate links, social icons, and a simple email subscription input
- supports smooth scrolling to landing-page sections

Both components are route-aware and help make the app feel like one continuous experience even though content changes by route.
            """,
        ),
        Section(
            "Auth Modal Components",
            """
`Signin.jsx`
- local state: `email`, `password`, `error`
- posts credentials to `http://localhost:8081/login`
- expects a successful login and then closes the modal and reloads the page

Important bug:
- it reads the response using `response.text()`
- then writes `data.token` to local storage
- but `data` is a string, not an object, so `data.token` is effectively invalid

`Signup.jsx`
- local state: firstName, lastName, email, password, error
- posts to `http://localhost:8081/register`
- on success it shows an alert and clears the form
- it does not automatically log the user in

Why these components use cards and labels:
- they reuse the shared UI primitive layer to stay visually consistent
- the modal structure is simple and easy to understand for interview explanations
            """,
        ),
        Section(
            "Profile Page Component",
            """
`Profile.jsx` is the form page behind `/add-profile`.

It handles two different workflows:
- profile creation
- resume PDF upload

Profile form state:
- `id`
- `phoneNumber`
- `gender`
- `state`

Behavior:
- submits JSON to `POST http://localhost:8081/add-profile`
- includes cookies via `credentials: 'include'`
- resets the form on success

Upload behavior:
- stores a selected PDF file in state
- builds a `FormData`
- posts it to `POST http://localhost:8081/upload`
- shows success or error text

Interesting detail:
- the form includes an `id` field, but the backend `ProfileRequestDTO` does not use `id`
- so that field is present in the UI without being meaningful to backend profile creation
            """,
        ),
        Section(
            "Landing Page Components",
            """
`LandingView.jsx`
- hero section
- CTA buttons
- feature cards
- about section
- gallery section
- contact section

It uses:
- `useNavigate()` for CTA navigation
- Lucide icons for feature and contact visuals
- remote Unsplash imagery in the about section

`Marquee.jsx`
- defines arrays of public SVG asset paths
- currently renders only one marquee row even though a second array exists

`MarqueeItem.jsx`
- uses Framer Motion to create a continuous horizontal scroll
- duplicates the image sequence twice so the animation can loop smoothly

`GalleryCarousel.jsx`
- rotates through an array of remote images
- uses `useEffect` with `setInterval` for auto-advance
- uses Framer Motion and `AnimatePresence` for transitions
- provides navigation bullets and left/right arrows

These components make the landing page much more presentation-oriented than the rest of the app.
            """,
        ),
        Section(
            "SearchJobs Component And Resume Matching Flow",
            """
`SearchJobs.jsx` is the frontend entry point for candidate-side matching.

Local state:
- `jobs`
- `loading`
- `error`
- `resumeFile`
- `hasSearched`

Main flow:
1. User picks a PDF file.
2. Component posts the file directly to `http://127.0.0.1:8000/analyze-resume`.
3. It reads the returned `resume_query`.
4. If the backend did not provide one, it creates a fallback query from summary plus skills.
5. It then calls `http://127.0.0.1:8000/search?query=...&top_k=5`.
6. It filters matches to scores greater than `0.35`.
7. It renders job cards.

Rendered job card content:
- title
- score badge
- company
- location
- skills

Important mismatch:
- the UI comment and empty-state text mention `score greater than 2.5`
- but the actual filter keeps `score > 0.35`
- so the user-facing text does not match the code logic

Architecture note:
- this page talks directly to the Python service instead of routing through the Java backend
            """,
        ),
        Section(
            "Placeholder And Unused Components",
            """
The dashboard folder contains:
- `ProfileWizard.jsx`
- `ProfileDashboard.jsx`
- `MatchDashboard.jsx`
- `AddDetails.jsx`

All four currently export:
- `const RemovedComponent = () => null;`

That means:
- they are placeholders or remnants of removed functionality
- they are not active features
- they should be described honestly in interviews as unused or future-facing scaffold files

Public assets:
- the `public` folder contains 22 SVG files
- these are used by the marquee animation
            """,
        ),
        Section(
            "Data Flow And API Integration",
            """
This frontend talks to two backends.

Spring Boot backend:
- `/register`
- `/login`
- `/logout`
- `/me`
- `/get-profile`
- `/add-profile`
- `/upload`

FastAPI backend:
- `/analyze-resume`
- `/search`

State mechanisms used in the browser:
- React local state with `useState`
- boot-time side effects with `useEffect`
- shared auth state through React Context
- persistence through `localStorage`
- browser session cookies through `credentials: 'include'`

This creates a hybrid client:
- Java backend for auth and profile management
- Python backend for resume analysis and job recommendation retrieval
            """,
        ),
        Section(
            "Strengths Of The Frontend",
            """
Good parts of the implementation:
- clear route structure
- easy-to-follow component hierarchy
- shared auth context for session bootstrap
- reusable UI primitive layer
- expressive landing page with motion and visuals
- direct, understandable resume-search workflow
- small enough to explain fully in an interview

The frontend is especially good as a demo application because the main user journeys are visible quickly:
- discover the platform
- sign up or sign in
- create a profile
- upload a resume and get matching jobs
            """,
        ),
        Section(
            "Risks And Improvement Ideas",
            """
Current issues:
- inconsistent backend ports (`8080` vs `8081`)
- duplicated auth logic between context and modal components
- `Signin.jsx` incorrectly treats text as if it were JSON with a token
- direct browser calls to multiple backends can complicate deployment
- placeholder dashboard files are still present
- some text is clearly leftover debug or temporary UI, such as the `Check /me` button
- success and threshold messaging in job search does not match the actual filtering logic

Improvements:
- centralize API calls into one client module
- unify auth flow in `AuthContext`
- remove or hide debug UI before production
- create real route guards for profile and job-search pages
- replace hardcoded URLs with environment variables
- either remove placeholder dashboard files or implement them
            """,
        ),
        Section(
            "Interview Explanation Script",
            """
If you need to explain this frontend in an interview, say:

1. The frontend is a React single-page app built with Vite.
2. It uses React Router for navigation, Tailwind for styling, Framer Motion for animation, and Lucide for icons.
3. Auth state is managed through a small React context that restores the current user from the backend session.
4. The landing page is a presentation layer, while `/add-profile` and `/get-jobs` are the main task-driven screens.
5. The app talks to the Java backend for authentication and profile management, and to the Python backend for resume analysis and semantic job search.

If they ask what you would improve first:
Say you would unify the API client, fix the auth inconsistencies, move URLs to environment variables, and clean up the leftover placeholder and debug code.
            """,
        ),
    ]


def save_markdown(sections: Sequence[Section], diagrams: Sequence[Path]) -> None:
    lines = [
        "# Frontend Service Detailed Documentation",
        "",
        "Generated from local inspection of the React/Vite frontend under `frontend`.",
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
        ax.text(0.06, 0.93, "Frontend Service Detailed Documentation", fontsize=24, weight="bold", va="top")
        ax.text(0.06, 0.86, "Deep dive into the React/Vite frontend in `frontend`", fontsize=11.5)
        ax.text(
            0.06,
            0.76,
            "\n".join(
                [
                    "- explains the frontend from top to bottom",
                    "- covers React, Vite, Router, Tailwind, Framer Motion, and utility libraries",
                    "- documents routes, context, components, styling, and API flows",
                    "- includes diagrams and interview-ready talking points",
                ]
            ),
            fontsize=10.8,
            va="top",
            linespacing=1.5,
        )
        ax.text(0.06, 0.61, "Important note", fontsize=14, weight="bold")
        ax.text(0.06, 0.57, "The frontend folder contains JavaScript/JSX, not Python. This PDF documents the actual frontend code present in the repository.", fontsize=10.8, va="top")
        pdf.savefig(title)
        plt.close(title)

        render_image_page(
            pdf,
            "Dependency Map",
            diagrams[0],
            "This groups the frontend libraries by role: rendering, routing, styling, motion, reusable UI, and browser-side state/API interaction.",
        )
        render_image_page(
            pdf,
            "Route Map",
            diagrams[1],
            "This shows how `main.jsx`, `App.jsx`, the auth context, and the three active routes fit together.",
        )
        render_image_page(
            pdf,
            "Resume Search Flow",
            diagrams[2],
            "This captures the most important frontend feature flow: uploading a resume, generating a semantic query, searching matches, and rendering recommendation cards.",
        )

        for section in sections:
            render_text_section(pdf, section)


def main() -> None:
    ensure_dirs()
    diagrams = [
        generate_dependency_diagram(),
        generate_route_diagram(),
        generate_resume_flow_diagram(),
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
