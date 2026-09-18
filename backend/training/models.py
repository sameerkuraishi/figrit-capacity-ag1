import uuid
from django.contrib.auth.models import User
from django.db import models

ROLE_CHOICES = [("trainee", "Trainee"), ("trainer", "Trainer"), ("admin", "Admin")]


def generate_token():
    return uuid.uuid4().hex


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="trainee")
    employee_id = models.CharField(max_length=60, unique=True)
    organization = models.CharField(max_length=180, blank=True, default="Capacity Connect Demo Organization")
    department = models.CharField(max_length=160, blank=True)
    designation = models.CharField(max_length=160, blank=True)
    qualification = models.CharField(max_length=180, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    interests = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    certificates = models.JSONField(default=list, blank=True)
    approved = models.BooleanField(default=True)
    domain = models.CharField(max_length=160, blank=True)
    preferred_language = models.CharField(max_length=80, blank=True, default="English")
    rating = models.FloatField(default=0)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.role})"


class ApiToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="api_tokens")
    token = models.CharField(max_length=64, unique=True, default=generate_token)
    created_at = models.DateTimeField(auto_now_add=True)


class Domain(models.Model):
    name = models.CharField(max_length=160, unique=True)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Competency(models.Model):
    name = models.CharField(max_length=160, unique=True)
    category = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    validity_days = models.PositiveIntegerField(default=365)

    def __str__(self):
        return self.name


class JobRole(models.Model):
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name="job_roles")
    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("domain", "name")

    def __str__(self):
        return self.name


class RoleCompetencyRequirement(models.Model):
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE, related_name="requirements")
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    required_level = models.FloatField(default=70)
    weight = models.FloatField(default=1)

    class Meta:
        unique_together = ("job_role", "competency")


class UserCompetency(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="competency_scores")
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    confidence = models.FloatField(default=0)
    freshness = models.FloatField(default=100)
    source = models.CharField(max_length=120, default="assessment")
    evidence_count = models.PositiveIntegerField(default=0)
    last_verified = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "competency")


class CompetencyEvidence(models.Model):
    user_competency = models.ForeignKey(UserCompetency, on_delete=models.CASCADE, related_name="evidence")
    evidence_type = models.CharField(max_length=80)
    label = models.CharField(max_length=220)
    score = models.FloatField(null=True, blank=True)
    verified = models.BooleanField(default=True)
    source_reference = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Subject(models.Model):
    title = models.CharField(max_length=180)
    category = models.CharField(max_length=160, blank=True)
    description = models.TextField(blank=True)
    required_competencies = models.JSONField(default=dict)

    def __str__(self):
        return self.title


class TrainerCompetency(models.Model):
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trainer_competencies")
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    level = models.FloatField(default=0)
    evidence = models.CharField(max_length=255, blank=True)
    years = models.FloatField(default=0)

    class Meta:
        unique_together = ("trainer", "competency")


class Course(models.Model):
    STATUS = [("draft", "Draft"), ("published", "Published"), ("archived", "Archived")]
    code = models.CharField(max_length=40, unique=True)
    title = models.CharField(max_length=220)
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT, related_name="courses")
    trainer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="courses_taught")
    description = models.TextField(blank=True)
    duration_weeks = models.PositiveIntegerField(default=4)
    duration_hours = models.FloatField(default=0)
    seats = models.PositiveIntegerField(default=50)
    level = models.CharField(max_length=40, default="Foundation")
    status = models.CharField(max_length=20, choices=STATUS, default="published")
    tags = models.JSONField(default=list, blank=True)
    language = models.CharField(max_length=80, default="English")
    rating = models.FloatField(default=0)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Enrollment(models.Model):
    STATUS = [("enrolled", "Enrolled"), ("in_progress", "In Progress"), ("completed", "Completed")]
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    progress = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS, default="enrolled")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("trainee", "course")


class Resource(models.Model):
    TYPES = [(x, x) for x in ["Video", "PDF", "PPT", "Notes", "Link"]]
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="resources")
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=220)
    resource_type = models.CharField(max_length=20, choices=TYPES)
    url = models.URLField(blank=True)
    file = models.FileField(upload_to="training_resources/", blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Assessment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assessments")
    title = models.CharField(max_length=220)
    deadline = models.DateTimeField(null=True, blank=True)
    pass_mark = models.PositiveIntegerField(default=60)
    attempts_allowed = models.PositiveIntegerField(default=2)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)


class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="questions")
    prompt = models.TextField()
    options = models.JSONField(default=list)
    correct_answer = models.PositiveIntegerField(default=0)
    competency = models.ForeignKey(Competency, on_delete=models.SET_NULL, null=True, blank=True)
    skill = models.CharField(max_length=160, blank=True)
    difficulty = models.CharField(max_length=40, default="Intermediate")
    question_type = models.CharField(max_length=40, default="MCQ")
    weight = models.FloatField(default=1)


