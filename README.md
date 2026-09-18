# Capacity Connect — FIGR.IT UI · SIH26075

**Capacity Connect — An Organizational Capacity Intelligence & Learning System**

> It does not just deliver training. It detects capacity risks, identifies competency gaps, connects the right experts to the right people, recommends targeted interventions, and verifies whether those gaps were actually closed.

This repository keeps the original FIGR.IT project family and coding approach — React/TypeScript/Tailwind on the frontend and Django on the backend — while rebuilding the experience around the Capacity Connect SIH26075 journey.

## Product loop

### Trainee
**Domain → Adaptive Assessment → Role Alignment → Target Role → Competency Map → Skill Gap → Capacity Coach → Learning Path → Courses / Practice → Optional 20/30-minute Mentor Session → Targeted Reassessment → Verified Improvement → Skill Passport**

### Organization / Admin
**Capacity Pulse → Capacity Risk → Coverage Shield → Intervention Simulator → Capacity Bridge / Smart Cohort → Training → Verification → Organizational Impact**

## Main features implemented

### Trainee workspace
- Domain-specific onboarding and assessment entry
- Deterministic adaptive diagnostic question selection by competency and difficulty
- Marketing demo question bank with MCQ, scenario and case questions
- Suggested role/sub-field alignment after diagnostic
- Required-vs-current competency matrix
- Exact skill-gap status: Achieved / Low / Moderate / Critical
- Capacity Coach with one clear “next best action”
- Personalized learning path generated from top gaps
- Recommended course catalog with “Why recommended?” explanations
- Course progress persistence
- 20-minute or 30-minute on-demand mentor booking
- Mentor availability and double-booking protection
- Mentor session outcome/action plan integration
- Targeted reassessment architecture
- ProofScore-style competency evidence: level, confidence, freshness, evidence count
- Skill Passport with evidence timeline
- Knowledge Hub and grounded Ask Capacity flow
- Certificates and announcements surfaces

### Trainer / Mentor workspace
- Professional expert profile and competency tags
- Upcoming mentor sessions
- Session outcome/action-plan form
- Learners needing attention
- Course Studio
- Assessment Studio
- Trainer resource library
- Question intelligence / review indicators
- Content-vs-learner diagnosis using “possible issue” language
- Case-to-curriculum workflow UI
- Competency impact view

### Admin — Capacity Command Center
- Organizational Capacity Pulse heatmap
- Unit/competency drill-down
- Coverage Shield for expert concentration / succession risk
- Capacity Bridge to connect deficit units to suitable experts
- Explainable expert matching
- Smart Cohort suggestions
- Intervention Simulator with explicit **estimated/simulated** labels
- Training impact analytics
- Pending trainer/user approvals
- User and role governance
- Announcements and learning governance
- Configurable skill-gap / freshness rule surfaces

## Demo accounts

All seeded accounts use password:

`demo123`

- Trainee: `trainee@figr.it`
- Trainer: `trainer@figr.it`
- Admin: `admin@figr.it`

The seeded trainee story is intentionally easy to demo:
- Domain: Marketing
- Target role: Performance Marketing Specialist
- Strong areas: fundamentals / copywriting
- Priority gaps: Marketing Analytics, Paid Advertising, A/B Testing
- Personalized path + mentor session + reassessment journey

## Technology

### Frontend
- React 19
- TypeScript
- Next-compatible `app/` structure
- Vinext + Vite
- Tailwind CSS 4
- Lucide icons
- Existing FIGR.IT component ecosystem preserved
- New modular Capacity Connect workspaces instead of one giant portal component

### Backend
- Django 5.x
- SQLite for hackathon/demo portability
- Django ORM
- Token authentication
- Role authorization: Trainee / Trainer / Admin
- Local media support
- Optional OpenAI-based grounded generation after local retrieval

## UI direction

The interface keeps FIGR.IT’s product-native feeling but makes it more suitable for a professional capacity platform:
- restrained Winter Chill palette
- large whitespace
- soft neutral surfaces
- compact metric cards
- strong typography hierarchy
- contextual side panels
- progressive disclosure
- one prominent next action for trainees
- denser intelligence views only where admins need them

