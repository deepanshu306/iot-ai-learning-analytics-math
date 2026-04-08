# Final System Overview

This repository now contains the final GitHub Pages submission for:

`Automated Learning Analytics and Personalized Feedback System for Mathematics Education`

## Final Implementation Model

The submitted project is a static React application hosted through GitHub Pages. It does not rely
on a live backend deployment. Instead, it uses:

- seeded student, teacher, and admin accounts
- seeded LMS-style mathematics learning events
- client-side analytics logic
- rule-based personalized feedback
- session-based runtime updates for admin actions

## Final Repository Focus

The main implementation paths are:

- `frontend-react/`
- `react-app/`
- `index.html`
- `project-motive.html`
- `iot-architecture.html`
- `scripts/generate_final_report.py`

## Final User Roles

- Student
- Teacher
- Admin

Parent-facing pages are not part of this version.

## Final Feature Summary

1. Student personalized feedback page
2. Teacher analytics and learner drill-down page
3. Admin management page
4. Session-backed runtime event simulation
5. Public hosting through GitHub Pages

## Local Run

```bash
cd frontend-react
npm install
npm run dev
```

## Build For GitHub Pages

```bash
cd frontend-react
npm run build
```
