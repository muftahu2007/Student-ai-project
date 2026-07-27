import React from 'react';
import { toast } from 'sonner';
import { ListChecks } from 'lucide-react';

interface QuizHistoryProps {
  quizHistory: any[];
  documents: any[];
  setSelectedDoc: (doc: any) => void;
  setAiMode: (mode: any) => void;
  setQuizType: (type: any) => void;
  setQuizData: (data: any) => void;
  setUserAnswers: (answers: any) => void;
  setQuizFinished: (finished: boolean) => void;
}

export function QuizHistory({
  quizHistory, documents, setSelectedDoc, setAiMode,
  setQuizType, setQuizData, setUserAnswers, setQuizFinished,
}: QuizHistoryProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-display text-2xl font-bold mb-6">Your Quiz History</h2>
      {quizHistory.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-12 text-center shadow-sm">
          <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Quizzes Yet</h3>
          <p className="text-muted-foreground">Upload a document and generate a quiz to start tracking your progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizHistory.map((history, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => {
                if (history.quiz_data && history.quiz_data.length > 0) {
                  setSelectedDoc(documents.find((d: any) => d.id === history.document_id));
                  setAiMode('quiz');
                  setQuizType(history.quiz_type);
                  setQuizData(history.quiz_data);
                  setUserAnswers(history.user_answers || {});
                  setQuizFinished(true);
                } else {
                  toast.info("Detailed view is not available for older quizzes.");
                }
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  {history.quiz_type === 'objective' ? 'Multiple Choice' : history.quiz_type === 'interactive_theory' ? 'Theory (Graded)' : 'Practice Paper'}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{history.created_at}</div>
              </div>

              <h4 className="font-semibold mb-6 flex-1 line-clamp-2" title={history.document_title}>
                {history.document_title}
              </h4>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Score</div>
                  <div className="font-display font-bold text-xl text-primary">
                    {history.quiz_type === 'practice_paper' ? '-' : (history.quiz_type === 'interactive_theory' ? `${history.score}%` : `${history.score}/${history.total_questions}`)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-0.5">Questions</div>
                  <div className="font-display font-bold text-xl">{history.total_questions}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
