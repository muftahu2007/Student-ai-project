import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Lightbulb, Settings } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export function SettingsModal({ open, onClose, user, theme, setTheme }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border/50 shadow-2xl rounded-3xl bg-card">
        <div className="p-6 pb-4 border-b border-border/40">
          <DialogTitle className="text-xl font-display font-bold">App Settings</DialogTitle>
          <DialogDescription className="text-sm">Manage your account and app preferences.</DialogDescription>
        </div>

        <div className="p-6 space-y-6">
          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Account</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Name</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.first_name} {user?.last_name} ({user?.username})
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Email Address</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="pt-4 border-t border-border/40">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Appearance</h3>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-background border shadow-sm">
                  {theme === "dark" ? <Settings className="h-4 w-4 text-primary" /> : <Lightbulb className="h-4 w-4 text-amber-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Theme Mode</p>
                  <p className="text-[11px] text-muted-foreground">Switch between Light and Dark mode.</p>
                </div>
              </div>
              <div className="flex gap-1 bg-background p-1 rounded-full border shadow-sm">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="pt-4 border-t border-border/40">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Notifications</h3>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-background border shadow-sm">
                  <Bell className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Study Reminders</p>
                  <p className="text-[11px] text-muted-foreground">Get notified when a study schedule is due.</p>
                </div>
              </div>
              <div className="h-5 w-9 rounded-full bg-primary/20 flex items-center p-0.5 cursor-pointer relative transition-colors border">
                <div className="h-4 w-4 rounded-full bg-primary shadow-sm transform translate-x-3.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary/30 border-t border-border/40 flex justify-end">
          <Button onClick={onClose} className="rounded-full">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
