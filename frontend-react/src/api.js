const SERVICES = {
  visualization: "http://localhost:5004/api/dashboard",
  processorOverview: "http://localhost:5002/api/analytics/overview",
  processorStudent: (studentId) => `http://localhost:5002/api/analytics/students/${studentId}`,
  feedback: (studentId) => `http://localhost:5003/api/feedback/students/${studentId}`,
  integration: "http://localhost:5005/api/integrations/lms"
};

const FALLBACK = {
  overview: {
    totalStudents: 3,
    averageScore: 71.6,
    highRiskStudents: 1,
    connectorsOnline: 2,
    studentOptions: [
      { id: "stu-001", name: "Aanya Sharma" },
      { id: "stu-002", name: "Rohan Mehta" },
      { id: "stu-003", name: "Kavya Iyer" }
    ],
    topicHeatmap: [
      { topic: "Algebra", score: 77.7 },
      { topic: "Calculus", score: 68.7 },
      { topic: "Trigonometry", score: 68.3 }
    ],
    distribution: [
      { label: "High", count: 1 },
      { label: "Moderate", count: 0 },
      { label: "Low", count: 2 }
    ],
    serviceTopology: [
      {
        name: "Data Collector Service",
        stack: "Python Flask + Kafka Producer",
        purpose: "Collect LMS and platform activity as learning events."
      },
      {
        name: "Data Processor Service",
        stack: "Python Flask + Analytics Rules",
        purpose: "Normalize events and compute learner-level insights."
      },
      {
        name: "Feedback Generator Service",
        stack: "Python Flask + Recommendation Rules",
        purpose: "Create student, instructor, and parent feedback streams."
      },
      {
        name: "Visualization Service",
        stack: "React 18 + D3.js",
        purpose: "Render live analytics dashboards for all stakeholders."
      },
      {
        name: "Integration Service",
        stack: "Python Flask + LMS Connectors",
        purpose: "Connect Moodle, Canvas, and Google Classroom workflows."
      }
    ]
  },
  student: {
    student: { id: "stu-001", name: "Aanya Sharma" },
    averageScore: 74,
    latestScore: 72,
    averageTimeMinutes: 20,
    completionRate: 100,
    riskLevel: "low",
    topicMastery: [
      { topic: "Algebra", score: 88, status: "advanced" },
      { topic: "Calculus", score: 62, status: "needs_support" },
      { topic: "Trigonometry", score: 72, status: "on_track" }
    ],
    trend: [
      { label: "2026-04-01", score: 88 },
      { label: "2026-04-03", score: 62 },
      { label: "2026-04-06", score: 72 }
    ],
    recommendedPath: [
      "Assign remedial calculus practice with guided examples.",
      "Schedule targeted revision tasks for trigonometry before the next assessment.",
      "Promote algebra to the advanced-learning pathway."
    ]
  },
  feedback: {
    studentFeedback: [
      "Current average score is 74%.",
      "Weakest monitored areas: Calculus",
      "Assign remedial calculus practice with guided examples."
    ],
    instructorFeedback: [
      "Risk level for Aanya Sharma is low.",
      "Use mastery trends to assign differentiated practice sets."
    ],
    parentFeedback: [
      "Monitor weekly completion consistency for Aanya Sharma.",
      "Encourage a fixed revision schedule before the next class test."
    ]
  },
  connectors: [
    { name: "Moodle", status: "connected", syncFrequency: "5 min" },
    { name: "Canvas", status: "connected", syncFrequency: "10 min" },
    { name: "Google Classroom", status: "pilot", syncFrequency: "manual" }
  ]
};

async function safeFetch(url, fallback) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    return fallback;
  }
}

export async function loadDashboard(studentId) {
  const dashboard = await safeFetch(
    `${SERVICES.visualization}${studentId ? `?student_id=${studentId}` : ""}`,
    {
      overview: FALLBACK.overview,
      selectedStudent: FALLBACK.student,
      feedback: FALLBACK.feedback,
      connectors: FALLBACK.connectors
    }
  );

  return {
    overview: dashboard.overview,
    student: dashboard.selectedStudent,
    feedback: dashboard.feedback,
    connectors: dashboard.connectors
  };
}

export async function loadStudent(studentId) {
  return safeFetch(SERVICES.processorStudent(studentId), FALLBACK.student);
}

export async function loadFeedback(studentId) {
  return safeFetch(SERVICES.feedback(studentId), FALLBACK.feedback);
}

