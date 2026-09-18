import { Logo } from "@/components/shared/Logo";
import { UserRound, RotateCcw, Network, X } from "lucide-react";
import type { ComponentType } from "react";
import type { StudentStep } from "@/lib/figr-product";

type NavItem = {
  id: StudentStep;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

interface SidebarProps {
  profile: { name: string; level: string };
  targetCareerTitle: string | null;
  navItems: NavItem[];
  currentStepIndex: number;
  step: StudentStep;
  setStep: (step: StudentStep) => void;
  loadDemoStudent: () => void;
  resetDemo: () => void;
  setTechnicalOpen: (open: boolean) => void;
  setScreen: (screen: "landing" | "student" | "counsellor") => void;
}

export function Sidebar({
  profile,
  targetCareerTitle,
  navItems,
  currentStepIndex,
  step,
  setStep,
  loadDemoStudent,
  resetDemo,
  setTechnicalOpen,
  setScreen,
}: SidebarProps) {
  return (
    <aside className="student-sidebar flex flex-col bg-white border-r border-[var(--border)] pt-6 pb-4">
      <div className="px-6 mb-6">
        <Logo compact />
      </div>

      <div className="px-4 mb-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--secondary)]">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-[var(--winter-primary)] text-white font-bold shadow-sm">
            {(profile.name || "S").charAt(0).toUpperCase()}
          </span>
          <div className="overflow-hidden">
            <strong className="block text-sm text-[var(--winter-dark)] truncate">
              {profile.name || "Student"}
            </strong>
            <small className="block text-xs text-[var(--muted-foreground)] truncate mt-0.5">
              {profile.level || "Setup required"}
            </small>
          </div>
        </div>
        <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-[#F0F8F8] to-[#F8FBFB] border border-[var(--border)]">
          <small className="block text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider">Target Career</small>
          <strong className="block text-sm text-[var(--winter-dark)] font-semibold truncate mt-1">
            {targetCareerTitle || "Exploring"}
          </strong>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider">Progress</span>
          <span className="text-[10px] font-bold text-[var(--winter-primary)]">{currentStepIndex + 1}/{navItems.length}</span>
        </div>
        <div className="flex gap-1">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className={`h-1.5 flex-1 rounded-full ${
                index <= currentStepIndex
                  ? index === currentStepIndex
                    ? "bg-[var(--winter-primary)]"
                    : "bg-[var(--winter-success)]"
                  : "bg-[var(--muted)]"
              }`}
            />
          ))}
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const NavIcon = item.icon;
          const isActive = step === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--winter-primary)] text-white shadow-md"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--winter-dark)]"
              }`}
            >
              <NavIcon className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-70"}`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {isActive && <span className="text-[10px] opacity-80">{index + 1}</span>}
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pt-4 flex flex-col gap-1">
        <button onClick={loadDemoStudent} className="flex items-center gap-2 p-2 w-full text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--winter-dark)] rounded-md transition-colors">
          <UserRound className="w-3.5 h-3.5" /> Load Demo Profile
        </button>
        <button onClick={resetDemo} className="flex items-center gap-2 p-2 w-full text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--winter-dark)] rounded-md transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
        </button>
        <button onClick={() => setTechnicalOpen(true)} className="flex items-center gap-2 p-2 w-full text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--winter-dark)] rounded-md transition-colors">
          <Network className="w-3.5 h-3.5" /> View Technical Flow
        </button>
        <button onClick={() => setScreen("landing")} className="flex items-center gap-2 p-2 w-full text-xs font-medium text-[#E65C5C] hover:bg-[#FEF4F1] rounded-md transition-colors mt-2 border border-transparent hover:border-[#F38B75]/30">
          <X className="w-3.5 h-3.5" /> Exit to Landing
        </button>
      </div>
    </aside>
  );
}
