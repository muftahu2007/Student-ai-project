import React, { useState, useEffect } from 'react';
import { Calendar, Target, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp, FileText, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  text: string;
  done: boolean;
}

interface DayPlan {
  date: string;
  topic: string;
  tasks: string[] | string;
}

interface Schedule {
  id: number;
  exam_name: string;
  exam_date: string;
  schedule_data: DayPlan[];
  documents: number[];
}

interface StudyPlannerProps {
  schedules: Schedule[];
  documents: any[];
  setPlannerOpen: (open: boolean) => void;
  onDelete: (id: number) => void;
}

// Persist task completions in localStorage keyed by schedule id + day index + task index
function getStorageKey(scheduleId: number, dayIdx: number, taskIdx: number) {
  return `buk_sched_${scheduleId}_${dayIdx}_${taskIdx}`;
}

function useTaskCompletion(scheduleId: number, dayIdx: number, taskCount: number) {
  const [done, setDone] = useState<boolean[]>(() =>
    Array.from({ length: taskCount }, (_, i) => {
      return localStorage.getItem(getStorageKey(scheduleId, dayIdx, i)) === 'true';
    })
  );

  const toggle = (taskIdx: number) => {
    setDone(prev => {
      const next = [...prev];
      next[taskIdx] = !next[taskIdx];
      localStorage.setItem(getStorageKey(scheduleId, dayIdx, taskIdx), String(next[taskIdx]));
      return next;
    });
  };

  return { done, toggle };
}

