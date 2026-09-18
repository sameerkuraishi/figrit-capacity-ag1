"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Library,
  MessageSquareText,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/capacity-api";
import { demoCourses, demoTrainerMatches, demoExperts, demoChatMessages, demoRoleSuggestions, demoTrainees } from "@/lib/capacity-demo";
import type { Course, UserProfile, ExpertRecord, ChatMessage, RoleSuggestion } from "@/lib/capacity-types";
import { Bar, InlineNotice, Pill, SectionTitle, StatCard } from "./ui";
import { Send, Pin } from "lucide-react";
import { CommunityLayout } from "./CommunityLayout";
import { Knowledge } from "./TraineeWorkspace";

export type TrainerTab = "overview" | "sessions" | "learners" | "courses" | "assessments" | "library" | "knowledge" | "impact" | "community" | "experts";

type SessionRow = {
  id: number;
  traineeName: string;
  startAt: string;
  durationMinutes: number;
  reason: string;
  note: string;
  competency?: string;
  status: string;
  outcome?: any;
};

const fallbackSessions: SessionRow[] = [
  { id: 1, traineeName: "Sameer Khan", startAt: "2026-09-16T18:00:00+05:30", durationMinutes: 20, reason: "Weak assessment area", note: "Needs help with attribution and KPI selection.", competency: "Marketing Analytics", status: "scheduled" },
  { id: 2, traineeName: "Ayesha Ali", startAt: "2026-09-17T17:00:00+05:30", durationMinutes: 30, reason: "Practical case discussion", note: "Wants feedback on paid-media budget allocation.", competency: "Paid Advertising", status: "scheduled" },
  { id: 3, traineeName: "Karan Mehta", startAt: "2026-09-13T16:00:00+05:30", durationMinutes: 20, reason: "Learning path guidance", note: "Reviewed analytics foundation path.", competency: "Marketing Analytics", status: "completed", outcome: { recommendedAction: "Complete funnel KPI workbook" } },
];

