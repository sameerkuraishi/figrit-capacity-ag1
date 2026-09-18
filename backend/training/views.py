from datetime import datetime, timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Avg, Count, Q
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import (
    Announcement,
    ApiToken,
    Assessment,
    Attempt,
    Certificate,
    Cohort,
    Competency,
    CompetencyEvidence,
    Course,
    DiagnosticAttempt,
    DiagnosticQuestion,
    Domain,
    Enrollment,
    Feedback,
    JobRole,
    KnowledgeDocument,
    LearningPath,
    LearningPathItem,
    MentorAvailability,
    MentorBooking,
    MentorSessionOutcome,
    Question,
    Resource,
    RoleCompetencyRequirement,
    Subject,
    TrainerCompetency,
    UserCompetency,
    UserProfile,
)
from .rag import grounded_answer, retrieve
from .utils import parse_json, serialize_course, serialize_profile, token_required


DIFFICULTY_ORDER = ["Beginner", "Intermediate", "Advanced"]
DIFFICULTY_WEIGHT = {"Beginner": 0.85, "Intermediate": 1.0, "Advanced": 1.15}
MAX_DIAGNOSTIC_QUESTIONS = 10


def health(request):
    return JsonResponse({
        "status": "ready",
        "product": "Capacity Connect",
        "identity": "FIGR.IT",
        "problem_statement": "SIH26075",
        "backend": "Django",
        "version": "2.0",
    })


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.objects.filter(email__iexact=email).first()
    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    authenticated = authenticate(username=user.username, password=password)
    if not authenticated:
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    profile = getattr(authenticated, "profile", None)
    if not profile:
        return JsonResponse({"error": "Profile missing"}, status=403)
    if not profile.approved:
        return JsonResponse({"error": "Your account is awaiting administrator approval"}, status=403)
    token = ApiToken.objects.create(user=authenticated)
    return JsonResponse({"token": token.token, "user": serialize_profile(profile)})


@csrf_exempt
def register_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return JsonResponse({"error": "Email and password are required"}, status=400)
    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse({"error": "Email already registered"}, status=409)
    role = data.get("role") if data.get("role") in {"trainee", "trainer"} else "trainee"
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=(data.get("first_name") or data.get("name") or "New").split(" ")[0],
        last_name=" ".join((data.get("name") or "").split(" ")[1:]),
    )
    profile = UserProfile.objects.create(
        user=user,
        role=role,
        employee_id=data.get("employee_id") or f"CC-{user.id:05d}",
        organization=data.get("organization", ""),
        department=data.get("department", ""),
        designation=data.get("designation", ""),
        qualification=data.get("qualification", ""),
        experience_years=max(0, int(data.get("experience_years") or 0)),
        domain=data.get("domain", ""),
        preferred_language=data.get("preferred_language", "English"),
        approved=role == "trainee",
    )
    if not profile.approved:
        return JsonResponse({"registered": True, "pendingApproval": True, "user": serialize_profile(profile)}, status=201)
    token = ApiToken.objects.create(user=user)
    return JsonResponse({"registered": True, "token": token.token, "user": serialize_profile(profile)}, status=201)


@token_required()
def me_view(request):
    return JsonResponse({"user": serialize_profile(request.api_profile)})


def serialize_announcement(item):
    return {
        "id": item.id,
        "kind": item.kind,
        "title": item.title,
        "body": item.body,
        "date": item.published_at.strftime("%d %b"),
    }


@token_required()
def announcements_view(request):
    qs = Announcement.objects.filter(Q(audience="all") | Q(audience=request.api_profile.role)).order_by("-published_at")[:20]
    return JsonResponse({"announcements": [serialize_announcement(a) for a in qs]})


@token_required()
def domains_view(request):
    rows = []
    for domain in Domain.objects.filter(active=True).prefetch_related("job_roles").order_by("name"):
        rows.append({
            "id": domain.id,
            "name": domain.name,
            "description": domain.description,
            "roles": [{"id": role.id, "name": role.name} for role in domain.job_roles.filter(active=True).order_by("name")],
            "questionCount": domain.diagnostic_questions.filter(active=True).count(),
        })
    return JsonResponse({"domains": rows})


@token_required()
def courses_view(request):
    qs = Course.objects.filter(status="published").select_related("subject", "trainer")
    domain = request.GET.get("domain")
    if domain:
        qs = qs.filter(subject__category__icontains=domain)
    return JsonResponse({"courses": [serialize_course(c, request.api_user) for c in qs.order_by("title")]})


