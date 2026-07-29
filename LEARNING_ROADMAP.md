# 🚀 Full-Stack AI Developer Roadmap
### From Beginner → Master Level
*Customised for the technologies used in BUK Scholar AI*

---

> **The Golden Rule:** You cannot skip foundations. Every week builds on the last.
> Stick to the order: **HTML → CSS → JavaScript → React → TypeScript → Django → AI → DevOps**

---

## 🟤 LEVEL 0 — Before You Begin (Week 0)

**Goal:** Set up your tools and understand how the web works.

| Task | Resource |
|---|---|
| Install VS Code | [code.visualstudio.com](https://code.visualstudio.com) |
| Learn what happens when you type a URL in a browser | YouTube: "How the Internet Works in 5 Minutes" |
| Understand HTML, CSS, JavaScript roles | YouTube: "Web Dev in 100 Seconds" by Fireship |
| Install Git and make a GitHub account | [git-scm.com](https://git-scm.com) |

**Mini Project:** Make a simple GitHub account and push a "Hello World" text file.

---

## 🟢 LEVEL 1 — HTML & CSS (Weeks 1–3)

### Week 1: HTML Foundations
**Goal:** Understand the structure of every webpage on the internet.

- What is a tag? (`<div>`, `<p>`, `<h1>`, `<button>`, `<form>`, `<input>`)
- What are attributes? (`id`, `class`, `href`, `src`, `type`)
- How to nest elements inside each other
- How HTML forms work (this is what your login page uses!)

**Resource:** [MDN HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) or freeCodeCamp HTML course (free).

**Mini Project:** Build your own personal "Profile Card" page in HTML with your name, photo, and a short bio.

---

### Week 2: CSS Foundations
**Goal:** Make your HTML look good.

- Selectors (`.class`, `#id`, `element`)
- The Box Model (margin, padding, border, content)
- Colors, fonts, backgrounds
- `display: flex` — **learn this very well, it's how everything in your app is laid out**
- `display: grid`
- Basic positioning (`relative`, `absolute`, `fixed`)

**Resource:** Kevin Powell's CSS YouTube channel — he is the best CSS teacher on the internet.

**Mini Project:** Style your Profile Card from Week 1. Make it look like a real business card using flexbox.

---

### Week 3: Responsive CSS
**Goal:** Make your pages look good on all screen sizes (this is the exact problem we just fixed in your app!).

- Media queries (`@media (max-width: 768px)`)
- Mobile-first design
- Tailwind CSS intro — understand that every Tailwind class (`p-4`, `flex`, `md:grid`) is just a CSS shortcut.

**Resource:** [Tailwind CSS Docs](https://tailwindcss.com/docs) — the "Core Concepts" section.

**Mini Project:** Make your Profile Card fully responsive (looks good on phone AND desktop).

---

## 🟡 LEVEL 2 — JavaScript (Weeks 4–7)

> ⚠️ This is the most important phase. DO NOT rush it.

### Week 4: JS Fundamentals
- Variables (`const`, `let`, `var`)
- Data types (strings, numbers, booleans, arrays, objects)
- Functions and arrow functions (`const greet = () => {}`)
- `if`/`else`, loops (`for`, `.forEach()`)
- The DOM — how JS can change HTML (`document.getElementById(...)`)

**Resource:** [javascript.info](https://javascript.info) — read Part 1 fully.

**Mini Project:** Build a "To-Do List" in vanilla HTML/CSS/JS. Add and delete items from a list.

---

### Week 5: Arrays & Objects (The Most Used Things in React)
- `.map()` — transforms every item in an array (you use this to render lists in React)
- `.filter()` — removes items from an array
- `.find()`, `.reduce()`
- Object destructuring: `const { name, email } = user;`
- Array destructuring: `const [first, ...rest] = items;`
- Spread operator: `{ ...prev, new_field: value }`

**Mini Project:** Build a simple "Student Gradebook" that shows a list of students and lets you filter by passing/failing.

---

### Week 6: Async JavaScript (Talking to the Internet)
- What is `async/await`?
- What is a `Promise`?
- How `fetch()` works — this is how your `api.ts` file talks to Django!
- How to handle errors with `try/catch`

**Resource:** Fireship's "Async JS" YouTube video (very clear, 10 minutes).

**Mini Project:** Use `fetch()` to call a free public API (like a weather API or a quotes API) and display the result on a page.

---

### Week 7: Advanced JavaScript Concepts
- Closures
- `this` keyword
- Modules (`import` / `export`) — this is how every file in your project shares code
- Local Storage (your app uses this for auth tokens!)
- Events and Event Listeners

**Mini Project:** Build a "Quiz App" in vanilla JS that stores the user's score in `localStorage`.

---

## 🔵 LEVEL 3 — React (Weeks 8–12)

### Week 8: React Basics
- What is a Component?
- JSX (HTML written inside JavaScript)
- `props` — passing data from parent to child
- Your first `useState` — making a button that toggles open/closed

**Resource:** [Official React Docs — Quick Start](https://react.dev/learn)

**Mini Project:** Rebuild your To-Do List from Week 4, but now in React using components and state.

---

### Week 9: React State & Effects
- `useState` in depth
- `useEffect` — running code when the page loads or when something changes (this is how your dashboard fetches documents on startup!)
- Conditional rendering (`{condition && <Component />}`)

**Mini Project:** Build a "Document Fetcher" component that loads a list of items from a public API using `useEffect`.

---

### Week 10: React Forms & User Interaction
- Controlled inputs (the `value` and `onChange` pattern — your login form uses this)
- Form submission and preventing default
- Lifting state up

**Mini Project:** Build a Login Form in React with validation (check that email is not empty, password is 8+ chars).

---

### Week 11: React Router & Project Structure
- Client-side routing (navigating between pages without reloading)
- TanStack Router (what your app uses) or React Router
- How to organise components into folders

**Mini Project:** Build a 3-page app: Home, About, and Dashboard. Navigate between them.

---

### Week 12: React Data Fetching (The Real World)
- Fetching data from a real API inside a React component
- Loading states (`isLoading`)
- Error handling in the UI
- TanStack Query (what your app uses to cache data)

**Mini Project:** Build a "Document Library" app that fetches and displays a list of items from an API with loading and error states.

---

## 🟠 LEVEL 4 — TypeScript (Weeks 13–14)

### Week 13: TypeScript Basics
- What is a type? (`string`, `number`, `boolean`)
- Interfaces and type aliases
- Typing function parameters and return values
- Optional properties (`name?: string`)

**Mini Project:** Convert your To-Do List React app from JavaScript to TypeScript.

---

### Week 14: TypeScript in React
- Typing `useState` (`useState<string>("")`)
- Typing props with interfaces
- Typing API response objects

**Mini Project:** Add full TypeScript typing to your Document Library app from Week 12.

---

## 🔴 LEVEL 5 — Backend with Django (Weeks 15–20)

### Week 15: Python Basics
- Variables, functions, loops
- Dictionaries and lists
- Classes and OOP basics
- Installing packages with `pip`

**Resource:** Corey Schafer's Python Tutorials on YouTube.

---

### Week 16–17: Django Fundamentals
- How Django's MVT architecture works (Model, View, Template)
- Creating a project and an app (`django-admin`, `manage.py`)
- Models and migrations — creating database tables
- The Django Admin panel

**Mini Project:** Build a simple Blog app with a Post model.

---

### Week 18: Django REST Framework (DRF)
- Serializers (converting database rows to JSON)
- APIViews and ViewSets
- Authentication basics

**Mini Project:** Turn your Blog into an API — build endpoints to create, read, update, delete blog posts.

---

### Week 19: Authentication & JWT
- How JWT tokens work (access + refresh)
- `rest_framework_simplejwt`
- Protecting API endpoints with `IsAuthenticated`

---

### Week 20: Connecting Frontend to Backend
- Setting up CORS so React can talk to Django
- Building a full login flow: React form → `fetch()` → Django API → JWT token stored in `localStorage`

**Mini Project:** Connect your React Login Form to your Django REST API. A fully working sign-in system!

---

## 🟣 LEVEL 6 — AI Integration (Weeks 21–24)

### Week 21: AI & LLM Basics
- What are Large Language Models (LLMs)?
- Prompt Engineering — how to write good prompts
- Using the Gemini / Groq API directly

---

### Week 22: RAG (Retrieval-Augmented Generation)
- Why LLMs don't know about your private documents
- Chunking text and storing in a vector database (ChromaDB)
- Searching chunks to answer user questions

---

### Week 23: Streaming AI Responses
- How Server-Sent Events (SSE) work
- Streaming from Django's `StreamingHttpResponse`
- Reading the stream in React chunk by chunk

---

### Week 24: AI in Production
- Rate limiting and fallback models (exactly what your `_generate()` function does!)
- Handling quota errors gracefully
- Cost management

---

## ⚫ LEVEL 7 — DevOps & Deployment (Weeks 25–28)

### Week 25: Git & GitHub Mastery
- Branching and merging
- Pull Requests
- `.gitignore` — never committing secrets

---

### Week 26: Environment Variables & Security
- `.env` files
- Why API keys must NEVER be in your code
- Production vs development configs

---

### Week 27: Cloud Deployment
- Deploying a React app on **Vercel**
- Deploying a Django app on **Render**
- Managed databases with **Supabase (PostgreSQL)**

---

### Week 28: Monitoring & Maintenance
- Reading server logs
- Setting up error alerts
- Database backups

---

## 🏆 MASTER LEVEL — Ongoing

Once you complete all 28 weeks, you will be able to build and deploy full-stack AI applications independently. At the master level, you focus on:

- **System Design:** How to architect large-scale applications
- **Performance Optimization:** Database indexing, caching, lazy loading
- **Security Hardening:** SQL injection, XSS, CSRF protection
- **Testing:** Unit tests, integration tests, end-to-end tests
- **Open Source:** Contributing to libraries you use

---

## 💡 Weekly Habits (Do These Every Single Week)

| Habit | Why |
|---|---|
| Code every day, even for 30 minutes | Consistency > intensity |
| Build something small at the end of each week | Retention > passive watching |
| When confused, ask *why* before asking *how* | Deep understanding > copy-pasting |
| Read error messages carefully | This is the #1 skill of every developer |
| Review code you wrote 2 weeks ago | You will be surprised how much you've grown |

---

## 📚 Top Free Resources

| Topic | Resource |
|---|---|
| HTML & CSS | [MDN Web Docs](https://developer.mozilla.org) |
| CSS (best teacher) | Kevin Powell on YouTube |
| JavaScript | [javascript.info](https://javascript.info) |
| React | [react.dev/learn](https://react.dev/learn) |
| TypeScript | [totaltypescript.com](https://www.totaltypescript.com) |
| Python & Django | Corey Schafer on YouTube |
| AI / LLMs | Andrej Karpathy on YouTube |
| Everything (short videos) | Fireship on YouTube |

---

*You already have a real, live, production application. That puts you years ahead of most beginners. Now it's time to understand every line of it.*
