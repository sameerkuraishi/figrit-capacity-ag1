export type UserRole = "trainee" | "trainer" | "admin";
export type RiskLevel = "healthy" | "attention" | "critical";
export type GapStatus = "Achieved" | "Low" | "Moderate" | "Critical";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  department: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  interests: string[];
  skills: string[];
  certificates: string[];
  approved: boolean;
  domain?: string;
  preferredLanguage?: string;
  organization?: string;
};

export type CompetencyScore = {
  id?: number;
  name: string;
  current: number;
  required: number;
  gap: number;
  status?: GapStatus;
  confidence?: number;
  freshness?: number;
  evidenceCount?: number;
  category?: string;
};

export type RoleAlignment = {
  id: number;
  name: string;
  domain: string;
  score: number;
  reason: string;
  strengths: string[];
  gaps: string[];
};

export type DiagnosticQuestion = {
  id: number;
  prompt: string;
  options: string[];
  competency: string;
  skill: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questionType?: "MCQ" | "Scenario" | "Case";
  progress?: number;
};

export type DiagnosticResult = {
  attemptId: number;
  domain: string;
  overallScore: number;
  confidence: number;
  strongestAreas: Array<{ name: string; score: number }>;
  competencyScores: Array<{ name: string; score: number; confidence: number }>;
  roleAlignment: RoleAlignment[];
};

export type LearningPathItem = {
  id: number;
  title: string;
  itemType: "assessment" | "course" | "practice" | "mentor" | "reassessment";
  competency: string;
  durationMinutes: number;
  status: "completed" | "current" | "locked" | "available";
  note?: string;
};

export type LearningPath = {
  id: number;
  targetRole: string;
  currentReadiness: number;
  targetReadiness: number;
  items: LearningPathItem[];
};

export type Course = {
  id: number;
  code: string;
  title: string;
  subject: string;
  description: string;
  trainer: string;
  durationWeeks: number;
  durationHours?: number;
  enrolled: number;
  seats: number;
  progress?: number;
  status: "Published" | "Draft" | "Completed" | "In Progress" | "Not Enrolled";
  level: "Foundation" | "Intermediate" | "Advanced";
  tags: string[];
  requiredCompetencies: Record<string, number>;
  language?: string;
  rating?: number;
  whyRecommended?: string;
};

export type Resource = {
  id: number;
  courseId: number;
  title: string;
  type: "Video" | "PDF" | "PPT" | "Notes" | "Link";
  duration?: string;
  url: string;
};

export type Assessment = {
  id: number;
  courseId: number;
  title: string;
  deadline: string;
  passMark: number;
  questions: Array<{
    id: number;
    prompt: string;
    options: string[];
    answer: number;
    competency: string;
  }>;
};

export type TrainerMatch = {
  id: number;
  name: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  match: number;
  domain: string;
  strengths: string[];
  languages?: string[];
  nextAvailable?: string;
  breakdown: {
    skills: number;
    domain: number;
    experience: number;
    qualification: number;
  };
};

export type MentorBooking = {
  id: number;
  trainerId: number;
  trainerName: string;
  startAt: string;
  durationMinutes: 20 | 30;
  reason: string;
  note: string;
  competency?: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
};

export type Announcement = {
  id: number;
  kind: "Announcement" | "Achievement" | "New Content" | "Deadline";
  title: string;
  body: string;
  date: string;
};

export type CapacityCell = {
  unit: string;
  competency: string;
  readiness: number;
  required: number;
  qualified: number;
  total: number;
  trainers: number;
  backups: number;
  risk: RiskLevel;
};

export type CohortSuggestion = {
  id: number;
  name: string;
  level: string;
  learners: number;
  competency: string;
  language: string;
  readinessRange: string;
};

export type DashboardPayload = {
  profile: UserProfile;
  courses: Course[];
  announcements: Announcement[];
  competencyGaps: CompetencyScore[];
};

export type TeamMode = "Similar Skill Set" | "Mixed Skill Set";

export type TeamMemberRole = "member" | "trainer" | "lead";

export type TeamMember = {
  id: number;
  userId: number;
  name: string;
  role: TeamMemberRole;
  skills: { name: string; level: number; match: boolean }[];
};

export type Team = {
  id: number;
  name: string;
  purpose: string;
  mode: TeamMode;
  targetSize: number;
  requiredSkills: string[];
  trainerId?: number;
  members: TeamMember[];
  status: "draft" | "active" | "completed";
};

export type MembershipRequest = {
  id: number;
  teamId: number;
  userId: number;
  userName: string;
  userSkills: { name: string; level: number }[];
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  message?: string;
};

export type TeamInvitation = {
  id: number;
  teamId: number;
  teamName: string;
  userId: number;
  role: TeamMemberRole;
  status: "pending" | "accepted" | "declined";
  invitedAt: string;
};

export type ExpertRecord = {
  id: number;
  name: string;
  designation: string;
  expertise: string[];
  bio: string;
  availability: string;
  qualification: string;
  experienceYears: number;
  domain: string;
  rating: number;
  supportedLevels?: string[];
  sessionFormats?: string[];
};

export type ChatMessage = {
  id: number;
  channelId: string;
  senderId: number;
  senderName: string;
  senderRole: "trainer" | "trainee" | "admin";
  content: string;
  timestamp: string;
  pinnedResource?: { title: string; url: string };
};

export type RoleSuggestion = {
  id: number;
  traineeId: number;
  trainerId: number;
  trainerName: string;
  suggestedRole: string;
  requiredSkills: string[];
  strengths: string[];
  gaps: string[];
  explanation: string;
  preparationResources: string[];
  suggestedAt: string;
};

export type Opportunity = {
  id: number;
  title: string;
  department: string;
  type: "Internship" | "Placement" | "Project";
  requirements: string[];
  description: string;
};

export type RoleApplication = {
  id: number;
  userId: number;
  opportunityId: number;
  status: "applied" | "reviewing" | "accepted" | "rejected";
  appliedAt: string;
};

export type SourceMetadata = {
  title: string;
  url?: string;
  type: "course" | "expert" | "document" | "role";
};

export type SadieMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources?: SourceMetadata[];
};

export type ChatConversation = {
  id: string;
  title: string;
  userId: number;
  updatedAt: string;
  messages: SadieMessage[];
};
