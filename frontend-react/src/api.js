const SERVICES = {
  collector: "http://localhost:5001",
  processor: "http://localhost:5002",
  feedback: "http://localhost:5003",
  visualization: "http://localhost:5004",
  integration: "http://localhost:5005"
};

const FALLBACK_STATE = {
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
      parentName: "Ritika Sharma",
      lmsUserId: "LMS-1001"
    },
    {
      id: "stu-002",
      name: "Rohan Mehta",
      gradeLevel: "B.Tech Final Year",
      parentName: "Sanjay Mehta",
      lmsUserId: "LMS-1002"
    },
    {
      id: "stu-003",
      name: "Kavya Iyer",
      gradeLevel: "B.Tech Final Year",
      parentName: "Meera Iyer",
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
  const clone = { ...user };
  delete clone.password;
  return clone;
}

function pipelineFallback() {
  return {
    messaging: {
      technology: "Apache Kafka",
      mode: "simulated",
      detail: "Events are mirrored through an in-browser demo flow when backend services are unavailable.",
      target: "learning-events",
      connection: "localhost:9092"
    },
    storage: {
      technology: "Apache Cassandra",
      mode: "simulated",
      detail: "Learner events are kept in session fallback state when backend services are unavailable.",
      target: "learning_analytics",
      connection: "localhost"
    }
  };
}

function serviceTopologyFallback() {
  const pipeline = pipelineFallback();
  return [
    {
      name: "Data Collector Service",
      stack: "Python Flask",
      purpose: "Collect LMS and platform activity as learning events.",
      status: "active",
      mode: pipeline.messaging.mode
    },
    {
      name: "Data Processor Service",
      stack: "Python Flask",
      purpose: "Normalize events and compute learner-level insights.",
      status: "active",
      mode: "analytics"
    },
    {
      name: "Feedback Generator Service",
      stack: "Python Flask",
      purpose: "Create student and instructor feedback streams.",
      status: "active",
      mode: "recommendation"
    },
    {
      name: "Visualization Service",
      stack: "React 18 + D3.js",
      purpose: "Render role-based dashboards for students, teachers, and administrators.",
      status: "active",
      mode: "dashboard"
    },
    {
      name: "Integration Service",
      stack: "Python Flask",
      purpose: "Connect Moodle, Canvas, and Google Classroom workflows.",
      status: "active",
      mode: "integration"
    },
    {
      name: "Messaging Layer",
      stack: "Apache Kafka",
      purpose: pipeline.messaging.detail,
      status: pipeline.messaging.mode,
      mode: pipeline.messaging.mode
    },
    {
      name: "Storage Layer",
      stack: "Apache Cassandra",
      purpose: pipeline.storage.detail,
      status: pipeline.storage.mode,
      mode: pipeline.storage.mode
    }
  ];
}

function fallbackStudentSummary(studentId) {
  const student = FALLBACK_STATE.students.find((item) => item.id === studentId);
  if (!student) {
    return null;
  }

  const events = FALLBACK_STATE.events
    .filter((item) => item.studentId === studentId)
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));

  const topicScores = Object.entries(
    events.reduce((accumulator, event) => {
      accumulator[event.topic] = accumulator[event.topic] || [];
      accumulator[event.topic].push(event.scorePct);
      return accumulator;
    }, {})
  ).map(([topic, scores]) => ({
    topic,
    score: safeMean(scores),
    status: scoreBand(safeMean(scores))
  }));

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
    recommendedPath.push(
      `Promote ${orderedTopics[orderedTopics.length - 1].topic.toLowerCase()} to the advanced-learning pathway.`
    );
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

function fallbackFeedback(studentId) {
  const summary = fallbackStudentSummary(studentId);
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

function fallbackClassOverview() {
  const studentSummaries = FALLBACK_STATE.students.map((student) => fallbackStudentSummary(student.id)).filter(Boolean);
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
    connectorsOnline: FALLBACK_STATE.connectors.filter((item) => item.status === "connected").length,
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
    serviceTopology: serviceTopologyFallback()
  };
}

function fallbackTeacherDashboard(studentId) {
  const overview = fallbackClassOverview();
  const selectedId = studentId || overview.studentOptions[0]?.id;
  return {
    overview,
    selectedStudent: fallbackStudentSummary(selectedId),
    selectedFeedback: fallbackFeedback(selectedId),
    connectors: [...FALLBACK_STATE.connectors],
    pipeline: pipelineFallback()
  };
}

