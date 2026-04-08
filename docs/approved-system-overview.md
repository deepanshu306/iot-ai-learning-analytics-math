# Approved System Overview

This repository now contains an approved-architecture scaffold for the project:

`Automated Learning Analytics and Personalized Feedback System for Mathematics Education`

## Problem Alignment

The approved problem statement requires:

- a scalable microservices-based backend
- personalized feedback for students, instructors, and parents
- LMS integration
- real-time visualization
- a stack centered on Python Flask, Apache Kafka, Apache Cassandra, React 18, D3.js, and Jupyter Notebook

The current repo now includes the following aligned structure:

- `backend/services/data_collector`
- `backend/services/data_processor`
- `backend/services/feedback_generator`
- `backend/services/visualization_service`
- `backend/services/integration_service`
- `frontend-react`
- `notebooks/learning_analytics_exploration.ipynb`
- `docker-compose.yml`

## Architecture Mapping

1. `Data Collector Service`
   Accepts learning events from LMS or mathematics platforms and publishes them toward Kafka topics.

2. `Data Processor Service`
   Converts raw events into learner summaries, topic mastery, and risk bands.

3. `Feedback Generator Service`
   Produces stakeholder-specific recommendations for students, instructors, and parents.

4. `Visualization Service`
   Serves aggregated dashboard data to a React 18 + D3.js frontend.

5. `Integration Service`
   Manages LMS sync status and connector-level orchestration.

## Important Positioning

The old static browser prototype has been removed from the main project structure. The repository is
now positioned around the approved Flask + React microservices architecture, while root HTML pages
serve only as lightweight documentation and project overview pages.

## Suggested Next Build Steps

1. Install backend dependencies with `pip install -r backend/requirements.txt`
2. Install frontend dependencies with `npm install` inside `frontend-react`
3. Start Kafka and Cassandra with `docker compose up -d`
4. Run each Flask service on its assigned port
5. Start the React visualization frontend with `npm run dev`
