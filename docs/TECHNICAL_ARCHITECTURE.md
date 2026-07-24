# Technical Architecture

> Complete technical documentation of the BUK Scholar AI system

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        STUDENT'S BROWSER                      │
│                                                               │
│  ┌─────────────────────────┐   ┌──────────────────────────┐  │
│  │   React Frontend        │   │   AI Dashboard (v2)      │  │
│  │   (sign in lovable/)    │   │   (Ai dashboard/)        │  │
│  │                         │   │                          │  │
│  │  • TanStack Router      │   │  • TanStack Start        │  │
│  │  • React Query          │   │  • Glassmorphism UI      │  │
│  │  • Framer Motion        │   │  • Dark/Light Mode       │  │
│  │  • Recharts             │   │                          │  │
│  └────────────┬────────────┘   └──────────────────────────┘  │
└───────────────┼─────────────────────────────────────────────┘
                │ HTTP/REST + JWT
                ▼
┌─────────────────────────────────────────────────────────────┐
│                   DJANGO REST FRAMEWORK                       │
│                   (backend/ — Port 8000)                      │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │  Auth    │  │ Documents│  │  Quiz    │  │  Analytics  │ │
│  │  Views   │  │  Views   │  │  Views   │  │  Views      │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    LiteLLM Router                        │ │
│  │     Gemini Pro ──(fallback)──► Groq Llama 3.1 70B       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │     SQLite DB        │  │   Local File Storage         │ │
│  │  (dev — swap for     │  │  MEDIA_ROOT/ (dev — swap     │ │
│  │   PostgreSQL)        │  │   for S3)                    │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | UI component framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool & dev server |
| **TanStack Router** | Latest | File-based routing |
| **TanStack Query** | Latest | Server state & data fetching |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | Latest | Animations & transitions |
| **Recharts** | 2.x | Data visualization |
| **Radix UI** | Various | Accessible UI primitives |
| **Lucide React** | Latest | Icon library |
| **Sonner** | Latest | Toast notifications |
| **React Hook Form** | Latest | Form state management |
| **Zod** | Latest | Schema validation |
| **Mermaid.js** | Latest | Mind map rendering |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Django** | 4.x | Web framework |
| **Django REST Framework** | 3.x | REST API layer |
| **LiteLLM** | Latest | Universal AI model router |
| **Google Generative AI** | Latest | Gemini API client |
| **Groq** | Latest | Groq API client (fallback) |
| **PyJWT** | Latest | JWT authentication |
| **Pillow** | Latest | Image processing |
| **python-docx** | Latest | Word document parsing |
| **PyMuPDF / pdfplumber** | Latest | PDF text extraction |
| **SQLite** | Built-in | Development database |
| **Gunicorn** | Latest | Production WSGI server |

---

## API Endpoint Reference

### Authentication
```
POST /api/auth/register/       → Create account
POST /api/auth/login/          → Get JWT tokens
POST /api/auth/refresh/        → Refresh access token
GET  /api/auth/profile/        → Get user profile
```

### Documents
```
GET    /api/documents/          → List all documents
POST   /api/documents/upload/   → Upload new document
DELETE /api/documents/{id}/     → Delete document
```

### AI Features
```
POST /api/documents/{id}/summarize/      → Stream summary
POST /api/documents/{id}/ask/            → Stream Q&A
POST /api/documents/{id}/study-guide/    → Stream study guide
POST /api/documents/{id}/quiz/           → Generate quiz
POST /api/documents/{id}/flashcards/     → Generate flashcards
POST /api/documents/{id}/mind-map/       → Generate mind map
POST /api/quiz/grade-theory/             → Grade theory answers
POST /api/quiz/multi-generate/           → Multi-doc quiz
POST /api/quiz/analyze-performance/      → AI performance report
```

### History & Analytics
```
GET    /api/interactions/        → Interaction history
DELETE /api/interactions/{id}/   → Delete interaction
GET    /api/quiz/history/        → Quiz history
POST   /api/quiz/save/           → Save quiz result
GET    /api/analytics/           → Analytics data
GET    /api/schedules/           → Study schedules
POST   /api/schedules/           → Create schedule
```

---

## Database Schema

### Key Models

