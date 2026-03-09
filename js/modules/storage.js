import { STORAGE_KEYS } from "./constants.js";

function readJSON(key, fallback) {
  const raw = sessionStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Unable to parse session data for ${key}.`, error);
    return fallback;
  }
}

function writeJSON(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getActiveUser() {
  return readJSON(STORAGE_KEYS.activeUser, null);
}

export function setActiveUser(user) {
  writeJSON(STORAGE_KEYS.activeUser, user);
}

export function clearActiveUser() {
  sessionStorage.removeItem(STORAGE_KEYS.activeUser);
}

export function getLatestResult() {
  return readJSON(STORAGE_KEYS.latestResult, null);
}

export function setLatestResult(result) {
  writeJSON(STORAGE_KEYS.latestResult, result);
}

export function clearLatestResult() {
  sessionStorage.removeItem(STORAGE_KEYS.latestResult);
}

export function getSessionAttempts() {
  return readJSON(STORAGE_KEYS.sessionAttempts, []);
}

export function saveSessionAttempts(attempts) {
  writeJSON(STORAGE_KEYS.sessionAttempts, attempts);
}

export function addSessionAttempt(attempt) {
  const attempts = getSessionAttempts();
  attempts.push(attempt);
  saveSessionAttempts(attempts);
}

export function getQuizState() {
  return readJSON(STORAGE_KEYS.quizState, null);
}

export function setQuizState(quizState) {
  writeJSON(STORAGE_KEYS.quizState, quizState);
}

export function clearQuizState() {
  sessionStorage.removeItem(STORAGE_KEYS.quizState);
}

export function getRuntimeUsers() {
  return readJSON(STORAGE_KEYS.runtimeUsers, null);
}

export function saveRuntimeUsers(users) {
  writeJSON(STORAGE_KEYS.runtimeUsers, users);
}

export function getRuntimeQuestions() {
  return readJSON(STORAGE_KEYS.runtimeQuestions, null);
}

export function saveRuntimeQuestions(questions) {
  writeJSON(STORAGE_KEYS.runtimeQuestions, questions);
}

export function clearSessionApplicationState() {
  clearLatestResult();
  clearQuizState();
  clearActiveUser();
}
