const STATIC_STATE_KEY = "learning-analytics-static-state-v1";

const SEED_STATE = {
  users: [
    {
      id: "user-stu-001",
      role: "student",
      name: "Aanya Sharma",
      email: "aanya@student.demo",
      password: "math123",
      studentId: "stu-001"
    },
    {
      id: "user-stu-002",
      role: "student",
      name: "Rohan Mehta",
      email: "rohan@student.demo",
      password: "math123",
      studentId: "stu-002"
    },
    {
      id: "user-stu-003",
      role: "student",
      name: "Kavya Iyer",
      email: "kavya@student.demo",
      password: "math123",
      studentId: "stu-003"
    },
    {
      id: "user-teacher-001",
      role: "teacher",
      name: "Dr. Nidhi Rao",
      email: "nidhi@teacher.demo",
      password: "teach123"
    },
    {
      id: "user-admin-001",
      role: "admin",
      name: "Systems Admin",
      email: "admin@demo.local",
      password: "admin123"
    }
  ],
  students: [
    {
      id: "stu-001",
      name: "Aanya Sharma",
      gradeLevel: "B.Tech Final Year",
      lmsUserId: "LMS-1001"
    },
    {
      id: "stu-002",
      name: "Rohan Mehta",
      gradeLevel: "B.Tech Final Year",
      lmsUserId: "LMS-1002"
    },
    {
      id: "stu-003",
      name: "Kavya Iyer",
      gradeLevel: "B.Tech Final Year",
      lmsUserId: "LMS-1003"
    }
  ],
  connectors: [
    {
      name: "Moodle",
      status: "connected",
      syncFrequency: "5 min",
      lastSync: "2026-04-09T09:15:00Z"
    },
    {
      name: "Canvas",
      status: "connected",
      syncFrequency: "10 min",
      lastSync: "2026-04-09T09:10:00Z"
    },
    {
      name: "Google Classroom",
      status: "pilot",
      syncFrequency: "manual",
      lastSync: "2026-04-08T18:30:00Z"
    }
  ],
  events: [
    {
      eventId: "evt-001",
      studentId: "stu-001",
      platform: "Moodle",
      topic: "Algebra",
      subtopic: "Linear Equations",
      scorePct: 88,
      difficulty: "medium",
      timeSpentMin: 16,
      completionRate: 1.0,
      hintsUsed: 1,
      timestamp: "2026-04-01T10:15:00Z"
    },
    {
      eventId: "evt-002",
      studentId: "stu-001",
      platform: "Moodle",
      topic: "Calculus",
      subtopic: "Derivatives",
      scorePct: 62,
      difficulty: "hard",
      timeSpentMin: 26,
      completionRate: 1.0,
      hintsUsed: 2,
      timestamp: "2026-04-03T11:05:00Z"
    },
    {
      eventId: "evt-003",
      studentId: "stu-001",
      platform: "Canvas",
      topic: "Trigonometry",
      subtopic: "Identities",
      scorePct: 72,
      difficulty: "medium",
      timeSpentMin: 18,
      completionRate: 1.0,
      hintsUsed: 1,
      timestamp: "2026-04-06T09:45:00Z"
    },
    {
      eventId: "evt-004",
      studentId: "stu-002",
      platform: "Moodle",
      topic: "Algebra",
      subtopic: "Quadratic Equations",
      scorePct: 54,
      difficulty: "medium",
      timeSpentMin: 24,
      completionRate: 0.95,
      hintsUsed: 3,
      timestamp: "2026-04-01T12:10:00Z"
    },
    {
      eventId: "evt-005",
      studentId: "stu-002",
      platform: "Canvas",
      topic: "Trigonometry",
      subtopic: "Special Angles",
      scorePct: 49,
      difficulty: "easy",
      timeSpentMin: 21,
      completionRate: 1.0,
      hintsUsed: 2,
      timestamp: "2026-04-04T14:20:00Z"
    },
    {
      eventId: "evt-006",
      studentId: "stu-002",
      platform: "Google Classroom",
      topic: "Calculus",
      subtopic: "Limits",
      scorePct: 58,
      difficulty: "medium",
      timeSpentMin: 23,
      completionRate: 0.9,
      hintsUsed: 3,
      timestamp: "2026-04-07T10:25:00Z"
    },
    {
      eventId: "evt-007",
      studentId: "stu-003",
      platform: "Canvas",
      topic: "Algebra",
      subtopic: "Sequences",
      scorePct: 91,
      difficulty: "hard",
      timeSpentMin: 17,
      completionRate: 1.0,
      hintsUsed: 0,
      timestamp: "2026-04-02T08:55:00Z"
    },
    {
      eventId: "evt-008",
      studentId: "stu-003",
      platform: "Moodle",
      topic: "Calculus",
      subtopic: "Integration",
      scorePct: 86,
      difficulty: "hard",
      timeSpentMin: 20,
      completionRate: 1.0,
      hintsUsed: 1,
      timestamp: "2026-04-05T15:00:00Z"
    },
    {
      eventId: "evt-009",
      studentId: "stu-003",
      platform: "Canvas",
      topic: "Trigonometry",
      subtopic: "Double Angle",
      scorePct: 84,
      difficulty: "medium",
      timeSpentMin: 19,
      completionRate: 1.0,
      hintsUsed: 1,
      timestamp: "2026-04-07T13:40:00Z"
    }
  ]
};

