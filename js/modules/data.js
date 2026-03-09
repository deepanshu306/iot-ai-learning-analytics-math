import { DATA_PATHS, TOPIC_ORDER, DIFFICULTY_ORDER } from "./constants.js";
import {
  getRuntimeUsers,
  saveRuntimeUsers,
  getRuntimeQuestions,
  saveRuntimeQuestions,
  getSessionAttempts,
  addSessionAttempt
} from "./storage.js";

const cache = new Map();

async function fetchJson(path) {
  if (cache.has(path)) {
    return structuredClone(cache.get(path));
  }

  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}.`);
  }

  const json = await response.json();
  cache.set(path, json);
  return structuredClone(json);
}

function convertArrayToBreakdown(items, order) {
  return order.reduce((accumulator, key) => {
    const item = items.find((entry) => entry.key === key);
    accumulator[key] = item
      ? {
          attempted: item.attempted,
          correct: item.correct,
          avgTimeSec: item.avgTimeSec,
          expectedTimeSec: item.expectedTimeSec
        }
      : {
          attempted: 0,
          correct: 0,
          avgTimeSec: 0,
          expectedTimeSec: 0
        };
    return accumulator;
  }, {});
}

function convertDifficultyArray(items) {
  return DIFFICULTY_ORDER.reduce((accumulator, key) => {
    const item = items.find((entry) => entry.key === key);
    accumulator[key] = item
      ? {
          attempted: item.attempted,
          correct: item.correct
        }
      : {
          attempted: 0,
          correct: 0
        };
    return accumulator;
  }, {});
}

export async function getUsers() {
  const runtimeUsers = getRuntimeUsers();
  return runtimeUsers ?? (await fetchJson(DATA_PATHS.users));
}

export async function getQuestions() {
  const runtimeQuestions = getRuntimeQuestions();
  return runtimeQuestions ?? (await fetchJson(DATA_PATHS.questions));
}

export async function getAttempts() {
  const attempts = await fetchJson(DATA_PATHS.attempts);
  return [...attempts, ...getSessionAttempts()];
}

export async function saveUsers(users) {
  saveRuntimeUsers(users);
  return users;
}

export async function saveQuestions(questions) {
  saveRuntimeQuestions(questions);
  return questions;
}

export function buildAttemptFromResult(result) {
  return {
    attemptId: result.attemptId,
    userId: result.userId,
    date: result.date,
    totalQuestions: result.totalQuestions,
    score: result.score,
    accuracy: result.accuracy,
    avgTimeSec: result.avgTimeSec,
    topicBreakdown: convertArrayToBreakdown(result.topicStats, TOPIC_ORDER),
    difficultyBreakdown: convertDifficultyArray(result.difficultyStats),
    errorTags: result.errorTags,
    responses: result.responses
  };
}

export function saveSessionResult(result) {
  addSessionAttempt(buildAttemptFromResult(result));
}

export async function exportRuntimeSnapshot() {
  const [users, questions] = await Promise.all([getUsers(), getQuestions()]);
  return {
    exportedAt: new Date().toISOString(),
    users,
    questions,
    sessionAttempts: getSessionAttempts()
  };
}
