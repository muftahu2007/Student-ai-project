# Module 3 — Features Implemented

> **Period:** July 2026 (across multiple sessions)  
> **Goal:** Document every AI feature built into the BUK Scholar AI platform

---

## 3.1 Core Feature Overview

BUK Scholar AI is a **multi-feature AI study assistant** built on top of Google Gemini and Groq's Llama 3.1 models, accessed via LiteLLM. Every feature is designed around the academic workflow of a Nigerian university student.

```
Upload Lecture Note (PDF/DOCX/Image)
            │
            ▼
    ┌───────────────────────────────┐
    │       BUK Scholar AI          │
    ├───────────────────────────────┤
    │  Summarize  │  Ask AI        │
    │  Quiz Gen   │  Study Guide   │
    │  Flashcards │  Mind Map      │
    │  Multi-Quiz │  AI Analysis   │
    └───────────────────────────────┘
```

---

## 3.2 Feature 1: Document Upload

**What it does:** Accepts PDF, DOCX, and image files, stores them in the backend, and processes them for AI interactions.

**Frontend:**
- Hidden `<input type="file">` triggered by the "Upload Notes" button
- Loading toast notification: `"Uploading document..."`
- Document list auto-refreshes after upload

**Backend API:** `POST /api/documents/upload/`

**Storage:** Files stored in Django's `MEDIA_ROOT` (local file system — needs S3 for production)

---

## 3.3 Feature 2: AI Summarizer (Streaming)

**What it does:** Reads the full uploaded document and generates a concise, structured summary using AI. Uses **streaming** to show the response word-by-word as it's generated.

**User Flow:**
1. Select document → Click "Summarize"
2. Loading dots appear → AI starts streaming response
3. Response renders word-by-word in real time
4. Saved to Interaction History automatically

**Technical Implementation:**
```typescript
await streamSummarize(selectedDoc.id, (chunk) => {
  setAiResult((prev) => prev + chunk);
});
```

**Backend API:** `POST /api/documents/{id}/summarize/` (SSE streaming)

---

## 3.4 Feature 3: Ask AI (Q&A with Citations)

**What it does:** Allows students to ask any question about their lecture notes and receive an answer with **exact page citations**.

**Key Feature — Cited Sources:**
- AI returns source page numbers alongside answers
- Rendered as gold pill badges: `p.4`, `p.12`, etc.
- Students can verify the exact page in their physical notes

**User Flow:**
1. Type question in composer
2. Submit → Question appears as user bubble
3. AI responds with answer + source citations
4. All Q&A saved to history per document

**Technical Implementation:**
```typescript
await streamAskQuestion(selectedDoc.id, question, (chunk) => {
  setAiResult((prev) => prev + chunk);
});
```

---

## 3.5 Feature 4: Study Guide Generator (Streaming)

**What it does:** Generates a structured, exam-ready study guide from the uploaded document including key concepts, definitions, and important formulas.

**Output Format:**
- Organized by topic headings
- Key terms bolded
- Exam tips highlighted
- Streams in real time

**Backend API:** `POST /api/documents/{id}/study-guide/`

---

## 3.6 Feature 5: Quiz Generator

The quiz system supports **three modes**:

### Mode A — Objective (Multiple Choice)
- AI generates N multiple-choice questions with 4 options each
- Timed countdown timer (configurable minutes)
- Instant scoring: correct/incorrect highlighted immediately
- Strengths & Weaknesses Analysis by topic
- AI-powered Performance Analysis panel

### Mode B — Interactive Theory (Essay)
- AI generates open-ended essay questions
- Student types full paragraph answers
- **AI auto-grades** each answer (score out of 100 per question)
- Detailed AI feedback per question
- Overall percentage score calculated

### Mode C — Practice Paper
- Simulates a formal exam paper
- Model answers provided for student self-assessment
- No automated grading (student compares manually)

### Quiz Completion Screen
After every quiz:
- Score summary card
- Full answer review (with explanations for wrong answers)
- **Retake Quiz** button — resets state, restores timer
- **Exit to Workspace** button — returns to document view

