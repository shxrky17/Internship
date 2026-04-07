# Copilot Instructions: Internship Project

**Project Type**: Full-stack Job Matching Platform (Java Spring Boot + React Frontend + Python Vector Search)  
**Last Updated**: April 2026

---

## Project Structure

This is a **3-tier architecture** project:

```
backend/demo/          → Spring Boot REST API (port 8081) - Java 21, Maven, MySQL
frontend/              → React 18 + Vite + Tailwind CSS - TypeScript optional
resume/main.py         → Python FastAPI service - Vector embeddings & semantic search (Pinecone)
Jenkinsfile            → CI/CD pipeline orchestrating all three builds
```

See [README.md](README.md) for Jenkins CI/CD setup details.

---

## Essential Build & Run Commands

### Backend (Spring Boot)
```bash
cd backend/demo

# Development (runs on port 8081)
mvnw.cmd spring-boot:run

# Build (skip tests)
mvnw.cmd clean install -DskipTests

# Run tests
mvnw.cmd test

# View logs & metrics
curl http://localhost:8081/actuator/health      # Health check
curl http://localhost:8081/actuator/prometheus  # Metrics
```

### Frontend (Vite + React)
```bash
cd frontend

# Development server (hot reload, http://localhost:5173 by default)
npm run dev

# Production build → dist/
npm run build

# Preview production build
npm preview
```

### Python Resume Service
```bash
cd resume

# Install dependencies
pip install -r requirements.txt  # if it exists, or use: pip install fastapi pydantic sentence-transformers pinecone-client python-dotenv

# Run UV server (typically on port 8000)
uvicorn main:app --reload
```

---

## Database & Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| **Database** | MySQL on `localhost:3306` | Database: "Internship", User: root, Password: root |
| **Hibernate DDL** | `update` | Auto-creates/updates tables on startup |
| **Backend Port** | 8081 | Spring Boot Server |
| **Frontend Port** | 5173 | Vite dev server (or 8081 when built) |
| **Python Service Port** | 8000 | FastAPI server |

**Spring Actuator Enabled** - Metrics/health available at `/actuator/*`  
**Spring Security Configured** - See `backend/demo/src/main/java/.../Config/SecurityConfig.java`

---

## Key Architecture Decisions

### Backend (Java Spring Boot)
- **Package Structure**: `com.app.demo.{Controller, Service, Entity, DTO, Repository, Config}`
- **ORM**: JPA + Hibernate with Lombok for boilerplate reduction
- **REST API**: Stateless endpoints via `JobController` and `UserController`
- **Security**: Spring Security + SecurityConfig (JWT patterns expected)
- **Dependencies**: Spring Data JPA, MySQL Connector, Micrometer/Prometheus, Spring Actuator

### Frontend (React + Vite)
- **Component Library**: Radix-UI primitives + Tailwind CSS (shadcn-style pattern)
- **State Management**: React Context (see `src/context/AuthContext.jsx`)
- **Routing**: React Router v7 (import from context, check for protected routes)
- **Import Alias**: `@/` resolves to `src/` (configured in `vite.config.js`)
- **Icons**: Lucide React | Animation: Framer Motion

### Python Service
- **Purpose**: Job query generation + vector embedding storage/search
- **APIs**: POST `/generate-query`, GET `/search`
- **Vector DB**: Pinecone (requires API key in `.env`)
- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Environment Variables**: `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`, `PINECONE_NAMESPACE`

---

## Common Development Patterns

### Java Spring Boot
- **Controllers respond with DTOs** (not raw entities)
- **@Service methods** contain business logic, repositories handle data access
- **Exception handling** typically done in SecurityConfig or global exception handler
- **Configuration beans** split into AppConfig, SecurityConfig, WebConfig

### React Components
- **Functional components** with hooks (useState, useContext, useEffect)
- **AuthContext** for user state - check provider in `App.jsx` before consuming
- **UI components** in `src/components/ui/` - reuse existing button, card, input, label
- **Path alias** `@/` available for cleaner imports

### API Integration
- Ensure CORS is configured in `WebConfig.java` before cross-origin requests
- Backend typically returns `{ data: {...}, status: ... }` or similar JSON structure
- FastAPI service handles vector operations separately

---

## Potential Pitfalls & Tips

| Issue | Solution |
|-------|----------|
| **Maven offline mode** | Run `mvnw.cmd clean install -DskipTests` first to download all dependencies |
| **Port conflicts** (8081, 5173, 8000) | Check `netstat -ano` (Windows) or `lsof -i` (Mac/Linux); kill/reassign ports |
| **MySQL connection fails** | Verify MySQL is running on `localhost:3306` with user `root`/`root` |
| **Pinecone API key missing** | Add `PINECONE_API_KEY` to Python `.env` (not committed to repo) |
| **Frontend builds stale** | Clear `frontend/dist/` and run `npm run build` again |
| **Hibernate DDL issues** | Check `application.properties` for `hibernate.ddl-auto=update` |
| **Hot reload not working** | Verify dev server is actually running; check console for errors |

---

## Running the Full Stack Locally

1. **Start MySQL** (ensure running on port 3306)
2. **Terminal 1 - Backend**:
   ```bash
   cd backend/demo
   mvnw.cmd spring-boot:run  # Runs on port 8081
   ```
3. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev  # Runs on port 5173
   ```
4. **Terminal 3 - Python Service** (if working with embeddings):
   ```bash
   cd resume
   uvicorn main:app --reload  # Runs on port 8000
   ```

Access the application at `http://localhost:5173` (frontend forwards to backend as needed).

---

## Testing & Quality

- **Backend Tests**: `cd backend/demo && mvnw.cmd test` (tests in `src/test/`)
- **Frontend Tests**: Check `frontend/package.json` for test runner and coverage tools
- **CI/CD**: Jenkins pipeline runs all three builds + tests (see [README.md](README.md))

---

## When Working on Specific Areas

### If implementing a new REST endpoint
- Create controller method in `backend/demo/src/main/java/.../Controller/`
- Define DTO in `DTO/` folder for request/response
- Add service logic in `Service/`
- Ensure SecurityConfig permits the route if protected

### If creating a new React component
- Place in `frontend/src/components/{category}/`
- Import UI primitives from `components/ui/`
- Use `@/` alias for cleaner imports
- Check `AuthContext` for user state

### If adding Python code
- Ensure FastAPI async patterns are followed
- Document Pinecone operations clearly
- Test locally before deploying via Jenkins

---

## Repository Information

- **Repository**: shxrky17/Internship
- **Current Branch**: main
- **Default Branch**: main
- **Git Setup**: Standard GitHub workflow (clone, branch, PR, merge)

---

## Quick Reference: Tech Stack

| Layer | Tech | Version | Port |
|-------|------|---------|------|
| API Server | Spring Boot | 4.0.3 | 8081 |
| Runtime | Java | 21 | — |
| DB | MySQL | 5.7+ | 3306 |
| Frontend | React | 18.2 | 5173 |
| Build (Frontend) | Vite | 5.0 | — |
| Styling | Tailwind CSS | Latest | — |
| Python Service | FastAPI | Latest | 8000 |
| Vector DB | Pinecone | (Cloud) | — |
| CI/CD | Jenkins | (deployed) | — |

---

**For questions about build setup or CI/CD, see [README.md](README.md). This file is versioned and should be updated as conventions evolve.**
