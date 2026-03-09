# Math Analytics Studio

Frontend final-year project demonstrator for:

**Automated Learning Analytics and Personalized Feedback System for Mathematics Education**

## Run

Open the project at:

`http://localhost/mathematics/`

The app is built with:

- HTML
- CSS
- Vanilla JavaScript
- Chart.js via CDN

## Demo Credentials

Student accounts:

- `aanya@student.demo` / `math123`
- `rohan@student.demo` / `math123`
- `kavya@student.demo` / `math123`
- `ishita@student.demo` / `math123`

Teacher account:

- `nidhi@teacher.demo` / `teach123`

Admin account:

- `admin@demo.local` / `admin123`

## Features

- Student login, dashboard, quiz, result analytics, and personalized feedback
- Teacher dashboard with class averages, topic mastery, score distribution, and student drill-down
- Admin runtime management for users and questions
- Static JSON data source for users, questions, and seeded attempts
- Session-only runtime state with JSON export for admin changes

## Project Structure

- `/data` seeded JSON data
- `/css/styles.css` shared visual system
- `/js/modules` shared logic for auth, analytics, feedback, storage, charts, and quiz evaluation
- `/js/pages` page-specific controllers

## Notes

- This is a frontend demonstrator, not a secure production system.
- Runtime edits are stored only in the current browser session.
- Best viewed through Apache/XAMPP, not as a local `file://` page, because the app fetches JSON.
