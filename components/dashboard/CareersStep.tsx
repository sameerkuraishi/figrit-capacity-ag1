import { ComponentType } from "react";
import { Compass, Search, UsersRound, Check, LayoutGrid, BarChart3, Code2, Palette, Calculator, ChefHat, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CareerResult, StudentStep } from "@/lib/figr-product";

// Internal icon mapping for the Careers Step
const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  "Technology & Engineering": Code2,
  "Data & Analytics": BarChart3,
  "Design & Arts": Palette,
  "Business & Marketing": Activity,
  "Finance & Operations": Calculator,
  "Hospitality & Culinary": ChefHat,
};

const categoryShort: Record<string, string> = {
  "Technology & Engineering": "Tech",
  "Data & Analytics": "Data",
  "Design & Arts": "Design",
  "Business & Marketing": "Business",
  "Finance & Operations": "Finance",
  "Hospitality & Culinary": "Hospitality",
};

interface ScoreRingProps {
  value: number;
}

function ScoreRing({ value }: ScoreRingProps) {
  const dasharray = `${value} 100`;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <path
          className="text-[var(--border)] stroke-current"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-[var(--winter-primary)] stroke-current"
          strokeWidth="3"
          strokeDasharray={dasharray}
          fill="none"
          strokeLinecap="round"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <strong className="text-xs font-bold text-[var(--winter-dark)]">{value}%</strong>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action, onAction }: { icon: ComponentType<{ className?: string }>; title: string; text: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] text-[var(--winter-primary)] flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">{title}</h2>
      <p className="text-[var(--muted-foreground)] max-w-md mb-8">{text}</p>
      <Button onClick={onAction} className="btn-primary">
        {action}
      </Button>
    </div>
  );
}

interface CareersStepProps {
  assessmentDone: boolean;
  setStep: (step: StudentStep) => void;
  careersLength: number;
  careerSearch: string;
  setCareerSearch: (val: string) => void;
  careerCategory: string;
  setCareerCategory: (val: string) => void;
  filteredCareers: CareerResult[];
  compareIds: string[];
  toggleCompare: (id: string) => void;
  chooseCareer: (id: string) => void;
  evidenceConfidence: string;
  compared: CareerResult[];
  setCompareIds: (ids: string[]) => void;
  categories: string[];
}

