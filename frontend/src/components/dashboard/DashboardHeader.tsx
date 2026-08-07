import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  user: any;
  onMobileMenuOpen: () => void;
  onCmdOpen: () => void;
}

export function DashboardHeader({
  activeTab,
  searchQuery,
  setSearchQuery,
  user,
  onMobileMenuOpen,
  onCmdOpen,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-background/60 px-4 backdrop-blur-2xl shadow-sm sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        className="lg:hidden -ml-2 rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Tab-aware search bar */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        {["documents", "planner", "quizzes"].includes(activeTab) && (
          <>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "documents"
                  ? "Filter your documents…"
                  : activeTab === "planner"
                  ? "Filter study plans…"
                  : "Filter quiz history…"
              }
              className="h-10 w-full rounded-full border-border/50 bg-secondary/50 pl-10 text-sm focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Ctrl+K trigger */}
        <button
          onClick={onCmdOpen}
          className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search actions…</span>
          <kbd className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-bold bg-background/50">Ctrl K</kbd>
        </button>

        <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-3 rounded-full border border-border/50 bg-card py-1 pl-1 pr-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-white shadow-inner">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block text-xs">
            <div className="font-semibold text-foreground">{user?.username || "Student"}</div>
            <div className="text-muted-foreground">BUK Scholar</div>
          </div>
        </div>
      </div>
    </header>
  );
}
