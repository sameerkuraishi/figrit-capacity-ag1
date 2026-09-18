import { MessageSquareText, Compass, Target, WandSparkles, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: MessageSquareText,
      title: "Learning Companion",
      desc: "Context-aware support using your roadmap, gaps, and quiz history. Talk to a guide that actually knows what you're studying.",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Compass,
      title: "Career Navigator",
      desc: "Transparent weighted scoring across technical and non-technical careers. See exactly why a path fits you.",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: Target,
      title: "Skill Gap Analysis",
      desc: "Compare your current evidence against required levels. Instantly know your next most useful learning action.",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: WandSparkles,
      title: "Adaptive Roadmap",
      desc: "The visual path changes after checkpoint evidence. If you struggle, the roadmap adjusts to help you recover.",
      color: "text-teal-500",
      bg: "bg-teal-50",
    }
  ];

  return (
    <section id="journey" className="relative z-10 w-full max-w-[1230px] mx-auto px-6 py-20 border-t border-[var(--border)]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--winter-dark)] mb-4">Your Guided Discovery Journey</h2>
        <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">Figure It is not just an assessment. It&apos;s an intelligent companion that stays with you as you explore, learn, and grow.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="premium-card p-6 flex flex-col items-start text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.bg} ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-2">{item.title}</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-24 glass-panel p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h3 className="text-2xl font-heading font-bold text-[var(--winter-dark)] mb-4">Trust built on transparency</h3>
          <ul className="space-y-3">
            {["Designed specifically for Indian students", "Focuses on budget-aware learning recommendations", "No fake placement statistics or guaranteed admissions"].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--winter-success)] shrink-0 mt-0.5" />
                <span className="text-[var(--muted-foreground)]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative w-full md:w-[400px] h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--winter-light)] to-[var(--winter-bg)] border border-[var(--border)] flex items-center justify-center">
             <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 text-[var(--winter-primary)]">
                    <Target className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-[var(--winter-dark)] text-lg">Adaptive System</h4>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">The roadmap dynamically inserts prerequisites based on quiz performance.</p>
             </div>
        </div>
      </div>
    </section>
  );
}
