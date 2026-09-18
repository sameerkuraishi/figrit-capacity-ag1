"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  Code2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { StudentProfile } from "@/lib/figr-product";

type Alumni = {
  id: string;
  name: string;
  initials: string;
  graduation: string;
  branch: string;
  company: string;
  role: string;
  location: string;
  skills: string[];
  focus: string;
  availableFor: string[];
  linkedin: string;
  github: string;
  verified: boolean;
};

const alumniData: Alumni[] = [
  {
    id: "al-001",
    name: "Aarav Mehta",
    initials: "AM",
    graduation: "2022",
    branch: "B.Tech CSE",
    company: "Microsoft",
    role: "Software Engineer",
    location: "Bengaluru, India",
    skills: ["Python", "DSA", "Azure", "System Design"],
    focus: "Software engineering & placements",
    availableFor: ["Career guidance", "Interview prep", "Referral guidance"],
    linkedin: "#",
    github: "#",
    verified: true,
  },
  {
    id: "al-002",
    name: "Riya Sharma",
    initials: "RS",
    graduation: "2021",
    branch: "B.Tech AI & ML",
    company: "Google",
    role: "ML Engineer",
    location: "Hyderabad, India",
    skills: ["Python", "ML", "TensorFlow", "MLOps"],
    focus: "AI/ML careers",
    availableFor: ["AI roadmap", "Portfolio review", "Higher studies"],
    linkedin: "#",
    github: "#",
    verified: true,
  },
  {
    id: "al-003",
    name: "Kunal Verma",
    initials: "KV",
    graduation: "2023",
    branch: "B.Tech CSE",
    company: "Amazon",
    role: "SDE I",
    location: "Pune, India",
    skills: ["Java", "DSA", "AWS", "Backend"],
    focus: "Product companies & DSA",
    availableFor: ["DSA prep", "Resume review", "Mock interview"],
    linkedin: "#",
    github: "#",
    verified: true,
  },
  {
    id: "al-004",
    name: "Ananya Singh",
    initials: "AS",
    graduation: "2020",
    branch: "B.Tech IT",
    company: "Deloitte",
    role: "Technology Consultant",
    location: "Gurugram, India",
    skills: ["Cloud", "SQL", "Consulting", "Analytics"],
    focus: "Tech consulting & analytics",
    availableFor: ["Career switch", "Resume review", "Consulting"],
    linkedin: "#",
    github: "#",
    verified: true,
  },
  {
    id: "al-005",
    name: "Vivek Nair",
    initials: "VN",
    graduation: "2019",
    branch: "B.Tech ECE",
    company: "NVIDIA",
    role: "AI Software Engineer",
    location: "Noida, India",
    skills: ["C++", "CUDA", "Deep Learning", "Python"],
    focus: "AI systems & engineering",
    availableFor: ["AI systems", "Research careers", "Projects"],
    linkedin: "#",
    github: "#",
    verified: true,
  },
  {
    id: "al-006",
    name: "Sneha Kapoor",
    initials: "SK",
    graduation: "2024",
    branch: "B.Tech CSE",
    company: "Flipkart",
    role: "Software Engineer",
    location: "Bengaluru, India",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    focus: "Full-stack development",
    availableFor: ["Web development", "Projects", "Internships"],
    linkedin: "#",
    github: "#",
    verified: true,
  },
];

const years = ["All years", "2024", "2023", "2022", "2021", "2020", "2019"];

