import React from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { 
  FileText, Zap, ListChecks, Sparkles, ChevronRight, 
  ArrowUpRight, Brain, BookOpen, MessageSquare, Upload 
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarRadiusAxis
} from "recharts";
import { pageVariants, itemVariants, AnimatedCounter, Sparkline } from "./Shared";

interface AnalyticsOverviewProps {
  user: any;
  documents: any[];
  analyticsData: any;
  setActiveTab: (tab: string) => void;
  setSelectedDoc: (doc: any) => void;
  setAiMode: (mode: any) => void;
  setAiResult: (res: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AnalyticsOverview({ 
  user, documents, analyticsData, setActiveTab, setSelectedDoc, 
  setAiMode, setAiResult, handleFileUpload 
}: AnalyticsOverviewProps) {
  
  const quizzesCompleted = user?.stats?.quizzes_completed || 0;
  const summaries = user?.stats?.summaries_generated || 0;
  const streak = user?.stats?.study_streak || 0;
  const docsCount = documents.length;

  const weeklyData = analyticsData?.weeklyData || [];
  const monthlyTrend = analyticsData?.monthlyTrend || [];
  const radarData = analyticsData?.radarData || [];
  const heatmapData = analyticsData?.heatmapData || [];

  const statCards = [
    { icon: FileText, val: docsCount, label: 'Documents', change: '+' + docsCount, up: true, from: 'from-blue-500/10', border: 'border-blue-500/20', glow: 'bg-blue-500/10', text: 'text-blue-400', sub: 'Total uploaded' },
    { icon: Zap, val: streak, label: 'Day Streak', change: streak > 0 ? 'Active' : 'Start today', up: streak > 0, from: 'from-amber-500/10', border: 'border-amber-500/20', glow: 'bg-amber-500/10', text: 'text-amber-400', sub: 'Consecutive days' },
    { icon: ListChecks, val: quizzesCompleted, label: 'Quizzes', change: quizzesCompleted > 0 ? 'Tracked' : 'Take first', up: quizzesCompleted > 0, from: 'from-emerald-500/10', border: 'border-emerald-500/20', glow: 'bg-emerald-500/10', text: 'text-emerald-400', sub: 'Total completed' },
    { icon: Sparkles, val: summaries, label: 'AI Summaries', change: summaries > 0 ? 'Generated' : 'Summarize now', up: summaries > 0, from: 'from-violet-500/10', border: 'border-violet-500/20', glow: 'bg-violet-500/10', text: 'text-violet-400', sub: 'Insights created' },
  ];

  return (
    <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <motion.div variants={itemVariants} key={s.label} whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.from} to-transparent border ${s.border} p-5 transition-all`}>
            <div className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full ${s.glow} blur-2xl`} />
            <Sparkline />
            <div className="flex items-start justify-between mb-3 relative z-10">
              <div className={`h-10 w-10 rounded-xl ${s.glow} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.text}`} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                {s.change}
              </span>
            </div>
            <div className="font-display text-3xl font-bold tracking-tight relative z-10"><AnimatedCounter value={s.val} /></div>
            <div className="text-sm font-semibold mt-0.5 relative z-10">{s.label}</div>
            <div className={`text-xs mt-1 ${s.text} opacity-70 relative z-10`}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Row 2: Area Chart + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Quizzes · AI Usage · Documents</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary inline-block"/>Quizzes</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"/>AI</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block"/>Docs</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(15,15,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }} itemStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="quizzes" stroke="var(--color-primary)" strokeWidth={2} fill="url(#colorQuizzes)" />
              <Area type="monotone" dataKey="ai" stroke="#34d399" strokeWidth={2} fill="url(#colorAi)" />
              <Area type="monotone" dataKey="docs" stroke="#fbbf24" strokeWidth={2} fill="url(#colorDocs)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Radar */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl shadow-black/30 flex flex-col">
          <h3 className="font-display text-lg font-semibold mb-1">Skill Radar</h3>
          <p className="text-xs text-muted-foreground mb-4">Performance across all areas</p>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888888' }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'rgba(15,15,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }} itemStyle={{ color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Row 3: Score Trend + Activity Heatmap ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Line Chart */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Score Trend</h3>
              <p className="text-xs text-muted-foreground">Monthly performance progress</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">↑ Improving</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(15,15,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }} itemStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="score" stroke="url(#lineGlow)" strokeWidth={3} dot={{ fill: 'var(--color-primary)', strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Study Heatmap</h3>
              <p className="text-xs text-muted-foreground">Last 35 days of activity</p>
            </div>
            <span className="text-xs font-semibold text-primary">{streak} day streak 🔥</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mt-2">
            {['M','T','W','T','F','S','S'].map((d, idx) => (
              <div key={idx + d} className="text-center text-[9px] text-muted-foreground/50 font-bold">{d}</div>
            ))}
            {heatmapData.map((d: any, i: number) => (
              <div key={i} title={d.active ? `Day ${i + 1}: Active` : `Day ${i + 1}: No activity`}
                className={`h-7 w-full rounded-md transition-all cursor-default ${
                  d.active
                    ? d.intensity >= 3 ? 'bg-primary opacity-100' :
                      d.intensity === 2 ? 'bg-primary/70' :
                      'bg-primary/40'
                    : 'bg-white/5'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
            <span>Less</span>
            {['bg-white/5','bg-primary/30','bg-primary/60','bg-primary'].map((c, i) => (
              <div key={i} className={`h-4 w-4 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </motion.div>
      </div>

      {/* ── Row 4: Bar Chart + Recent Docs + AI Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions Bar Chart */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <h3 className="font-display text-lg font-semibold mb-1">Study Sessions</h3>
          <p className="text-xs text-muted-foreground mb-4">Sessions per week</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(15,15,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }} itemStyle={{ color: '#fff' }} />
              <Bar dataKey="sessions" fill="var(--color-primary)" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Documents */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Recent Materials</h3>
            {documents.length > 0 && <button onClick={() => setActiveTab('documents')} className="text-xs font-semibold text-primary hover:underline">View all</button>}
          </div>
          {documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.slice(0, 4).map((doc: any, idx: number) => {
                const colors = ['bg-blue-500/15 text-blue-400','bg-emerald-500/15 text-emerald-400','bg-amber-500/15 text-amber-400','bg-violet-500/15 text-violet-400'];
                return (
                  <motion.li key={doc.id} whileHover={{ x: 4 }} onClick={() => { setSelectedDoc(doc); setAiMode(null); setAiResult(''); }}
                    className="group cursor-pointer flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/5 transition-all">
                    <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${colors[idx % colors.length]}`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{doc.title}</div>
                      <div className="text-[11px] text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString('en-NG', { day:'numeric', month:'short' })}</div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">No documents yet</p>
              <button onClick={() => document.getElementById('file-upload')?.click()} className="mt-3 text-xs font-semibold text-primary hover:underline">Upload first doc →</button>
            </div>
          )}
        </motion.div>

        {/* AI Panel */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-white shadow-2xl ring-1 ring-white/10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur-md mb-4">
              <Sparkles className="h-3.5 w-3.5" /> AI ASSISTANT
            </div>
            <h3 className="font-display text-2xl font-bold leading-tight">Your Personal<br/>Study Coach</h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              {documents.length > 0 ? "Ask questions, generate quizzes or summaries from your notes instantly." : "Upload your lecture notes to unlock full AI-powered study tools."}
            </p>
            <div className="mt-auto pt-6 space-y-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl bg-white py-3 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-100"
                onClick={() => { if (documents.length > 0) { setSelectedDoc(documents[0]); setAiMode('ask'); setAiResult(''); } else document.getElementById('file-upload')?.click(); }}>
                <Brain className="inline mr-2 h-4 w-4" />{documents.length > 0 ? 'Chat with AI' : 'Upload a Document'}
              </motion.button>
              {documents.length > 0 && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition-all hover:bg-white/15"
                  onClick={() => { setSelectedDoc(documents[0]); setAiMode('quiz'); setAiResult(''); }}>
                  <ListChecks className="inline mr-2 h-4 w-4" />Generate Quiz
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-muted-foreground uppercase text-xs tracking-widest">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Upload, label: 'Upload PDF', desc: 'Add study material', from: 'from-blue-500/15', border: 'border-blue-500/20', bg: 'bg-blue-500/15', text: 'text-blue-400', action: () => document.getElementById('file-upload')?.click() },
            { icon: MessageSquare, label: 'Chat with AI', desc: 'Ask about a doc', from: 'from-primary/15', border: 'border-primary/20', bg: 'bg-primary/15', text: 'text-primary', action: () => { if(documents.length) { setSelectedDoc(documents[0]); setAiMode('ask'); setAiResult(''); } else toast.info('Upload a document first!'); } },
            { icon: ListChecks, label: 'Take a Quiz', desc: 'Test your knowledge', from: 'from-amber-500/15', border: 'border-amber-500/20', bg: 'bg-amber-500/15', text: 'text-amber-400', action: () => { if(documents.length) { setSelectedDoc(documents[0]); setAiMode('quiz'); setAiResult(''); } else toast.info('Upload a document first!'); } },
            { icon: BookOpen, label: 'Study Guide', desc: 'Generate smart notes', from: 'from-emerald-500/15', border: 'border-emerald-500/20', bg: 'bg-emerald-500/15', text: 'text-emerald-400', action: () => { if(documents.length) { setSelectedDoc(documents[0]); setAiMode('guide'); setAiResult(''); } else toast.info('Upload a document first!'); } },
          ].map(a => (
            <motion.button key={a.label} onClick={a.action} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${a.from} to-transparent border ${a.border} p-5 text-left transition-all`}>
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${a.bg} mb-3 group-hover:scale-110 transition-transform`}>
                <a.icon className={`h-5 w-5 ${a.text}`} />
              </div>
              <div className="font-semibold text-sm">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
              <ChevronRight className="absolute right-4 bottom-4 h-4 w-4 text-muted-foreground/30 group-hover:right-3 group-hover:text-muted-foreground/60 transition-all" />
            </motion.button>
          ))}
        </div>
        <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt,.docx" />
      </section>
    </motion.div>
  );
}
