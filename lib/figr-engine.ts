export type SkillKey = "python" | "programming" | "mathematics" | "statistics" | "sql" | "ml" | "web" | "security" | "cloud" | "design";
export type StudentProfile = {
  name: string;
  level: string;
  goal: string;
  interests: string[];
  learningStyle: string;
  hoursPerWeek: number;
  skills: Record<SkillKey, number>;
};
type Career = { name: string; weights: Partial<Record<SkillKey, number>>; required: Partial<Record<SkillKey, number>> };
export type Analysis = {
  targetCareer: string;
  readiness: number;
  assessmentScore: number;
  scores: Record<SkillKey, number>;
  strengths: string[];
  gaps: { key: SkillKey; label: string; deficit: number; priority: string }[];
  insight: string;
  careers: { name: string; score: number; reason: string; strengths: string[]; gaps: string[]; contributions: { skill: string; earned: number; max: number }[] }[];
  requirements: { key: SkillKey; label: string; current: number; required: number; status: string; statusClass: string }[];
};

export const skillLabels: Record<SkillKey, string> = {
  python: "Python", programming: "Programming logic", mathematics: "Mathematics", statistics: "Statistics", sql: "SQL & data",
  ml: "AI / ML", web: "Web development", security: "Cybersecurity", cloud: "Cloud & DevOps", design: "UI / UX design",
};
export const careerOptions = ["Help me choose", "Machine Learning Engineer", "Data Scientist", "Data Analyst", "Backend Developer", "AI Engineer", "Frontend Developer", "Cybersecurity Analyst", "Cloud / DevOps Engineer", "UI / UX Designer"];
export const emptyProfile: StudentProfile = {
  name: "", level: "Class 12", goal: "Help me choose", interests: [], learningStyle: "Project-based", hoursPerWeek: 5,
  skills: { python: 50, programming: 50, mathematics: 50, statistics: 50, sql: 50, ml: 50, web: 50, security: 50, cloud: 50, design: 50 },
};

const careers: Career[] = [
  { name: "Machine Learning Engineer", weights: { python: .23, programming: .16, mathematics: .16, statistics: .17, sql: .05, ml: .23 }, required: { python: 80, programming: 75, mathematics: 70, statistics: 75, sql: 55, ml: 75 } },
  { name: "Data Scientist", weights: { python: .18, programming: .08, mathematics: .17, statistics: .24, sql: .14, ml: .19 }, required: { python: 75, programming: 60, mathematics: 72, statistics: 82, sql: 70, ml: 70 } },
  { name: "Data Analyst", weights: { python: .13, programming: .06, mathematics: .12, statistics: .23, sql: .34, design: .12 }, required: { python: 60, programming: 45, mathematics: 55, statistics: 72, sql: 82, design: 55 } },
  { name: "Backend Developer", weights: { python: .24, programming: .29, mathematics: .07, sql: .24, cloud: .12, security: .04 }, required: { python: 75, programming: 82, mathematics: 45, sql: 75, cloud: 55, security: 45 } },
  { name: "AI Engineer", weights: { python: .20, programming: .20, mathematics: .13, statistics: .12, ml: .25, cloud: .10 }, required: { python: 82, programming: 80, mathematics: 68, statistics: 65, ml: 78, cloud: 55 } },
  { name: "Frontend Developer", weights: { programming: .24, web: .36, design: .20, security: .06, cloud: .08, mathematics: .06 }, required: { programming: 75, web: 85, design: 68, security: 40, cloud: 45, mathematics: 40 } },
  { name: "Cybersecurity Analyst", weights: { programming: .17, security: .39, cloud: .16, python: .12, sql: .08, mathematics: .08 }, required: { programming: 68, security: 85, cloud: 70, python: 60, sql: 55, mathematics: 50 } },
  { name: "Cloud / DevOps Engineer", weights: { programming: .19, cloud: .41, security: .14, python: .12, sql: .05, web: .09 }, required: { programming: 70, cloud: 85, security: 65, python: 62, sql: 45, web: 55 } },
  { name: "UI / UX Designer", weights: { design: .53, web: .17, programming: .06, mathematics: .04, statistics: .08, sql: .02, security: .02, cloud: .02, python: .02, ml: .04 }, required: { design: 88, web: 62, programming: 35, mathematics: 30, statistics: 40, ml: 30 } },
];

const interestCareerMap: Record<string, string[]> = {
  "AI & automation": ["Machine Learning Engineer", "AI Engineer", "Data Scientist"],
  "Data & insights": ["Data Scientist", "Data Analyst", "Machine Learning Engineer"],
  "Building apps": ["Backend Developer", "Frontend Developer", "Cloud / DevOps Engineer"],
  "Security & systems": ["Cybersecurity Analyst", "Cloud / DevOps Engineer", "Backend Developer"],
  "Design & creativity": ["UI / UX Designer", "Frontend Developer"],
  "Problem solving": ["Machine Learning Engineer", "Backend Developer", "Cybersecurity Analyst"],
};