export function AlumniConnectStep({
  profile,
}: {
  profile: StudentProfile;
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All years");
  const [tab, setTab] = useState<"discover" | "connections" | "mentorship">("discover");
  const [connected, setConnected] = useState<string[]>([]);
  const [mentor, setMentor] = useState<Alumni | null>(null);
  const [message, setMessage] = useState(
    `Hi! I’m ${profile.name || "a student"} from FIGR IT. I’d love to learn about your journey and get some career guidance.`
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return alumniData.filter((alumni) => {
      const matchesYear = year === "All years" || alumni.graduation === year;
      const haystack = [
        alumni.name,
        alumni.company,
        alumni.role,
        alumni.branch,
        alumni.location,
        alumni.focus,
        ...alumni.skills,
      ].join(" ").toLowerCase();
      return matchesYear && (!q || haystack.includes(q));
    });
  }, [query, year]);

  const visible = tab === "connections"
    ? filtered.filter((alumni) => connected.includes(alumni.id))
    : filtered;

  function toggleConnection(alumni: Alumni) {
    setConnected((current) => {
      const exists = current.includes(alumni.id);
      const next = exists
        ? current.filter((id) => id !== alumni.id)
        : [...current, alumni.id];
      toast.success(
        exists
          ? `${alumni.name} removed from your connections.`
          : `Connection request sent to ${alumni.name}.`
      );
      return next;
    });
  }

  function sendMentorshipRequest() {
    if (!mentor) return;
    if (!message.trim()) {
      toast.error("Add a short message before sending.");
      return;
    }
    toast.success(`Mentorship request sent to ${mentor.name}.`);
    setMentor(null);
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[var(--winter-light)] opacity-30 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--winter-primary)]">
              <Sparkles className="h-4 w-4" /> Alumni Network
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--winter-dark)]">
              Learn from people who were once where you are.
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Discover verified alumni, build professional connections and ask for
              practical mentorship on careers, projects, placements and higher studies.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl bg-[var(--secondary)] px-4 py-3 text-center">
              <strong className="block text-xl text-[var(--winter-dark)]">{alumniData.length}</strong>
              <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">Alumni</span>
            </div>
            <div className="rounded-xl bg-[var(--secondary)] px-4 py-3 text-center">
              <strong className="block text-xl text-[var(--winter-dark)]">{connected.length}</strong>
              <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">Connections</span>
            </div>
            <div className="rounded-xl bg-[var(--secondary)] px-4 py-3 text-center">
              <strong className="block text-xl text-[var(--winter-dark)]">1:1</strong>
              <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">Mentorship</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          ["discover", "Discover Alumni", UsersRound],
          ["connections", "My Connections", Check],
          ["mentorship", "Mentorship", GraduationCap],
        ].map(([id, label, Icon]) => (
          <button
            key={id as string}
            onClick={() => setTab(id as typeof tab)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              tab === id
                ? "border-[var(--winter-primary)] bg-[var(--winter-primary)] text-white"
                : "border-[var(--border)] bg-white text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label as string}
          </button>
        ))}
      </div>

      {tab !== "mentorship" && (
        <>
          <section className="panel p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by alumni, company, skill or role..."
                  className="pl-9"
                />
              </div>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-10 rounded-md border border-[var(--input)] bg-white px-3 text-sm text-[var(--winter-dark)]"
              >
                {years.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </section>

          {visible.length === 0 ? (
            <section className="panel p-10 text-center">
              <UsersRound className="mx-auto h-10 w-10 text-[var(--muted-foreground)]" />
              <h2 className="mt-3 text-xl font-bold">No alumni found</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Try a different company, skill, role or graduation year.
              </p>
            </section>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {visible.map((alumni) => {
                const isConnected = connected.includes(alumni.id);
                return (
                  <article key={alumni.id} className="panel p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--winter-primary)] text-sm font-bold text-white">
                          {alumni.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="font-bold text-[var(--winter-dark)]">{alumni.name}</h2>
                            {alumni.verified && <ShieldCheck className="h-4 w-4 text-[var(--winter-success)]" />}
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)]">{alumni.role} · {alumni.company}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                            <MapPin className="h-3.5 w-3.5" /> {alumni.location}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-bold text-[var(--winter-primary)]">
                        Class of {alumni.graduation}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-[var(--winter-bg)] p-3">
                        <span className="flex items-center gap-1 font-semibold text-[var(--muted-foreground)]"><GraduationCap className="h-3.5 w-3.5" /> Education</span>
                        <strong className="mt-1 block text-[var(--winter-dark)]">{alumni.branch}</strong>
                      </div>
                      <div className="rounded-lg bg-[var(--winter-bg)] p-3">
                        <span className="flex items-center gap-1 font-semibold text-[var(--muted-foreground)]"><BriefcaseBusiness className="h-3.5 w-3.5" /> Focus</span>
                        <strong className="mt-1 block text-[var(--winter-dark)]">{alumni.focus}</strong>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {alumni.skills.map((skill) => (
                        <span key={skill} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted-foreground)]">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        onClick={() => toggleConnection(alumni)}
                        variant={isConnected ? "outline" : "default"}
                        className={isConnected ? "border-[var(--winter-success)] text-[var(--winter-success)]" : ""}
                      >
                        {isConnected ? <><Check /> Connected</> : <><UsersRound /> Connect</>}
                      </Button>
                      <Button variant="outline" onClick={() => setMentor(alumni)}>
                        <MessageCircle /> Ask for mentorship
                      </Button>
                      <a
                        href={alumni.linkedin}
                        onClick={(e) => { e.preventDefault(); toast.message("Demo LinkedIn profile link."); }}
                        className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                        aria-label={`${alumni.name} LinkedIn`}
                      >
                        <Building2 className="h-4 w-4" />
                      </a>
                      <a
                        href={alumni.github}
                        onClick={(e) => { e.preventDefault(); toast.message("Demo GitHub profile link."); }}
                        className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                        aria-label={`${alumni.name} GitHub`}
                      >
                        <Code2 className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "mentorship" && (
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="panel p-5 lg:col-span-2">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-1 text-2xl font-bold">Get practical guidance, not generic advice.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Find a match", "Filter alumni by role, company, branch and skills."],
                ["02", "Connect", "Send a connection request and introduce yourself."],
                ["03", "Learn", "Ask focused questions or request a short mentorship session."],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-xl bg-[var(--winter-bg)] p-4">
                  <span className="text-xs font-black text-[var(--winter-primary)]">{number}</span>
                  <h3 className="mt-2 font-bold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-5">
            <Building2 className="h-7 w-7 text-[var(--winter-primary)]" />
            <h3 className="mt-3 text-lg font-bold">Best practice</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Ask one specific question at a time. For example: “What should I learn
              in the next 8 weeks to prepare for a backend internship?”
            </p>
          </div>
        </section>
      )}

      {mentor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--winter-dark)]/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Mentorship request</p>
                <h2 className="mt-1 text-2xl font-bold">Message {mentor.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {mentor.role} · {mentor.company}
                </p>
              </div>
              <button onClick={() => setMentor(null)} className="text-sm text-[var(--muted-foreground)]">Close</button>
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">Your message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Introduce yourself and ask one focused question..."
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMentor(null)}>Cancel</Button>
              <Button onClick={sendMentorshipRequest}><Send /> Send request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
