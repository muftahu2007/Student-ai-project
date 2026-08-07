import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronRight, X, Settings, LogOut, Sparkles } from "lucide-react";
import logo from "@/assets/buk-scholar-logo.png";

interface NavItem {
  label: string;
  icon: React.ElementType;
  tab: string;
  badge?: string;
}

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (v: boolean) => void;
  setSidebarCollapsed: (fn: (prev: boolean) => boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: NavItem[];
  onSettings: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  sidebarOpen,
  sidebarCollapsed,
  setSidebarOpen,
  setSidebarCollapsed,
  activeTab,
  setActiveTab,
  navItems,
  onSettings,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`fixed inset-y-0 left-0 z-50 transform border-r border-white/5 bg-card/40 backdrop-blur-2xl shadow-[20px_0_40px_rgba(0,0,0,0.3)] transition-transform lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo / Branding */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 ring-1 ring-white/10 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <img src={logo} alt="" className="h-6 w-6 brightness-0 invert" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="leading-tight overflow-hidden whitespace-nowrap"
              >
                <div className="font-display text-sm font-semibold tracking-tight">BUK Scholar</div>
                <div className="text-[10px] font-medium uppercase tracking-widest text-primary">AI Workspace</div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <div className="flex items-center gap-1">
          <button
            className="hidden lg:flex rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            onClick={() => setSidebarCollapsed((p) => !p)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 py-6 overflow-hidden">
        {!sidebarCollapsed && (
          <div className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 whitespace-nowrap">
            Workspace
          </div>
        )}
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <li key={item.label}>
                <button
                  onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full group flex items-center rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    sidebarCollapsed ? "justify-center" : "justify-between"
                  } ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className={`flex items-center ${sidebarCollapsed ? "" : "gap-3"}`}>
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    {!sidebarCollapsed && item.label}
                  </span>
                  {!sidebarCollapsed && item.badge && (
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-secondary text-foreground"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Account section */}
        {!sidebarCollapsed && (
          <div className="mt-8 px-2 pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 whitespace-nowrap">
            Account
          </div>
        )}
        {sidebarCollapsed && <div className="my-4 border-t border-white/5" />}
        <ul className="space-y-1">
          <li>
            <button
              onClick={onSettings}
              className={`flex w-full items-center rounded-xl px-2.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
              title={sidebarCollapsed ? "Settings" : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && " Settings"}
            </button>
          </li>
          <li>
            <button
              onClick={onLogout}
              className={`flex w-full items-center rounded-xl px-2.5 py-2.5 text-sm font-medium text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-500 ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
              title={sidebarCollapsed ? "Sign out" : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && " Sign out"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Upgrade Card */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-3 bottom-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 text-white shadow-xl ring-1 ring-white/10">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> PRO
                </div>
                <p className="mt-2 text-xs font-medium leading-snug text-zinc-300">Unlock unlimited AI features.</p>
                <button className="mt-3 w-full rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 transition-transform hover:scale-105 active:scale-95">
                  Upgrade Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
