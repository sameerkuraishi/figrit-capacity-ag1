"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  Library,
  LockKeyhole,
  MessageSquareText,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/capacity-api";
import {
  demoAnnouncements,
  demoAssessments,
  demoBookings,
  demoCompetencyGaps,
  demoCourses,
  demoLearningPath,
  knowledgeItems,
  proofEvidence,
  skillPassport,
  demoTeams,
  demoTeamInvitations,
  demoMembershipRequests,
  demoRoleSuggestions,
  demoOpportunities,
  demoRoleApplications,
} from "@/lib/capacity-demo";
import type { CompetencyScore, Course, LearningPath, RoleAlignment, UserProfile, Team, TeamInvitation, MembershipRequest, RoleSuggestion, Opportunity, RoleApplication } from "@/lib/capacity-types";
import DiagnosticFlow from "./DiagnosticFlow";
import MentorMarketplace from "./MentorMarketplace";
import { Bar, InlineNotice, NextAction, Pill, SectionTitle, StatCard } from "./ui";
import { Network, Plus, Briefcase, BookOpen as BookOpenIcon } from "lucide-react";
import { CommunityLayout } from "./CommunityLayout";

export type TraineeTab = "overview" | "assessment" | "readiness" | "learning" | "courses" | "mentor" | "passport" | "knowledge" | "certificates" | "profile" | "teams" | "community" | "opportunities";