```python
class Document(models.Model):
    user = ForeignKey(User)
    title = CharField()
    file = FileField()
    content_text = TextField()     # Extracted text for AI
    created_at = DateTimeField()

class QuizResult(models.Model):
    user = ForeignKey(User)
    document = ForeignKey(Document)
    quiz_type = CharField()        # objective | theory | practice
    score = IntegerField()
    total_questions = IntegerField()
    strengths = JSONField()
    weaknesses = JSONField()
    quiz_data = JSONField()        # Full Q&A pairs
    user_answers = JSONField()

class InteractionHistory(models.Model):
    user = ForeignKey(User)
    document = ForeignKey(Document)
    interaction_type = CharField()  # summary | guide | chat
    prompt = TextField()
    response = TextField()
    created_at = DateTimeField()

class StudySchedule(models.Model):
    user = ForeignKey(User)
    exam_name = CharField()
    exam_date = DateField()
    documents = ManyToManyField(Document)
    schedule_data = JSONField()    # AI-generated plan
```

---

## AI Pipeline

### Request Flow

```
User Action → Frontend API call
    │
    ▼
Django View receives request
    │
    ▼
Extract document text from DB
    │
    ▼
Build prompt with document context
    │
    ▼
LiteLLM.completion(model="gemini/gemini-pro")
    │
    ├── Success → Stream response to frontend
    │
    └── Error (429/quota) → Fallback to Groq
                │
                ├── Success → Stream response
                │
                └── Error → Return quota message
```

### Streaming Implementation

AI responses are streamed using **Server-Sent Events (SSE)**:

```python
# Django view
def stream_view(request, doc_id):
    def generate():
        for chunk in litellm.completion(model=..., stream=True):
            text = chunk.choices[0].delta.content or ""
            yield f"data: {text}\n\n"
    return StreamingHttpResponse(generate(), content_type="text/event-stream")
```

```typescript
// React frontend
const response = await fetch(`/api/documents/${id}/summarize/`, {...});
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = new TextDecoder().decode(value);
  setAiResult(prev => prev + chunk);
}
```

---

## Authentication Flow

```
1. User registers/logs in
2. Backend returns: { access_token, refresh_token }
3. Frontend stores tokens in localStorage
4. Every API request sends: Authorization: Bearer <access_token>
5. If 401 received → refresh token → retry request
6. If refresh fails → dispatch 'session-expired' event → redirect to login
```

---

## File Structure

```
Buk Student Ai Assistant/
│
├── backend/                          ← Django REST API
│   ├── core/                         ← Django project settings
│   ├── accounts/                     ← User auth app
│   ├── documents/                    ← Document upload & AI features
│   ├── quiz/                         ← Quiz generation & grading
│   ├── analytics/                    ← Usage analytics
│   ├── planner/                      ← Study schedule AI
│   ├── requirements.txt
│   └── manage.py
│
├── sign in lovable/                  ← Main React Dashboard
│   ├── src/
│   │   ├── routes/
│   │   │   ├── __root.tsx            ← App shell, theme toggle
│   │   │   ├── dashboard.tsx         ← Main dashboard (1760 lines)
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── onboarding.tsx
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── Shared.tsx        ← AnimatedCounter, SciFiLoader etc.
│   │   │   │   ├── AnalyticsOverview.tsx
│   │   │   │   ├── MyDocuments.tsx
│   │   │   │   ├── MultiDocQuizBoard.tsx
│   │   │   │   ├── StudyPlanner.tsx
│   │   │   │   └── QuizHistory.tsx
│   │   │   ├── MermaidChart.tsx
│   │   │   └── ui/                   ← Radix UI primitives
│   │   ├── lib/
│   │   │   ├── api.ts                ← All API functions
│   │   │   └── quizValidation.ts     ← Client-side quiz grading
│   │   └── styles.css
│   └── package.json
│
├── Ai dashboard/                     ← Experimental TanStack Start UI
│   ├── src/
│   │   ├── routes/
│   │   │   ├── __root.tsx
│   │   │   ├── index.tsx             ← Landing page
│   │   │   └── study.tsx             ← Study interface
│   │   └── styles.css               ← Full design system
│   └── tsconfig.json
│
└── docs/                             ← This documentation
```

---

## Security Considerations

| Area | Implementation | Status |
|---|---|---|
| Authentication | JWT (access + refresh tokens) | ✅ |
| API Keys | Stored in Django settings / env vars | ✅ |
| CORS | Configured per allowed origins | ✅ |
| Input Validation | Zod schemas on frontend | ✅ |
| Rate Limiting | Per-endpoint (basic) | ⚠️ Needs per-user limits |
| File Type Validation | Backend validates file types | ✅ |
| SQL Injection | Django ORM (parameterized queries) | ✅ |
| XSS | React escapes JSX by default | ✅ |
| HTTPS | Enforced on production hosting | ⚠️ Configure on Render/Vercel |
