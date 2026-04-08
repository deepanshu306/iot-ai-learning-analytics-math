(function () {
  const STORAGE_KEYS = {
    activeUser: "math-lite-active-user",
    latestResult: "math-lite-latest-result",
    sessionAttempts: "math-lite-session-attempts",
    runtimeUsers: "math-lite-runtime-users",
    runtimeQuestions: "math-lite-runtime-questions",
    quiz: "math-lite-quiz",
    currentScreen: "math-lite-current-screen",
    selectedStudentId: "math-lite-selected-student-id"
  };

  const TOPIC_ORDER = ["algebra", "trigonometry", "calculus"];
  const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

  const TOPIC_LABELS = {
    algebra: "Algebra",
    trigonometry: "Trigonometry",
    calculus: "Calculus"
  };

  const DIFFICULTY_LABELS = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  };

  const ERROR_LABELS = {
    "equation-balancing": "Equation balancing",
    "quadratic-factorisation": "Quadratic factorisation",
    "identity-selection": "Identity selection",
    "ap-formula": "Arithmetic progression formula",
    "special-angle": "Special-angle recall",
    "reference-angle": "Reference-angle recall",
    "trig-identity": "Trig identity selection",
    "double-angle": "Double-angle conversion",
    "power-rule": "Power rule",
    "integration-bounds": "Integration bounds",
    "limit-evaluation": "Limit simplification",
    "chain-rule": "Chain rule"
  };

  const CHART_COLORS = {
    primary: "#1e88ff",
    primaryFill: "rgba(30, 136, 255, 0.18)",
    accent: "#ff6b57",
    palette: ["#1e88ff", "#ffb703", "#ff6b57", "#36cfc9", "#7b61ff"]
  };

  const SEED_USERS = [
    {
      id: "stu-aanya",
      role: "student",
      name: "Aanya Sharma",
      email: "aanya@student.demo",
      password: "math123",
      classGroup: "Section A"
    },
    {
      id: "stu-rohan",
      role: "student",
      name: "Rohan Mehta",
      email: "rohan@student.demo",
      password: "math123",
      classGroup: "Section A"
    },
    {
      id: "stu-kavya",
      role: "student",
      name: "Kavya Iyer",
      email: "kavya@student.demo",
      password: "math123",
      classGroup: "Section B"
    },
    {
      id: "teach-nidhi",
      role: "teacher",
      name: "Dr. Nidhi Rao",
      email: "nidhi@teacher.demo",
      password: "teach123",
      classGroup: "Mathematics Department"
    },
    {
      id: "admin-system",
      role: "admin",
      name: "Systems Admin",
      email: "admin@demo.local",
      password: "admin123",
      classGroup: "Operations"
    }
  ];

  const SEED_QUESTIONS = [
    {
      id: "alg-01",
      topic: "algebra",
      subtopic: "Linear Equations",
      difficulty: "easy",
      type: "mcq",
      prompt: "If 3x + 5 = 20, what is the value of x?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      explanation: "Subtract 5 from both sides to get 3x = 15, then divide by 3.",
      errorTag: "equation-balancing",
      expectedTimeSec: 45
    },
    {
      id: "alg-02",
      topic: "algebra",
      subtopic: "Quadratic Roots",
      difficulty: "medium",
      type: "numeric",
      prompt: "One root of x^2 - 7x + 12 = 0 is 3. Enter the other root.",
      correctAnswer: 4,
      tolerance: 0,
      explanation: "The quadratic factors as (x - 3)(x - 4) = 0.",
      errorTag: "quadratic-factorisation",
      expectedTimeSec: 65
    },
    {
      id: "alg-03",
      topic: "algebra",
      subtopic: "Identities",
      difficulty: "medium",
      type: "mcq",
      prompt: "Which expression is equal to a^2 - b^2?",
      options: ["(a - b)^2", "(a + b)^2", "(a - b)(a + b)", "2ab"],
      correctAnswer: "(a - b)(a + b)",
      explanation: "The difference of squares identity is a^2 - b^2 = (a - b)(a + b).",
      errorTag: "identity-selection",
      expectedTimeSec: 55
    },
    {
      id: "alg-04",
      topic: "algebra",
      subtopic: "Arithmetic Progression",
      difficulty: "hard",
      type: "numeric",
      prompt: "The first term of an AP is 7 and the common difference is 3. Enter the 10th term.",
      correctAnswer: 34,
      tolerance: 0,
      explanation: "Use a_n = a + (n - 1)d = 7 + 9 × 3.",
      errorTag: "ap-formula",
      expectedTimeSec: 75
    },
    {
      id: "tri-01",
      topic: "trigonometry",
      subtopic: "Special Angles",
      difficulty: "easy",
      type: "mcq",
      prompt: "What is the value of sin 30 degrees?",
      options: ["0", "1/2", "sqrt(3)/2", "1"],
      correctAnswer: "1/2",
      explanation: "sin 30 degrees = 1/2 from the standard special-angle table.",
      errorTag: "special-angle",
      expectedTimeSec: 40
    },
    {
      id: "tri-02",
      topic: "trigonometry",
      subtopic: "Tangent Values",
      difficulty: "medium",
      type: "numeric",
      prompt: "Enter the acute angle in degrees for which tan(theta) = 1.",
      correctAnswer: 45,
      tolerance: 0,
      explanation: "tan 45 degrees = 1.",
      errorTag: "reference-angle",
      expectedTimeSec: 50
    },
    {
      id: "tri-03",
      topic: "trigonometry",
      subtopic: "Identities",
      difficulty: "medium",
      type: "mcq",
      prompt: "Which identity is always true?",
      options: [
        "sin^2(theta) - cos^2(theta) = 1",
        "sin^2(theta) + cos^2(theta) = 1",
        "tan(theta) = sin(theta)cos(theta)",
        "sec(theta) = cos(theta)"
      ],
      correctAnswer: "sin^2(theta) + cos^2(theta) = 1",
      explanation: "This is the fundamental Pythagorean identity.",
      errorTag: "trig-identity",
      expectedTimeSec: 60
    },
    {
      id: "tri-04",
      topic: "trigonometry",
      subtopic: "Double Angle",
      difficulty: "hard",
      type: "numeric",
      prompt: "If x = 45 degrees, enter the value of 2sin(x)cos(x).",
      correctAnswer: 1,
      tolerance: 0.01,
      explanation: "2sin(x)cos(x) = sin(2x), so the value is sin 90 degrees = 1.",
      errorTag: "double-angle",
      expectedTimeSec: 80
    },
    {
      id: "cal-01",
      topic: "calculus",
      subtopic: "Derivatives",
      difficulty: "medium",
      type: "numeric",
      prompt: "Enter the derivative of x^3 evaluated at x = 2.",
      correctAnswer: 12,
      tolerance: 0,
      explanation: "d/dx(x^3) = 3x^2 and 3(2^2) = 12.",
      errorTag: "power-rule",
      expectedTimeSec: 60
    },
    {
      id: "cal-02",
      topic: "calculus",
      subtopic: "Definite Integrals",
      difficulty: "hard",
      type: "numeric",
      prompt: "Evaluate the integral of 2x from x = 0 to x = 3.",
      correctAnswer: 9,
      tolerance: 0,
      explanation: "The antiderivative is x^2 and x^2 from 0 to 3 gives 9.",
      errorTag: "integration-bounds",
      expectedTimeSec: 85
    },
    {
      id: "cal-03",
      topic: "calculus",
      subtopic: "Limits",
      difficulty: "medium",
      type: "mcq",
      prompt: "What is the limit of (x^2 - 1)/(x - 1) as x approaches 1?",
      options: ["0", "1", "2", "undefined"],
      correctAnswer: "2",
      explanation: "Factor the numerator as (x - 1)(x + 1), cancel, then substitute x = 1.",
      errorTag: "limit-evaluation",
      expectedTimeSec: 70
    },
    {
      id: "cal-04",
      topic: "calculus",
      subtopic: "Chain Rule",
      difficulty: "hard",
      type: "mcq",
      prompt: "Which is the derivative of (3x + 1)^2?",
      options: ["6x + 2", "2(3x + 1)", "6(3x + 1)", "9x^2 + 6x"],
      correctAnswer: "6(3x + 1)",
      explanation: "Apply the chain rule: 2(3x + 1) × 3 = 6(3x + 1).",
      errorTag: "chain-rule",
      expectedTimeSec: 75
    }
  ];

  const SEED_ATTEMPTS = [
    {
      attemptId: "ATT-2026-001",
      userId: "stu-aanya",
      date: "2026-01-28",
      totalQuestions: 12,
      score: 8,
      accuracy: 66.67,
      avgTimeSec: 57,
      topicBreakdown: {
        algebra: { attempted: 4, correct: 3, avgTimeSec: 49, expectedTimeSec: 60 },
        trigonometry: { attempted: 4, correct: 2, avgTimeSec: 61, expectedTimeSec: 58 },
        calculus: { attempted: 4, correct: 3, avgTimeSec: 62, expectedTimeSec: 73 }
      },
      difficultyBreakdown: {
        easy: { attempted: 2, correct: 2 },
        medium: { attempted: 6, correct: 4 },
        hard: { attempted: 4, correct: 2 }
      },
      errorTags: ["double-angle", "double-angle", "integration-bounds"],
      responses: [
        { questionId: "tri-04", answer: "0.5", isCorrect: false, timeSpentSec: 90, subtopic: "Double Angle", errorTag: "double-angle" },
        { questionId: "cal-02", answer: "6", isCorrect: false, timeSpentSec: 92, subtopic: "Definite Integrals", errorTag: "integration-bounds" },
        { questionId: "alg-01", answer: "5", isCorrect: true, timeSpentSec: 38, subtopic: "Linear Equations", errorTag: null }
      ]
    },
    {
      attemptId: "ATT-2026-002",
      userId: "stu-aanya",
      date: "2026-02-24",
      totalQuestions: 12,
      score: 10,
      accuracy: 83.33,
      avgTimeSec: 52,
      topicBreakdown: {
        algebra: { attempted: 4, correct: 4, avgTimeSec: 46, expectedTimeSec: 60 },
        trigonometry: { attempted: 4, correct: 3, avgTimeSec: 53, expectedTimeSec: 58 },
        calculus: { attempted: 4, correct: 3, avgTimeSec: 56, expectedTimeSec: 73 }
      },
      difficultyBreakdown: {
        easy: { attempted: 2, correct: 2 },
        medium: { attempted: 6, correct: 5 },
        hard: { attempted: 4, correct: 3 }
      },
      errorTags: ["double-angle", "chain-rule"],
      responses: [
        { questionId: "alg-04", answer: "34", isCorrect: true, timeSpentSec: 61, subtopic: "Arithmetic Progression", errorTag: null },
        { questionId: "tri-04", answer: "0.7", isCorrect: false, timeSpentSec: 82, subtopic: "Double Angle", errorTag: "double-angle" },
        { questionId: "cal-04", answer: "2(3x + 1)", isCorrect: false, timeSpentSec: 77, subtopic: "Chain Rule", errorTag: "chain-rule" }
      ]
    },
    {
      attemptId: "ATT-2026-003",
      userId: "stu-rohan",
      date: "2026-02-03",
      totalQuestions: 12,
      score: 5,
      accuracy: 41.67,
      avgTimeSec: 69,
      topicBreakdown: {
        algebra: { attempted: 4, correct: 2, avgTimeSec: 65, expectedTimeSec: 60 },
        trigonometry: { attempted: 4, correct: 1, avgTimeSec: 72, expectedTimeSec: 58 },
        calculus: { attempted: 4, correct: 2, avgTimeSec: 70, expectedTimeSec: 73 }
      },
      difficultyBreakdown: {
        easy: { attempted: 2, correct: 1 },
        medium: { attempted: 6, correct: 3 },
        hard: { attempted: 4, correct: 1 }
      },
      errorTags: ["special-angle", "double-angle", "double-angle", "quadratic-factorisation"],
      responses: [
        { questionId: "tri-01", answer: "sqrt(3)/2", isCorrect: false, timeSpentSec: 48, subtopic: "Special Angles", errorTag: "special-angle" },
        { questionId: "tri-04", answer: "0", isCorrect: false, timeSpentSec: 95, subtopic: "Double Angle", errorTag: "double-angle" },
        { questionId: "alg-02", answer: "3", isCorrect: false, timeSpentSec: 72, subtopic: "Quadratic Roots", errorTag: "quadratic-factorisation" }
      ]
    },
    {
      attemptId: "ATT-2026-004",
      userId: "stu-rohan",
      date: "2026-03-02",
      totalQuestions: 12,
      score: 6,
      accuracy: 50,
      avgTimeSec: 64,
      topicBreakdown: {
        algebra: { attempted: 4, correct: 3, avgTimeSec: 59, expectedTimeSec: 60 },
        trigonometry: { attempted: 4, correct: 1, avgTimeSec: 71, expectedTimeSec: 58 },
        calculus: { attempted: 4, correct: 2, avgTimeSec: 63, expectedTimeSec: 73 }
      },
      difficultyBreakdown: {
        easy: { attempted: 2, correct: 2 },
        medium: { attempted: 6, correct: 3 },
        hard: { attempted: 4, correct: 1 }
      },
      errorTags: ["double-angle", "double-angle", "chain-rule"],
      responses: [
        { questionId: "tri-04", answer: "0.2", isCorrect: false, timeSpentSec: 89, subtopic: "Double Angle", errorTag: "double-angle" },
        { questionId: "cal-04", answer: "6x + 2", isCorrect: false, timeSpentSec: 68, subtopic: "Chain Rule", errorTag: "chain-rule" },
        { questionId: "alg-01", answer: "5", isCorrect: true, timeSpentSec: 41, subtopic: "Linear Equations", errorTag: null }
      ]
    },
    {
      attemptId: "ATT-2026-005",
      userId: "stu-kavya",
      date: "2026-02-07",
      totalQuestions: 12,
      score: 7,
      accuracy: 58.33,
      avgTimeSec: 61,
      topicBreakdown: {
        algebra: { attempted: 4, correct: 2, avgTimeSec: 63, expectedTimeSec: 60 },
        trigonometry: { attempted: 4, correct: 3, avgTimeSec: 55, expectedTimeSec: 58 },
        calculus: { attempted: 4, correct: 2, avgTimeSec: 66, expectedTimeSec: 73 }
      },
      difficultyBreakdown: {
        easy: { attempted: 2, correct: 2 },
        medium: { attempted: 6, correct: 4 },
        hard: { attempted: 4, correct: 1 }
      },
      errorTags: ["ap-formula", "integration-bounds", "integration-bounds"],
      responses: [
        { questionId: "alg-04", answer: "31", isCorrect: false, timeSpentSec: 80, subtopic: "Arithmetic Progression", errorTag: "ap-formula" },
        { questionId: "cal-02", answer: "3", isCorrect: false, timeSpentSec: 90, subtopic: "Definite Integrals", errorTag: "integration-bounds" },
        { questionId: "tri-01", answer: "1/2", isCorrect: true, timeSpentSec: 34, subtopic: "Special Angles", errorTag: null }
      ]
    },
    {
      attemptId: "ATT-2026-006",
      userId: "stu-kavya",
      date: "2026-03-01",
      totalQuestions: 12,
      score: 9,
      accuracy: 75,
      avgTimeSec: 56,
      topicBreakdown: {
        algebra: { attempted: 4, correct: 3, avgTimeSec: 54, expectedTimeSec: 60 },
        trigonometry: { attempted: 4, correct: 3, avgTimeSec: 52, expectedTimeSec: 58 },
        calculus: { attempted: 4, correct: 3, avgTimeSec: 61, expectedTimeSec: 73 }
      },
      difficultyBreakdown: {
        easy: { attempted: 2, correct: 2 },
        medium: { attempted: 6, correct: 5 },
        hard: { attempted: 4, correct: 2 }
      },
      errorTags: ["integration-bounds", "chain-rule"],
      responses: [
        { questionId: "alg-04", answer: "34", isCorrect: true, timeSpentSec: 63, subtopic: "Arithmetic Progression", errorTag: null },
        { questionId: "cal-02", answer: "6", isCorrect: false, timeSpentSec: 86, subtopic: "Definite Integrals", errorTag: "integration-bounds" },
        { questionId: "cal-04", answer: "2(3x + 1)", isCorrect: false, timeSpentSec: 72, subtopic: "Chain Rule", errorTag: "chain-rule" }
      ]
    }
  ];

  const state = {
    users: [],
    questions: [],
    sessionAttempts: [],
    activeUser: null,
    latestResult: null,
    quiz: null,
    currentScreen: "login",
    selectedStudentId: null,
    charts: {}
  };

  const byId = (id) => document.getElementById(id);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readStorage(key, fallback) {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Unable to parse storage value for ${key}.`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  function removeStorage(key) {
    sessionStorage.removeItem(key);
  }

  function formatDateLabel(value) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(value));
  }

  function formatSeconds(value) {
    const seconds = Math.max(0, Math.round(Number(value || 0)));
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setMessage(id, message, tone = "neutral") {
    const element = byId(id);
    if (!element) {
      return;
    }
    element.textContent = message;
    element.className = `status-message${tone === "error" ? " error" : ""}`;
  }

  function defaultScreenForRole(role) {
    if (role === "student") {
      return "student-dashboard";
    }
    if (role === "teacher") {
      return "teacher-dashboard";
    }
    if (role === "admin") {
      return "admin-dashboard";
    }
    return "login";
  }

  function allowedScreensForRole(role) {
    if (role === "student") {
      return ["student-dashboard", "student-quiz", "student-result"];
    }
    if (role === "teacher") {
      return ["teacher-dashboard"];
    }
    if (role === "admin") {
      return ["admin-dashboard"];
    }
    return ["login"];
  }

  function persistUsers() {
    writeStorage(STORAGE_KEYS.runtimeUsers, state.users);
  }

  function persistQuestions() {
    writeStorage(STORAGE_KEYS.runtimeQuestions, state.questions);
  }

  function persistSessionAttempts() {
    writeStorage(STORAGE_KEYS.sessionAttempts, state.sessionAttempts);
  }

  function persistActiveUser() {
    if (state.activeUser) {
      writeStorage(STORAGE_KEYS.activeUser, state.activeUser);
    } else {
      removeStorage(STORAGE_KEYS.activeUser);
    }
  }

  function persistLatestResult() {
    if (state.latestResult) {
      writeStorage(STORAGE_KEYS.latestResult, state.latestResult);
    } else {
      removeStorage(STORAGE_KEYS.latestResult);
    }
  }

  function persistQuiz() {
    if (state.quiz) {
      writeStorage(STORAGE_KEYS.quiz, state.quiz);
    } else {
      removeStorage(STORAGE_KEYS.quiz);
    }
  }

  function persistCurrentScreen() {
    writeStorage(STORAGE_KEYS.currentScreen, state.currentScreen);
  }

  function persistSelectedStudent() {
    if (state.selectedStudentId) {
      writeStorage(STORAGE_KEYS.selectedStudentId, state.selectedStudentId);
    } else {
      removeStorage(STORAGE_KEYS.selectedStudentId);
    }
  }

  function loadState() {
    state.users = readStorage(STORAGE_KEYS.runtimeUsers, clone(SEED_USERS));
    state.questions = readStorage(STORAGE_KEYS.runtimeQuestions, clone(SEED_QUESTIONS));
    state.sessionAttempts = readStorage(STORAGE_KEYS.sessionAttempts, []);
    state.activeUser = readStorage(STORAGE_KEYS.activeUser, null);
    state.latestResult = readStorage(STORAGE_KEYS.latestResult, null);
    state.quiz = readStorage(STORAGE_KEYS.quiz, null);
    state.currentScreen = readStorage(STORAGE_KEYS.currentScreen, "login");
    state.selectedStudentId = readStorage(STORAGE_KEYS.selectedStudentId, null);

    if (!state.activeUser) {
      state.currentScreen = "login";
    } else if (!allowedScreensForRole(state.activeUser.role).includes(state.currentScreen)) {
      state.currentScreen = defaultScreenForRole(state.activeUser.role);
    }
  }

  function getAllAttempts() {
    return [...clone(SEED_ATTEMPTS), ...clone(state.sessionAttempts)];
  }

  function groupUsersByRole(users) {
    return {
      student: users.filter((user) => user.role === "student"),
      teacher: users.filter((user) => user.role === "teacher"),
      admin: users.filter((user) => user.role === "admin")
    };
  }

  function classifyMastery(accuracy) {
    if (accuracy >= 80) {
      return "strong";
    }
    if (accuracy >= 50) {
      return "moderate";
    }
    return "weak";
  }

  function classifyTimeEfficiency(actual, expected) {
    if (!expected) {
      return "normal";
    }
    const ratio = actual / expected;
    if (ratio < 0.8) {
      return "fast";
    }
    if (ratio > 1.2) {
      return "slow";
    }
    return "normal";
  }

  function countOccurrences(items) {
    return items.reduce((map, item) => {
      if (!item) {
        return map;
      }
      map[item] = (map[item] || 0) + 1;
      return map;
    }, {});
  }

  function topicBreakdownToArray(topicBreakdown) {
    return TOPIC_ORDER.map((key) => {
      const item = topicBreakdown?.[key] ?? {};
      const attempted = Number(item.attempted || 0);
      const correct = Number(item.correct || 0);
      const avgTimeSec = Number(item.avgTimeSec || 0);
      const expectedTimeSec = Number(item.expectedTimeSec || 0);
      const accuracy = attempted ? (correct / attempted) * 100 : 0;

      return {
        key,
        label: TOPIC_LABELS[key],
        attempted,
        correct,
        avgTimeSec,
        expectedTimeSec,
        accuracy,
        mastery: classifyMastery(accuracy),
        timeEfficiency: classifyTimeEfficiency(avgTimeSec, expectedTimeSec)
      };
    });
  }

  function difficultyBreakdownToArray(difficultyBreakdown) {
    return DIFFICULTY_ORDER.map((key) => {
      const item = difficultyBreakdown?.[key] ?? {};
      const attempted = Number(item.attempted || 0);
      const correct = Number(item.correct || 0);
      const accuracy = attempted ? (correct / attempted) * 100 : 0;
      return {
        key,
        label: DIFFICULTY_LABELS[key],
        attempted,
        correct,
        accuracy
      };
    });
  }

  function aggregateTopicStats(attempts) {
    const aggregate = TOPIC_ORDER.reduce((map, key) => {
      map[key] = {
        attempted: 0,
        correct: 0,
        actualTime: 0,
        expectedTime: 0,
        timedAttempts: 0
      };
      return map;
    }, {});

    attempts.forEach((attempt) => {
      TOPIC_ORDER.forEach((key) => {
        const item = attempt.topicBreakdown?.[key];
        if (!item) {
          return;
        }
        aggregate[key].attempted += Number(item.attempted || 0);
        aggregate[key].correct += Number(item.correct || 0);
        aggregate[key].actualTime += Number(item.avgTimeSec || 0);
        aggregate[key].expectedTime += Number(item.expectedTimeSec || 0);
        aggregate[key].timedAttempts += 1;
      });
    });

    return TOPIC_ORDER.map((key) => {
      const item = aggregate[key];
      const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
      const avgTimeSec = item.timedAttempts ? item.actualTime / item.timedAttempts : 0;
      const expectedTimeSec = item.timedAttempts ? item.expectedTime / item.timedAttempts : 0;
      return {
        key,
        label: TOPIC_LABELS[key],
        attempted: item.attempted,
        correct: item.correct,
        accuracy,
        avgTimeSec,
        expectedTimeSec,
        mastery: classifyMastery(accuracy),
        timeEfficiency: classifyTimeEfficiency(avgTimeSec, expectedTimeSec)
      };
    });
  }

  function aggregateDifficultyStats(attempts) {
    const aggregate = DIFFICULTY_ORDER.reduce((map, key) => {
      map[key] = { attempted: 0, correct: 0 };
      return map;
    }, {});

    attempts.forEach((attempt) => {
      DIFFICULTY_ORDER.forEach((key) => {
        const item = attempt.difficultyBreakdown?.[key];
        if (!item) {
          return;
        }
        aggregate[key].attempted += Number(item.attempted || 0);
        aggregate[key].correct += Number(item.correct || 0);
      });
    });

    return DIFFICULTY_ORDER.map((key) => {
      const item = aggregate[key];
      const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
      return {
        key,
        label: DIFFICULTY_LABELS[key],
        attempted: item.attempted,
        correct: item.correct,
        accuracy
      };
    });
  }

  function computeStudentAnalytics(userId, attempts) {
    const studentAttempts = attempts
      .filter((attempt) => attempt.userId === userId)
      .sort((left, right) => new Date(left.date) - new Date(right.date));

    const topicStats = aggregateTopicStats(studentAttempts);
    const difficultyStats = aggregateDifficultyStats(studentAttempts);
    const averageAccuracy = studentAttempts.length
      ? studentAttempts.reduce((sum, attempt) => sum + Number(attempt.accuracy || 0), 0) /
        studentAttempts.length
      : 0;
    const latestAttempt = studentAttempts.at(-1) ?? null;
    const repeatedErrors = Object.entries(
      countOccurrences(studentAttempts.flatMap((attempt) => attempt.errorTags || []))
    )
      .filter(([, count]) => count >= 2)
      .map(([tag, count]) => ({
        tag,
        label: ERROR_LABELS[tag] ?? tag,
        count
      }));

    return {
      attempts: studentAttempts,
      totalAttempts: studentAttempts.length,
      averageAccuracy,
      latestAccuracy: Number(latestAttempt?.accuracy || 0),
      trend: studentAttempts.map((attempt) => ({
        date: attempt.date,
        accuracy: Number(attempt.accuracy || 0)
      })),
      topicStats,
      difficultyStats,
      strongestTopic: [...topicStats].sort((left, right) => right.accuracy - left.accuracy)[0] ?? null,
      weakestTopic: [...topicStats].sort((left, right) => left.accuracy - right.accuracy)[0] ?? null,
      repeatedErrors,
      latestAttempt
    };
  }

  function computeTeacherAnalytics(users, attempts) {
    const students = users.filter((user) => user.role === "student");
    const studentIds = new Set(students.map((user) => user.id));
    const studentAttempts = attempts.filter((attempt) => studentIds.has(attempt.userId));

    const topicStats = aggregateTopicStats(studentAttempts);
    const difficultyStats = aggregateDifficultyStats(studentAttempts);
    const classAverage = studentAttempts.length
      ? studentAttempts.reduce((sum, attempt) => sum + Number(attempt.accuracy || 0), 0) /
        studentAttempts.length
      : 0;

    const groupMap = students.reduce((map, user) => {
      const group = user.classGroup || "Unassigned";
      map[group] = map[group] || [];
      const values = studentAttempts
        .filter((attempt) => attempt.userId === user.id)
        .map((attempt) => Number(attempt.accuracy || 0));
      map[group].push(...values);
      return map;
    }, {});

    const weakestGroup =
      Object.entries(groupMap)
        .map(([group, values]) => ({
          group,
          average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
        }))
        .sort((left, right) => left.average - right.average)[0] ?? null;

    const slowestTopic =
      [...topicStats].sort(
        (left, right) =>
          right.avgTimeSec / (right.expectedTimeSec || 1) -
          left.avgTimeSec / (left.expectedTimeSec || 1)
      )[0] ?? null;

    const scoreDistribution = [
      { label: "<40%", count: 0 },
      { label: "40-69%", count: 0 },
      { label: "70-84%", count: 0 },
      { label: "85%+", count: 0 }
    ];

    studentAttempts.forEach((attempt) => {
      const accuracy = Number(attempt.accuracy || 0);
      if (accuracy < 40) {
        scoreDistribution[0].count += 1;
      } else if (accuracy < 70) {
        scoreDistribution[1].count += 1;
      } else if (accuracy < 85) {
        scoreDistribution[2].count += 1;
      } else {
        scoreDistribution[3].count += 1;
      }
    });

    const attemptsTrend = Object.entries(
      studentAttempts.reduce((map, attempt) => {
        map[attempt.date] = map[attempt.date] || [];
        map[attempt.date].push(Number(attempt.accuracy || 0));
        return map;
      }, {})
    )
      .map(([date, values]) => ({
        date,
        accuracy: values.reduce((sum, value) => sum + value, 0) / values.length
      }))
      .sort((left, right) => new Date(left.date) - new Date(right.date));

    return {
      classAverage,
      topicStats,
      difficultyStats,
      slowestTopic,
      weakestGroup,
      scoreDistribution,
      attemptsTrend,
      studentProfiles: students.map((user) => ({
        user,
        analytics: computeStudentAnalytics(user.id, studentAttempts)
      }))
    };
  }

  function buildTopicStatsFromResponses(responses) {
    const map = TOPIC_ORDER.reduce((accumulator, key) => {
      accumulator[key] = {
        attempted: 0,
        correct: 0,
        totalTime: 0,
        totalExpected: 0
      };
      return accumulator;
    }, {});

    responses.forEach((response) => {
      map[response.topic].attempted += 1;
      map[response.topic].correct += response.isCorrect ? 1 : 0;
      map[response.topic].totalTime += Number(response.timeSpentSec || 0);
      map[response.topic].totalExpected += Number(response.expectedTimeSec || 0);
    });

    return TOPIC_ORDER.map((key) => {
      const item = map[key];
      const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
      const avgTimeSec = item.attempted ? item.totalTime / item.attempted : 0;
      const expectedTimeSec = item.attempted ? item.totalExpected / item.attempted : 0;
      return {
        key,
        label: TOPIC_LABELS[key],
        attempted: item.attempted,
        correct: item.correct,
        accuracy,
        avgTimeSec,
        expectedTimeSec,
        mastery: classifyMastery(accuracy),
        timeEfficiency: classifyTimeEfficiency(avgTimeSec, expectedTimeSec)
      };
    });
  }

  function buildDifficultyStatsFromResponses(responses) {
    const map = DIFFICULTY_ORDER.reduce((accumulator, key) => {
      accumulator[key] = { attempted: 0, correct: 0 };
      return accumulator;
    }, {});

    responses.forEach((response) => {
      map[response.difficulty].attempted += 1;
      map[response.difficulty].correct += response.isCorrect ? 1 : 0;
    });

    return DIFFICULTY_ORDER.map((key) => {
      const item = map[key];
      const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
      return {
        key,
        label: DIFFICULTY_LABELS[key],
        attempted: item.attempted,
        correct: item.correct,
        accuracy
      };
    });
  }

  function createPerformanceBand(accuracy) {
    if (accuracy < 40) {
      return "foundation";
    }
    if (accuracy < 70) {
      return "developing";
    }
    return "advanced";
  }

  function generateFeedback(result) {
    const feedback = [];
    const band = createPerformanceBand(result.accuracy);
    const weakTopics = result.topicStats.filter((topic) => topic.accuracy < 50);
    const strongFastTopics = result.topicStats.filter(
      (topic) => topic.accuracy >= 80 && topic.timeEfficiency === "fast"
    );

    if (band === "foundation") {
      feedback.push({
        title: "Rebuild fundamentals",
        message: `Accuracy is ${result.accuracy.toFixed(
          1
        )}%. Revise worked examples first, then attempt an easier practice set before the next full quiz.`
      });
    } else if (band === "developing") {
      feedback.push({
        title: "Targeted revision plan",
        message: `Accuracy is ${result.accuracy.toFixed(
          1
        )}%. Focus on medium-difficulty practice in the weakest topic before moving to harder questions.`
      });
    } else {
      feedback.push({
        title: "Stretch challenge",
        message: `Accuracy is ${result.accuracy.toFixed(
          1
        )}%. Move to mixed hard questions to turn strong performance into mastery.`
      });
    }

    weakTopics.forEach((topic) => {
      feedback.push({
        title: `Focus on ${topic.label}`,
        message: `${topic.label} accuracy is ${topic.accuracy.toFixed(1)}% and pace is ${
          topic.timeEfficiency
        }. Review the concept recap and solve 5 more ${topic.label.toLowerCase()} problems.`
      });
    });

    strongFastTopics.forEach((topic) => {
      feedback.push({
        title: `${topic.label} is a strength`,
        message: `${topic.label} is both strong (${topic.accuracy.toFixed(
          1
        )}%) and fast. Add one harder mixed set to keep this topic ahead of the rest.`
      });
    });

    if (result.repeatedErrors.length) {
      const repeatedError = result.repeatedErrors[0];
      feedback.push({
        title: "Repeated mistake detected",
        message: `${ERROR_LABELS[repeatedError.tag] ?? repeatedError.tag} appeared ${
          repeatedError.count
        } times across recent work. Review the correction pattern before the next attempt.`
      });
    }

    const weakestTopic = [...result.topicStats].sort((left, right) => left.accuracy - right.accuracy)[0];
    if (weakestTopic) {
      feedback.push({
        title: "Next quiz recommendation",
        message: `Start the next quiz with 5 ${weakestTopic.label.toLowerCase()} questions, then finish with 3 medium mixed problems to measure improvement.`
      });
    }

    return feedback.filter(
      (item, index, collection) =>
        collection.findIndex(
          (entry) => entry.title === item.title && entry.message === item.message
        ) === index
    ).slice(0, 5);
  }

  function generateTeacherInterventions(profile) {
    const interventions = [];
    const weakestTopic = profile.analytics.weakestTopic;
    const repeatedError = profile.analytics.repeatedErrors[0];

    if (weakestTopic) {
      interventions.push(
        `Assign a short ${weakestTopic.label.toLowerCase()} remediation set because current topic accuracy is ${weakestTopic.accuracy.toFixed(
          1
        )}%.`
      );
    }

    if (weakestTopic?.timeEfficiency === "slow") {
      interventions.push(
        `Model a timed walkthrough for ${weakestTopic.label.toLowerCase()} because solving speed is below expectation.`
      );
    }

    if (repeatedError) {
      interventions.push(
        `Address ${ERROR_LABELS[repeatedError.tag] ?? repeatedError.tag} explicitly; it has repeated ${
          repeatedError.count
        } times.`
      );
    }

    if (!interventions.length) {
      interventions.push("Maintain mixed revision and progress this learner to a higher-difficulty quiz next.");
    }

    return interventions;
  }

  function arrayToTopicBreakdown(items) {
    return items.reduce((map, item) => {
      map[item.key] = {
        attempted: item.attempted,
        correct: item.correct,
        avgTimeSec: item.avgTimeSec,
        expectedTimeSec: item.expectedTimeSec
      };
      return map;
    }, {});
  }

  function arrayToDifficultyBreakdown(items) {
    return items.reduce((map, item) => {
      map[item.key] = {
        attempted: item.attempted,
        correct: item.correct
      };
      return map;
    }, {});
  }

  function buildAttemptFromResult(result) {
    return {
      attemptId: result.attemptId,
      userId: result.userId,
      date: result.date,
      totalQuestions: result.totalQuestions,
      score: result.score,
      accuracy: result.accuracy,
      avgTimeSec: result.avgTimeSec,
      topicBreakdown: arrayToTopicBreakdown(result.topicStats),
      difficultyBreakdown: arrayToDifficultyBreakdown(result.difficultyStats),
      errorTags: result.errorTags,
      responses: result.responses
    };
  }

  function getInterleavedQuestions() {
    const buckets = {
      algebra: state.questions.filter((question) => question.topic === "algebra"),
      trigonometry: state.questions.filter((question) => question.topic === "trigonometry"),
      calculus: state.questions.filter((question) => question.topic === "calculus")
    };
    const sequence = [];

    while (buckets.algebra.length || buckets.trigonometry.length || buckets.calculus.length) {
      TOPIC_ORDER.forEach((topic) => {
        const nextQuestion = buckets[topic].shift();
        if (nextQuestion) {
          sequence.push(nextQuestion);
        }
      });
    }

    return sequence;
  }

  function createQuizState() {
    const questionIds = getInterleavedQuestions().map((question) => question.id);
    return {
      questionIds,
      currentIndex: 0,
      answers: questionIds.reduce((map, questionId) => {
        map[questionId] = "";
        return map;
      }, {}),
      timeSpentByQuestion: questionIds.reduce((map, questionId) => {
        map[questionId] = 0;
        return map;
      }, {}),
      questionEnteredAt: Date.now()
    };
  }

  function getQuizQuestions() {
    if (!state.quiz?.questionIds?.length) {
      return [];
    }

    return state.quiz.questionIds
      .map((questionId) => state.questions.find((question) => question.id === questionId))
      .filter(Boolean);
  }

  function captureQuestionTime() {
    if (state.currentScreen !== "student-quiz" || !state.quiz) {
      return;
    }

    const questions = getQuizQuestions();
    const currentQuestion = questions[state.quiz.currentIndex];
    if (!currentQuestion) {
      return;
    }

    const elapsedSeconds = Math.max(
      1,
      Math.round((Date.now() - Number(state.quiz.questionEnteredAt || Date.now())) / 1000)
    );
    state.quiz.timeSpentByQuestion[currentQuestion.id] =
      Number(state.quiz.timeSpentByQuestion[currentQuestion.id] || 0) + elapsedSeconds;
    state.quiz.questionEnteredAt = Date.now();
    persistQuiz();
  }

  function isNumericValue(value) {
    return value !== "" && !Number.isNaN(Number(value));
  }

  function validateQuizResponses(questions, answers) {
    const errors = [];
    questions.forEach((question) => {
      if (question.type !== "numeric") {
        return;
      }
      const rawAnswer = String(answers[question.id] ?? "").trim();
      if (rawAnswer && !isNumericValue(rawAnswer)) {
        errors.push(`${question.subtopic}: enter a valid numeric answer.`);
      }
    });
    return errors;
  }

  function evaluateQuiz(questions, answers, timeSpentByQuestion, previousAttempts, userId) {
    const timestamp = new Date();
    const responses = questions.map((question) => {
      const rawAnswer = String(answers[question.id] ?? "").trim();
      const answered = rawAnswer !== "";
      const isCorrect =
        answered &&
        (question.type === "mcq"
          ? rawAnswer === String(question.correctAnswer)
          : Math.abs(Number(rawAnswer) - Number(question.correctAnswer)) <=
            Number(question.tolerance || 0));

      return {
        questionId: question.id,
        prompt: question.prompt,
        subtopic: question.subtopic,
        topic: question.topic,
        difficulty: question.difficulty,
        answer: rawAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpentSec: Number(timeSpentByQuestion[question.id] || 0),
        expectedTimeSec: Number(question.expectedTimeSec || 0),
        explanation: question.explanation,
        errorTag: isCorrect ? null : question.errorTag
      };
    });

    const score = responses.filter((response) => response.isCorrect).length;
    const accuracy = questions.length ? (score / questions.length) * 100 : 0;
    const totalTimeSec = responses.reduce((sum, response) => sum + response.timeSpentSec, 0);
    const errorTags = responses.map((response) => response.errorTag).filter(Boolean);
    const historicalTags = previousAttempts.flatMap((attempt) => attempt.errorTags || []);
    const repeatedErrors = Object.entries(countOccurrences([...historicalTags, ...errorTags]))
      .filter(([, count]) => count >= 2)
      .map(([tag, count]) => ({ tag, count }));

    return {
      attemptId: `ATT-${timestamp.getTime()}`,
      date: timestamp.toISOString().slice(0, 10),
      userId,
      totalQuestions: questions.length,
      score,
      accuracy,
      totalTimeSec,
      avgTimeSec: questions.length ? totalTimeSec / questions.length : 0,
      topicStats: buildTopicStatsFromResponses(responses),
      difficultyStats: buildDifficultyStatsFromResponses(responses),
      repeatedErrors,
      errorTags,
      responses
    };
  }

  function renderLineChart(canvasId, labels, values) {
    if (typeof Chart === "undefined") {
      return;
    }
    const canvas = byId(canvasId);
    if (!canvas) {
      return;
    }
    if (state.charts[canvasId]) {
      state.charts[canvasId].destroy();
    }
    state.charts[canvasId] = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: CHART_COLORS.primary,
            backgroundColor: CHART_COLORS.primaryFill,
            pointBackgroundColor: CHART_COLORS.accent,
            pointRadius: 4,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value) => `${value}%` }
          }
        }
      }
    });
  }

  function renderBarChart(canvasId, labels, values) {
    if (typeof Chart === "undefined") {
      return;
    }
    const canvas = byId(canvasId);
    if (!canvas) {
      return;
    }
    if (state.charts[canvasId]) {
      state.charts[canvasId].destroy();
    }
    state.charts[canvasId] = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: CHART_COLORS.palette
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value) => `${value}%` }
          }
        }
      }
    });
  }

  function renderDoughnutChart(canvasId, labels, values) {
    if (typeof Chart === "undefined") {
      return;
    }
    const canvas = byId(canvasId);
    if (!canvas) {
      return;
    }
    if (state.charts[canvasId]) {
      state.charts[canvasId].destroy();
    }
    state.charts[canvasId] = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: CHART_COLORS.palette.slice(0, 4)
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  function renderTopicCards(container, topicStats) {
    container.innerHTML = topicStats.length
      ? topicStats
          .map(
            (topic) => `
              <article class="topic-card">
                <div class="topic-card-header">
                  <h3>${escapeHtml(topic.label)}</h3>
                  <span class="badge badge-${escapeHtml(topic.mastery)}">${escapeHtml(topic.mastery)}</span>
                </div>
                <p>${topic.correct}/${topic.attempted} correct</p>
                <strong>${topic.accuracy.toFixed(1)}%</strong>
                <small>${escapeHtml(topic.timeEfficiency)} pace, ${formatSeconds(topic.avgTimeSec)} average</small>
              </article>
            `
          )
          .join("")
      : `<article class="feedback-card"><p>No topic data is available yet.</p></article>`;
  }

  function renderFeedbackCards(container, items) {
    container.innerHTML = items.length
      ? items
          .map(
            (item) => `
              <article class="feedback-card">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.message)}</p>
              </article>
            `
          )
          .join("")
      : `<article class="feedback-card"><p>No feedback is available yet. Complete a quiz to generate recommendations.</p></article>`;
  }

  function renderLoginAccounts() {
    const groups = groupUsersByRole(state.users);
    byId("demoAccounts").innerHTML = Object.entries(groups)
      .map(
        ([role, members]) => `
          <section>
            <div class="section-heading">
              <div>
                <h3>${escapeHtml(role)} access</h3>
              </div>
              <span>${members.length} account(s)</span>
            </div>
            <div class="account-grid">
              ${members
                .map(
                  (user) => `
                    <button class="account-card" type="button" data-email="${escapeHtml(
                      user.email
                    )}" data-password="${escapeHtml(user.password)}">
                      <strong>${escapeHtml(user.name)}</strong>
                      <span>${escapeHtml(user.email)}</span>
                      <small>Password: ${escapeHtml(user.password)}</small>
                      <small>${escapeHtml(user.classGroup || user.role)}</small>
                    </button>
                  `
                )
                .join("")}
            </div>
          </section>
        `
      )
      .join("");
  }

  function renderNavigation() {
    const nav = byId("appNav");
    if (!state.activeUser) {
      nav.innerHTML = "";
      nav.classList.add("hidden");
      return;
    }

    const items =
      state.activeUser.role === "student"
        ? [
            { screen: "student-dashboard", label: "Dashboard" },
            { screen: "student-quiz", label: "Quiz" },
            { screen: "student-result", label: "Result" }
          ]
        : state.activeUser.role === "teacher"
        ? [{ screen: "teacher-dashboard", label: "Teacher Dashboard" }]
        : [{ screen: "admin-dashboard", label: "Admin Dashboard" }];

    nav.innerHTML = items
      .map(
        (item) => `
          <button class="nav-link ${state.currentScreen === item.screen ? "active" : ""}" type="button" data-screen="${item.screen}">
            ${escapeHtml(item.label)}
          </button>
        `
      )
      .join("");
    nav.classList.remove("hidden");
  }

  function renderUserBar() {
    const bar = byId("userBar");
    if (!state.activeUser) {
      bar.classList.add("hidden");
      return;
    }
    byId("userIdentity").textContent = `${state.activeUser.name} · ${state.activeUser.role}`;
    bar.classList.remove("hidden");
  }

  function toggleSection(sectionId, show) {
    byId(sectionId).classList.toggle("hidden", !show);
  }

  function renderStudentDashboard() {
    const analytics = computeStudentAnalytics(state.activeUser.id, getAllAttempts());
    byId("studentAvgAccuracy").textContent = `${analytics.averageAccuracy.toFixed(1)}%`;
    byId("studentLatestAccuracy").textContent = `${analytics.latestAccuracy.toFixed(1)}%`;
    byId("studentStrongestTopic").textContent = analytics.strongestTopic?.label ?? "N/A";
    byId("studentRepeatedMistakes").textContent = String(analytics.repeatedErrors.length);

    renderTopicCards(byId("studentTopicGrid"), analytics.topicStats);

    const feedbackSeed = state.latestResult?.userId === state.activeUser.id
      ? state.latestResult
      : analytics.latestAttempt
      ? {
          accuracy: Number(analytics.latestAttempt.accuracy || 0),
          topicStats: topicBreakdownToArray(analytics.latestAttempt.topicBreakdown),
          repeatedErrors: analytics.repeatedErrors
        }
      : { accuracy: 0, topicStats: [], repeatedErrors: [] };
    renderFeedbackCards(byId("studentFeedbackGrid"), generateFeedback(feedbackSeed));

    byId("studentAttemptsBody").innerHTML = analytics.attempts.length
      ? analytics.attempts
          .slice(-4)
          .reverse()
          .map(
            (attempt) => `
              <tr>
                <td>${formatDateLabel(attempt.date)}</td>
                <td>${attempt.score}/${attempt.totalQuestions}</td>
                <td>${Number(attempt.accuracy).toFixed(1)}%</td>
                <td>${Math.round(attempt.avgTimeSec)} sec</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="4">No stored attempts yet.</td></tr>`;

    renderLineChart(
      "studentTrendChart",
      analytics.trend.length ? analytics.trend.map((entry) => formatDateLabel(entry.date)) : ["No attempts"],
      analytics.trend.length ? analytics.trend.map((entry) => Number(entry.accuracy.toFixed(1))) : [0]
    );
  }

  function renderQuizPalette() {
    const container = byId("quizPalette");
    const questions = getQuizQuestions();
    container.innerHTML = questions
      .map((question, index) => {
        const answered = String(state.quiz.answers[question.id] ?? "").trim() !== "";
        const active = index === state.quiz.currentIndex;
        return `
          <button class="palette-pill ${active ? "active" : ""} ${answered ? "answered" : ""}" type="button" data-quiz-index="${index}">
            ${index + 1}
          </button>
        `;
      })
      .join("");
  }

  function renderStudentQuiz() {
    const questions = getQuizQuestions();
    if (!questions.length) {
      byId("quizQuestionPrompt").textContent = "No quiz questions are available.";
      byId("quizQuestionInput").innerHTML = `<p class="status-message error">Add questions from the admin view before starting a quiz.</p>`;
      return;
    }

    const question = questions[state.quiz.currentIndex] ?? questions[0];
    byId("quizQuestionIndex").textContent = `Question ${state.quiz.currentIndex + 1} of ${questions.length}`;
    byId("quizQuestionTopic").textContent = `${question.subtopic} · ${TOPIC_LABELS[question.topic]}`;
    byId("quizQuestionDifficulty").textContent = DIFFICULTY_LABELS[question.difficulty];
    byId("quizQuestionPrompt").textContent = question.prompt;
    byId("quizExpectedTime").textContent = formatSeconds(question.expectedTimeSec);

    const answer = String(state.quiz.answers[question.id] ?? "");
    byId("quizQuestionInput").innerHTML =
      question.type === "mcq"
        ? question.options
            .map(
              (option) => `
                <label class="option-card">
                  <input type="radio" name="quiz-answer" value="${escapeHtml(option)}" ${
                    answer === option ? "checked" : ""
                  }>
                  <span>${escapeHtml(option)}</span>
                </label>
              `
            )
            .join("")
        : `
            <label class="input-label">
              <span>Numeric answer</span>
              <input id="numericQuizAnswer" class="text-input" type="text" value="${escapeHtml(
                answer
              )}" placeholder="Enter a number">
            </label>
          `;

    byId("quizPreviousButton").disabled = state.quiz.currentIndex === 0;
    byId("quizNextButton").disabled = state.quiz.currentIndex === questions.length - 1;
    renderQuizPalette();
    updateQuizTimerDisplay();

    if (question.type === "mcq") {
      document.querySelectorAll('input[name="quiz-answer"]').forEach((input) => {
        input.addEventListener("change", (event) => {
          state.quiz.answers[question.id] = event.target.value;
          persistQuiz();
          renderQuizPalette();
        });
      });
    } else {
      byId("numericQuizAnswer").addEventListener("input", (event) => {
        state.quiz.answers[question.id] = event.target.value;
        persistQuiz();
        renderQuizPalette();
      });
    }
  }

  function renderStudentResult() {
    const result = state.latestResult?.userId === state.activeUser.id ? state.latestResult : null;

    if (!result) {
      byId("resultScoreValue").textContent = "0/0";
      byId("resultAccuracyValue").textContent = "0%";
      byId("resultTimeValue").textContent = "0m 0s";
      byId("resultErrorValue").textContent = "0";
      renderFeedbackCards(byId("resultFeedbackGrid"), []);
      byId("resultRepeatedErrors").innerHTML = "<li>No result has been generated in this session yet.</li>";
      byId("resultResponsesBody").innerHTML =
        '<tr><td colspan="6">Take a quiz to generate a detailed result table.</td></tr>';
      renderBarChart("resultTopicChart", ["No result"], [0]);
      renderDoughnutChart("resultDifficultyChart", ["No result"], [1]);
      return;
    }

    byId("resultScoreValue").textContent = `${result.score}/${result.totalQuestions}`;
    byId("resultAccuracyValue").textContent = `${result.accuracy.toFixed(1)}%`;
    byId("resultTimeValue").textContent = formatSeconds(result.totalTimeSec);
    byId("resultErrorValue").textContent = String(result.repeatedErrors.length);

    renderBarChart(
      "resultTopicChart",
      result.topicStats.map((item) => item.label),
      result.topicStats.map((item) => Number(item.accuracy.toFixed(1)))
    );
    renderDoughnutChart(
      "resultDifficultyChart",
      result.difficultyStats.map((item) => item.label),
      result.difficultyStats.map((item) => item.correct)
    );
    renderFeedbackCards(byId("resultFeedbackGrid"), result.feedback || []);

    byId("resultRepeatedErrors").innerHTML = result.repeatedErrors.length
      ? result.repeatedErrors
          .map(
            (item) =>
              `<li>${escapeHtml(ERROR_LABELS[item.tag] ?? item.tag)} repeated ${item.count} times across recent work.</li>`
          )
          .join("")
      : "<li>No repeated mistake pattern was detected in this attempt.</li>";

    byId("resultResponsesBody").innerHTML = result.responses
      .map(
        (response) => `
          <tr class="${response.isCorrect ? "row-correct" : "row-incorrect"}">
            <td>${escapeHtml(response.subtopic)}</td>
            <td>${escapeHtml(response.answer || "Unanswered")}</td>
            <td>${escapeHtml(String(response.correctAnswer))}</td>
            <td>${response.isCorrect ? "Correct" : "Review"}</td>
            <td>${formatSeconds(response.timeSpentSec)}</td>
            <td>${escapeHtml(response.explanation)}</td>
          </tr>
        `
      )
      .join("");
  }

  function renderTeacherSection() {
    const analytics = computeTeacherAnalytics(state.users, getAllAttempts());
    byId("teacherClassAverage").textContent = `${analytics.classAverage.toFixed(1)}%`;
    byId("teacherSlowestTopic").textContent = analytics.slowestTopic?.label ?? "N/A";
    byId("teacherWeakestGroup").textContent = analytics.weakestGroup?.group ?? "N/A";
    byId("teacherGroupAverage").textContent = analytics.weakestGroup
      ? `${analytics.weakestGroup.average.toFixed(1)}%`
      : "N/A";

    renderBarChart(
      "teacherTopicChart",
      analytics.topicStats.map((item) => item.label),
      analytics.topicStats.map((item) => Number(item.accuracy.toFixed(1)))
    );
    renderDoughnutChart(
      "teacherDistributionChart",
      analytics.scoreDistribution.map((item) => item.label),
      analytics.scoreDistribution.map((item) => item.count)
    );
    renderLineChart(
      "teacherTrendChart",
      analytics.attemptsTrend.map((item) => formatDateLabel(item.date)),
      analytics.attemptsTrend.map((item) => Number(item.accuracy.toFixed(1)))
    );

    if (!state.selectedStudentId || !analytics.studentProfiles.some((entry) => entry.user.id === state.selectedStudentId)) {
      state.selectedStudentId = analytics.studentProfiles[0]?.user.id ?? null;
      persistSelectedStudent();
    }

    byId("teacherStudentSelect").innerHTML = analytics.studentProfiles
      .map(
        (profile) => `
          <option value="${profile.user.id}" ${profile.user.id === state.selectedStudentId ? "selected" : ""}>
            ${escapeHtml(profile.user.name)} · ${escapeHtml(profile.user.classGroup)}
          </option>
        `
      )
      .join("");

    const profile =
      analytics.studentProfiles.find((entry) => entry.user.id === state.selectedStudentId) ??
      analytics.studentProfiles[0];
    if (!profile) {
      return;
    }

    byId("teacherStudentName").textContent = profile.user.name;
    byId("teacherStudentAccuracy").textContent = `${profile.analytics.averageAccuracy.toFixed(1)}%`;
    byId("teacherStudentAttempts").textContent = String(profile.analytics.totalAttempts);
    byId("teacherStudentWeakness").textContent = profile.analytics.weakestTopic?.label ?? "N/A";
    renderTopicCards(byId("teacherStudentTopics"), profile.analytics.topicStats);

    byId("teacherInterventions").innerHTML = generateTeacherInterventions(profile)
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    byId("teacherErrors").innerHTML = profile.analytics.repeatedErrors.length
      ? profile.analytics.repeatedErrors
          .map((item) => `<li>${escapeHtml(item.label)} repeated ${item.count} times.</li>`)
          .join("")
      : "<li>No repeated mistake pattern is currently flagged.</li>";
    byId("teacherRecentAttempts").innerHTML = profile.analytics.attempts.length
      ? profile.analytics.attempts
          .slice(-3)
          .reverse()
          .map(
            (attempt) => `
              <tr>
                <td>${formatDateLabel(attempt.date)}</td>
                <td>${attempt.score}/${attempt.totalQuestions}</td>
                <td>${Number(attempt.accuracy).toFixed(1)}%</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="3">No attempts available.</td></tr>`;
  }

  function renderAdminSection() {
    byId("adminUserCount").textContent = String(state.users.length);
    byId("adminQuestionCount").textContent = String(state.questions.length);
    byId("adminTopicCount").textContent = String(new Set(state.questions.map((item) => item.topic)).size);
    byId("adminDifficultyCount").textContent = String(
      new Set(state.questions.map((item) => item.difficulty)).size
    );

    byId("userTableBody").innerHTML = state.users
      .map(
        (user) => `
          <tr>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.classGroup)}</td>
            <td class="table-actions">
              <button class="ghost-button" type="button" data-user-edit="${user.id}">Edit</button>
              <button class="ghost-button danger" type="button" data-user-delete="${user.id}">Delete</button>
            </td>
          </tr>
        `
      )
      .join("");

    byId("questionTableBody").innerHTML = state.questions
      .map(
        (question) => `
          <tr>
            <td>${escapeHtml(question.id)}</td>
            <td>${escapeHtml(question.topic)}</td>
            <td>${escapeHtml(question.subtopic)}</td>
            <td>${escapeHtml(question.type)}</td>
            <td>${escapeHtml(question.difficulty)}</td>
            <td class="table-actions">
              <button class="ghost-button" type="button" data-question-edit="${question.id}">Edit</button>
              <button class="ghost-button danger" type="button" data-question-delete="${question.id}">Delete</button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function renderVisibility() {
    toggleSection("loginSection", !state.activeUser);
    toggleSection("studentSection", state.activeUser?.role === "student");
    toggleSection("teacherSection", state.activeUser?.role === "teacher");
    toggleSection("adminSection", state.activeUser?.role === "admin");
  }

  function renderStudentViews() {
    const isDashboard = state.currentScreen === "student-dashboard";
    const isQuiz = state.currentScreen === "student-quiz";
    const isResult = state.currentScreen === "student-result";

    toggleSection("studentDashboardView", isDashboard);
    toggleSection("studentQuizView", isQuiz);
    toggleSection("studentResultView", isResult);

    if (isDashboard) {
      renderStudentDashboard();
    } else if (isQuiz) {
      renderStudentQuiz();
    } else if (isResult) {
      renderStudentResult();
    }
  }

  function render() {
    if (state.activeUser && !allowedScreensForRole(state.activeUser.role).includes(state.currentScreen)) {
      state.currentScreen = defaultScreenForRole(state.activeUser.role);
      persistCurrentScreen();
    }

    renderNavigation();
    renderUserBar();
    renderVisibility();
    renderLoginAccounts();

    if (!state.activeUser) {
      return;
    }

    if (state.activeUser.role === "student") {
      renderStudentViews();
    } else if (state.activeUser.role === "teacher") {
      renderTeacherSection();
    } else if (state.activeUser.role === "admin") {
      renderAdminSection();
    }
  }

  function switchScreen(nextScreen) {
    if (!state.activeUser) {
      return;
    }

    if (state.currentScreen === "student-quiz" && nextScreen !== "student-quiz") {
      captureQuestionTime();
    }

    if (nextScreen === "student-quiz" && !state.quiz) {
      state.quiz = createQuizState();
      persistQuiz();
    } else if (nextScreen === "student-quiz" && !getQuizQuestions().length) {
      state.quiz = createQuizState();
      persistQuiz();
    } else if (nextScreen === "student-quiz" && state.quiz) {
      state.quiz.questionEnteredAt = Date.now();
      persistQuiz();
    }

    state.currentScreen = nextScreen;
    persistCurrentScreen();
    render();
  }

  function startNewQuiz() {
    state.quiz = createQuizState();
    persistQuiz();
    state.currentScreen = "student-quiz";
    persistCurrentScreen();
    setMessage("quizMessage", "Quiz in progress. Answers save in this session.");
    render();
  }

  function updateQuizTimerDisplay() {
    if (state.currentScreen !== "student-quiz" || !state.quiz) {
      return;
    }

    const questions = getQuizQuestions();
    const currentQuestion = questions[state.quiz.currentIndex];
    if (!currentQuestion) {
      return;
    }

    const elapsed =
      Number(state.quiz.timeSpentByQuestion[currentQuestion.id] || 0) +
      Math.max(0, Math.round((Date.now() - Number(state.quiz.questionEnteredAt || Date.now())) / 1000));
    byId("quizTimer").textContent = formatSeconds(elapsed);
  }

  function moveQuizQuestion(nextIndex) {
    const questions = getQuizQuestions();
    if (!questions.length) {
      return;
    }
    captureQuestionTime();
    state.quiz.currentIndex = Math.min(Math.max(nextIndex, 0), questions.length - 1);
    state.quiz.questionEnteredAt = Date.now();
    persistQuiz();
    renderStudentQuiz();
  }

  function submitQuiz() {
    const questions = getQuizQuestions();
    if (!questions.length) {
      setMessage("quizMessage", "No quiz questions are available.", "error");
      return;
    }

    captureQuestionTime();
    const validationErrors = validateQuizResponses(questions, state.quiz.answers);
    if (validationErrors.length) {
      setMessage("quizMessage", validationErrors[0], "error");
      return;
    }

    const previousAttempts = getAllAttempts().filter((attempt) => attempt.userId === state.activeUser.id);
    const result = evaluateQuiz(
      questions,
      state.quiz.answers,
      state.quiz.timeSpentByQuestion,
      previousAttempts,
      state.activeUser.id
    );

    result.feedback = generateFeedback(result);
    state.latestResult = result;
    state.sessionAttempts.push(buildAttemptFromResult(result));
    state.quiz = null;
    state.currentScreen = "student-result";
    persistLatestResult();
    persistSessionAttempts();
    persistQuiz();
    persistCurrentScreen();
    render();
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleLogin(event) {
    event.preventDefault();
    const email = byId("email").value.trim().toLowerCase();
    const password = byId("password").value.trim();
    const user = state.users.find(
      (entry) => entry.email.toLowerCase() === email && entry.password === password
    );

    if (!user) {
      setMessage("loginMessage", "Invalid email or password. Use one of the demo accounts.", "error");
      return;
    }

    state.activeUser = clone(user);
    state.currentScreen = defaultScreenForRole(user.role);
    persistActiveUser();
    persistCurrentScreen();
    render();
  }

  function handleLogout() {
    captureQuestionTime();
    state.activeUser = null;
    state.currentScreen = "login";
    state.quiz = null;
    state.latestResult = null;
    state.selectedStudentId = null;
    persistActiveUser();
    persistCurrentScreen();
    persistQuiz();
    persistLatestResult();
    persistSelectedStudent();
    render();
  }

  function fillUserForm(user) {
    byId("userId").value = user.id;
    byId("userName").value = user.name;
    byId("userRole").value = user.role;
    byId("userEmail").value = user.email;
    byId("userPassword").value = user.password;
    byId("userGroup").value = user.classGroup;
  }

  function resetUserForm() {
    byId("userForm").reset();
    byId("userId").value = "";
  }

  function handleUserSubmit(event) {
    event.preventDefault();
    const id = byId("userId").value || `user-${Date.now()}`;
    const nextUser = {
      id,
      name: byId("userName").value.trim(),
      role: byId("userRole").value,
      email: byId("userEmail").value.trim(),
      password: byId("userPassword").value.trim(),
      classGroup: byId("userGroup").value.trim()
    };

    if (!nextUser.name || !nextUser.email || !nextUser.password || !nextUser.classGroup) {
      setMessage("adminMessage", "User form is missing required fields.", "error");
      return;
    }

    state.users = state.users.some((user) => user.id === id)
      ? state.users.map((user) => (user.id === id ? nextUser : user))
      : [...state.users, nextUser];

    if (state.activeUser?.id === id) {
      state.activeUser = clone(nextUser);
      persistActiveUser();
    }

    persistUsers();
    resetUserForm();
    setMessage("adminMessage", "User runtime data saved for this session.");
    render();
  }

  function fillQuestionForm(question) {
    byId("questionId").value = question.id;
    byId("questionTopic").value = question.topic;
    byId("questionSubtopic").value = question.subtopic;
    byId("questionDifficulty").value = question.difficulty;
    byId("questionType").value = question.type;
    byId("questionPrompt").value = question.prompt;
    byId("questionOptions").value = (question.options || []).join(", ");
    byId("questionCorrect").value = question.correctAnswer;
    byId("questionTolerance").value = question.tolerance ?? "";
    byId("questionExplanation").value = question.explanation;
    byId("questionErrorTag").value = question.errorTag;
    byId("questionExpectedTime").value = question.expectedTimeSec;
  }

  function resetQuestionForm() {
    byId("questionForm").reset();
    byId("questionId").value = "";
  }

  function handleQuestionSubmit(event) {
    event.preventDefault();
    const type = byId("questionType").value;
    const optionsRaw = byId("questionOptions").value.trim();
    const id = byId("questionId").value || `${byId("questionTopic").value.slice(0, 3)}-${Date.now()}`;

    if (type === "mcq" && !optionsRaw) {
      setMessage("adminMessage", "MCQ questions require comma-separated options.", "error");
      return;
    }

    const nextQuestion = {
      id,
      topic: byId("questionTopic").value,
      subtopic: byId("questionSubtopic").value.trim(),
      difficulty: byId("questionDifficulty").value,
      type,
      prompt: byId("questionPrompt").value.trim(),
      options: type === "mcq" ? optionsRaw.split(",").map((item) => item.trim()).filter(Boolean) : undefined,
      correctAnswer:
        type === "numeric" ? Number(byId("questionCorrect").value) : byId("questionCorrect").value.trim(),
      tolerance:
        type === "numeric" && byId("questionTolerance").value !== ""
          ? Number(byId("questionTolerance").value)
          : undefined,
      explanation: byId("questionExplanation").value.trim(),
      errorTag: byId("questionErrorTag").value.trim(),
      expectedTimeSec: Number(byId("questionExpectedTime").value)
    };

    if (
      !nextQuestion.topic ||
      !nextQuestion.subtopic ||
      !nextQuestion.prompt ||
      !nextQuestion.explanation ||
      !nextQuestion.errorTag ||
      !nextQuestion.expectedTimeSec
    ) {
      setMessage("adminMessage", "Question form is missing required fields.", "error");
      return;
    }

    state.questions = state.questions.some((question) => question.id === id)
      ? state.questions.map((question) => (question.id === id ? nextQuestion : question))
      : [...state.questions, nextQuestion];

    persistQuestions();
    resetQuestionForm();
    setMessage("adminMessage", "Question runtime data saved for this session.");
    render();
  }

  function bindEvents() {
    byId("loginForm").addEventListener("submit", handleLogin);
    byId("logoutButton").addEventListener("click", handleLogout);

    byId("demoAccounts").addEventListener("click", (event) => {
      const button = event.target.closest(".account-card");
      if (!button) {
        return;
      }
      byId("email").value = button.dataset.email;
      byId("password").value = button.dataset.password;
      setMessage("loginMessage", "Demo credentials filled. Submit to enter the workspace.");
    });

    byId("appNav").addEventListener("click", (event) => {
      const button = event.target.closest("[data-screen]");
      if (!button) {
        return;
      }
      switchScreen(button.dataset.screen);
    });

    byId("startQuizButton").addEventListener("click", startNewQuiz);
    byId("openResultButton").addEventListener("click", () => switchScreen("student-result"));
    byId("quizPreviousButton").addEventListener("click", () => moveQuizQuestion(state.quiz.currentIndex - 1));
    byId("quizNextButton").addEventListener("click", () => moveQuizQuestion(state.quiz.currentIndex + 1));
    byId("quizSubmitButton").addEventListener("click", submitQuiz);

    byId("quizPalette").addEventListener("click", (event) => {
      const button = event.target.closest("[data-quiz-index]");
      if (!button) {
        return;
      }
      moveQuizQuestion(Number(button.dataset.quizIndex));
    });

    byId("teacherStudentSelect").addEventListener("change", (event) => {
      state.selectedStudentId = event.target.value;
      persistSelectedStudent();
      renderTeacherSection();
    });

    byId("userForm").addEventListener("submit", handleUserSubmit);
    byId("resetUserForm").addEventListener("click", resetUserForm);
    byId("questionForm").addEventListener("submit", handleQuestionSubmit);
    byId("resetQuestionForm").addEventListener("click", resetQuestionForm);

    byId("userTableBody").addEventListener("click", (event) => {
      const editId = event.target.dataset.userEdit;
      const deleteId = event.target.dataset.userDelete;

      if (editId) {
        const user = state.users.find((entry) => entry.id === editId);
        if (user) {
          fillUserForm(user);
        }
        return;
      }

      if (deleteId) {
        state.users = state.users.filter((entry) => entry.id !== deleteId);
        persistUsers();
        setMessage("adminMessage", "User removed from runtime data.");
        render();
      }
    });

    byId("questionTableBody").addEventListener("click", (event) => {
      const editId = event.target.dataset.questionEdit;
      const deleteId = event.target.dataset.questionDelete;

      if (editId) {
        const question = state.questions.find((entry) => entry.id === editId);
        if (question) {
          fillQuestionForm(question);
        }
        return;
      }

      if (deleteId) {
        state.questions = state.questions.filter((entry) => entry.id !== deleteId);
        persistQuestions();
        setMessage("adminMessage", "Question removed from runtime data.");
        render();
      }
    });

    byId("exportRuntimeButton").addEventListener("click", () => {
      downloadJson("mathematics-runtime-export.json", {
        exportedAt: new Date().toISOString(),
        users: state.users,
        questions: state.questions,
        sessionAttempts: state.sessionAttempts
      });
      setMessage("adminMessage", "Runtime JSON exported.");
    });

    window.addEventListener("beforeunload", captureQuestionTime);
    window.setInterval(updateQuizTimerDisplay, 1000);
  }

  function init() {
    loadState();
    bindEvents();
    render();
  }

  init();
})();
