import React from 'react';
import { motion } from 'framer-motion';
import { Layers, FileText, CheckCircle2, Brain, Play, Loader2, X, BookOpen, Target, TrendingDown, ListChecks, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageVariants } from './Shared';
import { ProgressRing, DecodingText } from './Shared';

interface MultiDocQuizBoardProps {
  documents: any[];
  selectedDocIds: number[];
  setSelectedDocIds: React.Dispatch<React.SetStateAction<number[]>>;
  multiQuizType: 'objective' | 'interactive_theory' | 'practice_paper';
  setMultiQuizType: (type: 'objective' | 'interactive_theory' | 'practice_paper') => void;
  multiNumQuestions: number;
  setMultiNumQuestions: (num: number) => void;
  multiTimeLimit: number;
  setMultiTimeLimit: (limit: number) => void;
  multiQuizLoading: boolean;
  handleMultiQuizGenerate: () => void;
  multiQuizData: any[] | null;
  setMultiQuizData: (data: any[] | null) => void;
  multiQuizDocTitles: string[];
  multiTimeLeft: number | null;
  setMultiTimeLeft: (time: number | null) => void;
  multiQuizFinished: boolean;
  setMultiQuizFinished: (finished: boolean) => void;
  multiCurrentQ: number;
  setMultiCurrentQ: React.Dispatch<React.SetStateAction<number>>;
  multiUserAnswers: Record<number, number | string>;
  setMultiUserAnswers: React.Dispatch<React.SetStateAction<Record<number, number | string>>>;
  multiPerformanceReport: any;
  setMultiPerformanceReport: (report: any) => void;
  isAnalyzingPerformance: boolean;
  handleAnalyzePerformance: () => void;
}

