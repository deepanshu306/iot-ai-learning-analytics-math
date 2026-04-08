from collections import defaultdict
from statistics import mean

from .seed_data import PARENTS, get_connectors, get_events, get_students


def _score_band(score):
    if score < 55:
        return "critical"
    if score < 70:
        return "needs_support"
    if score < 85:
        return "on_track"
    return "advanced"


def _risk_level(score):
    if score < 55:
        return "high"
    if score < 70:
        return "moderate"
    return "low"


def _topic_actions(topic_scores):
    ordered = sorted(topic_scores.items(), key=lambda item: item[1])
    recommendations = []
    for topic, score in ordered[:2]:
        if score < 60:
            recommendations.append(f"Assign remedial {topic.lower()} practice with guided examples.")
        elif score < 75:
            recommendations.append(f"Schedule targeted revision tasks for {topic.lower()} before the next assessment.")
    for topic, score in ordered[-1:]:
        if score >= 85:
            recommendations.append(f"Promote {topic.lower()} to the advanced-learning pathway.")
    return recommendations


def student_events(student_id):
    return [event for event in get_events() if event["studentId"] == student_id]


def student_summary(student_id):
    students = {student["id"]: student for student in get_students()}
    student = students.get(student_id)
    if not student:
        return None

    events = sorted(student_events(student_id), key=lambda item: item["timestamp"])
    if not events:
        return {
            "student": student,
            "averageScore": 0,
            "latestScore": 0,
            "averageTimeMinutes": 0,
            "completionRate": 0,
            "riskLevel": "unknown",
            "topicMastery": [],
            "trend": [],
            "recommendedPath": [],
        }

    topic_groups = defaultdict(list)
    for event in events:
        topic_groups[event["topic"]].append(event["scorePct"])

    topic_mastery = []
    topic_scores = {}
    for topic, scores in topic_groups.items():
        score = round(mean(scores), 1)
        topic_scores[topic] = score
        topic_mastery.append(
            {
                "topic": topic,
                "score": score,
                "status": _score_band(score),
            }
        )

    average_score = round(mean(event["scorePct"] for event in events), 1)
    latest_score = events[-1]["scorePct"]
    average_time = round(mean(event["timeSpentMin"] for event in events), 1)
    completion_rate = round(mean(event["completionRate"] for event in events) * 100, 1)

    return {
        "student": student,
        "averageScore": average_score,
        "latestScore": latest_score,
        "averageTimeMinutes": average_time,
        "completionRate": completion_rate,
        "riskLevel": _risk_level(average_score),
        "topicMastery": sorted(topic_mastery, key=lambda item: item["topic"]),
        "trend": [
            {
                "label": event["timestamp"][:10],
                "score": event["scorePct"],
            }
            for event in events
        ],
        "recommendedPath": _topic_actions(topic_scores),
        "sources": sorted({event["platform"] for event in events}),
    }


def class_overview():
    students = get_students()
    summaries = [student_summary(student["id"]) for student in students]
    valid_summaries = [summary for summary in summaries if summary]
    topic_scores = defaultdict(list)
    for summary in valid_summaries:
        for topic in summary["topicMastery"]:
            topic_scores[topic["topic"]].append(topic["score"])

    return {
        "totalStudents": len(students),
        "averageScore": round(mean(summary["averageScore"] for summary in valid_summaries), 1),
        "highRiskStudents": sum(summary["riskLevel"] == "high" for summary in valid_summaries),
        "connectorsOnline": sum(item["status"] == "connected" for item in get_connectors()),
        "studentOptions": [
            {"id": summary["student"]["id"], "name": summary["student"]["name"]}
            for summary in valid_summaries
        ],
        "topicHeatmap": [
            {
                "topic": topic,
                "score": round(mean(scores), 1),
            }
            for topic, scores in sorted(topic_scores.items())
        ],
        "distribution": [
            {
                "label": label.replace("_", " ").title(),
                "count": sum(summary["riskLevel"] == label for summary in valid_summaries),
            }
            for label in ["high", "moderate", "low"]
        ],
        "serviceTopology": [
            {
                "name": "Data Collector Service",
                "stack": "Python Flask + Kafka Producer",
                "purpose": "Collect LMS and platform activity as learning events.",
            },
            {
                "name": "Data Processor Service",
                "stack": "Python Flask + Analytics Rules",
                "purpose": "Normalize events and compute learner-level insights.",
            },
            {
                "name": "Feedback Generator Service",
                "stack": "Python Flask + Recommendation Rules",
                "purpose": "Create student, instructor, and parent feedback streams.",
            },
            {
                "name": "Visualization Service",
                "stack": "React 18 + D3.js",
                "purpose": "Render live analytics dashboards for all stakeholders.",
            },
            {
                "name": "Integration Service",
                "stack": "Python Flask + LMS Connectors",
                "purpose": "Connect Moodle, Canvas, and Google Classroom workflows.",
            },
        ],
    }


def feedback_bundle(student_id):
    summary = student_summary(student_id)
    if not summary:
        return None

    weak_topics = [item["topic"] for item in summary["topicMastery"] if item["score"] < 70]
    parent_record = next((item for item in PARENTS if item["studentId"] == student_id), None)
    parent_name = parent_record["name"] if parent_record else "Parent"
    return {
        "studentId": student_id,
        "studentName": summary["student"]["name"],
        "studentFeedback": [
            f"Current average score is {summary['averageScore']}%.",
            f"Weakest monitored areas: {', '.join(weak_topics) if weak_topics else 'none'}",
            *summary["recommendedPath"],
        ],
        "instructorFeedback": [
            f"Risk level for {summary['student']['name']} is {summary['riskLevel']}.",
            "Use mastery trends to assign differentiated practice sets.",
            "Escalate low-performing topics to live instructor intervention when two consecutive assessments fall below 60%.",
        ],
        "parentFeedback": [
            f"{parent_name} should monitor weekly completion consistency for {summary['student']['name']}.",
            f"The latest recorded mathematics score is {summary['latestScore']}%.",
            "Encourage a fixed revision schedule and concept recap before the next class test.",
        ],
    }


def visualization_payload(student_id=None):
    overview = class_overview()
    selected = student_id or overview["studentOptions"][0]["id"]
    summary = student_summary(selected)
    feedback = feedback_bundle(selected)
    return {
        "overview": overview,
        "selectedStudent": summary,
        "feedback": feedback,
        "connectors": get_connectors(),
    }

