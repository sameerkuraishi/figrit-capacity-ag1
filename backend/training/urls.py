from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health),
    path("auth/login/", views.login_view),
    path("auth/register/", views.register_view),
    path("auth/me/", views.me_view),
    path("domains/", views.domains_view),
    path("announcements/", views.announcements_view),
    path("courses/", views.courses_view),
    path("courses/<int:course_id>/enroll/", views.enroll_view),
    path("courses/<int:course_id>/progress/", views.progress_view),
    path("courses/<int:course_id>/resources/", views.course_resources_view),
    path("courses/<int:course_id>/feedback/", views.feedback_view),
    path("assessments/", views.assessments_view),
    path("assessments/<int:assessment_id>/submit/", views.submit_assessment_view),

    path("diagnostic/start/", views.diagnostic_start_view),
    path("diagnostic/<int:attempt_id>/answer/", views.diagnostic_answer_view),
    path("diagnostic/<int:attempt_id>/result/", views.diagnostic_result_view),
    path("diagnostic/<int:attempt_id>/target-role/", views.diagnostic_target_role_view),
    path("trainee/readiness/", views.readiness_view),
    path("trainee/learning-path/", views.learning_path_view),
    path("trainee/skill-passport/", views.skill_passport_view),
    path("trainee/dashboard/", views.trainee_dashboard_view),

    path("mentors/", views.mentors_view),
    path("mentor-availability/", views.mentor_availability_view),
    path("mentor-bookings/", views.mentor_bookings_view),
    path("mentor-bookings/<int:booking_id>/outcome/", views.mentor_outcome_view),

    path("trainer/dashboard/", views.trainer_dashboard_view),
    path("trainer/sessions/", views.trainer_sessions_view),
    path("trainer/resources/", views.trainer_resource_create_view),
    path("trainer/assessments/", views.trainer_assessment_create_view),

    path("admin/dashboard/", views.admin_dashboard_view),
    path("admin/users/pending/", views.pending_users_view),
    path("admin/users/<int:user_id>/approve/", views.approve_user_view),
    path("admin/announcements/", views.announcement_create_view),
    path("admin/competency-match/", views.competency_match_view),
    path("admin/capacity-pulse/", views.capacity_pulse_view),
    path("admin/coverage-shield/", views.coverage_shield_view),
    path("admin/capacity-bridge/", views.capacity_bridge_view),
    path("admin/cohorts/", views.cohorts_view),
    path("admin/intervention-simulator/", views.intervention_simulator_view),
    path("admin/training-impact/", views.training_impact_view),

    path("knowledge/", views.knowledge_view),
    path("rag/chat/", views.rag_chat_view),
]
