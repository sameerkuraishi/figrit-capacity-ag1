from datetime import date, datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone

from training.models import (
    Announcement,
    Assessment,
    Certificate,
    Cohort,
    Competency,
    CompetencyEvidence,
    Course,
    DiagnosticQuestion,
    Domain,
    Enrollment,
    JobRole,
    KnowledgeDocument,
    LearningPath,
    LearningPathItem,
    MentorAvailability,
    MentorBooking,
    Question,
    Resource,
    RoleCompetencyRequirement,
    Subject,
    TrainerCompetency,
    UserCompetency,
    UserProfile,
)


class Command(BaseCommand):
    help = "Seed FIGR.IT / Capacity Connect SIH26075 demo data"

    def handle(self, *args, **options):
        def make_user(email, first, last, role, employee_id, department, designation, qualification, experience, domain="", rating=0, approved=True, language="English / Hindi"):
            u, _ = User.objects.get_or_create(username=email, defaults={"email": email})
            u.email = email
            u.first_name = first
            u.last_name = last
            u.set_password("demo123")
            u.save()
            p, _ = UserProfile.objects.get_or_create(user=u, defaults={"employee_id": employee_id})
            p.role = role
            p.employee_id = employee_id
            p.organization = "Capacity Connect Demo Organization"
            p.department = department
            p.designation = designation
            p.qualification = qualification
            p.experience_years = experience
            p.domain = domain
            p.preferred_language = language
            p.rating = rating
            p.approved = approved
            p.interests = {
                "trainee": ["Performance Marketing", "Analytics", "Content Strategy"],
                "trainer": ["Mentoring", "Applied Learning", domain or department],
                "admin": ["Capacity Intelligence", "Analytics", "Competency Planning"],
            }.get(role, [])
            p.skills = {
                "trainee": ["Marketing Fundamentals", "Copywriting", "SEO Basics"],
                "trainer": ["Mentoring", "Assessment Design", "Domain Expertise"],
                "admin": ["Program Management", "Analytics", "Administration"],
            }.get(role, [])
            p.certificates = {
                "trainee": ["Digital Marketing Fundamentals"],
                "trainer": ["Verified Capacity Connect Mentor"],
                "admin": ["Training Management"],
            }.get(role, [])
            p.save()
            return u

        trainee = make_user(
            "trainee@figr.it", "Sameer", "Khan", "trainee", "CC-T-1042",
            "Digital Outreach & Marketing", "Marketing Associate", "B.Tech", 2,
            domain="Marketing",
        )
        trainer = make_user(
            "trainer@figr.it", "Ananya", "Sharma", "trainer", "CC-TR-021",
            "Growth & Digital Learning", "Senior Performance Marketing Mentor", "MBA Marketing", 11,
            domain="Performance Marketing Analytics", rating=4.9,
        )
        admin = make_user(
            "admin@figr.it", "Neha", "Verma", "admin", "CC-ADM-007",
            "Training Administration", "Capacity Building Administrator", "M.Tech + MBA", 10,
            domain="Organizational Development", rating=4.8,
        )
        trainer2 = make_user(
            "rahul.trainer@figr.it", "Rahul", "Verma", "trainer", "CC-TR-032",
            "Growth & Experimentation", "Experimentation Lead", "M.Sc. Analytics", 8,
            domain="Experimentation Conversion Analytics", rating=4.8,
        )
        trainer3 = make_user(
            "meera.trainer@figr.it", "Meera", "Iyer", "trainer", "CC-TR-044",
            "Growth Strategy", "Senior Growth Mentor", "MBA Marketing", 13,
            domain="Growth CRO Strategy", rating=4.7,
        )

        # Pending users for approval workflow.
        make_user(
            "arvind.pending@figr.it", "Arvind", "Rao", "trainer", "CC-TR-P51",
            "Data & Analytics", "Analytics Mentor", "M.Sc. Statistics", 10,
            domain="Data Analytics", rating=4.6, approved=False,
        )
        make_user(
            "rohit.pending@figr.it", "Rohit", "Singh", "trainee", "CC-T-P52",
            "Public Engagement", "Communication Associate", "BBA", 1,
            domain="Marketing", approved=False,
        )

        # Additional trainees make admin capacity analytics meaningful.
        extra_trainees = []
        seed_people = [
            ("ayesha@figr.it", "Ayesha", "Ali", "Digital Outreach & Marketing", 2),
            ("karan@figr.it", "Karan", "Mehta", "Digital Outreach & Marketing", 3),
            ("pooja@figr.it", "Pooja", "Singh", "Digital Outreach & Marketing", 4),
            ("vikas@figr.it", "Vikas", "Jain", "Public Engagement", 3),
            ("neeraj@figr.it", "Neeraj", "Gupta", "Public Engagement", 5),
            ("sana@figr.it", "Sana", "Khan", "Regional Communications", 4),
            ("aditya@figr.it", "Aditya", "Roy", "Regional Communications", 2),
            ("mansi@figr.it", "Mansi", "Patel", "Training Cell", 3),
            ("faiz@figr.it", "Faiz", "Ansari", "Training Cell", 2),
        ]
        for index, (email, first, last, dept, exp) in enumerate(seed_people, start=200):
            extra_trainees.append(make_user(
                email, first, last, "trainee", f"CC-T-{index}", dept,
                "Marketing / Communication Associate", "Graduate", exp, domain="Marketing"
            ))

        domains = {}
        for name, description in [
            ("Marketing", "Content, performance marketing, SEO, CRM, analytics and customer growth."),
            ("Meteorology", "Forecasting, radar, satellite, climate data and operational decision support."),
            ("Data & Analytics", "Data analysis, reporting, visualization, SQL and decision intelligence."),
            ("Human Resources", "People operations, talent development, performance and employee experience."),
            ("IT & Digital", "Applications, cloud, security, support and digital systems."),
            ("Operations", "Process quality, service delivery, compliance and execution excellence."),
        ]:
            domains[name], _ = Domain.objects.get_or_create(name=name, defaults={"description": description})

        competency_defs = [
            ("Marketing Fundamentals", "Foundation", 365),
            ("Copywriting", "Communication", 365),
            ("SEO", "Organic Growth", 270),
            ("Paid Advertising", "Performance", 180),
            ("Marketing Analytics", "Analytics", 180),
            ("A/B Testing", "Experimentation", 180),
            ("Conversion Optimization", "Performance", 180),
            ("Customer Understanding", "Foundation", 365),
            ("Content Strategy", "Communication", 365),
            ("CRM & Retention", "Lifecycle", 270),
            ("Radar Interpretation", "Meteorology", 180),
            ("Forecasting", "Meteorology", 180),
            ("GIS", "Meteorology", 270),
            ("Python", "Data", 270),
            ("Data Analysis", "Data", 180),
            ("Communication", "Transferable", 365),
        ]
        competencies = {}
        for name, category, validity in competency_defs:
            competencies[name], _ = Competency.objects.get_or_create(
                name=name,
                defaults={"category": category, "validity_days": validity},
            )

        marketing_roles = {
            "Content Marketing Specialist": {
                "Marketing Fundamentals": 75, "Copywriting": 85, "SEO": 75,
                "Customer Understanding": 78, "Content Strategy": 88, "Marketing Analytics": 55,
            },
            "SEO Specialist": {
                "Marketing Fundamentals": 70, "Copywriting": 68, "SEO": 88,
                "Customer Understanding": 65, "Marketing Analytics": 70,
            },
            "Social Media Specialist": {
                "Marketing Fundamentals": 75, "Copywriting": 80, "Customer Understanding": 80,
                "Paid Advertising": 70, "Marketing Analytics": 62,
            },
            "Performance Marketing Specialist": {
                "Marketing Fundamentals": 75, "Copywriting": 70, "Paid Advertising": 85,
                "Marketing Analytics": 80, "A/B Testing": 75, "Conversion Optimization": 75,
            },
            "Marketing Analyst": {
                "Marketing Fundamentals": 68, "Marketing Analytics": 88, "A/B Testing": 72,
                "Customer Understanding": 70, "Data Analysis": 80,
            },
        }
        role_objects = {}
        for role_name, requirements in marketing_roles.items():
            role, _ = JobRole.objects.get_or_create(
                domain=domains["Marketing"], name=role_name,
                defaults={"description": f"Competency profile for {role_name}."},
            )
            role_objects[role_name] = role
            for comp_name, level in requirements.items():
                RoleCompetencyRequirement.objects.update_or_create(
                    job_role=role, competency=competencies[comp_name],
                    defaults={"required_level": level, "weight": 1.2 if level >= 80 else 1.0},
                )

        meteorology_roles = {
            "Radar Analyst": {"Radar Interpretation": 85, "Forecasting": 70, "GIS": 60, "Data Analysis": 70},
            "Weather Forecaster": {"Forecasting": 88, "Radar Interpretation": 72, "GIS": 65, "Communication": 75},
            "Climate Data Analyst": {"Data Analysis": 85, "Python": 78, "GIS": 70, "Communication": 60},
        }
        for role_name, requirements in meteorology_roles.items():
            role, _ = JobRole.objects.get_or_create(domain=domains["Meteorology"], name=role_name)
            for comp_name, level in requirements.items():
                RoleCompetencyRequirement.objects.update_or_create(
                    job_role=role, competency=competencies[comp_name],
                    defaults={"required_level": level, "weight": 1},
                )

        def set_trainer_comp(trainer_user, mapping):
            for name, level in mapping.items():
                TrainerCompetency.objects.update_or_create(
                    trainer=trainer_user,
                    competency=competencies[name],
                    defaults={"level": level / 10 if level > 10 else level, "years": trainer_user.profile.experience_years, "evidence": "Verified profile + training history"},
                )

        # TrainerCompetency keeps a 0–10 scale for the legacy matching API.
        set_trainer_comp(trainer, {
            "Paid Advertising": 9.6, "Marketing Analytics": 9.4, "A/B Testing": 9.1,
            "Conversion Optimization": 8.8, "Copywriting": 8.0, "Marketing Fundamentals": 9.2,
        })
        set_trainer_comp(trainer2, {
            "A/B Testing": 9.6, "Conversion Optimization": 9.3, "Marketing Analytics": 8.5,
            "Paid Advertising": 7.9, "Marketing Fundamentals": 8.4,
        })
        set_trainer_comp(trainer3, {
            "Conversion Optimization": 9.5, "Marketing Analytics": 8.7, "Paid Advertising": 8.2,
            "Marketing Fundamentals": 9.0, "Customer Understanding": 9.2,
        })

        # Diagnostic question bank. Three levels per major competency allow adaptive routing.
        diagnostic_rows = [
            ("Marketing Fundamentals", "Segmentation", "Beginner", "MCQ", "Which statement best describes market segmentation?", ["Giving every customer the same message", "Grouping customers with similar needs or traits", "Only reducing product price", "Choosing one social network"], 1),
            ("Marketing Fundamentals", "Positioning", "Intermediate", "Scenario", "A product is premium-priced but campaigns focus only on discounts. What is the main strategic mismatch?", ["Too many impressions", "Positioning and message are inconsistent", "The campaign needs more hashtags", "The landing page must be longer"], 1),
            ("Marketing Fundamentals", "Strategy", "Advanced", "Case", "A campaign has high reach and low qualified demand. What is the strongest first diagnosis?", ["Increase spend immediately", "Review audience, value proposition and funnel intent", "Remove analytics", "Stop all organic content"], 1),
            ("Copywriting", "Value proposition", "Beginner", "MCQ", "Which headline is most outcome-focused?", ["Our software has many features", "Save two hours every week on campaign reporting", "Welcome to our website", "We are a leading company"], 1),
            ("Copywriting", "Message match", "Intermediate", "Scenario", "An ad promises a free audit but the landing page discusses only a paid plan. What is the biggest issue?", ["Low keyword density", "Message mismatch", "Too many page sections", "The logo size"], 1),
            ("Copywriting", "Objection handling", "Advanced", "Case", "Users understand the offer but hesitate because implementation seems complex. Which copy element should be strengthened?", ["Social follower count", "Risk-reversal and implementation clarity", "More exclamation marks", "A longer footer"], 1),
            ("Paid Advertising", "Campaign objective", "Beginner", "MCQ", "If the business goal is completed purchases, which campaign signal is most aligned?", ["Page likes", "Purchases / conversion events", "Video views only", "Post comments"], 1),
            ("Paid Advertising", "Budget allocation", "Intermediate", "Scenario", "Campaign A has lower CPA and stable quality than Campaign B. What is the most defensible next step?", ["Move all budget instantly", "Gradually shift budget while monitoring marginal performance", "Pause tracking", "Optimize only for impressions"], 1),
            ("Paid Advertising", "Auction strategy", "Advanced", "Case", "CPA rises after aggressive scaling while conversion rate stays stable. Which factor deserves attention first?", ["Marginal audience cost and auction pressure", "Font style", "Organic follower count", "Email subject lines"], 0),
            ("Marketing Analytics", "Efficiency metric", "Beginner", "MCQ", "Which metric directly expresses cost per completed conversion?", ["CTR", "CPM", "CPA", "Reach"], 2),
            ("Marketing Analytics", "Funnel diagnosis", "Intermediate", "Scenario", "Traffic increases 40% but conversions stay flat. What should you compare first?", ["Only total impressions", "Conversion rate and traffic quality by source", "Company headcount", "Number of social posts"], 1),
            ("Marketing Analytics", "Attribution", "Advanced", "Case", "Two channels both claim credit for the same conversions. What should the analyst do?", ["Add both numbers without checks", "Review attribution rules and deduplicate conversion paths", "Choose the channel with more clicks", "Ignore the issue"], 1),
            ("A/B Testing", "Hypothesis", "Beginner", "MCQ", "Which is a valid A/B testing principle?", ["Change many variables at once", "Define a clear hypothesis before the test", "Stop after the first conversion", "Use different audiences for each variant without control"], 1),
            ("A/B Testing", "Sample discipline", "Intermediate", "Scenario", "Variant B leads after one day with very little traffic. What is the best action?", ["Declare B the winner immediately", "Continue until the planned evidence threshold is reached", "Delete variant A", "Change the goal metric"], 1),
            ("A/B Testing", "Experiment validity", "Advanced", "Case", "A test changes the headline, price and CTA simultaneously. What is the main interpretation problem?", ["The test has too much traffic", "You cannot isolate which change caused the effect", "The campaign will always lose", "The page needs a video"], 1),
            ("Conversion Optimization", "Friction", "Beginner", "MCQ", "Which is most likely to increase checkout friction?", ["Clear delivery date", "Unnecessary form fields", "Trusted payment options", "Visible return policy"], 1),
            ("Conversion Optimization", "Landing page", "Intermediate", "Scenario", "An ad has strong CTR but the landing page conversion rate is weak. Which area should be investigated first?", ["Ad impressions only", "Landing-page message match, speed and friction", "Follower count", "Office location"], 1),
            ("Conversion Optimization", "Funnel prioritization", "Advanced", "Case", "A funnel has 90% product-view retention but a sharp drop at payment. Where should effort focus first?", ["Top-of-funnel awareness", "Payment-stage friction and trust", "More homepage banners", "More impressions"], 1),
            ("Customer Understanding", "Needs", "Beginner", "MCQ", "A useful customer insight should primarily explain what?", ["Only age", "Needs, context and decision drivers", "Logo preference only", "Number of competitors"], 1),
            ("Customer Understanding", "Research", "Intermediate", "Scenario", "Survey users say price is high, but interviews show fear of switching. What should the team do?", ["Ignore interviews", "Triangulate evidence before concluding the main barrier", "Cut price immediately", "Stop research"], 1),
            ("Content Strategy", "Intent", "Beginner", "MCQ", "Content for users comparing vendors should primarily help them do what?", ["Understand trade-offs and evaluate options", "Only entertain", "Avoid product information", "Increase page count"], 1),
        ]
        for comp_name, skill, difficulty, qtype, prompt, options, correct in diagnostic_rows:
            DiagnosticQuestion.objects.update_or_create(
                domain=domains["Marketing"], competency=competencies[comp_name], prompt=prompt,
                defaults={
                    "subdomain": "Digital Marketing",
                    "skill": skill,
                    "difficulty": difficulty,
                    "question_type": qtype,
                    "options": options,
                    "correct_answers": [correct],
                    "explanation": f"This question measures {comp_name} / {skill}.",
                    "weight": 1,
                    "active": True,
                },
            )

        # A smaller meteorology bank proves the architecture is category-specific rather than hard-coded to Marketing.
        met_rows = [
            ("Radar Interpretation", "Beginner", "Doppler radar primarily measures which motion component?", ["Vertical temperature", "Radial velocity", "Humidity", "Cloud height"], 1),
            ("Radar Interpretation", "Intermediate", "A hook echo most strongly suggests what type of concern?", ["Fog", "Rotating supercell", "Heat wave", "Air pollution"], 1),
            ("Forecasting", "Beginner", "A forecast should combine observations with what?", ["Only one historical day", "Guidance, context and uncertainty", "Social media only", "No verification"], 1),
            ("GIS", "Beginner", "GIS is most useful for connecting data with what?", ["Spatial location", "Password strength", "Audio volume", "File compression"], 0),
            ("Data Analysis", "Intermediate", "Before analyzing a weather dataset, what should be checked first?", ["Schema, missingness and units", "Chart colors", "Logo size", "Number of slides"], 0),
        ]
        for comp_name, difficulty, prompt, options, correct in met_rows:
            DiagnosticQuestion.objects.update_or_create(
                domain=domains["Meteorology"], competency=competencies[comp_name], prompt=prompt,
                defaults={"subdomain": "Operational", "skill": comp_name, "difficulty": difficulty, "question_type": "MCQ", "options": options, "correct_answers": [correct], "active": True},
            )

        # Subjects and courses.
        analytics_subject, _ = Subject.objects.get_or_create(
            title="Marketing Analytics Fundamentals",
            defaults={"category": "Marketing Analytics", "description": "Campaign measurement, funnels and practical reporting.", "required_competencies": {"Marketing Analytics": 8, "Marketing Fundamentals": 7}},
        )
        paid_subject, _ = Subject.objects.get_or_create(
            title="Paid Advertising Essentials",
            defaults={"category": "Performance Marketing", "description": "Google and Meta paid-media planning and optimization.", "required_competencies": {"Paid Advertising": 8.5, "Copywriting": 7}},
        )
        experiment_subject, _ = Subject.objects.get_or_create(
            title="A/B Testing & Experiment Design",
            defaults={"category": "Experimentation", "description": "Hypotheses, fair experiments and decision-making.", "required_competencies": {"A/B Testing": 7.5, "Conversion Optimization": 7}},
        )
        cro_subject, _ = Subject.objects.get_or_create(
            title="Conversion Optimization Case Lab",
            defaults={"category": "Conversion Optimization", "description": "Case-based funnel diagnosis and conversion decisions.", "required_competencies": {"Conversion Optimization": 7.5, "Marketing Analytics": 7.2}},
        )

        def make_course(code, title, subject, mentor, description, weeks, hours, seats, level, tags, language, rating):
            course, _ = Course.objects.get_or_create(code=code, defaults={"title": title, "subject": subject})
            course.title = title
            course.subject = subject
            course.trainer = mentor
            course.description = description
            course.duration_weeks = weeks
            course.duration_hours = hours
            course.seats = seats
            course.level = level
            course.status = "published"
            course.tags = tags
            course.language = language
            course.rating = rating
            course.save()
            return course

        course1 = make_course("MKT-AN-201", "Marketing Analytics Fundamentals", analytics_subject, trainer, "Build campaign measurement fundamentals using practical KPI, funnel and attribution exercises.", 2, 2.3, 50, "Foundation", ["Analytics", "KPIs", "Funnels"], "Hindi / English", 4.8)
        course2 = make_course("MKT-PA-210", "Paid Advertising Essentials", paid_subject, trainer, "Plan, launch and evaluate paid campaigns across Google and Meta with budget and targeting discipline.", 3, 3.1, 60, "Intermediate", ["Google Ads", "Meta Ads", "Paid Media"], "Hindi / English", 4.9)
        course3 = make_course("MKT-EXP-230", "A/B Testing & Experiment Design", experiment_subject, trainer2, "Design fair marketing experiments, choose success metrics and interpret results without common testing mistakes.", 2, 1.8, 50, "Intermediate", ["Experimentation", "A/B Testing", "CRO"], "English", 4.7)
        course4 = make_course("MKT-CRO-310", "Conversion Optimization Case Lab", cro_subject, trainer3, "Work through landing-page, funnel and campaign cases to improve conversion decisions.", 2, 2.0, 35, "Advanced", ["CRO", "Case Study", "Funnels"], "English / Hindi", 4.8)

        Enrollment.objects.update_or_create(trainee=trainee, course=course1, defaults={"progress": 38, "status": "in_progress"})
        for person in extra_trainees[:5]:
            Enrollment.objects.get_or_create(trainee=person, course=course1, defaults={"progress": 20 + (person.id % 5) * 10, "status": "in_progress"})

        resources = [
            (course1, "Marketing Measurement Foundations", "Video", "Core campaign measurement and KPI selection."),
            (course1, "Funnel KPI Workbook", "PDF", "Worksheet for campaign and funnel diagnosis."),
            (course1, "Campaign Analysis Case", "PPT", "Case exercise connecting source quality to conversion outcomes."),
            (course2, "Google Ads Structure", "Video", "Campaign, ad-group and targeting structure."),
            (course2, "Targeting & Budget Checklist", "Notes", "Pre-launch paid media checklist."),
        ]
        for course, title, kind, description in resources:
            Resource.objects.get_or_create(course=course, title=title, defaults={"uploaded_by": course.trainer, "resource_type": kind, "url": "https://example.org/resource", "description": description})

        checkpoint, _ = Assessment.objects.get_or_create(
            course=course1, title="Marketing Analytics Checkpoint",
            defaults={"deadline": timezone.now() + timedelta(days=9), "pass_mark": 70, "attempts_allowed": 2, "created_by": trainer},
        )
        if not checkpoint.questions.exists():
            Question.objects.create(assessment=checkpoint, prompt="Which metric directly expresses cost per completed conversion?", options=["CTR", "CPM", "CPA", "Reach"], correct_answer=2, competency=competencies["Marketing Analytics"], skill="Efficiency metric", difficulty="Beginner")
            Question.objects.create(assessment=checkpoint, prompt="Traffic increases but conversions stay flat. What should be compared first?", options=["Only impressions", "Conversion rate and traffic quality by source", "Office headcount", "Social followers"], correct_answer=1, competency=competencies["Marketing Analytics"], skill="Funnel diagnosis", difficulty="Intermediate")
            Question.objects.create(assessment=checkpoint, prompt="What makes an A/B test result more trustworthy?", options=["Changing many variables", "Stopping after the first conversion", "Clear hypothesis and enough observations", "Using only top traffic"], correct_answer=2, competency=competencies["A/B Testing"], skill="Experiment validity", difficulty="Intermediate")

        # Competency evidence for the main trainee.
        base_scores = {
            "Marketing Fundamentals": (82, 91, 94, 4),
            "Copywriting": (81, 88, 92, 3),
            "SEO": (76, 83, 88, 3),
            "Paid Advertising": (48, 83, 96, 5),
            "Marketing Analytics": (41, 86, 96, 5),
            "A/B Testing": (46, 79, 91, 3),
            "Conversion Optimization": (52, 75, 89, 3),
            "Customer Understanding": (80, 84, 90, 3),
            "Content Strategy": (84, 86, 90, 4),
        }
        for name, (score, confidence, freshness, evidence_count) in base_scores.items():
            row, _ = UserCompetency.objects.update_or_create(
                user=trainee, competency=competencies[name],
                defaults={"score": score, "confidence": confidence, "freshness": freshness, "source": "baseline assessment", "evidence_count": evidence_count, "last_verified": timezone.now()},
            )
            if not row.evidence.exists():
                CompetencyEvidence.objects.create(user_competency=row, evidence_type="Assessment", label="Baseline diagnostic", score=score, verified=True)

        # Other trainees create a realistic distribution for Capacity Pulse.
        unit_bases = {
            "Digital Outreach & Marketing": {"Marketing Analytics": 54, "Paid Advertising": 61, "Content Strategy": 84},
            "Public Engagement": {"Marketing Analytics": 73, "Paid Advertising": 79, "Content Strategy": 88},
            "Regional Communications": {"Marketing Analytics": 82, "Paid Advertising": 86, "Content Strategy": 81},
            "Training Cell": {"Marketing Analytics": 77, "Paid Advertising": 74, "Content Strategy": 91},
        }
        # Preserve the hero trainee's explicit diagnostic evidence above; populate aggregate distributions for the other learners.
        all_people = extra_trainees
        for person in all_people:
            dept = person.profile.department
            base = unit_bases.get(dept, unit_bases["Digital Outreach & Marketing"])
            for idx, (comp_name, center_score) in enumerate(base.items()):
                jitter = ((person.id * (idx + 3)) % 13) - 6
                score = max(25, min(98, center_score + jitter))
                UserCompetency.objects.update_or_create(
                    user=person, competency=competencies[comp_name],
                    defaults={"score": score, "confidence": 75 + (person.id % 15), "freshness": 90, "source": "assessment", "evidence_count": 2, "last_verified": timezone.now()},
                )

        # Default path for the hero trainee.
        performance_role = role_objects["Performance Marketing Specialist"]
        LearningPath.objects.filter(trainee=trainee, status="active").update(status="superseded")
        path = LearningPath.objects.create(trainee=trainee, target_role=performance_role, current_readiness=56, target_readiness=80, status="active")
        path_items = [
            ("Baseline competency assessment", "assessment", None, None, 24, "completed", "Completed · role alignment generated"),
            ("Marketing Analytics Fundamentals", "course", competencies["Marketing Analytics"], course1, 140, "current", "Targets your highest-priority gap"),
            ("Paid Ads Fundamentals", "course", competencies["Paid Advertising"], course2, 170, "available", "Google + Meta campaign basics"),
            ("A/B Testing Case Lab", "practice", competencies["A/B Testing"], course3, 55, "available", "3 guided experiment scenarios"),
            ("Expert review session", "mentor", competencies["Paid Advertising"], None, 20, "available", "Optional on-demand mentor session"),
            ("Campaign simulation", "practice", competencies["Conversion Optimization"], course4, 45, "locked", "Unlock after core learning"),
            ("Targeted competency reassessment", "reassessment", None, None, 18, "locked", "Verifies whether the gap actually closed"),
        ]
        for order, (title, item_type, comp, course, minutes, state, note) in enumerate(path_items, start=1):
            LearningPathItem.objects.create(learning_path=path, title=title, item_type=item_type, competency=comp, course=course, duration_minutes=minutes, status=state, order=order, note=note)

        # Mentor availability for 20/30-minute booking demo.
        MentorAvailability.objects.filter(trainer__in=[trainer, trainer2, trainer3]).delete()
        base_time = timezone.now().replace(minute=0, second=0, microsecond=0) + timedelta(hours=12)
        for t_index, mentor in enumerate([trainer, trainer2, trainer3]):
            for day in range(0, 5):
                start = base_time + timedelta(days=day, hours=t_index)
                MentorAvailability.objects.create(trainer=mentor, start_at=start, end_at=start + timedelta(hours=2), active=True)

        # One scheduled session for dashboard realism.
        scheduled_at = base_time + timedelta(days=1)
        if not MentorBooking.objects.filter(trainee=trainee, trainer=trainer, status="scheduled").exists():
            MentorBooking.objects.create(
                trainee=trainee, trainer=trainer, start_at=scheduled_at, duration_minutes=20,
                reason="Weak assessment area", note="Need help understanding campaign attribution and choosing the right KPI.",
                competency=competencies["Marketing Analytics"], status="scheduled",
            )

        # Suggested cohorts.
        for name, comp_name, level, language in [
            ("Analytics Foundation A", "Marketing Analytics", "Foundation", "Hindi / English"),
            ("Paid Media Intermediate", "Paid Advertising", "Intermediate", "Hindi / English"),
            ("Experimentation Lab", "A/B Testing", "Intermediate", "English"),
        ]:
            Cohort.objects.get_or_create(name=name, defaults={"competency": competencies[comp_name], "level": level, "language": language, "status": "suggested", "created_by": admin})

        announcements = [
            ("Performance Marketing mentor clinic", "New 20-minute expert slots are open this week for learners working on analytics and paid-media gaps.", "Announcement", "all"),
            ("Capability milestone", "The Digital Outreach team improved verified analytics readiness by 12 points this month.", "Achievement", "all"),
            ("Campaign experiment case pack added", "A new A/B testing case set is available in the Knowledge Hub and trainer library.", "New Content", "trainee"),
            ("Analytics checkpoint closes soon", "Marketing Analytics Checkpoint closes on 24 September at 6:00 PM.", "Deadline", "trainee"),
        ]
        for title, body, kind, audience in announcements:
            Announcement.objects.get_or_create(title=title, defaults={"body": body, "kind": kind, "audience": audience, "published_by": admin})

        knowledge_rows = [
            ("Campaign Measurement Playbook", "A practical guide to campaign KPIs, attribution caveats and funnel diagnostics. Choose metrics that reflect the business outcome, then use diagnostic metrics to explain movement.", course1, "Marketing Analytics", "Official Resource"),
            ("How to choose a primary conversion metric", "Choose a metric that reflects the intended business outcome. Use secondary metrics to diagnose why that outcome moved, and avoid optimizing only for vanity metrics.", course1, "Marketing Analytics", "Expert Answer"),
            ("A/B Testing: Common Decision Traps", "Avoid peeking, changing variants mid-test and interpreting noisy segments as final evidence. Start with a clear hypothesis and pre-defined decision rule.", course3, "A/B Testing", "Training Note"),
            ("Landing Page Conversion Case", "When traffic rises but conversions remain flat, compare source quality, message match, loading performance and form friction before increasing spend.", course4, "Conversion Optimization", "Case"),
        ]
        for title, content, course, comp_name, content_type in knowledge_rows:
            KnowledgeDocument.objects.update_or_create(title=title, defaults={"content": content, "course": course, "source_label": title, "competency": competencies[comp_name], "content_type": content_type, "verified": True})

        # Certificate example for another completed enrollment can be added later; keep main learner pathway in progress.
        completed_enrollment, _ = Enrollment.objects.get_or_create(trainee=extra_trainees[0], course=course3, defaults={"progress": 100, "status": "completed"})
        completed_enrollment.progress = 100
        completed_enrollment.status = "completed"
        completed_enrollment.save()
        Certificate.objects.get_or_create(enrollment=completed_enrollment, defaults={"certificate_id": "CC-2026-00123", "score": 86, "status": "valid"})

        self.stdout.write(self.style.SUCCESS("Capacity Connect SIH26075 demo data seeded."))
        self.stdout.write("Demo logins: trainee@figr.it / trainer@figr.it / admin@figr.it — password: demo123")