function pretty(value: string) {
  return new Date(value).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function Overview({ profile, token, setTab }: { profile: UserProfile; token?: string; setTab: (tab: TrainerTab) => void }) {
  const [metrics, setMetrics] = useState({ active_courses: 3, active_trainees: 38, assessments: 4, average_score: 76, mentor_sessions: 18, upcoming_sessions: 2 });
  useEffect(() => {
    if (!token) return;
    apiRequest<any>("/trainer/dashboard/", {}, token).then((r) => { if (r.ok && r.data?.metrics) setMetrics(r.data.metrics); });
  }, [token]);
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6"><div><p className="cc-eyebrow">Trainer workspace</p><h1 className="text-[34px] md:text-[42px] font-semibold tracking-[-0.05em] leading-[1.03]">Guide capability, not just course completion.</h1><p className="text-sm text-[var(--muted-foreground)] mt-2">{profile.name} · {profile.designation}</p></div><Pill tone="teal">Verified mentor · 4.9 rating</Pill></div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5"><StatCard label="Active learners" value={metrics.active_trainees} note="Across current courses" icon={<Users className="w-5 h-5" />} /><StatCard label="Upcoming sessions" value={metrics.upcoming_sessions} note="20/30-minute mentoring" icon={<CalendarDays className="w-5 h-5" />} /><StatCard label="Average checkpoint" value={`${Math.round(metrics.average_score)}%`} note="Current learners" icon={<ClipboardCheck className="w-5 h-5" />} /><StatCard label="Mentor sessions" value={metrics.mentor_sessions} note="Completed + scheduled" icon={<UserRoundCheck className="w-5 h-5" />} /></div>
      <div className="grid xl:grid-cols-[1.08fr_.92fr] gap-5">
        <div className="cc-card p-6"><div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Learner improvement</p><h2 className="text-xl font-semibold">Competency impact</h2></div><Pill tone="teal">+18 pts median</Pill></div><div className="grid gap-5 mt-6">{[["Marketing Analytics", 43, 68],["Paid Advertising", 52, 74],["A/B Testing", 49, 69],["Conversion Optimization", 58, 76]].map(([name,before,after]) => <div key={String(name)}><div className="flex justify-between gap-3 text-sm mb-2"><span className="font-medium">{name}</span><span className="text-xs text-[var(--muted-foreground)]">{before}% → <strong className="text-[#0D766A]">{after}%</strong></span></div><div className="grid gap-1"><Bar value={Number(after)} tone="teal" /><div className="w-full h-1.5 rounded-full bg-[#EEF2F2] overflow-hidden"><div className="h-full rounded-full bg-[#B9C8CA]" style={{width:`${before}%`}} /></div></div></div>)}</div></div>
        <div className="grid gap-5"><div className="cc-card p-6"><p className="cc-eyebrow">Next mentor clinic</p><h3 className="text-lg font-semibold">Sameer Khan · Marketing Analytics</h3><p className="text-sm text-[var(--muted-foreground)] mt-2">Tomorrow · 6:00 PM · 20 minutes</p><div className="mt-4 p-3 rounded-xl bg-[#F7FAFA] border border-[#E0E9EA] text-sm">Focus: attribution and choosing the right campaign KPI.</div><button className="btn-primary w-full mt-4" onClick={() => setTab("sessions")}>Open mentor sessions <ArrowRight className="w-4 h-4" /></button></div><div className="cc-card p-6"><p className="cc-eyebrow">Learners needing attention</p><div className="space-y-3 mt-3">{[["Sameer Khan","Marketing Analytics",41],["Ayesha Ali","Paid Advertising",49],["Faiz Ansari","A/B Testing",52]].map(([name,skill,score]) => <div className="p-3 rounded-xl border border-[#E2EAEA]" key={String(name)}><div className="flex justify-between gap-3"><strong className="text-sm">{name}</strong><Pill tone="coral">{score}%</Pill></div><p className="text-xs text-[var(--muted-foreground)] mt-1">{skill}</p></div>)}</div><button className="btn-secondary w-full mt-4" onClick={() => setTab("learners")}>View learner evidence</button></div></div>
      </div>
    </div>
  );
}

