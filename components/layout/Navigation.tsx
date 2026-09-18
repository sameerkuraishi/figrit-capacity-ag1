import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export function Navigation({ onStart, onCounsellor }: { onStart: () => void; onCounsellor: () => void }) {
  return (
    <nav className="floating-nav">
      <Logo compact />
      
      <div className="hidden md:flex items-center gap-6">
        <a href="#journey" className="text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--winter-primary)] transition-colors">How it works</a>
        <button onClick={onCounsellor} className="text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--winter-primary)] transition-colors">Counsellor portal</button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onStart} className="btn-secondary hidden sm:flex h-10">
          Skip to dashboard
        </Button>
      </div>
    </nav>
  );
}