let cachedState = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStaticState() {
  if (typeof window === "undefined") {
    return clone(SEED_STATE);
  }
  try {
    const raw = window.sessionStorage.getItem(STATIC_STATE_KEY);
    if (!raw) {
      return clone(SEED_STATE);
    }
    return JSON.parse(raw);
  } catch (_error) {
    return clone(SEED_STATE);
  }
}

function writeStaticState(state) {
  cachedState = clone(state);
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(STATIC_STATE_KEY, JSON.stringify(state));
}

function getState() {
  if (!cachedState) {
    cachedState = readStaticState();
  }
  return cachedState;
}

function updateState(mutator) {
  const nextState = clone(getState());
  mutator(nextState);
  writeStaticState(nextState);
  return nextState;
}

function safeMean(values) {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0;
}

function riskLevel(score) {
  if (score < 55) return "high";
  if (score < 70) return "moderate";
  return "low";
}

function scoreBand(score) {
  if (score < 55) return "critical";
  if (score < 70) return "needs_support";
  if (score < 85) return "on_track";
  return "advanced";
}

function publicUser(user) {
  const cloneUser = { ...user };
  delete cloneUser.password;
  return cloneUser;
}

function staticRuntime() {
  return {
    messaging: {
      technology: "In-Browser Event Queue",
      mode: "static",
      detail: "Learning events are processed directly in the browser so the project runs on GitHub Pages without a backend server.",
      target: "session analytics state",
      connection: "sessionStorage"
    },
    storage: {
      technology: "Browser Session Storage",
      mode: "static",
      detail: "Runtime users, connector updates, and newly ingested events are preserved for the active browser session.",
      target: "learning-analytics-static-state-v1",
      connection: "sessionStorage"
    }
  };
}

function serviceTopology() {
  return [
    {
      name: "Seed Data Layer",
      stack: "Static JavaScript data",
      purpose: "Provides demo users, students, connectors, and mathematics learning events.",
      status: "active",
      mode: "seeded"
    },
    {
      name: "Analytics Engine",
      stack: "Client-side rules",
      purpose: "Computes topic mastery, trends, class averages, and student risk levels in the browser.",
      status: "active",
      mode: "analytics"
    },
    {
      name: "Feedback Engine",
      stack: "Rule-based personalization",
      purpose: "Generates student guidance and teacher interventions from computed performance summaries.",
      status: "active",
      mode: "recommendation"
    },
    {
      name: "Visualization Layer",
      stack: "React 18 + D3.js",
      purpose: "Renders separate student, teacher, and admin dashboards for GitHub Pages hosting.",
      status: "active",
      mode: "dashboard"
    },
    {
      name: "Admin Control Layer",
      stack: "Session-backed state manager",
      purpose: "Handles user creation, connector updates, and event ingestion without any server dependency.",
      status: "active",
      mode: "management"
    },
    {
      name: "Hosting Layer",
      stack: "GitHub Pages",
      purpose: "Publishes the project as a static web application through the repository.",
      status: "active",
      mode: "hosting"
    }
  ];
}

