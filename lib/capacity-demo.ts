import type {
  Announcement,
  Assessment,
  CapacityCell,
  CohortSuggestion,
  CompetencyScore,
  Course,
  LearningPath,
  MentorBooking,
  Resource,
  RoleAlignment,
  TrainerMatch,
  UserProfile,
  Team,
  MembershipRequest,
  TeamInvitation,
  ExpertRecord,
  ChatMessage,
  RoleSuggestion,
  Opportunity,
  RoleApplication,
  ChatConversation,
} from "./capacity-types";

export const demoUsers: Record<string, UserProfile> = {
  trainee: {
    id: 1,
    name: "Sameer Khan",
    email: "trainee@figr.it",
    role: "trainee",
    employeeId: "CC-T-1042",
    organization: "Capacity Connect Demo Organization",
    department: "Digital Outreach & Marketing",
    designation: "Marketing Associate",
    qualification: "B.Tech",
    experienceYears: 2,
    domain: "Marketing",
    preferredLanguage: "Hindi / English",
    interests: ["Performance Marketing", "Analytics", "Content Strategy"],
    skills: ["Marketing Fundamentals", "Copywriting", "SEO Basics"],
    certificates: ["Digital Marketing Fundamentals"],
    approved: true,
  },
  trainer: {
    id: 2,
    name: "Ananya Sharma",
    email: "trainer@figr.it",
    role: "trainer",
    employeeId: "CC-TR-021",
    organization: "Capacity Connect Demo Organization",
    department: "Growth & Digital Learning",
    designation: "Senior Performance Marketing Mentor",
    qualification: "MBA Marketing",
    experienceYears: 11,
    domain: "Marketing",
    preferredLanguage: "Hindi / English",
    interests: ["Paid Media", "Conversion Optimization", "Mentoring"],
    skills: ["Google Ads", "Meta Ads", "Marketing Analytics", "A/B Testing"],
    certificates: ["Google Ads", "GA4", "Meta Certified"],
    approved: true,
  },
  admin: {
    id: 3,
    name: "Neha Verma",
    email: "admin@figr.it",
    role: "admin",
    employeeId: "CC-ADM-007",
    organization: "Capacity Connect Demo Organization",
    department: "Training Administration",
    designation: "Capacity Building Administrator",
    qualification: "M.Tech + MBA",
    experienceYears: 10,
    domain: "Organizational Development",
    preferredLanguage: "English / Hindi",
    interests: ["Workforce Development", "Analytics", "Competency Planning"],
    skills: ["Program Management", "Analytics", "Administration"],
    certificates: ["Training Management"],
    approved: true,
  },
};

export const domainCatalog = [
  {
    name: "Marketing",
    description: "Content, performance marketing, SEO, CRM, analytics and customer growth.",
    roles: ["Content Marketing Specialist", "SEO Specialist", "Social Media Specialist", "Performance Marketing Specialist", "Marketing Analyst"],
  },
  {
    name: "Meteorology",
    description: "Forecasting, radar, satellite, climate data and operational decision support.",
    roles: ["Radar Analyst", "Weather Forecaster", "Climate Data Analyst", "GIS Specialist"],
  },
  {
    name: "Data & Analytics",
    description: "Data analysis, reporting, visualization, SQL and decision intelligence.",
    roles: ["Data Analyst", "BI Analyst", "Analytics Specialist"],
  },
  {
    name: "Human Resources",
    description: "People operations, talent development, performance and employee experience.",
    roles: ["HR Generalist", "L&D Specialist", "Talent Analyst"],
  },
  {
    name: "IT & Digital",
    description: "Applications, cloud, security, support and digital systems.",
    roles: ["Backend Developer", "Cloud Engineer", "Cybersecurity Analyst", "IT Support Specialist"],
  },
  {
    name: "Operations",
    description: "Process quality, service delivery, compliance and execution excellence.",
    roles: ["Operations Analyst", "Process Excellence Associate", "Program Coordinator"],
  },
];

export const marketingRoleAlignment: RoleAlignment[] = [
  {
    id: 1,
    name: "Content Marketing Specialist",
    domain: "Marketing",
    score: 91,
    reason: "Strong communication, audience understanding and SEO fundamentals.",
    strengths: ["Content & Communication", "Customer Understanding", "SEO"],
    gaps: ["Analytics depth"],
  },
  {
    id: 2,
    name: "SEO Specialist",
    domain: "Marketing",
    score: 84,
    reason: "Good organic discovery knowledge with solid content fundamentals.",
    strengths: ["SEO", "Content", "Research"],
    gaps: ["Technical SEO", "Analytics"],
  },
  {
    id: 3,
    name: "Social Media Specialist",
    domain: "Marketing",
    score: 79,
    reason: "Strong content instincts with room to build measurement and paid distribution.",
    strengths: ["Content", "Audience Understanding"],
    gaps: ["Paid Social", "Analytics"],
  },
  {
    id: 4,
    name: "Performance Marketing Specialist",
    domain: "Marketing",
    score: 58,
    reason: "Strong marketing base, but paid media, experimentation and analytics need focused development.",
    strengths: ["Marketing Fundamentals", "Copywriting"],
    gaps: ["Paid Advertising", "Marketing Analytics", "A/B Testing"],
  },
  {
    id: 5,
    name: "Marketing Analyst",
    domain: "Marketing",
    score: 51,
    reason: "Promising customer context but analytics evidence is currently limited.",
    strengths: ["Customer Understanding"],
    gaps: ["Analytics", "Reporting", "Experimentation"],
  },
];

