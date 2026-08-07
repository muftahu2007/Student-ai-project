import { lazy, Suspense } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { downloadPdf } from "@/lib/api";

const MermaidChart = lazy(() => import("@/components/MermaidChart").then(m => ({ default: m.MermaidChart })));
import {
  Sparkles, Menu, X, BookOpen, MessageSquare, Clock, FlipHorizontal, Globe,
  ListChecks, Brain, Target, TrendingDown, CheckCircle2, XCircle, Loader2,
  Volume2, VolumeX, Search, Copy, Check, Lightbulb, Download, ChevronRight
} from "lucide-react";

interface AIWorkspaceModalProps {
  selectedDoc: any;
  setSelectedDoc: (doc: any) => void;
  mobileToolsOpen: boolean;
  setMobileToolsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  aiMode: 'summary' | 'ask' | 'guide' | 'quiz' | 'history' | 'flashcards' | 'mindmap' | 'read' | null;
  setAiMode: (mode: any) => void;
  aiLoading: boolean;
  aiResult: string;
  setAiResult: (res: string | ((prev: string) => string)) => void;
  quizType: 'objective' | 'interactive_theory' | 'practice_paper';
  setQuizType: (type: 'objective' | 'interactive_theory' | 'practice_paper') => void;
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  timeLimit: number;
  setTimeLimit: (num: number) => void;
  quizData: any[] | null;
  setQuizData: (data: any[] | null) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number | ((prev: number) => number)) => void;
  userAnswers: Record<number, number | string>;
  setUserAnswers: (ans: Record<number, number | string> | ((prev: Record<number, number | string>) => Record<number, number | string>)) => void;
  quizFinished: boolean;
  setQuizFinished: (finished: boolean) => void;
  timeLeft: number | null;
  isGradingTheory: boolean;
  flashcardsData: any[] | null;
  flashcardIndex: number;
  setFlashcardIndex: (idx: number | ((prev: number) => number)) => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  smartHighlights: string[];
  readerFontSize: 'sm' | 'base' | 'lg' | 'xl';
  setReaderFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  readerSearchQuery: string;
  setReaderSearchQuery: (q: string) => void;
  readerCopied: boolean;
  setReaderCopied: (copied: boolean) => void;
  activeHighlightIndex: number | null;
  setActiveHighlightIndex: (idx: number | null) => void;
  interactionHistory: any[];
  quizHistory: any[];
  questionInput: string;
  setQuestionInput: (val: string) => void;
  isSimplifying: boolean;
  isSpeaking: boolean;
  runAiAction: (mode: 'summary' | 'guide' | 'quiz' | 'ask' | 'history' | 'flashcards' | 'mindmap' | 'read') => void;
  handleExplainSimpler: () => void;
  handleTTS: () => void;
  handleDeleteInteraction: (id: number, e: React.MouseEvent) => void;
}