function Overview({ profile, token, setTab }: { profile: UserProfile; token?: string; setTab: (tab: TraineeTab) => void }) {
  const [readiness, setReadiness] = useState(56);
  const [verifiedSkills, setVerifiedSkills] = useState(3);
  const [activeCourses, setActiveCourses] = useState(1);
  const [upcomingMentor, setUpcomingMentor] = useState(demoBookings[0]);

  useEffect(() => {
    if (!token) return;
    apiRequest<any>("/trainee/dashboard/", {}, token).then((r) => {
      if (r.ok && r.data) {
        setReadiness(r.data.metrics?.readiness ?? 56);
        setVerifiedSkills(r.data.metrics?.verified_skills ?? 3);
        setActiveCourses(r.data.metrics?.active_courses ?? 1);
        if (r.data.upcomingMentor) setUpcomingMentor(r.data.upcomingMentor);
      }
    });
  }, [token]);

  const critical = demoCompetencyGaps.filter((x) => x.status === "Critical").length;
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
        <div>
          <p className="cc-eyebrow">Trainee workspace</p>
          <h1 className="text-[34px] md:text-[42px] font-semibold tracking-[-0.05em] leading-[1.03]">Good morning, {profile.name.split(" ")[0]}.</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">{profile.designation} · {profile.department}</p>
        </div>
        <div className="flex gap-2"><Pill tone="neutral">Target: Performance Marketing Specialist</Pill><Pill tone="coral">{critical} priority gaps</Pill></div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard label="Role readiness" value={`${readiness}%`} note="Target 80%" icon={<Gauge className="w-5 h-5" />} tone="warning" />
        <StatCard label="Verified skills" value={verifiedSkills} note="Evidence-backed" icon={<ShieldCheck className="w-5 h-5" />} />
        <StatCard label="Active learning" value={activeCourses} note="1 current priority" icon={<BookOpen className="w-5 h-5" />} />
        <StatCard label="Mentor sessions" value="1" note="Next: tomorrow" icon={<UserRoundCheck className="w-5 h-5" />} />
      </div>

      <NextAction title="Complete Marketing Analytics Fundamentals" description="This is your highest-priority gap. Finish the next learning block before your mentor session." cta="Continue learning" onClick={() => setTab("learning")} />

      <div className="grid xl:grid-cols-[1.08fr_.92fr] gap-5 mt-5">
        <div className="cc-card p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="cc-eyebrow">Your capacity snapshot</p><h2 className="text-xl font-semibold">Current vs required competency</h2></div><button className="text-sm font-semibold text-[#315F66] flex items-center gap-1" onClick={() => setTab("readiness")}>View full gap report <ChevronRight className="w-4 h-4" /></button></div>
          <div className="space-y-5 mt-6">
            {demoCompetencyGaps.slice(0, 5).map((row) => (
              <div key={row.name}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm mb-2"><span className="font-medium">{row.name}</span><div className="flex items-center gap-3"><span className="text-xs text-[var(--muted-foreground)]">Current {row.current}% · Required {row.required}%</span><Pill tone={row.status === "Critical" ? "red" : row.status === "Moderate" ? "amber" : "teal"}>{row.status}</Pill></div></div>
                <Bar value={row.current} marker={row.required} tone={row.status === "Critical" ? "coral" : row.status === "Moderate" ? "amber" : "teal"} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="cc-card p-6">
            <div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Upcoming guidance</p><h3 className="text-lg font-semibold">{upcomingMentor?.trainerName || "Ananya Sharma"}</h3></div><span className="cc-icon-tile"><CalendarDays className="w-5 h-5" /></span></div>
            <p className="text-sm text-[var(--muted-foreground)] mt-3">20-minute expert session · Marketing Analytics</p>
            <div className="mt-4 p-3 rounded-xl bg-[#F7FAFA] border border-[#E2EAEA] flex items-center justify-between gap-3"><span className="text-sm">Tomorrow · 6:00 PM</span><Pill tone="teal">Scheduled</Pill></div>
            <button className="btn-secondary w-full mt-4" onClick={() => setTab("mentor")}>Open mentor sessions</button>
          </div>
          <div className="cc-card p-6">
            <p className="cc-eyebrow">Announcements</p>
            <div className="mt-3 divide-y divide-[#E7EEEE]">
              {demoAnnouncements.slice(0, 3).map((item) => <div className="py-3 first:pt-0" key={item.id}><div className="flex justify-between gap-3"><strong className="text-sm">{item.title}</strong><span className="text-[10px] text-[var(--muted-foreground)] whitespace-nowrap">{item.date}</span></div><p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">{item.body}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Readiness({ token, setTab }: { token?: string; setTab: (tab: TraineeTab) => void }) {
  const [gaps, setGaps] = useState<CompetencyScore[]>(demoCompetencyGaps);
  const [readiness, setReadiness] = useState(56);
  const [selected, setSelected] = useState<CompetencyScore>(demoCompetencyGaps[3]);
  useEffect(() => {
    if (!token) return;
    apiRequest<any>("/trainee/readiness/", {}, token).then((r) => {
      if (r.ok && r.data?.gaps?.length) {
        setGaps(r.data.gaps);
        setReadiness(Math.round(r.data.readiness));
        setSelected(r.data.gaps[0]);
      }
    });
  }, [token]);

  return (
    <div>
      <SectionTitle eyebrow="Proof-based readiness" title="Your exact competency gaps" description="Capacity Connect compares your latest evidence with the competency matrix for the target role. A gap is development guidance—not a permanent label." action={<button className="btn-secondary" onClick={() => setTab("assessment")}><ClipboardCheck className="w-4 h-4" />Retake targeted assessment</button>} />
      <div className="grid xl:grid-cols-[1.2fr_.8fr] gap-5">
        <div className="cc-card overflow-hidden">
          <div className="p-5 border-b border-[#E4ECEC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="cc-eyebrow">Target role</p><h3 className="font-semibold">Performance Marketing Specialist</h3></div><div className="flex items-center gap-3"><span className="text-3xl font-semibold tracking-[-0.04em]">{readiness}%</span><Pill tone="amber">Building readiness</Pill></div></div>
          <div className="divide-y divide-[#E8EEEE]">
            {gaps.map((row) => (
              <button key={row.name} className={`w-full text-left p-5 transition ${selected?.name === row.name ? "bg-[#F7FBFA]" : "hover:bg-[#FBFDFD]"}`} onClick={() => setSelected(row)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3"><div><strong className="text-sm">{row.name}</strong><p className="text-xs text-[var(--muted-foreground)] mt-1">{row.category || "Competency"} · {row.evidenceCount || 0} evidence items</p></div><div className="flex items-center gap-3"><span className="text-xs text-[var(--muted-foreground)]">Gap {Math.round(row.gap)} pts</span><Pill tone={row.status === "Critical" ? "red" : row.status === "Moderate" ? "amber" : "teal"}>{row.status}</Pill></div></div>
                <Bar value={row.current} marker={row.required} tone={row.status === "Critical" ? "coral" : row.status === "Moderate" ? "amber" : "teal"} />
                <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] mt-2"><span>Current {Math.round(row.current)}%</span><span>Required {Math.round(row.required)}%</span></div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 self-start">
          <div className="cc-card p-6">
            <div className="flex items-center justify-between"><div><p className="cc-eyebrow">ProofScore</p><h3 className="text-xl font-semibold">{selected?.name}</h3></div><span className="cc-icon-tile"><ShieldCheck className="w-5 h-5" /></span></div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="cc-mini-metric"><span>Level</span><strong>{Math.round(selected?.current || 0)}%</strong></div>
              <div className="cc-mini-metric"><span>Confidence</span><strong>{Math.round(selected?.confidence || 83)}%</strong></div>
              <div className="cc-mini-metric"><span>Freshness</span><strong>{Math.round(selected?.freshness || 96)}%</strong></div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mt-6 mb-2">Evidence timeline</p>
            <div className="space-y-3">
              {proofEvidence.map((item) => <div className="flex gap-3 items-start" key={item.label}><span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.state === "Verified" ? "bg-[#EAF7F3] text-[#13806F]" : "bg-[#FFF6E3] text-[#A67414]"}`}>{item.state === "Verified" ? <CheckCircle2 className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}</span><div className="flex-1"><div className="flex justify-between gap-3"><span className="text-sm font-medium">{item.label}</span><strong className="text-sm">{item.score}</strong></div><p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{item.date} · {item.state}</p></div></div>)}
            </div>
            <InlineNotice tone="info"><span><strong>How it is calculated:</strong> verified evidence is weighted by evidence type, recency and assessment confidence. No single quiz permanently defines a competency.</span></InlineNotice>
          </div>
          <button className="cc-card p-5 text-left group" onClick={() => setTab("learning")}><p className="cc-eyebrow">Recommended intervention</p><div className="flex items-center justify-between gap-4 mt-1"><div><h3 className="font-semibold">Open your gap-closing path</h3><p className="text-xs text-[var(--muted-foreground)] mt-1">Courses, practice, mentor and reassessment in order.</p></div><ArrowRight className="w-5 h-5 text-[#4F7C82] group-hover:translate-x-1 transition" /></div></button>
        </div>
      </div>
    </div>
  );
}

function Learning({ token, setTab }: { token?: string; setTab: (tab: TraineeTab) => void }) {
  const [path, setPath] = useState<LearningPath>(demoLearningPath);
  const [courseProgress, setCourseProgress] = useState(38);
  useEffect(() => {
    if (!token) return;
    apiRequest<any>("/trainee/learning-path/", {}, token).then((r) => {
      if (r.ok && r.data?.learningPath) setPath(r.data.learningPath);
    });
  }, [token]);

  async function markProgress(value: number) {
    const next = Math.max(courseProgress, value);
    setCourseProgress(next);
    if (token) await apiRequest("/courses/1/progress/", { method: "POST", body: JSON.stringify({ progress: next }) }, token);
    toast.success(`Learning progress updated to ${next}%.`);
  }

  return (
    <div>
      <SectionTitle eyebrow="Capacity Coach" title="Your personalized gap-closing path" description="What to learn → why it matters → when to ask an expert → how improvement will be verified." action={<Pill tone="teal">Target readiness {path.targetReadiness}%</Pill>} />
      
      <div className="mb-6 cc-card p-6 bg-[#0B2E33] text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="cc-eyebrow text-[#B8E3E9]">Evidence Projection</p>
            <h3 className="text-xl font-semibold mt-1">Expected growth from this path</h3>
          </div>
          <Pill tone="teal">Based on path completion</Pill>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-white/70">Current Score (Before)</span><span className="font-semibold">{path.currentReadiness}%</span></div>
            <Bar value={path.currentReadiness} tone="blue" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-white/70">Projected Score (After)</span><span className="font-semibold">{path.targetReadiness}%</span></div>
            <Bar value={path.targetReadiness} tone="teal" />
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[.82fr_1.18fr] gap-5">
        <div className="cc-card p-6 self-start">
          <div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Goal</p><h3 className="font-semibold">{path.targetRole}</h3></div><div className="text-right"><strong className="text-2xl">{path.currentReadiness}%</strong><p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">current</p></div></div>
          <div className="mt-4"><Bar value={path.currentReadiness} marker={path.targetReadiness} /></div>
          <div className="mt-6 relative">
            <span className="absolute left-[17px] top-5 bottom-5 w-px bg-[#DDE8E8]" />
            <div className="space-y-3">
              {path.items.map((item, index) => (
                <div key={item.id} className={`relative flex gap-3 rounded-2xl p-3 ${item.status === "current" ? "bg-[#EFF8F5] border border-[#CDE8DE]" : ""}`}>
                  <span className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.status === "completed" ? "bg-[#159B8C] text-white border-[#159B8C]" : item.status === "current" ? "bg-white text-[#0D766A] border-[#8DC6B8]" : item.status === "locked" ? "bg-[#F0F3F3] text-[#9AA9AB] border-[#DDE5E5]" : "bg-white text-[#4F7C82] border-[#D8E5E7]"}`}>{item.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : item.status === "locked" ? <LockKeyhole className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}</span>
                  <div className="min-w-0 pt-0.5"><div className="flex flex-wrap gap-2 items-center"><strong className="text-sm">{item.title}</strong>{item.status === "current" && <Pill tone="teal">Current</Pill>}</div><p className="text-xs text-[var(--muted-foreground)] mt-1">{item.competency} · {item.durationMinutes} min</p><p className="text-xs text-[#526A6D] mt-1">{item.note}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="cc-card overflow-hidden">
            <div className="aspect-video bg-[#0B2E33] relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(21,155,140,.22),transparent_36%),radial-gradient(circle_at_85%_80%,rgba(184,227,233,.14),transparent_32%)]" />
              <button className="relative w-16 h-16 rounded-full bg-white text-[#0B2E33] flex items-center justify-center shadow-xl" onClick={() => { markProgress(Math.max(courseProgress, 38)); toast.success("Learning player started. Progress will be saved as you continue."); }}><PlayCircle className="w-8 h-8" /></button>
              <div className="absolute left-5 bottom-5 text-white"><Pill tone="teal">Current module</Pill><h3 className="text-white text-xl font-semibold mt-2">Campaign Measurement Foundations</h3><p className="text-white/60 text-xs mt-1">Marketing Analytics Fundamentals · 24 min</p></div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Learning progress</p><h3 className="font-semibold">{courseProgress}% complete</h3></div><span className="text-sm font-semibold">Targets Marketing Analytics</span></div>
              <div className="mt-3"><Bar value={courseProgress} /></div>
              <div className="grid sm:grid-cols-3 gap-3 mt-5">
                <button className="cc-action-tile" onClick={() => markProgress(62)}><PlayCircle className="w-4 h-4" /><span>Continue module</span></button>
                <button className="cc-action-tile" onClick={() => toast.info("Resources: campaign KPI guide, attribution notes and the linked practice worksheet.")}><FileText className="w-4 h-4" /><span>Resources</span></button>
                <button className="cc-action-tile" onClick={() => setTab("mentor")}><MessageSquareText className="w-4 h-4" /><span>Ask mentor</span></button>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="cc-card p-4"><p className="cc-eyebrow">Why this course?</p><p className="text-sm mt-2 leading-relaxed">Your Marketing Analytics evidence is below the selected role requirement.</p></div>
            <div className="cc-card p-4"><p className="cc-eyebrow">After learning</p><p className="text-sm mt-2 leading-relaxed">A targeted checkpoint adds fresh competency evidence.</p></div>
            <div className="cc-card p-4"><p className="cc-eyebrow">If still blocked</p><p className="text-sm mt-2 leading-relaxed">Book 20/30 min with a relevant expert instead of repeating everything.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Courses({ token, setTab }: { token?: string; setTab: (tab: TraineeTab) => void }) {
  const [courses, setCourses] = useState<Course[]>(demoCourses);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);
  useEffect(() => {
    if (!token) return;
    apiRequest<{ courses: Course[] }>("/courses/", {}, token).then((r) => { if (r.ok && r.data?.courses?.length) setCourses(r.data.courses); });
  }, [token]);
  const filtered = useMemo(() => courses.filter((c) => `${c.title} ${c.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [courses, query]);

  async function enroll(course: Course) {
    if (token) {
      const response = await apiRequest<any>(`/courses/${course.id}/enroll/`, { method: "POST" }, token);
      if (!response.ok) { toast.error(response.error || "Could not enroll"); return; }
    }
    setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, status: "In Progress", progress: c.progress || 0 } : c));
    toast.success(`Enrolled in ${course.title}`);
  }

  return (
    <div>
      <SectionTitle eyebrow="Explore learning" title="Courses connected to competency gaps" description="Recommendations explain why a course appears instead of showing a random catalog." />
      <div className="cc-card p-4 mb-5 flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1 max-w-xl"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#769093]" /><input className="cc-input pl-9 w-full" placeholder="Search courses or competencies" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <div className="flex gap-2"><Pill tone="teal">Recommended first</Pill><Pill tone="neutral">{filtered.length} courses</Pill></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map((course) => (
          <div className="cc-card p-5" key={course.id}>
            <div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap gap-2 mb-3"><Pill tone="neutral">{course.level}</Pill><Pill tone="blue">{course.durationHours || course.durationWeeks} {course.durationHours ? "hrs" : "weeks"}</Pill></div><h3 className="text-xl font-semibold">{course.title}</h3><p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">{course.description}</p></div><span className="w-12 h-12 rounded-2xl bg-[#EEF5F5] text-[#4F7C82] flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5" /></span></div>
            <div className="flex flex-wrap gap-2 mt-4">{course.tags.map((tag) => <Pill key={tag} tone="neutral">{tag}</Pill>)}</div>
            <div className="mt-5 p-3 rounded-xl bg-[#F6FAF9] border border-[#DFECE8]"><p className="text-[10px] uppercase tracking-[.12em] font-bold text-[#147667]">Why recommended?</p><p className="text-xs text-[#4E6769] mt-1 leading-relaxed">{course.whyRecommended || `This course targets competencies required by your current role path.`}</p></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-[#E6EEEE]"><div className="text-xs text-[var(--muted-foreground)]"><span className="font-semibold text-[var(--winter-dark)]">{course.trainer}</span> · <Star className="w-3 h-3 inline fill-[#E7AD3F] text-[#E7AD3F]" /> {course.rating || 4.8} · {course.language || "English"}</div><div className="flex gap-2"><button className="btn-secondary py-2 px-3 text-sm" onClick={() => setSelected(course)}>Details</button>{course.status === "In Progress" ? <button className="btn-primary py-2 px-3 text-sm" onClick={() => setTab("learning")}>Continue</button> : <button className="btn-primary py-2 px-3 text-sm" onClick={() => enroll(course)}>Enroll</button>}</div></div>
          </div>
        ))}
      </div>
      {selected && <div className="fixed inset-0 z-[100] bg-[#071E22]/45 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={() => setSelected(null)}><div className="bg-white rounded-[24px] w-full max-w-2xl border border-white shadow-2xl p-6" onMouseDown={(e) => e.stopPropagation()}><div className="flex justify-between gap-4"><div><p className="cc-eyebrow">Course detail</p><h3 className="text-2xl font-semibold">{selected.title}</h3></div><Pill tone="teal">{selected.level}</Pill></div><p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-4">{selected.description}</p><div className="grid sm:grid-cols-3 gap-3 mt-5"><div className="cc-mini-metric"><span>Trainer</span><strong className="text-sm">{selected.trainer}</strong></div><div className="cc-mini-metric"><span>Duration</span><strong>{selected.durationHours || selected.durationWeeks}</strong></div><div className="cc-mini-metric"><span>Rating</span><strong>{selected.rating || 4.8}</strong></div></div><div className="mt-5"><p className="cc-eyebrow">Competencies developed</p><div className="flex flex-wrap gap-2 mt-2">{Object.keys(selected.requiredCompetencies).map((x) => <Pill key={x} tone="neutral">{x}</Pill>)}</div></div><InlineNotice tone="success"><span>{selected.whyRecommended || "This course is connected to your competency pathway."}</span></InlineNotice><div className="flex justify-end gap-3 mt-5"><button className="btn-secondary" onClick={() => setSelected(null)}>Close</button><button className="btn-primary" onClick={() => { setSelected(null); enroll(selected); }}>Enroll / Continue</button></div></div></div>}
    </div>
  );
}

function Assessments({ token, setTab }: { token?: string; setTab: (tab: TraineeTab) => void }) {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  if (showDiagnostic) return <DiagnosticFlow token={token} onCompleted={() => setTab("readiness")} />;
  return (
    <div>
      <SectionTitle eyebrow="Assess & verify" title="Assessment center" description="Baseline diagnostics identify what to build; course checkpoints and targeted reassessments verify whether the gap actually closed." />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="cc-card p-6 bg-[#0B2E33] text-white border-0 relative overflow-hidden"><div className="absolute -right-14 -top-16 w-52 h-52 rounded-full bg-[#159B8C]/20 blur-2xl" /><Pill tone="teal">Recommended</Pill><h3 className="text-white text-2xl font-semibold mt-5">Adaptive baseline / reassessment</h3><p className="text-white/70 text-sm leading-relaxed mt-3 max-w-lg">Questions change by domain, competency and evidence strength. Use this again after learning to verify improvement in the weak areas.</p><div className="grid grid-cols-3 gap-3 mt-6"><div className="cc-dark-metric"><span>Domain</span><strong>Marketing</strong></div><div className="cc-dark-metric"><span>Mode</span><strong>Adaptive</strong></div><div className="cc-dark-metric"><span>Evidence</span><strong>Live</strong></div></div><button className="btn-primary mt-6 bg-white !text-[#0B2E33] !shadow-none" onClick={() => setShowDiagnostic(true)}><BrainCircuit className="w-4 h-4" />Start adaptive assessment</button></div>
        <div className="cc-card p-6"><p className="cc-eyebrow">Course checkpoint</p><h3 className="text-xl font-semibold">{demoAssessments[0].title}</h3><p className="text-sm text-[var(--muted-foreground)] mt-2">Measures Marketing Analytics, Conversion Optimization and A/B Testing.</p><div className="grid grid-cols-3 gap-3 mt-5"><div className="cc-mini-metric"><span>Pass mark</span><strong>{demoAssessments[0].passMark}%</strong></div><div className="cc-mini-metric"><span>Questions</span><strong>{demoAssessments[0].questions.length}</strong></div><div className="cc-mini-metric"><span>Deadline</span><strong className="text-sm">24 Sep</strong></div></div><InlineNotice tone="info"><span>Low scores create a recovery branch; they do not permanently lower your capability profile.</span></InlineNotice><button className="btn-secondary w-full mt-5" onClick={()=>toast.info("Course checkpoint opened in demo mode. Use Adaptive Assessment for the live competency flow.")}><ClipboardCheck className="w-4 h-4" />Open checkpoint</button></div>
      </div>
    </div>
  );
}

function Passport({ token }: { token?: string }) {
  const [selected, setSelected] = useState(skillPassport[0]);
  const [remote, setRemote] = useState<any[]>([]);
  useEffect(() => { if (token) apiRequest<any>("/trainee/skill-passport/", {}, token).then((r) => { if (r.ok && r.data?.competencies) setRemote(r.data.competencies); }); }, [token]);
  const rows = remote.length ? remote.map((r) => ({ name: r.name, level: r.level, label: r.level >= 80 ? "Advanced" : r.level >= 65 ? "Intermediate" : "Developing", verified: r.verified, evidence: r.evidenceCount, fresh: r.lastVerified || "Recent" })) : skillPassport;
  return (
    <div>
      <SectionTitle eyebrow="Professional capability record" title="Skill Passport" description="A living evidence record of competencies, freshness, certificates and verification—not just a list of completed courses." />
      <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5">
        <div className="cc-card p-6"><div className="flex items-start justify-between gap-4"><div><p className="cc-eyebrow">Verified capability profile</p><h3 className="text-2xl font-semibold">Sameer Khan</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">Marketing Associate · Digital Outreach & Marketing</p></div><span className="w-14 h-14 rounded-2xl bg-[#EAF7F3] text-[#12806F] flex items-center justify-center"><Award className="w-6 h-6" /></span></div><div className="space-y-3 mt-6">{rows.map((row) => <button key={row.name} onClick={() => setSelected(row as any)} className={`w-full p-4 rounded-2xl border text-left transition ${selected.name === row.name ? "border-[#4F7C82] bg-[#F5FAF9]" : "border-[#E0E9EA]"}`}><div className="flex items-center justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{row.name}</strong>{row.verified && <Pill tone="teal">Verified</Pill>}</div><p className="text-xs text-[var(--muted-foreground)] mt-1">{row.label} · {row.evidence} evidence items · {row.fresh}</p></div><strong className="text-lg">{Math.round(row.level)}%</strong></div><div className="mt-3"><Bar value={row.level} tone={row.verified ? "teal" : "amber"} /></div></button>)}</div></div>
        <div className="cc-card p-6 self-start"><p className="cc-eyebrow">Evidence detail</p><h3 className="text-xl font-semibold">{selected.name}</h3><div className="grid grid-cols-3 gap-3 mt-5"><div className="cc-mini-metric"><span>Level</span><strong>{Math.round(selected.level)}%</strong></div><div className="cc-mini-metric"><span>Evidence</span><strong>{selected.evidence}</strong></div><div className="cc-mini-metric"><span>Status</span><strong className="text-sm">{selected.verified ? "Verified" : "Building"}</strong></div></div><div className="mt-6 space-y-3">{proofEvidence.map((e) => <div className="p-3 rounded-xl border border-[#E2EAEA]" key={e.label}><div className="flex justify-between gap-3"><span className="text-sm font-medium">{e.label}</span><strong className="text-sm">{e.score}</strong></div><p className="text-[11px] text-[var(--muted-foreground)] mt-1">{e.date} · {e.state}</p></div>)}</div><button className="btn-secondary w-full mt-5" onClick={()=>toast.info(`${selected.name}: ${selected.evidence} evidence items · latest verification ${selected.fresh}.`)}><FileCheck2 className="w-4 h-4" />View evidence timeline</button></div>
      </div>
    </div>
  );
}

export function Knowledge({ token, setTab }: { token?: string; setTab: (tab: any) => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const r = await apiRequest<{items: any[]}>("/knowledge/", {}, token);
          if (r.ok && r.data?.items) {
            if (mounted) {
              setItems(r.data.items);
              setLoading(false);
            }
            return;
          } else {
            throw new Error(r.error || "Failed to load knowledge items");
          }
        } else {
          throw new Error("No token provided");
        }
      } catch (err: any) {
        if (mounted) {
          console.warn("Falling back to demo knowledge data:", err);
          // Support older locally saved demo data without crashing
          setItems(knowledgeItems || []);
          setLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  const filtered = items.filter(item => {
    if (!query) return true;
    const q = query.toLowerCase();
    const titleMatch = item?.title?.toLowerCase()?.includes(q) ?? false;
    const compMatch = item?.competency?.toLowerCase()?.includes(q) ?? false;
    return titleMatch || compMatch;
  });

  const openSadie = () => {
    window.dispatchEvent(new Event("openSadie"));
  };

  return (
    <div>
      <SectionTitle eyebrow="Verified knowledge network" title="Knowledge Hub + Ask Capacity" description="Search approved internal learning resources. Ask Capacity answers from verified material and routes low-confidence questions to a human expert." />
      <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5">
        <div className="cc-card p-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#769093]" />
            <input className="cc-input pl-9 w-full" placeholder="Search verified knowledge" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {loading ? (
             <div className="py-10 text-center text-[var(--muted-foreground)] text-sm">Loading knowledge hub...</div>
          ) : error && items.length === 0 ? (
             <div className="py-10 text-center">
               <p className="text-[#9C3F3F] text-sm">Failed to load knowledge hub.</p>
               <button className="btn-secondary mt-3" onClick={() => window.location.reload()}>Retry</button>
             </div>
          ) : filtered.length === 0 ? (
             <div className="py-10 text-center text-[var(--muted-foreground)] text-sm">
               No verified resources found{query ? ` matching "${query}"` : ""}.
             </div>
          ) : (
            <div className="grid gap-3 mt-4">
              {filtered.map((item) => (
                <div className="rounded-2xl border border-[#E0E9EA] p-4" key={item?.id || Math.random()}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Pill tone="teal">Verified</Pill>
                      <Pill tone="neutral">{item?.type || "Resource"}</Pill>
                    </div>
                    <span className="text-[11px] text-[var(--muted-foreground)]">{item?.competency || "General"}</span>
                  </div>
                  <h3 className="font-semibold mt-3">{item?.title || "Untitled Resource"}</h3>
                  {item?.excerpt && <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">{item.excerpt}</p>}
                  <p className="text-xs text-[#59767A] mt-3">Source: {item?.author || "Unknown"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cc-card overflow-hidden self-start">
          <div className="p-5 bg-[#0B2E33] text-white">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><BrainCircuit className="w-5 h-5" /></span>
              <div>
                <p className="text-[10px] uppercase tracking-[.14em] text-[#B8E3E9] font-bold">Ask Capacity</p>
                <h3 className="text-white font-semibold">Meet Sadie</h3>
              </div>
            </div>
          </div>
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#E9F7F3] text-[#159B8C] flex items-center justify-center mb-4">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B2E33] mb-2">Your Grounded Learning Assistant</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
              Ask Sadie about skill gaps, course concepts, and role preparations. Sadie provides answers sourced directly from the verified Knowledge Hub.
            </p>
            <button className="btn-primary w-full max-w-xs" onClick={openSadie}>
              <MessageSquareText className="w-4 h-4 mr-2" />
              Chat with Sadie
            </button>
            <button className="btn-secondary w-full max-w-xs mt-3" onClick={() => setTab("mentor")}>
              <UserRoundCheck className="w-4 h-4 mr-2" />
              Ask a human expert instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Certificates() {
  const achieved = [
    { id: "CC-2026-00124", title: "Digital Marketing Fundamentals", issuedTo: "Sameer Khan", issueDate: "12 Aug 2026", evidence: 4, competencies: ["Marketing Fundamentals", "Customer Understanding", "Content Strategy"], status: "Valid" }
  ];

  const available = [
    { title: "Advanced Performance Marketing", evidenceRequired: 10, currentEvidence: 6, skills: ["Paid Advertising", "Marketing Analytics", "Attribution Modeling"] },
    { title: "Growth & Optimization Expert", evidenceRequired: 8, currentEvidence: 3, skills: ["A/B Testing", "Conversion Optimization"] }
  ];

  return (
    <div>
      <SectionTitle eyebrow="Verified credentials" title="Certificates & verification" description="Certificates remain connected to the competencies and evidence they represent." />
      
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div>
          <p className="cc-eyebrow mb-4 text-[#0B2E33]">Achieved Certificates</p>
          <div className="space-y-4">
            {achieved.map(cert => (
              <div key={cert.id} className="cc-card p-6 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#E8F7F3]" />
                <div className="relative">
                  <Pill tone="teal">{cert.status}</Pill>
                  <p className="cc-eyebrow mt-4 text-[#4F7C82]">Capacity Connect Certificate</p>
                  <h2 className="text-xl font-semibold tracking-tight">{cert.title}</h2>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">Issued to <strong>{cert.issuedTo}</strong> · ID {cert.id}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 border-t border-[#E0E9EA] pt-4">
                    <div><span className="text-[10px] text-[var(--muted-foreground)] block">Issued</span><strong className="text-xs">{cert.issueDate}</strong></div>
                    <div><span className="text-[10px] text-[var(--muted-foreground)] block">Evidence</span><strong className="text-xs">{cert.evidence} artifacts</strong></div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-[10px] uppercase font-semibold text-[#4F7C82] mb-1.5">Verified Competencies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.competencies.map(c => <Pill key={c} tone="neutral">{c}</Pill>)}
                    </div>
                  </div>
                  
                  <button className="btn-primary mt-5 text-sm w-full justify-center" onClick={()=>toast.success(`Credential ${cert.id} is valid in this seeded prototype.`)}>
                    <FileCheck2 className="w-4 h-4" /> Verify credential
                  </button>
                  <p className="text-[10px] text-center text-[#7C9799] mt-3">This is a sample credential (Demo Data)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="cc-eyebrow mb-4 text-[#0B2E33]">Available Certificates</p>
          <div className="space-y-4">
            {available.map((cert, index) => {
              const progressPercent = Math.round((cert.currentEvidence / cert.evidenceRequired) * 100);
              return (
                <div key={index} className="cc-card p-6">
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Requires evidence across mapped skills.</p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] uppercase font-semibold text-[var(--muted-foreground)]">Evidence Progress</span>
                      <span className="text-xs font-semibold">{cert.currentEvidence} / {cert.evidenceRequired}</span>
                    </div>
                    <Bar value={progressPercent} tone={progressPercent >= 50 ? "amber" : "blue"} />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#E0E9EA]">
                    <p className="text-[10px] uppercase font-semibold text-[#4F7C82] mb-1.5">Required Competencies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map(c => <Pill key={c} tone="neutral">{c}</Pill>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile({ profile }: { profile: UserProfile }) {
  return (
    <div>
      <SectionTitle eyebrow="Professional profile" title="Your capacity profile" description="Professional information helps Capacity Connect select the right domain, competency matrix and mentor context." />

      <div className="grid xl:grid-cols-[.8fr_1.2fr] gap-5"><div className="cc-card p-6"><div className="w-16 h-16 rounded-2xl bg-[#EAF5F4] text-[#0B2E33] flex items-center justify-center font-bold text-xl">{profile.name.split(" ").map((x) => x[0]).slice(0,2).join("")}</div><h3 className="text-xl font-semibold mt-4">{profile.name}</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">{profile.designation}</p><div className="space-y-3 mt-6">{[["Employee ID", profile.employeeId],["Department", profile.department],["Domain", profile.domain || "Marketing"],["Experience", `${profile.experienceYears} years`],["Qualification", profile.qualification],["Language", profile.preferredLanguage || "Hindi / English"]].map(([a,b]) => <div className="flex justify-between gap-4 text-sm" key={a}><span className="text-[var(--muted-foreground)]">{a}</span><strong className="text-right">{b}</strong></div>)}</div></div><div className="cc-card p-6"><p className="cc-eyebrow">Declared interests</p><div className="flex flex-wrap gap-2 mt-3">{profile.interests.map((x) => <Pill key={x} tone="neutral">{x}</Pill>)}</div><p className="cc-eyebrow mt-7">Current skills</p><div className="flex flex-wrap gap-2 mt-3">{profile.skills.map((x) => <Pill key={x} tone="teal">{x}</Pill>)}</div><p className="cc-eyebrow mt-7">Certificates</p><div className="space-y-2 mt-3">{profile.certificates.map((x) => <div className="p-3 rounded-xl border border-[#E0E9EA] flex items-center gap-3" key={x}><Award className="w-4 h-4 text-[#4F7C82]" /><span className="text-sm font-medium">{x}</span></div>)}</div><InlineNotice tone="info"><span>Self-declared profile data helps with context, but verified competency scores come from evidence such as assessments, practice and expert validation.</span></InlineNotice></div></div>
    </div>
  );
}

function MyTeams({ token, profile }: { token?: string, profile: UserProfile }) {
  const [allTeams] = useState<Team[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("capacity_demo_teams");
        if (saved) return JSON.parse(saved);
      } catch(e) {}
    }
    return demoTeams;
  });
  const [invitations, setInvitations] = useState<TeamInvitation[]>(demoTeamInvitations.filter(i => i.userId === profile.id && i.status === "pending"));
  const [requests, setRequests] = useState<MembershipRequest[]>(demoMembershipRequests.filter(r => r.userId === profile.id));
  const [myTeams, setMyTeams] = useState<Team[]>(allTeams.filter(t => (t.members || []).find(m => m.userId === profile.id)));
  const [joinTeamId, setJoinTeamId] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleAccept = (invId: number) => {
    setInvitations(prev => prev.filter(i => i.id !== invId));
    toast.success("Invitation accepted. You are now part of the team.");
    // In a real app, this would refresh the `myTeams` list.
  };

  const handleDecline = (invId: number) => {
    setInvitations(prev => prev.filter(i => i.id !== invId));
    toast.info("Invitation declined.");
  };

  const handleRequestJoin = () => {
    if (!joinTeamId) {
      toast.error("Please select or enter a team to join.");
      return;
    }
    const newRequest: MembershipRequest = {
      id: Date.now(),
      teamId: Number(joinTeamId),
      userId: profile.id,
      userName: profile.name,
      userSkills: [{ name: "Requested Skill", level: 50 }],
      status: "pending",
      requestedAt: new Date().toISOString(),
      message: joinMessage
    };
    setRequests(prev => [...prev, newRequest]);
    toast.success("Membership request sent. Waiting for admin approval.");
    setShowJoinForm(false);
  };

  return (
    <div>
      <SectionTitle eyebrow="Collaboration" title="My Teams" description="Join specialized teams and training cohorts aligned with your skill development." action={<button className="btn-primary" onClick={() => setShowJoinForm(true)}><Plus className="w-4 h-4"/>Join Team</button>} />
      
      {showJoinForm && (
        <div className="cc-card p-6 mb-5 border border-[#4F7C82]">
          <h3 className="text-lg font-semibold mb-4">Request to Join a Team</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="cc-label block">Select Team</label>
              <select className="cc-select w-full mt-2" value={joinTeamId} onChange={e => setJoinTeamId(e.target.value)}>
                <option value="">Select a team...</option>
                {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="cc-label block">Message (Optional)</label>
              <input className="cc-input w-full mt-2" value={joinMessage} onChange={e => setJoinMessage(e.target.value)} placeholder="Why are you joining?" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="btn-secondary" onClick={() => setShowJoinForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleRequestJoin}>Submit Request</button>
          </div>
        </div>
      )}

      {invitations.length > 0 && (
        <div className="mb-6">
          <p className="cc-eyebrow">Pending Invitations</p>
          <div className="grid lg:grid-cols-2 gap-4 mt-3">
            {invitations.map(inv => (
              <div key={inv.id} className="p-4 rounded-xl border border-[#DCE7E8] bg-[#FAFCFC]">
                <strong className="text-sm block">{inv.teamName}</strong>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Invited as: {inv.role}</p>
                <div className="flex gap-2 mt-4">
                  <button className="btn-secondary py-1 text-xs" onClick={() => handleDecline(inv.id)}>Decline</button>
                  <button className="btn-primary py-1 text-xs" onClick={() => handleAccept(inv.id)}>Accept</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length > 0 && (
        <div className="mb-6">
          <p className="cc-eyebrow">My Membership Requests</p>
          <div className="grid lg:grid-cols-2 gap-4 mt-3">
            {requests.map(req => (
              <div key={req.id} className="p-4 rounded-xl border border-[#DCE7E8]">
                <div className="flex items-center justify-between">
                  <strong className="text-sm">{allTeams.find(t => t.id === req.teamId)?.name || `Team #${req.teamId}`}</strong>
                  <Pill tone={req.status === 'pending' ? 'amber' : req.status === 'approved' ? 'teal' : 'red'}>{req.status}</Pill>
                </div>
                {req.message && <p className="text-xs text-[var(--muted-foreground)] italic mt-2">"{req.message}"</p>}
                <p className="text-[10px] text-[var(--muted-foreground)] mt-2">Requested on {new Date(req.requestedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="cc-eyebrow">Active Teams</p>
      <div className="grid lg:grid-cols-2 gap-4 mt-3">
        {myTeams.length > 0 ? myTeams.map(team => (
          <div className="cc-card p-5" key={team.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="cc-icon-tile"><Network className="w-5 h-5"/></span>
              <Pill tone="teal">{team.mode}</Pill>
            </div>
            <h3 className="text-lg font-semibold mt-4">{team.name}</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{team.purpose}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Members ({team.members.length})</p>
              <div className="flex flex-wrap gap-2">
                {team.members.slice(0,5).map(m => <span key={m.id} className="w-8 h-8 rounded-full bg-[#EEF5F5] text-[#4F7C82] flex items-center justify-center text-[10px] font-bold" title={m.name}>{m.name.substring(0,2)}</span>)}
                {team.members.length > 5 && <span className="w-8 h-8 rounded-full bg-[#F0F4F4] text-[#5A7376] flex items-center justify-center text-[10px] font-bold">+{team.members.length - 5}</span>}
              </div>
            </div>
          </div>
        )) : <p className="text-sm text-[var(--muted-foreground)]">You are not a member of any teams yet.</p>}
      </div>
    </div>
  );
}

function Opportunities({ profile }: { profile: UserProfile }) {
  const [applications, setApplications] = useState<RoleApplication[]>(demoRoleApplications.filter(a => a.userId === profile.id));
  const mySuggestions = demoRoleSuggestions.filter(s => s.traineeId === profile.id);
  
  const handleApply = (opp: Opportunity) => {
    if (applications.find(a => a.opportunityId === opp.id)) {
      toast.error("You have already applied for this opportunity.");
      return;
    }
    const newApp: RoleApplication = {
      id: Date.now(),
      userId: profile.id,
      opportunityId: opp.id,
      status: "applied",
      appliedAt: new Date().toISOString()
    };
    setApplications([...applications, newApp]);
    demoRoleApplications.push(newApp); // local persist
    toast.success(`Application submitted for ${opp.title}`);
  };

  const achieved = [
    { title: "Digital Marketing Placement", date: "2025-06-01", type: "Placement", department: "Marketing" }
  ];

  return (
    <div>
      <SectionTitle eyebrow="Roles & Opportunities" title="Next steps in your career" description="Discover internships and placements matching your skills, track your applications, and see trainer recommendations." />
      
      {mySuggestions.length > 0 && (
        <div className="mb-10">
          <p className="cc-eyebrow">Trainer Career Guidance</p>
          <div className="grid lg:grid-cols-2 gap-5 mt-3">
            {mySuggestions.map(s => (
              <div className="cc-card p-5 border border-[#4F7C82]" key={s.id}>
                <div className="flex items-start justify-between">
                  <span className="cc-icon-tile bg-[#EAF7F3] text-[#13806F]"><Briefcase className="w-5 h-5"/></span>
                  <span className="text-xs text-[var(--muted-foreground)]">Suggested by {s.trainerName}</span>
                </div>
                <h3 className="text-lg font-semibold mt-4">{s.suggestedRole}</h3>
                <p className="text-sm text-[#425B5E] mt-2 italic">"{s.explanation}"</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-xs font-semibold block mb-2 text-[#0B2E33]">Current Strengths</strong>
                    <ul className="text-xs text-[var(--muted-foreground)] space-y-1 list-disc pl-4">
                      {s.strengths.map(st => <li key={st}>{st}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-xs font-semibold block mb-2 text-[#C85747]">Gaps to Close</strong>
                    <ul className="text-xs text-[var(--muted-foreground)] space-y-1 list-disc pl-4">
                      {s.gaps.map(g => <li key={g}>{g}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E0E9EA]">
                  <strong className="text-xs font-semibold block mb-2">Preparation Resources</strong>
                  <div className="space-y-2">
                    {s.preparationResources.map(prep => (
                      <div key={prep} className="flex items-center gap-2 text-xs bg-[#F7FAFA] p-2 rounded-lg">
                        <BookOpenIcon className="w-3 h-3 text-[#4F7C82]" />
                        <span>{prep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <p className="cc-eyebrow">Available Opportunities</p>
          <div className="grid gap-4 mt-3">
            {demoOpportunities.map(opp => {
              const hasApplied = applications.some(a => a.opportunityId === opp.id);
              const matchedSkills = opp.requirements.filter(r => profile.skills.includes(r));
              const missingSkills = opp.requirements.filter(r => !profile.skills.includes(r));

              return (
                <div className="cc-card p-6" key={opp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{opp.title}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">{opp.department} · {opp.type}</p>
                    </div>
                    {hasApplied && <Pill tone="blue">Application in progress</Pill>}
                  </div>
                  <p className="text-sm mt-3 text-[#425B5E]">{opp.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-[#E0E9EA] grid sm:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-xs text-[#0B2E33] mb-2 block">Matched Requirements</strong>
                      {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {matchedSkills.map(s => <Pill key={s} tone="teal">{s}</Pill>)}
                        </div>
                      ) : <span className="text-xs text-[var(--muted-foreground)]">None yet</span>}
                    </div>
                    <div>
                      <strong className="text-xs text-[#C85747] mb-2 block">Missing Requirements</strong>
                      {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {missingSkills.map(s => <Pill key={s} tone="neutral">{s}</Pill>)}
                        </div>
                      ) : <span className="text-xs text-[var(--muted-foreground)]">None - fully qualified!</span>}
                    </div>
                  </div>
                  
                  <div className="mt-5 flex gap-3">
                    <button 
                      className="btn-primary" 
                      onClick={() => handleApply(opp)}
                      disabled={hasApplied}
                    >
                      {hasApplied ? "Applied" : "Apply now"}
                    </button>
                    {missingSkills.length > 0 && (
                      <button className="text-sm font-semibold text-[#0D766A] hover:underline" onClick={() => toast.info("Navigating to missing prerequisites learning path...")}>
                        Complete missing prerequisites
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="cc-card p-5 bg-[#FAFCFC]">
            <p className="cc-eyebrow">Applications in Progress</p>
            {applications.length > 0 ? (
              <div className="space-y-3 mt-3">
                {applications.map(app => {
                  const opp = demoOpportunities.find(o => o.id === app.opportunityId);
                  if (!opp) return null;
                  return (
                    <div key={app.id} className="p-3 bg-white border border-[#E0E9EA] rounded-xl text-sm">
                      <strong className="block">{opp.title}</strong>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-[var(--muted-foreground)] uppercase">{app.status}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">{new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted-foreground)] mt-3">No active applications.</p>
            )}
          </div>

          <div className="cc-card p-5">
            <p className="cc-eyebrow">Achieved Outcomes</p>
            <div className="space-y-3 mt-3">
              {achieved.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF5F4] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#159B8C]" />
                  </div>
                  <div>
                    <strong className="text-sm block">{a.title}</strong>
                    <p className="text-xs text-[var(--muted-foreground)]">{a.type} · {new Date(a.date).getFullYear()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TraineeWorkspace({ profile, token, activeTab, setActiveTab }: { profile: UserProfile; token?: string; activeTab: TraineeTab; setActiveTab: (tab: TraineeTab) => void }) {
  if (activeTab === "overview") return <Overview profile={profile} token={token} setTab={setActiveTab} />;
  if (activeTab === "assessment") return <Assessments token={token} setTab={setActiveTab} />;
  if (activeTab === "readiness") return <Readiness token={token} setTab={setActiveTab} />;
  if (activeTab === "learning") return <Learning token={token} setTab={setActiveTab} />;
  if (activeTab === "courses") return <Courses token={token} setTab={setActiveTab} />;
  if (activeTab === "mentor") return <MentorMarketplace token={token} />;
  if (activeTab === "passport") return <Passport token={token} />;
  if (activeTab === "knowledge") return <Knowledge token={token} setTab={setActiveTab} />;
  if (activeTab === "certificates") return <Certificates />;
  if (activeTab === "teams") return <MyTeams token={token} profile={profile} />;
  if (activeTab === "community") return <CommunityLayout profile={profile} />;
  if (activeTab === "opportunities") return <Opportunities profile={profile} />;
  return <Profile profile={profile} />;
}
