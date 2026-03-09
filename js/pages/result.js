import { requireRole } from "../modules/auth.js";
import { renderBarChart, renderDoughnutChart } from "../modules/charts.js";
import { ERROR_LABELS } from "../modules/constants.js";
import { getLatestResult } from "../modules/storage.js";
import {
  escapeHtml,
  formatSeconds,
  initializeShell,
  renderFeedbackCards
} from "../modules/ui.js";

function renderSummary(result) {
  document.getElementById("scoreValue").textContent = `${result.score}/${result.totalQuestions}`;
  document.getElementById("accuracyValue").textContent = `${result.accuracy.toFixed(1)}%`;
  document.getElementById("timeValue").textContent = formatSeconds(result.totalTimeSec);
  document.getElementById("errorValue").textContent = String(result.repeatedErrors.length);
}

function renderCharts(result) {
  renderBarChart(
    "topicResultChart",
    result.topicStats.map((topic) => topic.label),
    result.topicStats.map((topic) => Number(topic.accuracy.toFixed(1))),
    "Topic accuracy"
  );

  renderDoughnutChart(
    "difficultyResultChart",
    result.difficultyStats.map((item) => item.label),
    result.difficultyStats.map((item) => item.correct)
  );
}

function renderResponseTable(result) {
  const body = document.getElementById("responseTableBody");
  body.innerHTML = result.responses
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

function renderRepeatedErrors(result) {
  const list = document.getElementById("repeatedErrorList");
  if (!result.repeatedErrors.length) {
    list.innerHTML = "<li>No repeated mistake pattern was detected in this attempt.</li>";
    return;
  }

  list.innerHTML = result.repeatedErrors
    .map(
      (item) =>
        `<li>${escapeHtml(ERROR_LABELS[item.tag] ?? item.tag)} repeated ${item.count} times across recent work.</li>`
    )
    .join("");
}

function init() {
  const user = requireRole(["student"]);
  if (!user) {
    return;
  }

  const result = getLatestResult();
  if (!result) {
    window.location.href = "./student.html";
    return;
  }

  initializeShell(user);
  renderSummary(result);
  renderCharts(result);
  renderResponseTable(result);
  renderRepeatedErrors(result);
  renderFeedbackCards(document.getElementById("resultFeedbackGrid"), result.feedback || []);
}

init();