function Sessions({ token }: { token?: string }) {
  const [sessions, setSessions] = useState<SessionRow[]>(fallbackSessions);
  const [selected, setSelected] = useState<SessionRow | null>(null);
  const [form, setForm] = useState({ topic_discussed: "Marketing Analytics review", problem_identified: "Attribution and KPI selection are unclear.", notes: "Reviewed how to separate business outcome metrics from diagnostic metrics.", recommended_action: "Complete the funnel KPI workbook and reattempt the analytics checkpoint.", recommended_practice: "Analyze one campaign and explain metric choice in 3 bullets.", follow_up_date: "2026-09-21" });
  useEffect(() => { if (token) apiRequest<{ sessions: SessionRow[] }>("/trainer/sessions/", {}, token).then((r) => { if (r.ok && r.data) setSessions(r.data.sessions); }); }, [token]);
  async function saveOutcome() {
    if (!selected) return;
    if (token) {
      const r = await apiRequest(`/mentor-bookings/${selected.id}/outcome/`, { method: "POST", body: JSON.stringify(form) }, token);
      if (!r.ok) { toast.error(r.error || "Could not save outcome"); return; }
    }
    setSessions((prev) => prev.map((s) => s.id === selected.id ? { ...s, status: "completed", outcome: { recommendedAction: form.recommended_action } } : s));
    toast.success("Session outcome saved to the trainee’s learning evidence.");
    setSelected(null);
  }
  return (
    <div>
      <SectionTitle eyebrow="On-demand mentoring" title="Mentor sessions" description="Trainees choose 20 or 30-minute slots. After each session, capture a short outcome so guidance becomes part of the learning path." />
      <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5"><div className="cc-card overflow-hidden"><div className="p-5 border-b border-[#E4ECEC]"><p className="cc-eyebrow">Schedule</p><h3 className="font-semibold">Upcoming & completed sessions</h3></div><div className="divide-y divide-[#E6EEEE]">{sessions.map((s) => <button key={s.id} className={`w-full p-5 text-left hover:bg-[#FBFDFD] ${selected?.id===s.id?"bg-[#F6FAF9]":""}`} onClick={() => setSelected(s)}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex gap-2 items-center"><strong className="text-sm">{s.traineeName}</strong><Pill tone={s.status==="completed"?"teal":"blue"}>{s.status}</Pill></div><p className="text-xs text-[var(--muted-foreground)] mt-1">{s.competency} · {s.durationMinutes} min</p><p className="text-xs text-[#587174] mt-1">{pretty(s.startAt)}</p></div><span className="cc-icon-tile"><MessageSquareText className="w-4 h-4" /></span></div><p className="text-sm mt-3 text-[#425B5E]">{s.note}</p>{s.outcome?.recommendedAction && <div className="mt-3 p-2.5 rounded-lg bg-[#EBF7F3] text-xs text-[#116B61]">Outcome: {s.outcome.recommendedAction}</div>}</button>)}</div></div><div className="cc-card p-6 self-start">{selected ? <><p className="cc-eyebrow">Session outcome</p><h3 className="text-xl font-semibold">{selected.traineeName}</h3><p className="text-xs text-[var(--muted-foreground)] mt-1">{selected.reason} · {selected.competency}</p><div className="space-y-4 mt-5">{[["Topic discussed","topic_discussed"],["Problem identified","problem_identified"],["Notes","notes"],["Recommended action","recommended_action"],["Recommended practice","recommended_practice"]].map(([label,key]) => <label className="block" key={key}><span className="cc-label">{label}</span><textarea className="cc-input w-full mt-2 min-h-20 resize-none" value={(form as any)[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})} /></label>)}<label className="block"><span className="cc-label">Suggested follow-up</span><input type="date" className="cc-input mt-2 w-full" value={form.follow_up_date} onChange={(e)=>setForm({...form,follow_up_date:e.target.value})} /></label></div><InlineNotice tone="info"><span>Outcome notes can update the learner’s Capacity Coach plan. They do not automatically change a verified competency score.</span></InlineNotice><button className="btn-primary w-full mt-5" onClick={saveOutcome}><CheckCircle2 className="w-4 h-4" />Save session outcome</button></> : <div className="py-10 text-center"><UserRoundCheck className="w-8 h-8 mx-auto text-[#789194]" /><h3 className="font-semibold mt-3">Select a session</h3><p className="text-sm text-[var(--muted-foreground)] mt-2">Open a booking to review context and add the post-session action plan.</p></div>}</div></div>
    </div>
  );
}

function Learners({ profile }: { profile: UserProfile }) {
  const [suggestions, setSuggestions] = useState<RoleSuggestion[]>(demoRoleSuggestions);
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  const [form, setForm] = useState({ role: "", requiredSkills: "", strengths: "", gaps: "", explanation: "", prep: "" });

  const rows = [
    { id: 1, name:"Sameer Khan", role:"Performance Marketing Specialist", readiness:56, gap:"Marketing Analytics", score:41, state:"Critical" },
    { id: 14, name:"Ayesha Ali", role:"Performance Marketing Specialist", readiness:62, gap:"Paid Advertising", score:49, state:"Critical" },
    { id: 2, name:"Karan Mehta", role:"Marketing Analyst", readiness:68, gap:"A/B Testing", score:57, state:"Moderate" },
    { id: 16, name:"Pooja Singh", role:"Content Marketing Specialist", readiness:81, gap:"Marketing Analytics", score:68, state:"Low" },
  ];

  const handleSuggest = () => {
    if (!selectedTrainee || !form.role) return;
    const newSuggestion: RoleSuggestion = {
      id: Date.now(),
      traineeId: selectedTrainee.id,
      trainerId: profile.id,
      trainerName: profile.name,
      suggestedRole: form.role,
      requiredSkills: form.requiredSkills.split(",").map(s=>s.trim()).filter(Boolean),
      strengths: form.strengths.split(",").map(s=>s.trim()).filter(Boolean),
      gaps: form.gaps.split(",").map(s=>s.trim()).filter(Boolean),
      explanation: form.explanation,
      preparationResources: form.prep.split(",").map(s=>s.trim()).filter(Boolean),
      suggestedAt: new Date().toISOString()
    };
    setSuggestions(prev => [...prev, newSuggestion]);
    demoRoleSuggestions.push(newSuggestion); // Persist to shared demo state
    toast.success("Role suggestion sent to trainee.");
    setSelectedTrainee(null);
  };

  if (selectedTrainee) {
    return (
      <div>
        <SectionTitle eyebrow="Career Guidance" title={`Suggest Role for ${selectedTrainee.name}`} description="Suggest a future project or organizational role based on their demonstrated competencies." action={<button className="btn-secondary" onClick={()=>setSelectedTrainee(null)}>Back</button>} />
        <div className="cc-card p-6 max-w-3xl">
          <div className="space-y-4">
            <div><label className="cc-label block">Suggested Role</label><input className="cc-input w-full mt-2" placeholder="e.g. Senior Analytics Lead" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} /></div>
            <div><label className="cc-label block">Explanation</label><textarea className="cc-input w-full mt-2 h-20 resize-none" placeholder="Why is this a good fit?" value={form.explanation} onChange={e=>setForm({...form, explanation: e.target.value})} /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="cc-label block">Current Strengths (comma-separated)</label><input className="cc-input w-full mt-2" placeholder="e.g. Campaign Optimization" value={form.strengths} onChange={e=>setForm({...form, strengths: e.target.value})} /></div>
              <div><label className="cc-label block">Gaps to Close (comma-separated)</label><input className="cc-input w-full mt-2" placeholder="e.g. Advanced Attribution" value={form.gaps} onChange={e=>setForm({...form, gaps: e.target.value})} /></div>
            </div>
            <div><label className="cc-label block">Required Skills (comma-separated)</label><input className="cc-input w-full mt-2" placeholder="e.g. Marketing Analytics, SEO" value={form.requiredSkills} onChange={e=>setForm({...form, requiredSkills: e.target.value})} /></div>
            <div><label className="cc-label block">Preparation Resources (comma-separated)</label><input className="cc-input w-full mt-2" placeholder="e.g. Advanced Attribution Course" value={form.prep} onChange={e=>setForm({...form, prep: e.target.value})} /></div>
            <button className="btn-primary w-full mt-2" onClick={handleSuggest}>Send Suggestion</button>
          </div>
        </div>
      </div>
    );
  }

  return <div><SectionTitle eyebrow="Learner monitoring" title="See evidence, not only completion" description="Focus trainer attention where competency evidence is weak or intervention is not working." /><div className="cc-card overflow-hidden"><div className="overflow-x-auto"><table className="cc-table"><thead><tr><th>Learner</th><th>Target role</th><th>Readiness</th><th>Priority gap</th><th>Evidence level</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r)=><tr key={r.name}><td><strong>{r.name}</strong><div className="text-[11px] text-[var(--muted-foreground)]">Digital Outreach</div></td><td>{r.role}</td><td><div className="w-28"><div className="flex justify-between text-xs mb-1"><span>{r.readiness}%</span></div><Bar value={r.readiness} /></div></td><td>{r.gap}</td><td>{r.score}%</td><td><Pill tone={r.state==="Critical"?"red":r.state==="Moderate"?"amber":"teal"}>{r.state}</Pill></td><td><button className="text-xs text-[#0D766A] font-semibold hover:underline" onClick={()=>setSelectedTrainee(r)}>Suggest Role</button></td></tr>)}</tbody></table></div></div></div>;
}