export const demoCompetencyGaps: CompetencyScore[] = [
  { name: "Marketing Fundamentals", current: 82, required: 75, gap: 0, status: "Achieved", confidence: 91, freshness: 94, evidenceCount: 4, category: "Foundation" },
  { name: "Copywriting", current: 81, required: 70, gap: 0, status: "Achieved", confidence: 88, freshness: 92, evidenceCount: 3, category: "Communication" },
  { name: "Paid Advertising", current: 48, required: 85, gap: 37, status: "Critical", confidence: 83, freshness: 96, evidenceCount: 5, category: "Performance" },
  { name: "Marketing Analytics", current: 41, required: 80, gap: 39, status: "Critical", confidence: 86, freshness: 96, evidenceCount: 5, category: "Analytics" },
  { name: "A/B Testing", current: 46, required: 75, gap: 29, status: "Critical", confidence: 79, freshness: 91, evidenceCount: 3, category: "Experimentation" },
  { name: "Conversion Optimization", current: 52, required: 75, gap: 23, status: "Moderate", confidence: 75, freshness: 89, evidenceCount: 3, category: "Performance" },
];

export const demoLearningPath: LearningPath = {
  id: 1,
  targetRole: "Performance Marketing Specialist",
  currentReadiness: 56,
  targetReadiness: 80,
  items: [
    { id: 1, title: "Baseline competency assessment", itemType: "assessment", competency: "Marketing", durationMinutes: 24, status: "completed", note: "Completed · role alignment generated" },
    { id: 2, title: "Marketing Analytics Fundamentals", itemType: "course", competency: "Marketing Analytics", durationMinutes: 140, status: "current", note: "Targets your highest-priority gap" },
    { id: 3, title: "Paid Ads Fundamentals", itemType: "course", competency: "Paid Advertising", durationMinutes: 170, status: "available", note: "Google + Meta campaign basics" },
    { id: 4, title: "A/B Testing Case Lab", itemType: "practice", competency: "A/B Testing", durationMinutes: 55, status: "available", note: "3 guided experiment scenarios" },
    { id: 5, title: "Expert review session", itemType: "mentor", competency: "Paid Advertising", durationMinutes: 20, status: "available", note: "Optional on-demand mentor session" },
    { id: 6, title: "Campaign simulation", itemType: "practice", competency: "Conversion Optimization", durationMinutes: 45, status: "locked", note: "Unlock after core learning" },
    { id: 7, title: "Targeted competency reassessment", itemType: "reassessment", competency: "Performance Marketing", durationMinutes: 18, status: "locked", note: "Verifies whether the gap actually closed" },
  ],
};

export const demoCourses: Course[] = [
  {
    id: 1,
    code: "MKT-AN-201",
    title: "Marketing Analytics Fundamentals",
    subject: "Marketing Analytics",
    description: "Build campaign measurement fundamentals using practical KPI, funnel and attribution exercises.",
    trainer: "Ananya Sharma",
    durationWeeks: 2,
    durationHours: 2.3,
    enrolled: 38,
    seats: 50,
    progress: 38,
    status: "In Progress",
    level: "Foundation",
    tags: ["Analytics", "KPIs", "Funnels"],
    language: "Hindi / English",
    rating: 4.8,
    whyRecommended: "You have a 39-point gap in Marketing Analytics. This course directly targets measurement, funnel analysis and campaign reporting.",
    requiredCompetencies: { "Marketing Analytics": 80, "Marketing Fundamentals": 70 },
  },
  {
    id: 2,
    code: "MKT-PA-210",
    title: "Paid Advertising Essentials",
    subject: "Performance Marketing",
    description: "Plan, launch and evaluate paid campaigns across Google and Meta with budget and targeting discipline.",
    trainer: "Ananya Sharma",
    durationWeeks: 3,
    durationHours: 3.1,
    enrolled: 42,
    seats: 60,
    progress: 0,
    status: "Not Enrolled",
    level: "Intermediate",
    tags: ["Google Ads", "Meta Ads", "Paid Media"],
    language: "Hindi / English",
    rating: 4.9,
    whyRecommended: "Paid Advertising is 37 points below the requirement for your selected target role.",
    requiredCompetencies: { "Paid Advertising": 85, Copywriting: 70 },
  },
  {
    id: 3,
    code: "MKT-EXP-230",
    title: "A/B Testing & Experiment Design",
    subject: "Experimentation",
    description: "Design fair marketing experiments, choose success metrics and interpret results without common testing mistakes.",
    trainer: "Rahul Verma",
    durationWeeks: 2,
    durationHours: 1.8,
    enrolled: 29,
    seats: 50,
    progress: 0,
    status: "Not Enrolled",
    level: "Intermediate",
    tags: ["Experimentation", "A/B Testing", "CRO"],
    language: "English",
    rating: 4.7,
    whyRecommended: "A/B Testing is a critical gap for your Performance Marketing target role.",
    requiredCompetencies: { "A/B Testing": 75, "Conversion Optimization": 70 },
  },
  {
    id: 4,
    code: "MKT-CRO-310",
    title: "Conversion Optimization Case Lab",
    subject: "Conversion Optimization",
    description: "Work through landing-page, funnel and campaign cases to improve conversion decisions.",
    trainer: "Meera Iyer",
    durationWeeks: 2,
    durationHours: 2.0,
    enrolled: 21,
    seats: 35,
    progress: 0,
    status: "Not Enrolled",
    level: "Advanced",
    tags: ["CRO", "Case Study", "Funnels"],
    language: "English / Hindi",
    rating: 4.8,
    whyRecommended: "Builds evidence for your 23-point Conversion Optimization gap through scenario practice.",
    requiredCompetencies: { "Conversion Optimization": 75, "Marketing Analytics": 72 },
  },
];

