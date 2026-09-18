import { Check, Compass, Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Track, StudentProfile, StudentStep, CoreSkill } from "@/lib/figr-product";

interface ProfileStepProps {
  profile: StudentProfile;
  updateProfile: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void;
  changeTrack: (track: Track) => void;
  tracks: string[];
  interestChoices: string[];
  coreSkills: CoreSkill[];
  careersCount: number;
  loadDemoStudent: () => void;
  setStep: (step: StudentStep) => void;
}

export function ProfileStep({
  profile,
  updateProfile,
  changeTrack,
  tracks,
  interestChoices,
  coreSkills,
  careersCount,
  loadDemoStudent,
  setStep,
}: ProfileStepProps) {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 1 · Student discovery passport</p>
          <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Start with broad interests—not a job title</h1>
          <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
            A Class 11 student shouldn&apos;t need to understand machine learning vs. data analytics before receiving guidance. Choose a broad direction or keep exploring.
          </p>
        </div>
        <Button variant="outline" onClick={loadDemoStudent} className="btn-secondary whitespace-nowrap">
          <Sparkles className="w-4 h-4" /> Load Demo Student
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 premium-card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-[var(--winter-dark)] border-b border-[var(--border)] pb-4">Academic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--winter-dark)]">
              Student Name
              <input 
                className="px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--winter-primary)] focus:ring-2 focus:ring-[var(--winter-light)] outline-none transition-all font-normal"
                value={profile.name} 
                onChange={(e) => updateProfile("name", e.target.value)} 
                placeholder="Enter your name" 
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--winter-dark)]">
              Class / Academic Level
              <select 
                className="px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--winter-primary)] focus:ring-2 focus:ring-[var(--winter-light)] outline-none transition-all font-normal bg-white"
                value={profile.level} 
                onChange={(e) => updateProfile("level", e.target.value)}
              >
                {["Class 9", "Class 10", "Class 11", "Class 12", "Undergraduate"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--winter-dark)]">
              Career direction (optional)
              <select 
                className="px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--winter-primary)] focus:ring-2 focus:ring-[var(--winter-light)] outline-none transition-all font-normal bg-white"
                value={profile.track} 
                onChange={(e) => changeTrack(e.target.value as Track)}
              >
                {tracks.map((item) => <option key={item}>{item}</option>)}
              </select>
              <small className="text-xs text-[var(--muted-foreground)] font-normal">Helps organize career results. Your Interest Constellation now builds the assessment questions.</small>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--winter-dark)]">
              Learning Budget
              <select 
                className="px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--winter-primary)] focus:ring-2 focus:ring-[var(--winter-light)] outline-none transition-all font-normal bg-white"
                value={profile.budget} 
                onChange={(e) => updateProfile("budget", e.target.value)}
              >
                {["Free resources only", "Up to ₹500 per month", "Up to ₹2,000 per month", "Flexible"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <label className="flex flex-col gap-4 text-sm font-semibold text-[var(--winter-dark)]">
              <div className="flex justify-between items-center">
                <span>Weekly Study Hours</span>
                <strong className="text-[var(--winter-primary)] bg-[var(--winter-light)] px-3 py-1 rounded-full">{profile.weeklyHours} hrs/week</strong>
              </div>
              <input 
                type="range" min="1" max="15" 
                value={profile.weeklyHours} 
                onChange={(e) => updateProfile("weeklyHours", Number(e.target.value))} 
                className="w-full accent-[var(--winter-primary)]" 
              />
            </label>
          </div>
        </section>

        <aside className="premium-card p-6 md:p-8 bg-gradient-to-b from-[#FFFFFF] to-[#F8FBFB] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[var(--winter-light)] text-[var(--winter-primary)] flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-[var(--winter-dark)]">
              {profile.interests.length ? "Ready to explore" : "Add your interests"}
            </h2>
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center shadow-sm">
                <strong className="block text-2xl font-bold text-[var(--winter-dark)]">{profile.interests.length}</strong>
                <span className="text-xs text-[var(--muted-foreground)]">Interest signals</span>
              </div>
              <div className="bg-[var(--secondary)] border border-[var(--winter-muted)] rounded-xl p-4 text-center shadow-sm">
                <strong className="block text-2xl font-bold text-[var(--winter-success)]">{careersCount}</strong>
                <span className="text-xs text-[var(--winter-dark)]">Career paths</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-3 text-sm text-orange-800">
            <Lightbulb className="w-5 h-5 shrink-0 text-orange-500" />
            <p>Student-friendly by design: first discover a direction, then inspect specialised careers.</p>
          </div>
        </aside>
      </div>

      <section className="premium-card p-6 md:p-8">
        <h2 className="text-xl font-bold mb-2 text-[var(--winter-dark)]">Interest Constellation</h2>
        <p className="text-[var(--muted-foreground)] mb-6">Select 2–6 areas that genuinely spark your curiosity. Your choices will build a personalized 10-question assessment.</p>
        <div className="flex flex-wrap gap-3">
          {interestChoices.map((item) => {
            const selected = profile.interests.includes(item);
            return (
              <button 
                key={item} 
                onClick={() => updateProfile(
                  "interests",
                  selected
                    ? profile.interests.filter((i) => i !== item)
                    : profile.interests.length < 6
                      ? [...profile.interests, item]
                      : profile.interests,
                )}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  selected 
                    ? "bg-[var(--winter-primary)] text-white border-[var(--winter-primary)] shadow-md" 
                    : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--winter-primary)] hover:text-[var(--winter-dark)]"
                }`}
              >
                {selected && <Check className="w-4 h-4" />}
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-[var(--winter-primary)]">Personalized assessment input</p>
            <p className="text-sm text-[var(--winter-dark)] mt-1">
              {profile.interests.length
                ? `${profile.interests.length}/6 interests selected · questions will be matched to this constellation.`
                : "Choose at least two interests to personalize your assessment."}
            </p>
          </div>
          <span className="text-xs font-bold text-[var(--winter-primary)] bg-white border border-[var(--border)] px-3 py-2 rounded-full whitespace-nowrap">
            10 questions · ~5 minutes
          </span>
        </div>
      </section>

      <section className="premium-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--winter-dark)]">Self-Rated Transferable Skills</h2>
            <p className="text-[var(--muted-foreground)] mt-1">Rate broad strengths now. Career-specific abilities appear later.</p>
          </div>
          <span className="text-xs font-bold text-[var(--winter-primary)] bg-[var(--winter-light)] px-3 py-1 rounded-full">0 = new · 10 = confident</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
          {coreSkills.map((skill) => (
            <label key={skill} className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-semibold text-[var(--winter-dark)]">
                <span>{skill}</span>
                <strong className="text-[var(--winter-primary)]">{profile.selfRatings[skill]}/10</strong>
              </div>
              <input 
                type="range" min="0" max="10" 
                value={profile.selfRatings[skill]} 
                onChange={(e) => updateProfile("selfRatings", { ...profile.selfRatings, [skill]: Number(e.target.value) })} 
                className="w-full accent-[var(--winter-primary)]" 
              />
            </label>
          ))}
        </div>
        
        <div className="flex justify-end pt-6 border-t border-[var(--border)]">
          <Button
            onClick={() => setStep("assessment")}
            disabled={profile.interests.length < 2}
            className="btn-primary text-base px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Personalized Assessment <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
