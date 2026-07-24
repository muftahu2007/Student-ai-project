# Module 2 — UI/UX Design System

> **Period:** July 23, 2026  
> **Goal:** Transform the dashboard from a basic MVP into a premium, presentation-ready interface

---

## 2.1 Design Philosophy

The BUK Scholar AI interface was redesigned around four core principles:

1. **Glassmorphism** — Translucent frosted panels that feel modern and premium
2. **BUK Identity** — Emerald green and metallic gold reflecting Bayero University's colors
3. **Micro-Animations** — Every interaction has a subtle, satisfying response
4. **Dark/Light Duality** — Full theme system with one-click toggle

---

## 2.2 Color Palette (OKLCH Color Space)

We use the modern **OKLCH color space** instead of hex/RGB for perceptually uniform colors that look great at any brightness.

### Light Mode (Default)

| Token | OKLCH Value | Description |
|---|---|---|
| `--background` | `oklch(0.985 0.008 95)` | Warm cream `#fcfbf8` |
| `--foreground` | `oklch(0.20 0.04 155)` | Deep emerald ink |
| `--primary` | `oklch(0.28 0.07 155)` | BUK Deep Emerald |
| `--gold` | `oklch(0.75 0.14 85)` | Metallic Gold |
| `--card` | `oklch(1 0 0 / 0.9)` | Frosted white card |

### Dark Mode

| Token | OKLCH Value | Description |
|---|---|---|
| `--background` | `oklch(0.14 0.03 155)` | Midnight Emerald `#091a12` |
| `--foreground` | `oklch(0.96 0.01 95)` | Soft bright white |
| `--primary` | `oklch(0.44 0.13 155)` | Vivid Glowing Emerald |
| `--gold` | `oklch(0.82 0.15 85)` | Glowing Gold |

---

## 2.3 Custom Utility Classes

These are defined in `src/styles.css` and reused across all components:

### `.glass-panel`
```css
/* Frosted glass card — primary surface */
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 4px 24px rgba(0,0,0,0.06);
```

### `.glass-panel-gold`
```css
/* Gold-tinted frosted glass — for AI status pills, badges */
background: rgba(var(--gold-soft), 0.4);
backdrop-filter: blur(12px);
border: 1px solid rgba(var(--gold), 0.25);
```

### `.emerald-gradient-btn`
```css
/* Premium emerald gradient button */
background: linear-gradient(135deg, oklch(0.32 0.09 155), oklch(0.24 0.07 155));
box-shadow: 0 4px 20px rgba(var(--primary), 0.3);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 2.4 Typography System

**Font Stack:**
```css
--font-display: 'Cormorant Garamond', Georgia, serif; /* For headings */
--font-body:    'Inter', system-ui, sans-serif;        /* For body text */
```

**Why these fonts?**
- **Cormorant Garamond** — Elegant, academic serif that evokes prestige and scholarly authority
- **Inter** — Clean, highly legible UI font used by world-class SaaS apps (Linear, Notion, Vercel)

Both loaded from Google Fonts CDN with preconnect for fast loading:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap">
```

---

## 2.5 Pages Redesigned

### Landing Page (`/`) — `index.tsx`

**Before:** Basic hero with simple button  
**After:** Full marketing landing page with:

| Component | Description |
|---|---|
| Live AI Status Pill | Animated pulsing gold dot + "BUK Scholar AI v2.0" badge |
| 5-Day Streak Banner | Flame icon with orange glow — gamification element |
| Hero Glassmorphic Card | Frosted container with ambient background glows |
| Quick Action Grid | 4 interactive AI feature cards with hover lift animations |
| Lecture Workspace Preview | Course cards showing CHM/CSC documents with "Ready" status |

### Study Assistant (`/study`) — `study.tsx`

| Component | Before | After |
|---|---|---|
| **Top Header** | Plain flex bar | Sticky glass bar with Pro status badge + glow |
| **Empty State** | Basic centered text | Animated entrance, gold pill label, glassmorphic prompt cards |
| **Chat Bubbles (User)** | Flat green | Emerald gradient pill with shadow |
| **AI Response Card** | Plain white card | Glass panel + gold "Scholar AI" label + copy button |
| **Loading State** | Simple gray pulses | Bouncing bot icon + gold ping dot + staggered shimmer lines |
| **Composer** | Basic input | Glass panel + glow on focus + gradient submit button |

### Dashboard (`/dashboard`) — `dashboard.tsx`

| Component | Enhancement |
|---|---|
| **Sidebar** | Animated collapse (Framer Motion), upgrade card with glow, active state highlight |
| **Top Bar** | Command palette trigger (`Ctrl+K`), frosted blur glass |
| **Stats Cards** | Gradient borders, animated counter |
| **Command Palette** | Full-screen overlay with fuzzy search, grouped actions |

---

## 2.6 Dark/Light Theme Toggle

**Implementation:** `__root.tsx` — global `ThemeToggle` component

```tsx
function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
```

**Features:**
- Persists preference in `localStorage` across sessions
- Smooth CSS transition on all color tokens
- Floating button — always accessible from any page
- Sun icon spins slowly in dark mode for added delight

---

## 2.7 Micro-Animation Catalogue

| Interaction | Animation |
|---|---|
| Page load | `animate-in fade-in slide-in-from-bottom-4 duration-500` |
| Message bubble | `fade-in slide-in-from-bottom-2 duration-300` |
| AI response card | `fade-in slide-in-from-bottom-3 duration-400` |
| Feature card hover | `-translate-y-1 transition-all duration-300` |
| Button press | `active:scale-[0.98]` |
| Icon hover (logo) | `hover:scale-110 transition-transform duration-300` |
| Source citation hover | `hover:scale-105` |
| Copy button feedback | Text changes to "Copied!" with green checkmark for 2s |
| AI loading indicator | `animate-bounce` bot icon + `animate-ping` gold pulse dot |
| Skeleton shimmer | Staggered `animate-pulse` lines with 150ms delay increments |

---

## 2.8 Files Modified This Module

| File | Key Changes |
|---|---|
| `src/styles.css` | Full design system: OKLCH tokens, glassmorphism utilities, shadows, animations |
| `src/routes/__root.tsx` | Theme toggle component, Google Fonts preload, SEO meta tags |
| `src/routes/index.tsx` | Complete landing page redesign |
| `src/routes/study.tsx` | Chat UI polish: header, composer, EmptyState, AiCard, LoadingCard |
| `sign in lovable/src/routes/dashboard.tsx` | Sidebar, stats cards, command palette, quiz completion buttons |
