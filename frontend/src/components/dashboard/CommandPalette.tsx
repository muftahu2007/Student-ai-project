import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search, ChevronRight, LayoutDashboard, FileText, ListChecks,
  Calendar, Clock, Upload, MessageSquare, Zap, Sparkles, LogOut,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  cmdQuery: string;
  setCmdQuery: (q: string) => void;
  documents: any[];
  setActiveTab: (tab: string) => void;
  setSelectedDoc: (doc: any) => void;
  setAiMode: (mode: any) => void;
  handleLogout: () => void;
}

export function CommandPalette({
  open,
  onClose,
  cmdQuery,
  setCmdQuery,
  documents,
  setActiveTab,
  setSelectedDoc,
  setAiMode,
  handleLogout,
}: CommandPaletteProps) {

  const cmdActions = [
    { label: "Overview", icon: LayoutDashboard, action: () => setActiveTab("overview"), group: "Navigate" },
    { label: "Documents", icon: FileText, action: () => setActiveTab("documents"), group: "Navigate" },
    { label: "Quiz Board", icon: ListChecks, action: () => setActiveTab("quizboard"), group: "Navigate" },
    { label: "Study Planner", icon: Calendar, action: () => setActiveTab("planner"), group: "Navigate" },
    { label: "History", icon: Clock, action: () => setActiveTab("history"), group: "Navigate" },
    { label: "Upload Document", icon: Upload, action: () => document.getElementById("file-upload")?.click(), group: "Actions" },
    {
      label: "Chat with AI",
      icon: MessageSquare,
      action: () => {
        if (documents.length) { setSelectedDoc(documents[0]); setAiMode("ask"); }
        else toast.info("Upload a document first");
      },
      group: "Actions",
    },
    {
      label: "Generate Quiz",
      icon: Zap,
      action: () => {
        if (documents.length) { setSelectedDoc(documents[0]); setAiMode("quiz"); }
        else toast.info("Upload a document first");
      },
      group: "Actions",
    },
    {
      label: "Summarize Notes",
      icon: Sparkles,
      action: () => {
        if (documents.length) { setSelectedDoc(documents[0]); setAiMode("summary"); }
        else toast.info("Upload a document first");
      },
      group: "Actions",
    },
    { label: "Sign Out", icon: LogOut, action: handleLogout, group: "Account" },
  ];

  const filteredCmds = cmdQuery
    ? cmdActions.filter((a) => a.label.toLowerCase().includes(cmdQuery.toLowerCase()))
    : cmdActions;

  const cmdGroups = [...new Set(filteredCmds.map((a) => a.group))];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Search actions, navigate tabs…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <span className="text-[10px] font-bold text-muted-foreground/60 border border-white/10 rounded px-1.5 py-0.5">ESC</span>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {cmdGroups.map((group) => (
                <div key={group}>
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{group}</div>
                  {filteredCmds
                    .filter((a) => a.group === group)
                    .map((a) => (
                      <button
                        key={a.label}
                        onClick={() => { a.action(); onClose(); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                          <a.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        {a.label}
                        <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                      </button>
                    ))}
                </div>
              ))}
              {filteredCmds.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">No results for "{cmdQuery}"</div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground/50">
              <span><kbd className="font-bold text-muted-foreground/70">↑↓</kbd> navigate</span>
              <span><kbd className="font-bold text-muted-foreground/70">↵</kbd> select</span>
              <span><kbd className="font-bold text-muted-foreground/70">Ctrl+K</kbd> toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
