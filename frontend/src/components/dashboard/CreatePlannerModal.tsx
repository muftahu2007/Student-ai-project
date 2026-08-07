import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";

interface CreatePlannerModalProps {
  open: boolean;
  onClose: () => void;
  documents: any[];
  examName: string;
  setExamName: (v: string) => void;
  examDate: string;
  setExamDate: (v: string) => void;
  selectedDocIds: number[];
  setSelectedDocIds: (ids: number[]) => void;
  loading: boolean;
  onSubmit: () => void;
}

export function CreatePlannerModal({
  open,
  onClose,
  documents,
  examName,
  setExamName,
  examDate,
  setExamDate,
  selectedDocIds,
  setSelectedDocIds,
  loading,
  onSubmit,
}: CreatePlannerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card rounded-3xl p-6 border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Create Study Plan
          </DialogTitle>
          <DialogDescription>
            Select your exam date and the notes you need to study. Smart AI will create a daily breakdown for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Exam Name</label>
            <Input
              placeholder="e.g. Midterm MTH101"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="h-12 rounded-xl bg-secondary/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Exam Date</label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="h-12 rounded-xl bg-secondary/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Select Study Material</label>
            <div className="border border-border/50 bg-secondary/10 rounded-xl p-2 max-h-40 overflow-y-auto space-y-1">
              {documents.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-border/50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-primary/50 text-primary accent-primary"
                    checked={selectedDocIds.includes(doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedDocIds([...selectedDocIds, doc.id]);
                      else setSelectedDocIds(selectedDocIds.filter((id) => id !== doc.id));
                    }}
                  />
                  <div className="text-sm font-medium line-clamp-1 flex-1">{doc.title}</div>
                </label>
              ))}
              {documents.length === 0 && (
                <div className="text-xs text-muted-foreground p-2 text-center">No documents available. Please upload first.</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6 h-11">Cancel</Button>
          <Button onClick={onSubmit} disabled={loading} className="rounded-xl px-6 h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
            Generate Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