function CoursesStudio({ token }: { token?: string }) {
  const [courses] = useState<Course[]>(demoCourses.slice(0,3));
  return <div><SectionTitle eyebrow="Course studio" title="Build learning around competencies" description="Courses are tagged to the exact competencies they are meant to develop. Draft, preview and publish without turning the portal into a generic content library." action={<button className="btn-primary" onClick={()=>toast.info("Course creation drawer is ready for backend extension.")}><Plus className="w-4 h-4" />Create course</button>} /><div className="grid lg:grid-cols-3 gap-4">{courses.map((c)=><div className="cc-card p-5" key={c.id}><div className="flex justify-between gap-3"><Pill tone="neutral">{c.level}</Pill><Pill tone={c.status==="In Progress"?"teal":"blue"}>Published</Pill></div><h3 className="font-semibold text-lg mt-4">{c.title}</h3><p className="text-sm text-[var(--muted-foreground)] mt-2 line-clamp-3">{c.description}</p><div className="flex flex-wrap gap-2 mt-4">{Object.keys(c.requiredCompetencies).slice(0,3).map(x=><Pill key={x} tone="neutral">{x}</Pill>)}</div><div className="mt-5 pt-4 border-t border-[#E6EEEE] flex justify-between text-xs text-[var(--muted-foreground)]"><span>{c.enrolled} learners</span><span>{c.durationHours || c.durationWeeks} hrs</span></div><button className="btn-secondary w-full mt-4" onClick={()=>toast.info(`Opening ${c.title} in Course Studio.`)}>Edit course</button></div>)}</div></div>;
}

