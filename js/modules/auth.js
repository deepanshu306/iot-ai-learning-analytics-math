import { ROLE_HOME } from "./constants.js";
import { getUsers } from "./data.js";
import {
  getActiveUser,
  setActiveUser,
  clearActiveUser,
  clearLatestResult,
  clearQuizState
} from "./storage.js";

export async function login(email, password) {
  const users = await getUsers();
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === email.trim().toLowerCase() &&
      entry.password === password.trim()
  );

  if (!user) {
    return null;
  }

  setActiveUser(user);
  return user;
}

export function getCurrentUser() {
  return getActiveUser();
}

export function logout() {
  clearActiveUser();
  clearLatestResult();
  clearQuizState();
  window.location.href = "./index.html";
}

export function redirectToRoleHome(user) {
  window.location.href = ROLE_HOME[user.role] ?? "./index.html";
}

export function requireRole(roles) {
  const user = getCurrentUser();

  if (!user || !roles.includes(user.role)) {
    window.location.href = "./index.html";
    return null;
  }

  return user;
}
