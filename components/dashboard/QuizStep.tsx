import { ComponentType } from "react";
import { Gauge, WandSparkles, Check, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Career, Question, StudentStep } from "@/lib/figr-product";

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

interface QuizStepProps {
  selectedCareerId: string | null;
  setStep: (step: StudentStep) => void;
  activeCareer: Career;
  quizAnswers: Record<string, number>;
  quizQuestions: Question[];
  loadWeakQuiz: () => void;
  quizIndex: number;
  setQuizAnswers: (val: Record<string, number> | ((current: Record<string, number>) => Record<string, number>)) => void;
  setQuizIndex: (val: number | ((current: number) => number)) => void;
  submitQuiz: () => void;
}

export function QuizStep({
  selectedCareerId,
  setStep,
  activeCareer,
  quizAnswers,
  quizQuestions,
  loadWeakQuiz,
  quizIndex,
  setQuizAnswers,
  setQuizIndex,
  submitQuiz
}: QuizStepProps) {
  if (!selectedCareerId) {
    return (
      <EmptyState 
        icon={Gauge} 
        title="No checkpoint available" 
        text="Select a career to open its career-specific checkpoint." 
        action="Go to Careers" 
        onAction={() => setStep("careers")} 
      />
    );
  }

  const answeredCount = Object.keys(quizAnswers).length;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 10 · Mastery evidence</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">{activeCareer.title} Checkpoint</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          Score 60% or above to unlock the next milestone. A lower result creates a visible recovery branch.
        </p>
      </div>

      <div className="premium-card p-4 flex justify-between items-center bg-gradient-to-r from-white to-[var(--secondary)]">
        <div className="flex items-center gap-3 font-bold text-[var(--winter-dark)]">
          <div className="w-10 h-10 rounded-full border-4 border-[var(--secondary)] flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[var(--winter-primary)]"
                strokeDasharray={`${(answeredCount / quizQuestions.length) * 100} 100`}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[10px]">{Math.round((answeredCount / quizQuestions.length) * 100)}%</span>
          </div>
          <span>{answeredCount}/{quizQuestions.length} answered</span>
        </div>
        <Button variant="outline" onClick={loadWeakQuiz} className="btn-secondary text-xs h-10 shadow-sm border-dashed hover:border-solid hover:border-[var(--winter-primary)]">
          <WandSparkles className="w-3.5 h-3.5 mr-2 text-[var(--winter-primary)]" /> Load Weak Result
        </Button>
      </div>

      <section className="premium-card p-8 md:p-12 min-h-[400px] flex flex-col justify-center shadow-lg border-[var(--winter-primary)]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--secondary)]">
          <div 
            className="h-full bg-[var(--winter-primary)] transition-all duration-300" 
            style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} 
          />
        </div>

        <div className="flex justify-between items-start mb-8">
          <span className="px-3 py-1 bg-[var(--winter-bg)] text-[var(--winter-primary)] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[var(--border)]">
            {quizQuestions[quizIndex].skill}
          </span>
          <small className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
            quizQuestions[quizIndex].difficulty === "Foundation" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            quizQuestions[quizIndex].difficulty === "Applied" ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-red-50 text-red-700 border-red-200"
          }`}>
            {quizQuestions[quizIndex].difficulty}
          </small>
        </div>
        
        <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-8 leading-relaxed">
          {quizQuestions[quizIndex].prompt}
        </h2>
        
        <div className="flex flex-col gap-3">
          {quizQuestions[quizIndex].options.map((option: string, index: number) => {
            const isSelected = quizAnswers[quizQuestions[quizIndex].id] === index;
            return (
              <button 
                key={option} 
                onClick={() => setQuizAnswers((current: Record<string, number>) => ({ ...current, [quizQuestions[quizIndex].id]: index }))} 
                className={`p-4 md:p-5 rounded-xl border text-left transition-all flex items-center gap-4 group ${
                  isSelected 
                    ? "border-[var(--winter-primary)] bg-[var(--winter-bg)] shadow-md ring-1 ring-[var(--winter-primary)]/50" 
                    : "border-[var(--border)] hover:border-[var(--winter-primary)]/50 hover:bg-gray-50"
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors shrink-0 ${
                  isSelected 
                    ? "bg-[var(--winter-primary)] text-white" 
                    : "bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:bg-[var(--winter-primary)] group-hover:text-white"
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <strong className={`font-semibold text-base flex-1 ${isSelected ? "text-[var(--winter-primary)]" : "text-[var(--winter-dark)]"}`}>
                  {option}
                </strong>
                {isSelected && <Check className="w-5 h-5 text-[var(--winter-primary)] shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          disabled={quizIndex === 0} 
          onClick={() => setQuizIndex((index: number) => index - 1)} 
          className="btn-secondary h-12 px-6 disabled:opacity-50"
        >
          Previous
        </Button>
        
        <div className="hidden md:flex gap-2">
          {quizQuestions.map((question: Question, index: number) => {
            const isDone = quizAnswers[question.id] !== undefined;
            const isCurrent = index === quizIndex;
            return (
              <button 
                key={question.id} 
                onClick={() => setQuizIndex(index)} 
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                  isCurrent 
                    ? "bg-[var(--winter-dark)] text-white shadow-md scale-110 z-10 ring-2 ring-white" 
                    : isDone 
                      ? "bg-[var(--winter-success)] text-white" 
                      : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        {quizIndex < quizQuestions.length - 1 ? (
          <Button onClick={() => setQuizIndex((index: number) => index + 1)} className="btn-primary h-12 px-6 shadow-md">
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={submitQuiz} 
            disabled={answeredCount < quizQuestions.length}
            className="btn-primary h-12 px-8 text-base shadow-lg shadow-[var(--winter-primary)]/20 disabled:opacity-50"
          >
            Submit Checkpoint <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
