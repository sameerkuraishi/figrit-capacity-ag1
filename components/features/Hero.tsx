import { ArrowRight, BookOpen, Compass, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection({ onStart, onWorks }: { onStart: () => void; onWorks: () => void }) {
  return (
    <section className="relative z-10 w-full max-w-[1230px] mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center min-h-[600px]">
      <div className="flex flex-col items-start gap-6">

        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-semibold text-[var(--winter-dark)] leading-[1.05] tracking-tight">
          Discover the <span className="text-gradient">right career.</span><br />
          Build the right skills.
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg md:text-xl max-w-[500px] leading-relaxed">
          Go beyond simple tests. Explore paths with an AI companion, discover actual required skills, and create a roadmap that adapts to you.
        </p>
        <div className="flex flex-wrap gap-4 mt-2">
          <Button onClick={onStart} className="btn-primary text-[15px] h-12 px-6">
            Start Guided Demo <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onWorks} className="btn-secondary text-[15px] h-12 px-6">
            See How It Works
          </Button>
        </div>
        
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-[var(--winter-light)] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[var(--winter-primary)] shadow-sm">
                S{i}
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] font-medium">
            Join thousands of students finding clarity.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial opacity-60 -z-10" />
        
        <div className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square flex justify-center items-end">
          {/* Main Character */}
          <div className="relative w-[85%] h-[90%] z-10 animate-float">
            <img
              src="/images/student_guide.jpg"
              alt="FIGR IT Student Guide"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-[10%] left-[0%] glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse-soft shadow-xl z-20">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600"><Compass className="w-5 h-5" /></div>
            <div className="flex flex-col"><span className="text-xs font-bold text-[var(--winter-dark)]">AI Career Match</span><span className="text-[10px] text-[var(--muted-foreground)]">92% Alignment</span></div>
          </div>

          <div className="absolute top-[40%] right-[-5%] glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse-soft shadow-xl z-20" style={{ animationDelay: '1s' }}>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><Target className="w-5 h-5" /></div>
            <div className="flex flex-col"><span className="text-xs font-bold text-[var(--winter-dark)]">Skill Gap Found</span><span className="text-[10px] text-[var(--muted-foreground)]">Analytical Thinking</span></div>
          </div>
          
          <div className="absolute bottom-[20%] left-[-10%] glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse-soft shadow-xl z-20" style={{ animationDelay: '2s' }}>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-500"><BookOpen className="w-5 h-5" /></div>
            <div className="flex flex-col"><span className="text-xs font-bold text-[var(--winter-dark)]">Roadmap Adapted</span><span className="text-[10px] text-[var(--muted-foreground)]">New practice task added</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
