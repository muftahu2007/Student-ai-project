import React from 'react';
import { Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudyPlannerProps {
  schedules: any[];
  setPlannerOpen: (open: boolean) => void;
}

export function StudyPlanner({ schedules, setPlannerOpen }: StudyPlannerProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold">Study Planner</h2>
        <Button onClick={() => setPlannerOpen(true)} className="rounded-full">
          <Calendar className="mr-2 h-4 w-4" /> Create Study Plan
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-3xl p-12 text-center shadow-sm">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Study Plans Yet</h3>
          <p className="text-muted-foreground mb-6">Create a personalized daily study schedule based on your exams.</p>
          <Button onClick={() => setPlannerOpen(true)} variant="outline" className="rounded-full">
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {schedules.map((schedule) => {
            const today = new Date();
            const examDate = new Date(schedule.exam_date);
            const diffTime = examDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              <div key={schedule.id} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border/50 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                      <Calendar className="h-3 w-3" /> Exam Countdown
                    </div>
                    <h3 className="font-display text-2xl font-bold">{schedule.exam_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(schedule.exam_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-border/50">
                    <div className="text-center">
                      <div className="text-3xl font-display font-bold text-primary">{Math.max(0, daysLeft)}</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Days Left</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> Daily Breakdown
                  </h4>
                  <div className="relative border-l-2 border-border/50 ml-3 space-y-6 pb-4">
                    {Array.isArray(schedule.schedule_data) ? schedule.schedule_data.map((day: any, idx: number) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                        <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="font-semibold text-base mb-2">{day.topic}</div>
                        <ul className="space-y-2">
                          {Array.isArray(day.tasks) ? day.tasks.map((task: string, tidx: number) => (
                            <li key={tidx} className="flex items-start gap-2 text-sm text-foreground/80 bg-secondary/20 p-2.5 rounded-xl border border-border/50">
                              <div className="h-4 w-4 rounded-full border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                              </div>
                              {task}
                            </li>
                          )) : typeof day.tasks === 'string' ? (
                            <li className="flex items-start gap-2 text-sm text-foreground/80 bg-secondary/20 p-2.5 rounded-xl border border-border/50">
                              <div className="h-4 w-4 rounded-full border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                              </div>
                              {day.tasks}
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    )) : (
                      <div className="text-muted-foreground italic pl-6 text-sm">No structured daily breakdown available.</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