---

## 3.7 Feature 6: Flashcard Generator

**What it does:** Generates interactive digital flashcards from the lecture note.

**User Flow:**
1. Click "Flashcards" → AI generates 10 Q&A pairs
2. Cards displayed one at a time
3. Click card → **3D flip animation** reveals the answer
4. Navigate with Next/Previous buttons

**State:**
```typescript
const [flashcardsData, setFlashcardsData] = useState(null);
const [flashcardIndex, setFlashcardIndex] = useState(0);
const [isFlipped, setIsFlipped] = useState(false);
```

---

## 3.8 Feature 7: Mind Map Generator

**What it does:** Generates a visual concept map of the document using **Mermaid.js** diagram syntax.

**Output:** Interactive flowchart showing relationships between key topics in the lecture note.

**Rendered by:** Custom `<MermaidChart>` component that parses the AI-generated Mermaid syntax.

---

## 3.9 Feature 8: Multi-Document Quiz Board

**What it does:** Allows students to select **multiple documents** and generate a combined quiz spanning all of them — perfect for revision across several topics.

**Key Capability:**
- Select 2-10 documents simultaneously
- AI generates questions that cover all selected notes
- Source document tagged on each question: `"From: CHM 2201"`

**Performance Report:**
After the multi-doc quiz, an AI-powered performance report is generated analyzing:
- Topics mastered
- Topics needing review
- Personalized study recommendations

**Backend API:** `POST /api/quiz/multi-generate/`

---

## 3.10 Feature 9: Study Planner

**What it does:** AI generates a personalized day-by-day study plan for an upcoming exam.

**User Inputs:**
- Exam name (e.g., "CHM 2201 Final")
- Exam date
- Documents to cover

**AI Output:** A structured calendar with daily study targets, ensuring all material is covered before the exam date.

---

## 3.11 Feature 10: AI Text-to-Speech

**What it does:** Reads AI-generated responses aloud using the browser's built-in Speech Synthesis API.

```typescript
const utterance = new SpeechSynthesisUtterance(plainText);
utterance.rate = 0.95; // Slightly slower for academic content
window.speechSynthesis.speak(utterance);
```

Toggle button: Speaker icon → click to play, click again to stop.

---

## 3.12 Feature 11: Explain Simpler

**What it does:** Takes the current AI response and asks the AI to re-explain it in simpler, more accessible language — great for complex topics.

---

## 3.13 Feature 12: Interaction History

Full searchable history of all AI interactions per document:
- Summaries generated
- Study guides
- Quiz attempts with scores
- Q&A sessions

Students can click any past interaction to restore it and continue from there.

---

## 3.14 Feature 13: Command Palette (Ctrl+K)

A spotlight-style quick search accessible from anywhere in the dashboard:
- Navigate between tabs
- Trigger AI actions
- Upload documents
- Sign out

Activated with `Ctrl+K` keyboard shortcut.

---

## 3.15 Feature 14: Analytics Dashboard

Visual analytics powered by Recharts:
- **Area Chart** — Quiz scores over time
- **Bar Chart** — Documents studied per week
- **Radar Chart** — Topic mastery across subjects
- **Line Chart** — Study streak progression

---

## 3.16 Feature 15: Copy to Clipboard

All AI responses have a one-click **Copy** button:
- Instant clipboard copy
- Button changes to green ✓ "Copied!" for 2 seconds
- Returns to "Copy" state automatically

---

## 3.17 AI Rate Limit Handling

When the Gemini API quota is exhausted, the system:
1. Automatically detects the `429`/`RESOURCE_EXHAUSTED` error
2. Falls back to Groq (Llama 3.1) via LiteLLM routing
3. If both fail, displays a friendly quota message:

```
## ⏳ Aisha is Taking a Short Break
You've reached today's free AI quota. This resets every day at 
approximately 9:00 AM Nigeria time (midnight Pacific).

Your document is safely saved — come back in the morning!
```