export function analyzeStudent(profile: StudentProfile, answers: number[], correct: number[]): Analysis {
  const safeTotal = Math.max(1, correct.length);
  const assessmentScore = Math.round((answers.filter((answer, i) => answer === correct[i]).length / safeTotal) * 100);
  const scores = { ...profile.skills };
  const evidence: Partial<Record<SkillKey, number>> = {
    python: average([0, 1].map((i) => answers[i] === correct[i] ? 100 : 0)), programming: answers[2] === correct[2] ? 100 : 0,
    mathematics: answers[3] === correct[3] ? 100 : 0, statistics: average([4, 5].map((i) => answers[i] === correct[i] ? 100 : 0)),
    ml: answers[6] === correct[6] ? 100 : 0, sql: answers[7] === correct[7] ? 100 : 0,
  };
  (Object.keys(scores) as SkillKey[]).forEach((key) => { scores[key] = Math.round(profile.skills[key] * .72 + (evidence[key] ?? profile.skills[key]) * .28); });

  const ranked = careers.map((career) => {
    const contributions = (Object.keys(career.weights) as SkillKey[]).map((key) => ({ skill: skillLabels[key], earned: Math.round(scores[key] * (career.weights[key] ?? 0)), max: Math.round(100 * (career.weights[key] ?? 0)) }));
    const goalBonus = career.name === profile.goal ? 8 : 0;
    const interestBonus = Math.min(6, profile.interests.filter((interest) => interestCareerMap[interest]?.includes(career.name)).length * 2);
    contributions.push({ skill: "Goal & interest alignment", earned: goalBonus + interestBonus, max: 14 });
    const score = Math.min(99, Math.round(contributions.reduce((sum, item) => sum + item.earned, 0)));
    const required = career.required;
    const ordered = (Object.keys(required) as SkillKey[]).map((key) => ({ key, deficit: (required[key] ?? 0) - scores[key] })).sort((a, b) => b.deficit - a.deficit);
    const strengths = ordered.filter((item) => item.deficit <= 5).slice(0, 3).map((item) => skillLabels[item.key]);
    const gaps = ordered.filter((item) => item.deficit > 5).slice(0, 3).map((item) => skillLabels[item.key]);
    return { name: career.name, score, contributions, strengths: strengths.length ? strengths : ["Interest alignment"], gaps, reason: strengths.length ? `${strengths.slice(0, 2).join(" + ")} support this path · ${gaps.length} priority gaps` : `Promising interest alignment · ${gaps.length} foundations to build` };
  }).sort((a, b) => b.score - a.score);

  const targetName = profile.goal === "Help me choose" ? ranked[0].name : profile.goal;
  const target = careers.find((career) => career.name === targetName) ?? careers[0];
  const gapRows = (Object.keys(target.required) as SkillKey[]).map((key) => ({ key, label: skillLabels[key], deficit: Math.max(0, (target.required[key] ?? 0) - scores[key]), priority: (target.weights[key] ?? 0) >= .16 ? "High" : "Moderate" })).filter((gap) => gap.deficit > 0).sort((a, b) => b.deficit - a.deficit);
  const strengths = (Object.keys(target.required) as SkillKey[]).filter((key) => scores[key] >= ((target.required[key] ?? 0) - 5)).map((key) => skillLabels[key]);
  const requirements = (Object.keys(target.required) as SkillKey[]).map((key) => {
    const required = target.required[key] ?? 0; const deficit = required - scores[key];
    return { key, label: skillLabels[key], current: scores[key], required, status: deficit <= 0 ? "Strong" : deficit >= 30 ? "Critical gap" : deficit >= 15 ? "Needs improvement" : "Moderate gap", statusClass: deficit <= 0 ? "status-good" : deficit >= 30 ? "status-critical" : "status-warn" };
  });
  const targetScore = ranked.find((career) => career.name === targetName)?.score ?? ranked[0].score;
  const readiness = Math.max(25, Math.round(targetScore * .9));
  const strengthText = strengths.length ? strengths.slice(0, 2).join(" and ").toLowerCase() : "interest";
  const gapText = gapRows.length ? gapRows.slice(0, 2).map((gap) => gap.label).join(" and ") : "advanced practice";
  return { targetCareer: targetName, readiness, assessmentScore, scores, strengths, gaps: gapRows, careers: ranked, requirements, insight: `Your ${strengthText} gives you a useful starting point. ${gapText} should be strengthened before advanced ${targetName} work.` };
}

export function projectCareerScore(analysis: Analysis, careerName: string, skill: SkillKey, improvement: number) {
  const career = careers.find((item) => item.name === careerName);
  const current = analysis.careers.find((item) => item.name === careerName)?.score ?? 0;
  return Math.min(99, current + Math.round(improvement * (career?.weights[skill] ?? 0)));
}

function average(values: number[]) { return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length); }