export const demoResources: Resource[] = [
  { id: 1, courseId: 1, title: "Marketing Measurement Foundations", type: "Video", duration: "24 min", url: "#" },
  { id: 2, courseId: 1, title: "Funnel KPI Workbook", type: "PDF", url: "#" },
  { id: 3, courseId: 1, title: "Campaign Analysis Case", type: "PPT", url: "#" },
  { id: 4, courseId: 2, title: "Google Ads Structure", type: "Video", duration: "31 min", url: "#" },
  { id: 5, courseId: 2, title: "Targeting & Budget Checklist", type: "Notes", url: "#" },
];

export const demoAssessments: Assessment[] = [
  {
    id: 1,
    courseId: 1,
    title: "Marketing Analytics Checkpoint",
    deadline: "2026-09-24T18:00:00+05:30",
    passMark: 70,
    questions: [
      {
        id: 1,
        prompt: "Which metric is most useful for comparing campaign efficiency when spend differs significantly?",
        options: ["Impressions", "CTR only", "Cost per conversion", "Total clicks"],
        answer: 2,
        competency: "Marketing Analytics",
      },
      {
        id: 2,
        prompt: "A landing page receives more traffic but conversions stay flat. What should be checked first?",
        options: ["Only impressions", "Conversion rate by source and landing-page behavior", "Follower count", "Email open rate"],
        answer: 1,
        competency: "Conversion Optimization",
      },
      {
        id: 3,
        prompt: "What makes an A/B test result more trustworthy?",
        options: ["Changing many variables at once", "Stopping after the first conversion", "Clear hypothesis and enough observations", "Using only top-performing traffic"],
        answer: 2,
        competency: "A/B Testing",
      },
    ],
  },
];

export const demoTrainerMatches: TrainerMatch[] = [
  {
    id: 2,
    name: "Ananya Sharma",
    qualification: "MBA Marketing · Google/Meta Certified",
    experienceYears: 11,
    rating: 4.9,
    match: 96,
    domain: "Performance Marketing & Analytics",
    languages: ["Hindi", "English"],
    nextAvailable: "Today · 6:00 PM",
    strengths: ["Paid Advertising 96%", "Marketing Analytics 94%", "A/B Testing 91%", "Strong mentor outcomes"],
    breakdown: { skills: 39, domain: 29, experience: 14, qualification: 14 },
  },
  {
    id: 5,
    name: "Rahul Verma",
    qualification: "M.Sc. Analytics · Experimentation Lead",
    experienceYears: 8,
    rating: 4.8,
    match: 89,
    domain: "Experimentation & Conversion",
    languages: ["English", "Hindi"],
    nextAvailable: "Tomorrow · 11:30 AM",
    strengths: ["A/B Testing 96%", "Conversion Optimization 93%", "Analytics 85%"],
    breakdown: { skills: 37, domain: 27, experience: 12, qualification: 13 },
  },
  {
    id: 6,
    name: "Meera Iyer",
    qualification: "MBA · Growth Strategy",
    experienceYears: 13,
    rating: 4.7,
    match: 84,
    domain: "Growth, CRO & Strategy",
    languages: ["English"],
    nextAvailable: "Wed · 4:30 PM",
    strengths: ["Conversion Optimization 95%", "Strategy 92%", "Case mentoring 90%"],
    breakdown: { skills: 34, domain: 25, experience: 15, qualification: 10 },
  },
];

export const demoBookings: MentorBooking[] = [
  {
    id: 1,
    trainerId: 2,
    trainerName: "Ananya Sharma",
    startAt: "2026-09-16T18:00:00+05:30",
    durationMinutes: 20,
    reason: "Weak assessment area",
    note: "Need help understanding campaign attribution and choosing the right KPI.",
    competency: "Marketing Analytics",
    status: "scheduled",
  },
];