export function CareersStep({
  assessmentDone,
  setStep,
  careersLength,
  careerSearch,
  setCareerSearch,
  careerCategory,
  setCareerCategory,
  filteredCareers,
  compareIds,
  toggleCompare,
  chooseCareer,
  evidenceConfidence,
  compared,
  setCompareIds,
  categories,
}: CareersStepProps) {
  if (!assessmentDone) {
    return (
      <EmptyState 
        icon={Compass} 
        title="Complete the assessment first" 
        text="Career rankings need demonstrated evidence before they can be explained responsibly." 
        action="Go to Assessment" 
        onAction={() => setStep("assessment")} 
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 4 · Transparent career fit</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Career Navigator</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          Twenty-one technical and non-technical paths are ranked using 45% skill evidence, 35% requirement fit and 20% interest alignment.
        </p>
      </div>

      <div className="premium-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-white to-[var(--secondary)]">
        <label className="relative w-full md:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input 
            value={careerSearch} 
            onChange={(e) => setCareerSearch(e.target.value)} 
            placeholder={`Search ${careersLength} careers`} 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] outline-none focus:border-[var(--winter-primary)] transition-colors text-sm"
          />
        </label>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
          <button 
            onClick={() => setCareerCategory("All")} 
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              careerCategory === "All" ? "bg-[var(--winter-dark)] text-white shadow-sm" : "bg-white text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button 
              key={category} 
              onClick={() => setCareerCategory(category)} 
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                careerCategory === category ? "bg-[var(--winter-dark)] text-white shadow-sm" : "bg-white text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]"
              }`}
            >
              {categoryShort[category] || category}
            </button>
          ))}
        </div>
      </div>

      {compared.length === 2 && (
        <section className="premium-card p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-md">
          <div className="flex justify-between items-end mb-6 border-b border-indigo-100 pb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest mb-1">Side-by-side evidence</p>
              <h2 className="text-xl font-bold text-[var(--winter-dark)]">Career Comparison</h2>
            </div>
            <button onClick={() => setCompareIds([])} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Clear Comparison
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-indigo-100">
            {compared.map((career) => (
              <div key={career.id} className="pt-6 md:pt-0 md:px-6 first:pt-0 first:px-0 first:pr-6">
                <h3 className="text-lg font-bold text-[var(--winter-dark)] mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: career.color }}>
                    <LayoutGrid className="w-4 h-4" />
                  </span>
                  {career.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-white border border-indigo-50 rounded-xl shadow-sm text-center">
                    <strong className="block text-2xl font-bold text-indigo-600">{career.match}%</strong>
                    <small className="block text-[10px] uppercase font-bold text-[var(--muted-foreground)] mt-1">Transparent fit</small>
                  </div>
                  <div className="p-3 bg-white border border-indigo-50 rounded-xl shadow-sm text-center">
                    <strong className="block text-2xl font-bold text-teal-600">{career.readiness}%</strong>
                    <small className="block text-[10px] uppercase font-bold text-[var(--muted-foreground)] mt-1">Readiness</small>
                  </div>
                </div>
                
                <div className="mb-4">
                  <small className="block text-xs uppercase font-bold text-[var(--muted-foreground)] mb-2">Top Gap</small>
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100">
                    {career.missing[0] || "More evidence needed"}
                  </span>
                </div>
                
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm text-[var(--winter-dark)]">
                  <strong className="text-indigo-900 block mb-1">10-Min Trial Task:</strong>
                  {career.trialTask}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career, index) => {
          const CareerIcon = categoryIcons[career.category] || Compass;
          const comparedNow = compareIds.includes(career.id);
          const isFeatured = index === 0 && careerCategory === "All" && careerSearch === "";
          
          return (
            <article 
              key={career.id} 
              className={`premium-card flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl ${
                isFeatured ? "md:col-span-2 lg:col-span-3 lg:flex-row shadow-lg ring-1 ring-[var(--winter-primary)]" : ""
              }`}
            >
              <div className={`p-6 border-b border-[var(--border)] flex justify-between items-start ${isFeatured ? "lg:w-1/3 lg:border-b-0 lg:border-r bg-gradient-to-br from-[#F0F8F8] to-white" : "bg-gradient-to-br from-[#F8FBFB] to-white"}`}>
                <div className="flex flex-col gap-3">
                  <span 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" 
                    style={{ color: career.color, backgroundColor: `${career.color}15` }}
                  >
                    <CareerIcon className="w-6 h-6" />
                  </span>
                  <div>
                    <small className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider">{career.category}</small>
                    <h2 className="text-xl font-bold text-[var(--winter-dark)] leading-tight mt-1">{career.title}</h2>
                  </div>
                </div>
                <ScoreRing value={career.match} />
              </div>
              
              <div className={`flex flex-col flex-1 p-6 ${isFeatured ? "lg:w-2/3 lg:flex-row gap-6" : ""}`}>
                <div className="flex-1">
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
                    {career.summary}
                  </p>
                  
                  <div className="flex gap-4 mb-6 pt-4 border-t border-[var(--border)] text-xs font-semibold text-[var(--winter-dark)]">
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[var(--winter-success)]" /> {evidenceConfidence} confidence</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[var(--winter-success)]" /> {career.interestAlignment}% interest</span>
                  </div>
                </div>
                
                <div className={`flex flex-col gap-4 mb-6 ${isFeatured ? "lg:mb-0 lg:w-1/2 lg:pl-6 lg:border-l lg:border-[var(--border)]" : ""}`}>
                  <div>
                    <small className="block text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-2">Supporting evidence</small>
                    <div className="flex flex-wrap gap-1.5">
                      {career.supporting.length ? career.supporting.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-[var(--winter-bg)] text-[var(--winter-success)] text-[10px] font-bold rounded-md border border-[var(--winter-success)]/20">
                          {skill}
                        </span>
                      )) : <span className="text-xs italic text-[var(--muted-foreground)]">Build more evidence</span>}
                    </div>
                  </div>
                  <div>
                    <small className="block text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-2">Missing evidence</small>
                    <div className="flex flex-wrap gap-1.5">
                      {career.missing.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-[#FEF4F1] text-[var(--coral-accent)] text-[10px] font-bold rounded-md border border-[var(--coral-accent)]/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`flex gap-3 mt-auto ${isFeatured ? "lg:w-full lg:mt-6" : ""}`}>
                  <Button onClick={() => chooseCareer(career.id)} className="btn-primary flex-1">
                    Select <UsersRound className="w-4 h-4 ml-1.5" />
                  </Button>
                  <Button variant="outline" onClick={() => toggleCompare(career.id)} className={`flex-1 transition-colors ${comparedNow ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "btn-secondary"}`}>
                    {comparedNow ? <><Check className="w-4 h-4 mr-1.5" /> Added</> : <><Compass className="w-4 h-4 mr-1.5" /> Compare</>}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
