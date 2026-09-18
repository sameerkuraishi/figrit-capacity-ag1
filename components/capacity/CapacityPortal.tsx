"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  ClipboardCheck,
  GraduationCap,
  Library,
  LogOut,
  Menu,
  MessageSquareText,
  MessageCircle,
  Network,
  Route,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  UserCog,
  UserRoundCheck,
  Users,
  WandSparkles,
  X,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { login as apiLogin, register as apiRegister } from "@/lib/capacity-api";
import { demoUsers } from "@/lib/capacity-demo";
import type { UserProfile, UserRole } from "@/lib/capacity-types";
import TraineeWorkspace, { type TraineeTab } from "./TraineeWorkspace";
import TrainerWorkspace, { type TrainerTab } from "./TrainerWorkspace";
import AdminWorkspace, { type AdminTab } from "./AdminWorkspace";
import SadieChat from "./SadieChat";

export type AnyTab = TraineeTab | TrainerTab | AdminTab;
import { CheckItem, Pill } from "./ui";
import LandingRoleCards from "./LandingRoleCards";
import { demoLandingSnapshot, type LandingSnapshot } from "@/lib/landing-demo";

type PortalScreen = "landing" | "auth" | "workspace";
type IconType = React.ComponentType<{ className?: string }>;
type NavItem = { id: AnyTab; label: string; icon: IconType; group?: string };

const roleNav: Record<UserRole, NavItem[]> = {
  trainee: [
    { id: "overview", label: "Home", icon: Activity },
    { id: "assessment", label: "Assessments", icon: ClipboardCheck },
    { id: "readiness", label: "My Readiness", icon: Target },
    { id: "learning", label: "Learning Path", icon: Route },
    { id: "courses", label: "Explore Learning", icon: BookOpen },
    { id: "mentor", label: "Mentor Sessions", icon: UserRoundCheck },
    { id: "passport", label: "Skill Passport", icon: ShieldCheck },
    { id: "knowledge", label: "Knowledge Hub", icon: Library },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "teams", label: "My Teams", icon: Users },
    { id: "opportunities", label: "Roles & Opportunities", icon: Briefcase },
    { id: "community", label: "Community", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: CircleUserRound },
  ],
  trainer: [
    { id: "overview", label: "Dashboard", icon: Activity },
    { id: "sessions", label: "Mentor Sessions", icon: CalendarDays },
    { id: "learners", label: "Learners", icon: Users },
    { id: "courses", label: "Course Studio", icon: BookOpen },
    { id: "assessments", label: "Assessment Studio", icon: ClipboardCheck },
    { id: "library", label: "Trainer Library", icon: Library },
    { id: "knowledge", label: "Knowledge Hub", icon: Library },
    { id: "impact", label: "Competency Impact", icon: BarChart3 },
    { id: "community", label: "Community", icon: MessageCircle },
    { id: "experts", label: "Expert Connect", icon: CircleUserRound },
  ],
  admin: [
    { id: "overview", label: "Command Center", icon: Activity, group: "Overview" },
    { id: "pulse", label: "Capacity Pulse", icon: BarChart3, group: "Capacity" },
    { id: "coverage", label: "Coverage Shield", icon: ShieldAlert, group: "Capacity" },
    { id: "bridge", label: "Capacity Bridge", icon: Network, group: "Capacity" },
    { id: "simulator", label: "Intervention Simulator", icon: WandSparkles, group: "Capacity" },
    { id: "cohorts", label: "Smart Cohorts", icon: Users, group: "People" },
    { id: "approvals", label: "Approvals", icon: UserCheck, group: "People" },
    { id: "users", label: "Users & Roles", icon: UserCog, group: "People" },
    { id: "learning", label: "Learning Governance", icon: BookOpen, group: "Learning" },
    { id: "impact", label: "Training Impact", icon: BarChart3, group: "Intelligence" },
    { id: "announcements", label: "Announcements", icon: MessageSquareText, group: "Engagement" },
    { id: "community", label: "Community", icon: MessageCircle, group: "Engagement" },
    { id: "teams", label: "Teams", icon: Users, group: "People" },
    { id: "settings", label: "Rules & Settings", icon: Settings2, group: "Governance" },
  ],
};