export const demoAnnouncements: Announcement[] = [
  {
    id: 1,
    kind: "Announcement",
    title: "Performance Marketing mentor clinic",
    body: "New 20-minute expert slots are open this week for learners working on analytics and paid-media gaps.",
    date: "15 Sep",
  },
  {
    id: 2,
    kind: "Achievement",
    title: "Capability milestone",
    body: "The Digital Outreach team improved verified analytics readiness by 12 points this month.",
    date: "14 Sep",
  },
  {
    id: 3,
    kind: "New Content",
    title: "Campaign experiment case pack added",
    body: "A new A/B testing case set is available in the Knowledge Hub and trainer library.",
    date: "13 Sep",
  },
  {
    id: 4,
    kind: "Deadline",
    title: "Analytics checkpoint closes soon",
    body: "Marketing Analytics Checkpoint closes on 24 September at 6:00 PM.",
    date: "12 Sep",
  },
];

export const capacityCells: CapacityCell[] = [
  { unit: "Digital Outreach", competency: "Marketing Analytics", readiness: 54, required: 80, qualified: 8, total: 23, trainers: 1, backups: 0, risk: "critical" },
  { unit: "Digital Outreach", competency: "Paid Advertising", readiness: 61, required: 82, qualified: 11, total: 23, trainers: 2, backups: 1, risk: "attention" },
  { unit: "Digital Outreach", competency: "Content Strategy", readiness: 84, required: 78, qualified: 19, total: 23, trainers: 3, backups: 2, risk: "healthy" },
  { unit: "Public Engagement", competency: "Marketing Analytics", readiness: 73, required: 80, qualified: 15, total: 21, trainers: 2, backups: 1, risk: "attention" },
  { unit: "Public Engagement", competency: "Paid Advertising", readiness: 79, required: 82, qualified: 17, total: 21, trainers: 2, backups: 1, risk: "attention" },
  { unit: "Public Engagement", competency: "Content Strategy", readiness: 88, required: 78, qualified: 20, total: 21, trainers: 4, backups: 3, risk: "healthy" },
  { unit: "Regional Communications", competency: "Marketing Analytics", readiness: 82, required: 80, qualified: 18, total: 20, trainers: 3, backups: 2, risk: "healthy" },
  { unit: "Regional Communications", competency: "Paid Advertising", readiness: 86, required: 82, qualified: 18, total: 20, trainers: 4, backups: 2, risk: "healthy" },
  { unit: "Regional Communications", competency: "Content Strategy", readiness: 81, required: 78, qualified: 17, total: 20, trainers: 3, backups: 2, risk: "healthy" },
  { unit: "Training Cell", competency: "Marketing Analytics", readiness: 77, required: 80, qualified: 10, total: 13, trainers: 3, backups: 2, risk: "attention" },
  { unit: "Training Cell", competency: "Paid Advertising", readiness: 74, required: 82, qualified: 9, total: 13, trainers: 2, backups: 1, risk: "attention" },
  { unit: "Training Cell", competency: "Content Strategy", readiness: 91, required: 78, qualified: 12, total: 13, trainers: 4, backups: 3, risk: "healthy" },
];

export const cohortSuggestions: CohortSuggestion[] = [
  { id: 1, name: "Analytics Foundation A", level: "Foundation", learners: 8, competency: "Marketing Analytics", language: "Hindi / English", readinessRange: "34–52%" },
  { id: 2, name: "Paid Media Intermediate", level: "Intermediate", learners: 6, competency: "Paid Advertising", language: "Hindi / English", readinessRange: "48–64%" },
  { id: 3, name: "Experimentation Lab", level: "Intermediate", learners: 4, competency: "A/B Testing", language: "English", readinessRange: "45–59%" },
];

export const interventionOptions = [
  {
    id: "A",
    title: "Train all 18 learners",
    people: 18,
    hours: 108,
    current: 54,
    projected: 79,
    description: "Full pathway for every learner currently below the competency requirement.",
  },
  {
    id: "B",
    title: "Focus top 8 candidates",
    people: 8,
    hours: 48,
    current: 54,
    projected: 71,
    description: "Build a smaller group of high-readiness internal capability champions first.",
  },
  {
    id: "C",
    title: "Expert clinic + micro-course + reassessment",
    people: 14,
    hours: 31,
    current: 54,
    projected: 75,
    description: "Target the exact analytics gap with a short blended intervention.",
  },
];

export const externalPlatforms = [
  ["SWAYAM", "Free", "Government courses"],
  ["NPTEL", "Free", "University lectures"],
  ["Coursera", "Free + Paid", "University & professional"],
  ["Microsoft Learn", "Free", "Digital & technology"],
];

export const pendingUsers = [
  { id: 11, name: "Dr. Meera Iyer", role: "Trainer", department: "Growth Strategy", qualification: "MBA Marketing", experience: "13 years" },
  { id: 12, name: "Rohit Singh", role: "Trainee", department: "Public Engagement", qualification: "BBA", experience: "1 year" },
  { id: 13, name: "Arvind Rao", role: "Trainer", department: "Data & Analytics", qualification: "M.Sc. Statistics", experience: "10 years" },
];

