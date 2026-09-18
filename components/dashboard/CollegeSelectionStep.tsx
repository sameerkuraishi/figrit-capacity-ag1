"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  ChevronRight,
  GraduationCap,
  MapPin,
  Search,
  Star,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Career, StudentProfile } from "@/lib/figr-product";

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  type: "IIT" | "NIT" | "IIIT" | "University" | "Private";
  courses: string[];
  tags: string[];
  fee: string;
  highlight: string;
  rank: number;
};

const colleges: College[] = [
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "IIT",
    courses: ["CSE", "Mathematics & Computing", "Electrical Engineering"],
    tags: ["Technology & Engineering", "AI & Data", "Research"],
    fee: "High",
    highlight: "Strong engineering, computing and research ecosystem.",
    rank: 1,
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "IIT",
    courses: ["CSE", "AI & Data Science", "Electrical Engineering"],
    tags: ["Technology & Engineering", "AI & Data", "Research"],
    fee: "High",
    highlight: "Excellent technology, entrepreneurship and research opportunities.",
    rank: 2,
  },
  {
    id: "iit-kanpur",
    name: "IIT Kanpur",
    city: "Kanpur",
    state: "Uttar Pradesh",
    type: "IIT",
    courses: ["CSE", "Mathematics & Computing", "Electrical Engineering"],
    tags: ["Technology & Engineering", "AI & Data", "Research"],
    fee: "High",
    highlight: "Strong fundamentals, computing and technical research.",
    rank: 3,
  },
  {
    id: "iit-madras",
    name: "IIT Madras",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "IIT",
    courses: ["CSE", "AI & Data Science", "Engineering"],
    tags: ["Technology & Engineering", "AI & Data", "Research"],
    fee: "High",
    highlight: "Broad engineering ecosystem with strong computing pathways.",
    rank: 4,
  },
  {
    id: "nit-trichy",
    name: "NIT Tiruchirappalli",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "NIT",
    courses: ["CSE", "ECE", "EEE"],
    tags: ["Technology & Engineering"],
    fee: "Moderate",
    highlight: "Established NIT with strong engineering and placement pathways.",
    rank: 5,
  },
  {
    id: "iiit-h",
    name: "IIIT Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    type: "IIIT",
    courses: ["CSE", "AI & ML", "ECE"],
    tags: ["Technology & Engineering", "AI & Data", "Research"],
    fee: "High",
    highlight: "Computing-focused environment with strong AI and research exposure.",
    rank: 6,
  },
  {
    id: "du",
    name: "University of Delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "University",
    courses: ["Computer Science", "Mathematics", "Commerce", "Economics"],
    tags: ["Commerce & Finance", "Technology & Engineering"],
    fee: "Low",
    highlight: "Wide range of undergraduate academic pathways.",
    rank: 7,
  },
  {
    id: "bits-pilani",
    name: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "Private",
    courses: ["CSE", "Mathematics", "Electronics", "Economics"],
    tags: ["Technology & Engineering", "Commerce & Finance", "Research"],
    fee: "High",
    highlight: "Flexible academic choices and strong technology ecosystem.",
    rank: 8,
  },
];

interface CollegeSelectionStepProps {
  profile: StudentProfile;
  activeCareer: Career;
  selectedCollegeId: string | null;
  setSelectedCollegeId: (id: string | null) => void;
}

