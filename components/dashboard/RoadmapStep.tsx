import { ComponentType } from "react";
import { Route, LockKeyhole, Check, Trophy, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Career, GapItem, RoadmapItem, StudentProfile, StudentStep } from "@/lib/figr-product";

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

interface RoadmapStepProps {
  selectedCareerId: string | null;
  setStep: (step: StudentStep) => void;
  activeCareer: Career;
  weakest: GapItem;
  profile: StudentProfile;
  completedModules: number[];
  roadmap: RoadmapItem[];
  completeModule: (index: number) => void;
}

export function RoadmapStep({
  selectedCareerId,
  setStep,
  activeCareer,
  weakest,
  profile,
  completedModules,
  roadmap,
  completeModule
}: RoadmapStepProps) {
  if (!selectedCareerId) {
    return (
      <EmptyState 
        icon={Route} 
        title="No roadmap yet" 
        text="Select a career to generate a career-specific evidence-building path." 
        action="Go to Careers" 
        onAction={() => setStep("careers")} 
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 7 · Try the real work</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">{activeCareer.title} Roadmap</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          A 12-week visual journey shaped by the {weakest.skill.toLowerCase()} gap, {profile.weeklyHours} study hours per week and {profile.budget.toLowerCase()}.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 premium-card p-6 md:p-8">
          <div className="flex justify-between items-start border-b border-[var(--border)] pb-6 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-2">Evidence-building route</h2>
              <p className="text-sm font-semibold text-[var(--muted-foreground)] flex items-center gap-2">
                <span>Start</span> <ChevronRight className="w-3 h-3" /> 
                <span>Foundation</span> <ChevronRight className="w-3 h-3" /> 
                <span>Practice</span> <ChevronRight className="w-3 h-3" /> 
                <span>Project</span> <ChevronRight className="w-3 h-3" /> 
                <span>Review</span>
              </p>
            </div>
            <div className="bg-[var(--winter-bg)] text-[var(--winter-success)] px-4 py-2 rounded-xl border border-[var(--winter-success)]/20 text-sm font-bold shadow-sm">
              {completedModules.length}/{roadmap.length} complete
            </div>
          </div>
          
          <div className="relative border-l-2 border-[var(--border)] ml-6 pl-8 flex flex-col gap-8 py-4">
            {roadmap.map((module, index) => {
              const done = completedModules.includes(index);
              const locked = index > 0 && !completedModules.includes(index - 1);
              
              return (
                <article key={module.title} className={`relative flex gap-6 ${done ? "opacity-60" : ""} ${locked ? "opacity-40 grayscale" : "hover:-translate-y-1 transition-transform"}`}>
                  <button 
                    onClick={() => completeModule(index)} 
                    aria-label={`${done ? "Mark incomplete" : "Complete"} ${module.title}`}
                    className={`absolute -left-[45px] w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 transition-colors ${
                      locked 
                        ? "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)]" 
                        : done 
                          ? "bg-[var(--winter-success)] border-[var(--winter-success)] text-white" 
                          : index === roadmap.length - 1 
                            ? "bg-amber-100 border-amber-400 text-amber-600" 
                            : "bg-white border-[var(--winter-primary)] text-[var(--winter-primary)]"
                    }`}
                  >
                    {locked ? <LockKeyhole className="w-4 h-4" /> : done ? <Check className="w-5 h-5" /> : index === roadmap.length - 1 ? <Trophy className="w-4 h-4" /> : <span className="font-bold text-sm">{index + 1}</span>}
                  </button>
                  
                  <div className={`flex-1 p-5 rounded-2xl border ${done ? "border-[var(--border)] bg-[var(--secondary)]" : locked ? "border-[var(--border)] bg-white/50" : "border-[var(--winter-primary)]/30 bg-white shadow-md ring-1 ring-[var(--winter-primary)]/10"}`}>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <small className="text-[10px] font-bold uppercase tracking-wider text-[var(--winter-dark)]">{module.weeks}</small>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]">
                        {module.type}
                      </span>
                      <em className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider not-italic ml-auto ${profile.budget === "Free resources only" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-indigo-50 text-indigo-600 border border-indigo-200"}`}>
                        {profile.budget === "Free resources only" ? "FREE" : "BUDGET FIT"}
                      </em>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-1">{module.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">{module.objective}</p>
                    
                    <footer className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs text-[var(--winter-dark)]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[var(--winter-primary)]" />
                        <span className="font-semibold">{module.resource}</span>
                      </div>
                      <b className="font-bold text-[var(--muted-foreground)]">{module.duration}</b>
                    </footer>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="premium-card p-6 md:p-8 bg-gradient-to-b from-[#F8FBFB] to-white border-[var(--border)]">
            <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-1">Why this plan</p>
            <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-4">Evidence before commitment</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              It lets <strong className="text-[var(--winter-dark)]">{profile.name.split(" ")[0] || "the student"}</strong> experience the real work before choosing a course or stream.
            </p>
            
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
              <strong className="block text-amber-900 mb-1">Budget changes delivery—not potential.</strong>
              <span className="text-amber-800/80">Career scores stay unchanged while resource suggestions adapt.</span>
            </div>
          </section>

          <section className="premium-card p-6 md:p-8 bg-gradient-to-tr from-[var(--winter-dark)] to-slate-800 text-white">
            <h3 className="text-xs uppercase font-bold text-white/70 tracking-widest mb-2">Next checkpoint</h3>
            <p className="text-lg font-semibold text-white mb-8">{activeCareer.checkpoint.prompt}</p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={() => setStep("learning")} className="bg-white text-[var(--winter-dark)] hover:bg-gray-100 h-12 shadow-md">
                Open Learning Hub <BookOpen className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => setStep("quiz")} className="border-white/20 text-white hover:bg-white/10 h-12">
                Go to Checkpoint <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
