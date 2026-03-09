import {
  buildDifficultyStatsFromResponses,
  buildTopicStatsFromResponses,
  countOccurrences
} from "./analytics.js";

function isNumericValue(value) {
  return value !== "" && !Number.isNaN(Number(value));
}

function isCorrectNumeric(answer, correctAnswer, tolerance = 0) {
  return Math.abs(Number(answer) - Number(correctAnswer)) <= Number(tolerance || 0);
}

export function validateResponses(questions, answers) {
  const errors = [];

  questions.forEach((question) => {
    if (question.type !== "numeric") {
      return;
    }

    const rawAnswer = String(answers[question.id] ?? "").trim();
    if (rawAnswer && !isNumericValue(rawAnswer)) {
      errors.push(`${question.subtopic}: enter a valid numeric answer.`);
    }
  });

  return errors;
}

export function evaluateQuiz({ questions, answers, timeSpentByQuestion, userId, previousAttempts = [] }) {
  const timestamp = new Date();
  const responses = questions.map((question) => {
    const rawAnswer = String(answers[question.id] ?? "").trim();
    const numericAnswer = question.type === "numeric" ? Number(rawAnswer) : null;
    const answered = rawAnswer !== "";
    const isCorrect =
      answered &&
      (question.type === "mcq"
        ? rawAnswer === String(question.correctAnswer)
        : isCorrectNumeric(numericAnswer, question.correctAnswer, question.tolerance));

    return {
      questionId: question.id,
      prompt: question.prompt,
      subtopic: question.subtopic,
      topic: question.topic,
      difficulty: question.difficulty,
      type: question.type,
      answer: rawAnswer,
      correctAnswer: question.correctAnswer,
      tolerance: question.tolerance ?? 0,
      isCorrect,
      expectedTimeSec: question.expectedTimeSec,
      timeSpentSec: Number(timeSpentByQuestion[question.id] || 0),
      explanation: question.explanation,
      errorTag: isCorrect ? null : question.errorTag
    };
  });

  const score = responses.filter((response) => response.isCorrect).length;
  const totalTimeSec = responses.reduce((sum, response) => sum + response.timeSpentSec, 0);
  const accuracy = questions.length ? (score / questions.length) * 100 : 0;
  const errorTags = responses.map((response) => response.errorTag).filter(Boolean);
  const historicalTags = previousAttempts.flatMap((attempt) => attempt.errorTags || []);
  const repeatedErrors = Object.entries(countOccurrences([...historicalTags, ...errorTags]))
    .filter(([, count]) => count >= 2)
    .map(([tag, count]) => ({ tag, count }));

  return {
    attemptId: `ATT-${timestamp.getTime()}`,
    date: timestamp.toISOString().slice(0, 10),
    userId,
    totalQuestions: questions.length,
    score,
    accuracy,
    totalTimeSec,
    avgTimeSec: questions.length ? totalTimeSec / questions.length : 0,
    topicStats: buildTopicStatsFromResponses(responses),
    difficultyStats: buildDifficultyStatsFromResponses(responses),
    repeatedErrors,
    errorTags,
    responses
  };
}
