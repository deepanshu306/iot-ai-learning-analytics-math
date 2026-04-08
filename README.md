# IoT-Enabled AI-Driven Learning Analytics and Personalized Feedback System for Mathematics Education

Project codename: `Math Analytics Studio`

This repository contains my final-year BTech CSE / AI & ML project prototype. The project is a
browser-based smart classroom demonstrator that analyzes mathematics quiz performance and generates
personalized feedback using a hardware-free IoT model based on simulated classroom events.

Live project:

`https://deepanshu306.github.io/iot-ai-learning-analytics-math/`

Repository:

`https://github.com/deepanshu306/iot-ai-learning-analytics-math`

This version uses a flat structure:

- `index.html`
- `styles.css`
- `app.js`

Open it at:

`http://localhost/mathematics/`

Separate project motive file:

`http://localhost/mathematics/project-motive.html`

Separate IoT architecture file:

`http://localhost/mathematics/iot-architecture.html`

## What Is Implemented

- `3` student accounts, `1` teacher account, and `1` admin account
- `12` seeded mathematics questions across algebra, trigonometry, and calculus
- `6` seeded historical attempts for teacher-side analytics
- mixed quiz support for MCQ and numeric questions
- topic mastery, time-efficiency, and repeated-error analysis
- student recommendations and teacher intervention suggestions
- runtime admin CRUD and JSON export
- public hosting through GitHub Pages

## Demo Credentials

Student accounts:

- `aanya@student.demo` / `math123`
- `rohan@student.demo` / `math123`
- `kavya@student.demo` / `math123`

Teacher account:

- `nidhi@teacher.demo` / `teach123`

Admin account:

- `admin@demo.local` / `admin123`

## Included Features

- Student dashboard, quiz, and result analytics
- Teacher dashboard with charts and student drill-down
- Admin runtime CRUD for users and questions
- Session-only storage with JSON export
- Project motive page framed for a hardware-free IoT smart classroom model
- IoT positioning based on virtual nodes, simulated events, and centralized analytics
- Separate IoT architecture page for final-year project explanation

## Project Notes

- The current recommendation engine is rule-based and explainable.
- The current IoT layer is simulated in software rather than implemented with physical hardware.
- The project is structured for future extension toward prediction, adaptive recommendation, and real IoT messaging.