export function CollegeSelectionStep({
  profile,
  activeCareer,
  selectedCollegeId,
  setSelectedCollegeId,
}: CollegeSelectionStepProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const recommended = useMemo(() => {
    const query = search.toLowerCase().trim();

    return colleges
      .filter((college) => type === "All" || college.type === type)
      .filter((college) => {
        if (!query) return true;
        return `${college.name} ${college.city} ${college.state} ${college.courses.join(" ")}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const aMatch = activeCareer.category === "Technology & Engineering"
          ? a.tags.includes("Technology & Engineering")
          : a.tags.includes(activeCareer.category);
        const bMatch = activeCareer.category === "Technology & Engineering"
          ? b.tags.includes("Technology & Engineering")
          : b.tags.includes(activeCareer.category);

        return Number(bMatch) - Number(aMatch) || a.rank - b.rank;
      });
  }, [search, type, activeCareer.category]);

  const selected = colleges.find((college) => college.id === selectedCollegeId);

  return (
    <div className="flex flex-col gap-7 max-w-6xl mx-auto">
      <div>
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">
          College Selection · Find your target campus
        </p>
        <h1 className="text-3xl font-heading font-semibold text-[var(--winter-dark)]">
          Choose colleges that fit your career direction
        </h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-3xl">
          Explore colleges by course, location and institution type. Your selection is saved as your current target college.
        </p>
      </div>

      <section className="premium-card p-5 md:p-6">
        <div className="grid lg:grid-cols-[1fr_180px] gap-4">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search college, city or course..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border)] outline-none focus:border-[var(--winter-primary)] bg-white"
            />
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[var(--border)] outline-none bg-white"
          >
            {["All", "IIT", "NIT", "IIIT", "University", "Private"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-[var(--winter-light)] text-[var(--winter-primary)] font-semibold">
            Career: {activeCareer.title}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[var(--secondary)] text-[var(--winter-dark)]">
            {profile.level}
          </span>
          {selected && (
            <span className="px-3 py-1.5 rounded-full bg-[var(--winter-success)]/10 text-[var(--winter-success)] font-semibold">
              Target selected: {selected.name}
            </span>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        {recommended.map((college) => {
          const isSelected = selectedCollegeId === college.id;

          return (
            <article
              key={college.id}
              className={`premium-card p-6 transition-all ${
                isSelected ? "ring-2 ring-[var(--winter-primary)]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--winter-light)] text-[var(--winter-primary)] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--secondary)]">
                  {college.type}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[var(--winter-dark)] mt-5">
                {college.name}
              </h2>

              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-2">
                <MapPin className="w-4 h-4" />
                {college.city}, {college.state}
              </div>

              <p className="text-sm text-[var(--muted-foreground)] mt-4">
                {college.highlight}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {college.courses.map((course) => (
                  <span
                    key={course}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)]"
                  >
                    {course}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-xl bg-[var(--secondary)] p-3">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                    Fee level
                  </span>
                  <strong className="block mt-1 text-sm">{college.fee}</strong>
                </div>
                <div className="rounded-xl bg-[var(--secondary)] p-3">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                    Fit signal
                  </span>
                  <strong className="block mt-1 text-sm">
                    {college.tags.includes(activeCareer.category) || college.tags.includes("Technology & Engineering")
                      ? "Strong"
                      : "Explore"}
                  </strong>
                </div>
              </div>

              <Button
                onClick={() => setSelectedCollegeId(isSelected ? null : college.id)}
                className={`w-full mt-5 ${
                  isSelected ? "btn-secondary" : "primary-button"
                }`}
                variant={isSelected ? "outline" : "default"}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" /> Selected
                  </>
                ) : (
                  <>
                    Select as target <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </article>
          );
        })}
      </div>

      {!recommended.length && (
        <section className="empty-state panel">
          <GraduationCap className="w-8 h-8 mx-auto mb-3 text-[var(--winter-primary)]" />
          <h2>No colleges found</h2>
          <p>Try a different college name, city, course or institution type.</p>
        </section>
      )}

      {selected && (
        <section className="premium-card p-6 md:p-7">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--winter-light)] text-[var(--winter-primary)] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-[var(--winter-primary)]">
                  Current target
                </p>
                <h3 className="text-xl font-bold text-[var(--winter-dark)] mt-1">
                  {selected.name}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Use this target when discussing preparation, exams and career fit with your counsellor.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Star className="w-4 h-4" />
              Priority #{selected.rank}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
