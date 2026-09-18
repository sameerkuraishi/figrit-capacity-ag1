import { useState } from "react";
import { NotebookPen, FileText, RefreshCw, Play, Target, Download, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ComponentType } from "react";
import type { Career, RoadmapItem, VerifiedResource } from "@/lib/figr-product";

interface LearningStepProps {
  activeCareer: Career;
  roadmap: RoadmapItem[];
  flashcards: { front: string; back: string }[];
  verifiedResources: VerifiedResource[];
}

export function LearningStep({
  activeCareer,
  roadmap,
  flashcards,
  verifiedResources
}: LearningStepProps) {
  const [learningTab, setLearningTab] = useState<"notes" | "brief" | "cards" | "lectures" | "practice">("notes");
  const [studentNotes, setStudentNotes] = useState("");
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);
  const [knownCards, setKnownCards] = useState<number[]>([]);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 8 · Multiple ways to learn</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Learning Hub</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          Use notes, a printable study brief, flashcards, verified lecture catalogs and practice for {activeCareer.title}.
        </p>
      </div>

      <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2 border-b border-[var(--border)]" role="tablist">
        {[
          ["notes", NotebookPen, "Notes"],
          ["brief", FileText, "Study Brief"],
          ["cards", RefreshCw, "Smart Cards"],
          ["lectures", Play, "Lectures"],
          ["practice", Target, "Practice"]
        ].map(([id, TabIcon, label]) => {
          const I = TabIcon as ComponentType<{ className?: string }>;
          const isActive = learningTab === id;
          return (
            <button
              role="tab"
              aria-selected={isActive}
              key={id as string}
              onClick={() => setLearningTab(id as typeof learningTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
                isActive 
                  ? "bg-white text-[var(--winter-dark)] border-[var(--winter-primary)]" 
                  : "bg-transparent text-[var(--muted-foreground)] border-transparent hover:text-[var(--winter-dark)] hover:bg-gray-50"
              }`}
            >
              <I className={`w-4 h-4 ${isActive ? "text-[var(--winter-primary)]" : ""}`} />
              {label as string}
            </button>
          );
        })}
      </div>

      <section className="premium-card bg-white min-h-[400px]">
        {learningTab === "notes" && (
          <div className="p-6 md:p-8 flex flex-col h-full gap-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-1">Personal notes</p>
              <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">{roadmap[0]?.title || "Current Topic"}</h2>
              <p className="text-[var(--muted-foreground)] text-sm">Write what you understood, what remains confusing and the question you want to ask next.</p>
            </div>
            <Textarea 
              value={studentNotes} 
              onChange={(e) => setStudentNotes(e.target.value)} 
              placeholder="Write your learning notes…" 
              className="flex-1 min-h-[200px] resize-none border-[var(--border)] focus-visible:ring-[var(--winter-primary)] text-base p-4"
              aria-label="Learning notes" 
            />
            <div className="flex justify-end">
              <span className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
                <Check className="w-4 h-4 text-[var(--winter-success)]" /> Saved on this device
              </span>
            </div>
          </div>
        )}

        {learningTab === "brief" && (
          <article className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-8">
            <header className="border-b border-[var(--border)] pb-6">
              <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Printable learning brief</p>
              <h2 className="text-3xl font-heading font-bold text-[var(--winter-dark)]">{roadmap[0]?.title || "Current Topic"}</h2>
            </header>
            
            <section>
              <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-3 text-[var(--winter-primary)]">Why it matters</h3>
              <p className="text-[var(--winter-dark)] leading-relaxed">{roadmap[0]?.objective || "Foundation concept"}</p>
            </section>
            
            <section className="p-6 bg-[var(--secondary)] rounded-2xl border border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-3">Try this</h3>
              <p className="text-[var(--winter-dark)] font-medium">{activeCareer.trialTask}</p>
            </section>
            
            <section>
              <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-4 text-[var(--winter-primary)]">Reflection prompts</h3>
              <ul className="space-y-4 pl-2">
                {["What part felt natural?", "What evidence would increase confidence?", "What should a counsellor help you compare?"].map((prompt, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-[var(--winter-bg)] text-[var(--winter-primary)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-[var(--winter-dark)]">{prompt}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <div className="pt-8 border-t border-[var(--border)] flex justify-end">
              <Button onClick={() => window.print()} variant="outline" className="btn-secondary h-12 px-6">
                <Download className="w-4 h-4 mr-2" /> Print / Save as PDF
              </Button>
            </div>
          </article>
        )}

        {learningTab === "cards" && (
          <div className="p-6 md:p-12 flex flex-col items-center justify-center min-h-[400px] gap-8 bg-gradient-to-b from-[#F8FBFB] to-white">
            <div 
              className="relative w-full max-w-2xl min-h-[250px] cursor-pointer group perspective-1000"
              onClick={() => setFlashFlipped(!flashFlipped)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setFlashFlipped(!flashFlipped)}
            >
              <div className={`w-full h-full min-h-[250px] transition-all duration-500 transform-style-3d ${flashFlipped ? "rotate-y-180" : ""} relative`}>
                {/* Front */}
                <div className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-lg border-2 border-[var(--winter-primary)] p-8 flex flex-col items-center justify-center text-center backface-hidden ${flashFlipped ? "opacity-0" : "opacity-100 z-10"}`}>
                  <small className="absolute top-6 left-6 text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest">Question</small>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--winter-dark)] leading-tight">{flashcards[flashIndex].front}</h2>
                  <span className="absolute bottom-6 text-xs font-semibold text-[var(--muted-foreground)] flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" /> Click or press Enter to flip
                  </span>
                </div>
                
                {/* Back */}
                <div className={`absolute inset-0 w-full h-full bg-[var(--winter-primary)] text-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 ${flashFlipped ? "opacity-100 z-10" : "opacity-0"}`}>
                  <small className="absolute top-6 left-6 text-[10px] uppercase font-bold text-white/70 tracking-widest">Answer</small>
                  <h2 className="text-xl md:text-2xl font-medium leading-relaxed">{flashcards[flashIndex].back}</h2>
                  <span className="absolute bottom-6 text-xs font-semibold text-white/70 flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" /> Click or press Enter to flip
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl bg-white p-4 rounded-2xl shadow-sm border border-[var(--border)]">
              <Button 
                variant="outline" 
                onClick={() => { setFlashIndex((i) => (i + flashcards.length - 1) % flashcards.length); setFlashFlipped(false); }}
                className="btn-secondary h-10 px-4"
              >
                Previous
              </Button>
              <span className="text-sm font-bold text-[var(--winter-dark)] px-4">
                {flashIndex + 1} / {flashcards.length}
              </span>
              <Button 
                variant="outline" 
                onClick={() => { 
                  setKnownCards(c => c.includes(flashIndex) ? c.filter(item => item !== flashIndex) : [...c, flashIndex]); 
                  toast.success(knownCards.includes(flashIndex) ? "Marked for revision" : "Marked as known"); 
                }} 
                className={`h-10 px-4 transition-colors ${knownCards.includes(flashIndex) ? "bg-[var(--winter-success)] text-white border-[var(--winter-success)] hover:bg-emerald-600 hover:text-white" : "btn-secondary"}`}
              >
                {knownCards.includes(flashIndex) ? <><RefreshCw className="w-3.5 h-3.5 mr-2" /> Revise again</> : <><Check className="w-3.5 h-3.5 mr-2" /> Mark known</>}
              </Button>
              <Button 
                onClick={() => { setFlashIndex((i) => (i + 1) % flashcards.length); setFlashFlipped(false); }} 
                className="btn-primary h-10 px-6 ml-auto"
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {learningTab === "lectures" && (
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6 bg-[#F8FBFB]">
            {verifiedResources.map((resource) => (
              <a 
                key={resource.provider} 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--winter-primary)] hover:shadow-lg transition-all"
              >
                <span className="w-12 h-12 rounded-xl bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--winter-primary)] group-hover:text-white transition-colors">
                  <Play className="w-5 h-5 ml-1" />
                </span>
                <div className="flex-1">
                  <small className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1 block">{resource.type}</small>
                  <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-2 group-hover:text-[var(--winter-primary)] transition-colors">{resource.provider}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">Open the verified provider catalog and choose an age-appropriate module for {activeCareer.focusSkills[0]}.</p>
                  <b className="text-xs font-bold text-[var(--winter-dark)] bg-[var(--secondary)] px-3 py-1 rounded-md">{resource.cost}</b>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--winter-primary)] transition-colors mt-2" />
              </a>
            ))}
          </div>
        )}

        {learningTab === "practice" && (
          <div className="p-6 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px] bg-gradient-to-br from-[#FEF4F1] to-white">
            <span className="w-20 h-20 rounded-3xl bg-[#F38B75] text-white flex items-center justify-center shadow-lg mb-6 transform -rotate-6">
              <Target className="w-10 h-10" />
            </span>
            <p className="text-[10px] uppercase font-bold text-[#E85F40] tracking-widest mb-2">10-minute career trial</p>
            <h2 className="text-3xl font-heading font-bold text-[var(--winter-dark)] mb-4 max-w-2xl">{activeCareer.trialTask}</h2>
            <p className="text-[var(--muted-foreground)] max-w-lg mx-auto mb-10 text-lg">
              Do the smallest useful version. Then record one observation, one difficulty and one question.
            </p>
            <Button 
              onClick={() => toast.success("Practice task started. A 10-minute timer would connect here in production.")} 
              className="btn-coral h-14 px-8 text-base shadow-lg shadow-[#E85F40]/20 hover:-translate-y-1 transition-transform"
            >
              <Play className="w-5 h-5 mr-2" /> Start Practice
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
