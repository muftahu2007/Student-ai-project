import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, FileText, ListChecks, Calendar } from "lucide-react";

import {
  getDocuments, getUserProfile, uploadDocument, summarizeDocument,
  generateStudyGuide, generateQuiz, saveQuizResult, getQuizHistory,
  gradeTheoryQuiz, getInteractionHistory, deleteInteraction, streamAskQuestion,
  explainSimpler, generateFlashcards, getSchedules, createSchedule, deleteSchedule,
  generateMindMap, generateMultiQuiz, analyzeQuizPerformance, deleteDocument,
  getAnalytics, getSmartReadHighlights, getQuizCacheStatus
} from "@/lib/api";
import { gradeQuiz } from "@/lib/quizValidation";
import { toast } from "sonner";

import { SciFiLoader } from "@/components/dashboard/Shared";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";
import { MyDocuments } from "@/components/dashboard/MyDocuments";
import { MultiDocQuizBoard } from "@/components/dashboard/MultiDocQuizBoard";
import { StudyPlanner } from "@/components/dashboard/StudyPlanner";
import { QuizHistory } from "@/components/dashboard/QuizHistory";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { CreatePlannerModal } from "@/components/dashboard/CreatePlannerModal";
import { AIWorkspaceModal } from "@/components/dashboard/AIWorkspaceModal";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · BUK Scholar AI" },
      { name: "description", content: "Your personal AI study workspace." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [documents, setDocuments] = useState<any[]>([]);
  const [smartHighlights, setSmartHighlights] = useState<string[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [interactionHistory, setInteractionHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // AI Modal State
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [aiMode, setAiMode] = useState<'summary' | 'ask' | 'guide' | 'quiz' | 'history' | 'flashcards' | 'mindmap' | 'read' | null>(null);
  const [quizType, setQuizType] = useState<'objective' | 'interactive_theory' | 'practice_paper'>('objective');
  const [aiResult, setAiResult] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [timeLimit, setTimeLimit] = useState(5);
  const [quizData, setQuizData] = useState<any[] | null>(null);
  const [, setQuizCacheReady] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | string>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGradingTheory, setIsGradingTheory] = useState(false);

  // Flashcards state
  const [flashcardsData, setFlashcardsData] = useState<any[] | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Planner State
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [newScheduleExamName, setNewScheduleExamName] = useState("");
  const [newScheduleExamDate, setNewScheduleExamDate] = useState("");
  const [newScheduleDocIds, setNewScheduleDocIds] = useState<number[]>([]);
  const [plannerLoading, setPlannerLoading] = useState(false);

  // Multi-Doc Quiz Board State
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
  const [multiQuizType, setMultiQuizType] = useState<'objective' | 'interactive_theory' | 'practice_paper'>('objective');
  const [multiNumQuestions, setMultiNumQuestions] = useState(10);
  const [multiTimeLimit, setMultiTimeLimit] = useState(15);
  const [multiQuizLoading, setMultiQuizLoading] = useState(false);
  const [multiQuizData, setMultiQuizData] = useState<any[] | null>(null);
  const [multiQuizDocTitles, setMultiQuizDocTitles] = useState<string[]>([]);
  const [multiCurrentQ, setMultiCurrentQ] = useState(0);
  const [multiUserAnswers, setMultiUserAnswers] = useState<Record<number, number | string>>({});
  const [multiQuizFinished, setMultiQuizFinished] = useState(false);
  const [multiTimeLeft, setMultiTimeLeft] = useState<number | null>(null);
  const [multiPerformanceReport, setMultiPerformanceReport] = useState<any>(null);
  const [isAnalyzingPerformance, setIsAnalyzingPerformance] = useState(false);

  // Smart Reader UI States
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerSearchQuery, setReaderSearchQuery] = useState('');
  const [readerCopied, setReaderCopied] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);

  // Check quiz cache status when selected document changes
  useEffect(() => {
    if (selectedDoc?.id) {
      setQuizCacheReady(false);
      getQuizCacheStatus(selectedDoc.id).then(s => setQuizCacheReady(s.ready && s.question_count >= 10));
    } else {
      setQuizCacheReady(false);
    }
  }, [selectedDoc?.id]);

  // Single-doc quiz countdown
  useEffect(() => {
    if (aiMode !== 'quiz' || !quizData || quizFinished || timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [aiMode, quizData, quizFinished]);

  // Detect when single-doc quiz time runs out
  useEffect(() => {
    if (timeLeft === 0 && !quizFinished && quizData) {
      setQuizFinished(true);
      toast.info("Time's up!");
    }
  }, [timeLeft]);

  // Auto-save quiz result when quiz is finished
  useEffect(() => {
    if (quizFinished && quizData && selectedDoc) {
      const processQuizCompletion = async () => {
        let scoreToSave = 0;
        let totalToSave = quizData.length;
        let strengthsToSave: string[] = [];
        let weaknessesToSave: string[] = [];
        let finalQuizData = [...quizData];

        if (quizType === 'objective') {
          const gradingResult = gradeQuiz(finalQuizData, userAnswers);
          scoreToSave = gradingResult.score;
          totalToSave = gradingResult.totalQuestions;
          strengthsToSave = gradingResult.strengths;
          weaknessesToSave = gradingResult.weaknesses;
        } else if (quizType === 'interactive_theory') {
          try {
            setIsGradingTheory(true);
            const answersToGrade = finalQuizData.map((q: any, idx: number) => ({
              question: q.question,
              suggested_answer: q.suggested_answer,
              user_answer: userAnswers[idx] || ""
            }));

            const gradeResponse = await gradeTheoryQuiz(selectedDoc.id, answersToGrade);

            let parsedGrading = [];
            let rawGrading = gradeResponse.grading.trim();
            if (rawGrading.startsWith('```json')) rawGrading = rawGrading.substring(7);
            if (rawGrading.startsWith('```')) rawGrading = rawGrading.substring(3);
            if (rawGrading.endsWith('```')) rawGrading = rawGrading.substring(0, rawGrading.length - 3);

            parsedGrading = JSON.parse(rawGrading);

            let totalScore = 0;
            parsedGrading.forEach((g: any, idx: number) => {
              totalScore += Number(g.score || 0);
              finalQuizData[idx].grading = { score: g.score, feedback: g.feedback };
            });
            scoreToSave = Math.round(totalScore / totalToSave);

            setQuizData(finalQuizData);
          } catch (err) {
            console.error("Failed to grade theory quiz:", err);
            toast.error("Failed to automatically grade the essay answers.");
          } finally {
            setIsGradingTheory(false);
          }
        }

        saveQuizResult({
          doc_id: selectedDoc.id,
          quiz_type: quizType,
          score: scoreToSave,
          total_questions: totalToSave,
          strengths: strengthsToSave,
          weaknesses: weaknessesToSave,
          quiz_data: finalQuizData,
          user_answers: userAnswers,
        })
          .then(() => {
            getQuizHistory().then(setQuizHistory).catch(console.error);
          })
          .catch((err) => console.error('Failed to save quiz result:', err));
      };

      processQuizCompletion();
    }
  }, [quizFinished]);

  const navigate = useNavigate();

  // Handle session expiry
  useEffect(() => {
    const handleSessionExpired = () => {
      setMultiQuizLoading(false);
      setAiLoading(false);
      toast.error('Your session has expired. Please log in again.', { duration: 4000 });
      setTimeout(() => navigate({ to: '/login' }), 1500);
    };
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [navigate]);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, docsData, historyData, interactionData, schedulesData, analyticsRes] = await Promise.all([
          getUserProfile(),
          getDocuments(),
          getQuizHistory().catch(() => []),
          getInteractionHistory().catch(() => []),
          getSchedules().catch(() => []),
          getAnalytics().catch(() => null)
        ]);

        if (!profileData.profile) {
          navigate({ to: "/onboarding" });
          return;
        }

        setUser(profileData);
        setDocuments(docsData);
        setQuizHistory(historyData);
        setInteractionHistory(interactionData);
        setSchedules(schedulesData);
        if (analyticsRes) setAnalyticsData(analyticsRes);
      } catch (err) {
        console.error(err);
        navigate({ to: "/login" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate({ to: "/login" });
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, tab: 'overview', badge: undefined },
    { label: "My Documents", icon: FileText, tab: 'documents', badge: documents.length > 0 ? documents.length.toString() : undefined },
    { label: "Multi-Doc Quiz", icon: ListChecks, tab: 'quizboard', badge: undefined },
    { label: "Study Planner", icon: Calendar, tab: 'planner', badge: schedules.length > 0 ? schedules.length.toString() : undefined },
    { label: "Quiz History", icon: ListChecks, tab: 'quizzes', badge: quizHistory.length > 0 ? quizHistory.length.toString() : undefined },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const MAX_SIZE_MB = 20;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    try {
      toast.loading("Uploading document...", { id: "upload" });
      await uploadDocument(file);
      const docsData = await getDocuments();
      setDocuments(docsData);
      toast.success("Document uploaded! AI is processing it in the background.", { id: "upload" });
    } catch (err: any) {
      console.error("Failed to upload document", err);
      const msg = err.message || "";
      if (msg.includes('413') || msg.toLowerCase().includes('too large')) {
        toast.error("File is too large for the server. Try a smaller file.", { id: "upload" });
      } else if (msg.includes('401') || msg.includes('403')) {
        toast.error("Session expired. Please log in again.", { id: "upload" });
      } else {
        toast.error("Upload failed. Check your connection and try again.", { id: "upload" });
      }
    }
  };

  const runAiAction = async (mode: 'summary' | 'guide' | 'quiz' | 'ask' | 'history' | 'flashcards' | 'mindmap' | 'read') => {
    if (!selectedDoc) return;
    setAiMode(mode);
    setMobileToolsOpen(false);
    if (mode !== 'history') setAiLoading(true);
    setAiResult("");
    setQuizData(null);
    setFlashcardsData(null);

    try {
      if (mode === 'summary') {
        const res = await summarizeDocument(selectedDoc.id);
        setAiResult(res.summary);
      } else if (mode === 'guide') {
        const res = await generateStudyGuide(selectedDoc.id);
        setAiResult(res.study_guide);
      } else if (mode === 'quiz') {
        const res = await generateQuiz(selectedDoc.id, quizType, numQuestions);
        try {
          let jsonStr = res.quiz;
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
          } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```/g, '').trim();
          }
          const parsed = JSON.parse(jsonStr);
          setQuizData(parsed);
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setQuizFinished(false);
          setTimeLeft(timeLimit * 60);
          setAiResult("quiz_active");
          if (res.cache_hit) {
            toast.success(`⚡ Quiz loaded instantly! ${parsed.length} questions ready.`);
          } else {
            toast.success(`Quiz generated! ${parsed.length} questions ready.`);
          }
          getQuizCacheStatus(selectedDoc.id).then(s => setQuizCacheReady(s.ready && s.question_count >= 10));
        } catch (e) {
          console.error(e);
          toast.error("Failed to parse quiz data.");
        }
      } else if (mode === 'flashcards') {
        const res = await generateFlashcards(selectedDoc.id, 10);
        setFlashcardsData(res.flashcards);
        setFlashcardIndex(0);
        setIsFlipped(false);
        setAiResult("flashcards_active");
      } else if (mode === 'ask') {
        if (!questionInput.trim()) {
          toast.error("Please enter a question");
          setAiLoading(false);
          return;
        }
        const q = questionInput;
        setQuestionInput("");
        setAiLoading(false);
        setAiResult(` **Question:** ${q}\n\n✨ *Smart AI is searching and thinking...*`);
        let isFirst = true;
        await streamAskQuestion(selectedDoc.id, q, (chunk) => {
          if (isFirst) {
            setAiResult(`> **Question:** ${q}\n\n${chunk}`);
            isFirst = false;
          } else {
            setAiResult((prev) => prev + chunk);
          }
        });
        getInteractionHistory().then(setInteractionHistory).catch(console.error);
      } else if (mode === 'mindmap') {
        setAiResult("✨ *Smart AI is searching and thinking...*");
        const res = await generateMindMap(selectedDoc.id);
        setAiResult(res.mindmap);
        getInteractionHistory().then(setInteractionHistory).catch(console.error);
      } else if (mode === 'read') {
        const res = await getSmartReadHighlights(selectedDoc.id);
        setSmartHighlights(res.highlights || []);
        if (res.extracted_text) {
          setSelectedDoc((prev: any) => prev ? { ...prev, extracted_text: res.extracted_text } : prev);
        }
      }
    } catch (err: any) {
      const errMsg = err.message || "";
      const isQuota = errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('exhausted');
      if (isQuota) {
        toast.error("Daily AI limit reached. Resets at ~9 AM Nigeria time.", { duration: 6000 });
        setAiResult(
          "## ⏳ Smart AI is Taking a Short Break\n\n" +
          "You've reached today's free AI quota. This resets every day at approximately **9:00 AM Nigeria time** (midnight Pacific).\n\n" +
          "**Your document is safely saved** — come back in the morning and everything will be ready to go.\n\n" +
          "**In the meantime, you can:**\n" +
          "* Review your previous summaries in the History tab\n" +
          "* Browse your uploaded documents\n" +
          "* Check your quiz scores and performance analysis\n"
        );
      } else {
        toast.error(errMsg || "Failed to process AI request");
        setAiResult("Something went wrong. Please try again in a moment.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleExplainSimpler = async () => {
    if (!aiResult || aiResult === 'quiz_active' || aiResult === 'flashcards_active' || isSimplifying) return;
    setIsSimplifying(true);
    const originalText = aiResult;
    setAiResult("");
    try {
      await explainSimpler(originalText, (chunk) => {
        setAiResult((prev) => prev + chunk);
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to simplify");
      setAiResult(originalText);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleTTS = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!aiResult || aiResult === 'quiz_active' || aiResult === 'flashcards_active') return;
    const plainText = aiResult.replace(/[*#`_~\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDeleteInteraction = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await deleteInteraction(id);
      toast.success("Activity deleted successfully.");
      const histData = await getInteractionHistory();
      setInteractionHistory(histData);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete activity.");
    }
  };

  const handleDeleteDocument = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) return;
    const prevDocs = documents;
    setDocuments(prev => prev.filter((d: any) => d.id !== id));
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc(null);
      setAiMode(null);
      setAiResult("");
    }
    try {
      await deleteDocument(id);
      toast.success("Document deleted.");
      getDocuments().then(setDocuments).catch(() => {});
    } catch (err: any) {
      setDocuments(prevDocs);
      toast.error(err.message || "Failed to delete document.");
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("Delete this study plan? This cannot be undone.")) return;
    try {
      await deleteSchedule(id);
      toast.success("Study plan deleted.");
      setSchedules(prev => prev.filter((s: any) => s.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete schedule.");
    }
  };

  // Multi-Quiz countdown
  useEffect(() => {
    if (activeTab !== 'quizboard' || !multiQuizData || multiQuizFinished || multiTimeLeft === null || multiTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setMultiTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, multiQuizData, multiQuizFinished]);

  // Detect when multi-quiz time runs out
  useEffect(() => {
    if (multiTimeLeft === 0 && !multiQuizFinished && multiQuizData) {
      setMultiQuizFinished(true);
      toast.info("Time's up!");
    }
  }, [multiTimeLeft]);

  const handleMultiQuizGenerate = async () => {
    if (selectedDocIds.length === 0) {
      toast.error("Please select at least one document.");
      return;
    }
    setMultiQuizLoading(true);
    setMultiQuizData(null);
    setMultiQuizFinished(false);
    setMultiCurrentQ(0);
    setMultiUserAnswers({});
    setMultiTimeLeft(null);
    toast.loading("Smart AI is generating your multi-document quiz...", { id: 'multiquiz' });
    try {
      const res = await generateMultiQuiz(selectedDocIds, multiQuizType, multiNumQuestions);
      let jsonStr = res.quiz;
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```/g, '').trim();
      }
      const parsed = JSON.parse(jsonStr);
      setMultiQuizData(parsed);
      setMultiQuizDocTitles(res.doc_titles || []);
      setMultiTimeLeft(multiTimeLimit * 60);
      toast.success(`Quiz ready! ${parsed.length} questions from ${(res.doc_titles || []).length} documents.`, { id: 'multiquiz' });
    } catch (err: any) {
      const errMsg = err.message || '';
      const isQuota = errMsg.includes('429') || errMsg.toLowerCase().includes('quota');
      if (isQuota) {
        toast.error("Daily AI limit reached. Resets at ~9 AM Nigeria time.", { id: 'multiquiz', duration: 6000 });
      } else {
        toast.error(errMsg || "Failed to generate quiz.", { id: 'multiquiz' });
      }
    } finally {
      setMultiQuizLoading(false);
    }
  };

  const handleAnalyzePerformance = async () => {
    try {
      setIsAnalyzingPerformance(true);
      const score = Object.keys(multiUserAnswers).filter(k => multiUserAnswers[Number(k)] === multiQuizData![Number(k)].correct_answer).length;
      const report = await analyzeQuizPerformance(multiQuizData!, multiUserAnswers, score, multiQuizData!.length);
      setMultiPerformanceReport(report);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze performance.");
    } finally {
      setIsAnalyzingPerformance(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!newScheduleExamName || !newScheduleExamDate || newScheduleDocIds.length === 0) {
      toast.error("Please fill all fields and select at least one document.");
      return;
    }
    setPlannerLoading(true);
    toast.loading("Smart AI is planning your study schedule...", { id: 'schedule' });
    try {
      await createSchedule(newScheduleExamName, newScheduleExamDate, newScheduleDocIds);
      toast.success("Schedule created successfully!", { id: 'schedule' });
      const schedulesData = await getSchedules();
      setSchedules(schedulesData);
      setPlannerOpen(false);
      setNewScheduleExamName("");
      setNewScheduleExamDate("");
      setNewScheduleDocIds([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to create schedule", { id: 'schedule' });
    } finally {
      setPlannerLoading(false);
    }
  };

  // Ctrl+K command palette listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
        setCmdQuery("");
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <SciFiLoader text="INITIALIZING WORKSPACE..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-hidden">
      {/* Animated Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-amber-500/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        cmdQuery={cmdQuery}
        setCmdQuery={setCmdQuery}
        documents={documents}
        setActiveTab={setActiveTab}
        setSelectedDoc={setSelectedDoc}
        setAiMode={setAiMode}
        handleLogout={handleLogout}
      />

      {/* Sidebar */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarOpen={setSidebarOpen}
        setSidebarCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={navItems}
        onSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <motion.div
        animate={{ paddingLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="relative z-10 hidden lg:block"
        style={{ minHeight: 0 }}
      />
      <div className="relative z-10 lg:pl-[256px]" style={{ transition: 'padding 0.35s cubic-bezier(0.16,1,0.3,1)' }} id="main-content">
        {/* Top Header */}
        <DashboardHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          onMobileMenuOpen={() => setSidebarOpen(true)}
          onCmdOpen={() => { setCmdOpen(true); setCmdQuery(""); }}
        />

        {/* Tab views */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <HeroBanner user={user} documents={documents} />

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <AnalyticsOverview
                  user={user}
                  documents={documents}
                  analyticsData={analyticsData}
                  setActiveTab={setActiveTab}
                  setSelectedDoc={setSelectedDoc}
                  setAiMode={setAiMode}
                  setAiResult={setAiResult}
                  handleFileUpload={handleFileUpload}
                />
              )}

              {activeTab === 'documents' && (
                <MyDocuments
                  documents={documents.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))}
                  setSelectedDoc={setSelectedDoc}
                  setAiMode={setAiMode}
                  setAiResult={setAiResult}
                  handleDeleteDocument={handleDeleteDocument}
                  handleFileUpload={handleFileUpload}
                />
              )}

              {activeTab === 'quizboard' && (
                <MultiDocQuizBoard
                  documents={documents}
                  selectedDocIds={selectedDocIds}
                  setSelectedDocIds={setSelectedDocIds}
                  multiQuizType={multiQuizType}
                  setMultiQuizType={setMultiQuizType}
                  multiNumQuestions={multiNumQuestions}
                  setMultiNumQuestions={setMultiNumQuestions}
                  multiTimeLimit={multiTimeLimit}
                  setMultiTimeLimit={setMultiTimeLimit}
                  multiQuizLoading={multiQuizLoading}
                  handleMultiQuizGenerate={handleMultiQuizGenerate}
                  multiQuizData={multiQuizData}
                  setMultiQuizData={setMultiQuizData}
                  multiQuizDocTitles={multiQuizDocTitles}
                  multiTimeLeft={multiTimeLeft}
                  setMultiTimeLeft={setMultiTimeLeft}
                  multiQuizFinished={multiQuizFinished}
                  setMultiQuizFinished={setMultiQuizFinished}
                  multiCurrentQ={multiCurrentQ}
                  setMultiCurrentQ={setMultiCurrentQ}
                  multiUserAnswers={multiUserAnswers}
                  setMultiUserAnswers={setMultiUserAnswers}
                  multiPerformanceReport={multiPerformanceReport}
                  setMultiPerformanceReport={setMultiPerformanceReport}
                  isAnalyzingPerformance={isAnalyzingPerformance}
                  handleAnalyzePerformance={handleAnalyzePerformance}
                />
              )}
            </AnimatePresence>

            {activeTab === 'planner' && (
              <StudyPlanner
                schedules={schedules.filter(s => s.exam_name.toLowerCase().includes(searchQuery.toLowerCase()))}
                documents={documents}
                setPlannerOpen={setPlannerOpen}
                onDelete={handleDeleteSchedule}
              />
            )}

            {activeTab === 'quizzes' && (
              <QuizHistory
                quizHistory={quizHistory.filter(q => documents.find(d => d.id === q.document)?.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.quiz_type.toLowerCase().includes(searchQuery.toLowerCase()))}
                documents={documents}
                setSelectedDoc={setSelectedDoc}
                setAiMode={setAiMode}
                setQuizType={setQuizType}
                setQuizData={setQuizData}
                setUserAnswers={setUserAnswers}
                setQuizFinished={setQuizFinished}
              />
            )}
          </div>
        </main>
      </div>

      {/* AI Workspace Studio Modal */}
      <AIWorkspaceModal
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
        mobileToolsOpen={mobileToolsOpen}
        setMobileToolsOpen={setMobileToolsOpen}
        aiMode={aiMode}
        setAiMode={setAiMode}
        aiLoading={aiLoading}
        aiResult={aiResult}
        setAiResult={setAiResult}
        quizType={quizType}
        setQuizType={setQuizType}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        quizData={quizData}
        setQuizData={setQuizData}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        userAnswers={userAnswers}
        setUserAnswers={setUserAnswers}
        quizFinished={quizFinished}
        setQuizFinished={setQuizFinished}
        timeLeft={timeLeft}
        isGradingTheory={isGradingTheory}
        flashcardsData={flashcardsData}
        flashcardIndex={flashcardIndex}
        setFlashcardIndex={setFlashcardIndex}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        smartHighlights={smartHighlights}
        readerFontSize={readerFontSize}
        setReaderFontSize={setReaderFontSize}
        readerSearchQuery={readerSearchQuery}
        setReaderSearchQuery={setReaderSearchQuery}
        readerCopied={readerCopied}
        setReaderCopied={setReaderCopied}
        activeHighlightIndex={activeHighlightIndex}
        setActiveHighlightIndex={setActiveHighlightIndex}
        interactionHistory={interactionHistory}
        quizHistory={quizHistory}
        questionInput={questionInput}
        setQuestionInput={setQuestionInput}
        isSimplifying={isSimplifying}
        isSpeaking={isSpeaking}
        runAiAction={runAiAction}
        handleExplainSimpler={handleExplainSimpler}
        handleTTS={handleTTS}
        handleDeleteInteraction={handleDeleteInteraction}
      />

      {/* Create Planner Modal */}
      <CreatePlannerModal
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        documents={documents}
        examName={newScheduleExamName}
        setExamName={setNewScheduleExamName}
        examDate={newScheduleExamDate}
        setExamDate={setNewScheduleExamDate}
        selectedDocIds={newScheduleDocIds}
        setSelectedDocIds={setNewScheduleDocIds}
        loading={plannerLoading}
        onSubmit={handleCreateSchedule}
      />

      {/* Settings Modal */}
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
