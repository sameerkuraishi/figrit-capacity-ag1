import { ComponentType } from "react";
import { Target, ArrowRight, BookOpen, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Career, CoreSkill, GapItem, RoadmapItem, VerifiedResource, StudentStep } from "@/lib/figr-product";

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

function Metric({ label, value, tone = "navy" }: { label: string; value: string | number; tone?: string }) {
  const tones = {
    navy: "text-[var(--winter-dark)] bg-[var(--secondary)] border-[var(--border)]",
    teal: "text-[var(--winter-success)] bg-[var(--winter-bg)] border-[var(--winter-success)]/20",
  };
  return (
    <div className={`p-4 rounded-xl border text-center ${tones[tone as keyof typeof tones] || tones.navy}`}>
      <strong className="block text-3xl font-bold font-heading">{value}</strong>
      <small className="block text-[10px] uppercase font-bold opacity-80 mt-1">{label}</small>
    </div>
  );
}

interface GapsStepProps {
  selectedCareerId: string | null;
  setStep: (step: StudentStep) => void;
  activeCareer: Career;
  coreSkills: CoreSkill[];
  effectiveSkills: Record<string, number>;
  weakest: GapItem;
  gaps: GapItem[];
  roadmap: RoadmapItem[];
  verifiedResources: VerifiedResource[];
  round1: (num: number) => number;
}

export function GapsStep({
  selectedCareerId,
  setStep,
  activeCareer,
  coreSkills,
  effectiveSkills,
  weakest,
  gaps,
  roadmap,
  verifiedResources,
  round1
}: GapsStepProps) {
  if (!selectedCareerId) {
    return (
      <EmptyState 
        icon={Target} 
        title="No skill gaps yet" 
        text="Select a career so its requirements can be compared with your evidence." 
        action="Go to Careers" 
        onAction={() => setStep("careers")} 
      />
    );
  }

  const currentAverage = round1(coreSkills.reduce((sum, skill) => sum + effectiveSkills[skill], 0) / coreSkills.length);
  const requiredAverage = round1(coreSkills.reduce((sum, skill) => sum + activeCareer.requirements[skill], 0) / coreSkills.length);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 6 · Compare, don&apos;t label</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Skill Gap Analysis</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          Bridge from where you are now to what {activeCareer.title} requires. Values are rounded and every gap has a learning action.
        </p>
      </div>

      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-gradient-to-r from-[var(--secondary)] to-[var(--winter-bg)]">
        <Metric label="Current average" value={`${currentAverage}/10`} tone="navy" />
        
        <div className="flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
          <span className="text-xs uppercase font-bold tracking-wider">Where you are now</span>
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-[var(--border)] rounded-full"></div>
            <ArrowRight className="w-5 h-5 text-[var(--winter-primary)]" />
            <div className="h-0.5 w-12 bg-[var(--border)] rounded-full"></div>
          </div>
          <span className="text-xs uppercase font-bold tracking-wider">Career requirements</span>
        </div>

        <Metric label="Required average" value={`${requiredAverage}/10`} tone="teal" />
      </div>

      <section className="premium-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-[#FEF4F1] to-white border-[#F38B75]/30">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#F38B75] text-white flex items-center justify-center shadow-md">
          <Target className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold text-[#E85F40] tracking-widest mb-1">Highest-impact gap</p>
          <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">{weakest.skill}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Current <strong>{weakest.current}/10</strong> · Required <strong>{weakest.required}/10</strong> · Gap <strong className="text-[#E85F40]">{weakest.gap}/10</strong>
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#F38B75]/30 shadow-sm md:w-1/3">
          <small className="block text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-1">Recommended first action</small>
          <strong className="text-sm text-[var(--winter-dark)]">{roadmap[0].objective}</strong>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-2">Topics, subtopics and evidence gaps</h2>
        <div className="flex flex-col gap-4">
          {gaps.map((gap, index) => (
            <details key={gap.skill} open={index === 0} className="group premium-card overflow-hidden">
              <summary className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 list-none [&::-webkit-details-marker]:hidden border-b border-transparent group-open:border-[var(--border)] group-open:bg-[var(--secondary)] transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-[var(--winter-dark)] flex items-center gap-3">
                    {gap.skill}
                    <ArrowRight className="w-4 h-4 text-[var(--winter-primary)] group-open:rotate-90 transition-transform" />
                  </span>
                  <small className="text-xs text-[var(--muted-foreground)]">{activeCareer.focusSkills[index % activeCareer.focusSkills.length]}</small>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-mono text-sm font-semibold text-[var(--muted-foreground)]">
                    {gap.current}/10 → {gap.required}/10
                  </span>
                  <b className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    gap.gap >= 3 
                      ? "bg-[#FEF4F1] text-[var(--coral-accent)] border-[var(--coral-accent)]/20" 
                      : gap.gap > 0 
                        ? "bg-amber-50 text-amber-600 border-amber-200" 
                        : "bg-[var(--winter-bg)] text-[var(--winter-success)] border-[var(--winter-success)]/20"
                  }`}>
                    {gap.gap >= 3 ? "Critical gap" : gap.gap > 0 ? "Build evidence" : "Career ready"}
                  </b>
                </div>
              </summary>
              
              <div className="p-6 bg-white flex flex-col gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[var(--winter-dark)] mb-2">
                      <strong className="text-[var(--winter-primary)]">Why it matters:</strong> {gap.skill} supports {activeCareer.trialTask.toLowerCase()}
                    </p>
                    <p className="text-sm text-[var(--winter-dark)]">
                      <strong className="text-[var(--winter-primary)]">Subtopics:</strong> {activeCareer.focusSkills.join(" · ")}
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <div className="relative h-4 bg-[var(--secondary)] rounded-full w-full overflow-hidden">
                      {/* Current level */}
                      <div className="absolute top-0 left-0 h-full bg-[var(--winter-primary)] opacity-50" style={{ width: `${gap.current * 10}%` }} />
                      
                      {/* Required level marker */}
                      <div className="absolute top-0 h-full w-1 bg-[var(--coral-accent)] shadow-[0_0_8px_rgba(232,95,64,0.8)]" style={{ left: `${gap.required * 10}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-[var(--muted-foreground)]">
                      <span>Current Level</span>
                      <span>Target Level</span>
                    </div>
                  </div>
                </div>

                {gap.gap > 0 && (
                  <div className="pt-4 border-t border-[var(--border)]">
                    <h4 className="text-xs font-bold text-[var(--winter-dark)] uppercase tracking-wider mb-3">Verified learning resources</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {verifiedResources.slice(0, 3).map((resource) => (
                        <a 
                          key={resource.provider} 
                          href={resource.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--winter-primary)] hover:shadow-md transition-all group/link"
                        >
                          <span className="w-8 h-8 rounded-lg bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center shrink-0 group-hover/link:bg-[var(--winter-primary)] group-hover/link:text-white transition-colors">
                            <BookOpen className="w-4 h-4" />
                          </span>
                          <div className="flex flex-col">
                            <strong className="text-sm font-bold text-[var(--winter-dark)] group-hover/link:text-[var(--winter-primary)] transition-colors">{resource.provider}</strong>
                            <small className="text-[10px] uppercase text-[var(--muted-foreground)] mt-0.5">{resource.type} · {resource.cost}</small>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep("roadmap")} className="btn-primary h-14 px-8 text-base shadow-lg shadow-[var(--winter-primary)]/20">
          Build Personalized Roadmap <Route className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