const roleCopy: Record<UserRole, { title: string; description: string; email: string; accent: string }> = {
  trainee: {
    title: "Trainee",
    description: "Assess your capabilities, close exact gaps and book experts when human guidance helps.",
    email: "trainee@figr.it",
    accent: "#159B8C",
  },
  trainer: {
    title: "Trainer / Mentor",
    description: "Build competency-linked learning, mentor on demand and measure capability change.",
    email: "trainer@figr.it",
    accent: "#4F7C82",
  },
  admin: {
    title: "Admin",
    description: "Detect organizational capacity risk, connect expertise and verify intervention impact.",
    email: "admin@figr.it",
    accent: "#EF765B",
  },
};

function ProductLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-10 h-10 rounded-[14px] bg-[#0B2E33] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(11,46,51,.15)] shrink-0"><GraduationCap className="w-5 h-5" /></span>
      {!compact && <span className="min-w-0"><strong className="block text-[17px] leading-none tracking-[-.03em]">Capacity Connect</strong><small className="block text-[10px] text-[var(--muted-foreground)] mt-1 truncate">by FIGR.IT · SIH26075</small></span>}
    </div>
  );
}

function Landing({ onStart, snapshot = demoLandingSnapshot }: { onStart: (role: UserRole) => void; snapshot?: LandingSnapshot }) {
  return (
    <main className="cc-landing min-h-screen bg-[var(--winter-bg)] overflow-hidden">
      <a className="cc-skip-link" href="#platform">Skip to main content</a>
      <div className="cc-hero-mesh" />
      <header className="relative z-20 w-[min(1200px,92%)] mx-auto pt-5">
        <div className="cc-landing-nav">
          <ProductLogo />
          <nav aria-label="Product navigation" className="cc-landing-links"><a href="#platform">Platform</a><a href="#flow">How it works</a><a href="#intelligence">Capacity Intelligence</a><a href="#roles">Roles</a></nav>
          <div className="cc-landing-actions"><button className="btn-secondary hidden sm:inline-flex" onClick={() => onStart("trainee")}>Login</button><button className="btn-primary" onClick={() => onStart("trainee")}>Open prototype <ArrowRight className="w-4 h-4" /></button></div>
        </div>
      </header>

      <section id="platform" tabIndex={-1} aria-labelledby="platform-heading" className="relative z-10 w-[min(1200px,92%)] mx-auto pt-12 md:pt-20 pb-14 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <div className="flex flex-wrap gap-2"><Pill tone="teal">SIH26075</Pill><Pill tone="neutral">Organizational Capacity Intelligence</Pill></div>
          <h1 id="platform-heading" className="text-5xl sm:text-6xl xl:text-7xl leading-[1.05] font-bold tracking-tight mt-6 max-w-2xl">
            Build capability.<br />
            <span className="cc-text-gradient">Connect expertise.</span><br />
            Measure impact.
          </h1>
          <p className="text-lg text-[#5F777A] leading-relaxed mt-7 max-w-xl">Bring assessment, learning and expert support into one place. Identify the skills your organisation needs, help people close their gaps, and measure improvement through reassessment.</p>
          <div className="flex flex-wrap gap-3 mt-8"><button className="btn-primary px-6 py-3" onClick={() => onStart("trainee")}><Sparkles className="w-5 h-5" />Start trainee journey</button><button className="btn-secondary px-6 py-3" onClick={() => onStart("admin")}><BarChart3 className="w-5 h-5" />Open command center</button></div>
          <div className="grid grid-cols-3 gap-3 mt-9 pt-7 border-t border-[#DCE7E8]">
            <div><strong className="text-2xl tracking-[-.04em]">{snapshot.readiness}%</strong><p className="text-xs text-[var(--muted-foreground)] mt-1">Organisation readiness</p></div>
            {snapshot.metrics.filter(metric => metric.id === "competencies" || metric.id === "gaps").map(metric => <div key={metric.id}><strong className="text-2xl tracking-[-.04em]">{metric.value}</strong><p className="text-xs text-[var(--muted-foreground)] mt-1">{metric.label}</p></div>)}
          </div>
          <p className="cc-demo-caption mt-4">Illustrative demo data · Explore a sample organisation</p>
        </div>

        <div className="relative w-full max-w-[550px] mx-auto lg:max-w-none mt-8 lg:mt-0">
          <div className="cc-hero-panel relative z-10 w-full overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div><p className="cc-eyebrow">Demo capacity snapshot</p><h2 className="text-2xl font-semibold">Organizational Readiness</h2></div>
              <div className="text-right"><strong className="text-4xl tracking-[-.05em]">{snapshot.readiness}%</strong><p className="text-xs text-[#0D766A] mt-1">↑ {snapshot.improvement} pts · sample change</p></div>
            </div>
            <div className="mt-5 h-2.5 rounded-full bg-[#E6EEEE] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#4F7C82] to-[#159B8C]" style={{ width: `${snapshot.readiness}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {snapshot.metrics.map(metric => (
                <div className="cc-hero-mini" key={metric.id}>
                  <span>{metric.label}</span>
                  <strong className="text-[#0B2E33]">{metric.value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {snapshot.competencies.map(({ name, current, required }) => (
                <div key={name}>
                  <div className="flex justify-between gap-2 text-xs mb-2">
                    <span className="font-medium">{name}</span>
                    <span className="text-[var(--muted-foreground)]">{current}% · target {required}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#ECF1F1] overflow-hidden">
                    <div className="h-full rounded-full bg-[#159B8C]" style={{ width: `${current}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="relative z-10 w-[min(1200px,92%)] mx-auto py-12">
        <div className="cc-card p-6 md:p-8"><div className="text-center max-w-2xl mx-auto"><p className="cc-eyebrow">The core loop</p><h2 className="text-3xl md:text-4xl font-semibold tracking-[-.045em]">From assessment to verified improvement.</h2></div><div className="grid md:grid-cols-4 xl:grid-cols-7 gap-3 mt-8">{[["01","Assess"],["02","Identify gap"],["03","Guide"],["04","Learn"],["05","Connect expert"],["06","Reassess"],["07","Verify"]].map(([num,label],index)=><div key={label} className="relative p-4 rounded-2xl bg-[#F7FAFA] border border-[#E2EAEA]"><span className="text-[10px] font-bold text-[#789194]">{num}</span><strong className="block text-sm mt-5">{label}</strong>{index<6&&<ArrowRight className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3B3B5] z-10"/>}</div>)}</div></div>
      </section>

      <section id="intelligence" className="relative z-10 w-[min(1200px,92%)] mx-auto py-12 grid lg:grid-cols-3 gap-5">
        {[{icon:Target,title:"Adaptive competency diagnosis",copy:"Category-specific assessment adapts difficulty and maps evidence to the role competency matrix."},{icon:UserRoundCheck,title:"On-demand expert mentoring",copy:"Trainees book relevant experts for 20 or 30 minutes. Mentors add outcomes back into the learning plan."},{icon:ShieldAlert,title:"Organizational capacity risk",copy:"Capacity Pulse, Coverage Shield and Capacity Bridge turn individual evidence into admin decision support."}].map(({icon:Icon,title,copy})=><div className="cc-card p-6" key={title}><span className="cc-icon-tile"><Icon className="w-5 h-5"/></span><h3 className="text-xl font-semibold mt-5">{title}</h3><p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-2">{copy}</p></div>)}
      </section>

      <LandingRoleCards onStart={onStart} />
    </main>
  );
}

function Auth({ role, onBack, onAuthenticated }: { role: UserRole; onBack: () => void; onAuthenticated: (profile: UserProfile, token?: string) => void }) {
  const [selectedRole, setSelectedRole] = useState(role);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState(roleCopy[role].email);
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organization: "Ministry Capacity Demo Organization",
    department: "Digital Outreach & Marketing",
    designation: "Marketing Associate",
    qualification: "B.Tech / Graduate",
    experience: "1",
    domain: "Marketing",
  });

  function chooseRole(nextRole: UserRole) {
    setSelectedRole(nextRole);
    setEmail(mode === "login" ? roleCopy[nextRole].email : "");
  }

  function chooseMode(nextMode: "login" | "register") {
    const nextRole = nextMode === "register" && selectedRole === "admin" ? "trainee" : selectedRole;
    setMode(nextMode);
    setSelectedRole(nextRole);
    setEmail(nextMode === "login" ? roleCopy[nextRole].email : "");
  }

  async function submitLogin() {
    setLoading(true);
    const result = await apiLogin(email, password);
    setLoading(false);
    if (result.ok && result.data) {
      onAuthenticated(result.data.user as UserProfile, result.data.token);
      toast.success(`Signed in as ${(result.data.user as UserProfile).name}.`);
      return;
    }
    const fallback = demoUsers[selectedRole];
    toast.info("Sign-in was unavailable. Opening a demo workspace; no account has been authenticated.");
    onAuthenticated(fallback);
  }

  async function submitRegister() {
    if (selectedRole === "admin") {
      toast.error("Admin accounts are created by the organization, not public registration.");
      return;
    }
    if (!form.name.trim() || !email.trim() || password.length < 6) {
      toast.error("Enter your name, a valid email and a password with at least 6 characters.");
      return;
    }
    setLoading(true);
    const result = await apiRegister({
      name: form.name.trim(),
      email: email.trim(),
      password,
      role: selectedRole,
      organization: form.organization,
      department: form.department,
      designation: form.designation,
      qualification: form.qualification,
      experience_years: Number(form.experience || 0),
      domain: form.domain,
      preferred_language: "English",
    });
    setLoading(false);
    if (!result.ok || !result.data) {
      toast.error(result.error || "Registration is unavailable. Please try again when the account service is connected.");
      return;
    }
    if (result.data.pendingApproval) {
      toast.success("Trainer application submitted. An admin must approve it before login.");
      setMode("login");
      setEmail(email.trim());
      return;
    }
    if (result.data.token) {
      onAuthenticated(result.data.user as UserProfile, result.data.token);
      toast.success("Account created. Let’s build your baseline capability profile.");
    }
  }

  const submit = mode === "login" ? submitLogin : submitRegister;

  return (
    <main className="min-h-screen bg-[var(--winter-bg)] relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      <div className="cc-hero-mesh opacity-70" />
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-[.95fr_1.05fr] bg-white border border-white rounded-[30px] shadow-[0_25px_90px_rgba(11,46,51,.12)] overflow-hidden">
        <div className="bg-[#0B2E33] text-white p-8 md:p-10 relative overflow-hidden"><div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#159B8C]/20 blur-3xl"/><button className="text-xs text-white/60 hover:text-white" onClick={onBack}>← Back to product</button><div className="mt-10"><ProductLogo /></div><div className="mt-16 relative z-10"><Pill tone="teal">Judge-ready prototype</Pill><h1 className="text-white text-4xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.02] mt-5">Grow your skills.<br/>Build team capability.</h1><p className="text-white/65 text-sm leading-relaxed mt-5 max-w-md">Use the three demo roles to walk through the same evidence loop from different perspectives.</p><div className="space-y-4 mt-8"><CheckItem>Category-specific adaptive assessment</CheckItem><CheckItem>Skill gap → course → 20/30 min mentor → reassessment</CheckItem><CheckItem>Capacity Pulse, Coverage Shield & intervention simulation</CheckItem></div></div></div>
        <div className="p-6 md:p-10 max-h-[92vh] overflow-y-auto cc-scrollbar"><div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between gap-3"><p className="cc-eyebrow mb-0">{mode === "login" ? "Choose demo role" : "Create professional account"}</p><div className="flex rounded-xl border border-[#DFE8E9] p-1 bg-[#F8FAFA]"><button className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mode==="login"?"bg-white shadow-sm text-[#0B2E33]":"text-[#718789]"}`} onClick={()=>chooseMode("login")}>Login</button><button className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mode==="register"?"bg-white shadow-sm text-[#0B2E33]":"text-[#718789]"}`} onClick={()=>chooseMode("register")}>Register</button></div></div>
          <div className={`grid ${mode === "register" ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-3 mt-4`}>{(["trainee","trainer",...(mode === "login" ? ["admin"] : [])] as UserRole[]).map((r)=><button key={r} aria-pressed={selectedRole === r} onClick={()=>chooseRole(r)} className={`rounded-2xl border p-4 text-left transition ${selectedRole===r?"border-[#4F7C82] bg-[#F2F8F7]":"border-[#E0E9EA] hover:bg-[#FAFCFC]"}`}><span className="w-8 h-8 rounded-xl bg-[#EAF3F3] text-[#4F7C82] flex items-center justify-center">{r==="trainee"?<GraduationCap className="w-4 h-4"/>:r==="trainer"?<Users className="w-4 h-4"/>:<ShieldCheck className="w-4 h-4"/>}</span><strong className="block text-sm mt-3">{roleCopy[r].title}</strong><p className="text-[11px] text-[var(--muted-foreground)] mt-1">{r==="trainee"?"Learn & verify":r==="trainer"?"Guide & measure":"See & intervene"}</p></button>)}</div>

          <div className="mt-7"><h2 id="auth-heading" tabIndex={-1} className="text-3xl font-semibold tracking-[-.04em]">{mode === "login" ? "Welcome back." : selectedRole === "trainer" ? "Apply as an expert." : "Start your capacity profile."}</h2><p className="text-sm text-[var(--muted-foreground)] mt-2">{mode === "login" ? <>Demo credentials are prefilled. Password: <strong>demo123</strong></> : selectedRole === "trainer" ? "Trainer accounts stay pending until an admin verifies the application." : "Your first step after signup is the domain-specific baseline assessment."}</p></div>

          {mode === "register" && <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <div className="sm:col-span-2"><label htmlFor="signup-full-name" className="cc-label block">Full name</label><input id="signup-full-name" className="cc-input w-full mt-2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" /></div>
            <div><label htmlFor="signup-organization" className="cc-label block">Organization</label><input id="signup-organization" className="cc-input w-full mt-2" value={form.organization} onChange={e=>setForm({...form,organization:e.target.value})}/></div>
            <div><label htmlFor="signup-department" className="cc-label block">Department</label><input id="signup-department" className="cc-input w-full mt-2" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></div>
            <div><label htmlFor="signup-designation" className="cc-label block">Designation</label><input id="signup-designation" className="cc-input w-full mt-2" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}/></div>
            <div><label htmlFor="signup-qualification" className="cc-label block">Qualification</label><input id="signup-qualification" className="cc-input w-full mt-2" value={form.qualification} onChange={e=>setForm({...form,qualification:e.target.value})}/></div>
            <div><label htmlFor="signup-domain" className="cc-label block">Domain</label><select id="signup-domain" className="cc-select w-full mt-2" value={form.domain} onChange={e=>setForm({...form,domain:e.target.value})}><option>Marketing</option><option>Data & Analytics</option><option>Human Resources</option><option>IT & Digital</option><option>Operations</option><option>Meteorology</option></select></div>
            <div><label htmlFor="signup-experience" className="cc-label block">Experience (years)</label><input id="signup-experience" type="number" min="0" className="cc-input w-full mt-2" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})}/></div>
          </div>}

          <label htmlFor="auth-email" className="cc-label mt-5 block">Email</label><input id="auth-email" autoComplete="email" type="email" className="cc-input w-full mt-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@organization.org"/>
          <label htmlFor="auth-password" className="cc-label mt-4 block">Password</label><input id="auth-password" autoComplete={mode === "login" ? "current-password" : "new-password"} type="password" className="cc-input w-full mt-2" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter")submit()}}/>
          {mode === "login" && <button className="text-xs text-[#4F7C82] font-semibold mt-2" onClick={()=>toast.info("Password reset is intentionally disabled in the hackathon demo. In production this routes to a signed email reset flow.")}>Forgot password?</button>}
          <button className="btn-primary w-full mt-6 py-3" onClick={submit} disabled={loading}>{loading ? (mode === "login" ? "Signing in…" : "Creating account…") : mode === "login" ? `Continue as ${roleCopy[selectedRole].title}` : selectedRole === "trainer" ? "Submit trainer application" : "Create trainee account"}<ArrowRight className="w-4 h-4"/></button>
          <div className="mt-5 p-3 rounded-xl bg-[#F7FAFA] border border-[#E1EAEA] text-xs text-[var(--muted-foreground)]">{mode === "login" ? "If sign-in is unavailable, you can explore a demo workspace. Demo access does not authenticate an account or save shared organisational changes." : "Creating an account requires a connected account service. Demo access does not create an account."}</div>
        </div></div>
      </div>
    </main>
  );
}

function Sidebar({ profile, activeTab, setActiveTab, onLogout, mobileOpen, setMobileOpen }: { profile: UserProfile; activeTab: AnyTab; setActiveTab: (tab: AnyTab) => void; onLogout: () => void; mobileOpen: boolean; setMobileOpen: (value: boolean)=>void }) {
  const items = roleNav[profile.role];
  const groups = profile.role === "admin" ? Array.from(new Set(items.map((item) => item.group || "Menu"))) : ["Menu"];
  function renderItem(item: NavItem) {
    const Icon = item.icon;
    const active = item.id === activeTab;
    return <button key={item.id} aria-current={active ? "page" : undefined} onClick={()=>{setActiveTab(item.id);setMobileOpen(false)}} className={`cc-nav-item ${active?"cc-nav-active":""}`}><Icon className="w-[18px] h-[18px] shrink-0"/><span>{item.label}</span>{active&&<span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#159B8C]"/>}</button>;
  }
  return (
    <>
      {mobileOpen && <button className="fixed inset-0 z-40 bg-[#071E22]/35 lg:hidden" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"/>}
      <aside id="workspace-navigation" aria-label="Workspace navigation" className={`cc-sidebar ${mobileOpen?"translate-x-0":"-translate-x-full lg:translate-x-0 invisible lg:visible"}`}>
        <div className="px-4 py-5 flex items-center justify-between"><ProductLogo/><button aria-label="Close navigation" className="lg:hidden w-9 h-9 rounded-xl bg-[#F0F4F4] flex items-center justify-center" onClick={()=>setMobileOpen(false)}><X className="w-4 h-4"/></button></div>
        <div className="px-3 pb-3"><div className="cc-profile-chip"><span className="w-9 h-9 rounded-xl bg-[#E3F1EF] text-[#0B2E33] flex items-center justify-center text-xs font-bold shrink-0">{profile.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span><div className="min-w-0"><strong className="text-xs block truncate">{profile.name}</strong><p className="text-[10px] text-[var(--muted-foreground)] truncate mt-0.5">{roleCopy[profile.role].title} · {profile.department}</p></div><ChevronDown className="w-3.5 h-3.5 ml-auto text-[#789194]"/></div></div>
        <nav className="px-3 pb-4 flex-1 overflow-y-auto cc-scrollbar">
          {groups.map((group) => <div key={group} className="mb-3">{profile.role === "admin" && <p className="cc-nav-group">{group}</p>}{items.filter(item => profile.role !== "admin" || (item.group || "Menu") === group).map(renderItem)}</div>)}
        </nav>
        <div className="p-3 border-t border-[#E4ECEC]"><button className="cc-nav-item w-full" onClick={onLogout}><LogOut className="w-[18px] h-[18px]"/>Sign out</button></div>
      </aside>
    </>
  );
}

function Workspace({ profile, token, onLogout }: { profile: UserProfile; token?: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AnyTab>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sadieOpen, setSadieOpen] = useState(false);
  const currentLabel = useMemo(()=>roleNav[profile.role].find(x=>x.id===activeTab)?.label || "Workspace",[profile.role,activeTab]);

  useEffect(() => {
    const handleOpenSadie = () => setSadieOpen(true);
    window.addEventListener("openSadie", handleOpenSadie);
    return () => window.removeEventListener("openSadie", handleOpenSadie);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--winter-bg)] relative">
      <Sidebar profile={profile} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <div className="cc-workspace">
        <header className="cc-topbar">
          <div className="flex items-center gap-3">
            <button id="open-navigation" aria-label="Open navigation" aria-controls="workspace-navigation" aria-expanded={mobileOpen} className="lg:hidden w-9 h-9 rounded-xl border border-[#DCE7E8] bg-white flex items-center justify-center" onClick={()=>setMobileOpen(true)}><Menu className="w-4 h-4"/></button>
            <div>
              <p className="text-[10px] uppercase tracking-[.14em] text-[var(--muted-foreground)] font-semibold">{roleCopy[profile.role].title}</p>
              <h2 className="font-semibold text-sm">{currentLabel}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="cc-top-action hidden md:flex" onClick={() => setSadieOpen(true)}>
              <BrainCircuit className="w-4 h-4 text-[#159B8C]" />
              <span>Ask Sadie</span>
            </button>
            <button className="cc-top-action hidden md:flex" onClick={()=>toast.info("Global search covers courses, experts, competencies and verified knowledge in the full deployment.")}><Search className="w-4 h-4"/><span>Search</span><kbd>⌘K</kbd></button>
            <button aria-label="Notifications" className="w-10 h-10 rounded-xl border border-[#DCE7E8] bg-white flex items-center justify-center relative" onClick={()=>toast.info("Notifications: mentor clinic opened · competency evidence updated · new case pack available.")}><Bell className="w-4 h-4"/><span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#EF765B]"/></button>
          </div>
        </header>
        {!token && <div className="cc-demo-banner" role="status"><strong>Demo workspace</strong> · Sample data only. No account is authenticated; changes are not shared with other users.</div>}
        <div className="cc-workspace-content relative">
          {profile.role === "trainee" && <TraineeWorkspace profile={profile} token={token} activeTab={activeTab as TraineeTab} setActiveTab={(tab)=>setActiveTab(tab)} />}
          {profile.role === "trainer" && <TrainerWorkspace profile={profile} token={token} activeTab={activeTab as TrainerTab} setActiveTab={(tab)=>setActiveTab(tab)} />}
          {profile.role === "admin" && <AdminWorkspace profile={profile} token={token} activeTab={activeTab as AdminTab} setActiveTab={(tab)=>setActiveTab(tab)} />}
        </div>
      </div>
      
      {/* Global Floating Action Button for Sadie (Mobile & Desktop) */}
      {!sadieOpen && (
        <button 
          onClick={() => setSadieOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#0B2E33] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-40 group"
          aria-label="Ask Sadie"
        >
          <BrainCircuit className="w-6 h-6 group-hover:text-[#B8E3E9] transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#159B8C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#159B8C]"></span>
          </span>
        </button>
      )}

      {/* Sadie Chat Drawer */}
      {sadieOpen && (
        <SadieChat 
          token={token} 
          onClose={() => setSadieOpen(false)} 
          contextPage={activeTab}
        />
      )}
    </main>
  );
}

export default function CapacityPortal() {
  const [screen, setScreen] = useState<PortalScreen>("landing");
  const [role, setRole] = useState<UserRole>("trainee");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (screen === "auth") document.getElementById("auth-heading")?.focus({ preventScroll: true });
  }, [screen]);

  function begin(selected: UserRole) { setRole(selected); setScreen("auth"); }
  function authenticated(user: UserProfile, authToken?: string) { setProfile(user); setToken(authToken); setScreen("workspace"); }
  function logout() { setProfile(null); setToken(undefined); setScreen("landing"); toast.success("Signed out of the prototype."); }

  return <><Toaster richColors position="top-right"/>{screen === "landing" && <Landing onStart={begin}/>} {screen === "auth" && <Auth role={role} onBack={()=>setScreen("landing")} onAuthenticated={authenticated}/>} {screen === "workspace" && profile && <Workspace key={profile.role} profile={profile} token={token} onLogout={logout}/>}</>;
}
