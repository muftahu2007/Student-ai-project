# Module 1 — Project Setup & Dependency Resolution

> **Period:** July 23, 2026  
> **Goal:** Bootstrap the project environment and resolve all blocking configuration errors

---

## 1.1 Project Overview at Session Start

When the session began, the user had a multi-part project on their desktop:

```
C:\Users\Muftahu\Desktop\Buk Student Ai Assistant\
├── backend\              ← Django REST API (Python)
├── sign in lovable\      ← Main React dashboard (production)
├── Ai dashboard\         ← Secondary React UI (TanStack Start)
└── venv\                 ← Python virtual environment
```

Both frontend projects were scaffolded but the `Ai dashboard` had **no installed dependencies** (`node_modules` was missing).

---

## 1.2 Error #1 — `Cannot find type definition file for 'vite/client'`

### Root Cause
The TypeScript compiler (`tsconfig.json`) referenced `"types": ["vite/client"]` but the `vite` package was not installed. Without `node_modules`, TypeScript could not resolve the type definition file.

**Affected File:** `Ai dashboard/tsconfig.json`
```json
{
  "compilerOptions": {
    "types": ["vite/client"],   ← This line caused the error
    ...
  }
}
```

### Resolution
Ran `npm install --legacy-peer-deps` inside `Ai dashboard/`.

> **Why `--legacy-peer-deps`?** The project uses `@lovable.dev/vite-tanstack-config` which had a version conflict with `nitro`. The `--legacy-peer-deps` flag bypasses strict peer dependency checking, allowing the installation to complete successfully.

```bash
cd "Ai dashboard"
npm install --legacy-peer-deps
```

---

## 1.3 Error #2 — `End of file expected` in `tsconfig.json`

### Root Cause
While trying to fix the first error, the user accidentally changed the opening `{` on line 1 to `{}` — a complete closed JSON object. This made everything from line 2 onward **invalid JSON**, causing a secondary parse error.

**Broken state (line 1):**
```json
{}                          ← Closed on line 1!
  "include": ["src/**..."],  ← Now orphaned/invalid
```

### Resolution
Corrected line 1 back to an opening brace `{`:
```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts", "eslint.config.js"],
  "compilerOptions": {
    ...
  }
}
```

---

## 1.4 Dependency Analysis

After successful installation, the project had **70 direct dependencies**:

### Runtime Dependencies (53)

| Category | Key Packages |
|---|---|
| **Framework** | `react`, `react-dom` |
| **Routing** | `@tanstack/react-router` |
| **Data Fetching** | `@tanstack/react-query` |
| **UI Components** | `@radix-ui/*` (12+ packages), `lucide-react` |
| **Styling** | `tailwindcss`, `tw-animate-css`, `class-variance-authority` |
| **Charts** | `recharts` |
| **Forms** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **AI/Streaming** | Handled via custom `lib/api.ts` calls to Django backend |
| **Notifications** | `sonner` |
| **Animations** | `framer-motion` |
| **Date/Time** | `date-fns` |
| **Markdown** | `react-markdown`, `rehype-*`, `remark-*` |
| **Mind Maps** | `mermaid` |

### Dev Dependencies (17)

| Package | Purpose |
|---|---|
| `vite` | Build tool / dev server |
| `typescript` | Type checking |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `@lovable.dev/vite-tanstack-config` | TanStack Start Vite configuration |

### Impact Analysis

**✅ Positives:**
- Accelerated development by months — no need to build UI primitives from scratch
- Enterprise-grade tools (TanStack Router, React Query) for robust architecture
- Recharts provides polished, animated data visualization
- Framer Motion enables smooth, professional animations

**⚠️ Negatives:**
- Larger initial bundle size (mitigated by tree-shaking)
- `--legacy-peer-deps` required — indicates upstream dependency drift
- More packages = more potential security surface (run `npm audit` periodically)

---

## 1.5 Running the Project

```bash
# Backend
cd backend
python manage.py runserver         # Runs on http://127.0.0.1:8000

# Frontend (sign in lovable — main dashboard)
cd "sign in lovable"
npm run dev                        # Runs on http://localhost:5173

# Frontend (Ai dashboard — experimental UI)
cd "Ai dashboard"
npm install --legacy-peer-deps     # Only needed once
npm run dev
```

---

## 1.6 Key Files Modified This Module

| File | Change |
|---|---|
| `Ai dashboard/tsconfig.json` | Fixed JSON syntax (line 1 `{}` → `{`) |
| `Ai dashboard/node_modules/` | Created by `npm install --legacy-peer-deps` |
