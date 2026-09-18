/** Static presentation data, not live organisational results. */
export type LandingSnapshot = {
  readiness: number;
  improvement: number;
  metrics: { id: "competencies" | "experts" | "gaps" | "cohorts"; label: string; value: string; tone?: "critical" }[];
  competencies: {
    name: string;
    current: number;
    required: number;
    status: "critical" | "attention" | "healthy";
  }[];
  gap: { unit: string; name: string; points: number };
  expert: { name: string; specialty: string; fit: number };
};

export const demoLandingSnapshot: LandingSnapshot = {
  readiness: 76,
  improvement: 8,
  metrics: [
    { id: "competencies", label: "Verified competencies", value: "3,824" },
    { id: "experts", label: "Expert trainers", value: "94" },
    { id: "gaps", label: "Critical gaps", value: "18", tone: "critical" },
    { id: "cohorts", label: "Active cohorts", value: "27" },
  ],
  competencies: [
    { name: "Marketing Analytics", current: 54, required: 80, status: "critical" },
    { name: "Paid Advertising", current: 68, required: 82, status: "attention" },
    { name: "Content Strategy", current: 86, required: 78, status: "healthy" },
    { name: "Data Analysis", current: 72, required: 80, status: "attention" },
  ],
  gap: { unit: "Digital Outreach", name: "Analytics gap detected", points: 26 },
  expert: { name: "Ananya Sharma", specialty: "Marketing Analytics", fit: 96 },
};
