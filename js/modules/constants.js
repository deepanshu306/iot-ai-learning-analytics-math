export const STORAGE_KEYS = {
  activeUser: "mathematics-active-user",
  latestResult: "mathematics-latest-result",
  sessionAttempts: "mathematics-session-attempts",
  quizState: "mathematics-quiz-state",
  runtimeUsers: "mathematics-runtime-users",
  runtimeQuestions: "mathematics-runtime-questions"
};

export const DATA_PATHS = {
  users: "./data/users.json",
  questions: "./data/questions.json",
  attempts: "./data/attempts.json"
};

export const TOPIC_ORDER = ["algebra", "trigonometry", "calculus"];
export const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

export const TOPIC_LABELS = {
  algebra: "Algebra",
  trigonometry: "Trigonometry",
  calculus: "Calculus"
};

export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard"
};

export const ERROR_LABELS = {
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

export const ROLE_HOME = {
  student: "./student.html",
  teacher: "./teacher.html",
  admin: "./admin.html"
};
