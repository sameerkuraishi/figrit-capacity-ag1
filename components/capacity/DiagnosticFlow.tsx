"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, ClipboardCheck, Gauge, Target } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/capacity-api";
import { domainCatalog, marketingRoleAlignment } from "@/lib/capacity-demo";
import type { DiagnosticQuestion, DiagnosticResult, RoleAlignment } from "@/lib/capacity-types";
import { Bar, InlineNotice, Pill, SectionTitle } from "./ui";

const localQuestions: DiagnosticQuestion[] = [
  { id: 101, prompt: "Which statement best describes market segmentation?", options: ["Giving every customer the same message", "Grouping customers with similar needs or traits", "Only reducing price", "Choosing one social network"], competency: "Marketing Fundamentals", skill: "Segmentation", difficulty: "Beginner", questionType: "MCQ" },
  { id: 102, prompt: "A premium product is promoted only with discount messaging. What is the main strategic mismatch?", options: ["Too many impressions", "Positioning and message are inconsistent", "Not enough hashtags", "The page needs more sections"], competency: "Marketing Fundamentals", skill: "Positioning", difficulty: "Intermediate", questionType: "Scenario" },
  { id: 103, prompt: "Which metric directly expresses cost per completed conversion?", options: ["CTR", "CPM", "CPA", "Reach"], competency: "Marketing Analytics", skill: "Efficiency metric", difficulty: "Beginner", questionType: "MCQ" },
  { id: 104, prompt: "Traffic rises 40% but conversions stay flat. What should you compare first?", options: ["Only total impressions", "Conversion rate and traffic quality by source", "Company headcount", "Number of social posts"], competency: "Marketing Analytics", skill: "Funnel diagnosis", difficulty: "Intermediate", questionType: "Scenario" },
  { id: 105, prompt: "If the business goal is completed purchases, which campaign signal is most aligned?", options: ["Page likes", "Purchases / conversion events", "Video views only", "Post comments"], competency: "Paid Advertising", skill: "Campaign objective", difficulty: "Beginner", questionType: "MCQ" },
  { id: 106, prompt: "Campaign A has lower CPA and stable quality than Campaign B. What is the most defensible next step?", options: ["Move all budget instantly", "Gradually shift budget while monitoring marginal performance", "Pause tracking", "Optimize only for impressions"], competency: "Paid Advertising", skill: "Budget allocation", difficulty: "Intermediate", questionType: "Scenario" },
  { id: 107, prompt: "What is a valid A/B testing principle?", options: ["Change many variables at once", "Define a clear hypothesis before the test", "Stop after the first conversion", "Use different uncontrolled audiences"], competency: "A/B Testing", skill: "Hypothesis", difficulty: "Beginner", questionType: "MCQ" },
  { id: 108, prompt: "Variant B leads after one day with very little traffic. What should you do?", options: ["Declare B winner immediately", "Continue until the planned evidence threshold", "Delete A", "Change the primary metric"], competency: "A/B Testing", skill: "Sample discipline", difficulty: "Intermediate", questionType: "Scenario" },
  { id: 109, prompt: "Which issue is most likely to increase checkout friction?", options: ["Clear delivery date", "Unnecessary form fields", "Trusted payment options", "Visible return policy"], competency: "Conversion Optimization", skill: "Friction", difficulty: "Beginner", questionType: "MCQ" },
  { id: 110, prompt: "An ad has strong CTR but the landing-page conversion rate is weak. What should be investigated first?", options: ["Ad impressions only", "Message match, speed and landing-page friction", "Follower count", "Office location"], competency: "Conversion Optimization", skill: "Landing page", difficulty: "Intermediate", questionType: "Scenario" },
];
const localCorrect: Record<number, number> = { 101: 1, 102: 1, 103: 2, 104: 1, 105: 1, 106: 1, 107: 1, 108: 1, 109: 1, 110: 1 };