function studentSummary(studentId) {
  const state = getState();
  const student = state.students.find((item) => item.id === studentId);
  if (!student) {
    return null;
  }

  const events = state.events
    .filter((item) => item.studentId === studentId)
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));

  const topicScores = Object.entries(
    events.reduce((accumulator, event) => {
      accumulator[event.topic] = accumulator[event.topic] || [];
      accumulator[event.topic].push(event.scorePct);
      return accumulator;
    }, {})
  ).map(([topic, scores]) => {
    const score = safeMean(scores);
    return {
      topic,
      score,
      status: scoreBand(score)
    };
  });

  const averageScore = safeMean(events.map((item) => item.scorePct));
  const latestScore = events.length ? events[events.length - 1].scorePct : 0;
  const averageTimeMinutes = safeMean(events.map((item) => item.timeSpentMin));
  const completionRate = safeMean(events.map((item) => item.completionRate * 100));
  const weakTopics = topicScores.filter((item) => item.score < 70).map((item) => item.topic);
  const orderedTopics = [...topicScores].sort((left, right) => left.score - right.score);
  const recommendedPath = [];

  orderedTopics.slice(0, 2).forEach((item) => {
    if (item.score < 60) {
      recommendedPath.push(`Assign remedial ${item.topic.toLowerCase()} practice with guided examples.`);
    } else if (item.score < 75) {
      recommendedPath.push(`Schedule targeted revision tasks for ${item.topic.toLowerCase()} before the next assessment.`);
    }
  });

  if (orderedTopics.length && orderedTopics[orderedTopics.length - 1].score >= 85) {
    recommendedPath.push(`Promote ${orderedTopics[orderedTopics.length - 1].topic.toLowerCase()} to the advanced-learning pathway.`);
  }

  return {
    student,
    averageScore,
    latestScore,
    averageTimeMinutes,
    completionRate,
    riskLevel: riskLevel(averageScore),
    topicMastery: topicScores,
    trend: events.map((item) => ({ label: item.timestamp.slice(0, 10), score: item.scorePct })),
    recommendedPath,
    recentEvents: [...events].reverse().slice(0, 5),
    sources: [...new Set(events.map((item) => item.platform))],
    weakTopics
  };
}

function feedbackBundle(studentId) {
  const summary = studentSummary(studentId);
  if (!summary) {
    return null;
  }

  return {
    studentId,
    studentName: summary.student.name,
    studentFeedback: [
      `Current average score is ${summary.averageScore}%.`,
      `Weakest monitored areas: ${summary.weakTopics.length ? summary.weakTopics.join(", ") : "none"}`,
      ...summary.recommendedPath
    ],
    instructorFeedback: [
      `Risk level for ${summary.student.name} is ${summary.riskLevel}.`,
      "Use mastery trends to assign differentiated practice sets.",
      "Escalate low-performing topics to live instructor intervention when two consecutive assessments fall below 60%."
    ]
  };
}

function classOverview() {
  const state = getState();
  const studentSummaries = state.students.map((student) => studentSummary(student.id)).filter(Boolean);
  const topicMap = {};

  studentSummaries.forEach((summary) => {
    summary.topicMastery.forEach((item) => {
      topicMap[item.topic] = topicMap[item.topic] || [];
      topicMap[item.topic].push(item.score);
    });
  });

  return {
    totalStudents: studentSummaries.length,
    averageScore: safeMean(studentSummaries.map((item) => item.averageScore)),
    highRiskStudents: studentSummaries.filter((item) => item.riskLevel === "high").length,
    connectorsOnline: state.connectors.filter((item) => item.status === "connected").length,
    studentOptions: studentSummaries.map((summary) => ({ id: summary.student.id, name: summary.student.name })),
    studentSnapshots: studentSummaries.map((summary) => ({
      studentId: summary.student.id,
      name: summary.student.name,
      averageScore: summary.averageScore,
      latestScore: summary.latestScore,
      riskLevel: summary.riskLevel
    })),
    topicHeatmap: Object.entries(topicMap)
      .map(([topic, scores]) => ({ topic, score: safeMean(scores) }))
      .sort((left, right) => left.topic.localeCompare(right.topic)),
    distribution: [
      { label: "High", count: studentSummaries.filter((item) => item.riskLevel === "high").length },
      { label: "Moderate", count: studentSummaries.filter((item) => item.riskLevel === "moderate").length },
      { label: "Low", count: studentSummaries.filter((item) => item.riskLevel === "low").length }
    ],
    serviceTopology: serviceTopology()
  };
}