function AssessmentStudio() {
  const [questions, setQuestions] = useState([
    { prompt:"Which metric directly expresses cost per completed conversion?", competency:"Marketing Analytics", difficulty:"Beginner", correct:68, expected:"Easy" },
    { prompt:"Traffic increases but conversions stay flat. What should be compared first?", competency:"Marketing Analytics", difficulty:"Intermediate", correct:31, expected:"Medium" },
    { prompt:"What makes an A/B test result more trustworthy?", competency:"A/B Testing", difficulty:"Intermediate", correct:26, expected:"Medium" },
  ]);
  return <div><SectionTitle eyebrow="Assessment studio" title="Measure the right competency" description="Create MCQ, scenario and case questions with domain, competency, skill, difficulty and explanation metadata." action={<button className="btn-primary" onClick={()=>toast.success("New question draft created.")}><Plus className="w-4 h-4" />New question</button>} /><div className="grid xl:grid-cols-[1fr_.9fr] gap-5"><div className="cc-card overflow-hidden"><div className="p-5 border-b border-[#E4ECEC]"><p className="cc-eyebrow">Question bank</p><h3 className="font-semibold">Marketing competency items</h3></div><div className="divide-y divide-[#E6EEEE]">{questions.map((q,i)=><div className="p-5" key={q.prompt}><div className="flex flex-wrap gap-2"><Pill tone="neutral">{q.competency}</Pill><Pill tone="blue">{q.difficulty}</Pill>{q.correct<40&&<Pill tone="amber">Review recommended</Pill>}</div><p className="text-sm font-medium mt-3">{q.prompt}</p><div className="flex gap-4 text-xs text-[var(--muted-foreground)] mt-3"><span>{q.correct}% correct</span><span>Expected: {q.expected}</span><span>Observed: {q.correct<35?"Very hard":"Normal"}</span></div></div>)}</div></div><div className="grid gap-5 self-start"><div className="cc-card p-6"><p className="cc-eyebrow">Question intelligence</p><h3 className="text-xl font-semibold">Possible ambiguity / content issue</h3><p className="text-sm text-[var(--muted-foreground)] mt-3 leading-relaxed">74% of learners miss the same analytics concept even after completing the linked module.</p><div className="mt-5 p-4 rounded-xl bg-[#FFF8E9] border border-[#F0DDAA]"><strong className="text-sm">Possible learning material issue</strong><p className="text-xs text-[#775D29] mt-1">Review the funnel-diagnosis explanation and the corresponding question. This is a signal, not an automatic conclusion.</p></div><div className="grid grid-cols-2 gap-3 mt-4"><button className="btn-secondary" onClick={()=>toast.info("Module review opened for the linked analytics concept.")}>Review module</button><button className="btn-secondary" onClick={()=>toast.info("Question review opened with difficulty and response evidence.")}>Review question</button></div></div><div className="cc-card p-6"><p className="cc-eyebrow">Case-to-curriculum</p><h3 className="font-semibold">Turn approved field cases into learning</h3><p className="text-sm text-[var(--muted-foreground)] mt-2">Upload case → map competency → draft learning case → trainer review → publish.</p><button className="btn-primary w-full mt-4" onClick={()=>toast.info("Case upload flow: upload → competency mapping → trainer review → publish.")}><Upload className="w-4 h-4" />Upload approved case</button></div></div></div></div>;
}

