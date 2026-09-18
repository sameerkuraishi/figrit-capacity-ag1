import { ComponentType } from "react";
import { RefreshCw, CircleAlert, Trophy, ArrowRight, Check, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GapItem, RoadmapItem, StudentStep } from "@/lib/figr-product";

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

interface AdaptationStepProps {
  quizScore: number | null;
  setStep: (step: StudentStep) => void;
  weakest: GapItem;
  roadmap: RoadmapItem[];
}

export function AdaptationStep({
  quizScore,
  setStep,
  weakest,
  roadmap
}: AdaptationStepProps) {
  if (quizScore === null) {
    return (
      <EmptyState 
        icon={RefreshCw} 
        title="No adaptation yet" 
        text="Take the checkpoint to give the roadmap new evidence." 
        action="Go to Quiz" 
        onAction={() => setStep("quiz")} 
      />
    );
  }

  const passed = quizScore >= 60;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 11 · Explainable adaptation</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Your evidence changed the plan.</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          The {quizScore}% checkpoint result visibly changes the route instead of only changing a notification.
        </p>
      </div>

      <div className={`premium-card p-6 md:p-8 flex items-center gap-6 border-2 ${passed ? "border-[var(--winter-success)]/30 bg-emerald-50" : "border-[#F38B75]/30 bg-[#FEF4F1]"}`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${passed ? "bg-[var(--winter-success)] text-white" : "bg-[#E85F40] text-white"}`}>
          {passed ? <Trophy className="w-8 h-8" /> : <CircleAlert className="w-8 h-8" />}
        </div>
        <div>
          <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${passed ? "text-emerald-700" : "text-[#E85F40]"}`}>Checkpoint evidence</p>
          <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">
            {quizScore}% · {passed ? "Mastery demonstrated" : "Recovery needed"}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {passed ? "The next learning milestone is now unlocked." : `The result exposed uncertainty in ${weakest.skill}, so a focused recovery loop was added.`}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="premium-card p-6 md:p-8 bg-gray-50 border-[var(--border)]">
          <p className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest mb-4">Original plan</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold text-[var(--muted-foreground)] shadow-sm">{roadmap[0]?.title || "Topic 1"}</span>
            <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold text-[var(--muted-foreground)] shadow-sm">{roadmap[1]?.title || "Topic 2"}</span>
            <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold text-[var(--muted-foreground)] shadow-sm">{roadmap[2]?.title || "Topic 3"}</span>
          </div>
        </section>

        <section className={`premium-card p-6 md:p-8 ${passed ? "bg-emerald-50/50 border-emerald-100" : "bg-[#FEF4F1]/50 border-[#F38B75]/30"}`}>
          <p className={`text-[10px] uppercase font-bold tracking-widest mb-4 ${passed ? "text-emerald-600" : "text-[#E85F40]"}`}>Adapted plan</p>
          
          {!passed ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold text-[var(--winter-dark)] shadow-sm">{roadmap[0]?.title || "Topic 1"}</span>
              <ArrowRight className="w-4 h-4 text-[var(--winter-primary)]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#E85F40] text-white text-xs font-bold shadow-md shadow-[#E85F40]/30 animate-pulse">{weakest.skill} revision · 20 min</span>
              <ArrowRight className="w-4 h-4 text-[#E85F40]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#E85F40] text-white text-xs font-bold shadow-md shadow-[#E85F40]/30 animate-pulse">Targeted practice</span>
              <ArrowRight className="w-4 h-4 text-[#E85F40]" />
              <span className="px-3 py-1.5 rounded-lg bg-[#E85F40] text-white text-xs font-bold shadow-md shadow-[#E85F40]/30 animate-pulse">Reassessment</span>
              <ArrowRight className="w-4 h-4 text-[var(--winter-primary)]" />
              <span className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold text-[var(--winter-dark)] shadow-sm">{roadmap[1]?.title || "Topic 2"}</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-[var(--winter-success)] text-white text-sm font-bold shadow-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> {roadmap[0]?.title || "Topic 1"}
              </span>
              <ArrowRight className="w-4 h-4 text-[var(--winter-success)]" />
              <span className="px-4 py-2 rounded-xl bg-white border-2 border-[var(--winter-primary)] text-sm font-bold text-[var(--winter-primary)] shadow-md">
                {roadmap[1]?.title || "Topic 2"} · unlocked
              </span>
            </div>
          )}
        </section>
      </div>

      <section className="premium-card p-6 md:p-8 bg-gradient-to-r from-[var(--secondary)] to-white border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-3">Why did FIGR IT change my roadmap?</h2>
          <p className="text-[var(--muted-foreground)]">
            {!passed ? `Your checkpoint performance revealed difficulty with the current ${weakest.skill.toLowerCase()} evidence. The engine inserted one revision, guided practice and a reassessment before advanced work.` : "You demonstrated sufficient mastery, so the next learning milestone was unlocked and the progress marker moved forward."}
          </p>
        </div>
        <Button onClick={() => setStep("handoff")} className="btn-primary h-14 px-8 shrink-0 shadow-lg shadow-[var(--winter-primary)]/20">
          View Counsellor Handoff <UsersRound className="w-5 h-5 ml-2" />
        </Button>
      </section>
    </div>
  );
}
