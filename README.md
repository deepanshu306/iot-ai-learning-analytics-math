# Automated Learning Analytics and Personalized Feedback System for Mathematics Education

This repository contains the final GitHub Pages version of the project. The submitted implementation
is a static React 18 application with D3-based charts, seeded mathematics learning data, role-based
login, and separate Student, Teacher, and Admin dashboards.

## Final Scope

- GitHub Pages hosting only
- React 18 frontend
- D3.js charts
- seeded academic data for demonstration
- role-based login
- student personalized feedback page
- teacher analytics page
- admin management page
- session-based runtime simulation for new users, LMS status updates, and ingested learning events

The current submission does not use a live backend server. Everything required for demonstration is
contained in the frontend and works directly on GitHub Pages.

## Repository Structure

- `frontend-react/` - main React source code
- `react-app/` - built static output used by GitHub Pages
- `index.html` - redirect entry page for GitHub Pages
- `project-motive.html` - project motive and objectives
- `iot-architecture.html` - static architecture explanation page
- `scripts/generate_final_report.py` - combined report and synopsis generator

## User Roles

### Student

- topic mastery chart
- performance trend chart
- personalized feedback list
- recent learning activity table

### Teacher

- class average and high-risk learner summary
- topic heatmap
- risk distribution
- selected-student drill-down
- LMS connector monitoring

### Admin

- runtime user creation
- connector status updates
- simulated learning-event ingestion
- module overview and runtime counts

## Demo Accounts

- Student: `aanya@student.demo` / `math123`
- Student: `rohan@student.demo` / `math123`
- Student: `kavya@student.demo` / `math123`
- Teacher: `nidhi@teacher.demo` / `teach123`
- Admin: `admin@demo.local` / `admin123`

## Data Model Used In The App

The app uses seeded browser-side data for:

- `3` students
- `1` teacher
- `1` admin
- `3` LMS connectors
- `9` historical mathematics learning events

Topics covered:

- Algebra
- Trigonometry
- Calculus

## Hosting

- Live project: `https://deepanshu306.github.io/iot-ai-learning-analytics-math/`
- Direct React app: `https://deepanshu306.github.io/iot-ai-learning-analytics-math/react-app/#/login`
- Repository: `https://github.com/deepanshu306/iot-ai-learning-analytics-math`

## Local Development

```bash
cd frontend-react
npm install
npm run dev
```

To rebuild the GitHub Pages bundle:

```bash
cd frontend-react
npm run build
```

## Notes

- The final implementation is intentionally static so it works directly on GitHub Pages.
- Runtime changes are stored in `sessionStorage`, so they persist during the active browser
  session and reset when the session is cleared.
- The parent-facing page is not included in this version.
