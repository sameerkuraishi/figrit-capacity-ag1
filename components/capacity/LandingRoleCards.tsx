"use client";

import { ArrowRight, Check, GraduationCap, ShieldCheck, Users } from "lucide-react";
import type { UserRole } from "@/lib/capacity-types";

const roles = [
  {
    id: "trainee",
    title: "Trainee",
    eyebrow: "Learn with direction",
    icon: GraduationCap,
    description: "Know where you stand and build the skills your organisation needs.",
    features: ["Understand your skill gaps", "Follow a focused learning path", "Reassess and see your progress"],
    action: "Enter trainee workspace",
  },
  {
    id: "trainer",
    title: "Trainer / Mentor",
    eyebrow: "Turn expertise into growth",
    icon: Users,
    description: "Share your knowledge and help people put new capabilities into practice.",
    features: ["Guide learners through their gaps", "Connect training to competencies", "Review learning outcomes"],
    action: "Enter trainer workspace",
  },
  {
    id: "admin",
    title: "Admin",
    eyebrow: "See the whole organisation",
    icon: ShieldCheck,
    description: "Understand capacity across teams and direct support where it matters.",
    features: ["Identify capability priorities", "Connect people with expertise", "Track improvement after training"],
    action: "Enter admin workspace",
  },
] satisfies Array<{
  id: UserRole;
  title: string;
  eyebrow: string;
  icon: typeof Users;
  description: string;
  features: string[];
  action: string;
}>;