function buildLocalResult(answers: Record<number, number>): DiagnosticResult {
  const bucket = new Map<string, { correct: number; total: number }>();
  localQuestions.forEach((q) => {
    const row = bucket.get(q.competency) || { correct: 0, total: 0 };
    row.total += 1;
    if (answers[q.id] === localCorrect[q.id]) row.correct += 1;
    bucket.set(q.competency, row);
  });
  const scores = [...bucket.entries()].map(([name, v]) => ({ name, score: Math.round(20 + (v.correct / Math.max(1, v.total)) * 80), confidence: Math.min(92, 60 + v.total * 12) }));
  const overall = Math.round(scores.reduce((sum, row) => sum + row.score, 0) / Math.max(1, scores.length));
  return {
    attemptId: -1,
    domain: "Marketing",
    overallScore: overall,
    confidence: 84,
    strongestAreas: [...scores].sort((a, b) => b.score - a.score).slice(0, 3),
    competencyScores: scores,
    roleAlignment: marketingRoleAlignment,
  };
}

export default function DiagnosticFlow({ token, onCompleted }: { token?: string; onCompleted?: (role: RoleAlignment) => void }) {
  const [stage, setStage] = useState<"intro" | "question" | "result">("intro");
  const [domain, setDomain] = useState("Marketing");
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [question, setQuestion] = useState<DiagnosticQuestion | null>(null);
  const [localIndex, setLocalIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleAlignment | null>(null);

  const domainInfo = useMemo(() => domainCatalog.find((item) => item.name === domain), [domain]);

  async function start() {
    if (token) {
      setSubmitting(true);
      const response = await apiRequest<{ attemptId: number; question: DiagnosticQuestion }>("/diagnostic/start/", { method: "POST", body: JSON.stringify({ domain }) }, token);
      setSubmitting(false);
      if (response.ok && response.data) {
        setAttemptId(response.data.attemptId);
        setQuestion(response.data.question);
        setStage("question");
        return;
      }
      toast.error(response.error || "Could not start the diagnostic");
      return;
    }
    if (domain !== "Marketing") {
      toast.info("The offline demo question bank is loaded for Marketing. Start the backend to use all seeded domains.");
      setDomain("Marketing");
    }
    setQuestion(localQuestions[0]);
    setStage("question");
  }

  async function submitAnswer() {
    if (!question || selected === null) return;
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
    if (token && attemptId && attemptId > 0) {
      setSubmitting(true);
      const response = await apiRequest<{ completed: boolean; question?: DiagnosticQuestion; result?: DiagnosticResult }>(`/diagnostic/${attemptId}/answer/`, { method: "POST", body: JSON.stringify({ question_id: question.id, answer: selected }) }, token);
      setSubmitting(false);
      if (!response.ok || !response.data) {
        toast.error(response.error || "Could not submit answer");
        return;
      }
      if (response.data.completed && response.data.result) {
        setResult(response.data.result);
        setStage("result");
      } else if (response.data.question) {
        setQuestion(response.data.question);
        setSelected(null);
      }
      return;
    }

    const nextAnswers = { ...answers, [question.id]: selected };
    if (localIndex >= localQuestions.length - 1) {
      setResult(buildLocalResult(nextAnswers));
      setStage("result");
      return;
    }
    const next = localIndex + 1;
    setLocalIndex(next);
    setQuestion(localQuestions[next]);
    setSelected(null);
  }

  async function chooseRole(role: RoleAlignment) {
    setSelectedRole(role);
    if (token && attemptId && attemptId > 0) {
      setSubmitting(true);
      const response = await apiRequest(`/diagnostic/${attemptId}/target-role/`, { method: "POST", body: JSON.stringify({ role_id: role.id }) }, token);
      setSubmitting(false);
      if (!response.ok) {
        toast.error(response.error || "Could not set target role");
        return;
      }
    }
    toast.success(`${role.name} selected. Your gap-closing path is ready.`);
    onCompleted?.(role);
  }

  if (stage === "intro") {
    return (
      <div>
        <SectionTitle eyebrow="Adaptive baseline" title="Start with the right assessment" description="Capacity Connect does not give everyone the same test. Choose your work domain and the assessment adapts difficulty and evidence around the competencies that matter." />
        <div className="grid xl:grid-cols-[1.08fr_.92fr] gap-5">
          <div className="cc-card p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {domainCatalog.map((item) => (
                <button key={item.name} onClick={() => setDomain(item.name)} className={`text-left rounded-2xl border p-4 transition ${domain === item.name ? "border-[#4F7C82] bg-[#F1F8F7] shadow-[0_8px_24px_rgba(11,46,51,.06)]" : "border-[#DCE7E8] bg-white hover:bg-[#FAFCFC]"}`}>
                  <div className="flex items-center justify-between gap-2"><strong className="text-sm">{item.name}</strong>{domain === item.name && <span className="w-5 h-5 rounded-full bg-[#159B8C] text-white flex items-center justify-center"><Check className="w-3 h-3" /></span>}</div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">{item.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F7FAFA] border border-[#E0E9EA]">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-[#59767A]">Selected domain</p>
                <h3 className="font-semibold mt-1">{domain}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Possible role alignments: {domainInfo?.roles.slice(0, 3).join(" · ")}</p>
              </div>
              <button className="btn-primary" onClick={start} disabled={submitting}><ClipboardCheck className="w-4 h-4" />{submitting ? "Starting…" : "Start assessment"}</button>
            </div>
          </div>
          <div className="cc-card p-6 bg-[#0B2E33] text-white border-0 overflow-hidden relative">
            <div className="absolute -right-20 -top-16 w-56 h-56 rounded-full bg-[#159B8C]/20 blur-2xl" />
            <Pill tone="teal">How it adapts</Pill>
            <h3 className="text-white text-2xl font-semibold mt-5 tracking-[-0.03em]">Evidence, not one generic score.</h3>
            <div className="space-y-5 mt-6 relative z-10">
              {["Start broad across the selected domain", "Raise difficulty when evidence is strong", "Probe weak competencies more deeply", "Rank relevant roles after the assessment", "Compare current evidence with role requirements"].map((line, index) => (
                <div className="flex gap-3" key={line}><span className="w-7 h-7 rounded-lg bg-white/10 text-[#B8E3E9] flex items-center justify-center text-xs font-bold">{index + 1}</span><p className="text-sm text-white/80 pt-1">{line}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "question" && question) {
    const progress = token ? question.progress || 0 : Math.round(((localIndex + 1) / localQuestions.length) * 100);
    return (
      <div className="max-w-4xl mx-auto">
        <button className="text-sm text-[var(--muted-foreground)] flex gap-2 items-center mb-5" onClick={() => setStage("intro")}><ArrowLeft className="w-4 h-4" />Exit assessment</button>
        <div className="cc-card overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E4ECEC] bg-[#FAFCFC]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="cc-eyebrow">{domain} diagnostic</p><h2 className="text-xl font-semibold">Let’s understand your current capabilities.</h2></div>
              <div className="flex gap-2"><Pill tone="blue">{question.questionType || "MCQ"}</Pill><Pill tone={question.difficulty === "Advanced" ? "coral" : question.difficulty === "Intermediate" ? "amber" : "teal"}>{question.difficulty}</Pill></div>
            </div>
            <div className="mt-5"><div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-2"><span>{question.competency} · {question.skill}</span><span>{Math.max(1, progress)}%</span></div><Bar value={Math.max(4, progress)} /></div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[.14em] font-semibold text-[var(--muted-foreground)]">Current question</p>
            <h3 className="text-xl md:text-2xl font-semibold leading-snug mt-2 max-w-3xl">{question.prompt}</h3>
            <div className="grid gap-3 mt-7">
              {question.options.map((option, index) => (
                <button key={option} onClick={() => setSelected(index)} className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition ${selected === index ? "border-[#4F7C82] bg-[#F0F7F6] shadow-[0_6px_22px_rgba(11,46,51,.05)]" : "border-[#DCE7E8] hover:bg-[#FAFCFC]"}`}>
                  <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${selected === index ? "bg-[#4F7C82] text-white" : "bg-[#F0F4F4] text-[#587174]"}`}>{String.fromCharCode(65 + index)}</span>
                  <span className="text-sm leading-relaxed pt-1">{option}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-7"><button className="btn-primary" disabled={selected === null || submitting} onClick={submitAnswer}>{submitting ? "Saving…" : "Save & continue"}<ArrowRight className="w-4 h-4" /></button></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;
  return (
    <div>
      <SectionTitle eyebrow="Assessment complete" title="Your capability signal is ready" description="This is evidence for development planning—not a recruitment decision. Choose the target role you actually want to build toward." />
      <div className="grid xl:grid-cols-[.82fr_1.18fr] gap-5 mb-5">
        <div className="cc-card p-6">
          <div className="flex items-center justify-between"><div><p className="cc-eyebrow">Current evidence</p><h3 className="text-2xl font-semibold">{result.overallScore}% overall</h3></div><span className="cc-icon-tile"><Gauge className="w-5 h-5" /></span></div>
          <div className="mt-5"><Bar value={result.overallScore} /></div>
          <div className="mt-6 space-y-4">
            {result.competencyScores.slice().sort((a, b) => b.score - a.score).map((row) => (
              <div key={row.name}><div className="flex justify-between gap-3 text-sm mb-2"><span className="font-medium">{row.name}</span><span className="font-semibold">{row.score}%</span></div><Bar value={row.score} tone={row.score >= 75 ? "teal" : row.score >= 55 ? "amber" : "coral"} /></div>
            ))}
          </div>
          <InlineNotice tone="info"><span>Assessment confidence: <strong>{result.confidence}%</strong>. More evidence from courses, practice and reassessment can strengthen this signal.</span></InlineNotice>
        </div>
        <div className="cc-card p-6">
          <div className="flex items-center justify-between"><div><p className="cc-eyebrow">Suggested competency alignment</p><h3 className="text-xl font-semibold">Roles that fit your current evidence</h3></div><BrainCircuit className="w-5 h-5 text-[#4F7C82]" /></div>
          <div className="grid gap-3 mt-5">
            {result.roleAlignment.slice(0, 5).map((role, index) => (
              <button key={role.name} onClick={() => chooseRole(role)} disabled={submitting} className={`text-left rounded-2xl border p-4 transition ${selectedRole?.id === role.id ? "border-[#159B8C] bg-[#EFF9F5]" : "border-[#DCE7E8] hover:bg-[#FAFCFC]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><span className="w-8 h-8 rounded-xl bg-[#EEF5F5] text-[#4F7C82] flex items-center justify-center font-bold text-xs">{index + 1}</span><div><strong className="text-sm">{role.name}</strong><p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-lg">{role.reason}</p></div></div><Pill tone={role.score >= 80 ? "teal" : role.score >= 65 ? "amber" : "neutral"}>{role.score}% alignment</Pill></div>
                <div className="flex flex-wrap gap-2 mt-3 pl-11">{role.strengths.slice(0, 2).map((x) => <Pill key={x} tone="neutral">{x}</Pill>)}{role.gaps.slice(0, 2).map((x) => <Pill key={x} tone="coral">Gap: {x}</Pill>)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedRole && <div className="cc-next-action"><div className="flex gap-3 items-start"><span className="w-9 h-9 rounded-xl bg-white/80 text-[#0D766A] flex items-center justify-center"><Target className="w-4 h-4" /></span><div><p className="cc-eyebrow">Target locked</p><h3 className="font-semibold">{selectedRole.name}</h3><p className="text-sm text-[#4D6668] mt-1">Capacity Connect will now compare your evidence with this role’s required competency matrix and build the shortest gap-closing path.</p></div></div><button className="btn-primary" onClick={() => onCompleted?.(selectedRole)}>Open skill gaps <ArrowRight className="w-4 h-4" /></button></div>}
    </div>
  );
}