export const proofEvidence = [
  { label: "Baseline assessment", score: "41%", date: "15 Sep 2026", state: "Verified" },
  { label: "Scenario exercise", score: "57%", date: "12 Sep 2026", state: "Verified" },
  { label: "Course checkpoint", score: "68%", date: "10 Sep 2026", state: "Verified" },
  { label: "Mentor validation", score: "Pending", date: "Next session", state: "Scheduled" },
];

export const skillPassport = [
  { name: "Marketing Fundamentals", level: 82, label: "Advanced", verified: true, evidence: 4, fresh: "12 days" },
  { name: "Copywriting", level: 81, label: "Advanced", verified: true, evidence: 3, fresh: "18 days" },
  { name: "SEO", level: 76, label: "Intermediate", verified: true, evidence: 3, fresh: "22 days" },
  { name: "Paid Advertising", level: 48, label: "Developing", verified: false, evidence: 5, fresh: "Today" },
  { name: "Marketing Analytics", level: 41, label: "Developing", verified: false, evidence: 5, fresh: "Today" },
];

export const knowledgeItems = [
  { id: 1, title: "Campaign Measurement Playbook", type: "Official Resource", competency: "Marketing Analytics", author: "Learning Cell", verified: true, excerpt: "A practical guide to campaign KPIs, attribution caveats and funnel diagnostics." },
  { id: 2, title: "How to choose a primary conversion metric", type: "Expert Answer", competency: "Marketing Analytics", author: "Ananya Sharma", verified: true, excerpt: "Choose a metric that reflects the intended business outcome, then use diagnostic metrics to explain movement." },
  { id: 3, title: "A/B Testing: Common Decision Traps", type: "Training Note", competency: "A/B Testing", author: "Rahul Verma", verified: true, excerpt: "Avoid peeking, changing variants mid-test and interpreting noisy segments as final evidence." },
  { id: 4, title: "Landing Page Conversion Case", type: "Case", competency: "Conversion Optimization", author: "Growth Team", verified: true, excerpt: "A guided case on diagnosing a traffic increase with flat conversions." },
];

export const demoTeams: Team[] = [
  {
    id: 1,
    name: "Analytics Tiger Team",
    purpose: "Cross-functional task force for Q4 campaign tracking rollout",
    mode: "Mixed Skill Set",
    targetSize: 5,
    requiredSkills: ["Marketing Analytics", "Data Engineering", "Performance Marketing"],
    trainerId: 2,
    status: "active",
    members: [
      { id: 101, userId: 1, name: "Sameer Khan", role: "member", skills: [{ name: "Performance Marketing", level: 65, match: true }] },
      { id: 102, userId: 2, name: "Ananya Sharma", role: "trainer", skills: [{ name: "Marketing Analytics", level: 95, match: true }] },
      { id: 103, userId: 4, name: "Rahul Verma", role: "lead", skills: [{ name: "Data Engineering", level: 88, match: true }] },
    ],
  },
  {
    id: 2,
    name: "Conversion Optimization Cohort",
    purpose: "Shared training block for landing page conversions",
    mode: "Similar Skill Set",
    targetSize: 8,
    requiredSkills: ["Conversion Optimization", "A/B Testing"],
    status: "draft",
    members: [],
  }
];

export const demoMembershipRequests: MembershipRequest[] = [
  {
    id: 1,
    teamId: 2,
    userId: 12,
    userName: "Rohit Singh",
    userSkills: [{ name: "Conversion Optimization", level: 45 }],
    status: "pending",
    requestedAt: "2026-09-17T10:00:00Z",
    message: "I need to close my CRO gap for the upcoming project.",
  },
];

export const demoTeamInvitations: TeamInvitation[] = [
  {
    id: 1,
    teamId: 1,
    teamName: "Analytics Tiger Team",
    userId: 1,
    role: "member",
    status: "pending",
    invitedAt: "2026-09-17T11:00:00Z",
  }
];

export const demoTrainees = [
  { id: 12, name: "Rohit Singh", department: "Public Engagement", skills: [{ name: "Conversion Optimization", level: 45 }, { name: "A/B Testing", level: 42 }] },
  { id: 14, name: "Ayesha Ali", department: "Digital Outreach", skills: [{ name: "Content Strategy", level: 80 }, { name: "Marketing Analytics", level: 60 }] },
  { id: 15, name: "Vikas Jain", department: "Performance Marketing", skills: [{ name: "Paid Advertising", level: 85 }, { name: "Marketing Analytics", level: 78 }] },
  { id: 16, name: "Pooja Singh", department: "Public Engagement", skills: [{ name: "Conversion Optimization", level: 74 }, { name: "SEO", level: 68 }] },
];

