from collections import defaultdict
from statistics import mean

from .pipeline import pipeline_status
from .seed_data import get_connectors, get_events, get_student, get_students, get_user, get_users


def _safe_mean(values):
    return round(mean(values), 1) if values else 0


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


def service_topology():
    modes = pipeline_status()
    return [
        {
            "name": "Data Collector Service",
            "stack": "Python Flask",
            "purpose": "Collect LMS and platform activity as learning events.",
            "status": "active",
            "mode": modes["messaging"]["mode"],
        },
        {
            "name": "Data Processor Service",
            "stack": "Python Flask",
            "purpose": "Normalize events and compute learner-level insights.",
            "status": "active",
            "mode": "analytics",
        },
        {
            "name": "Feedback Generator Service",
            "stack": "Python Flask",
            "purpose": "Create student and instructor feedback streams.",
            "status": "active",
            "mode": "recommendation",
        },
        {
            "name": "Visualization Service",
            "stack": "React 18 + D3.js",
            "purpose": "Render role-based dashboards for students, teachers, and administrators.",
            "status": "active",
            "mode": "dashboard",
        },
        {
            "name": "Integration Service",
            "stack": "Python Flask",
            "purpose": "Connect Moodle, Canvas, and Google Classroom workflows.",
            "status": "active",
            "mode": "integration",
        },
        {
            "name": "Messaging Layer",
            "stack": "Apache Kafka",
            "purpose": modes["messaging"]["detail"],
            "status": modes["messaging"]["mode"],
            "mode": modes["messaging"]["mode"],
        },
        {
            "name": "Storage Layer",
            "stack": "Apache Cassandra",
            "purpose": modes["storage"]["detail"],
            "status": modes["storage"]["mode"],
            "mode": modes["storage"]["mode"],
        },
    ]


def student_events(student_id):
    return sorted(
        [event for event in get_events() if event["studentId"] == student_id],
        key=lambda item: item["timestamp"],
    )


def student_summary(student_id):
    student = get_student(student_id)
    if not student:
        return None

    events = student_events(student_id)
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
            "recentEvents": [],
            "sources": [],
        }

    topic_groups = defaultdict(list)
    for event in events:
        topic_groups[event["topic"]].append(event["scorePct"])

    topic_scores = {topic: _safe_mean(scores) for topic, scores in topic_groups.items()}
    topic_mastery = [
        {"topic": topic, "score": score, "status": _score_band(score)}
        for topic, score in sorted(topic_scores.items())
    ]

    average_score = _safe_mean([event["scorePct"] for event in events])
    latest_score = events[-1]["scorePct"]
    average_time = _safe_mean([event["timeSpentMin"] for event in events])
    completion_rate = _safe_mean([event["completionRate"] * 100 for event in events])

    recent_events = list(reversed(events[-5:]))
    return {
        "student": student,
        "averageScore": average_score,
        "latestScore": latest_score,
        "averageTimeMinutes": average_time,
        "completionRate": completion_rate,
        "riskLevel": _risk_level(average_score),
        "topicMastery": topic_mastery,
        "trend": [{"label": event["timestamp"][:10], "score": event["scorePct"]} for event in events],
        "recommendedPath": _topic_actions(topic_scores),
        "recentEvents": recent_events,
        "sources": sorted({event["platform"] for event in events}),
    }


def feedback_bundle(student_id):
    summary = student_summary(student_id)
    if not summary:
        return None

    weak_topics = [item["topic"] for item in summary["topicMastery"] if item["score"] < 70]
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
    }


def class_overview():
    students = get_students()
    summaries = [student_summary(student["id"]) for student in students]
    valid_summaries = [summary for summary in summaries if summary]
    topic_scores = defaultdict(list)
    for summary in valid_summaries:
        for topic in summary["topicMastery"]:
            topic_scores[topic["topic"]].append(topic["score"])

    student_snapshots = [
        {
            "studentId": summary["student"]["id"],
            "name": summary["student"]["name"],
            "averageScore": summary["averageScore"],
            "latestScore": summary["latestScore"],
            "riskLevel": summary["riskLevel"],
        }
        for summary in valid_summaries
    ]

    return {
        "totalStudents": len(students),
        "averageScore": _safe_mean([summary["averageScore"] for summary in valid_summaries]),
        "highRiskStudents": sum(summary["riskLevel"] == "high" for summary in valid_summaries),
        "connectorsOnline": sum(item["status"] == "connected" for item in get_connectors()),
        "studentOptions": [{"id": item["studentId"], "name": item["name"]} for item in student_snapshots],
        "studentSnapshots": student_snapshots,
        "topicHeatmap": [
            {"topic": topic, "score": _safe_mean(scores)} for topic, scores in sorted(topic_scores.items())
        ],
        "distribution": [
            {
                "label": label.replace("_", " ").title(),
                "count": sum(summary["riskLevel"] == label for summary in valid_summaries),
            }
            for label in ["high", "moderate", "low"]
        ],
        "serviceTopology": service_topology(),
    }


def student_dashboard_payload(student_id):
    summary = student_summary(student_id)
    feedback = feedback_bundle(student_id)
    if not summary or not feedback:
        return None
    return {
        "summary": summary,
        "feedback": feedback,
        "pipeline": pipeline_status(),
    }


def teacher_dashboard_payload(selected_student_id=None):
    overview = class_overview()
    chosen_student_id = selected_student_id or overview["studentOptions"][0]["id"]
    return {
        "overview": overview,
        "selectedStudent": student_summary(chosen_student_id),
        "selectedFeedback": feedback_bundle(chosen_student_id),
        "connectors": get_connectors(),
        "pipeline": pipeline_status(),
    }


def admin_dashboard_payload():
    users = get_users()
    counts = defaultdict(int)
    for user in users:
        counts[user["role"]] += 1

    events = get_events()
    return {
        "counts": {
            "users": len(users),
            "students": counts["student"],
            "teachers": counts["teacher"],
            "admins": counts["admin"],
            "events": len(events),
            "connectedLms": sum(item["status"] == "connected" for item in get_connectors()),
        },
        "users": users,
        "connectors": get_connectors(),
        "recentEvents": list(reversed(events[-8:])),
        "pipeline": pipeline_status(),
        "serviceTopology": service_topology(),
    }


def visualization_payload(student_id=None):
    return teacher_dashboard_payload(student_id)


def demo_accounts():
    return [
        {
            "role": user["role"],
            "email": user["email"],
            "password": user["password"],
            "name": user["name"],
        }
        for user in get_users(include_password=True)
    ]
