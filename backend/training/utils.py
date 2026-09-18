import json
from functools import wraps
from django.http import JsonResponse
from .models import ApiToken


def parse_json(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return {}


def serialize_profile(profile):
    user = profile.user
    return {
        "id": user.id,
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "role": profile.role,
        "employeeId": profile.employee_id,
        "organization": profile.organization,
        "department": profile.department,
        "designation": profile.designation,
        "qualification": profile.qualification,
        "experienceYears": profile.experience_years,
        "interests": profile.interests,
        "skills": profile.skills,
        "certificates": profile.certificates,
        "approved": profile.approved,
        "domain": profile.domain,
        "preferredLanguage": profile.preferred_language,
        "rating": profile.rating,
    }


def serialize_course(course, user=None):
    enrollment = None
    if user and getattr(user, "is_authenticated", False):
        enrollment = course.enrollments.filter(trainee=user).first()
    return {
        "id": course.id,
        "code": course.code,
        "title": course.title,
        "subject": course.subject.title,
        "description": course.description,
        "trainer": course.trainer.get_full_name() if course.trainer else "Unassigned",
        "durationWeeks": course.duration_weeks,
        "durationHours": course.duration_hours,
        "enrolled": course.enrollments.count(),
        "seats": course.seats,
        "progress": enrollment.progress if enrollment else 0,
        "status": (
            "In Progress"
            if enrollment and enrollment.status != "completed"
            else "Completed"
            if enrollment and enrollment.status == "completed"
            else "Published"
            if course.status == "published"
            else "Draft"
        ),
        "level": course.level,
        "tags": course.tags,
        "language": course.language,
        "rating": course.rating,
        "requiredCompetencies": course.subject.required_competencies,
    }


def token_required(roles=None):
    roles = set(roles or [])

    def decorator(view):
        @wraps(view)
        def wrapper(request, *args, **kwargs):
            header = request.headers.get("Authorization", "")
            token_value = header.replace("Bearer ", "", 1).strip() if header.startswith("Bearer ") else ""
            if not token_value:
                return JsonResponse({"error": "Authentication required"}, status=401)
            token = ApiToken.objects.select_related("user", "user__profile").filter(token=token_value).first()
            if not token:
                return JsonResponse({"error": "Invalid token"}, status=401)
            profile = getattr(token.user, "profile", None)
            if not profile:
                return JsonResponse({"error": "Profile missing"}, status=403)
            if not profile.approved:
                return JsonResponse({"error": "Account is awaiting approval"}, status=403)
            if roles and profile.role not in roles:
                return JsonResponse({"error": "Role not permitted"}, status=403)
            request.api_user = token.user
            request.api_profile = profile
            return view(request, *args, **kwargs)

        return wrapper

    return decorator