export function MultiDocQuizBoard({
  documents, selectedDocIds, setSelectedDocIds, multiQuizType, setMultiQuizType,
  multiNumQuestions, setMultiNumQuestions, multiTimeLimit, setMultiTimeLimit,
  multiQuizLoading, handleMultiQuizGenerate, multiQuizData, setMultiQuizData,
  multiQuizDocTitles, multiTimeLeft, setMultiTimeLeft, multiQuizFinished, setMultiQuizFinished,
  multiCurrentQ, setMultiCurrentQ, multiUserAnswers, setMultiUserAnswers,
  multiPerformanceReport, setMultiPerformanceReport, isAnalyzingPerformance, handleAnalyzePerformance
}: MultiDocQuizBoardProps) {
  return (
    <motion.div key="quizboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-primary/10 to-transparent border border-primary/20 p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary mb-3">
              <Layers className="h-3.5 w-3.5" /> MULTI-DOC QUIZ BOARD
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Cross-Document Quiz</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              Tag multiple documents (e.g. all ICT 305 slides), configure your quiz, and Aisha generates one unified test covering all of them.
            </p>
          </div>
          {selectedDocIds.length > 0 && !multiQuizData && (
            <div className="shrink-0 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-2xl px-5 py-3">
              <Layers className="h-5 w-5 text-primary" />
              <div>
                <div className="font-display text-2xl font-bold text-primary">{selectedDocIds.length}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Selected</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!multiQuizData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Selector */}
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Tag Your Documents
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedDocIds(documents.map((d: any) => d.id))} className="text-xs font-semibold text-primary hover:underline">Select All</button>
                <span className="text-muted-foreground">·</span>
                <button onClick={() => setSelectedDocIds([])} className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline">Clear</button>
              </div>
            </div>
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-secondary/20 p-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-semibold">No documents uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-1">Upload your lecture notes or slides first.</p>
                <Button className="mt-4 rounded-full" onClick={() => document.getElementById('file-upload-docs-multi')?.click()}>
                  <Layers className="mr-2 h-4 w-4" /> Upload Document
                </Button>
                <input type="file" id="file-upload-docs-multi" className="hidden" accept=".pdf,.txt,.docx" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc: any, idx: number) => {
                  const palettes = [
                    { ring: 'ring-blue-500/50 bg-blue-500/5 border-blue-500/30', icon: 'bg-blue-500/10 text-blue-500', check: 'bg-blue-500' },
                    { ring: 'ring-emerald-500/50 bg-emerald-500/5 border-emerald-500/30', icon: 'bg-emerald-500/10 text-emerald-500', check: 'bg-emerald-500' },
                    { ring: 'ring-amber-500/50 bg-amber-500/5 border-amber-500/30', icon: 'bg-amber-500/10 text-amber-500', check: 'bg-amber-500' },
                    { ring: 'ring-violet-500/50 bg-violet-500/5 border-violet-500/30', icon: 'bg-violet-500/10 text-violet-500', check: 'bg-violet-500' },
                    { ring: 'ring-rose-500/50 bg-rose-500/5 border-rose-500/30', icon: 'bg-rose-500/10 text-rose-500', check: 'bg-rose-500' },
                  ];
                  const c = palettes[idx % palettes.length];
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocIds(prev =>
                        prev.includes(doc.id) ? prev.filter(id => id !== doc.id) : [...prev, doc.id]
                      )}
                      className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected ? `ring-2 ${c.ring} shadow-sm` : 'border-border/50 hover:border-primary/30 bg-card'
                      }`}
                    >
                      <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${c.icon}`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold line-clamp-1">{doc.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(doc.uploaded_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                          {doc.pages ? ` · ${doc.pages}pp` : ''}
                        </div>
                      </div>
                      <div className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? `${c.check} border-transparent` : 'border-muted-foreground/30 bg-background'
                      }`}>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quiz Config Panel */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Quiz Settings
            </h3>
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Format</div>
              {([
                { val: 'objective', label: 'Multiple Choice', desc: 'Auto-graded MCQ' },
                { val: 'interactive_theory', label: 'Essay / Theory', desc: 'AI-graded essays' },
                { val: 'practice_paper', label: 'Practice Paper', desc: 'Physical paper mode' },
              ] as const).map(t => (
                <button
                  key={t.val}
                  onClick={() => setMultiQuizType(t.val)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    multiQuizType === t.val ? 'bg-primary/10 border-primary/40 text-primary shadow-sm' : 'border-border/50 hover:bg-secondary/50'
                  }`}
                >
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-xs text-muted-foreground font-normal">{t.desc}</div>
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Questions</div>
                <div className="text-sm font-bold text-primary">{multiNumQuestions}</div>
              </div>
              <input type="range" min="3" max="60" value={multiNumQuestions} onChange={e => setMultiNumQuestions(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground"><span>3</span><span>100</span></div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time Limit (min)</div>
                <div className="text-sm font-bold text-primary">{multiTimeLimit}</div>
              </div>
              <input type="range" min="5" max="180" value={multiTimeLimit} onChange={e => setMultiTimeLimit(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground"><span>5</span><span>180</span></div>
            </div>
            <Button
              onClick={handleMultiQuizGenerate}
              disabled={multiQuizLoading || selectedDocIds.length === 0}
              className="w-full h-12 rounded-2xl text-base font-bold mt-auto"
            >
              {multiQuizLoading
                ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                : <><Play className="mr-2 h-5 w-5" /> Generate Quiz</>
              }
            </Button>
            {selectedDocIds.length === 0 && (
              <p className="text-xs text-center text-muted-foreground -mt-3">Select at least 1 document to start</p>
            )}
          </div>
        </div>
      ) : (
        /* ===== ACTIVE MULTI-QUIZ ENGINE ===== */
        <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-500">
          {/* Source doc tags */}
          <div className="flex flex-wrap gap-2">
            {multiQuizDocTitles.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <FileText className="h-3 w-3" /> {t}
              </span>
            ))}
          </div>

          {/* Timer + Progress */}
          <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-border/50 relative">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Time Remaining</div>
              <div className={`font-display text-3xl font-semibold ${multiTimeLeft !== null && multiTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                {Math.floor((multiTimeLeft || 0) / 60)}:{(multiTimeLeft || 0) % 60 < 10 ? '0' : ''}{(multiTimeLeft || 0) % 60}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Progress</div>
              <div className="font-display text-3xl font-semibold">
                {multiQuizFinished ? multiQuizData.length : multiCurrentQ + 1} <span className="text-lg text-muted-foreground">/ {multiQuizData.length}</span>
              </div>
            </div>
            {!multiQuizFinished && (
              <button
                onClick={() => { setMultiQuizData(null); setSelectedDocIds([]); }}
                className="absolute -top-3 -right-3 h-8 w-8 bg-card border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors shadow-sm"
                title="Exit Quiz"
              ><X className="h-4 w-4" /></button>
            )}
          </div>

          {/* Question Navigator */}
          {!multiQuizFinished && (
            <div className="flex flex-wrap gap-2 p-4 bg-secondary/20 rounded-2xl border border-border/50 max-h-28 overflow-y-auto">
              {multiQuizData.map((_, idx) => {
                const isAnswered = multiUserAnswers[idx] !== undefined;
                const isCurrent = idx === multiCurrentQ;
                return (
                  <button
                    key={idx}
                    onClick={() => setMultiCurrentQ(idx)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground' :
                      isAnswered ? 'bg-secondary text-foreground border border-border/50' : 'bg-transparent border border-border/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >{idx + 1}</button>
                );
              })}
            </div>
          )}

          {/* Source doc indicator */}
          {!multiQuizFinished && multiQuizData[multiCurrentQ]?.source_doc && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">From:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-foreground text-xs font-semibold border border-border/50">
                <FileText className="h-3 w-3 text-primary" /> {multiQuizData[multiCurrentQ].source_doc}
              </span>
            </div>
          )}

          {!multiQuizFinished ? (
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 leading-relaxed">{multiQuizData[multiCurrentQ].question}</h3>

              {multiQuizType === 'objective' && multiQuizData[multiCurrentQ].options && (
                <div className="space-y-3">
                  {multiQuizData[multiCurrentQ].options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setMultiUserAnswers(prev => ({ ...prev, [multiCurrentQ]: idx }))}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        multiUserAnswers[multiCurrentQ] === idx
                          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                          : 'border-border/50 hover:border-primary/40 hover:bg-secondary/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-6 w-6 rounded-full border text-xs font-bold ${
                          multiUserAnswers[multiCurrentQ] === idx ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 text-muted-foreground'
                        }`}>{String.fromCharCode(65 + idx)}</div>
                        <span className="text-sm font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {multiQuizType === 'interactive_theory' && (
                <textarea
                  className="w-full min-h-[200px] p-5 rounded-2xl border border-border/50 bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none text-sm leading-relaxed"
                  placeholder="Type your essay answer here..."
                  value={(multiUserAnswers[multiCurrentQ] as string) || ''}
                  onChange={e => setMultiUserAnswers(prev => ({ ...prev, [multiCurrentQ]: e.target.value }))}
                />
              )}

              {multiQuizType === 'practice_paper' && (
                <div className="p-8 rounded-2xl border-2 border-dashed border-border/50 bg-secondary/10 flex flex-col items-center justify-center text-center min-h-[150px]">
                  <BookOpen className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium">Write your answer on physical paper.</p>
                  <p className="text-xs text-muted-foreground mt-1">Click 'Next' when ready for the next question.</p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setMultiCurrentQ(p => Math.max(0, p - 1))} disabled={multiCurrentQ === 0} className="rounded-xl">Previous</Button>
                {multiCurrentQ === multiQuizData.length - 1 ? (
                  <Button onClick={() => setMultiQuizFinished(true)} className="rounded-xl px-8">Submit Quiz</Button>
                ) : (
                  <Button
                    onClick={() => setMultiCurrentQ(p => Math.min(multiQuizData.length - 1, p + 1))}
                    className="rounded-xl px-8"
                    disabled={multiQuizType === 'objective' && multiUserAnswers[multiCurrentQ] === undefined}
                  >Next</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score card */}
              <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 text-center shadow-2xl shadow-black/40">
                <h2 className="font-display text-3xl font-bold mb-8">Quiz Complete! 🎉</h2>
                {multiQuizType === 'objective' && (
                  <div className="my-8">
                    <ProgressRing 
                      radius={100} 
                      stroke={8} 
                      progress={Object.keys(multiUserAnswers).filter(k => multiUserAnswers[Number(k)] === multiQuizData[Number(k)].correct_answer).length} 
                      total={multiQuizData.length} 
                    />
                  </div>
                )}
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {multiQuizType === 'objective'
                    ? (Object.keys(multiUserAnswers).filter(k => multiUserAnswers[Number(k)] === multiQuizData[Number(k)].correct_answer).length / multiQuizData.length >= 0.7
                        ? 'Great job! You have a solid grasp of all the materials.' : 'Keep studying! Review the answers below.')
                    : 'Review the model answers below to assess your performance.'}
                </p>

                {!multiPerformanceReport && multiQuizType === 'objective' && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleAnalyzePerformance} 
                      disabled={isAnalyzingPerformance}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
                    >
                      {isAnalyzingPerformance ? (
                        <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> <DecodingText text="ANALYZING SYNAPSES..." /></div>
                      ) : (
                        <><Sparkles className="mr-2 h-5 w-5" /> Generate AI Performance Report</>
                      )}
                    </Button>
                  </div>
                )}

                <div className="flex gap-3 justify-center mt-6 flex-wrap">
                  <Button variant="outline" className="rounded-xl" onClick={() => { setMultiQuizData(null); setSelectedDocIds([]); setMultiPerformanceReport(null); }}>New Quiz</Button>
                  <Button className="rounded-xl" onClick={() => { setMultiQuizFinished(false); setMultiCurrentQ(0); setMultiUserAnswers({}); setMultiTimeLeft(multiTimeLimit * 60); setMultiPerformanceReport(null); }}>Retake</Button>
                </div>
              </div>

              {/* Premium AI Performance Report Card */}
              {multiPerformanceReport && (
                <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-card p-8 shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                        <Brain className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-foreground">AI Coach Analysis</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                        <h4 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-3">
                          <Target className="h-5 w-5" /> Your Strengths
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{multiPerformanceReport.strengths}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                        <h4 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-3">
                          <TrendingDown className="h-5 w-5" /> Needs Review
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{multiPerformanceReport.weaknesses}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                      <h4 className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400 mb-3">
                        <ListChecks className="h-5 w-5" /> Actionable Study Plan
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{multiPerformanceReport.study_plan}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Review answers */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold px-2">Review Answers</h3>
                {multiQuizData.map((q: any, i: number) => {
                  if (multiQuizType === 'objective') {
                    const isCorrect = multiUserAnswers[i] === q.correct_answer;
                    return (
                      <div key={i} className={`p-6 rounded-2xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-medium flex-1">{i + 1}. {q.question}</h4>
                          {q.source_doc && <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-secondary text-muted-foreground border border-border/50">{q.source_doc}</span>}
                        </div>
                        <div className="space-y-2 mb-3">
                          {q.options?.map((opt: string, optIdx: number) => (
                            <div key={optIdx} className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                              optIdx === q.correct_answer ? 'bg-green-500/20 text-green-700 dark:text-green-400 font-bold' :
                              optIdx === multiUserAnswers[i] ? 'bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-background/50'
                            }`}>
                              <div className="h-4 w-4 shrink-0 rounded-full border border-current flex items-center justify-center text-[10px]">
                                {optIdx === q.correct_answer ? '✓' : optIdx === multiUserAnswers[i] ? '✗' : ''}
                              </div>
                              {opt}
                            </div>
                          ))}
                        </div>
                        {!isCorrect && q.explanation && (
                          <div className="p-4 rounded-xl bg-background border border-border/50 text-sm">
                            <span className="font-bold text-primary">Explanation: </span>{q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="p-6 rounded-2xl border border-border/50 bg-card">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h4 className="font-medium flex-1">{i + 1}. {q.question}</h4>
                        {q.source_doc && <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-secondary text-muted-foreground border border-border/50">{q.source_doc}</span>}
                      </div>
                      <div className="mb-3">
                        <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Your Answer</div>
                        <div className="p-4 rounded-xl bg-secondary/30 text-sm border border-border/50 whitespace-pre-wrap">
                          {(multiUserAnswers[i] as string) || <span className="text-muted-foreground italic">No answer provided.</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Model Answer</div>
                        <div className="p-4 rounded-xl bg-primary/5 text-sm border border-primary/20">{q.suggested_answer}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
