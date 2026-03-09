import { requireRole } from "../modules/auth.js";
import { exportRuntimeSnapshot, getQuestions, getUsers, saveQuestions, saveUsers } from "../modules/data.js";
import { downloadJson, escapeHtml, initializeShell, setStatusMessage } from "../modules/ui.js";

let users = [];
let questions = [];

function refreshMetrics() {
  document.getElementById("userCount").textContent = String(users.length);
  document.getElementById("questionCount").textContent = String(questions.length);
  document.getElementById("topicCount").textContent = String(new Set(questions.map((item) => item.topic)).size);
  document.getElementById("difficultyCount").textContent = String(
    new Set(questions.map((item) => item.difficulty)).size
  );
}

function renderUsers() {
  const body = document.getElementById("userTableBody");
  body.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${escapeHtml(user.name)}</td>
          <td>${escapeHtml(user.role)}</td>
          <td>${escapeHtml(user.email)}</td>
          <td>${escapeHtml(user.classGroup)}</td>
          <td class="table-actions">
            <button class="ghost-button" data-user-edit="${user.id}">Edit</button>
            <button class="ghost-button danger" data-user-delete="${user.id}">Delete</button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderQuestions() {
  const body = document.getElementById("questionTableBody");
  body.innerHTML = questions
    .map(
      (question) => `
        <tr>
          <td>${escapeHtml(question.id)}</td>
          <td>${escapeHtml(question.topic)}</td>
          <td>${escapeHtml(question.subtopic)}</td>
          <td>${escapeHtml(question.type)}</td>
          <td>${escapeHtml(question.difficulty)}</td>
          <td class="table-actions">
            <button class="ghost-button" data-question-edit="${question.id}">Edit</button>
            <button class="ghost-button danger" data-question-delete="${question.id}">Delete</button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderAll() {
  refreshMetrics();
  renderUsers();
  renderQuestions();
}

function resetUserForm() {
  document.getElementById("userForm").reset();
  document.getElementById("userId").value = "";
}

function resetQuestionForm() {
  document.getElementById("questionForm").reset();
  document.getElementById("questionId").value = "";
}

function fillUserForm(user) {
  document.getElementById("userId").value = user.id;
  document.getElementById("userName").value = user.name;
  document.getElementById("userRole").value = user.role;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userPassword").value = user.password;
  document.getElementById("userGroup").value = user.classGroup;
}

function fillQuestionForm(question) {
  document.getElementById("questionId").value = question.id;
  document.getElementById("questionTopic").value = question.topic;
  document.getElementById("questionSubtopic").value = question.subtopic;
  document.getElementById("questionDifficulty").value = question.difficulty;
  document.getElementById("questionType").value = question.type;
  document.getElementById("questionPrompt").value = question.prompt;
  document.getElementById("questionOptions").value = (question.options || []).join(", ");
  document.getElementById("questionCorrect").value = question.correctAnswer;
  document.getElementById("questionTolerance").value = question.tolerance ?? "";
  document.getElementById("questionExplanation").value = question.explanation;
  document.getElementById("questionErrorTag").value = question.errorTag;
  document.getElementById("questionExpectedTime").value = question.expectedTimeSec;
}

async function submitUserForm(event) {
  event.preventDefault();
  const id = document.getElementById("userId").value || `user-${Date.now()}`;
  const nextUser = {
    id,
    name: document.getElementById("userName").value.trim(),
    role: document.getElementById("userRole").value,
    email: document.getElementById("userEmail").value.trim(),
    password: document.getElementById("userPassword").value.trim(),
    classGroup: document.getElementById("userGroup").value.trim()
  };

  if (!nextUser.name || !nextUser.email || !nextUser.password || !nextUser.classGroup) {
    setStatusMessage("adminMessage", "User form is missing required fields.", "error");
    return;
  }

  users = users.some((user) => user.id === id)
    ? users.map((user) => (user.id === id ? nextUser : user))
    : [...users, nextUser];
  await saveUsers(users);
  renderAll();
  resetUserForm();
  setStatusMessage("adminMessage", "User runtime data saved for this session.");
}

async function submitQuestionForm(event) {
  event.preventDefault();
  const type = document.getElementById("questionType").value;
  const rawOptions = document.getElementById("questionOptions").value.trim();
  const id =
    document.getElementById("questionId").value ||
    `${document.getElementById("questionTopic").value.slice(0, 3)}-${Date.now()}`;

  if (type === "mcq" && !rawOptions) {
    setStatusMessage("adminMessage", "MCQ questions require comma-separated options.", "error");
    return;
  }

  const nextQuestion = {
    id,
    topic: document.getElementById("questionTopic").value,
    subtopic: document.getElementById("questionSubtopic").value.trim(),
    difficulty: document.getElementById("questionDifficulty").value,
    type,
    prompt: document.getElementById("questionPrompt").value.trim(),
    options: type === "mcq" ? rawOptions.split(",").map((item) => item.trim()).filter(Boolean) : undefined,
    correctAnswer:
      type === "numeric"
        ? Number(document.getElementById("questionCorrect").value)
        : document.getElementById("questionCorrect").value.trim(),
    tolerance:
      type === "numeric" && document.getElementById("questionTolerance").value !== ""
        ? Number(document.getElementById("questionTolerance").value)
        : undefined,
    explanation: document.getElementById("questionExplanation").value.trim(),
    errorTag: document.getElementById("questionErrorTag").value.trim(),
    expectedTimeSec: Number(document.getElementById("questionExpectedTime").value)
  };

  if (
    !nextQuestion.topic ||
    !nextQuestion.subtopic ||
    !nextQuestion.prompt ||
    !nextQuestion.explanation ||
    !nextQuestion.errorTag ||
    !nextQuestion.expectedTimeSec
  ) {
    setStatusMessage("adminMessage", "Question form is missing required fields.", "error");
    return;
  }

  questions = questions.some((question) => question.id === id)
    ? questions.map((question) => (question.id === id ? nextQuestion : question))
    : [...questions, nextQuestion];
  await saveQuestions(questions);
  renderAll();
  resetQuestionForm();
  setStatusMessage("adminMessage", "Question runtime data saved for this session.");
}

function bindTables() {
  document.getElementById("userTableBody").addEventListener("click", async (event) => {
    const editId = event.target.dataset.userEdit;
    const deleteId = event.target.dataset.userDelete;

    if (editId) {
      const user = users.find((entry) => entry.id === editId);
      if (user) {
        fillUserForm(user);
      }
      return;
    }

    if (deleteId) {
      users = users.filter((entry) => entry.id !== deleteId);
      await saveUsers(users);
      renderAll();
      setStatusMessage("adminMessage", "User removed from runtime data.");
    }
  });

  document.getElementById("questionTableBody").addEventListener("click", async (event) => {
    const editId = event.target.dataset.questionEdit;
    const deleteId = event.target.dataset.questionDelete;

    if (editId) {
      const question = questions.find((entry) => entry.id === editId);
      if (question) {
        fillQuestionForm(question);
      }
      return;
    }

    if (deleteId) {
      questions = questions.filter((entry) => entry.id !== deleteId);
      await saveQuestions(questions);
      renderAll();
      setStatusMessage("adminMessage", "Question removed from runtime data.");
    }
  });
}

async function exportData() {
  const payload = await exportRuntimeSnapshot();
  downloadJson("mathematics-runtime-export.json", payload);
  setStatusMessage("adminMessage", "Export ready. Runtime JSON downloaded.");
}

async function init() {
  const user = requireRole(["admin"]);
  if (!user) {
    return;
  }

  initializeShell(user);
  [users, questions] = await Promise.all([getUsers(), getQuestions()]);
  renderAll();
  bindTables();

  document.getElementById("userForm").addEventListener("submit", submitUserForm);
  document.getElementById("questionForm").addEventListener("submit", submitQuestionForm);
  document.getElementById("resetUserForm").addEventListener("click", resetUserForm);
  document.getElementById("resetQuestionForm").addEventListener("click", resetQuestionForm);
  document.getElementById("exportRuntime").addEventListener("click", exportData);
}

init();
