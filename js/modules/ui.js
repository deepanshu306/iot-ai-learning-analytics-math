import { logout } from "./auth.js";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatDateLabel(value) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatSeconds(totalSeconds) {
  const seconds = Math.max(0, Math.round(Number(totalSeconds || 0)));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
}

export function initializeShell(user) {
  document.querySelectorAll("[data-user-name]").forEach((node) => {
    node.textContent = user.name;
  });
  document.querySelectorAll("[data-role-label]").forEach((node) => {
    node.textContent = user.role;
  });
  document.querySelectorAll("[data-class-group]").forEach((node) => {
    node.textContent = user.classGroup || "Mathematics";
  });
  document.querySelectorAll("[data-today]").forEach((node) => {
    node.textContent = formatDateLabel(new Date());
  });

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", logout);
  });
}

export function setStatusMessage(targetId, message, tone = "neutral") {
  const element = document.getElementById(targetId);
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `status-message ${tone}`;
}

export function renderTopicCards(container, topicStats) {
  if (!container) {
    return;
  }

  container.innerHTML = topicStats
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
    .join("");
}

export function renderFeedbackCards(container, feedback) {
  if (!container) {
    return;
  }

  container.innerHTML = feedback
    .map(
      (item) => `
        <article class="feedback-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.message)}</p>
        </article>
      `
    )
    .join("");
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
