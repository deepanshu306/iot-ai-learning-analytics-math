import { requireRole } from "../modules/auth.js";
import { computeStudentAnalytics, topicBreakdownToArray } from "../modules/analytics.js";
import { getAttempts } from "../modules/data.js";
import { generateFeedback } from "../modules/feedback.js";
import { renderLineChart } from "../modules/charts.js";
import {
  formatDateLabel,
  initializeShell,
  renderFeedbackCards,
  renderTopicCards
} from "../modules/ui.js";

function buildFeedbackSeed(profile) {
  if (!profile.latestAttempt) {
    return [];
  }

  return generateFeedback({
    accuracy: Number(profile.latestAttempt.accuracy || 0),
    topicStats: topicBreakdownToArray(profile.latestAttempt.topicBreakdown),
    repeatedErrors: profile.repeatedErrors
  });
}

function renderSummary(profile) {
  document.getElementById("avgAccuracy").textContent = `${profile.averageAccuracy.toFixed(1)}%`;
  document.getElementById("latestAccuracy").textContent = `${profile.latestAccuracy.toFixed(1)}%`;
  document.getElementById("strongestTopic").textContent = profile.strongestTopic?.label ?? "N/A";
  document.getElementById("repeatedMistakes").textContent = String(profile.repeatedErrors.length);
  document.getElementById("attemptCount").textContent = String(profile.totalAttempts);
  document.getElementById("latestAttemptDate").textContent = profile.latestAttempt
    ? formatDateLabel(profile.latestAttempt.date)
    : "No attempts yet";
}

function renderRecentAttempts(profile) {
  const tableBody = document.getElementById("recentAttemptsBody");
  tableBody.innerHTML = profile.attempts
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
    .join("");
}

function renderTrend(profile) {
  renderLineChart(
    "studentTrendChart",
    profile.trend.map((item) => formatDateLabel(item.date)),
    profile.trend.map((item) => Number(item.accuracy.toFixed(1))),
    "Accuracy trend"
  );
}

async function init() {
  const user = requireRole(["student"]);
  if (!user) {
    return;
  }

  initializeShell(user);
  const attempts = await getAttempts();
  const profile = computeStudentAnalytics(user.id, attempts);
  renderSummary(profile);
  renderTopicCards(document.getElementById("topicMasteryGrid"), profile.topicStats);
  renderFeedbackCards(document.getElementById("feedbackGrid"), buildFeedbackSeed(profile));
  renderRecentAttempts(profile);
  renderTrend(profile);
}

init();
