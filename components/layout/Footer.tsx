import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-[1230px] mx-auto px-6 py-8 mt-12 border-t border-[var(--border)] text-[var(--muted-foreground)] text-sm">
      <Logo compact />
      <span className="mt-4 md:mt-0 font-medium">Transparent scoring · Human guidance · Stable fallback</span>
    </footer>
  );
}
