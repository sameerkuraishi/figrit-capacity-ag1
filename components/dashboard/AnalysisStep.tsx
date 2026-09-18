import { ComponentType } from "react";
import { BarChart3, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { GapItem, StudentStep } from "@/lib/figr-product";

interface MetricProps {
  label: string;
  value: string;
  tone?: "indigo" | "teal" | "blue" | "navy" | "violet" | "amber" | "coral" | "rose" | "emerald";
}

function Metric({ label, value, tone = "navy" }: MetricProps) {
  const tones = {
    indigo: "text-indigo-600 bg-indigo-50",
    teal: "text-[var(--winter-success)] bg-[var(--winter-bg)]",
    blue: "text-blue-600 bg-blue-50",
    navy: "text-[var(--winter-dark)] bg-[var(--secondary)]",
    violet: "text-violet-600 bg-violet-50",
    amber: "text-amber-600 bg-amber-50",
    coral: "text-[var(--coral-accent)] bg-[#FEF4F1]",
    rose: "text-rose-600 bg-rose-50",
    emerald: "text-emerald-600 bg-emerald-50",
  };
  return (
    <div className={`p-4 rounded-xl border border-[var(--border)] shadow-sm text-center ${tones[tone]}`}>
      <strong className="block text-3xl font-bold font-heading">{value}</strong>
      <small className="block text-xs uppercase font-bold opacity-80 mt-1">{label}</small>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action, onAction }: { icon: ComponentType<{ className?: string }>; title: string; text: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">{title}</h2>
      <p className="text-[var(--muted-foreground)] max-w-md mb-8">{text}</p>
      <Button onClick={onAction} className="btn-primary">
        {action} <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

interface AnalysisStepProps {
  assessmentDone: boolean;
  setStep: (step: StudentStep) => void;
  coreSkills: string[];
  effectiveSkills: Record<string, number>;
  evidenceConfidence: string;
  interestsCount: number;
  currentAssessmentScore: number;
  strongSkills: string[];
  weakest: GapItem | null;
  selfRatings: Record<string, number>;
  answeredCount: number;
  questionsLength: number;
  gaps: GapItem[];
}

export function AnalysisStep({
  assessmentDone,
  setStep,
  coreSkills,
  effectiveSkills,
  evidenceConfidence,
  interestsCount,
  currentAssessmentScore,
  strongSkills,
  weakest,
  selfRatings,
  answeredCount,
  questionsLength,
  gaps,
}: AnalysisStepProps) {
  if (!assessmentDone) {
    return (
      <EmptyState 
        icon={BarChart3} 
        title="No analysis yet" 
        text="Complete the active assessment to calculate demonstrated skills and readiness." 
        action="Go to Assessment" 
        onAction={() => setStep("assessment")} 
      />
    );
  }

  const overallReadiness = Math.round(coreSkills.reduce((sum, skill) => sum + effectiveSkills[skill], 0) / coreSkills.length);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 3 · Evidence, not guesswork</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Skill Analysis</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          Self-reported confidence and demonstrated performance stay separate before being blended into an effective skill score.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric label="Overall readiness" value={`${overallReadiness}/10`} tone="navy" />
        <Metric label="Evidence confidence" value={evidenceConfidence} tone="teal" />
        <Metric label="Interest signals" value={`${interestsCount}`} tone="amber" />
        <Metric label="Assessment score" value={`${currentAssessmentScore}%`} tone="coral" />
      </div>

      <section className="premium-card p-6 md:p-8 bg-gradient-to-r from-[#FEF4F1] to-white border-[#F38B75]/30 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#F38B75] text-white flex items-center justify-center shadow-md">
          <Lightbulb className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[#E85F40] tracking-widest mb-1">Personal insight</p>
          <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">
            Your {strongSkills.join(" and ").toLowerCase()} evidence is currently strongest.
          </h2>
          <p className="text-[var(--muted-foreground)]">
            {weakest ? (
              <>{weakest.skill} needs the most additional evidence for the leading path. This is a learning priority—not a permanent label.</>
            ) : "You have a solid baseline across all tested skills."}
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 premium-card p-6 md:p-8">
          <div className="border-b border-[var(--border)] pb-4 mb-6">
            <h2 className="text-xl font-bold text-[var(--winter-dark)]">Skill Breakdown</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Effective skill = 45% self-rating + 55% assessment performance</p>
          </div>
          
          <div className="flex flex-col gap-6">
            {coreSkills.map((skill) => (
              <div key={skill} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <strong className="text-sm text-[var(--winter-dark)]">{skill}</strong>
                  <small className="text-xs text-[var(--muted-foreground)]">Self: {selfRatings[skill]}/10 · Effective: {effectiveSkills[skill]}/10</small>
                </div>
                <div className="h-3 w-full bg-[var(--secondary)] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[var(--winter-primary)]" 
                    style={{ width: `${effectiveSkills[skill] * 10}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="premium-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-6">Evidence Confidence</h2>
            <div className="flex items-center gap-4 mb-8">
              <strong className="text-2xl font-bold text-[var(--winter-primary)]">{evidenceConfidence}</strong>
              <div className="flex-1">
                <Progress value={(answeredCount / questionsLength) * 100} className="h-2" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-[var(--winter-dark)] uppercase tracking-wider mb-3">Strong abilities</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {strongSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-[var(--winter-bg)] text-[var(--winter-success)] font-bold text-xs rounded-full border border-[var(--winter-success)]/20">
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="text-sm font-bold text-[var(--winter-dark)] uppercase tracking-wider mb-3">More evidence needed</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {gaps.slice(0, 2).map((gap) => (
                <span key={gap.skill} className="px-3 py-1 bg-[#FEF4F1] text-[var(--coral-accent)] font-bold text-xs rounded-full border border-[var(--coral-accent)]/20">
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>

          <Button onClick={() => setStep("careers")} className="btn-primary w-full">
            View Career Matches <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </aside>
      </div>
    </div>
  );
}