/** Small, local vector illustrations; no remote image requests or sample metrics. */
function RoleIllustration({ role }: { role: UserRole }) {
  return (
    <svg viewBox="0 0 360 184" width="360" height="184" aria-hidden="true" focusable="false" className="cc-role-illustration">
      <circle cx="180" cy="94" r="78" fill="currentColor" opacity=".055" />
      <circle cx="302" cy="33" r="5" fill="#EF765B" opacity=".6" />
      <path d="M45 63h12m-6-6v12M299 146h12m-6-6v12" stroke="#93B1B5" strokeWidth="2" strokeLinecap="round" />
      {role === "trainee" && <>
        <rect x="133" y="27" width="152" height="114" rx="12" fill="#fff" stroke="#C5DADB" strokeWidth="2" />
        <path d="M133 52h152" stroke="#E0ECEC" strokeWidth="2" />
        <circle cx="147" cy="40" r="3" fill="#EF765B" /><circle cx="158" cy="40" r="3" fill="#B8E3E9" />
        <rect x="150" y="67" width="48" height="54" rx="6" fill="#E6F4F2" />
        <path d="m163 93 8 8 14-20" fill="none" stroke="#159B8C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M210 72h54M210 87h36M210 103h47M210 118h28" stroke="#9BBABE" strokeWidth="5" strokeLinecap="round" />
        <path d="M69 151c0-29 12-48 34-48 22 0 35 19 35 48" fill="#4F7C82" />
        <circle cx="103" cy="83" r="20" fill="#E8B49B" />
        <path d="M83 83c-5-27 37-33 40-5-10 1-18-4-23-9-3 8-9 13-17 14Z" fill="#0B2E33" />
        <path d="m124 121 23 13 17-12" fill="none" stroke="#E8B49B" strokeWidth="11" strokeLinecap="round" />
        <path d="M63 156h228" stroke="#93B1B5" strokeWidth="3" strokeLinecap="round" />
        <rect x="181" y="143" width="55" height="10" rx="3" fill="#EF765B" /><rect x="187" y="133" width="49" height="10" rx="3" fill="#B8E3E9" />
      </>}
      {role === "trainer" && <>
        <path d="M102 100h55m46 0h55M180 57v35" stroke="#8BB4B6" strokeWidth="2" strokeDasharray="5 6" />
        <rect x="143" y="20" width="74" height="43" rx="12" fill="#fff" stroke="#C5DADB" strokeWidth="2" />
        <path d="M161 36h36M161 46h24" stroke="#4F7C82" strokeWidth="4" strokeLinecap="round" />
        <circle cx="180" cy="109" r="29" fill="#0B2E33" />
        <path d="m166 110 10 10 19-23" fill="none" stroke="#B8E3E9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="57" y="60" width="74" height="100" rx="14" fill="#fff" stroke="#C5DADB" strokeWidth="2" />
        <circle cx="94" cy="92" r="17" fill="#E8B49B" />
        <path d="M77 91c-5-23 30-30 34-7-12 5-23-2-24-5-1 7-5 10-10 12Z" fill="#0B2E33" />
        <path d="M68 146v-6c0-19 10-28 26-28s26 9 26 28v6" fill="#159B8C" />
        <rect x="229" y="60" width="74" height="100" rx="14" fill="#fff" stroke="#C5DADB" strokeWidth="2" />
        <path d="M247 105V88c0-24 38-24 38 0v25" fill="#0B2E33" />
        <circle cx="266" cy="92" r="16" fill="#C58E70" />
        <path d="M250 89c8-3 13-11 14-16 5 8 12 12 19 14" fill="#0B2E33" />
        <path d="M240 146v-6c0-19 10-28 26-28s26 9 26 28v6" fill="#EF765B" />
        <path d="M169 153h22" stroke="#9BBABE" strokeWidth="4" strokeLinecap="round" />
      </>}
      {role === "admin" && <>
        <rect x="69" y="25" width="224" height="133" rx="12" fill="#fff" stroke="#C5DADB" strokeWidth="2" />
        <path d="M69 51h224" stroke="#E0ECEC" strokeWidth="2" />
        <path d="M84 38h41" stroke="#4F7C82" strokeWidth="4" strokeLinecap="round" />
        <circle cx="278" cy="38" r="4" fill="#159B8C" />
        <rect x="84" y="66" width="73" height="76" rx="7" fill="#EFF6F6" />
        <circle cx="120" cy="95" r="17" fill="none" stroke="#CFE3E4" strokeWidth="6" />
        <path d="M120 78a17 17 0 0 1 14 27" fill="none" stroke="#159B8C" strokeWidth="6" strokeLinecap="round" />
        <path d="M105 128h30" stroke="#9BBABE" strokeWidth="4" strokeLinecap="round" />
        {[0, 1, 2].map(row => [0, 1, 2, 3].map(col => <rect key={`${row}-${col}`} x={174 + col * 25} y={66 + row * 25} width="19" height="19" rx="4" fill={row === 1 && col === 2 ? "#EF765B" : (row + col) % 3 === 0 ? "#4F7C82" : "#B8E3E9"} />))}
        <path d="M174 142h48" stroke="#9BBABE" strokeWidth="4" strokeLinecap="round" />
        <circle cx="291" cy="142" r="23" fill="#0B2E33" />
        <path d="m281 142 7 7 13-15" fill="none" stroke="#B8E3E9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>}
    </svg>
  );
}

export default function LandingRoleCards({ onStart }: { onStart: (role: UserRole) => void }) {
  return (
    <section id="roles" aria-labelledby="roles-heading" className="cc-roles-section">
      <div className="cc-roles-intro">
        <div>
          <p className="cc-eyebrow">Built around your people</p>
          <h2 id="roles-heading">One platform.<br />A shared path to progress.</h2>
        </div>
        <p>Choose your workspace. Every role contributes to the same goal: stronger skills and a more capable organisation.</p>
      </div>
      <div className="cc-role-grid">
        {roles.map(({ id, title, eyebrow, icon: Icon, description, features, action }, index) => (
          <article className={`cc-role-card cc-role-${id}`} key={id} aria-labelledby={`role-${id}`}>
            <div className="cc-role-art">
              <span className="cc-role-number">0{index + 1}</span>
              <RoleIllustration role={id} />
            </div>
            <div className="cc-role-body">
              <div className="cc-role-title"><span className="cc-icon-tile"><Icon size={20} aria-hidden="true" /></span><div><p className="cc-role-eyebrow">{eyebrow}</p><h3 id={`role-${id}`}>{title}</h3></div></div>
              <p className="cc-role-description">{description}</p>
              <ul className="cc-role-features">{features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
              <button type="button" className="cc-role-entry" onClick={() => onStart(id)}>{action}<ArrowRight size={18} aria-hidden="true" /></button>
            </div>
          </article>
        ))}
      </div>
      <p className="cc-roles-footnote">Assess capability. Connect the right support. Measure the change.</p>
    </section>
  );
}
