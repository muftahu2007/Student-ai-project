# 🚀 BUK Student AI Assistant: Project Summary & Developer Roadmap

> **Document Created:** August 2, 2026  
> **Project:** BUK Student AI Assistant & Admin Analytics Dashboard  
> **Author & Creator:** Ahmad Muftahu  

---

## 📌 Executive Summary & Core Achievements

You have successfully engineered and deployed a **Full-Stack AI Educational Platform** tailored for Bayero University Kano (BUK) students.

### **Architecture Overview**
* **Frontend Web App:** React, TypeScript, Vite, TanStack Router (Hosted on Vercel CDN).
* **Admin Dashboard:** Standalone React Admin Panel (Hosted on Vercel CDN).
* **Backend API:** Django REST Framework, Python (Hosted on Render).
* **Database:** PostgreSQL on Supabase (with Django ORM migrations).
* **AI Engine:** Direct REST integration with Google Gemini, Groq, and OpenRouter LLMs.

### **Production Improvements Implemented**
1. **Render Latency Optimization:** Added direct HTTP callers in `llm_client.py`, 10s Google OAuth timeouts, and warm-up toast notices (*"Waking up server..."*) to eliminate cold-start frustration.
2. **Matriculation Uniqueness:** Enforced unique constraints and sequence suffix validation (e.g. `CST/23/SWE/01052`).
3. **Streamlined UI:** Removed redundant fields (like `program`) across forms, models, and AI prompts.
4. **Vercel SPA Rewrites:** Created `vercel.json` rewrite configs to prevent 404/500 crashes on page refreshes.
5. **Admin Panel Security:** Added automated 15-minute inactivity session timeouts and clean `401 Unauthorized` token handling.

---

## 🎯 Developer Identity & Mindset: The Hybrid Builder

In the modern AI era, building great software is **80% product vision & problem solving** and **20% code syntax fluency**.

### **Why You Are a Real Developer:**
* You identified a genuine problem for BUK students (navigating lecture notes, studying for exams).
* You designed the feature set (RAG PDF study notes, quizzes, essay grading, flashcards, mind maps, admission letter OCR).
* You directed AI tools to construct production-ready code.

---

## 📅 30-Day Skill-Building Action Plan (1 Hour / Day)

**Goal:** Transition from beginner to confidently reading, tweaking, and explaining your full-stack codebase.

### **Week 1: JavaScript & React (Frontend)**
* **Core Topics:** Variables (`const`, `let`), Functions (`() => {}`), `async/await`, `fetch()`, `useState`, `useEffect`.
* **Resource:** YouTube (Traversy Media / Net Ninja React Crash Courses) or Scrimba.com (free interactive tier).
* **Code Exercise:** Open `frontend/src/routes/login.tsx`. Trace how `useState` stores inputs and how `handleSubmit` calls the API.

### **Week 2: Python & Django REST (Backend)**
* **Core Topics:** Python dictionaries/lists, Django models (`models.py`), serializers (`serializers.py`), API views (`views.py`).
* **Resource:** Dennis Ivy or Tech With Tim Django REST Framework crash courses on YouTube.
* **Code Exercise:** Open `backend/api/models.py` and `backend/api/views.py`. Read `StudentProfile` and `StudentProfileView`.

### **Week 3: Full-Stack Data Flow & Auth**
* **Core Topics:** Relational databases, Foreign keys, JWT Bearer tokens, HTTP Status Codes (`200`, `401`, `500`).
* **Code Exercise:** Trace the exact journey of a user logging in:
  `React form submit` ➔ `POST /api/auth/login/` ➔ `EmailAuthBackend` ➔ `JWT access token returned` ➔ `localStorage`.

### **Week 4: Code Walkthroughs & Resume Prep**
* **Core Topics:** Git version control (`git add`, `commit`, `push`), explaining architecture out loud.
* **Code Exercise:** Practice explaining your app to a friend in 2 minutes:
  *"I built BUK Student AI using React, Django REST Framework, and PostgreSQL. It uses RAG to turn PDF course notes into practice quizzes."*

---

## 📣 Product Launch & Student Growth Plan

1. **Record a 30-Second Screen Demo:**
   * Screen-record your phone/laptop showing: PDF Upload ➔ Instant Quiz Generation ➔ Score & Feedback.
2. **Share in Student Channels:**
   * Post the 30-second clip to BUK WhatsApp groups, Telegram study channels, and Instagram/TikTok stories.
3. **Gather Direct Feedback:**
   * Sit next to 3-5 classmates, let them use the app, and observe where they click or ask questions.

---

## 📁 Key File Map in Your Repository

| File | Purpose |
| :--- | :--- |
| `backend/api/views.py` | Core API view logic, OAuth verification, document extraction |
| `backend/api/llm_client.py` | Direct lightweight HTTP calls to Gemini, Groq, and OpenRouter |
| `backend/api/models.py` | Database schema for Users, Profiles, Documents, Quizzes, Schedules |
| `frontend/src/routes/onboarding.tsx` | Admission letter PDF upload & profile confirmation UI |
| `frontend/src/routes/register.tsx` | Student sign-up flow & Google OAuth routing |
| `admin-panel/src/App.tsx` | Admin Dashboard state, inactivity timeout, unauthorized session listener |
| `frontend/vercel.json` | Vercel SPA client-side route rewrites |

---

*Keep this guide as a reference for your daily 30-day learning routine and project growth!*
