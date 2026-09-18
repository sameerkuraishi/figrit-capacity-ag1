"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Languages, MessageSquareText, Search, Star, UserRoundCheck, X } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/capacity-api";
import { demoBookings, demoExperts } from "@/lib/capacity-demo";
import type { MentorBooking, ExpertRecord } from "@/lib/capacity-types";
import { Pill, SectionTitle } from "./ui";

const fallbackSlots = [
  "2026-09-16T18:00:00+05:30",
  "2026-09-16T18:30:00+05:30",
  "2026-09-17T11:30:00+05:30",
  "2026-09-17T17:00:00+05:30",
  "2026-09-18T16:30:00+05:30",
];

function prettySlot(value: string) {
  const date = new Date(value);
  return date.toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function getMatchReason(mentor: ExpertRecord, competency: string, searchTerm: string) {
  let reasons = [];
  if (competency !== "All Competencies" && mentor.expertise.some(e => e.toLowerCase() === competency.toLowerCase())) {
    reasons.push(`Supports ${competency}`);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    if (mentor.name.toLowerCase().includes(term)) {
      reasons.push("Name matches");
    } else if (mentor.designation.toLowerCase().includes(term)) {
      reasons.push("Role matches");
    } else if (mentor.expertise.some(e => e.toLowerCase().includes(term) && e.toLowerCase() !== competency.toLowerCase())) {
      reasons.push("Expertise matches");
    }
  }
  return reasons.join(" • ") || "General match";
}

export default function MentorMarketplace({ token, initialCompetency = "Marketing Analytics" }: { token?: string; initialCompetency?: string }) {
  const [competency, setCompetency] = useState(initialCompetency);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentors, setMentors] = useState<ExpertRecord[]>([]);
  const [bookings, setBookings] = useState<MentorBooking[]>(demoBookings);
  const [selectedMentor, setSelectedMentor] = useState<ExpertRecord | null>(null);
  const [duration, setDuration] = useState<20 | 30>(20);
  const [slots, setSlots] = useState<string[]>(fallbackSlots);
  const [selectedSlot, setSelectedSlot] = useState<string>(fallbackSlots[0]);
  const [reason, setReason] = useState("Weak assessment area");
  const [note, setNote] = useState("I want help understanding the highest-priority gap in my current learning path.");
  const [loading, setLoading] = useState(false);

  // Filter experts based on the selected competency gap
  useEffect(() => {
    setLoading(true);
    // Simulate API call for fetching experts
    setTimeout(() => {
      const filtered = demoExperts.filter(exp => {
        const matchesCompetency = competency === "All Competencies" || exp.expertise.some(skill => skill.toLowerCase() === competency.toLowerCase());
        if (!matchesCompetency) return false;

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesName = exp.name.toLowerCase().includes(term);
          const matchesRole = exp.designation.toLowerCase().includes(term);
          const matchesExpertise = exp.expertise.some(skill => skill.toLowerCase().includes(term));
          return matchesName || matchesRole || matchesExpertise;
        }

        return true;
      });
      setMentors(filtered);
      setLoading(false);
      // Reset selected mentor if they no longer match the filter
      if (selectedMentor && !filtered.find(m => m.id === selectedMentor.id)) {
        setSelectedMentor(null);
      }
    }, 400); // simulated delay

    if (!token) return;
    apiRequest<{ bookings: MentorBooking[] }>("/mentor-bookings/", {}, token).then((r) => {
      if (r.ok && r.data) setBookings(r.data.bookings);
    });
  }, [token, competency, searchTerm, selectedMentor]);

  useEffect(() => {
    if (!selectedMentor) return;
    // Mock fetching slots based on duration
    const newSlots = duration === 20 ? fallbackSlots : fallbackSlots.slice(1, 4);
    setSlots(newSlots);
    if (!newSlots.includes(selectedSlot)) {
      setSelectedSlot(newSlots[0] || "");
    }
  }, [selectedMentor, duration, selectedSlot]);

  const upcoming = useMemo(() => bookings.find((item) => item.status === "scheduled"), [bookings]);

  async function book() {
    if (!selectedMentor || !selectedSlot) return;
    setLoading(true);
    if (token) {
      const response = await apiRequest<{ booking: MentorBooking }>("/mentor-bookings/", {
        method: "POST",
        body: JSON.stringify({ trainer_id: selectedMentor.id, start_at: selectedSlot, duration_minutes: duration, reason, note, competency }),
      }, token);
      setLoading(false);
      if (!response.ok || !response.data) {
        toast.error(response.error || "Could not book session");
        return;
      }
      setBookings((prev) => [response.data!.booking, ...prev]);
    } else {
      const booking: MentorBooking = {
        id: Date.now(), trainerId: selectedMentor.id, trainerName: selectedMentor.name, startAt: selectedSlot,
        durationMinutes: duration, reason, note, competency, status: "scheduled",
      };
      setBookings((prev) => [booking, ...prev]);
      setLoading(false);
    }
    toast.success(`${duration}-minute session booked with ${selectedMentor.name}.`);
    setSelectedMentor(null);
  }

  return (
    <div>
      <SectionTitle eyebrow="On-demand human guidance" title="Book an expert when you need one" description="Mentors are not permanently assigned. Capacity Connect recommends experts for your current gap, then you choose a 20 or 30 minute slot." />

      {upcoming && (
        <div className="cc-card p-5 mb-5 bg-[#F3FAF7] border-[#CEE8DE]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-3 items-start"><span className="cc-icon-tile bg-white"><CalendarDays className="w-5 h-5" /></span><div><p className="cc-eyebrow">Upcoming mentor session</p><h3 className="font-semibold">{upcoming.trainerName} · {upcoming.durationMinutes} min</h3><p className="text-sm text-[var(--muted-foreground)] mt-1">{prettySlot(upcoming.startAt)} · {upcoming.reason}</p></div></div>
            <Pill tone="teal">Scheduled</Pill>
          </div>
        </div>
      )}

      <div className="cc-card p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><p className="cc-eyebrow">Current guidance need</p><h3 className="font-semibold">Find experts for your skill gap</h3></div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input 
                type="text" 
                placeholder="Search by name, role, or expertise..." 
                className="cc-input pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="cc-select w-full sm:w-auto" value={competency} onChange={(e) => setCompetency(e.target.value)}>
              {['All Competencies', 'Marketing Analytics', 'Paid Advertising', 'A/B Testing', 'Conversion Optimization'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        {loading && mentors.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-[var(--muted-foreground)]">Finding the best experts for {competency}...</div>
        ) : mentors.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-[var(--muted-foreground)] border border-dashed border-[#DCE7E8] rounded-2xl">No verified experts currently available for {competency}.</div>
        ) : mentors.map((mentor, index) => (
          <div className="cc-card p-5 flex flex-col" key={mentor.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3"><span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DFF2EF] to-[#EAF1F1] text-[#0B2E33] flex items-center justify-center font-bold">{mentor.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span><div><h3 className="font-semibold">{mentor.name}</h3><p className="text-xs text-[var(--muted-foreground)] mt-1">{mentor.designation}</p><p className="text-xs text-[#12806F] mt-1 font-medium">{getMatchReason(mentor, competency, searchTerm)}</p></div></div>
              <Pill tone={index === 0 ? "teal" : "neutral"}>{index === 0 ? "Top match" : "Good match"}</Pill>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#50686B] mt-4"><span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[#E7AD3F] text-[#E7AD3F]" />{mentor.rating}</span><span className="flex items-center gap-1"><UserRoundCheck className="w-3.5 h-3.5" />{mentor.experienceYears} yrs</span><span className="flex items-center gap-1"><Languages className="w-3.5 h-3.5" />English</span></div>
            <div className="mt-4 space-y-2 flex-1">{mentor.expertise.map((x) => <div className="flex gap-2 text-xs" key={x}><span className="w-4 h-4 rounded-full bg-[#E9F7F3] text-[#12806F] flex items-center justify-center"><Check className="w-2.5 h-2.5" /></span>{x}</div>)}</div>
            <div className="mt-5 pt-4 border-t border-[#E4ECEC] flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold">Next available</p><p className="text-xs font-medium mt-1">{mentor.availability}</p></div><button className="btn-primary py-2 px-3 text-sm" onClick={() => setSelectedMentor(mentor)}>Book session</button></div>
          </div>
        ))}
      </div>

      {selectedMentor && (
        <div className="fixed inset-0 z-[100] bg-[#071E22]/45 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={() => setSelectedMentor(null)}>
          <div className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl border border-white/70 overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#E4ECEC] flex items-center justify-between gap-4 bg-[#FBFDFD]"><div><p className="cc-eyebrow">Book expert session</p><h3 className="text-xl font-semibold">{selectedMentor.name}</h3><p className="text-xs text-[var(--muted-foreground)] mt-1">Matched for {competency}</p></div><button className="w-9 h-9 rounded-xl bg-[#F0F4F4] flex items-center justify-center" onClick={() => setSelectedMentor(null)}><X className="w-4 h-4" /></button></div>
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <label className="cc-label">Session duration</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[20, 30].map((value) => <button key={value} className={`rounded-2xl border p-4 text-left ${duration === value ? "border-[#4F7C82] bg-[#F0F7F6]" : "border-[#DCE7E8]"}`} onClick={() => setDuration(value as 20 | 30)}><Clock3 className="w-4 h-4 mb-2 text-[#4F7C82]" /><strong>{value} minutes</strong><p className="text-xs text-[var(--muted-foreground)] mt-1">{value === 20 ? "Focused doubt / review" : "Deeper case or path guidance"}</p></button>)}
              </div>
              <label className="cc-label mt-5">Available slot</label>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">{slots.length ? slots.slice(0, 8).map((slot) => <button key={slot} className={`rounded-xl border p-3 text-xs text-left ${selectedSlot === slot ? "border-[#4F7C82] bg-[#F0F7F6]" : "border-[#DCE7E8]"}`} onClick={() => setSelectedSlot(slot)}>{prettySlot(slot)}</button>) : <div className="col-span-2 text-sm text-[var(--muted-foreground)] p-4 bg-[#F7FAFA] rounded-xl">No open slots for this duration. Try another duration or mentor.</div>}</div>
              <label className="cc-label mt-5">Reason</label>
              <select className="cc-select mt-2 w-full" value={reason} onChange={(e) => setReason(e.target.value)}>{["Concept doubt", "Weak assessment area", "Learning path guidance", "Practical case discussion", "Project/problem discussion", "Other"].map((x) => <option key={x}>{x}</option>)}</select>
              <label className="cc-label mt-5">What do you want help with?</label>
              <textarea className="cc-input mt-2 w-full min-h-24 resize-none" value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" onClick={() => setSelectedMentor(null)}>Cancel</button><button className="btn-primary" disabled={!selectedSlot || loading} onClick={book}><MessageSquareText className="w-4 h-4" />{loading ? "Booking…" : `Confirm ${duration} min session`}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