export const demoExperts: ExpertRecord[] = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    designation: "Lead Digital Strategist",
    expertise: ["Marketing Analytics", "Paid Advertising", "Performance Marketing"],
    bio: "12+ years in digital strategy and data-driven marketing. Specialises in attribution models and multi-channel ROI optimization.",
    availability: "Tuesdays & Thursdays, 4:00 PM - 6:00 PM",
    qualification: "MBA Marketing, Google Analytics Certified",
    experienceYears: 12,
    domain: "Digital Strategy",
    rating: 4.9,
    supportedLevels: ["Intermediate", "Advanced"],
    sessionFormats: ["1:1 Coaching", "Case Review"],
  },
  {
    id: 2,
    name: "Rahul Verma",
    designation: "Growth Lead",
    expertise: ["A/B Testing", "Conversion Optimization", "Data Engineering"],
    bio: "Focuses on high-velocity experimentation and funnel optimization. Has run over 500 experiments in the last 3 years.",
    availability: "Mondays, 10:00 AM - 1:00 PM",
    qualification: "MSc Data Science",
    experienceYears: 8,
    domain: "Growth Hacking",
    rating: 4.8,
    supportedLevels: ["Beginner", "Intermediate"],
    sessionFormats: ["1:1 Coaching", "Q&A"],
  },
  {
    id: 3,
    name: "Kavya Patel",
    designation: "Content Strategist",
    expertise: ["Content Strategy", "SEO", "Brand Narrative", "Communication"],
    bio: "Expert in building organic growth engines and scaling content operations globally. Deep understanding of narrative-driven communication.",
    availability: "Wednesdays, 2:00 PM - 5:00 PM",
    qualification: "MA Communications",
    experienceYears: 10,
    domain: "Content Marketing",
    rating: 4.7,
    supportedLevels: ["Beginner", "Intermediate", "Advanced"],
    sessionFormats: ["Portfolio Review", "1:1 Coaching"],
  },
  {
    id: 4,
    name: "David Chen",
    designation: "Senior Data Analyst",
    expertise: ["Data Analysis", "Marketing Analytics", "Python"],
    bio: "Turns complex datasets into actionable business insights. Strong background in Python automation and building marketing dashboards.",
    availability: "Fridays, 9:00 AM - 12:00 PM",
    qualification: "BSc Computer Science",
    experienceYears: 6,
    domain: "Analytics & Data",
    rating: 4.9,
    supportedLevels: ["Beginner", "Intermediate"],
    sessionFormats: ["Code Review", "1:1 Coaching"],
  },
  {
    id: 5,
    name: "Sarah Jones",
    designation: "Product Manager",
    expertise: ["Project Management", "A/B Testing", "Communication"],
    bio: "Passionate about building products that users love. Expertise in agile project management and product experimentation.",
    availability: "Mondays & Wednesdays, 5:00 PM - 7:00 PM",
    qualification: "MBA, PMP",
    experienceYears: 9,
    domain: "Product Management",
    rating: 4.8,
    supportedLevels: ["Intermediate", "Advanced"],
    sessionFormats: ["Mock Interviews", "Case Review"],
  },
  {
    id: 6,
    name: "Vikram Singh",
    designation: "Performance Marketing Manager",
    expertise: ["Paid Advertising", "Conversion Optimization"],
    bio: "Specialist in scaling paid acquisition channels efficiently. Obsessed with ROAS and landing page conversion rates.",
    availability: "Thursdays, 11:00 AM - 2:00 PM",
    qualification: "BBA Marketing",
    experienceYears: 5,
    domain: "Performance Marketing",
    rating: 4.6,
    supportedLevels: ["Beginner", "Intermediate"],
    sessionFormats: ["Campaign Audit", "Q&A"],
  },
  {
    id: 7,
    name: "Priya Sharma",
    designation: "Python Developer & Mentor",
    expertise: ["Python", "Data Analysis", "Backend Development"],
    bio: "Software engineer with a focus on data pipelines and backend systems. Loves teaching Python and data analysis fundamentals.",
    availability: "Weekends, 10:00 AM - 2:00 PM",
    qualification: "MTech Computer Engineering",
    experienceYears: 7,
    domain: "Software Engineering",
    rating: 4.9,
    supportedLevels: ["Beginner", "Intermediate", "Advanced"],
    sessionFormats: ["Pair Programming", "Code Review"],
  },
  {
    id: 8,
    name: "Alex Rivera",
    designation: "Marketing Operations Lead",
    expertise: ["Project Management", "Marketing Analytics", "Paid Advertising"],
    bio: "Bridges the gap between marketing strategy and execution. Focuses on marketing automation, tracking, and process improvement.",
    availability: "Tuesdays, 9:00 AM - 12:00 PM",
    qualification: "BSc Business Administration",
    experienceYears: 8,
    domain: "Marketing Operations",
    rating: 4.7,
    supportedLevels: ["Intermediate", "Advanced"],
    sessionFormats: ["1:1 Coaching", "Process Audit"],
  }
];

