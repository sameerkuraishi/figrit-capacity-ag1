import json
from datetime import timedelta

from django.core.management import call_command
from django.test import Client, TestCase
from django.utils import timezone

from .models import Competency, JobRole, MentorAvailability, MentorBooking, UserProfile


class CapacityConnectApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_demo", verbosity=0)

    def setUp(self):
        self.client = Client()

    def login(self, email):
        response = self.client.post(
            "/api/auth/login/",
            data=json.dumps({"email": email, "password": "demo123"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200, response.content)
        return response.json()["token"]

    def auth(self, token):
        return {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    def test_trainee_cannot_access_admin_capacity_pulse(self):
        token = self.login("trainee@figr.it")
        response = self.client.get("/api/admin/capacity-pulse/", **self.auth(token))
        self.assertEqual(response.status_code, 403)

    def test_adaptive_diagnostic_generates_role_alignment_and_gap_path(self):
        token = self.login("trainee@figr.it")
        start = self.client.post(
            "/api/diagnostic/start/",
            data=json.dumps({"domain": "Marketing"}),
            content_type="application/json",
            **self.auth(token),
        )
        self.assertEqual(start.status_code, 201, start.content)
        payload = start.json()
        attempt_id = payload["attemptId"]
        question = payload["question"]
        result = None

        for _ in range(12):
            answer = question.get("correctAnswer")
            # API intentionally does not expose correct answer to clients.
            # Use first option so the test validates the flow rather than score quality.
            selected = 0 if answer is None else answer
            response = self.client.post(
                f"/api/diagnostic/{attempt_id}/answer/",
                data=json.dumps({"question_id": question["id"], "answer": selected}),
                content_type="application/json",
                **self.auth(token),
            )
            self.assertEqual(response.status_code, 200, response.content)
            body = response.json()
            if body.get("completed"):
                result = body["result"]
                break
            question = body["question"]

        self.assertIsNotNone(result)
        self.assertTrue(result["roleAlignment"])
        self.assertTrue(result["competencyScores"])

        role_id = result["roleAlignment"][0]["id"]
        choose = self.client.post(
            f"/api/diagnostic/{attempt_id}/target-role/",
            data=json.dumps({"role_id": role_id}),
            content_type="application/json",
            **self.auth(token),
        )
        self.assertEqual(choose.status_code, 200, choose.content)
        selected = choose.json()
        self.assertIn("gaps", selected)
        self.assertIn("learningPath", selected)
        self.assertGreater(len(selected["learningPath"]["items"]), 2)

    def test_mentor_booking_rejects_overlap(self):
        token = self.login("trainee@figr.it")
        trainer = UserProfile.objects.get(user__email="trainer@figr.it").user
        competency = Competency.objects.get(name="Marketing Analytics")
        window = MentorAvailability.objects.filter(trainer=trainer, active=True).order_by("start_at").first()
        self.assertIsNotNone(window)

        # Pick a free point near the end of the first window; seed data's demo booking is next day.
        start_at = window.start_at + timedelta(minutes=20)
        if start_at <= timezone.now():
            start_at = timezone.now() + timedelta(hours=1)
            MentorAvailability.objects.create(
                trainer=trainer,
                start_at=start_at,
                end_at=start_at + timedelta(hours=2),
                active=True,
            )

        payload = {
            "trainer_id": trainer.id,
            "duration_minutes": 20,
            "start_at": start_at.isoformat(),
            "reason": "Weak assessment area",
            "competency": competency.name,
        }
        first = self.client.post(
            "/api/mentor-bookings/",
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth(token),
        )
        self.assertEqual(first.status_code, 201, first.content)

        second = self.client.post(
            "/api/mentor-bookings/",
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth(token),
        )
        self.assertEqual(second.status_code, 409)
        self.assertEqual(MentorBooking.objects.filter(trainer=trainer, start_at=start_at).count(), 1)

    def test_admin_intelligence_endpoints_return_safe_labels(self):
        token = self.login("admin@figr.it")
        pulse = self.client.get("/api/admin/capacity-pulse/", **self.auth(token))
        self.assertEqual(pulse.status_code, 200, pulse.content)
        self.assertTrue(pulse.json().get("cells"))

        simulation = self.client.get("/api/admin/intervention-simulator/", **self.auth(token))
        self.assertEqual(simulation.status_code, 200, simulation.content)
        body = simulation.json()
        self.assertFalse(body["guaranteed"])
        self.assertIn("simulated", body["label"].lower())