function LibraryStudio() {
  const items = [
    ["Campaign Measurement Foundations","Video","Marketing Analytics","24 min"],
    ["Funnel KPI Workbook","PDF","Marketing Analytics","12 pages"],
    ["Paid Media Targeting Checklist","Notes","Paid Advertising","6 min"],
    ["A/B Test Decision Traps","PPT","A/B Testing","18 slides"],
  ];
  return <div><SectionTitle eyebrow="Trainer library" title="Reusable verified learning assets" description="Upload resources once, connect them to competencies, and reuse them across courses, cohorts and mentor follow-ups." action={<button className="btn-primary" onClick={()=>toast.info("Resource upload accepts PDF, PPT, video, notes or verified links in the backend flow.")}><Upload className="w-4 h-4" />Upload resource</button>} /><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{items.map(([title,type,comp,size])=><div className="cc-card p-5" key={title}><span className="cc-icon-tile"><FileText className="w-5 h-5" /></span><div className="flex gap-2 mt-4"><Pill tone="neutral">{type}</Pill><Pill tone="teal">Verified</Pill></div><h3 className="font-semibold mt-3">{title}</h3><p className="text-xs text-[var(--muted-foreground)] mt-2">{comp} · {size}</p><button className="btn-secondary w-full mt-5" onClick={()=>toast.info(`Opening verified resource: ${title}.`)}>Open resource</button></div>)}</div></div>;
}

