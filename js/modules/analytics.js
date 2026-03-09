import {
  DIFFICULTY_ORDER,
  DIFFICULTY_LABELS,
  ERROR_LABELS,
  TOPIC_LABELS,
  TOPIC_ORDER
} from "./constants.js";

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function classifyMastery(accuracy) {
  if (accuracy >= 80) {
    return "strong";
  }

  if (accuracy >= 50) {
    return "moderate";
  }

  return "weak";
}

export function classifyTimeEfficiency(actual, expected) {
  if (!expected) {
    return "normal";
  }

  const ratio = actual / expected;

  if (ratio < 0.8) {
    return "fast";
  }

  if (ratio > 1.2) {
    return "slow";
  }

  return "normal";
}

export function countOccurrences(items) {
  return items.reduce((accumulator, item) => {
    if (!item) {
      return accumulator;
    }

    accumulator[item] = (accumulator[item] || 0) + 1;
    return accumulator;
  }, {});
}

function normaliseBreakdownObject(breakdown, order) {
  return order.map((key) => {
    const item = breakdown?.[key] ?? {};
    const attempted = Number(item.attempted || 0);
    const correct = Number(item.correct || 0);
    const avgTimeSec = Number(item.avgTimeSec || 0);
    const expectedTimeSec = Number(item.expectedTimeSec || 0);
    const accuracy = attempted ? (correct / attempted) * 100 : 0;

    return {
      key,
      label: TOPIC_LABELS[key] ?? DIFFICULTY_LABELS[key] ?? key,
      attempted,
      correct,
      avgTimeSec,
      expectedTimeSec,
      accuracy,
      mastery: classifyMastery(accuracy),
      timeEfficiency: classifyTimeEfficiency(avgTimeSec, expectedTimeSec)
    };
  });
}

export function topicBreakdownToArray(topicBreakdown) {
  return normaliseBreakdownObject(topicBreakdown, TOPIC_ORDER);
}

export function difficultyBreakdownToArray(difficultyBreakdown) {
  return DIFFICULTY_ORDER.map((key) => {
    const item = difficultyBreakdown?.[key] ?? {};
    const attempted = Number(item.attempted || 0);
    const correct = Number(item.correct || 0);
    const accuracy = attempted ? (correct / attempted) * 100 : 0;

    return {
      key,
      label: DIFFICULTY_LABELS[key] ?? key,
      attempted,
      correct,
      accuracy
    };
  });
}

function buildAggregateMap(order) {
  return order.reduce((accumulator, key) => {
    accumulator[key] = {
      attempted: 0,
      correct: 0,
      totalActualTime: 0,
      totalExpectedTime: 0,
      timedAttempts: 0
    };
    return accumulator;
  }, {});
}

function aggregateTopicBreakdowns(attempts) {
  const aggregate = buildAggregateMap(TOPIC_ORDER);

  attempts.forEach((attempt) => {
    TOPIC_ORDER.forEach((key) => {
      const item = attempt.topicBreakdown?.[key];
      if (!item) {
        return;
      }

      aggregate[key].attempted += Number(item.attempted || 0);
      aggregate[key].correct += Number(item.correct || 0);
      aggregate[key].totalActualTime += Number(item.avgTimeSec || 0);
      aggregate[key].totalExpectedTime += Number(item.expectedTimeSec || 0);
      aggregate[key].timedAttempts += 1;
    });
  });

  return TOPIC_ORDER.map((key) => {
    const item = aggregate[key];
    const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
    const avgTimeSec = item.timedAttempts ? item.totalActualTime / item.timedAttempts : 0;
    const expectedTimeSec = item.timedAttempts ? item.totalExpectedTime / item.timedAttempts : 0;

    return {
      key,
      label: TOPIC_LABELS[key],
      attempted: item.attempted,
      correct: item.correct,
      accuracy,
      avgTimeSec,
      expectedTimeSec,
      mastery: classifyMastery(accuracy),
      timeEfficiency: classifyTimeEfficiency(avgTimeSec, expectedTimeSec)
    };
  });
}

function aggregateDifficultyBreakdowns(attempts) {
  const aggregate = buildAggregateMap(DIFFICULTY_ORDER);

  attempts.forEach((attempt) => {
    DIFFICULTY_ORDER.forEach((key) => {
      const item = attempt.difficultyBreakdown?.[key];
      if (!item) {
        return;
      }

      aggregate[key].attempted += Number(item.attempted || 0);
      aggregate[key].correct += Number(item.correct || 0);
    });
  });

  return DIFFICULTY_ORDER.map((key) => {
    const item = aggregate[key];
    const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
    return {
      key,
      label: DIFFICULTY_LABELS[key],
      attempted: item.attempted,
      correct: item.correct,
      accuracy
    };
  });
}

export function createPerformanceBand(accuracy) {
  if (accuracy < 40) {
    return "foundation";
  }

  if (accuracy < 70) {
    return "developing";
  }

  return "advanced";
}