export const demoCommunityMembers = [
  // 8 Trainees
  { id: 1, name: "Sameer Khan", role: "trainee", department: "Digital Outreach", status: "online" },
  { id: 12, name: "Rohit Singh", role: "trainee", department: "Public Engagement", status: "offline" },
  { id: 14, name: "Ayesha Ali", role: "trainee", department: "Digital Outreach", status: "online" },
  { id: 15, name: "Vikas Jain", role: "trainee", department: "Performance Marketing", status: "away" },
  { id: 16, name: "Pooja Singh", role: "trainee", department: "Public Engagement", status: "online" },
  { id: 17, name: "Arjun Reddy", role: "trainee", department: "Content Strategy", status: "offline" },
  { id: 18, name: "Kriti Sanon", role: "trainee", department: "Marketing Analytics", status: "online" },
  { id: 19, name: "Farhan Akhtar", role: "trainee", department: "Paid Advertising", status: "offline" },
  
  // 5 Trainers/Mentors
  { id: 2, name: "Ananya Sharma", role: "trainer", department: "Performance Marketing", status: "online" },
  { id: 5, name: "Rahul Verma", role: "trainer", department: "Growth Hacking", status: "away" },
  { id: 6, name: "Meera Iyer", role: "trainer", department: "Growth Strategy", status: "offline" },
  { id: 7, name: "Kavya Patel", role: "trainer", department: "Content Marketing", status: "online" },
  { id: 8, name: "David Chen", role: "trainer", department: "Analytics & Data", status: "online" },

  // 3 Admins
  { id: 3, name: "Neha Verma", role: "admin", department: "Training Administration", status: "online" },
  { id: 20, name: "Kiran Bedi", role: "admin", department: "System Operations", status: "away" },
  { id: 21, name: "Rajesh Koothrappali", role: "admin", department: "Platform Security", status: "offline" }
];

export const demoChatMessages: ChatMessage[] = [
  // Trainee Community
  {
    id: 1,
    channelId: "general-trainees",
    senderId: 2,
    senderName: "Ananya Sharma",
    senderRole: "trainer",
    content: "Welcome everyone! Feel free to ask any questions about the upcoming Marketing Analytics checkpoint.",
    timestamp: "2026-09-17T09:00:00Z",
    pinnedResource: { title: "Funnel KPI Workbook", url: "#" }
  },
  {
    id: 2,
    channelId: "general-trainees",
    senderId: 1,
    senderName: "Sameer Khan",
    senderRole: "trainee",
    content: "Thanks Ananya! I'm struggling a bit with attribution windows. Is there a specific resource for that?",
    timestamp: "2026-09-17T10:15:00Z"
  },
  {
    id: 3,
    channelId: "cohort-marketing",
    senderId: 14,
    senderName: "Ayesha Ali",
    senderRole: "trainee",
    content: "Has anyone completed the A/B Testing Case Lab yet? I'm stuck on scenario 2.",
    timestamp: "2026-09-18T08:30:00Z"
  },

  // Trainer Community
  {
    id: 4,
    channelId: "mentors-lounge",
    senderId: 5,
    senderName: "Rahul Verma",
    senderRole: "trainer",
    content: "Just a heads-up, I'm seeing a lot of trainees confusing ROAS with ROI in the latest checkpoint.",
    timestamp: "2026-09-16T14:20:00Z"
  },
  {
    id: 5,
    channelId: "mentors-lounge",
    senderId: 6,
    senderName: "Meera Iyer",
    senderRole: "trainer",
    content: "Good catch, Rahul. Let's add a clarifying note to the course materials.",
    timestamp: "2026-09-16T15:00:00Z"
  },
  {
    id: 6,
    channelId: "trainer-sync",
    senderId: 2,
    senderName: "Ananya Sharma",
    senderRole: "trainer",
    content: "Team, please remember to update your availability for next week's mentor clinics.",
    timestamp: "2026-09-18T09:00:00Z"
  },

  // Admin Community
  {
    id: 7,
    channelId: "admin-operations",
    senderId: 3,
    senderName: "Neha Verma",
    senderRole: "admin",
    content: "The new cohort onboarding is scheduled for Monday. Are all system permissions set?",
    timestamp: "2026-09-17T11:00:00Z"
  },
  {
    id: 8,
    channelId: "admin-operations",
    senderId: 20,
    senderName: "Kiran Bedi",
    senderRole: "admin",
    content: "Yes, all permissions are applied and the welcome emails are queued.",
    timestamp: "2026-09-17T11:15:00Z"
  },
  {
    id: 9,
    channelId: "system-alerts",
    senderId: 21,
    senderName: "Rajesh Koothrappali",
    senderRole: "admin",
    content: "System maintenance window is confirmed for Sunday 2 AM to 4 AM.",
    timestamp: "2026-09-18T10:00:00Z"
  }
];

