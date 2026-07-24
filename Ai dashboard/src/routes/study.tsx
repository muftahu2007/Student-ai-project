import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  BookOpen,
  Bot,
  Check,
  ChevronLeft,
  FileText,
  GraduationCap,
  Menu,
  Mic,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "AI Study Assistant · BUK Scholar AI" },
      {
        name: "description",
        content:
          "Chat with your AI study assistant about your uploaded lecture notes. Summaries, explanations and quiz prep in seconds.",
      },
      { property: "og:title", content: "AI Study Assistant · BUK Scholar AI" },
      {
        property: "og:description",
        content: "Ask questions about your lecture notes and get instant, citation-rich answers.",
      },
    ],
  }),
  component: StudyPage,
});

type Note = {
  id: string;
  title: string;
  course: string;
  pages: number;
  updated: string;
  active?: boolean;
};

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  sources?: { note: string; page: number }[];
  pending?: boolean;
};

const NOTES: Note[] = [
  { id: "n1", title: "Organic Chemistry — Alkenes & Alkynes", course: "CHM 2201", pages: 18, updated: "2h ago", active: true },
  { id: "n2", title: "Thermodynamics: Laws & Cycles", course: "PHY 2103", pages: 24, updated: "Yesterday" },
  { id: "n3", title: "Constitutional Law — Federalism", course: "LAW 1101", pages: 31, updated: "Mon" },
  { id: "n4", title: "Microeconomics: Elasticity", course: "ECO 1202", pages: 12, updated: "Mar 4" },
  { id: "n5", title: "Data Structures — Trees & Graphs", course: "CSC 2304", pages: 27, updated: "Mar 2" },
];

const SUGGESTED = [
  "Summarize this note in 10 bullet points",
  "Generate a 5-question quiz from chapter 3",
  "Explain alkene addition reactions like I'm a beginner",
  "What's likely to appear in the exam?",
];

function StudyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string>("n1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeNote = useMemo(() => NOTES.find((n) => n.id === activeNoteId)!, [activeNoteId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text:
          "Here's a focused breakdown based on your note. Alkenes undergo electrophilic addition because the π-bond is electron-rich. Key reactions to remember: hydrohalogenation (Markovnikov), hydration, halogenation, and hydrogenation. The carbocation intermediate determines regioselectivity.",
        sources: [
          { note: activeNote.title, page: 7 },
          { note: activeNote.title, page: 12 },
        ],
      };
      setMessages((m) => [...m, aiMsg]);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[300px] transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          activeNoteId={activeNoteId}
          onSelect={(id) => {
            setActiveNoteId(id);
            setMessages([]);
            setSidebarOpen(false);
          }}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
        />
      )}

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground/70 hover:bg-muted lg:hidden"
            aria-label="Open notes"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <GraduationCap className="h-5 w-5 text-gold" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                Active Study Session
              </p>
              <h1 className="truncate font-display text-lg font-bold leading-tight sm:text-xl">
                {activeNote.title}
              </h1>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-gold/40 glass-panel-gold px-3.5 py-1 text-xs font-semibold text-accent-foreground sm:inline-flex shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            Scholar AI · Pro
          </span>
        </header>

        {/* Chat scroll area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-3xl">
            {messages.length === 0 ? (
              <EmptyState noteTitle={activeNote.title} onPick={send} />
            ) : (
              <div className="space-y-6">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <UserBubble key={m.id} text={m.text} />
                  ) : (
                    <AiCard key={m.id} message={m} />
                  )
                )}
                {loading && <LoadingCard />}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/80 bg-background/90 px-4 pb-5 pt-4 backdrop-blur-md sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-3xl">
            {messages.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {SUGGESTED.slice(0, 2).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border/80 glass-panel px-3.5 py-1.5 text-xs font-medium text-foreground/80 transition-all hover:border-primary/40 hover:bg-primary-soft hover:-translate-y-0.5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 rounded-2xl glass-panel p-2 shadow-[var(--shadow-soft)] focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all"
            >
              <button
                type="button"
                aria-label="Upload note"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-foreground/60 hover:bg-primary-soft hover:text-primary transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder={`Ask anything about "${activeNote.title.split("—")[0].trim()}"…`}
                className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                aria-label="Voice input"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-foreground/60 hover:bg-primary-soft hover:text-primary transition-colors"
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl emerald-gradient-btn text-primary-foreground disabled:opacity-40"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
              Scholar AI answers are grounded in your uploaded notes · Always verify before exams.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({
  activeNoteId,
  onSelect,
  onClose,
}: {
  activeNoteId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.course.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-semibold">BUK Scholar</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1.5 text-foreground/60 hover:bg-muted lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pb-3 pt-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
          <Plus className="h-4 w-4" /> New chat
        </button>
        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gold/60 bg-gold-soft px-3 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-gold-soft/80">
          <Upload className="h-4 w-4 text-gold" /> Upload note
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
            className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="px-4 pb-2 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Your notes
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {filtered.length === 0 ? (
          <div className="m-2 rounded-xl border border-dashed border-border p-6 text-center">
            <FileText className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm text-foreground">No notes found</p>
            <p className="text-xs text-muted-foreground">Try uploading one above.</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((n) => {
              const active = n.id === activeNoteId;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => onSelect(n.id)}
                    className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      active ? "bg-primary-soft" : "hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        active ? "bg-primary text-primary-foreground" : "bg-surface text-foreground/70"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium leading-snug">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {n.course} · {n.pages} pages · {n.updated}
                      </p>
                    </div>
                    {active && <Check className="mt-1 h-4 w-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-sidebar-border px-4 py-3">
        <a
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back to dashboard
        </a>
      </div>
    </div>
  );
}

function EmptyState({ noteTitle, onPick }: { noteTitle: string; onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center pt-6 text-center sm:pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-110">
        <Bot className="h-8 w-8 text-gold" />
        <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gold text-primary shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold glass-panel-gold px-3 py-1 rounded-full">
        Scholar AI · Interactive Assistant
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
        Let's Study Together
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base leading-relaxed">
        Ask anything about <span className="font-semibold text-foreground underline decoration-gold/50">{noteTitle}</span>.
        I'll cite exact lecture pages for verification.
      </p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTED.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="group flex items-start gap-3 rounded-2xl glass-panel p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] active:scale-[0.98]"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium leading-snug text-foreground/90 group-hover:text-foreground">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm emerald-gradient-btn px-4 py-3 text-[15px] leading-relaxed text-primary-foreground shadow-md sm:max-w-[75%]">
        {text}
      </div>
    </div>
  );
}

function AiCard({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
        <Bot className="h-5 w-5 text-gold" />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm glass-panel p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              Scholar AI
            </span>
            <span className="h-1 w-1 rounded-full bg-primary/40" />
            <span className="text-[11px] font-medium text-muted-foreground">Verified Citation</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-primary-soft hover:text-primary"
            title="Copy answer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <span>Copy</span>
            )}
          </button>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground/90">{message.text}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 border-t border-border/60 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Sources Cited
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {message.sources.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 glass-panel-gold px-3 py-1 text-[11px] font-semibold text-accent-foreground transition-transform hover:scale-105"
                >
                  <FileText className="h-3 w-3 text-gold" />
                  p.{s.page}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="flex gap-3 animate-in fade-in duration-300">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
        <Bot className="h-4.5 w-4.5 text-gold animate-bounce" />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm glass-panel p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
            Scholar AI
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">Analyzing lecture notes…</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-3.5 w-11/12 animate-pulse rounded-full bg-primary/10" />
          <div className="h-3.5 w-9/12 animate-pulse rounded-full bg-primary/10" style={{ animationDelay: "150ms" }} />
          <div className="h-3.5 w-7/12 animate-pulse rounded-full bg-primary/10" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
