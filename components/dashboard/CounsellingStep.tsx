import { ComponentType, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { UsersRound, FileText, Download, Send, CalendarDays, Video, Check, Mic, MicOff, VideoOff, ArrowRight, ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Career, CareerResult, Counsellor, GapItem, StudentProfile, StudentStep } from "@/lib/figr-product";

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

interface CounsellingStepProps {
  selectedCareerId: string | null;
  setStep: (step: StudentStep) => void;
  activeCareer: Career;
  activeResult: CareerResult;
  evidenceConfidence: string;
  weakest: GapItem;
  gaps: GapItem[];
  rankedCareers: Career[];
  profile: StudentProfile;
  strongSkills: string[];
  counsellors: Counsellor[];
  selectedCounsellorId: string | null;
  setSelectedCounsellorId: (id: string) => void;
  bookingStatus: "idle" | "reserved" | "live";
  setBookingStatus: Dispatch<SetStateAction<"idle" | "reserved" | "live">>;
  setScreen: (screen: "landing" | "student" | "counsellor") => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string) => void;
  selectedCounsellor: Counsellor;
  micOn: boolean;
  setMicOn: (val: boolean | ((prev: boolean) => boolean)) => void;
  videoOn: boolean;
  setVideoOn: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export function CounsellingStep({
  selectedCareerId,
  setStep,
  activeCareer,
  activeResult,
  evidenceConfidence,
  weakest,
  gaps,
  rankedCareers,
  profile,
  strongSkills,
  counsellors,
  selectedCounsellorId,
  setSelectedCounsellorId,
  bookingStatus,
  setBookingStatus,
  selectedSlot,
  setSelectedSlot,
  selectedCounsellor,
  micOn,
  setMicOn,
  videoOn,
  setVideoOn
}: CounsellingStepProps) {
  if (!selectedCareerId) {
    return (
      <EmptyState icon={UsersRound} title="No career selected" text="Choose a career to prepare a human-readable evidence packet and counsellor discussion." action="Go to Careers" onAction={() => setStep("careers")} />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">Step 5 · Human judgement</p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">Human Career Counselling</h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">
          Discuss the selected career with a fictional demonstration counsellor before building the roadmap—or continue without booking.
        </p>
      </div>

      <div className="premium-card p-6 md:p-8 flex items-start gap-6 bg-gradient-to-r from-[#FEF4F1] to-white border-[#F38B75]/30">
        <div className="w-16 h-16 rounded-2xl bg-[#F38B75] text-white flex items-center justify-center shrink-0 shadow-md">
          <UsersRound className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">{activeCareer.title}</h2>
          <p className="text-[var(--muted-foreground)] mb-4">{activeCareer.summary}</p>
          <div className="flex gap-3 text-xs font-bold">
            <span className="px-3 py-1 bg-[var(--winter-bg)] text-[var(--winter-primary)] rounded-full border border-[var(--border)]">{activeResult.match}% match</span>
            <span className="px-3 py-1 bg-[var(--winter-bg)] text-[var(--winter-primary)] rounded-full border border-[var(--border)]">{evidenceConfidence} confidence</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="premium-card p-6">
          <h3 className="text-sm font-bold text-[var(--winter-dark)] uppercase tracking-wider mb-3">Supporting evidence</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {activeResult.supporting.length ? activeResult.supporting.map((skill: string) => <span key={skill} className="px-3 py-1 bg-[var(--winter-bg)] text-[var(--winter-success)] font-bold text-xs rounded-full border border-[var(--winter-success)]/20">{skill}</span>) : <span className="text-xs italic text-[var(--muted-foreground)]">Still collecting evidence</span>}
          </div>
          <h3 className="text-sm font-bold text-[var(--winter-dark)] uppercase tracking-wider mb-3">Conflicting or missing evidence</h3>
          <div className="flex flex-wrap gap-2">
            {activeResult.missing.map((skill: string) => <span key={skill} className="px-3 py-1 bg-[#FEF4F1] text-[var(--coral-accent)] font-bold text-xs rounded-full border border-[var(--coral-accent)]/20">{skill}</span>)}
          </div>
        </section>

        <section className="premium-card p-6">
          <h3 className="text-sm font-bold text-[var(--winter-dark)] uppercase tracking-wider mb-5">Recommendation confidence</h3>
          <div className="flex flex-col gap-4">
            {[["Overall match", activeResult.match], ["Interest alignment", activeResult.interestAlignment], ["Readiness", activeResult.readiness]].map(([label, value]) => (
              <div key={label as string} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-semibold text-[var(--winter-dark)]">
                  <span>{label}</span>
                  <strong className="text-[var(--winter-primary)]">{value}%</strong>
                </div>
                <div className="h-2 w-full bg-[var(--secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--winter-primary)]" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="premium-card p-6 md:p-8 bg-gradient-to-br from-[#F8FBFB] to-white border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-6">Questions to discuss with your counsellor</h2>
          <div className="flex flex-col gap-4">
            {[`Is ${activeCareer.title} realistic given my current ${weakest.skill} gap?`, `What should I prioritise first: ${weakest.skill} or ${gaps[1]?.skill || 'other skills'}?`, `How does this compare with ${rankedCareers.find((item: Career) => item.id !== activeCareer.id)?.title}?`, `Which ${profile.budget.toLowerCase()} resources fit my weekly schedule?`].map((question, index) => (
              <p key={question} className="p-4 rounded-xl bg-white border border-[var(--border)] text-sm text-[var(--winter-dark)] flex gap-3 shadow-sm">
                <strong className="text-[var(--winter-primary)]">Q{index + 1}.</strong> {question}
              </p>
            ))}
          </div>
        </section>

        <section className="premium-card flex flex-col overflow-hidden">
          <header className="bg-[var(--winter-dark)] text-white p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Counsellor Evidence Packet</h2>
              <span className="text-xs text-white/70 uppercase tracking-wider font-bold">Auditable summary</span>
            </div>
          </header>
          <div className="p-6 flex-1 flex flex-col gap-3">
            {[["Student", `${profile.name || "Student"}, ${profile.level}`], ["Selected career", activeCareer.title], ["Alternative path", rankedCareers.find((item: Career) => item.id !== activeCareer.id)?.title || "—"], ["Strongest evidence", strongSkills.join(", ")], ["Highest gap", `${weakest.skill} (${weakest.gap}/10)`], ["Interests", profile.interests.join(", ") || "Not provided"], ["Missing evidence", activeResult.missing.join(", ") || "None"], ["Suggested action", activeCareer.trialTask]].map(([label, value]) => (
              <p key={label} className="flex justify-between items-start gap-4 py-2 border-b border-[var(--border)] last:border-0">
                <small className="text-xs font-semibold text-[var(--muted-foreground)] w-1/3 shrink-0">{label}</small>
                <strong className="text-sm text-[var(--winter-dark)] text-right">{value}</strong>
              </p>
            ))}
          </div>
          <footer className="p-4 bg-[var(--secondary)] border-t border-[var(--border)] flex gap-3">
            <Button variant="outline" onClick={() => window.print()} className="flex-1 bg-white hover:bg-gray-50 border-[var(--border)] text-[var(--winter-dark)] text-xs h-10">
              <Download className="w-3.5 h-3.5 mr-2" /> Print / Save
            </Button>
            <Button variant="outline" onClick={() => toast.success("Evidence packet marked as shared in the prototype.")} className="flex-1 bg-white hover:bg-gray-50 border-[var(--border)] text-[var(--winter-dark)] text-xs h-10">
              <Send className="w-3.5 h-3.5 mr-2" /> Share with Counsellor
            </Button>
          </footer>
        </section>
      </div>

      <section className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--winter-dark)] mb-4">Recommended Counsellors</h2>
          <div className="flex flex-col gap-4">
            {counsellors.map((counsellor) => (
              <button 
                key={counsellor.id} 
                onClick={() => { setSelectedCounsellorId(counsellor.id); setBookingStatus("idle"); }} 
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                  selectedCounsellorId === counsellor.id 
                    ? "border-[var(--winter-primary)] bg-[var(--winter-bg)] shadow-md ring-1 ring-[var(--winter-primary)]" 
                    : "border-[var(--border)] bg-white hover:border-[var(--winter-primary)] hover:shadow-sm"
                }`}
              >
                <span className="w-12 h-12 rounded-full bg-[var(--winter-dark)] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {counsellor.initials}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-base text-[var(--winter-dark)]">{counsellor.name}</strong>
                    <small className="text-[10px] uppercase text-[var(--winter-primary)] font-bold">Demo profile</small>
                  </div>
                  <b className="block text-xs text-[var(--winter-dark)] mb-1">{counsellor.role}</b>
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">{counsellor.focus}</p>
                  <em className="text-[10px] text-[var(--muted-foreground)] not-italic">{counsellor.languages} · {counsellor.experience} · {counsellor.rating}</em>
                </div>
                {selectedCounsellorId === counsellor.id && <Check className="w-6 h-6 text-[var(--winter-primary)] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
        
        <aside className="premium-card p-6 md:p-8 flex flex-col bg-gradient-to-b from-[#FEF4F1] to-white border-[#F38B75]/30">
          <p className="text-[10px] uppercase font-bold text-[#E85F40] tracking-widest mb-1">Video consultation</p>
          <h2 className="text-2xl font-bold text-[var(--winter-dark)] mb-2">25-minute guidance call</h2>
          <p className="text-[var(--muted-foreground)] mb-6 text-sm">Simulated booking for prototype demonstration. No camera or microphone permission is requested.</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["Tomorrow · 10:00 AM", "Tomorrow · 3:00 PM", "In 2 days · 11:30 AM", "In 3 days · 4:00 PM"].map((slot) => (
              <button 
                key={slot} 
                className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                  selectedSlot === slot 
                    ? "bg-[#F38B75] text-white border-[#E85F40] shadow-sm" 
                    : "bg-white text-[var(--winter-dark)] border-[var(--border)] hover:border-[#F38B75]"
                }`} 
                onClick={() => { setSelectedSlot(slot); setBookingStatus("idle"); }}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {slot}
              </button>
            ))}
          </div>
          
          <Button onClick={() => setBookingStatus("reserved")} className="btn-coral w-full h-12 text-sm mt-auto">
            <Video className="w-4 h-4 mr-2" /> Book Video Consultation
          </Button>
          
          {bookingStatus !== "idle" && (
            <div className="mt-4 p-4 rounded-xl bg-[var(--winter-success)]/10 border border-[var(--winter-success)]/30 flex items-center gap-4 text-[var(--winter-dark)]">
              <div className="w-10 h-10 rounded-full bg-[var(--winter-success)] text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold">Demo session reserved</strong>
                <small className="block text-xs">{selectedCounsellor.name} · {selectedSlot}</small>
              </div>
            </div>
          )}
        </aside>
      </section>

      {bookingStatus !== "idle" && (
        <section className="premium-card overflow-hidden border-[#F38B75]/50 shadow-lg">
          <div className="bg-[#1A1A1A] p-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative min-h-[300px]">
            <div className="relative text-center z-10">
              <span className="w-24 h-24 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-3xl shadow-xl mx-auto mb-3 ring-4 ring-white/10">
                {profile.name.charAt(0) || "S"}
              </span>
              <small className="text-white/80 font-medium">{profile.name || "Student"}</small>
            </div>
            
            <div className="text-white/30 font-bold hidden md:block z-10">VS</div>
            
            <div className="relative text-center z-10">
              <span className="w-24 h-24 rounded-2xl bg-[#E85F40] text-white flex items-center justify-center font-bold text-3xl shadow-xl mx-auto mb-3 ring-4 ring-white/10">
                {selectedCounsellor.initials}
              </span>
              <small className="text-white/80 font-medium">{selectedCounsellor.name}</small>
            </div>
          </div>
          
          <div className="bg-white p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setMicOn((val: boolean) => !val)} 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  micOn ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setVideoOn((val: boolean) => !val)} 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  videoOn ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            </div>
            
            <p className="text-xs font-semibold text-[var(--muted-foreground)]">
              {bookingStatus === "live" ? "Demo consultation in progress · simulated interface" : "Ready to preview the simulated consultation"}
            </p>
            
            <Button onClick={() => setBookingStatus((val: string) => val === "live" ? "reserved" : "live")} className="btn-coral px-6">
              {bookingStatus === "live" ? "End Demo Session" : "Start Demo Consultation"}
            </Button>
          </div>
        </section>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-[var(--border)]">
        <Button variant="outline" onClick={() => setStep("gaps")} className="btn-secondary h-12 px-6">
          Continue Without Booking
        </Button>
        <Button onClick={() => setStep("gaps")} className="btn-primary h-12 px-6 shadow-md shadow-[var(--winter-primary)]/30">
          Continue to Skill Gaps <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