export function AIWorkspaceModal({
  selectedDoc,
  setSelectedDoc,
  mobileToolsOpen,
  setMobileToolsOpen,
  aiMode,
  setAiMode,
  aiLoading,
  aiResult,
  setAiResult,
  quizType,
  setQuizType,
  numQuestions,
  setNumQuestions,
  timeLimit,
  setTimeLimit,
  quizData,
  setQuizData,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  userAnswers,
  setUserAnswers,
  quizFinished,
  setQuizFinished,
  timeLeft,
  isGradingTheory,
  flashcardsData,
  flashcardIndex,
  setFlashcardIndex,
  isFlipped,
  setIsFlipped,
  smartHighlights,
  readerFontSize,
  setReaderFontSize,
  readerSearchQuery,
  setReaderSearchQuery,
  readerCopied,
  setReaderCopied,
  activeHighlightIndex,
  setActiveHighlightIndex,
  interactionHistory,
  quizHistory,
  questionInput,
  setQuestionInput,
  isSimplifying,
  isSpeaking,
  runAiAction,
  handleExplainSimpler,
  handleTTS,
  handleDeleteInteraction,
}: AIWorkspaceModalProps) {
  return (
    <Dialog open={!!selectedDoc} onOpenChange={(open) => { if (!open) { setSelectedDoc(null); setMobileToolsOpen(false); } }}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 flex flex-col overflow-hidden bg-card/95 backdrop-blur-3xl border-border/50 shadow-2xl rounded-2xl">

        {/* Mobile-only top strip with Tools toggle */}
        <div className="md:hidden flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="h-7 w-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold truncate">{selectedDoc?.title}</span>
          </div>
          <button
            onClick={() => setMobileToolsOpen(p => !p)}
            className="ml-2 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold transition-all hover:bg-primary/20"
          >
            {mobileToolsOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            {mobileToolsOpen ? 'Back' : 'Tools'}
          </button>
        </div>

        {/* Responsive body wrapper: column on mobile, row on md+ */}
        <div className="flex flex-1 min-h-0 flex-col md:flex-row overflow-hidden">

          {/* Left Sidebar - Actions */}
          <div className={`${mobileToolsOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-border/50 bg-background/50 flex-col overflow-y-auto`}>
            <div className="hidden md:block p-6 border-b border-border/50">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                <Sparkles className="h-4 w-4" /> BUK AI Studio
              </div>
              <h2 className="font-display text-xl font-semibold tracking-tight leading-tight line-clamp-2">
                {selectedDoc?.title}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Tools</div>

              <button
                onClick={() => runAiAction('read')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'read' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <BookOpen className="h-5 w-5" /> Smart Reading Mode
              </button>

              <button
                onClick={() => runAiAction('summary')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'summary' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <Sparkles className="h-5 w-5" /> Executive Summary
              </button>

              <button
                onClick={() => runAiAction('guide')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'guide' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <BookOpen className="h-5 w-5" /> Study Guide
              </button>

              <button
                onClick={() => { setAiMode('ask'); setAiResult(""); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'ask' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <MessageSquare className="h-5 w-5" /> Chat with Document
              </button>

              <div className="my-4 border-t border-border/50"></div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Document History</div>

              <button
                onClick={() => { setAiMode('history'); setAiResult(""); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'history' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <Clock className="h-5 w-5" /> View Past AI Activity
              </button>

              <button
                onClick={() => runAiAction('flashcards')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'flashcards' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <FlipHorizontal className="h-5 w-5" /> Flashcards
              </button>

              <button
                onClick={() => runAiAction('mindmap')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'mindmap' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}
              >
                <Globe className="h-5 w-5" /> Mind Map
              </button>

              <div className={`mt-4 rounded-xl transition-all border ${aiMode === 'quiz' ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-secondary/20'}`}>
                <button
                  onClick={() => setAiMode('quiz')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${aiMode === 'quiz' ? 'text-primary' : 'text-foreground/80'}`}
                >
                  <ListChecks className="h-5 w-5" /> Generate Quiz
                </button>

                {aiMode === 'quiz' && (
                  <div className="p-3 pt-0 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground ml-1 mb-1">Quiz Format</div>
                    <button
                      onClick={() => setQuizType('objective')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border ${quizType === 'objective' ? 'bg-background border-primary/40 shadow-sm' : 'border-transparent hover:bg-background/50'}`}
                    >
                      Multiple Choice (Objective)
                    </button>
                    <button
                      onClick={() => setQuizType('interactive_theory')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border ${quizType === 'interactive_theory' ? 'bg-background border-primary/40 shadow-sm' : 'border-transparent hover:bg-background/50'}`}
                    >
                      Interactive Theory (AI Graded)
                    </button>
                    <button
                      onClick={() => setQuizType('practice_paper')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border ${quizType === 'practice_paper' ? 'bg-background border-primary/40 shadow-sm' : 'border-transparent hover:bg-background/50'}`}
                    >
                      Practice Questions (Paper)
                    </button>

                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-muted-foreground">Questions</span>
                        <span className="text-xs font-bold">{numQuestions}</span>
                      </div>
                      <input type="range" min="3" max="60" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full accent-primary" />

                      <div className="flex justify-between items-center px-1 pt-2">
                        <span className="text-xs text-muted-foreground">Time Limit (min)</span>
                        <span className="text-xs font-bold">{timeLimit}</span>
                      </div>
                      <input type="range" min="1" max="120" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <Button onClick={() => runAiAction('quiz')} className="w-full mt-4 h-8 text-xs">
                      Generate Now
                    </Button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Area - Content */}
          <div className={`${mobileToolsOpen ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-h-0 bg-card relative`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 scroll-smooth">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-500">
                  <div className="relative flex items-center justify-center h-32 w-32 mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary/60 animate-spin" style={{ animationDuration: '1.5s' }} />
                    <div className="absolute inset-3 rounded-full border-4 border-amber-500/10 border-b-amber-500/60 animate-spin" style={{ animationDuration: '2.2s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-3">Smart AI is thinking...</h3>
                  <p className="text-sm text-muted-foreground max-w-xs text-center mb-6">Analyzing your document with lightning-fast AI. This usually takes under 5 seconds.</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : aiMode === 'quiz' && quizData ? (
                <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500">
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-border/50 relative">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Time Remaining</div>
                        <div className={`font-display text-3xl font-semibold ${timeLeft !== null && timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                          {Math.floor((timeLeft || 0) / 60)}:{(timeLeft || 0) % 60 < 10 ? '0' : ''}{(timeLeft || 0) % 60}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Progress</div>
                        <div className="font-display text-3xl font-semibold">
                          {quizFinished ? quizData.length : currentQuestionIndex + 1} <span className="text-lg text-muted-foreground">/ {quizData.length}</span>
                        </div>
                      </div>
                      {!quizFinished && (
                        <button
                          onClick={() => { setQuizData(null); setAiMode(null); }}
                          className="absolute -top-3 -right-3 h-8 w-8 bg-card border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors shadow-sm"
                          title="Exit Quiz"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Question Navigator */}
                    {!quizFinished && (
                      <div className="flex flex-wrap gap-2 p-4 bg-secondary/20 rounded-2xl border border-border/50 max-h-32 overflow-y-auto">
                        {quizData.map((_, idx) => {
                          const isAnswered = userAnswers[idx] !== undefined;
                          const isCurrent = idx === currentQuestionIndex;
                          return (
                            <button
                              key={idx}
                              onClick={() => setCurrentQuestionIndex(idx)}
                              className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground' :
                                  isAnswered ? 'bg-secondary text-foreground border border-border/50' : 'bg-transparent border border-border/50 text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {!quizFinished ? (
                    <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                      <h3 className="text-xl font-semibold mb-6 leading-relaxed">{quizData[currentQuestionIndex].question}</h3>

                      {quizType === 'objective' && quizData[currentQuestionIndex].options && (
                        <div className="space-y-3">
                          {quizData[currentQuestionIndex].options.map((option: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }))}
                              className={`w-full text-left p-4 rounded-2xl border transition-all ${userAnswers[currentQuestionIndex] === idx
                                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                                  : 'border-border/50 hover:border-primary/40 hover:bg-secondary/20'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center h-6 w-6 rounded-full border text-xs font-bold ${userAnswers[currentQuestionIndex] === idx ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 text-muted-foreground'
                                  }`}>
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-sm font-medium">{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {quizType === 'interactive_theory' && (
                        <div className="space-y-3">
                          <textarea
                            className="w-full min-h-[200px] p-5 rounded-2xl border border-border/50 bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none text-sm leading-relaxed"
                            placeholder="Type your essay answer here..."
                            value={(userAnswers[currentQuestionIndex] as string) || ''}
                            onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                          />
                        </div>
                      )}

                      {quizType === 'practice_paper' && (
                        <div className="space-y-3">
                          <div className="p-8 rounded-2xl border-2 border-dashed border-border/50 bg-secondary/10 flex flex-col items-center justify-center text-center min-h-[150px]">
                            <BookOpen className="h-8 w-8 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-foreground font-medium">Write your answer on your physical paper.</p>
                            <p className="text-xs text-muted-foreground mt-1">Click 'Next' when you're ready for the next question.</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-8 flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="rounded-xl"
                        >
                          Previous
                        </Button>
                        {currentQuestionIndex === quizData.length - 1 ? (
                          <Button
                            onClick={() => setQuizFinished(true)}
                            className="rounded-xl px-8 bg-primary text-primary-foreground"
                          >
                            Submit Quiz
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setCurrentQuestionIndex(p => Math.min(quizData.length - 1, p + 1))}
                            className="rounded-xl px-8"
                            disabled={
                              quizType === 'objective'
                                ? userAnswers[currentQuestionIndex] === undefined
                                : false
                            }
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {quizType === 'objective' ? (
                        <div className="bg-card border border-border/50 rounded-3xl p-8 text-center shadow-sm">
                          <h2 className="font-display text-3xl font-bold mb-2">Quiz Complete!</h2>
                          <div className="text-6xl font-display text-primary my-6">
                            {Object.keys(userAnswers).filter(k => userAnswers[Number(k)] === quizData[Number(k)].correct_answer).length}
                            <span className="text-3xl text-muted-foreground">/ {quizData.length}</span>
                          </div>
                          <p className="text-muted-foreground">
                            {Object.keys(userAnswers).filter(k => userAnswers[Number(k)] === quizData[Number(k)].correct_answer).length / quizData.length >= 0.7
                              ? "Great job! You have a solid understanding of this material."
                              : "Keep studying! Review the explanations below to improve."}
                          </p>
                        </div>
                      ) : quizType === 'interactive_theory' ? (
                        <div className="bg-card border border-border/50 rounded-3xl p-8 text-center shadow-sm">
                          <h2 className="font-display text-3xl font-bold mb-2">Essay Submitted!</h2>
                          <p className="text-muted-foreground">
                            {isGradingTheory ? "Our AI is currently grading your answers. Please wait a moment..." : "Review your graded answers below!"}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-card border border-border/50 rounded-3xl p-8 text-center shadow-sm">
                          <h2 className="font-display text-3xl font-bold mb-2">Practice Complete!</h2>
                          <p className="text-muted-foreground">Review the model answers below to assess your physical paper answers.</p>
                        </div>
                      )}

                      {/* AI Performance Analysis */}
                      {quizType === 'objective' && (
                        <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 shadow-sm">
                          <div className="flex items-center gap-2 mb-6">
                            <Brain className="h-6 w-6 text-primary" />
                            <h3 className="font-display text-xl font-bold">AI Performance Analysis</h3>
                          </div>

                          {(() => {
                            const topicStats: Record<string, { total: number; correct: number }> = {};
                            quizData.forEach((q: any, i: number) => {
                              const topic = q.topic || "General Concepts";
                              if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
                              topicStats[topic].total += 1;
                              if (userAnswers[i] === q.correct_answer) {
                                topicStats[topic].correct += 1;
                              }
                            });

                            const strengths: string[] = [];
                            const weaknesses: string[] = [];

                            Object.entries(topicStats).forEach(([topic, stats]) => {
                              const accuracy = stats.correct / stats.total;
                              if (accuracy >= 0.7) strengths.push(topic);
                              else weaknesses.push(topic);
                            });

                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-card border border-border/50 rounded-2xl p-5">
                                  <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
                                    <Target className="h-5 w-5" />
                                    <h4 className="font-bold">Your Strengths</h4>
                                  </div>
                                  {strengths.length > 0 ? (
                                    <ul className="space-y-2">
                                      {strengths.map(s => (
                                        <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> {s}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">Need more practice to build strengths.</p>
                                  )}
                                </div>
                                <div className="bg-card border border-border/50 rounded-2xl p-5">
                                  <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
                                    <TrendingDown className="h-5 w-5" />
                                    <h4 className="font-bold">Needs Review</h4>
                                  </div>
                                  {weaknesses.length > 0 ? (
                                    <ul className="space-y-2">
                                      {weaknesses.map(w => (
                                        <li key={w} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <XCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> {w}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">Excellent! No major weaknesses identified.</p>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <div className="space-y-4">
                        <h3 className="font-display text-xl font-bold px-2">Review Answers</h3>
                        {quizData.map((q: any, i: number) => {
                          if (quizType === 'objective') {
                            const isCorrect = userAnswers[i] === q.correct_answer;
                            return (
                              <div key={i} className={`p-6 rounded-2xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                <h4 className="font-medium mb-4">{i + 1}. {q.question}</h4>
                                <div className="space-y-2 mb-4">
                                  {q.options.map((opt: string, optIdx: number) => (
                                    <div key={optIdx} className={`p-3 rounded-xl text-sm flex items-center gap-2 ${optIdx === q.correct_answer ? 'bg-green-500/20 text-green-700 dark:text-green-400 font-bold' :
                                        optIdx === userAnswers[i] ? 'bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-background/50'
                                      }`}>
                                      <div className="h-4 w-4 shrink-0 rounded-full border border-current flex items-center justify-center text-[10px]">
                                        {optIdx === q.correct_answer ? '✓' : optIdx === userAnswers[i] ? '✗' : ''}
                                      </div>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                                {!isCorrect && (
                                  <div className="p-4 rounded-xl bg-background border border-border/50 text-sm">
                                    <span className="font-bold text-primary">Explanation:</span> {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            if (quizType === 'interactive_theory' && isGradingTheory) {
                              return (
                                <div key={i} className={`p-6 rounded-2xl border border-border/50 bg-card/50 text-center`}>
                                  <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                                  <p className="text-sm font-medium animate-pulse">Grading Question {i + 1}...</p>
                                </div>
                              );
                            }

                            const scoreColor = q.grading?.score >= 70 ? 'text-green-500 bg-green-500/10 border-green-500/30' : q.grading?.score >= 40 ? 'text-amber-500 bg-amber-500/10 border-amber-500/30' : 'text-red-500 bg-red-500/10 border-red-500/30';
                            return (
                              <div key={i} className={`p-6 rounded-2xl border border-border/50 bg-card`}>
                                <div className="flex justify-between items-start gap-4 mb-4">
                                  <h4 className="font-medium flex-1">{i + 1}. {q.question}</h4>
                                  {quizType === 'interactive_theory' && (
                                    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold border ${scoreColor}`}>
                                      {q.grading?.score || 0}
                                    </div>
                                  )}
                                </div>

                                <div className="mb-4">
                                  <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Your Answer</div>
                                  <div className="p-4 rounded-xl bg-secondary/30 text-sm leading-relaxed border border-border/50 whitespace-pre-wrap">
                                    {(userAnswers[i] as string) || <span className="text-muted-foreground italic">No answer provided.</span>}
                                  </div>
                                </div>

                                {quizType === 'interactive_theory' && q.grading?.feedback && (
                                  <div className="mb-4">
                                    <div className="text-xs font-bold uppercase text-muted-foreground mb-1">AI Feedback</div>
                                    <div className="p-4 rounded-xl bg-primary/5 text-sm leading-relaxed border border-primary/20">
                                      {q.grading?.feedback}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <div className="text-xs font-bold uppercase text-muted-foreground mb-1">{quizType === 'interactive_theory' ? 'Model Answer' : 'Model Answer / Rubric'}</div>
                                  <div className="p-4 rounded-xl bg-secondary/30 text-sm leading-relaxed border border-border/50">
                                    {q.suggested_answer}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>

                      {/* Quiz Completion Actions */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border/50">
                        <Button
                          onClick={() => {
                            setQuizFinished(false);
                            setCurrentQuestionIndex(0);
                            setUserAnswers({});
                          }}
                          className="flex-1 rounded-xl"
                          size="lg"
                        >
                          Retake Quiz
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setAiMode(null)}
                          className="flex-1 rounded-xl"
                          size="lg"
                        >
                          Exit to Workspace
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : aiMode === 'read' ? (
                <div className="max-w-4xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  {/* Header & Title Banner */}
                  <div className="bg-gradient-to-r from-primary/10 via-amber-500/5 to-transparent border border-primary/20 rounded-3xl p-6 md:p-8 mb-6 shadow-lg backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <BookOpen className="h-32 w-32 text-primary" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                              Smart Reader Active
                            </span>
                            {smartHighlights && smartHighlights.length > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                                ✨ {smartHighlights.length} AI Highlights
                              </span>
                            )}
                          </div>
                          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">{selectedDoc?.title}</h2>
                        </div>
                      </div>

                      {/* Stats Badges */}
                      <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground bg-background/60 dark:bg-card/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border/50 shadow-sm self-start md:self-auto">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>~{Math.max(1, Math.ceil(((selectedDoc?.extracted_text || '').split(/\s+/).filter(Boolean).length) / 200))} min read</span>
                        </div>
                        <span className="text-border">|</span>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-amber-500" />
                          <span>{((selectedDoc?.extracted_text || '').split(/\s+/).filter(Boolean).length).toLocaleString()} words</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reader Control Toolbar */}
                  <div className="sticky top-2 z-30 mb-6 bg-card/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-border/60 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
                    {/* Search inside text */}
                    <div className="flex items-center gap-2 bg-secondary/40 rounded-xl px-3 py-1.5 border border-border/40 flex-1 min-w-[200px]">
                      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        placeholder="Search document text..."
                        value={readerSearchQuery}
                        onChange={(e) => setReaderSearchQuery(e.target.value)}
                        className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
                      />
                      {readerSearchQuery && (
                        <button onClick={() => setReaderSearchQuery('')} className="text-muted-foreground hover:text-foreground text-xs">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Font Size Selector */}
                      <div className="flex items-center bg-secondary/40 rounded-xl p-1 border border-border/40">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">Size</span>
                        {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setReaderFontSize(size)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${readerFontSize === size
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                            {size.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {/* Listen / TTS Button */}
                      <button
                        onClick={handleTTS}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${isSpeaking
                            ? 'border-red-500/40 bg-red-500/10 text-red-500 animate-pulse'
                            : 'border-border/50 bg-secondary/40 hover:bg-secondary text-foreground'
                          }`}
                      >
                        {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
                        {isSpeaking ? 'Stop Reading' : 'Listen'}
                      </button>

                      {/* Copy Text Button */}
                      <button
                        onClick={() => {
                          if (selectedDoc?.extracted_text) {
                            navigator.clipboard.writeText(selectedDoc.extracted_text);
                            setReaderCopied(true);
                            toast.success("Document text copied to clipboard!");
                            setTimeout(() => setReaderCopied(false), 2000);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-secondary/40 hover:bg-secondary px-3 py-1.5 text-xs font-bold text-foreground transition-all"
                      >
                        {readerCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                        {readerCopied ? 'Copied!' : 'Copy Text'}
                      </button>
                    </div>
                  </div>

                  {/* AI Highlights Navigation Bar (if available) */}
                  {smartHighlights && smartHighlights.length > 0 && (
                    <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          <span>AI Key Concepts (Click to jump)</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{smartHighlights.length} Key Concepts</span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        {smartHighlights.map((phrase, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveHighlightIndex(idx);
                              const el = document.getElementById(`hl-${idx}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left truncate max-w-xs ${activeHighlightIndex === idx
                                ? 'bg-amber-500 text-black font-bold border-amber-600 shadow-md ring-2 ring-amber-500/40'
                                : 'bg-background/80 hover:bg-amber-500/10 text-foreground border-border/60 hover:border-amber-500/40'
                              }`}
                            title={phrase}
                          >
                            <span className="text-amber-500 font-bold mr-1">#{idx + 1}</span> {phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reader Canvas Card */}
                  <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-12 shadow-xl relative backdrop-blur-xl">
                    <div className={`prose dark:prose-invert max-w-none ${readerFontSize === 'sm' ? 'text-xs md:text-sm leading-normal' :
                        readerFontSize === 'base' ? 'text-sm md:text-base leading-relaxed' :
                          readerFontSize === 'lg' ? 'text-base md:text-lg leading-relaxed' :
                            'text-lg md:text-xl leading-loose'
                      }`}>
                      {(() => {
                        let text = selectedDoc?.extracted_text || "No text available.";

                        // Step 1: Escape HTML
                        const escapeHtml = (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        let safeText = escapeHtml(text);

                        // Step 2: Intelligent Section & Bullet Separator
                        safeText = safeText
                          .replace(/([\.!\?])\s+(\d+\.\s+[A-Z])/g, '$1\n\n$2')
                          .replace(/([^\n])\s+([\u2022\u25CB\u25CF\u25E6\-]\s+)/g, '$1\n$2')
                          .replace(/([^\n])\s+((?:Paradigm|Features|Characteristics|Architecture|Knowledge Base):)/gi, '$1\n$2');

                        // Step 3: Highlight user search term
                        if (readerSearchQuery.trim()) {
                          const queryEscaped = readerSearchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                          const searchRegex = new RegExp(`(${queryEscaped})`, 'gi');
                          safeText = safeText.replace(searchRegex, '<mark class="bg-cyan-400/40 dark:bg-cyan-500/40 text-cyan-950 dark:text-cyan-100 font-bold px-1 rounded shadow-sm">$1</mark>');
                        }

                        // Step 4: Highlight AI Smart Concepts
                        if (smartHighlights && smartHighlights.length > 0) {
                          smartHighlights.forEach((phrase, idx) => {
                            if (!phrase || phrase.length < 4) return;
                            const safePhrase = escapeHtml(phrase);
                            const escapedPhrase = safePhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(`(${escapedPhrase})`, 'gi');
                            const isActive = activeHighlightIndex === idx;
                            safeText = safeText.replace(regex,
                              `<mark id="hl-${idx}" class="bg-amber-400/40 dark:bg-amber-500/35 border-b-2 ${isActive ? 'border-amber-600 bg-amber-400/70 font-bold ring-2 ring-amber-500/50' : 'border-amber-500/80'} text-amber-950 dark:text-amber-100 px-1.5 py-0.5 rounded font-semibold inline transition-all duration-300 shadow-sm">$1</mark>`
                            );
                          });
                        }

                        // Step 5: Split by double newlines into major section blocks
                        const blocks = safeText.split(/\n\s*\n/);

                        return blocks.map((block, blockIdx) => {
                          const trimmed = block.trim();
                          if (!trimmed) return null;

                          const isMajorHeader = /^(?:\d+[\.\)]\s+[A-Z]|[A-Z][A-Za-z0-9\s,\-\/]{3,65}:?$)/.test(trimmed) && trimmed.length < 90 && !trimmed.endsWith('.');

                          if (isMajorHeader) {
                            return (
                              <div key={blockIdx} className="mt-10 mb-5 pt-6 border-t border-border/50">
                                <h3 className="font-display text-xl md:text-2xl font-bold text-primary tracking-tight flex items-center gap-3">
                                  <span className="h-6 w-1.5 rounded-full bg-primary inline-block shrink-0" />
                                  <span dangerouslySetInnerHTML={{ __html: trimmed }} />
                                </h3>
                              </div>
                            );
                          }

                          const lines = trimmed.split('\n');

                          return (
                            <div key={blockIdx} className="mb-6 space-y-3">
                              {lines.map((line, lineIdx) => {
                                const cleanLine = line.trim();
                                if (!cleanLine) return null;

                                const isBullet = /^[\u2022\u25CB\u25CF\u25E6\-\*]\s*/.test(cleanLine);
                                const isSubHeader = /^(?:\d+[\.\)]\s+[A-Z]|(?:Paradigm|Features|Characteristics|Architecture):)/.test(cleanLine);

                                if (isBullet) {
                                  const content = cleanLine.replace(/^[\u2022\u25CB\u25CF\u25E6\-\*]\s*/, '');
                                  return (
                                    <div key={lineIdx} className="flex items-start gap-3 pl-4 md:pl-6 py-1 border-l-2 border-primary/25 hover:border-primary/60 transition-colors">
                                      <span className="text-primary font-bold text-base select-none shrink-0">•</span>
                                      <div className="text-foreground/90 font-sans leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: content }} />
                                    </div>
                                  );
                                }

                                if (isSubHeader) {
                                  return (
                                    <div key={lineIdx} className="mt-5 mb-2 font-display text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                                      <span className="h-2 w-2 rounded-full bg-amber-500 inline-block shrink-0" />
                                      <span dangerouslySetInnerHTML={{ __html: cleanLine }} />
                                    </div>
                                  );
                                }

                                return (
                                  <p
                                    key={lineIdx}
                                    className="text-foreground/90 font-sans leading-relaxed text-left"
                                    dangerouslySetInnerHTML={{ __html: cleanLine }}
                                  />
                                );
                              })}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              ) : aiMode === 'history' ? (
                <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold">Document AI History</h2>
                      <p className="text-muted-foreground text-sm">Review all past interactions, summaries, and guides for this document.</p>
                    </div>
                  </div>

                  {interactionHistory.filter(h => h.document_id === selectedDoc.id && h.interaction_type !== 'chat').length === 0 && quizHistory.filter(h => h.document_id === selectedDoc.id).length === 0 ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-3xl border border-border/50">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No History Found</h3>
                      <p className="text-muted-foreground">Generate a summary, study guide, or quiz to see your history here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 pb-12">
                      <h3 className="font-display text-lg font-semibold">Generated Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {interactionHistory.filter(h => h.document_id === selectedDoc.id && h.interaction_type !== 'chat').map((history, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setAiMode(history.interaction_type === 'summary' ? 'summary' : 'guide');
                              setAiResult(history.response);
                            }}
                            className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col cursor-pointer hover:border-primary/50 transition-colors group relative"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                {history.interaction_type === 'summary' ? <><Sparkles className="h-3 w-3" /> Summary</> : <><BookOpen className="h-3 w-3" /> Study Guide</>}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">{new Date(history.created_at).toLocaleDateString()}</div>
                                <button
                                  onClick={(e) => handleDeleteInteraction(history.id, e)}
                                  className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-foreground/80 line-clamp-2 mt-auto pr-2">
                              {history.response.substring(0, 100).replace(/[*#`]/g, '')}...
                            </p>
                          </div>
                        ))}
                      </div>

                      <h3 className="font-display text-lg font-semibold mt-10">Quiz Attempts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quizHistory.filter(h => h.document_id === selectedDoc.id).map((history, idx) => (
                          <div
                            key={idx}
                            className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => {
                              if (history.quiz_data && history.quiz_data.length > 0) {
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
                            <div>
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
                                {history.quiz_type === 'objective' ? 'Multiple Choice' : history.quiz_type === 'interactive_theory' ? 'Theory (Graded)' : 'Practice Paper'}
                              </div>
                              <div className="text-xs text-muted-foreground">{new Date(history.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Score</div>
                              <div className="font-display font-bold text-2xl text-primary">
                                {history.quiz_type === 'practice_paper' ? '-' : (history.quiz_type === 'interactive_theory' ? `${history.score}%` : `${history.score}/${history.total_questions}`)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : aiMode === 'flashcards' && flashcardsData ? (
                <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full animate-in fade-in duration-500">
                  <div className="flex items-center justify-between w-full mb-8">
                    <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                      <FlipHorizontal className="h-6 w-6 text-primary" /> Flashcards
                    </h2>
                    <div className="text-sm font-bold bg-secondary/50 px-4 py-2 rounded-full border border-border/50 shadow-sm">
                      {flashcardIndex + 1} <span className="text-muted-foreground font-normal">/ {flashcardsData.length}</span>
                    </div>
                  </div>

                  <div
                    className="relative w-full min-h-[280px] sm:min-h-[360px] aspect-[4/3] sm:aspect-[3/2] cursor-pointer group"
                    style={{ perspective: '1000px' }}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div
                      className="absolute inset-0 w-full h-full transition-all duration-500 shadow-xl rounded-3xl"
                      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 w-full h-full bg-card border border-border/50 rounded-3xl p-4 sm:p-8 pt-12 pb-10 sm:pt-14 sm:pb-12 flex flex-col items-center justify-center text-center overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[10px] font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/20">Front</div>
                        <div className="w-full flex-1 flex items-center justify-center overflow-y-auto px-1 sm:px-4 my-auto scrollbar-thin">
                          <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-snug sm:leading-tight break-words max-w-full">{flashcardsData[flashcardIndex].front}</h3>
                        </div>
                        <p className="absolute bottom-3 sm:bottom-6 text-muted-foreground text-xs sm:text-sm opacity-60 group-hover:opacity-100 transition-opacity">Click to reveal back</p>
                      </div>
                      {/* Back */}
                      <div
                        className="absolute inset-0 w-full h-full bg-primary/5 border border-primary/20 rounded-3xl p-4 sm:p-8 pt-12 pb-10 sm:pt-14 sm:pb-12 flex flex-col items-center justify-center text-center overflow-hidden"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[10px] font-bold uppercase tracking-widest text-primary/60 bg-primary/10 px-3 py-1 rounded-full border border-primary/30">Back</div>
                        <div className="w-full flex-1 flex items-center justify-center overflow-y-auto px-1 sm:px-4 my-auto scrollbar-thin">
                          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-xl mx-auto break-words max-w-full">{flashcardsData[flashcardIndex].back}</p>
                        </div>
                        <p className="absolute bottom-3 sm:bottom-6 text-primary/50 text-xs sm:text-sm opacity-60 group-hover:opacity-100 transition-opacity">Click to reveal front</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-12 w-full max-w-md mx-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => { setFlashcardIndex(p => Math.max(0, p - 1)); setIsFlipped(false); }}
                      disabled={flashcardIndex === 0}
                      className="rounded-xl flex-1 h-12"
                    >
                      Previous
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => { setFlashcardIndex(p => Math.min(flashcardsData.length - 1, p + 1)); setIsFlipped(false); }}
                      disabled={flashcardIndex === flashcardsData.length - 1}
                      className="rounded-xl flex-1 h-12"
                    >
                      Next Card
                    </Button>
                  </div>
                </div>
              ) : (!aiMode && (!aiResult || aiResult === 'quiz_active' || aiResult === 'flashcards_active') && !quizData && !flashcardsData) ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                  <div className="relative h-28 w-28 mb-8">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-amber-500/10 animate-pulse" />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      <Brain className="h-14 w-14 text-primary/70" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground">AI Studio Ready</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Powered by <span className="text-primary font-semibold">Groq · Llama 3</span> for lightning-fast answers — pick a tool on the left to get started.
                  </p>
                  <div className="mt-6 flex flex-col gap-2 w-full">
                    {[
                      { icon: Sparkles, label: 'Executive Summary', desc: 'Get a concise overview instantly', action: () => runAiAction('summary'), color: 'text-primary', bg: 'bg-primary/10' },
                      { icon: BookOpen, label: 'Study Guide', desc: 'Generate structured study notes', action: () => runAiAction('guide'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                      { icon: MessageSquare, label: 'Chat with Document', desc: 'Ask anything about your notes', action: () => { setAiMode('ask'); setAiResult(''); }, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-secondary/30 transition-all group text-left">
                        <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : aiMode === 'mindmap' && aiResult ? (
                <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-500 h-[70vh] flex flex-col">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold">Concept Mind Map</h2>
                      <p className="text-muted-foreground text-sm">A visual representation of the core concepts in your document.</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 bg-secondary/10 rounded-2xl border border-border/50 overflow-hidden shadow-inner">
                    {aiResult === "..............................." ? (
                      <div className="h-full w-full flex items-center justify-center text-primary animate-pulse text-2xl tracking-widest">{aiResult}</div>
                    ) : (
                      <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-primary animate-pulse text-sm font-semibold">Loading MindMap Engine...</div>}>
                        <MermaidChart chart={aiResult} />
                      </Suspense>
                    )}
                  </div>
                </div>
              ) : aiMode === 'ask' && !aiResult ? (
                <div className="flex flex-col justify-center h-full max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <h3 className="font-display text-3xl font-medium">Ask Anything</h3>
                    <p className="mt-2 text-muted-foreground">Our AI has read your entire document and is ready to answer.</p>
                  </div>
                  <div className="flex gap-3 bg-secondary/30 p-2 rounded-2xl border border-border/50 shadow-sm focus-within:border-primary/50 transition-colors">
                    <Input
                      placeholder="e.g., Explain the main theory in chapter 2..."
                      className="border-0 bg-transparent text-base h-12 focus-visible:ring-0"
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && runAiAction('ask')}
                    />
                    <Button onClick={() => runAiAction('ask')} size="lg" className="rounded-xl px-8">Ask</Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
                  <div id="ai-result-content" className="prose prose-zinc dark:prose-invert max-w-none">
                    {aiResult.split('\n').map((line, i) => {
                      if (line.startsWith('##')) return <h2 key={i} className="text-2xl font-display font-semibold mt-8 mb-4 text-foreground/90 pb-2 border-b border-border/50">{line.replace(/#/g, '').trim()}</h2>;
                      if (line.startsWith('#')) return <h1 key={i} className="text-3xl font-display font-bold mt-8 mb-6 text-primary">{line.replace(/#/g, '').trim()}</h1>;
                      if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i} className="text-xl font-semibold mt-6 mb-3">{line.replace(/\*\*/g, '')}</h3>;
                      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                        const content = line.replace(/^[-*]\s/, '');
                        const formattedItem = content.split('**').map((part, index) =>
                          index % 2 === 1 ? <strong key={index} className="text-primary">{part}</strong> : part
                        );
                        return <li key={i} className="ml-4 mb-2 marker:text-primary">{formattedItem}</li>;
                      }
                      if (!line.trim()) return <div key={i} className="h-4" />;

                      if (line === '...............................') {
                        return <div key={i} className="mb-4 text-primary animate-pulse text-2xl tracking-widest">{line}</div>;
                      }

                      const formattedLine = line.split('**').map((part, index) =>
                        index % 2 === 1 ? <strong key={index} className="text-foreground font-semibold">{part}</strong> : part
                      );

                      return <p key={i} className="mb-4 leading-relaxed text-foreground/80 text-base">{formattedLine}</p>;
                    })}
                  </div>

                  {/* Action Buttons Bar */}
                  {aiResult && aiResult !== 'quiz_active' && aiResult !== 'flashcards_active' && !aiLoading && (
                    <div className="flex items-center gap-2 mt-8 mb-4 pt-6 border-t border-border/50 flex-wrap">
                      <button
                        onClick={handleExplainSimpler}
                        disabled={isSimplifying}
                        className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-500/20 hover:border-amber-500/50 hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        <Lightbulb className="h-4 w-4" />
                        {isSimplifying ? "Simplifying..." : "Explain Simpler"}
                      </button>
                      <button
                        onClick={handleTTS}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95 ${isSpeaking
                            ? 'border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50'
                          }`}
                      >
                        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        {isSpeaking ? "Stop Reading" : "Listen"}
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            toast.loading("Generating PDF...", { id: "pdf-toast" });
                            await downloadPdf(selectedDoc?.title || 'BUK Scholar Document', aiResult);
                            toast.success("PDF Downloaded successfully!", { id: "pdf-toast" });
                          } catch (error) {
                            console.error(error);
                            toast.error("Failed to generate PDF.", { id: "pdf-toast" });
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-sm font-medium transition-all hover:bg-secondary hover:border-border hover:scale-105 active:scale-95 ml-auto"
                      >
                        <Download className="h-4 w-4" />
                        Save as PDF
                      </button>
                    </div>
                  )}

                  {aiMode === 'ask' && (
                    <div className="mt-12 bg-secondary/30 p-2 rounded-2xl border border-border/50 shadow-sm focus-within:border-primary/50 transition-colors flex gap-3 sticky bottom-4 z-20 backdrop-blur-xl">
                      <Input
                        placeholder="Ask a follow-up question..."
                        className="border-0 bg-transparent text-base h-12 focus-visible:ring-0"
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && runAiAction('ask')}
                      />
                      <Button onClick={() => runAiAction('ask')} size="lg" className="rounded-xl px-8">Ask</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