@csrf_exempt
@token_required(["trainee"])
def enroll_view(request, course_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    course = Course.objects.filter(id=course_id, status="published").first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    if course.enrollments.count() >= course.seats:
        return JsonResponse({"error": "No seats available"}, status=409)
    enrollment, created = Enrollment.objects.get_or_create(trainee=request.api_user, course=course)
    return JsonResponse({"enrolled": True, "created": created, "course": serialize_course(course, request.api_user)})


@csrf_exempt
@token_required(["trainee"])
def progress_view(request, course_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    enrollment = Enrollment.objects.filter(trainee=request.api_user, course_id=course_id).first()
    if not enrollment:
        return JsonResponse({"error": "Enroll before updating progress"}, status=404)
    progress = max(0, min(100, float(data.get("progress") or 0)))
    enrollment.progress = progress
    enrollment.status = "completed" if progress >= 100 else "in_progress"
    enrollment.save(update_fields=["progress", "status"])
    return JsonResponse({"updated": True, "progress": enrollment.progress, "status": enrollment.status})


@token_required()
def course_resources_view(request, course_id):
    rows = Resource.objects.filter(course_id=course_id).order_by("created_at")
    return JsonResponse({
        "resources": [
            {
                "id": r.id,
                "courseId": r.course_id,
                "title": r.title,
                "type": r.resource_type,
                "url": r.file.url if r.file else r.url,
                "description": r.description,
            }
            for r in rows
        ]
    })


def serialize_assessment(assessment, include_answers=False):
    questions = []
    for q in assessment.questions.all():
        row = {
            "id": q.id,
            "prompt": q.prompt,
            "options": q.options,
            "competency": q.competency.name if q.competency else "General",
            "skill": q.skill,
            "difficulty": q.difficulty,
            "questionType": q.question_type,
        }
        if include_answers:
            row["answer"] = q.correct_answer
        questions.append(row)
    return {
        "id": assessment.id,
        "courseId": assessment.course_id,
        "title": assessment.title,
        "deadline": assessment.deadline.isoformat() if assessment.deadline else None,
        "passMark": assessment.pass_mark,
        "attemptsAllowed": assessment.attempts_allowed,
        "questions": questions,
    }


@token_required()
def assessments_view(request):
    qs = Assessment.objects.select_related("course").prefetch_related("questions", "questions__competency")
    if request.api_profile.role == "trainee":
        enrolled_ids = Enrollment.objects.filter(trainee=request.api_user).values_list("course_id", flat=True)
        qs = qs.filter(course_id__in=enrolled_ids)
    elif request.api_profile.role == "trainer":
        qs = qs.filter(course__trainer=request.api_user)
    return JsonResponse({"assessments": [serialize_assessment(a) for a in qs.order_by("deadline")]})


@csrf_exempt
@token_required(["trainee"])
def submit_assessment_view(request, assessment_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    assessment = Assessment.objects.prefetch_related("questions", "questions__competency").filter(id=assessment_id).first()
    if not assessment:
        return JsonResponse({"error": "Assessment not found"}, status=404)
    prior = Attempt.objects.filter(assessment=assessment, trainee=request.api_user).count()
    if prior >= assessment.attempts_allowed:
        return JsonResponse({"error": "Attempt limit reached"}, status=409)
    data = parse_json(request)
    answers = data.get("answers") or {}
    questions = list(assessment.questions.all())
    if not questions:
        return JsonResponse({"error": "Assessment has no questions"}, status=400)
    correct = 0
    by_comp = {}
    for q in questions:
        supplied = answers.get(str(q.id), answers.get(q.id))
        is_correct = supplied == q.correct_answer
        correct += int(is_correct)
        name = q.competency.name if q.competency else "General"
        bucket = by_comp.setdefault(name, [0, 0])
        bucket[1] += 1
        bucket[0] += int(is_correct)
    score = round((correct / len(questions)) * 100, 1)
    attempt = Attempt.objects.create(assessment=assessment, trainee=request.api_user, answers=answers, score=score)

    # Assessment evidence updates only the competencies actually tested.
    for comp_name, (got, total) in by_comp.items():
        comp = Competency.objects.filter(name=comp_name).first()
        if not comp:
            continue
        evidence_score = round((got / max(1, total)) * 100, 1)
        row, _ = UserCompetency.objects.get_or_create(user=request.api_user, competency=comp)
        row.score = round(row.score * 0.65 + evidence_score * 0.35, 1) if row.evidence_count else evidence_score
        row.confidence = min(98, max(row.confidence, 70) + 5)
        row.freshness = 100
        row.source = "course assessment"
        row.evidence_count += 1
        row.last_verified = timezone.now()
        row.save()
        CompetencyEvidence.objects.create(user_competency=row, evidence_type="Assessment", label=assessment.title, score=evidence_score, verified=True, source_reference=f"attempt:{attempt.id}")

    passed = score >= assessment.pass_mark
    enrollment = Enrollment.objects.filter(trainee=request.api_user, course=assessment.course).first()
    if enrollment and passed:
        enrollment.progress = max(enrollment.progress, 75)
        enrollment.status = "in_progress"
        enrollment.save(update_fields=["progress", "status"])
    return JsonResponse({
        "attempt_id": attempt.id,
        "score": score,
        "passed": passed,
        "competencyBreakdown": {name: round(got / max(1, total) * 100, 1) for name, (got, total) in by_comp.items()},
        "adaptive_action": "unlock_next" if passed else "insert_recovery_module",
    })


@csrf_exempt
@token_required(["trainee"])
def feedback_view(request, course_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    course = Course.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    feedback = Feedback.objects.create(
        course=course,
        trainee=request.api_user,
        rating=max(1, min(5, int(data.get("rating") or 5))),
        trainer_rating=max(1, min(5, int(data.get("trainer_rating") or 5))),
        content_rating=max(1, min(5, int(data.get("content_rating") or 5))),
        comments=data.get("comments", ""),
    )
    return JsonResponse({"created": True, "feedback_id": feedback.id})


# -------------------- Adaptive diagnostic --------------------

def _question_payload(question, answered_count=0):
    return {
        "id": question.id,
        "prompt": question.prompt,
        "options": question.options,
        "competency": question.competency.name,
        "skill": question.skill,
        "difficulty": question.difficulty,
        "questionType": question.question_type,
        "progress": min(100, round(answered_count / MAX_DIAGNOSTIC_QUESTIONS * 100)),
    }


def _state_answers(attempt):
    return (attempt.state or {}).get("answers", [])


def _choose_next_question(attempt):
    answers = _state_answers(attempt)
    asked_ids = {row.get("question_id") for row in answers}
    qs = list(
        DiagnosticQuestion.objects.filter(domain=attempt.domain, active=True)
        .exclude(id__in=asked_ids)
        .select_related("competency")
    )
    if not qs:
        return None

    stats = {}
    for row in answers:
        comp = row.get("competency")
        item = stats.setdefault(comp, {"correct": 0, "total": 0})
        item["total"] += 1
        item["correct"] += int(bool(row.get("correct")))

    # First, ensure broad competency coverage. Then deepen the weakest evidence area.
    all_comp_names = sorted({q.competency.name for q in qs} | set(stats.keys()))
    untested = [name for name in all_comp_names if stats.get(name, {}).get("total", 0) == 0]
    if untested:
        target_comp = untested[0]
        target_difficulty = "Beginner"
    else:
        ranked = sorted(
            stats.items(),
            key=lambda pair: ((pair[1]["correct"] / max(1, pair[1]["total"])), pair[1]["total"]),
        )
        target_comp = ranked[0][0]
        current = stats[target_comp]
        accuracy = current["correct"] / max(1, current["total"])
        target_difficulty = "Advanced" if accuracy >= 0.75 else "Intermediate" if accuracy >= 0.5 else "Beginner"

    preferred = [q for q in qs if q.competency.name == target_comp and q.difficulty == target_difficulty]
    if not preferred:
        preferred = [q for q in qs if q.competency.name == target_comp]
    if not preferred:
        preferred = qs
    preferred.sort(key=lambda q: (DIFFICULTY_ORDER.index(q.difficulty) if q.difficulty in DIFFICULTY_ORDER else 0, q.id))
    return preferred[0]


def _calculate_diagnostic_scores(attempt):
    answers = _state_answers(attempt)
    buckets = {}
    for row in answers:
        name = row["competency"]
        bucket = buckets.setdefault(name, {"earned": 0.0, "possible": 0.0, "count": 0})
        weight = DIFFICULTY_WEIGHT.get(row.get("difficulty"), 1)
        bucket["possible"] += weight
        bucket["earned"] += weight if row.get("correct") else 0
        bucket["count"] += 1

    # Evidence-based scores. A floor avoids pretending one missed question means zero capability.
    scores = {}
    for name, bucket in buckets.items():
        raw = bucket["earned"] / max(0.01, bucket["possible"])
        score = round(20 + raw * 80, 1)
        confidence = min(96, 58 + bucket["count"] * 12)
        scores[name] = {"score": score, "confidence": confidence, "count": bucket["count"]}
    return scores


def _combined_user_scores(user, diagnostic_scores):
    combined = {row.competency.name: row.score for row in UserCompetency.objects.filter(user=user).select_related("competency")}
    for name, data in diagnostic_scores.items():
        combined[name] = data["score"]
    return combined


def _role_alignment(domain, user, diagnostic_scores):
    current = _combined_user_scores(user, diagnostic_scores)
    output = []
    roles = JobRole.objects.filter(domain=domain, active=True).prefetch_related("requirements", "requirements__competency")
    for role in roles:
        requirements = list(role.requirements.all())
        if not requirements:
            continue
        earned = 0.0
        possible = 0.0
        strengths = []
        gaps = []
        contributions = []
        for req in requirements:
            score = float(current.get(req.competency.name, 50))
            ratio = min(1.0, score / max(1, req.required_level))
            weight = max(0.1, req.weight)
            earned += ratio * weight
            possible += weight
            deficit = max(0, req.required_level - score)
            contributions.append((req.competency.name, deficit, score, req.required_level))
        contributions.sort(key=lambda x: x[1])
        strengths = [x[0] for x in contributions if x[1] <= 8][:3]
        gaps = [x[0] for x in sorted(contributions, key=lambda x: x[1], reverse=True) if x[1] > 8][:3]
        fit = round((earned / max(0.01, possible)) * 100)
        output.append({
            "id": role.id,
            "name": role.name,
            "domain": domain.name,
            "score": min(99, fit),
            "reason": f"{', '.join(strengths[:2]) or 'Foundational evidence'} supports this path · {len(gaps)} priority gap{'s' if len(gaps) != 1 else ''}.",
            "strengths": strengths or ["Foundational evidence"],
            "gaps": gaps,
        })
    return sorted(output, key=lambda row: row["score"], reverse=True)


def _finalize_diagnostic(attempt):
    scores = _calculate_diagnostic_scores(attempt)
    for comp_name, data in scores.items():
        comp = Competency.objects.filter(name=comp_name).first()
        if not comp:
            continue
        row, _ = UserCompetency.objects.get_or_create(user=attempt.trainee, competency=comp)
        # Baseline diagnostic is strong evidence but still blended with prior evidence if it exists.
        row.score = round(row.score * 0.25 + data["score"] * 0.75, 1) if row.evidence_count else data["score"]
        row.confidence = data["confidence"]
        row.freshness = 100
        row.source = "adaptive baseline assessment"
        row.evidence_count += 1
        row.last_verified = timezone.now()
        row.save()
        CompetencyEvidence.objects.create(
            user_competency=row,
            evidence_type="Adaptive Assessment",
            label=f"{attempt.domain.name} baseline diagnostic",
            score=data["score"],
            verified=True,
            source_reference=f"diagnostic:{attempt.id}",
        )
    alignment = _role_alignment(attempt.domain, attempt.trainee, scores)
    attempt.competency_scores = scores
    attempt.role_alignment = alignment
    attempt.completed = True
    attempt.completed_at = timezone.now()
    attempt.save(update_fields=["competency_scores", "role_alignment", "completed", "completed_at"])
    return _diagnostic_result_payload(attempt)


def _diagnostic_result_payload(attempt):
    scores = attempt.competency_scores or {}
    scored = sorted([{"name": name, "score": row["score"], "confidence": row.get("confidence", 70)} for name, row in scores.items()], key=lambda r: r["score"], reverse=True)
    overall = round(sum(row["score"] for row in scored) / max(1, len(scored)), 1) if scored else 0
    confidence = round(sum(row["confidence"] for row in scored) / max(1, len(scored)), 1) if scored else 0
    return {
        "attemptId": attempt.id,
        "domain": attempt.domain.name,
        "overallScore": overall,
        "confidence": confidence,
        "strongestAreas": scored[:3],
        "competencyScores": scored,
        "roleAlignment": attempt.role_alignment or [],
    }


@csrf_exempt
@token_required(["trainee"])
def diagnostic_start_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    domain = None
    if data.get("domain_id"):
        domain = Domain.objects.filter(id=data["domain_id"], active=True).first()
    if not domain and data.get("domain"):
        domain = Domain.objects.filter(name__iexact=data["domain"], active=True).first()
    if not domain:
        return JsonResponse({"error": "Choose a valid domain"}, status=400)
    if domain.diagnostic_questions.filter(active=True).count() < 3:
        return JsonResponse({"error": "This domain does not yet have enough diagnostic questions"}, status=400)
    attempt = DiagnosticAttempt.objects.create(trainee=request.api_user, domain=domain, state={"answers": []})
    request.api_profile.domain = domain.name
    request.api_profile.save(update_fields=["domain"])
    question = _choose_next_question(attempt)
    return JsonResponse({"attemptId": attempt.id, "question": _question_payload(question, 0), "maxQuestions": MAX_DIAGNOSTIC_QUESTIONS}, status=201)


@csrf_exempt
@token_required(["trainee"])
def diagnostic_answer_view(request, attempt_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    attempt = DiagnosticAttempt.objects.select_related("domain").filter(id=attempt_id, trainee=request.api_user, completed=False).first()
    if not attempt:
        return JsonResponse({"error": "Active diagnostic attempt not found"}, status=404)
    data = parse_json(request)
    question = DiagnosticQuestion.objects.select_related("competency").filter(id=data.get("question_id"), domain=attempt.domain, active=True).first()
    if not question:
        return JsonResponse({"error": "Question not found"}, status=404)
    answers = _state_answers(attempt)
    if any(row.get("question_id") == question.id for row in answers):
        return JsonResponse({"error": "Question already answered"}, status=409)
    selected = data.get("answer")
    if isinstance(selected, list):
        supplied = sorted(selected)
    else:
        try:
            supplied = [int(selected)]
        except (TypeError, ValueError):
            return JsonResponse({"error": "Answer is required"}, status=400)
    correct = sorted(question.correct_answers or []) == supplied
    answers.append({
        "question_id": question.id,
        "competency": question.competency.name,
        "skill": question.skill,
        "difficulty": question.difficulty,
        "correct": correct,
        "selected": supplied,
    })
    attempt.state = {"answers": answers}
    attempt.save(update_fields=["state"])

    if len(answers) >= MAX_DIAGNOSTIC_QUESTIONS:
        return JsonResponse({"completed": True, "result": _finalize_diagnostic(attempt)})
    next_question = _choose_next_question(attempt)
    if not next_question:
        return JsonResponse({"completed": True, "result": _finalize_diagnostic(attempt)})
    return JsonResponse({
        "completed": False,
        "correct": correct,
        "question": _question_payload(next_question, len(answers)),
        "answered": len(answers),
        "maxQuestions": MAX_DIAGNOSTIC_QUESTIONS,
    })


@token_required(["trainee"])
def diagnostic_result_view(request, attempt_id):
    attempt = DiagnosticAttempt.objects.select_related("domain").filter(id=attempt_id, trainee=request.api_user).first()
    if not attempt:
        return JsonResponse({"error": "Diagnostic attempt not found"}, status=404)
    if not attempt.completed:
        return JsonResponse({"error": "Diagnostic is not complete"}, status=409)
    return JsonResponse({"result": _diagnostic_result_payload(attempt)})


def _gap_status(gap):
    if gap <= 0:
        return "Achieved"
    if gap <= 10:
        return "Low"
    if gap <= 25:
        return "Moderate"
    return "Critical"


def _role_gap_payload(user, role):
    current_map = {row.competency_id: row for row in UserCompetency.objects.filter(user=user).select_related("competency")}
    rows = []
    readiness_weighted = 0.0
    weight_total = 0.0
    for req in role.requirements.select_related("competency").all():
        current_row = current_map.get(req.competency_id)
        current = round(current_row.score, 1) if current_row else 0
        gap = round(max(0, req.required_level - current), 1)
        rows.append({
            "id": req.competency_id,
            "name": req.competency.name,
            "current": current,
            "required": round(req.required_level, 1),
            "gap": gap,
            "status": _gap_status(gap),
            "confidence": round(current_row.confidence, 1) if current_row else 0,
            "freshness": round(current_row.freshness, 1) if current_row else 0,
            "evidenceCount": current_row.evidence_count if current_row else 0,
            "category": req.competency.category,
        })
        readiness_weighted += min(100, current / max(1, req.required_level) * 100) * req.weight
        weight_total += req.weight
    rows.sort(key=lambda row: row["gap"], reverse=True)
    readiness = round(readiness_weighted / max(0.01, weight_total), 1)
    return rows, readiness


def _find_course_for_competency(comp_name):
    for course in Course.objects.filter(status="published").select_related("subject", "trainer"):
        requirements = course.subject.required_competencies or {}
        if comp_name in requirements:
            return course
    return None


def _create_learning_path(user, role, gaps, readiness):
    LearningPath.objects.filter(trainee=user, status="active").update(status="superseded")
    path = LearningPath.objects.create(trainee=user, target_role=role, current_readiness=readiness, target_readiness=80, status="active")
    LearningPathItem.objects.create(learning_path=path, title="Baseline competency assessment", item_type="assessment", duration_minutes=20, status="completed", order=1, note="Completed · competency evidence captured")
    order = 2
    top_gaps = [g for g in gaps if g["gap"] > 0][:3]
    for index, gap in enumerate(top_gaps):
        comp = Competency.objects.filter(id=gap["id"]).first()
        course = _find_course_for_competency(gap["name"])
        LearningPathItem.objects.create(
            learning_path=path,
            title=course.title if course else f"{gap['name']} focused practice",
            item_type="course" if course else "practice",
            competency=comp,
            course=course,
            duration_minutes=round((course.duration_hours or 1.5) * 60) if course else 45,
            status="current" if index == 0 else "available",
            order=order,
            note=f"Targets your {gap['gap']:.0f}-point {gap['name']} gap",
        )
        order += 1
    primary_comp = Competency.objects.filter(id=top_gaps[0]["id"]).first() if top_gaps else None
    LearningPathItem.objects.create(learning_path=path, title="Optional expert mentor session", item_type="mentor", competency=primary_comp, duration_minutes=20, status="available", order=order, note="Book 20 or 30 minutes when human guidance would help")
    order += 1
    LearningPathItem.objects.create(learning_path=path, title="Targeted competency reassessment", item_type="reassessment", duration_minutes=18, status="locked", order=order, note="Verify whether the priority gap actually closed")
    return path


def _serialize_path(path):
    return {
        "id": path.id,
        "targetRole": path.target_role.name if path.target_role else "Development Path",
        "currentReadiness": round(path.current_readiness, 1),
        "targetReadiness": round(path.target_readiness, 1),
        "items": [
            {
                "id": item.id,
                "title": item.title,
                "itemType": item.item_type,
                "competency": item.competency.name if item.competency else "Overall readiness",
                "durationMinutes": item.duration_minutes,
                "status": item.status,
                "note": item.note,
                "courseId": item.course_id,
            }
            for item in path.items.select_related("competency", "course").order_by("order")
        ],
    }


@csrf_exempt
@token_required(["trainee"])
def diagnostic_target_role_view(request, attempt_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    attempt = DiagnosticAttempt.objects.select_related("domain").filter(id=attempt_id, trainee=request.api_user, completed=True).first()
    if not attempt:
        return JsonResponse({"error": "Completed diagnostic not found"}, status=404)
    data = parse_json(request)
    role = JobRole.objects.filter(id=data.get("role_id"), domain=attempt.domain, active=True).first()
    if not role:
        return JsonResponse({"error": "Target role not found"}, status=404)
    attempt.target_role = role
    attempt.save(update_fields=["target_role"])
    gaps, readiness = _role_gap_payload(request.api_user, role)
    path = _create_learning_path(request.api_user, role, gaps, readiness)
    return JsonResponse({"selected": True, "role": {"id": role.id, "name": role.name}, "readiness": readiness, "gaps": gaps, "learningPath": _serialize_path(path)})


@token_required(["trainee"])
def readiness_view(request):
    path = LearningPath.objects.filter(trainee=request.api_user, status="active").select_related("target_role").order_by("-created_at").first()
    role = path.target_role if path and path.target_role else JobRole.objects.filter(domain__name=request.api_profile.domain).first()
    if not role:
        return JsonResponse({"targetRole": None, "readiness": 0, "gaps": []})
    gaps, readiness = _role_gap_payload(request.api_user, role)
    if path and abs(path.current_readiness - readiness) > 0.1:
        path.current_readiness = readiness
        path.save(update_fields=["current_readiness", "updated_at"])
    return JsonResponse({"targetRole": {"id": role.id, "name": role.name}, "readiness": readiness, "gaps": gaps})


@token_required(["trainee"])
def learning_path_view(request):
    path = LearningPath.objects.filter(trainee=request.api_user, status="active").select_related("target_role").order_by("-created_at").first()
    if not path:
        return JsonResponse({"learningPath": None})
    return JsonResponse({"learningPath": _serialize_path(path)})


@token_required(["trainee"])
def skill_passport_view(request):
    rows = []
    for score in UserCompetency.objects.filter(user=request.api_user).select_related("competency").order_by("-score"):
        evidence = [
            {
                "type": e.evidence_type,
                "label": e.label,
                "score": e.score,
                "verified": e.verified,
                "date": e.created_at.strftime("%d %b %Y"),
            }
            for e in score.evidence.order_by("-created_at")[:8]
        ]
        rows.append({
            "id": score.id,
            "name": score.competency.name,
            "category": score.competency.category,
            "level": round(score.score, 1),
            "confidence": round(score.confidence, 1),
            "freshness": round(score.freshness, 1),
            "verified": score.confidence >= 75 and score.evidence_count >= 2,
            "evidenceCount": score.evidence_count,
            "lastVerified": score.last_verified.strftime("%d %b %Y") if score.last_verified else None,
            "evidence": evidence,
        })
    overall = round(sum(row["level"] for row in rows) / max(1, len(rows)), 1) if rows else 0
    return JsonResponse({"overallReadiness": overall, "competencies": rows})


# -------------------- Mentor marketplace & booking --------------------

def _qualification_score(text):
    value = (text or "").lower()
    if "ph.d" in value or "phd" in value:
        return 15
    if "mba" in value or "m.tech" in value or "mtech" in value or "m.sc" in value or "msc" in value:
        return 13
    if "b.tech" in value or "btech" in value or "b.sc" in value or "bsc" in value:
        return 10
    return 7


def _trainer_match_for_competency(profile, competency=None):
    comp_rows = TrainerCompetency.objects.filter(trainer=profile.user).select_related("competency")
    skills = {row.competency.name: row.level for row in comp_rows}
    if competency:
        level = skills.get(competency.name, 0)
        skill_score = min(45, round(level / 10 * 45, 1))
        domain_score = 25 if competency.name.lower() in (profile.domain or "").lower() else 21
    else:
        best = max(skills.values(), default=0)
        skill_score = min(45, round(best / 10 * 45, 1))
        domain_score = 22
    exp_score = min(15, round(profile.experience_years / 10 * 15, 1))
    qual_score = _qualification_score(profile.qualification)
    rating_score = min(10, round(profile.rating / 5 * 10, 1))
    match = min(99, round(skill_score + domain_score + exp_score + qual_score + rating_score))
    top = sorted(skills.items(), key=lambda x: x[1], reverse=True)[:4]
    return {
        "id": profile.user_id,
        "name": profile.user.get_full_name() or profile.user.username,
        "qualification": profile.qualification,
        "experienceYears": profile.experience_years,
        "rating": profile.rating,
        "match": match,
        "domain": profile.domain or profile.department,
        "languages": [x.strip() for x in (profile.preferred_language or "English").replace("/", ",").split(",") if x.strip()],
        "strengths": [f"{name} {round(level * 10):.0f}%" for name, level in top],
        "breakdown": {"skills": skill_score, "domain": domain_score, "experience": exp_score, "qualification": qual_score + rating_score},
    }


@token_required(["trainee", "admin"])
def mentors_view(request):
    comp = None
    competency_name = request.GET.get("competency")
    if competency_name:
        comp = Competency.objects.filter(name__iexact=competency_name).first()
    profiles = UserProfile.objects.select_related("user").filter(role="trainer", approved=True)
    output = [_trainer_match_for_competency(profile, comp) for profile in profiles]
    output.sort(key=lambda row: row["match"], reverse=True)
    return JsonResponse({"mentors": output})


def _overlaps(start_a, end_a, start_b, end_b):
    return start_a < end_b and start_b < end_a


@token_required(["trainee", "trainer"])
def mentor_availability_view(request):
    try:
        trainer_id = int(request.GET.get("trainer_id") or 0)
        duration = int(request.GET.get("duration") or 20)
    except ValueError:
        return JsonResponse({"error": "Invalid trainer or duration"}, status=400)
    if duration not in {20, 30}:
        return JsonResponse({"error": "Duration must be 20 or 30 minutes"}, status=400)
    trainer = User.objects.filter(id=trainer_id, profile__role="trainer", profile__approved=True).first()
    if not trainer:
        return JsonResponse({"error": "Mentor not found"}, status=404)
    now = timezone.now()
    slots = []
    availability = MentorAvailability.objects.filter(trainer=trainer, active=True, end_at__gt=now).order_by("start_at")[:20]
    existing = list(MentorBooking.objects.filter(trainer=trainer, status="scheduled", start_at__gte=now))
    step = timedelta(minutes=10)
    slot_delta = timedelta(minutes=duration)
    for window in availability:
        cursor = max(window.start_at, now)
        # Round up to next 10-minute boundary for tidy UI.
        minute_mod = cursor.minute % 10
        if minute_mod:
            cursor += timedelta(minutes=10 - minute_mod)
        cursor = cursor.replace(second=0, microsecond=0)
        while cursor + slot_delta <= window.end_at:
            end = cursor + slot_delta
            blocked = any(_overlaps(cursor, end, booking.start_at, booking.end_at) for booking in existing)
            if not blocked:
                slots.append({"startAt": cursor.isoformat(), "endAt": end.isoformat(), "durationMinutes": duration})
            cursor += step
            if len(slots) >= 30:
                break
        if len(slots) >= 30:
            break
    return JsonResponse({"trainerId": trainer.id, "durationMinutes": duration, "slots": slots})


@csrf_exempt
@token_required(["trainee"])
def mentor_bookings_view(request):
    if request.method == "GET":
        rows = MentorBooking.objects.filter(trainee=request.api_user).select_related("trainer", "competency").order_by("-start_at")
        return JsonResponse({"bookings": [_serialize_booking(row) for row in rows]})
    if request.method != "POST":
        return JsonResponse({"error": "GET or POST required"}, status=405)
    data = parse_json(request)
    try:
        trainer_id = int(data.get("trainer_id"))
        duration = int(data.get("duration_minutes"))
        start_at = datetime.fromisoformat(data.get("start_at"))
        if timezone.is_naive(start_at):
            start_at = timezone.make_aware(start_at)
    except Exception:
        return JsonResponse({"error": "Valid trainer_id, start_at and duration_minutes are required"}, status=400)
    if duration not in {20, 30}:
        return JsonResponse({"error": "Session duration must be 20 or 30 minutes"}, status=400)
    if start_at <= timezone.now():
        return JsonResponse({"error": "Past slots cannot be booked"}, status=400)
    trainer = User.objects.filter(id=trainer_id, profile__role="trainer", profile__approved=True).first()
    if not trainer:
        return JsonResponse({"error": "Mentor not found"}, status=404)
    end_at = start_at + timedelta(minutes=duration)
    competency = Competency.objects.filter(name=data.get("competency")).first() if data.get("competency") else None
    with transaction.atomic():
        windows = list(MentorAvailability.objects.select_for_update().filter(trainer=trainer, active=True, start_at__lte=start_at, end_at__gte=end_at))
        if not windows:
            return JsonResponse({"error": "Selected time is outside the mentor's availability"}, status=409)
        conflicts = MentorBooking.objects.select_for_update().filter(trainer=trainer, status="scheduled", start_at__lt=end_at)
        if any(existing.end_at > start_at for existing in conflicts):
            return JsonResponse({"error": "That slot was just booked. Please choose another time."}, status=409)
        booking = MentorBooking.objects.create(
            trainee=request.api_user,
            trainer=trainer,
            start_at=start_at,
            duration_minutes=duration,
            reason=data.get("reason") or "Learning path guidance",
            note=data.get("note", ""),
            competency=competency,
            status="scheduled",
        )
    return JsonResponse({"created": True, "booking": _serialize_booking(booking)}, status=201)


def _serialize_booking(row):
    try:
        outcome = row.outcome
    except MentorSessionOutcome.DoesNotExist:
        outcome = None
    return {
        "id": row.id,
        "trainerId": row.trainer_id,
        "trainerName": row.trainer.get_full_name() or row.trainer.username,
        "traineeId": row.trainee_id,
        "traineeName": row.trainee.get_full_name() or row.trainee.username,
        "startAt": row.start_at.isoformat(),
        "durationMinutes": row.duration_minutes,
        "reason": row.reason,
        "note": row.note,
        "competency": row.competency.name if row.competency else None,
        "status": row.status,
        "outcome": {
            "topicDiscussed": outcome.topic_discussed,
            "problemIdentified": outcome.problem_identified,
            "notes": outcome.notes,
            "recommendedAction": outcome.recommended_action,
            "recommendedPractice": outcome.recommended_practice,
            "followUpDate": outcome.follow_up_date.isoformat() if outcome.follow_up_date else None,
        } if outcome else None,
    }


@token_required(["trainer"])
def trainer_sessions_view(request):
    rows = MentorBooking.objects.filter(trainer=request.api_user).select_related("trainee", "competency").order_by("start_at")
    return JsonResponse({"sessions": [_serialize_booking(row) for row in rows]})


@csrf_exempt
@token_required(["trainer"])
def mentor_outcome_view(request, booking_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    booking = MentorBooking.objects.select_related("trainee").filter(id=booking_id, trainer=request.api_user).first()
    if not booking:
        return JsonResponse({"error": "Session not found"}, status=404)
    data = parse_json(request)
    course = Course.objects.filter(id=data.get("recommended_course_id")).first() if data.get("recommended_course_id") else None
    outcome, _ = MentorSessionOutcome.objects.update_or_create(
        booking=booking,
        defaults={
            "topic_discussed": data.get("topic_discussed", ""),
            "problem_identified": data.get("problem_identified", ""),
            "notes": data.get("notes", ""),
            "recommended_action": data.get("recommended_action", ""),
            "recommended_course": course,
            "recommended_practice": data.get("recommended_practice", ""),
            "follow_up_date": data.get("follow_up_date") or None,
        },
    )
    booking.status = "completed"
    booking.save(update_fields=["status"])
    # Add mentor outcome to evidence timeline without pretending it is a scored verification.
    if booking.competency:
        row, _ = UserCompetency.objects.get_or_create(user=booking.trainee, competency=booking.competency)
        row.evidence_count += 1
        row.save(update_fields=["evidence_count"])
        CompetencyEvidence.objects.create(user_competency=row, evidence_type="Mentor Session", label=data.get("topic_discussed") or "Expert mentor session", verified=True, source_reference=f"mentor:{booking.id}")
    return JsonResponse({"saved": True, "booking": _serialize_booking(booking)})


# -------------------- Trainee / trainer dashboards --------------------

@token_required(["trainee"])
def trainee_dashboard_view(request):
    enrollments = Enrollment.objects.filter(trainee=request.api_user).select_related("course", "course__subject", "course__trainer")
    avg_progress = enrollments.aggregate(v=Avg("progress"))["v"] or 0
    attempts = Attempt.objects.filter(trainee=request.api_user)
    certs = Certificate.objects.filter(enrollment__trainee=request.api_user).count()
    path = LearningPath.objects.filter(trainee=request.api_user, status="active").select_related("target_role").first()
    readiness = path.current_readiness if path else 0
    next_item = path.items.filter(status="current").order_by("order").first() if path else None
    booking = MentorBooking.objects.filter(trainee=request.api_user, status="scheduled", start_at__gt=timezone.now()).select_related("trainer").order_by("start_at").first()
    return JsonResponse({
        "profile": serialize_profile(request.api_profile),
        "metrics": {
            "readiness": round(readiness),
            "learning_progress": round(avg_progress),
            "active_courses": enrollments.exclude(status="completed").count(),
            "assessments_attempted": attempts.count(),
            "certificates": certs,
            "verified_skills": UserCompetency.objects.filter(user=request.api_user, confidence__gte=75, evidence_count__gte=2).count(),
        },
        "nextAction": {"title": next_item.title, "note": next_item.note, "type": next_item.item_type} if next_item else None,
        "upcomingMentor": _serialize_booking(booking) if booking else None,
        "courses": [serialize_course(e.course, request.api_user) for e in enrollments],
    })


@csrf_exempt
@token_required(["trainer"])
def trainer_resource_create_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = request.POST if request.POST else parse_json(request)
    course = Course.objects.filter(id=data.get("course_id"), trainer=request.api_user).first()
    if not course:
        return JsonResponse({"error": "Trainer does not own this course"}, status=403)
    resource = Resource.objects.create(
        course=course,
        uploaded_by=request.api_user,
        title=data.get("title", "Untitled resource"),
        resource_type=data.get("resource_type", "PDF"),
        url=data.get("url", ""),
        file=request.FILES.get("file") if hasattr(request, "FILES") else None,
        description=data.get("description", ""),
    )
    return JsonResponse({"created": True, "resource_id": resource.id}, status=201)


@csrf_exempt
@token_required(["trainer"])
def trainer_assessment_create_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    course = Course.objects.filter(id=data.get("course_id"), trainer=request.api_user).first()
    if not course:
        return JsonResponse({"error": "Trainer does not own this course"}, status=403)
    assessment = Assessment.objects.create(
        course=course,
        title=data.get("title", "New Assessment"),
        deadline=data.get("deadline") or None,
        pass_mark=int(data.get("pass_mark") or 60),
        attempts_allowed=int(data.get("attempts_allowed") or 2),
        created_by=request.api_user,
    )
    for row in data.get("questions") or []:
        competency = Competency.objects.filter(name=row.get("competency")).first()
        Question.objects.create(
            assessment=assessment,
            prompt=row.get("prompt", "Question"),
            options=row.get("options") or [],
            correct_answer=int(row.get("answer") or 0),
            competency=competency,
            skill=row.get("skill", ""),
            difficulty=row.get("difficulty", "Intermediate"),
            question_type=row.get("question_type", "MCQ"),
        )
    return JsonResponse({"created": True, "assessment": serialize_assessment(assessment, include_answers=True)}, status=201)


@token_required(["trainer"])
def trainer_dashboard_view(request):
    courses = Course.objects.filter(trainer=request.api_user)
    enrollments = Enrollment.objects.filter(course__in=courses)
    attempts = Attempt.objects.filter(assessment__course__in=courses)
    avg_score = attempts.aggregate(v=Avg("score"))["v"] or 0
    sessions = MentorBooking.objects.filter(trainer=request.api_user)
    upcoming = sessions.filter(status="scheduled", start_at__gte=timezone.now()).count()
    return JsonResponse({
        "profile": serialize_profile(request.api_profile),
        "metrics": {
            "active_courses": courses.filter(status="published").count(),
            "active_trainees": enrollments.values("trainee_id").distinct().count(),
            "assessments": Assessment.objects.filter(course__in=courses).count(),
            "average_score": round(avg_score, 1),
            "mentor_sessions": sessions.count(),
            "upcoming_sessions": upcoming,
        },
        "attention": [
            {"name": a.trainee.get_full_name() or a.trainee.username, "assessment": a.assessment.title, "score": a.score}
            for a in attempts.filter(score__lt=70).select_related("trainee", "assessment")[:10]
        ],
    })


# -------------------- Admin intelligence --------------------

def compute_trainer_match(subject, trainer_profile):
    requirements = subject.required_competencies or {}
    comp_rows = TrainerCompetency.objects.filter(trainer=trainer_profile.user).select_related("competency")
    levels = {row.competency.name: row.level for row in comp_rows}
    if requirements:
        weighted = []
        for name, required in requirements.items():
            required = float(required or 1)
            weighted.append(min(1.0, float(levels.get(name, 0)) / required))
        skill_score = round((sum(weighted) / len(weighted)) * 40, 1)
    else:
        skill_score = 0
    subject_words = set(subject.category.lower().split()) | set(subject.title.lower().split())
    trainer_words = set((trainer_profile.domain or "").lower().split()) | set((trainer_profile.department or "").lower().split())
    overlap = len(subject_words & trainer_words)
    domain_score = 30 if overlap >= 2 else 24 if overlap == 1 else 16
    exp_score = round(min(15, trainer_profile.experience_years / 10 * 15), 1)
    qual_score = _qualification_score(trainer_profile.qualification)
    total = round(skill_score + domain_score + exp_score + qual_score)
    rationale = []
    top = sorted(requirements.items(), key=lambda x: x[1], reverse=True)[:3]
    for name, required in top:
        level = levels.get(name, 0)
        rationale.append(f"{name}: {level:g}/10 vs required {required}/10")
    rationale.append(f"{trainer_profile.experience_years} years domain/training experience")
    return {
        "id": trainer_profile.user_id,
        "name": trainer_profile.user.get_full_name() or trainer_profile.user.username,
        "qualification": trainer_profile.qualification,
        "experienceYears": trainer_profile.experience_years,
        "rating": trainer_profile.rating,
        "match": min(99, total),
        "domain": trainer_profile.domain or trainer_profile.department,
        "strengths": rationale,
        "breakdown": {"skills": skill_score, "domain": domain_score, "experience": exp_score, "qualification": qual_score},
    }


@token_required(["admin"])
def admin_dashboard_view(request):
    learner_scores = UserCompetency.objects.filter(user__profile__role="trainee")
    overall_readiness = learner_scores.aggregate(v=Avg("score"))["v"] or 0
    critical = learner_scores.filter(score__lt=55).count()
    return JsonResponse({
        "metrics": {
            "users": User.objects.count(),
            "trainees": UserProfile.objects.filter(role="trainee", approved=True).count(),
            "trainers": UserProfile.objects.filter(role="trainer", approved=True).count(),
            "courses": Course.objects.filter(status="published").count(),
            "enrollments": Enrollment.objects.count(),
            "certificates": Certificate.objects.count(),
            "assessments": Assessment.objects.count(),
            "organization_readiness": round(overall_readiness, 1),
            "critical_gaps": critical,
            "mentor_sessions": MentorBooking.objects.count(),
        }
    })


@token_required(["admin"])
def pending_users_view(request):
    rows = UserProfile.objects.select_related("user").filter(approved=False).order_by("user__date_joined")
    return JsonResponse({"users": [serialize_profile(p) for p in rows]})


@csrf_exempt
@token_required(["admin"])
def approve_user_view(request, user_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    profile = UserProfile.objects.filter(user_id=user_id).first()
    if not profile:
        return JsonResponse({"error": "User not found"}, status=404)
    profile.approved = True
    profile.save(update_fields=["approved"])
    return JsonResponse({"approved": True, "user": serialize_profile(profile)})


@csrf_exempt
@token_required(["admin"])
def announcement_create_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    item = Announcement.objects.create(
        title=data.get("title", "Announcement"),
        body=data.get("body", ""),
        kind=data.get("kind", "Announcement"),
        audience=data.get("audience", "all"),
        published_by=request.api_user,
    )
    return JsonResponse({"created": True, "announcement": serialize_announcement(item)}, status=201)


@token_required(["admin"])
def competency_match_view(request):
    subject_id = request.GET.get("subject_id")
    subject = Subject.objects.filter(id=subject_id).first() if subject_id else Subject.objects.first()
    if not subject:
        return JsonResponse({"error": "No subject available"}, status=404)
    trainers = UserProfile.objects.select_related("user").filter(role="trainer", approved=True)
    matches = [compute_trainer_match(subject, profile) for profile in trainers]
    matches.sort(key=lambda row: row["match"], reverse=True)
    return JsonResponse({"subject": {"id": subject.id, "title": subject.title, "requirements": subject.required_competencies}, "matches": matches})


def _required_for_capacity(comp_name):
    configured = RoleCompetencyRequirement.objects.filter(competency__name=comp_name).aggregate(v=Avg("required_level"))["v"]
    if configured:
        return round(configured)
    return {"Marketing Analytics": 80, "Paid Advertising": 82, "Content Strategy": 78}.get(comp_name, 75)


@token_required(["admin"])
def capacity_pulse_view(request):
    competencies = ["Marketing Analytics", "Paid Advertising", "Content Strategy"]
    departments = list(UserProfile.objects.filter(role="trainee", approved=True).exclude(department="").values_list("department", flat=True).distinct())
    cells = []
    for department in departments:
        trainee_ids = UserProfile.objects.filter(role="trainee", approved=True, department=department).values_list("user_id", flat=True)
        for comp_name in competencies:
            comp = Competency.objects.filter(name=comp_name).first()
            if not comp:
                continue
            rows = UserCompetency.objects.filter(user_id__in=trainee_ids, competency=comp)
            readiness = rows.aggregate(v=Avg("score"))["v"] or 0
            required = _required_for_capacity(comp_name)
            qualified = rows.filter(score__gte=required).count()
            total = rows.count()
            trainer_count = TrainerCompetency.objects.filter(competency=comp, trainer__profile__approved=True, level__gte=8).count()
            backup_count = TrainerCompetency.objects.filter(competency=comp, trainer__profile__approved=True, level__gte=8.5).count()
            gap = required - readiness
            risk = "critical" if gap >= 20 or backup_count == 0 else "attention" if gap > 0 else "healthy"
            cells.append({
                "unit": department,
                "competency": comp_name,
                "readiness": round(readiness, 1),
                "required": required,
                "qualified": qualified,
                "total": total,
                "trainers": trainer_count,
                "backups": max(0, backup_count - 1),
                "risk": risk,
            })
    return JsonResponse({"cells": cells})


@token_required(["admin"])
def coverage_shield_view(request):
    comp_name = request.GET.get("competency") or "Marketing Analytics"
    comp = Competency.objects.filter(name=comp_name).first()
    if not comp:
        return JsonResponse({"error": "Competency not found"}, status=404)
    trainers = TrainerCompetency.objects.filter(competency=comp, trainer__profile__approved=True).select_related("trainer", "trainer__profile").order_by("-level")
    experts = [row for row in trainers if row.level >= 8.5]
    intermediate = [row for row in trainers if 6.5 <= row.level < 8.5]
    learner_scores = UserCompetency.objects.filter(competency=comp, user__profile__role="trainee")
    candidates = learner_scores.filter(score__gte=60).select_related("user").order_by("-score")[:5]
    backup_count = max(0, len(experts) - 1)
    risk = "Critical" if len(experts) <= 1 else "Attention" if backup_count <= 1 else "Healthy"
    return JsonResponse({
        "competency": comp_name,
        "experts": len(experts),
        "intermediate": len(intermediate),
        "trainees": learner_scores.count(),
        "backupExperts": backup_count,
        "risk": risk,
        "message": "Capability depends heavily on too few verified experts." if risk != "Healthy" else "Expert coverage is currently healthy.",
        "potentialSuccessors": [
            {"id": row.user_id, "name": row.user.get_full_name() or row.user.username, "readiness": round(row.score, 1)}
            for row in candidates
        ],
    })


@token_required(["admin"])
def capacity_bridge_view(request):
    comp_name = request.GET.get("competency") or "Marketing Analytics"
    comp = Competency.objects.filter(name=comp_name).first()
    if not comp:
        return JsonResponse({"error": "Competency not found"}, status=404)
    # Determine lowest-readiness unit directly.
    units = []
    for department in UserProfile.objects.filter(role="trainee", approved=True).exclude(department="").values_list("department", flat=True).distinct():
        scores = UserCompetency.objects.filter(user__profile__department=department, user__profile__role="trainee", competency=comp)
        avg = scores.aggregate(v=Avg("score"))["v"] or 0
        units.append((avg, department))
    units.sort()
    deficit_unit = units[0][1] if units else "Priority Unit"
    profiles = UserProfile.objects.select_related("user").filter(role="trainer", approved=True)
    mentors = [_trainer_match_for_competency(profile, comp) for profile in profiles]
    mentors.sort(key=lambda row: row["match"], reverse=True)
    return JsonResponse({
        "competency": comp_name,
        "deficitUnit": deficit_unit,
        "required": _required_for_capacity(comp_name),
        "recommendedExperts": mentors[:3],
        "actions": ["Create cross-department session", "Create learning cohort", "Book expert clinic"],
    })


@token_required(["admin"])
def cohorts_view(request):
    rows = Cohort.objects.select_related("competency").order_by("id")
    learner_counts = {"Marketing Analytics": 8, "Paid Advertising": 6, "A/B Testing": 4}
    ranges = {"Marketing Analytics": "34–52%", "Paid Advertising": "48–64%", "A/B Testing": "45–59%"}
    return JsonResponse({
        "cohorts": [
            {
                "id": row.id,
                "name": row.name,
                "level": row.level,
                "learners": row.members.count() or learner_counts.get(row.competency.name if row.competency else "", 5),
                "competency": row.competency.name if row.competency else "General",
                "language": row.language,
                "readinessRange": ranges.get(row.competency.name if row.competency else "", "40–60%"),
                "status": row.status,
            }
            for row in rows
        ]
    })


@csrf_exempt
@token_required(["admin"])
def intervention_simulator_view(request):
    data = parse_json(request) if request.method == "POST" else {}
    current = float(data.get("current_readiness") or 54)
    options = [
        {"id": "A", "title": "Train all 18 learners", "people": 18, "hours": 108, "current": round(current), "projected": min(100, round(current + 25)), "description": "Full pathway for every learner currently below the competency requirement."},
        {"id": "B", "title": "Focus top 8 candidates", "people": 8, "hours": 48, "current": round(current), "projected": min(100, round(current + 17)), "description": "Build a smaller group of high-readiness internal capability champions first."},
        {"id": "C", "title": "Expert clinic + micro-course + reassessment", "people": 14, "hours": 31, "current": round(current), "projected": min(100, round(current + 21)), "description": "Target the exact gap with a short blended intervention."},
    ]
    return JsonResponse({"label": "Estimated / simulated impact", "guaranteed": False, "options": options})


@token_required(["admin"])
def training_impact_view(request):
    # Hackathon demo analytics: observed learner evidence where available, otherwise clearly labelled sample aggregates.
    return JsonResponse({
        "label": "Observed demo evidence",
        "series": [
            {"period": "Baseline", "readiness": 54},
            {"period": "After course", "readiness": 63},
            {"period": "After mentor", "readiness": 69},
            {"period": "After reassessment", "readiness": 75},
        ],
        "metrics": {
            "gap_reduction": 21,
            "completion_rate": 84,
            "mentor_assisted_sessions": MentorBooking.objects.count(),
            "verified_competencies": UserCompetency.objects.filter(confidence__gte=75, evidence_count__gte=2).count(),
        },
    })


# -------------------- Knowledge & RAG --------------------

@token_required()
def knowledge_view(request):
    qs = KnowledgeDocument.objects.select_related("competency", "course").filter(verified=True)
    query = (request.GET.get("q") or "").strip()
    competency = (request.GET.get("competency") or "").strip()
    if query:
        qs = qs.filter(Q(title__icontains=query) | Q(content__icontains=query) | Q(source_label__icontains=query))
    if competency:
        qs = qs.filter(competency__name__iexact=competency)
    return JsonResponse({
        "items": [
            {
                "id": doc.id,
                "title": doc.title,
                "type": doc.content_type,
                "competency": doc.competency.name if doc.competency else "General",
                "author": doc.source_label,
                "verified": doc.verified,
                "excerpt": doc.content[:220],
            }
            for doc in qs.order_by("-created_at")[:50]
        ]
    })


@csrf_exempt
@token_required()
def rag_chat_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    data = parse_json(request)
    question = (data.get("question") or "").strip()
    if not question:
        return JsonResponse({"error": "Question is required"}, status=400)
    course_id = data.get("course_id")
    passages = retrieve(question, course_id=course_id, limit=3)
    answer, used_llm = grounded_answer(question, passages)
    confidence = round(min(98, max([p.get("score", 0) for p in passages], default=0) * 100 + 35)) if passages else 0
    low_confidence = confidence < 50
    return JsonResponse({
        "answer": answer if not low_confidence else "I don’t have enough verified information to answer this reliably. Please ask an expert or open a verified source.",
        "sources": [{"title": p["title"], "source": p["source"], "score": p["score"]} for p in passages],
        "used_llm": used_llm,
        "confidence": confidence,
        "lowConfidence": low_confidence,
    })