function getUrgencyStyle(daysLeft: number) {
  if (daysLeft <= 0) return { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30', label: 'Exam Day!' };
  if (daysLeft <= 3) return { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30', label: `${daysLeft}d left` };
  if (daysLeft <= 7) return { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30', label: `${daysLeft}d left` };
  if (daysLeft <= 14) return { color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30', label: `${daysLeft}d left` };
  return { color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30', label: `${daysLeft}d left` };
}

// ── DayCard ────────────────────────────────────────────────────────────────
function DayCard({ day, dayIdx, scheduleId, isToday, isPast }: {
  day: DayPlan;
  dayIdx: number;
  scheduleId: number;
  isToday: boolean;
  isPast: boolean;
}) {
  const tasks: string[] = Array.isArray(day.tasks)
    ? day.tasks
    : typeof day.tasks === 'string'
    ? [day.tasks]
    : [];

  const { done, toggle } = useTaskCompletion(scheduleId, dayIdx, tasks.length);
  const completedCount = done.filter(Boolean).length;
  const allDone = tasks.length > 0 && completedCount === tasks.length;
  const [open, setOpen] = useState(isToday);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isToday
          ? 'border-primary/60 bg-primary/5 shadow-md shadow-primary/10'
          : allDone
          ? 'border-emerald-500/30 bg-emerald-500/5 opacity-80'
          : isPast
          ? 'border-red-500/20 bg-red-500/5'
          : 'border-border/50 bg-card/60'
      }`}
    >
      {/* Day header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
      >
        {/* Status dot / timeline */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors ${
          allDone
            ? 'bg-emerald-500 border-emerald-500'
            : isToday
            ? 'bg-primary/20 border-primary'
            : isPast
            ? 'bg-red-500/20 border-red-500/40'
            : 'bg-secondary border-border'
        }`}>
          {allDone ? (
            <CheckCircle2 className="h-4 w-4 text-white" />
          ) : isToday ? (
            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          ) : isPast ? (
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
          ) : (
            <Circle className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isToday ? 'text-primary' : isPast ? 'text-red-400' : 'text-muted-foreground'
            }`}>
              {new Date(day.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            {isToday && (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>
            )}
            {isPast && !allDone && (
              <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Overdue</span>
            )}
            {allDone && (
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">✓ Done</span>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground truncate mt-0.5">{day.topic}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {tasks.length > 0 && (
            <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
              {completedCount}/{tasks.length}
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Task list */}
      {open && tasks.length > 0 && (
        <div className="px-4 pb-4 space-y-2">
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>

          {tasks.map((task, ti) => (
            <button
              key={ti}
              onClick={() => toggle(ti)}
              className={`w-full flex items-start gap-3 text-left px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm group ${
                done[ti]
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-muted-foreground'
                  : 'bg-secondary/30 border-border/40 text-foreground hover:bg-secondary/50'
              }`}
            >
              <div className={`flex-shrink-0 mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                done[ti] ? 'bg-emerald-500 border-emerald-500' : 'border-border group-hover:border-primary'
              }`}>
                {done[ti] && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <span className={`flex-1 leading-snug ${done[ti] ? 'line-through' : ''}`}>{task}</span>
              <span className={`text-[10px] flex-shrink-0 font-semibold mt-0.5 ${done[ti] ? 'text-emerald-500' : 'text-muted-foreground/50'}`}>
                ~{Math.max(20, Math.round(task.length / 5))} min
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ScheduleCard ───────────────────────────────────────────────────────────
function ScheduleCard({ schedule, documents, onDelete }: {
  schedule: Schedule;
  documents: any[];
  onDelete: (id: number) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(schedule.exam_date + 'T00:00:00');
  const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const urgency = getUrgencyStyle(daysLeft);

  const days: DayPlan[] = Array.isArray(schedule.schedule_data) ? schedule.schedule_data : [];

  // Compute overall progress from localStorage
  const totalTasks = days.reduce((acc, d) => {
    const tasks = Array.isArray(d.tasks) ? d.tasks : typeof d.tasks === 'string' ? [d.tasks] : [];
    return acc + tasks.length;
  }, 0);

  const completedTasks = days.reduce((acc, d, di) => {
    const tasks = Array.isArray(d.tasks) ? d.tasks : typeof d.tasks === 'string' ? [d.tasks] : [];
    const done = tasks.filter((_, ti) =>
      localStorage.getItem(getStorageKey(schedule.id, di, ti)) === 'true'
    ).length;
    return acc + done;
  }, 0);

  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Find linked document names
  const linkedDocs = Array.isArray(schedule.documents)
    ? documents.filter(d => (schedule.documents as number[]).includes(d.id))
    : [];

  return (
    <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
      {/* Card Header */}
      <div className="p-6 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${urgency.bg} ${urgency.color}`}>
                <Clock className="h-3 w-3" /> {urgency.label}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold truncate">{schedule.exam_name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {examDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Linked docs */}
            {linkedDocs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {linkedDocs.map((doc: any) => (
                  <span key={doc.id} className="inline-flex items-center gap-1 text-[11px] font-medium bg-secondary px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {doc.title.length > 20 ? doc.title.slice(0, 20) + '…' : doc.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Countdown + Delete */}
          <div className="flex items-start gap-3 flex-shrink-0">
            <div className={`text-center px-4 py-3 rounded-2xl border ${urgency.bg}`}>
              <div className={`text-3xl font-display font-bold ${urgency.color}`}>{Math.max(0, daysLeft)}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Days Left</div>
            </div>
            <button
              onClick={() => onDelete(schedule.id)}
              className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              title="Delete this plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Progress</span>
            <span className={`text-xs font-bold ${progressPct === 100 ? 'text-emerald-500' : 'text-foreground'}`}>
              {completedTasks}/{totalTasks} tasks · {progressPct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="p-6 space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground uppercase tracking-wider mb-4">
          <Target className="h-4 w-4" /> Daily Breakdown · {days.length} days
        </h4>

        {days.length === 0 ? (
          <div className="text-sm text-muted-foreground italic text-center py-6">No daily breakdown available.</div>
        ) : (
          days.map((day, idx) => {
            const dayDate = new Date(day.date + 'T00:00:00');
            dayDate.setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();
            const isPast = dayDate < today;
            return (
              <DayCard
                key={idx}
                day={day}
                dayIdx={idx}
                scheduleId={schedule.id}
                isToday={isToday}
                isPast={isPast}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// ── StudyPlanner (main) ───────────────────────────────────────────────────
export function StudyPlanner({ schedules, documents, setPlannerOpen, onDelete }: StudyPlannerProps) {
  // Force re-render when localStorage changes (e.g. tasks checked)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Study Planner</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {schedules.length === 0
              ? 'Plan your exams with AI-generated daily schedules'
              : `${schedules.length} active plan${schedules.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Button onClick={() => setPlannerOpen(true)} className="rounded-full">
          <Calendar className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-16 text-center shadow-sm">
          <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Study Plans Yet</h3>
          <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
            Select your documents and exam date — AI will create a personalised daily study schedule that distributes topics across the days you have left.
          </p>
          <Button onClick={() => setPlannerOpen(true)} variant="outline" className="rounded-full mt-4">
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {schedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              documents={documents}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
