import { ComponentType } from "react";
import { CalendarDays, Download, MessageSquareText, Sparkles, UsersRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Career, CareerResult, Counsellor, GapItem, RoadmapItem, StudentProfile, StudentStep } from "@/lib/figr-product";

function EmptyState({ icon: Icon, title, text, action, onAction }: { icon: ComponentType<{ className?: string }>; title: string; text: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">{title}</h2>
      <p className="text-[var(--muted-foreground)] max-w-md mb-8">{text}</p>
      <Button onClick={onAction} className="btn-primary">
        {action}
      </Button>
    </div>
  );
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const dash = `${value} 100`;
  const tone = value >= 70 ? "text-[var(--winter-success)]" : value >= 50 ? "text-amber-500" : "text-[#E85F40]";

  return (
    <div className="flex flex-col items-center justify-center w-24 h-24 relative">
      <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3" className="text-[var(--border)]" />
        <path
          className={tone}
          strokeDasharray={dash}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center inset-0">
        <strong className={`text-xl font-bold leading-none ${tone}`}>{value}%</strong>
        <small className="text-[9px] uppercase font-bold tracking-wider text-[var(--muted-foreground)] mt-0.5">{label}</small>
      </div>
    </div>
  );
}

interface HandoffStepProps {
  selectedCareerId: string | null;
  setStep: (step: StudentStep) => void;
  activeCareer: Career;
  profile: StudentProfile;
  activeResult: CareerResult;
  evidenceConfidence: string;
  completedModules: number[];
  roadmap: RoadmapItem[];
  gaps: GapItem[];
  counsellorFeedback: string;
  selectedCounsellor: Counsellor;
  quizScore: number | null;
  weakest: GapItem;
  setScreen: (val: "landing" | "student" | "counsellor") => void;
}

export function HandoffStep({
  selectedCareerId,
  setStep,
  activeCareer,
  profile,
  activeResult,
  evidenceConfidence,
  completedModules,
  roadmap,
  gaps,
  counsellorFeedback,
  selectedCounsellor,
  quizScore,
  weakest,
  setScreen
}: HandoffStepProps) {
  if (!selectedCareerId) {
    return (
      <EmptyState 
        icon={CalendarDays} 
        title="Handoff not ready" 
        text="Complete career selection to create a counsellor evidence brief." 
        action="Go to Careers" 
        onAction={() => setStep("careers")} 
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 12 · Human review</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Counsellor Handoff</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          A concise final brief helps the counsellor understand the student within seconds and continue the evidence loop.
        </p>
      </div>

      <section className="premium-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[var(--winter-dark)] to-slate-800 text-white shadow-xl">
        <div className="flex-1 flex gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-white shrink-0 border border-white/20">
            {(profile.name || "S").charAt(0)}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/70 tracking-widest mb-1">Student case</p>
            <h2 className="text-2xl font-bold text-white mb-1">{profile.name || "Student"}</h2>
            <p className="text-sm text-white/80">{profile.level} · {activeCareer.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 bg-white/5 rounded-2xl p-4 border border-white/10">
          <ScoreRing value={activeResult.match} label="fit" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <small className="text-[10px] uppercase font-bold text-white/70 tracking-widest">Evidence confidence</small>
              <strong className="text-base text-white">{evidenceConfidence}</strong>
            </div>
            <div className="flex flex-col">
              <small className="text-[10px] uppercase font-bold text-white/70 tracking-widest">Roadmap progress</small>
              <strong className="text-base text-white">{completedModules.length}/{roadmap.length} milestones</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="premium-card p-6 md:p-8 flex flex-col h-full border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-6 flex items-center gap-2">
            Readiness summary
          </h2>
          <div className="flex flex-col gap-3 mb-8 flex-1">
            {gaps.slice(0, 4).map((gap) => (
              <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-gray-50 hover:border-[var(--winter-primary)] transition-colors" key={gap.skill}>
                <div className="flex flex-col gap-1">
                  <strong className="text-sm font-bold text-[var(--winter-dark)]">{gap.skill}</strong>
                  <span className="font-mono text-xs text-[var(--muted-foreground)]">
                    {gap.current}/10 → {gap.required}/10
                  </span>
                </div>
                <b className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  gap.gap >= 3 
                    ? "bg-[#FEF4F1] text-[#E85F40] border border-[#F38B75]/30" 
                    : gap.gap > 0 
                      ? "bg-amber-50 text-amber-700 border border-amber-200" 
                      : "bg-[var(--winter-bg)] text-[var(--winter-success)] border border-[var(--winter-success)]/30"
                }`}>
                  {gap.gap >= 3 ? "Critical" : gap.gap > 0 ? "Improvement" : "Ready"}
                </b>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => window.print()} className="btn-secondary h-12 w-full mt-auto">
            <Download className="w-4 h-4 mr-2" /> Print Evidence Brief
          </Button>
        </section>

        <section className="premium-card p-6 md:p-8 flex flex-col h-full bg-[#F8FBFB] border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-6 flex items-center gap-2">
            Human mentor note
          </h2>
          
          <div className="flex-1">
            {counsellorFeedback ? (
              <blockquote className="p-6 rounded-2xl bg-white border border-[var(--winter-primary)]/30 shadow-sm relative italic text-[var(--winter-dark)] leading-relaxed">
                <span className="absolute -top-3 -left-2 text-4xl text-[var(--winter-primary)]/30 font-serif">&quot;</span>
                {counsellorFeedback}
                <footer className="mt-4 text-xs not-italic font-semibold text-[var(--muted-foreground)] flex items-center gap-2 border-t border-[var(--border)] pt-4">
                  <span className="w-6 h-6 rounded-full bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center shrink-0">
                    {(selectedCounsellor.name || "C").charAt(0)}
                  </span>
                  — {selectedCounsellor.name}, demonstration profile
                </footer>
              </blockquote>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-[var(--border)] rounded-2xl bg-white">
                <MessageSquareText className="w-8 h-8 text-[var(--muted-foreground)] mb-4" />
                <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-[250px]">
                  No mentor note yet. Open the counsellor portal to add one and show the full feedback loop.
                </p>
                <Button onClick={() => setScreen("counsellor")} className="btn-coral">
                  Open Counsellor Portal
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 p-5 rounded-xl bg-white border border-[var(--border)] shadow-sm">
            <small className="block text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Recommended next action</small>
            <strong className="text-sm text-[var(--winter-dark)]">
              {quizScore !== null && quizScore < 60 ? `${weakest.skill} recovery lesson and reassessment` : activeCareer.trialTask}
            </strong>
          </div>
        </section>
      </div>

      <section className="premium-card p-6 md:p-10 bg-gradient-to-br from-[var(--winter-dark)] to-[#082226] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--winter-primary)]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-lg relative z-10">
          <Sparkles className="w-10 h-10 text-[var(--winter-primary)]" />
        </div>
        
        <div className="relative z-10 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight flex flex-wrap items-center gap-2">
            Discover <ArrowRight className="w-4 h-4 text-white/50" /> 
            Assess <ArrowRight className="w-4 h-4 text-white/50" /> 
            Compare <ArrowRight className="w-4 h-4 text-white/50" /> 
            Discuss <ArrowRight className="w-4 h-4 text-white/50" /> 
            Learn <ArrowRight className="w-4 h-4 text-white/50" /> 
            Adapt
          </h2>
          <p className="text-white/80 leading-relaxed text-sm md:text-base max-w-3xl">
            FIGR does not pretend one score predicts a student&apos;s future. It gathers evidence, makes uncertainty visible and brings a human counsellor into the decision.
          </p>
        </div>
      </section>
    </div>
  );
}