export async function login(email, password) {
  const user = getState().users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );

  if (!user) {
    return null;
  }

  return {
    token: `static-token-${user.id}`,
    user: publicUser(user),
    source: "github-pages-static"
  };
}

export async function fetchDemoAccounts() {
  return getState().users.map((user) => ({
    role: user.role,
    email: user.email,
    password: user.password,
    name: user.name
  }));
}

export async function fetchStudentDashboard(studentId) {
  return {
    summary: studentSummary(studentId),
    feedback: feedbackBundle(studentId),
    pipeline: staticRuntime(),
    source: "github-pages-static"
  };
}

export async function fetchTeacherDashboard(studentId) {
  const overview = classOverview();
  const selectedId = studentId || overview.studentOptions[0]?.id;

  return {
    overview,
    selectedStudent: studentSummary(selectedId),
    selectedFeedback: feedbackBundle(selectedId),
    connectors: [...getState().connectors],
    pipeline: staticRuntime(),
    source: "github-pages-static"
  };
}

export async function fetchAdminDashboard() {
  const state = getState();
  return {
    counts: {
      users: state.users.length,
      students: state.users.filter((user) => user.role === "student").length,
      teachers: state.users.filter((user) => user.role === "teacher").length,
      admins: state.users.filter((user) => user.role === "admin").length,
      events: state.events.length,
      connectedLms: state.connectors.filter((item) => item.status === "connected").length
    },
    users: state.users.map(publicUser),
    connectors: [...state.connectors],
    recentEvents: [...state.events].reverse().slice(0, 8),
    pipeline: staticRuntime(),
    serviceTopology: serviceTopology(),
    source: "github-pages-static"
  };
}

export async function createUser(payload) {
  const state = getState();
  if (state.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error("duplicate_email");
  }

  let createdUser;
  updateState((draft) => {
    createdUser = {
      id: `static-user-${Date.now()}`,
      role: payload.role,
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      studentId: payload.role === "student" ? `stu-${Date.now()}` : undefined
    };

    draft.users.push(createdUser);

    if (payload.role === "student") {
      draft.students.push({
        id: createdUser.studentId,
        name: payload.name,
        gradeLevel: payload.gradeLevel || "B.Tech Final Year",
        lmsUserId: payload.lmsUserId || `LMS-${Date.now()}`
      });
    }
  });

  return { ...publicUser(createdUser), source: "github-pages-static" };
}

export async function updateConnectorStatus(connectorName, updates) {
  let updatedConnector = null;

  updateState((draft) => {
    const connector = draft.connectors.find((item) => item.name === connectorName);
    if (!connector) {
      throw new Error("connector_not_found");
    }
    Object.assign(connector, updates);
    updatedConnector = { ...connector };
  });

  return { ...updatedConnector, source: "github-pages-static" };
}

export async function ingestEvent(payload) {
  const event = {
    eventId: `evt-runtime-${Date.now()}`,
    ...payload,
    scorePct: Number(payload.scorePct),
    timeSpentMin: Number(payload.timeSpentMin),
    completionRate: Number(payload.completionRate),
    hintsUsed: Number(payload.hintsUsed || 0)
  };

  updateState((draft) => {
    draft.events.push(event);
  });

  return {
    event,
    messaging: staticRuntime().messaging,
    storage: staticRuntime().storage,
    source: "github-pages-static"
  };
}

export async function fetchSystemRuntime() {
  return {
    pipeline: staticRuntime(),
    services: serviceTopology(),
    source: "github-pages-static"
  };
}