function fallbackAdminDashboard() {
  return {
    counts: {
      users: FALLBACK_STATE.users.length,
      students: FALLBACK_STATE.users.filter((user) => user.role === "student").length,
      teachers: FALLBACK_STATE.users.filter((user) => user.role === "teacher").length,
      admins: FALLBACK_STATE.users.filter((user) => user.role === "admin").length,
      events: FALLBACK_STATE.events.length,
      connectedLms: FALLBACK_STATE.connectors.filter((item) => item.status === "connected").length
    },
    users: FALLBACK_STATE.users.map(publicUser),
    connectors: [...FALLBACK_STATE.connectors],
    recentEvents: [...FALLBACK_STATE.events].reverse().slice(0, 8),
    pipeline: pipelineFallback(),
    serviceTopology: serviceTopologyFallback()
  };
}

async function requestJson(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (_error) {
    return null;
  }
}

export async function login(email, password) {
  const payload = await requestJson(`${SERVICES.integration}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (payload) {
    return { ...payload, source: "backend" };
  }

  const user = FALLBACK_STATE.users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );
  if (!user) {
    return null;
  }

  return {
    token: `fallback-token-${user.id}`,
    user: publicUser(user),
    source: "fallback"
  };
}

export async function fetchDemoAccounts() {
  const payload = await requestJson(`${SERVICES.integration}/api/auth/demo-accounts`);
  if (payload?.accounts) {
    return payload.accounts;
  }
  return FALLBACK_STATE.users.map((user) => ({
    role: user.role,
    email: user.email,
    password: user.password,
    name: user.name
  }));
}

export async function fetchStudentDashboard(studentId) {
  const summary = await requestJson(`${SERVICES.processor}/api/analytics/students/${studentId}/dashboard`);
  const feedback = await requestJson(`${SERVICES.feedback}/api/feedback/students/${studentId}`);
  if (summary && feedback) {
    return { ...summary, feedback, source: "backend" };
  }

  return {
    summary: fallbackStudentSummary(studentId),
    feedback: fallbackFeedback(studentId),
    pipeline: pipelineFallback(),
    source: "fallback"
  };
}

export async function fetchTeacherDashboard(studentId) {
  const payload = await requestJson(
    `${SERVICES.visualization}/api/dashboard/teacher${studentId ? `?student_id=${studentId}` : ""}`
  );
  if (payload) {
    return { ...payload, source: "backend" };
  }
  return { ...fallbackTeacherDashboard(studentId), source: "fallback" };
}

export async function fetchAdminDashboard() {
  const payload = await requestJson(`${SERVICES.integration}/api/admin/dashboard`);
  if (payload) {
    return { ...payload, source: "backend" };
  }
  return { ...fallbackAdminDashboard(), source: "fallback" };
}

export async function createUser(payload) {
  const response = await requestJson(`${SERVICES.integration}/api/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (response?.user) {
    return { ...response.user, source: "backend" };
  }

  if (FALLBACK_STATE.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error("duplicate_email");
  }

  const user = {
    id: `fallback-user-${Date.now()}`,
    role: payload.role,
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
    studentId: payload.role === "student" ? `stu-${Date.now()}` : undefined
  };
  FALLBACK_STATE.users.push(user);
  if (payload.role === "student") {
    FALLBACK_STATE.students.push({
      id: user.studentId,
      name: payload.name,
      gradeLevel: payload.gradeLevel || "B.Tech Final Year",
      parentName: payload.parentName || "Not Assigned",
      lmsUserId: payload.lmsUserId || `LMS-${Date.now()}`
    });
  }
  return { ...publicUser(user), source: "fallback" };
}

export async function updateConnectorStatus(connectorName, updates) {
  const payload = await requestJson(`${SERVICES.integration}/api/admin/connectors/${encodeURIComponent(connectorName)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (payload?.connector) {
    return { ...payload.connector, source: "backend" };
  }

  const connector = FALLBACK_STATE.connectors.find((item) => item.name === connectorName);
  if (!connector) {
    throw new Error("connector_not_found");
  }
  Object.assign(connector, updates);
  return { ...connector, source: "fallback" };
}

export async function ingestEvent(payload) {
  const event = {
    ...payload,
    scorePct: Number(payload.scorePct),
    timeSpentMin: Number(payload.timeSpentMin),
    completionRate: Number(payload.completionRate),
    hintsUsed: Number(payload.hintsUsed || 0)
  };

  const response = await requestJson(`${SERVICES.collector}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  });
  if (response?.event) {
    return { ...response, source: "backend" };
  }

  const fallbackEvent = {
    eventId: `evt-runtime-${Date.now()}`,
    ...event
  };
  FALLBACK_STATE.events.push(fallbackEvent);
  return {
    event: fallbackEvent,
    messaging: pipelineFallback().messaging,
    storage: pipelineFallback().storage,
    source: "fallback"
  };
}

export async function fetchSystemRuntime() {
  const payload = await requestJson(`${SERVICES.integration}/api/system/runtime`);
  if (payload) {
    return { ...payload, source: "backend" };
  }
  return {
    pipeline: pipelineFallback(),
    services: serviceTopologyFallback(),
    source: "fallback"
  };
}