export function computeStudentAnalytics(userId, attempts) {
  const studentAttempts = attempts
    .filter((attempt) => attempt.userId === userId)
    .sort((left, right) => new Date(left.date) - new Date(right.date));

  const topicStats = aggregateTopicBreakdowns(studentAttempts);
  const difficultyStats = aggregateDifficultyBreakdowns(studentAttempts);
  const accuracies = studentAttempts.map((attempt) => Number(attempt.accuracy || 0));
  const averageAccuracy = accuracies.length
    ? accuracies.reduce((sum, value) => sum + value, 0) / accuracies.length
    : 0;
  const latestAttempt = studentAttempts.at(-1) ?? null;
  const errorCounts = countOccurrences(studentAttempts.flatMap((attempt) => attempt.errorTags || []));

  return {
    attempts: studentAttempts,
    totalAttempts: studentAttempts.length,
    averageAccuracy,
    latestAccuracy: latestAttempt?.accuracy ?? 0,
    trend: studentAttempts.map((attempt) => ({
      date: attempt.date,
      accuracy: Number(attempt.accuracy || 0)
    })),
    topicStats,
    difficultyStats,
    strongestTopic:
      [...topicStats].sort((left, right) => right.accuracy - left.accuracy)[0] ?? null,
    weakestTopic:
      [...topicStats].sort((left, right) => left.accuracy - right.accuracy)[0] ?? null,
    repeatedErrors: Object.entries(errorCounts)
      .filter(([, count]) => count >= 2)
      .map(([tag, count]) => ({
        tag,
        label: ERROR_LABELS[tag] ?? tag,
        count
      })),
    latestAttempt
  };
}

export function computeTeacherAnalytics(users, attempts) {
  const studentUsers = users.filter((user) => user.role === "student");
  const topicStats = aggregateTopicBreakdowns(attempts);
  const difficultyStats = aggregateDifficultyBreakdowns(attempts);
  const averageAccuracy = attempts.length
    ? attempts.reduce((sum, attempt) => sum + Number(attempt.accuracy || 0), 0) / attempts.length
    : 0;

  const groupMap = studentUsers.reduce((accumulator, user) => {
    const studentAttempts = attempts.filter((attempt) => attempt.userId === user.id);
    const group = user.classGroup || "Unassigned";

    accumulator[group] = accumulator[group] || [];
    accumulator[group].push(...studentAttempts.map((attempt) => Number(attempt.accuracy || 0)));
    return accumulator;
  }, {});

  const weakestGroup =
    Object.entries(groupMap)
      .map(([group, values]) => ({
        group,
        average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
      }))
      .sort((left, right) => left.average - right.average)[0] ?? null;

  const slowestTopic =
    [...topicStats].sort(
      (left, right) =>
        right.avgTimeSec / (right.expectedTimeSec || 1) -
        left.avgTimeSec / (left.expectedTimeSec || 1)
    )[0] ?? null;

  const scoreDistribution = [
    { label: "<40%", count: 0 },
    { label: "40-69%", count: 0 },
    { label: "70-84%", count: 0 },
    { label: "85%+", count: 0 }
  ];

  attempts.forEach((attempt) => {
    const accuracy = Number(attempt.accuracy || 0);
    if (accuracy < 40) {
      scoreDistribution[0].count += 1;
    } else if (accuracy < 70) {
      scoreDistribution[1].count += 1;
    } else if (accuracy < 85) {
      scoreDistribution[2].count += 1;
    } else {
      scoreDistribution[3].count += 1;
    }
  });

  const attemptsTrendMap = attempts.reduce((accumulator, attempt) => {
    const date = attempt.date;
    accumulator[date] = accumulator[date] || [];
    accumulator[date].push(Number(attempt.accuracy || 0));
    return accumulator;
  }, {});

  const attemptsTrend = Object.entries(attemptsTrendMap)
    .map(([date, values]) => ({
      date,
      accuracy: values.reduce((sum, value) => sum + value, 0) / values.length
    }))
    .sort((left, right) => new Date(left.date) - new Date(right.date));

  return {
    classAverage: averageAccuracy,
    topicStats,
    difficultyStats,
    slowestTopic,
    weakestGroup,
    scoreDistribution,
    attemptsTrend,
    studentProfiles: studentUsers.map((user) => ({
      user,
      analytics: computeStudentAnalytics(user.id, attempts)
    }))
  };
}

export function buildTopicStatsFromResponses(responses) {
  const topicMap = buildAggregateMap(TOPIC_ORDER);

  responses.forEach((response) => {
    const bucket = topicMap[response.topic];
    bucket.attempted += 1;
    bucket.correct += response.isCorrect ? 1 : 0;
    bucket.totalActualTime += Number(response.timeSpentSec || 0);
    bucket.totalExpectedTime += Number(response.expectedTimeSec || 0);
    bucket.timedAttempts += 1;
  });

  return TOPIC_ORDER.map((key) => {
    const item = topicMap[key];
    const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
    const avgTimeSec = item.timedAttempts ? item.totalActualTime / item.timedAttempts : 0;
    const expectedTimeSec = item.timedAttempts ? item.totalExpectedTime / item.timedAttempts : 0;

    return {
      key,
      label: TOPIC_LABELS[key],
      attempted: item.attempted,
      correct: item.correct,
      accuracy,
      avgTimeSec,
      expectedTimeSec,
      mastery: classifyMastery(accuracy),
      timeEfficiency: classifyTimeEfficiency(avgTimeSec, expectedTimeSec)
    };
  });
}

export function buildDifficultyStatsFromResponses(responses) {
  const difficultyMap = buildAggregateMap(DIFFICULTY_ORDER);

  responses.forEach((response) => {
    const bucket = difficultyMap[response.difficulty];
    bucket.attempted += 1;
    bucket.correct += response.isCorrect ? 1 : 0;
  });

  return DIFFICULTY_ORDER.map((key) => {
    const item = difficultyMap[key];
    const accuracy = item.attempted ? (item.correct / item.attempted) * 100 : 0;
    return {
      key,
      label: DIFFICULTY_LABELS[key],
      attempted: item.attempted,
      correct: item.correct,
      accuracy
    };
  });
}
