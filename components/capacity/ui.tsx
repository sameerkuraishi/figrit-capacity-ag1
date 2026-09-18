"use client";

import type { ReactNode } from "react";
import { Check, ChevronRight, CircleAlert, Sparkles } from "lucide-react";

export function Pill({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "coral" | "neutral" | "amber" | "red" | "blue" }) {
  const toneClass = {
    teal: "bg-[#E9F7F3] text-[#0D766A] border-[#C9E8DF]",
    coral: "bg-[#FFF0EC] text-[#B84F39] border-[#F7CBBF]",
    neutral: "bg-[#F3F6F6] text-[#465E61] border-[#DEE8E9]",
    amber: "bg-[#FFF8E8] text-[#9B6A0B] border-[#F3DFAD]",
    red: "bg-[#FFF0F0] text-[#B74141] border-[#F1C2C2]",
    blue: "bg-[#EDF4FB] text-[#315E85] border-[#CADDED]",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${toneClass}`}>{children}</span>;
}

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
      <div>
        {eyebrow && <p className="cc-eyebrow">{eyebrow}</p>}
        <h2 className="text-[28px] leading-tight font-semibold tracking-[-0.035em] text-[var(--winter-dark)]">{title}</h2>
        {description && <p className="text-sm leading-relaxed text-[var(--muted-foreground)] mt-2 max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, note, icon, tone = "default" }: { label: string; value: string | number; note?: string; icon?: ReactNode; tone?: "default" | "success" | "warning" | "critical" }) {
  return (
    <div className={`cc-card cc-stat-card ${tone !== "default" ? `cc-stat-${tone}` : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--muted-foreground)]">{label}</p>
          <p className="text-[30px] leading-none font-semibold tracking-[-0.04em] mt-3 text-[var(--winter-dark)]">{value}</p>
          {note && <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">{note}</p>}
        </div>
        {icon && <span className="cc-icon-tile">{icon}</span>}
      </div>
    </div>
  );
}

export function Bar({ value, marker, tone = "teal", height = "h-2.5" }: { value: number; marker?: number; tone?: "teal" | "coral" | "amber" | "red" | "blue"; height?: string }) {
  const barClass = {
    teal: "bg-gradient-to-r from-[#4F7C82] to-[#159B8C]",
    coral: "bg-gradient-to-r from-[#EF765B] to-[#D85D43]",
    amber: "bg-gradient-to-r from-[#E7AD3F] to-[#C98B1C]",
    red: "bg-gradient-to-r from-[#DF7070] to-[#C24646]",
    blue: "bg-gradient-to-r from-[#597F9F] to-[#3D6D96]",
  }[tone];
  return (
    <div className={`relative w-full ${height} rounded-full bg-[#EAF1F1] overflow-hidden`}>
      <div className={`absolute inset-y-0 left-0 rounded-full ${barClass} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      {marker !== undefined && <span className="absolute top-[-3px] bottom-[-3px] w-[2px] bg-[#0B2E33]/60 rounded" style={{ left: `${Math.max(0, Math.min(100, marker))}%` }} />}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="cc-card p-8 text-center flex flex-col items-center">
      <span className="w-12 h-12 rounded-2xl bg-[#EDF6F5] text-[#4F7C82] flex items-center justify-center mb-4"><Sparkles className="w-5 h-5" /></span>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-md mt-2">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function NextAction({ title, description, cta, onClick }: { title: string; description: string; cta: string; onClick?: () => void }) {
  return (
    <div className="cc-next-action">
      <div className="flex gap-3 items-start">
        <span className="w-9 h-9 rounded-xl bg-white/80 text-[#0D766A] flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4" /></span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#0D766A]">Your next best action</p>
          <h3 className="text-lg font-semibold mt-1">{title}</h3>
          <p className="text-sm text-[#4D6668] mt-1">{description}</p>
        </div>
      </div>
      <button className="btn-primary whitespace-nowrap" onClick={onClick}>{cta}<ChevronRight className="w-4 h-4" /></button>
    </div>
  );
}

export function StatusDot({ status }: { status: "healthy" | "attention" | "critical" }) {
  const map = {
    healthy: "bg-[#159B8C]",
    attention: "bg-[#E7AD3F]",
    critical: "bg-[#D85D5D]",
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${map[status]}`} />;
}

export function InlineNotice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" | "success" | "danger" }) {
  const cls = {
    info: "bg-[#F2F7FA] border-[#D7E4EC] text-[#345A70]",
    warning: "bg-[#FFF8E9] border-[#F0DDAA] text-[#825D17]",
    success: "bg-[#ECF8F4] border-[#C7E7DC] text-[#116B61]",
    danger: "bg-[#FFF1F1] border-[#F0C7C7] text-[#9D3D3D]",
  }[tone];
  return <div className={`rounded-xl border px-4 py-3 text-sm flex gap-2 items-start ${cls}`}><CircleAlert className="w-4 h-4 mt-0.5 shrink-0" />{children}</div>;
}

export function CheckItem({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 items-start text-sm"><span className="w-5 h-5 rounded-full bg-[#EAF7F2] text-[#12806F] flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" /></span><span>{children}</span></div>;
}