function Impact() {
  return <div><SectionTitle eyebrow="Trainer impact" title="Measure capability change, not star ratings alone" description="Use before/after competency evidence, completion, feedback and mentoring outcomes to understand whether training helped." /><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5"><StatCard label="Learner improvement" value="+18 pts" note="Median across priority gaps" icon={<TrendingUp className="w-5 h-5" />} tone="success"/><StatCard label="Course completion" value="84%" note="Active cohorts" icon={<CheckCircle2 className="w-5 h-5" />}/><StatCard label="Mentor rating" value="4.9" note="18 completed sessions" icon={<UserRoundCheck className="w-5 h-5" />}/><StatCard label="Return rate" value="31%" note="Learners booking follow-up" icon={<BarChart3 className="w-5 h-5" />}/></div><div className="cc-card p-6"><p className="cc-eyebrow">Before → after</p><div className="grid md:grid-cols-2 gap-6 mt-5">{[["Marketing Analytics",43,68],["Paid Advertising",52,74],["A/B Testing",49,69],["Conversion Optimization",58,76]].map(([name,before,after])=><div key={String(name)}><div className="flex justify-between text-sm mb-3"><strong>{name}</strong><span>{before}% → <strong className="text-[#0D766A]">{after}%</strong></span></div><div className="relative"><Bar value={Number(after)} /><span className="absolute top-[-3px] bottom-[-3px] w-[2px] bg-[#A5B6B8]" style={{left:`${before}%`}} /></div></div>)}</div></div></div>;
}

function ExpertConnect({ profile }: { profile: UserProfile }) {
  const strengths = demoTrainerMatches[0].strengths;
  return (
    <div>
      <SectionTitle eyebrow="Expert Connect" title="Expert Directory & Profile" description="Browse available experts for mentoring or update your own verified expertise profile." />
      <div className="grid xl:grid-cols-[.85fr_1.15fr] gap-5 mb-10">
        <div className="cc-card p-6">
          <p className="cc-eyebrow">Your Profile</p>
          <div className="w-16 h-16 rounded-2xl bg-[#EAF5F4] flex items-center justify-center font-bold text-xl mt-4">AS</div>
          <h3 className="text-xl font-semibold mt-4">{profile.name}</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{profile.designation}</p>
          <div className="space-y-3 mt-6">
            {[["Qualification",profile.qualification],["Experience",`${profile.experienceYears} years`],["Domain",profile.domain || "Marketing"],["Language",profile.preferredLanguage || "Hindi / English"],["Rating","4.9 / 5"]].map(([a,b])=><div className="flex justify-between gap-4 text-sm" key={a}><span className="text-[var(--muted-foreground)]">{a}</span><strong className="text-right">{b}</strong></div>)}
          </div>
          <button className="btn-secondary w-full mt-5" onClick={()=>toast.info("Edit profile form opens...")}>Edit Profile</button>
        </div>
        <div className="cc-card p-6">
          <p className="cc-eyebrow">Your Verified Expertise</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {strengths.map((s,i)=><div className="p-4 rounded-xl border border-[#E0E9EA]" key={s}><div className="flex justify-between gap-3"><strong className="text-sm">{s.split(" ").slice(0,-1).join(" ")}</strong><Pill tone="teal">Verified</Pill></div><Bar value={[96,94,91,88][i]||85} height="h-2" /></div>)}
          </div>
          <InlineNotice tone="info"><span>Explainable matching avoids “black box” mentor recommendations. Trainees can see why you were recommended for their current gap.</span></InlineNotice>
        </div>
      </div>
      <p className="cc-eyebrow">Expert Directory</p>
      <div className="grid lg:grid-cols-3 gap-5 mt-4">
        {demoExperts.map(exp => (
          <div className="cc-card p-5" key={exp.id}>
            <h3 className="font-semibold text-lg">{exp.name}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{exp.designation}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {exp.expertise.map(sk => <span key={sk} className="text-[10px] bg-[#EEF5F5] text-[#4F7C82] px-1.5 py-0.5 rounded">{sk}</span>)}
            </div>
            <p className="text-xs mt-4 text-[#425B5E] line-clamp-2">{exp.bio}</p>
            <div className="mt-4 pt-4 border-t border-[#E0E9EA] text-xs space-y-2 text-[var(--muted-foreground)]">
              <div className="flex justify-between"><span>Availability:</span> <span className="font-medium text-[#0B2E33]">{exp.availability}</span></div>
              <div className="flex justify-between"><span>Rating:</span> <span className="font-medium text-[#0B2E33]">{exp.rating} / 5</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function TrainerWorkspace({ profile, token, activeTab, setActiveTab }: { profile: UserProfile; token?: string; activeTab: TrainerTab; setActiveTab: (tab: TrainerTab)=>void }) {
  if (activeTab === "overview") return <Overview profile={profile} token={token} setTab={setActiveTab} />;
  if (activeTab === "sessions") return <Sessions token={token} />;
  if (activeTab === "learners") return <Learners profile={profile} />;
  if (activeTab === "courses") return <CoursesStudio token={token} />;
  if (activeTab === "assessments") return <AssessmentStudio />;
  if (activeTab === "library") return <LibraryStudio />;
  if (activeTab === "knowledge") return <Knowledge token={token} setTab={setActiveTab} />;
  if (activeTab === "impact") return <Impact />;
  if (activeTab === "community") return <CommunityLayout profile={profile} />;
  if (activeTab === "experts") return <ExpertConnect profile={profile} />;
  return <ExpertConnect profile={profile} />;
}
