import { requireRole } from "../modules/auth.js";
import { computeTeacherAnalytics } from "../modules/analytics.js";
import { renderBarChart, renderDoughnutChart, renderLineChart } from "../modules/charts.js";
import { getAttempts, getUsers } from "../modules/data.js";
import { generateTeacherInterventions } from "../modules/feedback.js";
import {
  escapeHtml,
  formatDateLabel,
  initializeShell,
  renderTopicCards
} from "../modules/ui.js";

function renderHeadlineMetrics(analytics) {
  document.getElementById("classAverage").textContent = `${analytics.classAverage.toFixed(1)}%`;
  document.getElementById("slowestTopic").textContent = analytics.slowestTopic?.label ?? "N/A";
  document.getElementById("weakestGroup").textContent = analytics.weakestGroup?.group ?? "N/A";
  document.getElementById("groupAverage").textContent = analytics.weakestGroup
    ? `${analytics.weakestGroup.average.toFixed(1)}%`
    : "N/A";
}

function renderCharts(analytics) {
  renderBarChart(
    "teacherTopicChart",
    analytics.topicStats.map((item) => item.label),
    analytics.topicStats.map((item) => Number(item.accuracy.toFixed(1))),
    "Class topic accuracy"
  );

  renderDoughnutChart(
    "teacherDistributionChart",
    analytics.scoreDistribution.map((item) => item.label),
    analytics.scoreDistribution.map((item) => item.count)
  );

  renderLineChart(
    "teacherTrendChart",
    analytics.attemptsTrend.map((item) => formatDateLabel(item.date)),
    analytics.attemptsTrend.map((item) => Number(item.accuracy.toFixed(1))),
    "Average attempt accuracy"
  );
}

function renderStudentProfile(profile) {
  document.getElementById("studentDrilldownName").textContent = profile.user.name;
  document.getElementById("studentDrilldownAccuracy").textContent = `${profile.analytics.averageAccuracy.toFixed(
    1
  )}%`;
  document.getElementById("studentDrilldownAttempts").textContent = String(profile.analytics.totalAttempts);
  document.getElementById("studentDrilldownWeakness").textContent =
    profile.analytics.weakestTopic?.label ?? "N/A";

  renderTopicCards(document.getElementById("teacherTopicCards"), profile.analytics.topicStats);

  const interventionList = document.getElementById("teacherInterventions");
  interventionList.innerHTML = generateTeacherInterventions(profile)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const errorList = document.getElementById("teacherErrors");
  errorList.innerHTML = profile.analytics.repeatedErrors.length
    ? profile.analytics.repeatedErrors
        .map(
          (item) =>
            `<li>${escapeHtml(item.label)} repeated ${item.count} times across stored attempts.</li>`
        )
        .join("")
    : "<li>No repeated mistake pattern is currently flagged.</li>";

  const recentBody = document.getElementById("teacherRecentAttempts");
  recentBody.innerHTML = profile.analytics.attempts
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
    .join("");
}

async function init() {
  const user = requireRole(["teacher"]);
  if (!user) {
    return;
  }

  initializeShell(user);
  const [users, attempts] = await Promise.all([getUsers(), getAttempts()]);
  const analytics = computeTeacherAnalytics(users, attempts);

  renderHeadlineMetrics(analytics);
  renderCharts(analytics);

  const selector = document.getElementById("studentSelect");
  selector.innerHTML = analytics.studentProfiles
    .map(
      (profile) =>
        `<option value="${profile.user.id}">${escapeHtml(profile.user.name)} · ${escapeHtml(
          profile.user.classGroup
        )}</option>`
    )
    .join("");

  const renderSelectedProfile = () => {
    const profile =
      analytics.studentProfiles.find((entry) => entry.user.id === selector.value) ??
      analytics.studentProfiles[0];
    if (profile) {
      renderStudentProfile(profile);
    }
  };

  selector.addEventListener("change", renderSelectedProfile);
  selector.value = analytics.studentProfiles[0]?.user.id ?? "";
  renderSelectedProfile();
}

init();
