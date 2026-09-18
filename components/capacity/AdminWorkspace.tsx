"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Gauge,
  GitBranch,
  Megaphone,
  Network,
  Plus,
  Route,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  UserRoundCheck,
  Users,
  WandSparkles,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/capacity-api";
import {
  capacityCells,
  cohortSuggestions,
  demoCourses,
  demoTrainerMatches,
  interventionOptions,
  pendingUsers,
  demoTeams,
  demoMembershipRequests,
  demoTeamInvitations,
  demoTrainees,
} from "@/lib/capacity-demo";
import type { CapacityCell, CohortSuggestion, TrainerMatch, UserProfile, Team, MembershipRequest, TeamInvitation, TeamMode } from "@/lib/capacity-types";
import { Bar, InlineNotice, Pill, SectionTitle, StatCard, StatusDot } from "./ui";
import { CommunityLayout } from "./CommunityLayout";

export type AdminTab = "overview" | "pulse" | "coverage" | "bridge" | "simulator" | "cohorts" | "approvals" | "users" | "learning" | "impact" | "announcements" | "settings" | "teams" | "community";

function Overview({ token, setTab }: { token?: string; setTab: (tab: AdminTab)=>void }) {
  const [metrics, setMetrics] = useState({ trainees: 74, trainers: 12, courses: 18, certificates: 126, organization_readiness: 72, critical_gaps: 18, mentor_sessions: 31 });
  useEffect(()=>{ if(token) apiRequest<any>("/admin/dashboard/",{},token).then(r=>{if(r.ok&&r.data?.metrics)setMetrics({...metrics,...r.data.metrics})}) },[token]);
  return <div>
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6"><div><p className="cc-eyebrow">Capacity command center</p><h1 className="text-[34px] md:text-[42px] font-semibold tracking-[-0.05em] leading-[1.03]">See where capability is strong—and where it is at risk.</h1><p className="text-sm text-[var(--muted-foreground)] mt-2">Organizational readiness → targeted intervention → verified improvement.</p></div><button className="btn-primary" onClick={()=>setTab("pulse")}><Activity className="w-4 h-4" />Open Capacity Pulse</button></div>
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5"><StatCard label="Org readiness" value={`${Math.round(metrics.organization_readiness)}%`} note="Across verified evidence" icon={<Gauge className="w-5 h-5" />} tone="warning"/><StatCard label="Active trainees" value={metrics.trainees} note="Across departments" icon={<Users className="w-5 h-5" />}/><StatCard label="Verified trainers" value={metrics.trainers} note="Available expertise" icon={<UserRoundCheck className="w-5 h-5" />}/><StatCard label="Critical capacity risks" value={metrics.critical_gaps} note="Require attention" icon={<ShieldAlert className="w-5 h-5" />} tone="critical"/></div>
    <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-5">
      <div className="cc-card p-6"><div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Capacity risk radar</p><h2 className="text-xl font-semibold">Priority organizational gaps</h2></div><button className="text-sm font-semibold text-[#315F66] flex items-center gap-1" onClick={()=>setTab("pulse")}>View heatmap <ChevronRight className="w-4 h-4"/></button></div><div className="space-y-4 mt-6">{capacityCells.filter(c=>c.risk!=="healthy").slice(0,5).map((c)=><button className="w-full text-left p-4 rounded-2xl border border-[#E0E9EA] hover:bg-[#FAFCFC]" key={`${c.unit}-${c.competency}`} onClick={()=>setTab("pulse")}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex gap-2 items-center"><StatusDot status={c.risk}/><strong className="text-sm">{c.unit}</strong></div><p className="text-xs text-[var(--muted-foreground)] mt-1 pl-4">{c.competency}</p></div><div className="text-right"><strong className="text-lg">{c.readiness}%</strong><p className="text-[10px] text-[var(--muted-foreground)]">Required {c.required}%</p></div></div><div className="mt-3"><Bar value={c.readiness} marker={c.required} tone={c.risk==="critical"?"coral":"amber"}/></div></button>)}</div></div>
      <div className="grid gap-5"><div className="cc-card p-6 bg-[#0B2E33] text-white border-0 relative overflow-hidden"><div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-[#159B8C]/20 blur-2xl"/><Pill tone="teal">Capacity alert</Pill><h3 className="text-white text-2xl font-semibold mt-5">Digital Outreach · Marketing Analytics</h3><p className="text-white/70 text-sm mt-2">Readiness is below requirement and verified backup expertise is thin.</p><div className="grid grid-cols-3 gap-3 mt-5"><div className="cc-dark-metric"><span>Readiness</span><strong>54%</strong></div><div className="cc-dark-metric"><span>Required</span><strong>80%</strong></div><div className="cc-dark-metric"><span>Backups</span><strong>0</strong></div></div><button className="btn-primary mt-5 bg-white !text-[#0B2E33] !shadow-none" onClick={()=>setTab("coverage")}>Investigate risk <ArrowRight className="w-4 h-4"/></button></div><div className="cc-card p-6"><p className="cc-eyebrow">Training impact</p><div className="flex items-end gap-3"><strong className="text-4xl tracking-[-.05em]">+21</strong><span className="text-sm text-[#0D766A] mb-1">readiness points</span></div><p className="text-sm text-[var(--muted-foreground)] mt-2">Demo cohort: baseline → course → mentor → reassessment.</p><button className="btn-secondary w-full mt-4" onClick={()=>setTab("impact")}>View impact evidence</button></div></div>
    </div>
  </div>
}

function Pulse({ token, setTab }: { token?:string; setTab:(tab:AdminTab)=>void }) {
  const [cells,setCells]=useState<CapacityCell[]>(capacityCells);
  const [selected,setSelected]=useState<CapacityCell>(capacityCells[0]);
  useEffect(()=>{if(token)apiRequest<{cells:CapacityCell[]}>("/admin/capacity-pulse/",{},token).then(r=>{if(r.ok&&r.data?.cells?.length){setCells(r.data.cells);setSelected(r.data.cells.sort((a,b)=>a.readiness-b.readiness)[0])}})},[token]);
  const units=useMemo(()=>Array.from(new Set(cells.map(c=>c.unit))),[cells]);
  const comps=useMemo(()=>Array.from(new Set(cells.map(c=>c.competency))),[cells]);
  const color=(c?:CapacityCell)=>!c?"bg-[#F4F7F7]":c.risk==="critical"?"bg-[#FCE9E8] text-[#A53F3F] border-[#F1C1BE]":c.risk==="attention"?"bg-[#FFF5DD] text-[#8C651A] border-[#ECD9A7]":"bg-[#EAF7F3] text-[#126B60] border-[#C7E7DC]";
  return <div><SectionTitle eyebrow="Organizational intelligence" title="Capacity Pulse" description="A live heatmap of department × competency readiness. Click any cell to see coverage, evidence and intervention options." />
    <div className="grid xl:grid-cols-[1.2fr_.8fr] gap-5"><div className="cc-card p-5 overflow-x-auto"><div className="min-w-[720px]"><div className="grid gap-2" style={{gridTemplateColumns:`190px repeat(${comps.length}, minmax(150px,1fr))`}}><div/><>{comps.map(c=><div key={c} className="px-3 py-2 text-xs font-semibold text-center text-[#5A7376]">{c}</div>)}</>{units.map(unit=><div key={unit} className="contents"><div className="px-3 py-4 rounded-xl bg-[#F7FAFA] text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-[#6C878A]"/>{unit}</div>{comps.map(comp=>{const cell=cells.find(c=>c.unit===unit&&c.competency===comp);return <button key={`${unit}-${comp}`} onClick={()=>cell&&setSelected(cell)} className={`rounded-xl border px-3 py-3 text-center transition hover:-translate-y-0.5 ${color(cell)} ${selected?.unit===unit&&selected?.competency===comp?"ring-2 ring-[#4F7C82]/30":""}`}><strong className="text-lg">{cell?`${Math.round(cell.readiness)}%`:'—'}</strong><p className="text-[10px] mt-1 opacity-80">{cell?cell.risk:'No data'}</p></button>})}</div>)}</div></div><div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-[#E6EEEE] text-xs text-[var(--muted-foreground)]"><span className="flex items-center gap-2"><StatusDot status="healthy"/>Healthy</span><span className="flex items-center gap-2"><StatusDot status="attention"/>Attention</span><span className="flex items-center gap-2"><StatusDot status="critical"/>Critical</span></div></div>
      <div className="cc-card p-6 self-start"><div className="flex items-start justify-between gap-4"><div><p className="cc-eyebrow">Drill-down</p><h3 className="text-xl font-semibold">{selected.unit}</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">{selected.competency}</p></div><Pill tone={selected.risk==="critical"?"red":selected.risk==="attention"?"amber":"teal"}>{selected.risk.toUpperCase()}</Pill></div><div className="mt-5"><div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-2"><span>Current {Math.round(selected.readiness)}%</span><span>Required {selected.required}%</span></div><Bar value={selected.readiness} marker={selected.required} tone={selected.risk==="critical"?"coral":selected.risk==="attention"?"amber":"teal"}/></div><div className="grid grid-cols-2 gap-3 mt-5"><div className="cc-mini-metric"><span>Qualified people</span><strong>{selected.qualified}/{selected.total}</strong></div><div className="cc-mini-metric"><span>Verified trainers</span><strong>{selected.trainers}</strong></div><div className="cc-mini-metric"><span>Backup experts</span><strong>{selected.backups}</strong></div><div className="cc-mini-metric"><span>Gap</span><strong>{Math.max(0,Math.round(selected.required-selected.readiness))} pts</strong></div></div>{selected.risk!=="healthy"&&<InlineNotice tone={selected.risk==="critical"?"danger":"warning"}><span>This competency needs targeted capacity-building attention. Inspect dependency risk before assigning training.</span></InlineNotice>}<div className="grid grid-cols-2 gap-3 mt-5"><button className="btn-secondary" onClick={()=>setTab("coverage")}>Coverage Shield</button><button className="btn-primary" onClick={()=>setTab("simulator")}>Simulate action</button></div></div></div>
  </div>
}

function Coverage({ token, setTab }: { token?:string; setTab:(tab:AdminTab)=>void }) {
  const [data,setData]=useState({competency:"Marketing Analytics",experts:1,intermediate:3,trainees:18,backupExperts:0,risk:"Critical",message:"Capability depends heavily on too few verified experts.",potentialSuccessors:[{name:"Pooja Singh",readiness:74},{name:"Karan Mehta",readiness:71},{name:"Sameer Khan",readiness:68}]});
  useEffect(()=>{if(token)apiRequest<any>("/admin/coverage-shield/?competency=Marketing%20Analytics",{},token).then(r=>{if(r.ok&&r.data)setData(r.data)})},[token]);
  return <div><SectionTitle eyebrow="Dependency risk" title="Coverage Shield" description="Detect critical competencies that depend on too few verified experts, then build backup capability before the expertise becomes a bottleneck." />
    <div className="grid xl:grid-cols-[.9fr_1.1fr] gap-5"><div className="cc-card p-6 bg-[#0B2E33] text-white border-0"><div className="flex justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.14em] text-[#B8E3E9] font-bold">Critical competency</p><h3 className="text-white text-2xl font-semibold mt-1">{data.competency}</h3></div><span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><ShieldAlert className="w-5 h-5"/></span></div><div className="grid grid-cols-2 gap-3 mt-6"><div className="cc-dark-metric"><span>Verified experts</span><strong>{data.experts}</strong></div><div className="cc-dark-metric"><span>Backup experts</span><strong>{data.backupExperts}</strong></div><div className="cc-dark-metric"><span>Intermediate</span><strong>{data.intermediate}</strong></div><div className="cc-dark-metric"><span>Learners</span><strong>{data.trainees}</strong></div></div><div className="mt-5 p-4 rounded-xl bg-[#EF765B]/12 border border-[#EF765B]/30 text-sm text-white/85"><strong className="text-white">{data.risk} coverage risk.</strong><p className="mt-1">{data.message}</p></div><button className="btn-primary bg-white !text-[#0B2E33] !shadow-none w-full mt-5" onClick={()=>setTab("bridge")}>Find available expertise <ArrowRight className="w-4 h-4"/></button></div>
      <div className="cc-card p-6"><div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Build backup capability</p><h3 className="text-xl font-semibold">Potential internal successors</h3></div><Pill tone="amber">Recommended candidates</Pill></div><p className="text-sm text-[var(--muted-foreground)] mt-2">Candidates are ranked by current evidence and proximity to the competency threshold. Admin reviews before enrollment.</p><div className="space-y-3 mt-5">{data.potentialSuccessors.map((p:any,index:number)=><div className="p-4 rounded-2xl border border-[#E0E9EA] flex items-center justify-between gap-4" key={p.name}><div className="flex gap-3 items-center"><span className="w-9 h-9 rounded-xl bg-[#EFF5F5] flex items-center justify-center text-xs font-bold">{index+1}</span><div><strong className="text-sm">{p.name}</strong><p className="text-xs text-[var(--muted-foreground)] mt-1">Current readiness evidence</p></div></div><div className="w-32"><div className="flex justify-between text-xs mb-1"><span>{Math.round(p.readiness)}%</span></div><Bar value={p.readiness}/></div></div>)}</div><div className="grid sm:grid-cols-2 gap-3 mt-5"><button className="btn-secondary" onClick={()=>setTab("cohorts")}>Create backup cohort</button><button className="btn-primary" onClick={()=>toast.success("Succession learning path drafted for admin review.")}>Create succession path</button></div></div></div>
  </div>
}

function Bridge({ token, setTab }: {token?:string;setTab:(tab:AdminTab)=>void}) {
  const [experts,setExperts]=useState<TrainerMatch[]>(demoTrainerMatches);
  const [unit,setUnit]=useState("Digital Outreach & Marketing");
  useEffect(()=>{if(token)apiRequest<any>("/admin/capacity-bridge/?competency=Marketing%20Analytics",{},token).then(r=>{if(r.ok&&r.data){setExperts(r.data.recommendedExperts||demoTrainerMatches);setUnit(r.data.deficitUnit||unit)}})},[token]);
  return <div><SectionTitle eyebrow="Connect expertise to demand" title="Capacity Bridge" description="When one unit has a verified gap, Capacity Connect finds relevant experts who can run a clinic, cohort or targeted learning intervention." />
    <div className="cc-card p-6 mb-5"><div className="grid lg:grid-cols-[1fr_auto_1fr] gap-5 items-center"><div className="p-5 rounded-2xl bg-[#FFF3F1] border border-[#F0CECA]"><p className="cc-eyebrow text-[#A84A3A]">Expertise deficit</p><h3 className="text-xl font-semibold">{unit}</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">Marketing Analytics readiness below required threshold.</p><div className="mt-4"><Bar value={54} marker={80} tone="coral"/></div></div><span className="w-12 h-12 rounded-full bg-[#EFF6F5] text-[#4F7C82] flex items-center justify-center mx-auto"><GitBranch className="w-5 h-5"/></span><div className="p-5 rounded-2xl bg-[#EFF8F5] border border-[#CEE8DE]"><p className="cc-eyebrow text-[#0D766A]">Available expertise</p><h3 className="text-xl font-semibold">Cross-unit expert pool</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">Verified mentors ranked by the exact competency gap.</p><div className="mt-4"><Bar value={92} tone="teal"/></div></div></div></div>
    <div className="grid lg:grid-cols-3 gap-4">{experts.slice(0,3).map((m,index)=><div className="cc-card p-5" key={m.id}><div className="flex justify-between gap-3"><span className="w-11 h-11 rounded-2xl bg-[#EAF5F4] flex items-center justify-center font-bold">{m.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><Pill tone={index===0?"teal":"neutral"}>{m.match}% match</Pill></div><h3 className="font-semibold mt-4">{m.name}</h3><p className="text-xs text-[var(--muted-foreground)] mt-1">{m.domain}</p><div className="space-y-2 mt-4">{m.strengths.slice(0,3).map(x=><div className="flex gap-2 text-xs" key={x}><Check className="w-3.5 h-3.5 text-[#12806F]"/>{x}</div>)}</div><button className="btn-primary w-full mt-5" onClick={()=>setTab("cohorts")}>{index===0?"Create expert clinic":"View expert"}</button></div>)}</div>
  </div>
}

function Simulator({ token }: {token?:string}) {
  const [selected,setSelected]=useState("C");
  const [options,setOptions]=useState(interventionOptions);
  useEffect(()=>{if(token)apiRequest<any>("/admin/intervention-simulator/",{method:"POST",body:JSON.stringify({current_readiness:54})},token).then(r=>{if(r.ok&&r.data?.options)setOptions(r.data.options)})},[token]);
  const current=options.find(o=>o.id===selected)||options[0];
  return <div><SectionTitle eyebrow="Decision support" title="Intervention Simulator" description="Compare training strategies before committing resources. These are explicitly labelled estimated/simulated impacts—not guaranteed AI predictions." action={<Pill tone="amber">Estimated / simulated impact</Pill>} />
    <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5"><div className="grid gap-3">{options.map(o=><button key={o.id} className={`cc-card p-5 text-left ${selected===o.id?"ring-2 ring-[#4F7C82]/30 border-[#9AB9BD]":""}`} onClick={()=>setSelected(o.id)}><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><span className="w-9 h-9 rounded-xl bg-[#EFF5F5] flex items-center justify-center font-bold text-xs">{o.id}</span><div><h3 className="font-semibold">{o.title}</h3><p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xl">{o.description}</p></div></div><Pill tone={selected===o.id?"teal":"neutral"}>{o.people} people</Pill></div><div className="grid grid-cols-3 gap-3 mt-4"><div className="cc-mini-metric"><span>Learning hours</span><strong>{o.hours}</strong></div><div className="cc-mini-metric"><span>Current</span><strong>{o.current}%</strong></div><div className="cc-mini-metric"><span>Estimated after</span><strong>{o.projected}%</strong></div></div></button>)}</div><div className="cc-card p-6 self-start"><p className="cc-eyebrow">Simulation result</p><h3 className="text-xl font-semibold">{current.title}</h3><div className="mt-6 p-5 rounded-2xl bg-[#F5FAF9] border border-[#DCEAE7]"><div className="flex items-end justify-between gap-4"><div><p className="text-xs text-[var(--muted-foreground)]">Current readiness</p><strong className="text-4xl tracking-[-.05em]">{current.current}%</strong></div><ArrowRight className="w-5 h-5 text-[#789194] mb-3"/><div className="text-right"><p className="text-xs text-[var(--muted-foreground)]">Estimated after</p><strong className="text-4xl tracking-[-.05em] text-[#0D766A]">{current.projected}%</strong></div></div><div className="mt-5"><Bar value={current.projected} marker={80}/></div></div><InlineNotice tone="warning"><span>This simulator uses demo heuristics in the prototype. Production impact estimates should be calibrated from historical intervention outcomes.</span></InlineNotice><button className="btn-primary w-full mt-5" onClick={()=>toast.success("Intervention draft created for admin review—no learners auto-enrolled.")}>Create intervention draft</button></div></div>
  </div>
}

function Cohorts({token}:{token?:string}) {
  const [rows,setRows]=useState<CohortSuggestion[]>(cohortSuggestions);
  useEffect(()=>{if(token)apiRequest<any>("/admin/cohorts/",{},token).then(r=>{if(r.ok&&r.data?.cohorts)setRows(r.data.cohorts)})},[token]);
  return <div><SectionTitle eyebrow="Smart cohort composer" title="Group people by the gap they actually share" description="Suggested cohorts consider competency gap, current level, language and availability. Admin reviews before anyone is enrolled." action={<button className="btn-primary" onClick={()=>toast.success("New cohort draft opened.")}><Plus className="w-4 h-4"/>Create cohort</button>} /><div className="grid lg:grid-cols-3 gap-4">{rows.map((c,index)=><div className="cc-card p-5" key={c.id}><div className="flex items-start justify-between gap-3"><span className="cc-icon-tile"><Users className="w-5 h-5"/></span><Pill tone={index===0?"red":"amber"}>{c.learners} learners</Pill></div><h3 className="text-lg font-semibold mt-4">{c.name}</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">{c.competency}</p><div className="grid grid-cols-2 gap-3 mt-5"><div className="cc-mini-metric"><span>Level</span><strong className="text-sm">{c.level}</strong></div><div className="cc-mini-metric"><span>Readiness</span><strong className="text-sm">{c.readinessRange}</strong></div></div><p className="text-xs text-[var(--muted-foreground)] mt-4">Language: {c.language}</p><div className="grid grid-cols-2 gap-2 mt-5"><button className="btn-secondary" onClick={()=>toast.info(`Reviewing ${c.name}: ${c.learners} learners · ${c.competency} · ${c.readinessRange}.`)}>Review</button><button className="btn-primary" onClick={()=>toast.success(`${c.name} confirmed for demo.`)}>Confirm</button></div></div>)}</div><InlineNotice tone="info"><span>Smart Cohort Composer does not auto-enroll learners without admin confirmation.</span></InlineNotice></div>
}

function Approvals({token}:{token?:string}) {
  const [rows,setRows]=useState<any[]>(pendingUsers);
  useEffect(()=>{if(token)apiRequest<any>("/admin/users/pending/",{},token).then(r=>{if(r.ok&&r.data?.users?.length)setRows(r.data.users.map((u:any)=>({id:u.id,name:u.name,role:u.role,department:u.department,qualification:u.qualification,experience:`${u.experienceYears} years`})))})},[token]);
  async function approve(id:number,name:string){if(token){const r=await apiRequest(`/admin/users/${id}/approve/`,{method:"POST"},token);if(!r.ok){toast.error(r.error||"Approval failed");return;}}setRows(prev=>prev.filter(x=>x.id!==id));toast.success(`${name} approved.`)}
  return <div><SectionTitle eyebrow="Governance" title="Pending role approvals" description="Trainer applications require admin review before expert matching or mentor booking becomes available." /><div className="cc-card overflow-hidden"><div className="divide-y divide-[#E6EEEE]">{rows.length?rows.map(u=><div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" key={u.id}><div><div className="flex gap-2 items-center"><strong>{u.name}</strong><Pill tone={String(u.role).toLowerCase()==="trainer"?"blue":"neutral"}>{u.role}</Pill></div><p className="text-sm text-[var(--muted-foreground)] mt-1">{u.department} · {u.qualification} · {u.experience}</p></div><div className="flex gap-2"><button className="btn-secondary" onClick={()=>toast.info(`Reviewing ${u.name}’s role, qualification and expertise evidence.`)}>Review</button><button className="btn-primary" onClick={()=>approve(u.id,u.name)}><UserCheck className="w-4 h-4"/>Approve</button></div></div>):<div className="p-10 text-center"><CheckCircle2 className="w-8 h-8 text-[#159B8C] mx-auto"/><h3 className="font-semibold mt-3">All caught up</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">There are no pending approvals.</p></div>}</div></div></div>
}

function UsersPanel(){const rows=["Sameer Khan","Ayesha Ali","Karan Mehta","Pooja Singh","Vikas Jain","Neeraj Gupta"];return <div><SectionTitle eyebrow="People & access" title="Users and role governance" description="Manage access without exposing admin APIs to trainee or trainer roles." /><div className="cc-card overflow-hidden"><div className="overflow-x-auto"><table className="cc-table"><thead><tr><th>User</th><th>Role</th><th>Department</th><th>Domain</th><th>State</th></tr></thead><tbody>{rows.map((name,index)=><tr key={name}><td><strong>{name}</strong><div className="text-[11px] text-[var(--muted-foreground)]">CC-T-{1042+index}</div></td><td><Pill tone="neutral">Trainee</Pill></td><td>{index<3?"Digital Outreach":"Public Engagement"}</td><td>Marketing</td><td><Pill tone="teal">Active</Pill></td></tr>)}</tbody></table></div></div></div>}

function LearningPanel(){return <div><SectionTitle eyebrow="Learning governance" title="Courses, assessments & knowledge" description="Keep learning assets tied to the competency taxonomy so recommendations and impact analytics remain explainable." /><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{demoCourses.map(c=><div className="cc-card p-5" key={c.id}><span className="cc-icon-tile"><BookOpen className="w-5 h-5"/></span><h3 className="font-semibold mt-4">{c.title}</h3><p className="text-xs text-[var(--muted-foreground)] mt-2">{c.enrolled} learners · {c.level}</p><div className="flex flex-wrap gap-2 mt-3">{Object.keys(c.requiredCompetencies).slice(0,2).map(x=><Pill key={x} tone="neutral">{x}</Pill>)}</div><button className="btn-secondary w-full mt-5" onClick={()=>toast.info(`Opening governance details for ${c.title}.`)}>Manage</button></div>)}</div></div>}

function Impact({token}:{token?:string}) {
  const [series,setSeries]=useState([{period:"Baseline",readiness:54},{period:"After course",readiness:63},{period:"After mentor",readiness:69},{period:"After reassessment",readiness:75}]);
  useEffect(()=>{if(token)apiRequest<any>("/admin/training-impact/",{},token).then(r=>{if(r.ok&&r.data?.series)setSeries(r.data.series)})},[token]);
  return <div><SectionTitle eyebrow="Verified improvement" title="Training Impact" description="Close the loop from activity metrics to before/after competency evidence and organizational readiness change." /><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5"><StatCard label="Gap reduction" value="21 pts" note="Demo cohort" icon={<TrendingUp className="w-5 h-5"/>} tone="success"/><StatCard label="Completion" value="84%" note="Current intervention" icon={<CheckCircle2 className="w-5 h-5"/>}/><StatCard label="Mentor-assisted" value="18" note="Sessions in pathway" icon={<UserRoundCheck className="w-5 h-5"/>}/><StatCard label="Verified evidence" value="42" note="Competency records" icon={<ShieldCheck className="w-5 h-5"/>}/></div><div className="cc-card p-6"><div className="flex items-center justify-between gap-4"><div><p className="cc-eyebrow">Readiness journey</p><h3 className="text-xl font-semibold">Baseline → intervention → verification</h3></div><Pill tone="teal">Observed demo evidence</Pill></div><div className="grid md:grid-cols-4 gap-4 mt-6">{series.map((p,index)=><div key={p.period} className="relative"><div className="rounded-2xl border border-[#E0E9EA] p-5 text-center"><p className="text-xs text-[var(--muted-foreground)]">{p.period}</p><strong className="block text-3xl mt-2">{p.readiness}%</strong><div className="mt-4"><Bar value={p.readiness} tone={index===0?"amber":"teal"}/></div></div>{index<series.length-1&&<ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-[#9FB0B2]"/>}</div>)}</div><InlineNotice tone="success"><span>Individual improvement is reflected upward only after new competency evidence is recorded—course completion alone is not treated as proof of capability.</span></InlineNotice></div></div>
}

function Announcements(){const [title,setTitle]=useState("");return <div><SectionTitle eyebrow="Engagement" title="Announcements & achievements" description="Publish targeted notices without turning the product into a noisy social feed." /><div className="grid xl:grid-cols-[.9fr_1.1fr] gap-5"><div className="cc-card p-6"><p className="cc-eyebrow">New announcement</p><label className="cc-label mt-4">Title</label><input className="cc-input w-full mt-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Analytics mentor clinic"/><label className="cc-label mt-4">Audience</label><select className="cc-select w-full mt-2"><option>All users</option><option>Trainees</option><option>Trainers</option><option>Digital Outreach</option></select><label className="cc-label mt-4">Message</label><textarea className="cc-input w-full min-h-28 mt-2 resize-none" placeholder="Write a concise action-oriented announcement."/><button className="btn-primary w-full mt-5" onClick={()=>{toast.success("Announcement published in demo.");setTitle("")}}><Megaphone className="w-4 h-4"/>Publish</button></div><div className="cc-card p-6"><p className="cc-eyebrow">Recent activity</p><div className="space-y-3 mt-4">{[["Mentor clinic opened","Trainees · 15 Sep"],["Analytics readiness milestone","All · 14 Sep"],["A/B testing case pack added","Trainers · 13 Sep"]].map(([a,b])=><div className="p-4 rounded-xl border border-[#E0E9EA]" key={a}><strong className="text-sm">{a}</strong><p className="text-xs text-[var(--muted-foreground)] mt-1">{b}</p></div>)}</div></div></div></div>}

function Settings(){return <div><SectionTitle eyebrow="Governance" title="Capacity rules & thresholds" description="Make readiness logic transparent and configurable rather than hiding it in code." /><div className="grid lg:grid-cols-2 gap-5"><div className="cc-card p-6"><p className="cc-eyebrow">Gap thresholds</p><div className="space-y-4 mt-5">{[["Achieved","0 points","teal"],["Low","1–10 points","blue"],["Moderate","11–25 points","amber"],["Critical","26+ points","red"]].map(([a,b,t])=><div className="flex items-center justify-between p-3 rounded-xl border border-[#E0E9EA]" key={a}><Pill tone={t as any}>{a}</Pill><strong className="text-sm">{b}</strong></div>)}</div></div><div className="cc-card p-6"><p className="cc-eyebrow">Competency freshness</p><div className="space-y-3 mt-5">{[["Marketing Analytics","180 days"],["Paid Advertising","180 days"],["A/B Testing","180 days"],["Content Strategy","365 days"]].map(([a,b])=><div className="flex justify-between gap-3 p-3 rounded-xl bg-[#F8FAFA]" key={a}><span className="text-sm">{a}</span><strong className="text-sm">{b}</strong></div>)}</div><InlineNotice tone="info"><span>When verification approaches expiry, Capacity Connect can recommend a targeted reassessment instead of a full course repeat.</span></InlineNotice></div></div></div>}

function Teams({ token }: { token?: string }) {
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [teams, setTeams] = useState<Team[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("capacity_demo_teams");
        if (saved) {
          const parsed = JSON.parse(saved);
          // sync memory
          demoTeams.length = 0;
          demoTeams.push(...parsed);
          return parsed;
        }
      } catch (e) {}
    }
    return demoTeams;
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Detail View State
  const [requests, setRequests] = useState<MembershipRequest[]>(demoMembershipRequests);
  const [invitations, setInvitations] = useState<TeamInvitation[]>(demoTeamInvitations);
  
  // Form State
  const [form, setForm] = useState<{ id?: number; name: string; purpose: string; mode: TeamMode; targetSize: number; requiredSkills: string[]; trainerId?: number; status: "draft" | "active" | "completed" }>({
    name: "", purpose: "", mode: "Similar Skill Set", targetSize: 5, requiredSkills: [], status: "draft"
  });
  const [selectedTrainees, setSelectedTrainees] = useState<{ id: number; originalId?: number; name: string; skills: { name: string; level: number }[] }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTrainees = demoTrainees.filter(t => !selectedTrainees.find(st => st.id === t.id) && t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const saveTeamsState = (newTeams: Team[]) => {
    setTeams(newTeams);
    if (typeof window !== "undefined") {
      localStorage.setItem("capacity_demo_teams", JSON.stringify(newTeams));
    }
    demoTeams.length = 0;
    demoTeams.push(...newTeams);
  };

  const handleCreateNew = () => {
    setForm({ name: "", purpose: "", mode: "Similar Skill Set", targetSize: 5, requiredSkills: [], status: "draft" });
    setSelectedTrainees([]);
    setView("form");
  };

  const handleEdit = (team: Team) => {
    if (!team) {
      toast.error("Team not found.");
      setView("list");
      return;
    }
    setForm({ 
      id: team.id, 
      name: team.name || "", 
      purpose: team.purpose || "", 
      mode: team.mode || "Similar Skill Set", 
      targetSize: team.targetSize || 5, 
      requiredSkills: team.requiredSkills || [], 
      trainerId: team.trainerId, 
      status: team.status || "draft" 
    });
    // Safely map members and preserve existing IDs
    const members = team.members || [];
    setSelectedTrainees(members.filter(m => m.role === "member").map(m => ({
      id: m.userId,
      originalId: m.id,
      name: m.name,
      skills: (m.skills || []).map(s => ({ name: s.name, level: s.level }))
    })));
    setView("form");
  };

  const handleSave = () => {
    if (!form.name || !form.name.trim()) {
      toast.error("Team name is required.");
      return;
    }
    if (!form.purpose || !form.purpose.trim()) {
      toast.error("Team purpose is required.");
      return;
    }
    if (form.targetSize < selectedTrainees.length) {
      toast.error(`Capacity cannot be reduced below active membership (${selectedTrainees.length}).`);
      return;
    }

    const originalTeam = form.id ? teams.find(t => t.id === form.id) : null;
    const existingMembers = originalTeam?.members || [];
    const nonTraineeMembers = existingMembers.filter(m => m.role !== "member");

    const updatedTraineeMembers = selectedTrainees.map(t => {
      const existing = existingMembers.find(m => m.userId === t.id && m.role === "member");
      return {
        id: existing?.id || t.originalId || (Date.now() + Math.random()),
        userId: t.id,
        name: t.name,
        role: "member" as const,
        skills: (t.skills || []).map(s => ({ name: s.name, level: s.level, match: (form.requiredSkills || []).includes(s.name) }))
      };
    });

    const newTeam: Team = {
      id: form.id || Date.now(),
      name: form.name.trim(),
      purpose: form.purpose.trim(),
      mode: form.mode,
      targetSize: form.targetSize,
      requiredSkills: form.requiredSkills || [],
      trainerId: form.trainerId,
      status: form.status || "draft",
      members: [...nonTraineeMembers, ...updatedTraineeMembers]
    };

    if (form.id) {
      saveTeamsState(teams.map(t => t.id === form.id ? newTeam : t));
      toast.success("Team updated.");
    } else {
      saveTeamsState([...teams, newTeam]);
      toast.success("Team created.");
    }
    setView("list");
  };

  const handleResetDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("capacity_demo_teams");
      window.location.reload();
    }
  };

  const approveRequest = (reqId: number) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "approved" } : r));
    toast.success("Membership request approved.");
  };

  const rejectRequest = (reqId: number) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "rejected" } : r));
    toast.info("Membership request rejected.");
  };

  if (view === "list") {
    return (
      <div>
        <SectionTitle eyebrow="Smart Teams" title="Manage Teams & Cohorts" description="Create and manage teams based on shared skills or complementary capabilities." action={<div className="flex gap-2"><button className="btn-secondary" onClick={handleResetDemo}>Reset Demo</button><button className="btn-primary" onClick={handleCreateNew}><Plus className="w-4 h-4"/>Create Team</button></div>} />
        <div className="grid lg:grid-cols-2 gap-4">
          {teams.map(team => (
            <div className="cc-card p-5" key={team.id}>
              <div className="flex items-start justify-between gap-3">
                <span className="cc-icon-tile"><Network className="w-5 h-5"/></span>
                <Pill tone={team.status === "active" ? "teal" : "amber"}>{team.status.toUpperCase()}</Pill>
              </div>
              <h3 className="text-lg font-semibold mt-4">{team.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{team.purpose}</p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="cc-mini-metric"><span>Mode</span><strong className="text-sm">{team.mode}</strong></div>
                <div className="cc-mini-metric"><span>Members</span><strong className="text-sm">{(team.members || []).length} / {team.targetSize || 0}</strong></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {(team.requiredSkills || []).map(s => <Pill key={s} tone="neutral">{s}</Pill>)}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-5">
                <button className="btn-secondary" onClick={() => handleEdit(team)}>Edit</button>
                <button className="btn-primary" onClick={() => { setSelectedTeam(team); setView("detail"); }}>Manage Members</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "form") {
    return (
      <div>
        <SectionTitle eyebrow="Team Management" title={form.id ? "Edit Team" : "Create New Team"} description="Define the team's purpose and select trainees based on competency." action={<button className="btn-secondary" onClick={() => setView("list")}>Back to List</button>} />
        <div className="grid xl:grid-cols-[1fr_1fr] gap-5">
          <div className="cc-card p-6 self-start space-y-4">
            <p className="cc-eyebrow">Team Details</p>
            <div><label className="cc-label block">Team Name</label><input className="cc-input w-full mt-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Analytics Task Force" /></div>
            <div><label className="cc-label block">Purpose</label><textarea className="cc-input w-full mt-2 resize-none h-20" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} placeholder="Why is this team being formed?" /></div>
            <div>
              <label className="cc-label block">Team Mode</label>
              <select className="cc-select w-full mt-2" value={form.mode} onChange={e => setForm({...form, mode: e.target.value as TeamMode})}>
                <option value="Similar Skill Set">Similar Skill Set (Shared Training Gap)</option>
                <option value="Mixed Skill Set">Mixed Skill Set (Complementary Skills)</option>
              </select>
            </div>
            <div><label className="cc-label block">Target Size</label><input type="number" className="cc-input w-full mt-2" value={form.targetSize} onChange={e => setForm({...form, targetSize: Number(e.target.value)})} /></div>
            <div>
              <label className="cc-label block">Required Skills (Comma separated)</label>
              <input className="cc-input w-full mt-2" value={(form.requiredSkills || []).join(", ")} onChange={e => setForm({...form, requiredSkills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} placeholder="e.g. Marketing Analytics, SEO" />
            </div>
          </div>
          <div className="cc-card p-6 self-start space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="cc-eyebrow mb-0">Trainee Selection</p>
              <span className={`text-xs font-semibold ${selectedTrainees.length > form.targetSize ? 'text-[#C85747]' : 'text-[var(--muted-foreground)]'}`}>
                {selectedTrainees.length} / {form.targetSize} selected
              </span>
            </div>
            {selectedTrainees.length > form.targetSize && (
              <InlineNotice tone="danger"><span>Team is over capacity based on target size.</span></InlineNotice>
            )}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#769093]" />
              <input className="cc-input pl-9 w-full" placeholder="Search trainees by name or skill" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {searchQuery && filteredTrainees.length > 0 && (
              <div className="border border-[#E0E9EA] rounded-xl p-2 max-h-48 overflow-y-auto space-y-2 bg-[#FBFDFD]">
                {filteredTrainees.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E0E9EA]">
                    <div>
                      <strong className="text-sm block">{t.name}</strong>
                      <div className="flex gap-1 mt-1">
                        {t.skills.map(s => <span key={s.name} className="text-[10px] bg-[#EEF5F5] text-[#4F7C82] px-1.5 py-0.5 rounded">{s.name} ({s.level}%)</span>)}
                      </div>
                    </div>
                    <button className="btn-secondary text-xs px-2 py-1" onClick={() => {
                      if (selectedTrainees.length >= form.targetSize) {
                        toast.error("Cannot exceed target team size.");
                        return;
                      }
                      setSelectedTrainees([...selectedTrainees, t]);
                    }}><Plus className="w-3 h-3"/></button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 space-y-2">
              {selectedTrainees.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E0E9EA] bg-[#FAFCFC]">
                  <div>
                    <strong className="text-sm block">{t.name}</strong>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                      Missing: {(form.requiredSkills || []).filter(rs => !(t.skills || []).find(s => s.name === rs)).join(", ") || "None"}
                    </p>
                  </div>
                  <button className="text-[var(--muted-foreground)] hover:text-red-500" onClick={() => setSelectedTrainees(selectedTrainees.filter(st => st.id !== t.id))}>Remove</button>
                </div>
              ))}
              {selectedTrainees.length === 0 && <p className="text-sm text-[var(--muted-foreground)] text-center py-4">No members selected</p>}
            </div>
            <button className="btn-primary w-full mt-4" onClick={handleSave}>Save Team</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "detail" && selectedTeam) {
    const teamRequests = requests.filter(r => r.teamId === selectedTeam.id);
    return (
      <div>
        <SectionTitle eyebrow="Team Detail" title={selectedTeam.name} description={selectedTeam.purpose} action={<button className="btn-secondary" onClick={() => setView("list")}>Back to List</button>} />
        <div className="grid xl:grid-cols-[1.1fr_.9fr] gap-5">
          <div className="cc-card p-6">
            <div className="flex items-center justify-between">
              <p className="cc-eyebrow mb-0">Current Members</p>
              <Pill tone="teal">{(selectedTeam.members || []).length} / {selectedTeam.targetSize || 0}</Pill>
            </div>
            <div className="space-y-3 mt-4">
              {(selectedTeam.members || []).map(m => (
                <div key={m.id} className="p-4 rounded-2xl border border-[#E0E9EA] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#EFF5F5] flex items-center justify-center font-bold text-xs">{(m.name || "?").substring(0, 2)}</span>
                    <div>
                      <strong className="text-sm block">{m.name || "Unknown"}</strong>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5 capitalize">{m.role || "member"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {(m.skills || []).slice(0,2).map(s => <span key={s.name} className={`text-[10px] px-2 py-0.5 rounded ${s.match ? 'bg-[#EAF7F3] text-[#13806F]' : 'bg-[#F4F7F7] text-[#5A7376]'}`}>{s.name}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="cc-card p-6">
              <p className="cc-eyebrow">Membership Requests</p>
              <div className="space-y-3 mt-4">
                {teamRequests.length > 0 ? teamRequests.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-[#E0E9EA]">
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-sm">{r.userName}</strong>
                      <Pill tone={r.status === 'pending' ? 'amber' : r.status === 'approved' ? 'teal' : 'red'}>{r.status}</Pill>
                    </div>
                    {r.message && <p className="text-xs text-[var(--muted-foreground)] italic mb-2">"{r.message}"</p>}
                    <div className="flex gap-1 mb-3">
                      {r.userSkills.map(s => <span key={s.name} className="text-[10px] bg-[#EEF5F5] text-[#4F7C82] px-1.5 py-0.5 rounded">{s.name} ({s.level}%)</span>)}
                    </div>
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="btn-secondary py-1 text-xs" onClick={() => rejectRequest(r.id)}>Reject</button>
                        <button className="btn-primary py-1 text-xs" onClick={() => approveRequest(r.id)}>Approve</button>
                      </div>
                    )}
                  </div>
                )) : <p className="text-sm text-[var(--muted-foreground)]">No requests</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminWorkspace({profile,token,activeTab,setActiveTab}:{profile:UserProfile;token?:string;activeTab:AdminTab;setActiveTab:(tab:AdminTab)=>void}){
  if(activeTab==="overview")return <Overview token={token} setTab={setActiveTab}/>;
  if(activeTab==="pulse")return <Pulse token={token} setTab={setActiveTab}/>;
  if(activeTab==="coverage")return <Coverage token={token} setTab={setActiveTab}/>;
  if(activeTab==="bridge")return <Bridge token={token} setTab={setActiveTab}/>;
  if(activeTab==="simulator")return <Simulator token={token}/>;
  if(activeTab==="cohorts")return <Cohorts token={token}/>;
  if(activeTab==="approvals")return <Approvals token={token}/>;
  if(activeTab==="users")return <UsersPanel/>;
  if(activeTab==="learning")return <LearningPanel/>;
  if(activeTab==="impact")return <Impact token={token}/>;
  if(activeTab==="announcements")return <Announcements/>;
  if(activeTab==="teams")return <Teams token={token} />;
  if(activeTab==="community")return <CommunityLayout profile={profile} />;
  return <Settings/>;
}
