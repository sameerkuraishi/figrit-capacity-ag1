import { GraduationCap } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--winter-primary)] to-[var(--winter-dark)] text-white shadow-lg shadow-[var(--winter-primary)]/20">
        <GraduationCap className="w-5 h-5" />
      </div>
      <div>
        <strong className="block font-heading text-[var(--winter-dark)] text-lg tracking-tight leading-tight">
          FIGR IT
        </strong>
        {!compact && (
          <small className="block text-[var(--winter-muted)] text-xs font-medium mt-0.5">
            Career Navigator & Companion
          </small>
        )}
      </div>
    </div>
  );
}
