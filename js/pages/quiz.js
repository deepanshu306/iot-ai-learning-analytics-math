import { requireRole } from "../modules/auth.js";
import { getAttempts, getQuestions, saveSessionResult } from "../modules/data.js";
import { generateFeedback } from "../modules/feedback.js";
import { evaluateQuiz, validateResponses } from "../modules/quizEngine.js";
import {
  clearQuizState,
  getLatestResult,
  getQuizState,
  setLatestResult,
  setQuizState
} from "../modules/storage.js";
import { formatSeconds, initializeShell, setStatusMessage } from "../modules/ui.js";

let questions = [];
let quizState = null;
let activeQuestionStartedAt = Date.now();
let timerHandle = null;

function createDefaultQuizState(questionList) {
  return {
    currentIndex: 0,
    answers: {},
    timeSpentByQuestion: questionList.reduce((accumulator, question) => {
      accumulator[question.id] = 0;
      return accumulator;
    }, {})
  };
}

function interleaveQuestions(allQuestions) {
  const topicBuckets = {
    algebra: allQuestions.filter((question) => question.topic === "algebra"),
    trigonometry: allQuestions.filter((question) => question.topic === "trigonometry"),
    calculus: allQuestions.filter((question) => question.topic === "calculus")
  };
  const sequence = [];

  while (topicBuckets.algebra.length || topicBuckets.trigonometry.length || topicBuckets.calculus.length) {
    ["algebra", "trigonometry", "calculus"].forEach((topic) => {
      const nextQuestion = topicBuckets[topic].shift();
      if (nextQuestion) {
        sequence.push(nextQuestion);
      }
    });
  }

  return sequence;
}

function persistQuizState() {
  setQuizState(quizState);
}

function captureQuestionTime() {
  const currentQuestion = questions[quizState.currentIndex];
  if (!currentQuestion) {
    return;
  }

  const elapsedSeconds = Math.max(1, Math.round((Date.now() - activeQuestionStartedAt) / 1000));
  quizState.timeSpentByQuestion[currentQuestion.id] += elapsedSeconds;
  activeQuestionStartedAt = Date.now();
  persistQuizState();
}

function updateQuestionTimer() {
  const currentQuestion = questions[quizState.currentIndex];
  if (!currentQuestion) {
    return;
  }

  const elapsed =
    Number(quizState.timeSpentByQuestion[currentQuestion.id] || 0) +
    Math.max(0, Math.round((Date.now() - activeQuestionStartedAt) / 1000));

  document.getElementById("questionTimer").textContent = formatSeconds(elapsed);
  document.getElementById("expectedTimer").textContent = formatSeconds(currentQuestion.expectedTimeSec);
}

function renderQuestionPalette() {
  const container = document.getElementById("questionPalette");
  container.innerHTML = questions
    .map((question, index) => {
      const answered = String(quizState.answers[question.id] ?? "").trim() !== "";
      const active = quizState.currentIndex === index;
      return `
        <button class="palette-pill ${active ? "active" : ""} ${answered ? "answered" : ""}" data-index="${index}">
          ${index + 1}
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      captureQuestionTime();
      quizState.currentIndex = Number(button.dataset.index);
      persistQuizState();
      renderQuestion();
    });
  });
}

function renderQuestion() {
  const question = questions[quizState.currentIndex];
  const answer = String(quizState.answers[question.id] ?? "");
  document.getElementById("questionIndex").textContent = `Question ${quizState.currentIndex + 1} of ${questions.length}`;
  document.getElementById("questionTopic").textContent = `${question.subtopic} · ${question.topic}`;
  document.getElementById("questionDifficulty").textContent = question.difficulty;
  document.getElementById("questionPrompt").textContent = question.prompt;
  document.getElementById("questionInput").innerHTML =
    question.type === "mcq"
      ? question.options
          .map(
            (option) => `
              <label class="option-card">
                <input type="radio" name="answer" value="${option}" ${answer === option ? "checked" : ""}>
                <span>${option}</span>
              </label>
            `
          )
          .join("")
      : `
          <label class="input-label">
            <span>Numeric answer</span>
            <input id="numericAnswer" class="text-input" type="text" value="${answer}" placeholder="Enter a number">
          </label>
        `;

  document.getElementById("previousQuestion").disabled = quizState.currentIndex === 0;
  document.getElementById("nextQuestion").disabled = quizState.currentIndex === questions.length - 1;
  renderQuestionPalette();
  activeQuestionStartedAt = Date.now();
  updateQuestionTimer();
  setStatusMessage("quizMessage", "Quiz in progress. Answers save inside this session.");

  if (question.type === "mcq") {
    document.querySelectorAll('input[name="answer"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        quizState.answers[question.id] = event.target.value;
        persistQuizState();
        renderQuestionPalette();
      });
    });
  } else {
    document.getElementById("numericAnswer").addEventListener("input", (event) => {
      quizState.answers[question.id] = event.target.value;
      persistQuizState();
      renderQuestionPalette();
    });
  }
}

function bindNavigation() {
  document.getElementById("previousQuestion").addEventListener("click", () => {
    captureQuestionTime();
    quizState.currentIndex -= 1;
    persistQuizState();
    renderQuestion();
  });

  document.getElementById("nextQuestion").addEventListener("click", () => {
    captureQuestionTime();
    quizState.currentIndex += 1;
    persistQuizState();
    renderQuestion();
  });
}

async function handleSubmit(user, previousAttempts) {
  captureQuestionTime();
  const validationErrors = validateResponses(questions, quizState.answers);
  if (validationErrors.length) {
    setStatusMessage("quizMessage", validationErrors[0], "error");
    return;
  }

  const result = evaluateQuiz({
    questions,
    answers: quizState.answers,
    timeSpentByQuestion: quizState.timeSpentByQuestion,
    userId: user.id,
    previousAttempts
  });

  result.feedback = generateFeedback(result);
  setLatestResult(result);
  saveSessionResult(result);
  clearQuizState();
  window.location.href = "./result.html";
}

async function init() {
  const user = requireRole(["student"]);
  if (!user) {
    return;
  }

  initializeShell(user);
  const [allQuestions, allAttempts] = await Promise.all([getQuestions(), getAttempts()]);
  questions = interleaveQuestions(allQuestions);
  quizState = getQuizState() ?? createDefaultQuizState(questions);
  persistQuizState();
  bindNavigation();

  document.getElementById("submitQuiz").addEventListener("click", () =>
    handleSubmit(
      user,
      allAttempts.filter((attempt) => attempt.userId === user.id)
    )
  );

  const lastResult = getLatestResult();
  if (lastResult) {
    document.getElementById("viewLastResult").classList.remove("hidden");
  }
  document.getElementById("viewLastResult").addEventListener("click", () => {
    window.location.href = "./result.html";
  });

  renderQuestion();
  timerHandle = window.setInterval(updateQuestionTimer, 1000);
  window.addEventListener("beforeunload", captureQuestionTime);
}

window.addEventListener("pagehide", () => {
  if (timerHandle) {
    clearInterval(timerHandle);
  }
});

init();
