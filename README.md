# Automated Learning Analytics and Personalized Feedback System for Mathematics Education

This repository now aligns with the approved final-year project brief:

- **Problem Type:** IoT Based
- **Architecture:** Microservices
- **Backend Stack:** Python Flask, Apache Kafka, Apache Cassandra
- **Frontend Stack:** React 18, D3.js
- **Analysis Workspace:** Jupyter Notebook

## Approved Objective

Design and implement a scalable microservices-based system that collects and analyzes student
learning data from online mathematics platforms, provides personalized feedback to students and
instructors, integrates with existing LMS platforms, and supports real-time data
visualization.

## Repository Structure

### Approved architecture scaffold

- `backend/services/data_collector`
- `backend/services/data_processor`
- `backend/services/feedback_generator`
- `backend/services/visualization_service`
- `backend/services/integration_service`
- `backend/shared`
- `frontend-react`
- `notebooks/learning_analytics_exploration.ipynb`
- `docker-compose.yml`

### Root documentation pages

- `index.html`
- `project-motive.html`
- `iot-architecture.html`

The old root browser prototype based on plain `HTML/CSS/JS` has been removed. The root pages now
act only as lightweight project overview and documentation pages, while the actual approved
implementation structure lives under `backend/` and `frontend-react/`.

## Microservices Included

### `Data Collector Service`

- collects LMS and mathematics-platform learning events
- exposes ingestion endpoints
- is prepared to publish to Kafka topics

### `Data Processor Service`

- normalizes learning events
- computes student-level and class-level analytics
- generates topic mastery and risk summaries

### `Feedback Generator Service`

- creates personalized student feedback
- creates instructor intervention guidance
- supports role-specific recommendations for the implemented student and teacher flows

### `Visualization Service`

- provides dashboard-ready JSON
- is paired with a React 18 + D3.js frontend
- supports drill-down views for individual students

### `Integration Service`

- exposes LMS connector status
- models Moodle, Canvas, and Google Classroom integration flow

## Frontend

The React frontend lives in `frontend-react` and demonstrates:

- role-based login
- separate student, teacher, and admin pages
- personalized student feedback
- teacher analytics and learner drill-down
- admin user and connector management
- D3-based topic mastery and trend charts
- clearly justified simulated Kafka and Cassandra workflow when local infrastructure is not running

## Infrastructure

`docker-compose.yml` contains infrastructure services for:

- Apache Kafka
- Apache Cassandra

These are included to match the approved stack and local-development flow.

## Notebook

`notebooks/learning_analytics_exploration.ipynb` is included for exploratory analytics work and
feature experimentation before model or service-level integration.

## Hosted URLs

- Root project URL: `https://deepanshu306.github.io/iot-ai-learning-analytics-math/`
- React frontend URL: `https://deepanshu306.github.io/iot-ai-learning-analytics-math/react-app/`

The root URL now redirects to the React frontend so the hosted project matches the approved stack more closely.

## Local Development

### Backend

```bash
python3 -m pip install -r backend/requirements.txt
python3 -m backend.services.data_collector.app
python3 -m backend.services.data_processor.app
python3 -m backend.services.feedback_generator.app
python3 -m backend.services.visualization_service.app
python3 -m backend.services.integration_service.app
```

### Frontend

```bash
cd frontend-react
npm install
npm run dev
```

### Infrastructure

```bash
docker compose up -d
```

## Notes

- The old root static demo files were removed to avoid stack mismatch with the approved problem statement.
- The backend and React folders are now the main implementation path.
- Kafka and Cassandra are represented in configuration and infrastructure setup, while service code
  currently uses development-friendly seeded data so the system stays demo-ready.
- The current submission implements Student, Teacher, and Admin roles. A parent-facing page is not
  included in this version.
- The root HTML pages now provide project overview and academic positioning only.
