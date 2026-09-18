import { Check, ChevronRight, Sparkles, AlertCircle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile, Question } from "@/lib/figr-product";

interface AssessmentStepProps {
  profile: StudentProfile;
  questions: Question[];
  questionIndex: number;
  setQuestionIndex: (idx: number | ((prev: number) => number)) => void;
  answeredCount: number;
  answers: Record<string, number>;
  setAnswers: (answers: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  finishAssessment: () => void;
}

export function AssessmentStep({
  profile,
  questions,
  questionIndex,
  setQuestionIndex,
  answeredCount,
  answers,
  setAnswers,
  finishAssessment,
}: AssessmentStepProps) {
  const currentQuestion = questions[questionIndex];

  if (!currentQuestion) {
    return (
      <div className="premium-card p-8 max-w-3xl mx-auto text-center">
        <BrainCircuit className="w-10 h-10 mx-auto text-[var(--winter-primary)] mb-4" />
        <h2 className="text-2xl font-bold text-[var(--winter-dark)]">Choose at least one interest first</h2>
        <p className="text-[var(--muted-foreground)] mt-2">Your assessment is generated from your Interest Constellation.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="text-center mb-1">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 2 · Personalized assessment</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Built from your Interest Constellation</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl mx-auto">
          FIGR.IT assembled 10 age-appropriate evidence questions from the interests you selected. Your answers are combined with your self-rated transferable skills for career matching.
        </p>
      </div>

      <section className="premium-card p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--winter-light)] text-[var(--winter-primary)] flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="block text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Assessment generated from</span>
                <strong className="block text-lg text-[var(--winter-dark)] mt-0.5">{profile.interests.length} Interest Constellation signals</strong>
              </div>
              <span className="text-xs font-bold text-[var(--winter-primary)] bg-[var(--secondary)] border border-[var(--border)] px-3 py-2 rounded-full whitespace-nowrap">
                {questions.length} questions · ~5 minutes
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.map((interest) => (
                <span key={interest} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--winter-primary)]/10 text-[var(--winter-dark)] border border-[var(--winter-primary)]/20">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="premium-card p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--winter-light)] text-[var(--winter-primary)] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Current evidence signal</span>
            <strong className="block text-lg text-[var(--winter-dark)] leading-tight">{currentQuestion.kind ?? "Aptitude"} · {currentQuestion.skill}</strong>
            <small className="block text-xs text-[var(--muted-foreground)] mt-0.5">{profile.level} · personalized from selected interests</small>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold text-[var(--winter-dark)]">
            <span>Question {questionIndex + 1} of {questions.length}</span>
            <span className="text-[var(--winter-primary)]">{answeredCount}/{questions.length} answered</span>
          </div>
          <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--winter-success)] transition-all duration-300 ease-out"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <section className="premium-card overflow-hidden">
        <div className="bg-[var(--secondary)] px-6 md:px-8 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[var(--winter-dark)]">{currentQuestion.skill}</span>
            {(currentQuestion.relatedInterests ?? []).map((interest) => (
              <span key={interest} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-[var(--border)] text-[var(--muted-foreground)]">
                {interest}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {currentQuestion.kind && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[var(--winter-dark)] shadow-sm border border-[var(--border)]">
                {currentQuestion.kind}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[var(--winter-primary)] shadow-sm border border-[var(--border)]">
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[var(--winter-dark)] leading-snug mb-8">
            {currentQuestion.prompt}
          </h2>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={option}
                  onClick={() => setAnswers((current: Record<string, number>) => ({ ...current, [currentQuestion.id]: index }))}
                  className={`flex items-center text-left gap-4 p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[var(--winter-primary)] bg-[var(--winter-bg)] shadow-sm"
                      : "border-[var(--border)] bg-white hover:border-[var(--winter-primary)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isSelected ? "bg-[var(--winter-primary)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <strong className={`flex-1 font-medium ${isSelected ? "text-[var(--winter-dark)]" : "text-[var(--muted-foreground)]"}`}>
                    {option}
                  </strong>
                  {isSelected && <Check className="w-5 h-5 text-[var(--winter-primary)]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
            <AlertCircle className="w-5 h-5 text-[var(--winter-muted)] shrink-0" />
            <div>
              <strong className="block text-[var(--winter-dark)] mb-1">Why are we asking this?</strong>
              <p>{currentQuestion.why ?? `This question gathers evidence about ${currentQuestion.skill.toLowerCase()}. It is combined with your interests and self-rating; it does not decide your career by itself.`}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Button variant="outline" disabled={questionIndex === 0} onClick={() => setQuestionIndex((idx) => idx - 1)} className="btn-secondary w-full md:w-auto h-12">
          Previous
        </Button>

        <div className="flex flex-wrap justify-center gap-2">
          {questions.map((question, index) => {
            const isCurrent = index === questionIndex;
            const isAnswered = answers[question.id] !== undefined;
            return (
              <button
                key={question.id}
                onClick={() => setQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                  isCurrent
                    ? "bg-[var(--winter-primary)] text-white shadow-md ring-2 ring-offset-2 ring-[var(--winter-primary)]"
                    : isAnswered
                      ? "bg-[var(--winter-success)] text-white"
                      : "bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--winter-primary)]"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {questionIndex < questions.length - 1 ? (
          <Button onClick={() => setQuestionIndex((idx) => idx + 1)} className="btn-primary w-full md:w-auto h-12 px-6">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={finishAssessment} className="btn-primary w-full md:w-auto h-12 px-6 shadow-md shadow-[var(--winter-primary)]/30">
            Analyze Assessment <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
