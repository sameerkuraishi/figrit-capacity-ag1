# SIH26075 — Feature Map

## Core problem positioning
Capacity Connect is implemented as an **Organizational Capacity Intelligence & Learning System**, not only a course portal.

## Mandatory / expected platform capabilities
| Capability | Implementation |
|---|---|
| Trainee / Trainer / Admin roles | Token auth + backend role guards + separate workspaces |
| Professional profiles | UserProfile + Trainer competency/expertise data |
| Courses and learning resources | Course explorer/player + resources API |
| Trainer library | Trainer resource creation + library UI |
| Assessments / questionnaires | Assessment APIs + Assessment Studio |
| Feedback | Course / platform feedback model/API |
| Certifications | Certificate model + trainee credential surface |
| Announcements | Admin create + trainee display |
| Analytics | Trainee, trainer and admin intelligence views |
| Competency mapping | Job roles, requirements, UserCompetency evidence |
| Trainer matching | Explainable competency-specific mentor matching |

## Differentiation layer

### 1. Category-based adaptive diagnostic
- Domain chosen first
- Questions tagged by competency / skill / difficulty / question type
- Deterministic adaptive difficulty logic
- Produces evidence rather than one generic score

### 2. Role alignment → exact skill gap
- Assessment produces suggested role/sub-field alignment
- Trainee can select target role
- System loads required competency matrix
- Exact current vs required gap is calculated

### 3. Capacity Coach
- One next-best action
- Gap-driven personalized path
- Course/practice/expert/reassessment steps

### 4. On-demand mentor marketplace
- Mentor is not permanently assigned
- Relevance/expertise/language/availability-based recommendations
- 20- or 30-minute booking
- Backend overlap protection
- Mentor outcome + action plan

### 5. ProofScore / Skill Passport
- Competency level
- Confidence
- Freshness
- Evidence count and timeline
- Verification status

### 6. Capacity Pulse
- Organization/unit × competency heatmap
- Required vs current readiness
- Drill-down into weak capacity areas

### 7. Coverage Shield
- Expert concentration
- Backup expert count
- Potential successors
- Critical knowledge continuity warning

### 8. Capacity Bridge
- Weak unit / competency identified
- Relevant experts ranked
- Cross-unit expert intervention pathway

### 9. Smart Cohorts
- Groups learners around common competency/level/language needs
- Admin review before confirmation

### 10. Intervention Simulator
- Compares intervention options
- People / learning hours / projected readiness
- All projections labeled estimated/simulated, not guaranteed AI outcomes

### 11. Trainer intelligence
- Learners needing attention
- Question intelligence
- Content-vs-learner diagnosis
- Case-to-curriculum workflow
- Competency impact

### 12. Knowledge Hub + Ask Capacity
- Internal searchable content
- Grounded source-based Q&A architecture
- Low-confidence safe fallback to human expert

## Key judge story

**Assess → identify exact gap → create path → use course/practice → book relevant expert if needed → reassess → verify improvement → show organizational impact.**

Admin side:

**Capacity Pulse → risk → Coverage Shield → Capacity Bridge / cohort / intervention → training → measured impact.**