It intentionally avoids looking like a generic Udemy clone or old-style government portal.

## Fastest Windows setup

### Option A — launcher
Run:

`START_FIGR_IT.bat`

It opens:
1. Django backend: `http://127.0.0.1:8000`
2. Frontend: `http://localhost:5173`

### Option B — manual

Backend:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python setup_demo.py
python manage.py test training
python manage.py runserver 8000
```

Health check:

`http://127.0.0.1:8000/api/health/`

Frontend from the repository root:

```bat
npm install
npm run dev
```

Open:

`http://localhost:5173`

## Important APIs

### Auth and profile
- `POST /api/auth/login/`
- `POST /api/auth/register/`
- `GET /api/auth/me/`

### Adaptive diagnostic and gaps
- `GET /api/domains/`
- `POST /api/diagnostic/start/`
- `POST /api/diagnostic/<attempt_id>/answer/`
- `GET /api/diagnostic/<attempt_id>/result/`
- `POST /api/diagnostic/<attempt_id>/target-role/`
- `GET /api/trainee/readiness/`
- `GET /api/trainee/learning-path/`
- `GET /api/trainee/skill-passport/`

### Courses
- `GET /api/courses/`
- `POST /api/courses/<id>/enroll/`
- `POST /api/courses/<id>/progress/`
- `GET /api/courses/<id>/resources/`
- `POST /api/courses/<id>/feedback/`
- `GET /api/assessments/`
- `POST /api/assessments/<id>/submit/`

### Mentoring
- `GET /api/mentors/?competency=Marketing%20Analytics`
- `GET /api/mentor-availability/?trainer_id=<id>&duration=20`
- `GET|POST /api/mentor-bookings/`
- `GET /api/trainer/sessions/`
- `POST /api/mentor-bookings/<id>/outcome/`

### Admin intelligence
- `GET /api/admin/capacity-pulse/`
- `GET /api/admin/coverage-shield/?competency=Marketing%20Analytics`
- `GET /api/admin/capacity-bridge/?competency=Marketing%20Analytics`
- `GET /api/admin/cohorts/`
- `GET|POST /api/admin/intervention-simulator/`
- `GET /api/admin/training-impact/`

### Knowledge
- `GET /api/knowledge/?q=analytics`
- `POST /api/rag/chat/`

## Data and safety behavior

- Admin intervention projections are explicitly labeled **estimated / simulated impact**.
- Mentor notes add evidence but do not automatically pretend to be a scored competency verification.
- Low-confidence Ask Capacity answers can route the trainee toward a human expert instead of fabricating an answer.
- Trainer applications require admin approval.
- Backend role checks prevent a trainee from reaching admin endpoints by changing the URL.
- Mentor booking validates availability, prevents past slots and protects against overlapping bookings.

## Optional OpenAI integration

The knowledge assistant can run without an API key using local retrieval and grounded fallback text.

To enable LLM-assisted grounded answers:

```bat
set OPENAI_API_KEY=your_key_here
set OPENAI_MODEL=gpt-5.6-luna
python manage.py runserver 8000
```

Never place the key in frontend code.

## Recommended SIH demo sequence

1. Login as trainee.
2. Start Marketing diagnostic.
3. Show that question difficulty/competency changes as answers are submitted.
4. Show role alignment and choose Performance Marketing Specialist.
5. Show exact gaps and ProofScore evidence.
6. Open Capacity Coach and the generated development path.
7. Show why a course was recommended.
8. Book a 20/30-minute relevant mentor session.
9. Login as trainer and submit the session outcome.
10. Return to trainee and show updated evidence/action plan/reassessment journey.
11. Login as admin and open Capacity Pulse.
12. Drill into a weak competency → Coverage Shield → Capacity Bridge → Smart Cohort / intervention.
13. Finish on Training Impact: the system asks whether capability improved, not just whether a course was completed.

## Validation notes

See `VALIDATION_REPORT.txt` for what was checked in the build environment and what still requires a normal local dependency install.
