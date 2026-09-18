# Capacity Connect — Quick Hindi Guide

Ye project original FIGR.IT codebase ke same stack/style ko preserve karke SIH26075 ke liye upgrade kiya gaya hai.

## Core trainee flow

**Domain → Adaptive Assessment → Role Alignment → Skill Gap → Capacity Coach → Learning Path → Course/Practice → Optional 20/30 min Mentor → Reassessment → Skill Passport**

Marketing trainee ko Marketing questions milte hain; uske answers se competency scores aur role alignment banta hai. Target role select karne ke baad required level aur current level compare hote hain aur exact gap generate hota hai.

## Mentor system

Mentor permanently assign nahi hota. Trainee relevant expert choose karta hai, 20 ya 30 minute slot select karta hai, reason/note deta hai aur booking backend me save hoti hai. Same mentor ka overlapping slot backend block karta hai.

## Admin flow

**Capacity Pulse → Coverage Shield → Capacity Bridge → Smart Cohort / Intervention → Training Impact**

Iska main goal LMS se zyada hai: organization me kis competency ka risk hai, kaun expert hai, kaunse learners ko intervention chahiye aur training ke baad gap kam hua ya nahi.

## Run

`START_FIGR_IT.bat` double click kar sakte ho.

Ya backend:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python setup_demo.py
python manage.py runserver 8000
```

Frontend:

```bat
npm install
npm run dev
```

Open: `http://localhost:5173`

Demo password: `demo123`

- Trainee: `trainee@figr.it`
- Trainer: `trainer@figr.it`
- Admin: `admin@figr.it`

Detailed features aur APIs ke liye `README.md` dekho.