export const demoRoleSuggestions: RoleSuggestion[] = [
  {
    id: 1,
    traineeId: 1, // Sameer Khan
    trainerId: 2, // Ananya Sharma
    trainerName: "Ananya Sharma",
    suggestedRole: "Senior Performance Marketer",
    requiredSkills: ["Marketing Analytics", "Attribution Modeling", "Campaign Optimization"],
    strengths: ["Campaign Optimization", "Paid Advertising"],
    gaps: ["Advanced Attribution Modeling"],
    explanation: "Sameer has shown strong practical campaign management skills. With a bit more focus on multi-touch attribution, he'll be ready to lead cross-channel performance initiatives.",
    preparationResources: ["Attribution Deep Dive Course", "KPI Mapping Framework"],
    suggestedAt: "2026-09-16T14:30:00Z"
  }
];

export const demoOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Senior Performance Marketer",
    department: "Marketing",
    type: "Placement",
    requirements: ["Marketing Analytics", "Attribution Modeling", "Campaign Optimization"],
    description: "Lead multi-channel performance initiatives and drive ROI through data-driven decisions."
  },
  {
    id: 2,
    title: "Growth Hacking Intern",
    department: "Growth",
    type: "Internship",
    requirements: ["A/B Testing", "Conversion Optimization", "Data Engineering"],
    description: "Work with the growth team to run high-velocity experiments and optimize user funnels."
  }
];

export const demoRoleApplications: RoleApplication[] = [
  {
    id: 1,
    userId: 1, // Sameer
    opportunityId: 2,
    status: "reviewing",
    appliedAt: "2026-09-10T10:00:00Z"
  }
];

export const demoChatConversations: ChatConversation[] = [
  {
    id: "conv-1",
    title: "Understanding my A/B Testing gap",
    userId: 1, // Sameer
    updatedAt: "2026-09-17T10:00:00Z",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Can you explain why I have a skill gap in A/B Testing? I thought I did well on the diagnostic.",
        createdAt: "2026-09-17T09:58:00Z"
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "I'd be happy to explain! While you demonstrated strong foundational knowledge of statistical significance in the diagnostic, the 'Growth Hacking Intern' role requires practical evidence of designing multi-variate experiments and interpreting complex results in real-world scenarios. Your current evidence profile lacks applied project artifacts for these specific tasks.",
        createdAt: "2026-09-17T09:58:15Z"
      },
      {
        id: "msg-3",
        role: "user",
        content: "What's the best next learning step to close this?",
        createdAt: "2026-09-17T09:59:00Z"
      },
      {
        id: "msg-4",
        role: "assistant",
        content: "I suggest starting with the 'Advanced Experimentation Workshop'. It focuses entirely on applied A/B and multivariate testing. Completing the project at the end of this course will provide the necessary evidence to close your gap.",
        createdAt: "2026-09-17T10:00:00Z",
        sources: [
          { title: "Advanced Experimentation Workshop", type: "course" }
        ]
      }
    ]
  },
  {
    id: "conv-2",
    title: "Preparing for Performance Marketer role",
    userId: 1,
    updatedAt: "2026-09-16T15:30:00Z",
    messages: [
      {
        id: "msg-10",
        role: "user",
        content: "How should I prepare for the Senior Performance Marketer placement?",
        createdAt: "2026-09-16T15:28:00Z"
      },
      {
        id: "msg-11",
        role: "assistant",
        content: "To prepare for the Senior Performance Marketer role, you need to focus on Attribution Modeling. Your current Marketing Analytics skills are excellent, but you need to demonstrate how you assign credit across multiple touchpoints. I recommend reviewing the 'Multi-Touch Attribution Guidelines' and booking a session with an expert to discuss practical application.",
        createdAt: "2026-09-16T15:29:00Z",
        sources: [
          { title: "Multi-Touch Attribution Guidelines", type: "document" },
          { title: "Senior Performance Marketer", type: "role" }
        ]
      },
      {
        id: "msg-12",
        role: "user",
        content: "Who is a good expert to talk to about this?",
        createdAt: "2026-09-16T15:29:30Z"
      },
      {
        id: "msg-13",
        role: "assistant",
        content: "Based on your need for Attribution Modeling, I highly recommend speaking with David Chen. He is a Senior Performance Marketer with 8 years of experience and is rated 4.9/5 by other trainees.",
        createdAt: "2026-09-16T15:30:00Z",
        sources: [
          { title: "David Chen", type: "expert" }
        ]
      }
    ]
  },
  {
    id: "conv-3",
    title: "Course concept: Attribution windows",
    userId: 1,
    updatedAt: "2026-09-15T11:00:00Z",
    messages: [
      {
        id: "msg-20",
        role: "user",
        content: "Can you explain the concept of an attribution window from the Campaign Measurement Foundations course?",
        createdAt: "2026-09-15T10:55:00Z"
      },
      {
        id: "msg-21",
        role: "assistant",
        content: "An attribution window is the period of time after a user interacts with an ad (like a click or view) during which a subsequent conversion can be credited to that ad. For example, a 7-day click attribution window means that if a user buys something within 7 days of clicking your ad, the ad gets the credit.",
        createdAt: "2026-09-15T10:56:00Z",
        sources: [
          { title: "Campaign Measurement Foundations", type: "course" }
        ]
      }
    ]
  }
];
