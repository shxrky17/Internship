# Frontend Service Detailed Documentation

Generated from local inspection of the React/Vite frontend under `frontend`.

## Diagram Assets

- `assets/frontend_service_dependency_map.png`
- `assets/frontend_service_routes.png`
- `assets/frontend_service_resume_flow.png`

## Clarification

The `frontend` folder does not contain Python code. It contains a React/Vite JavaScript frontend.

So this document explains the actual frontend code present in the repository: JavaScript modules, React components, routing, styling, state management, animations, and browser-side API integration.

## Frontend Overview

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

## Configuration And Tooling Files

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

## How The Frontend Libraries Work

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

## Entry Point: main.jsx

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

## Root Composition: App.jsx

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

## AuthContext: Frontend State Hub

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

## Styling System

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

## Reusable UI Primitives

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

## Layout Components

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

## Auth Modal Components

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

## Profile Page Component

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

## Landing Page Components

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

## SearchJobs Component And Resume Matching Flow

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

## Placeholder And Unused Components

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

## Data Flow And API Integration

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

## Strengths Of The Frontend

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

## Risks And Improvement Ideas

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

## Interview Explanation Script

If you need to explain this frontend in an interview, say:

1. The frontend is a React single-page app built with Vite.
2. It uses React Router for navigation, Tailwind for styling, Framer Motion for animation, and Lucide for icons.
3. Auth state is managed through a small React context that restores the current user from the backend session.
4. The landing page is a presentation layer, while `/add-profile` and `/get-jobs` are the main task-driven screens.
5. The app talks to the Java backend for authentication and profile management, and to the Python backend for resume analysis and semantic job search.

If they ask what you would improve first:
Say you would unify the API client, fix the auth inconsistencies, move URLs to environment variables, and clean up the leftover placeholder and debug code.
