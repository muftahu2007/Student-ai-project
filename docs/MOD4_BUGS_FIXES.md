# Module 4 — Bugs Fixed & Issues Resolved

> **Period:** July 2026  
> **Goal:** Document every bug discovered and how it was resolved

---

## Bug #1 — `Cannot find type definition file for 'vite/client'`

| Field | Detail |
|---|---|
| **Severity** | 🔴 Blocking |
| **File** | `Ai dashboard/tsconfig.json` |
| **Cause** | `node_modules` not installed — `vite` package missing |
| **Fix** | `npm install --legacy-peer-deps` |
| **Why `--legacy-peer-deps`** | Peer version conflict between `@lovable.dev/vite-tanstack-config` and `nitro` |

---

## Bug #2 — `End of file expected` in `tsconfig.json`

| Field | Detail |
|---|---|
| **Severity** | 🔴 Blocking |
| **File** | `Ai dashboard/tsconfig.json` |
| **Cause** | User accidentally changed `{` to `{}` on line 1, closing the JSON object prematurely |
| **Symptom** | All lines after line 1 were invalid JSON |
| **Fix** | Reverted line 1 from `{}` back to `{` |

**Broken:**
```json
{}
  "include": [...],
```
**Fixed:**
```json
{
  "include": [...],
```

---

## Bug #3 — Retake Quiz Button Not Appearing

| Field | Detail |
|---|---|
| **Severity** | 🟡 Medium (UX regression) |
| **File** | `sign in lovable/src/routes/dashboard.tsx` |
| **Cause** | The quiz results section rendered the review answers correctly but had **no action buttons** at the end |
| **Impact** | Students could not retake a quiz after finishing — stuck on results screen |

**Root cause (code):**
```tsx
// The review section ended here with nothing after it
<div className="space-y-4">
  {/* ...quiz review cards... */}
</div>
// ← No buttons here! That's the bug.
```

**Fix applied:**
```tsx
{/* Quiz Completion Actions */}
<div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border/50">
  <Button 
    onClick={() => {
      setQuizFinished(false);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTimeLeft(timeLimit * 60);
    }}
    className="flex-1 rounded-xl"
    size="lg"
  >
    Retake Quiz
  </Button>
  <Button
    variant="outline"
    onClick={() => setAiMode(null)}
    className="flex-1 rounded-xl"
    size="lg"
  >
    Exit to Workspace
  </Button>
</div>
```

**Note:** The Multi-Doc Quiz Board (`MultiDocQuizBoard.tsx`) already had a Retake button — only the single-document quiz view was missing it.

---

## Bug #4 — Git Repository Tracking System Folders

| Field | Detail |
|---|---|
| **Severity** | 🟡 Medium (performance/warning) |
| **Symptom** | `warning: could not open directory 'AppData/Local/...'` |
| **Cause** | `git add -A` was run from `backend/` but the `.git` root was initialized at `C:\Users\Muftahu\` — too high in the directory tree |
| **Impact** | Git scanning thousands of Windows system files → 10,000+ commits, slow `git add` |

**Diagnosis command:**
```bash
git rev-parse --show-toplevel
# Returns: C:/Users/Muftahu ← Problem!
```

**Fix:**
```bash
# Re-initialize git at the correct project level
cd "C:\Users\Muftahu\Desktop\Buk Student Ai Assistant"
git init
git add .
git commit -m "Initial clean commit: BUK Scholar AI v1.0"
```

---

## Bug #5 — API Rate Limit (Gemini 429 Errors)

| Field | Detail |
|---|---|
| **Severity** | 🟡 Medium (production concern) |
| **Cause** | Free Gemini API tier has daily request limits |
| **Impact** | AI features fail silently or with cryptic errors |

**Fix implemented:**
- LiteLLM fallback chain: Gemini → Groq (Llama 3.1 70B)
- Friendly in-app error message with reset time information
- Error detection: checks for `429`, `quota`, `RESOURCE_EXHAUSTED` in error message

---

## Bug #6 — Session Expiry Not Handled Gracefully

| Field | Detail |
|---|---|
| **Severity** | 🟡 Medium |
| **Cause** | JWT tokens expire after a set period |
| **Impact** | App showed blank screens or generic errors when token expired |

**Fix:**
```typescript
useEffect(() => {
  const handleSessionExpired = () => {
    toast.error('Your session has expired. Please log in again.', { duration: 4000 });
    setTimeout(() => navigate({ to: '/login' }), 1500);
  };
  window.addEventListener('session-expired', handleSessionExpired);
  return () => window.removeEventListener('session-expired', handleSessionExpired);
}, [navigate]);
```

---

## Bug #7 — Theory Quiz Grading Index Offset

| Field | Detail |
|---|---|
| **Severity** | 🟡 Medium (data accuracy) |
| **Cause** | AI prompt used 1-based indexing but JavaScript arrays are 0-based |
| **Impact** | Graded feedback displayed for the wrong question |

**Fix:** Standardized index handling in the grading loop to correctly map AI response indices to `quizData` array positions.

---

## Known Issues (Not Yet Fixed)

| Issue | Severity | Notes |
|---|---|---|
| File uploads lost on Render deploy | 🔴 Blocking for production | Needs S3/Cloudinary integration |
| SQLite breaks with concurrent users | 🔴 Blocking for production | Switch to PostgreSQL |
| No per-user AI rate limiting | 🟡 Medium | One heavy user can exhaust quota for all |
| Dark mode not applied to Mermaid charts | 🟢 Low | Charts render in light mode regardless of theme |
