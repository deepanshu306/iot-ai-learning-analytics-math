import { ERROR_LABELS, TOPIC_LABELS } from "./constants.js";
import { createPerformanceBand } from "./analytics.js";

function uniqueFeedback(items) {
  return items.filter(
    (item, index, collection) =>
      collection.findIndex((entry) => entry.title === item.title && entry.message === item.message) ===
      index
  );
}

export function generateFeedback(result) {
  const messages = [];
  const band = createPerformanceBand(result.accuracy);
  const weakTopics = result.topicStats.filter((topic) => topic.accuracy < 50);
  const strongFastTopics = result.topicStats.filter(
    (topic) => topic.accuracy >= 80 && topic.timeEfficiency === "fast"
  );

  if (band === "foundation") {
    messages.push({
      title: "Rebuild fundamentals",
      message: `Accuracy is ${result.accuracy.toFixed(
        1
      )}%. Revise worked examples first and move to an easy practice set before another full quiz.`
    });
  } else if (band === "developing") {
    messages.push({
      title: "Targeted revision plan",
      message: `Accuracy is ${result.accuracy.toFixed(
        1
      )}%. Focus on medium-difficulty practice in the weakest topic before attempting harder problems.`
    });
  } else {
    messages.push({
      title: "Stretch challenge",
      message: `Accuracy is ${result.accuracy.toFixed(
        1
      )}%. Move to mixed hard questions to convert speed and consistency into mastery.`
    });
  }

  weakTopics.forEach((topic) => {
    messages.push({
      title: `Focus on ${topic.label}`,
      message: `${topic.label} accuracy is ${topic.accuracy.toFixed(1)}% and time efficiency is ${
        topic.timeEfficiency
      }. Revisit the concept recap and solve 5 more ${topic.label.toLowerCase()} questions.`
    });
  });

  strongFastTopics.forEach((topic) => {
    messages.push({
      title: `${topic.label} is a strength`,
      message: `${topic.label} is both strong (${topic.accuracy.toFixed(
        1
      )}%) and fast. Add one harder mixed set to keep this topic ahead of the others.`
    });
  });

  if (result.repeatedErrors.length) {
    const repeatedError = result.repeatedErrors[0];
    messages.push({
      title: "Repeated mistake detected",
      message: `${ERROR_LABELS[repeatedError.tag] ?? repeatedError.tag} appeared ${
        repeatedError.count
      } times across recent work. Review the correction pattern before the next attempt.`
    });
  }

  const weakestTopic = [...result.topicStats].sort((left, right) => left.accuracy - right.accuracy)[0];
  if (weakestTopic) {
    messages.push({
      title: "Next quiz recommendation",
      message: `Start the next quiz with 5 ${TOPIC_LABELS[weakestTopic.key].toLowerCase()} questions, then finish with 3 medium mixed problems to measure improvement.`
    });
  }

  return uniqueFeedback(messages).slice(0, 5);
}

export function generateTeacherInterventions(profile) {
  const interventions = [];
  const weakestTopic = profile.analytics.weakestTopic;
  const repeatedError = profile.analytics.repeatedErrors[0];

  if (weakestTopic) {
    interventions.push(
      `Assign a short ${weakestTopic.label.toLowerCase()} remediation set because current topic accuracy is ${weakestTopic.accuracy.toFixed(
        1
      )}%.`
    );
  }

  if (weakestTopic?.timeEfficiency === "slow") {
    interventions.push(
      `Model a timed walkthrough for ${weakestTopic.label.toLowerCase()} because speed is below expectation.`
    );
  }

  if (repeatedError) {
    interventions.push(
      `Address ${ERROR_LABELS[repeatedError.tag] ?? repeatedError.tag} explicitly; it has repeated ${
        repeatedError.count
      } times.`
    );
  }

  if (!interventions.length) {
    interventions.push("Maintain mixed revision and progress to a higher-difficulty quiz next.");
  }

  return interventions;
}