class Attempt(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="attempts")
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assessment_attempts")
    answers = models.JSONField(default=dict)
    score = models.FloatField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)


class DiagnosticQuestion(models.Model):
    DIFFICULTY = [(x, x) for x in ["Beginner", "Intermediate", "Advanced"]]
    TYPES = [(x, x) for x in ["MCQ", "Scenario", "Case"]]
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name="diagnostic_questions")
    subdomain = models.CharField(max_length=160, blank=True)
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    skill = models.CharField(max_length=160, blank=True)
    difficulty = models.CharField(max_length=40, choices=DIFFICULTY, default="Beginner")
    question_type = models.CharField(max_length=40, choices=TYPES, default="MCQ")
    prompt = models.TextField()
    options = models.JSONField(default=list)
    correct_answers = models.JSONField(default=list)
    explanation = models.TextField(blank=True)
    weight = models.FloatField(default=1)
    active = models.BooleanField(default=True)


class DiagnosticAttempt(models.Model):
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="diagnostic_attempts")
    domain = models.ForeignKey(Domain, on_delete=models.PROTECT)
    target_role = models.ForeignKey(JobRole, on_delete=models.SET_NULL, null=True, blank=True)
    state = models.JSONField(default=dict)
    competency_scores = models.JSONField(default=dict)
    role_alignment = models.JSONField(default=list)
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)


class LearningPath(models.Model):
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="learning_paths")
    target_role = models.ForeignKey(JobRole, on_delete=models.SET_NULL, null=True, blank=True)
    current_readiness = models.FloatField(default=0)
    target_readiness = models.FloatField(default=80)
    status = models.CharField(max_length=40, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class LearningPathItem(models.Model):
    TYPES = [(x, x) for x in ["assessment", "course", "practice", "mentor", "reassessment"]]
    STATES = [(x, x) for x in ["completed", "current", "available", "locked"]]
    learning_path = models.ForeignKey(LearningPath, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=220)
    item_type = models.CharField(max_length=40, choices=TYPES)
    competency = models.ForeignKey(Competency, on_delete=models.SET_NULL, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)
    status = models.CharField(max_length=40, choices=STATES, default="locked")
    order = models.PositiveIntegerField(default=0)
    note = models.CharField(max_length=255, blank=True)


class MentorAvailability(models.Model):
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentor_availability")
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    active = models.BooleanField(default=True)


class MentorBooking(models.Model):
    STATUS = [(x, x) for x in ["scheduled", "completed", "cancelled", "no-show"]]
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentor_bookings")
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentor_sessions")
    start_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=20)
    reason = models.CharField(max_length=160)
    note = models.TextField(blank=True)
    competency = models.ForeignKey(Competency, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS, default="scheduled")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def end_at(self):
        from datetime import timedelta
        return self.start_at + timedelta(minutes=self.duration_minutes)


class MentorSessionOutcome(models.Model):
    booking = models.OneToOneField(MentorBooking, on_delete=models.CASCADE, related_name="outcome")
    topic_discussed = models.CharField(max_length=220, blank=True)
    problem_identified = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    recommended_action = models.TextField(blank=True)
    recommended_course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    recommended_practice = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Cohort(models.Model):
    name = models.CharField(max_length=180)
    competency = models.ForeignKey(Competency, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.CharField(max_length=80, blank=True)
    language = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=40, default="suggested")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class CohortMember(models.Model):
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name="members")
    trainee = models.ForeignKey(User, on_delete=models.CASCADE)
    readiness = models.FloatField(default=0)

    class Meta:
        unique_together = ("cohort", "trainee")


class Feedback(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="feedback")
    trainee = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    trainer_rating = models.PositiveIntegerField(default=5)
    content_rating = models.PositiveIntegerField(default=5)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Certificate(models.Model):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name="certificate")
    certificate_id = models.CharField(max_length=64, unique=True)
    score = models.FloatField(default=0)
    status = models.CharField(max_length=30, default="valid")
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)


class Announcement(models.Model):
    KINDS = [(x, x) for x in ["Announcement", "Achievement", "New Content", "Deadline"]]
    title = models.CharField(max_length=220)
    body = models.TextField()
    kind = models.CharField(max_length=40, choices=KINDS, default="Announcement")
    audience = models.CharField(max_length=30, default="all")
    published_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    published_at = models.DateTimeField(auto_now_add=True)


class KnowledgeDocument(models.Model):
    title = models.CharField(max_length=220)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="knowledge_docs")
    content = models.TextField()
    source_label = models.CharField(max_length=220, blank=True)
    competency = models.ForeignKey(Competency, on_delete=models.SET_NULL, null=True, blank=True)
    content_type = models.CharField(max_length=80, default="Training Note")
    verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
