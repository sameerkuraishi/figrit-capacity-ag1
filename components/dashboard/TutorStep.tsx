import { ComponentType } from "react";
import { UserRound, Compass, Target, BookOpen, Gauge, MessageSquareText, GraduationCap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Career, ChatMessage, GapItem, RoadmapItem, StudentProfile } from "@/lib/figr-product";

interface TutorStepProps {
  profile: StudentProfile;
  activeCareer: Career;
  weakest: GapItem;
  roadmap: RoadmapItem[];
  completedModules: number[];
  quizScore: number | null;
  sendMessage: (text?: string) => void;
  chat: ChatMessage[];
  prompt: string;
  setPrompt: (val: string) => void;
}

export function TutorStep({
  profile,
  activeCareer,
  weakest,
  roadmap,
  completedModules,
  quizScore,
  sendMessage,
  chat,
  prompt,
  setPrompt
}: TutorStepProps) {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 9 · Context-aware support</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Learning Companion</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          This reliable prototype uses deterministic context-aware guidance. A backend teammate can later replace the same service contract with a live LLM.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <aside className="flex flex-col gap-6">
          <section className="premium-card p-6 border-[var(--border)] bg-gradient-to-br from-[#F8FBFB] to-white">
            <div className="flex items-center gap-3 mb-6 bg-[var(--secondary)] p-3 rounded-lg border border-[var(--border)]">
              <span className="w-2 h-2 rounded-full bg-[var(--winter-success)] animate-pulse" />
              <div className="flex flex-col">
                <strong className="text-xs font-bold text-[var(--winter-dark)]">Guided response mode</strong>
                <small className="text-[10px] text-[var(--muted-foreground)]">Live AI not configured</small>
              </div>
            </div>
            
            <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-4">Tutor Context</p>
            <div className="flex flex-col gap-4">
              {[
                [UserRound, "Student", profile.name || "Student"], 
                [Compass, "Target career", activeCareer.title], 
                [Target, "Weakest skill", `${weakest.skill} · ${weakest.current}/10`], 
                [BookOpen, "Current module", roadmap.find((_, index) => !completedModules.includes(index))?.title || "Review"], 
                [Gauge, "Latest quiz", quizScore === null ? "Not taken" : `${quizScore}%`]
              ].map(([ContextIcon, label, value]) => {
                const I = ContextIcon as ComponentType<{ className?: string }>;
                return (
                  <div className="flex items-start gap-3" key={label as string}>
                    <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center shrink-0">
                      <I className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <small className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">{label as string}</small>
                      <strong className="text-sm text-[var(--winter-dark)] leading-tight">{value as string}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="premium-card p-6">
            <h3 className="text-sm font-bold text-[var(--winter-dark)] mb-4">Quick prompts</h3>
            <div className="flex flex-col gap-2">
              {["Explain this simply", "Give me a 10-minute practice task", "Why is this skill needed for my career?", "What should I learn next?", "What should I ask a counsellor?", "Explain my quiz mistake"].map((item) => (
                <button 
                  key={item} 
                  onClick={() => sendMessage(item)}
                  className="text-left text-xs text-[var(--winter-dark)] p-3 rounded-lg border border-[var(--border)] hover:border-[var(--winter-primary)] hover:bg-[var(--secondary)] transition-colors flex items-center gap-2 group"
                >
                  <MessageSquareText className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--winter-primary)] transition-colors shrink-0" />
                  {item}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="lg:col-span-2 premium-card flex flex-col h-[600px] shadow-lg border-[var(--border)] overflow-hidden">
          <header className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--secondary)]">
            <span className="w-10 h-10 rounded-xl bg-[var(--winter-dark)] text-white flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--winter-dark)] leading-tight">FIGR Learning Companion</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Uses the visible student context</p>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F8FBFB]">
            {chat.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`flex gap-4 max-w-[85%] ${message.from === "student" ? "ml-auto flex-row-reverse" : ""}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.from === "guide" ? "bg-[var(--winter-dark)] text-white" : "bg-[var(--winter-primary)] text-white"}`}>
                  {message.from === "guide" ? <GraduationCap className="w-4 h-4" /> : <UserRound className="w-4 h-4" />}
                </span>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${message.from === "guide" ? "bg-white border border-[var(--border)] text-[var(--winter-dark)] rounded-tl-none shadow-sm" : "bg-[var(--winter-primary)] text-white rounded-tr-none shadow-md"}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <footer className="p-4 border-t border-[var(--border)] bg-white flex gap-3 items-end">
            <Textarea 
              value={prompt} 
              onChange={(event) => setPrompt(event.target.value)} 
              onKeyDown={(event) => { 
                if (event.key === "Enter" && !event.shiftKey) { 
                  event.preventDefault(); 
                  sendMessage(); 
                } 
              }} 
              placeholder="Ask about your career, gap or next task…" 
              aria-label="Tutor message" 
              className="resize-none min-h-[60px] max-h-[120px] bg-[var(--secondary)] border-transparent focus-visible:ring-[var(--winter-primary)]"
            />
            <Button onClick={() => sendMessage()} aria-label="Send message" className="btn-primary h-12 w-12 shrink-0 p-0 rounded-xl">
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </footer>
        </section>
      </div>
    </div>
  );
}
