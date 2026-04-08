import json
from copy import deepcopy
from pathlib import Path
from uuid import uuid4


STUDENTS = [
    {
        "id": "stu-001",
        "name": "Aanya Sharma",
        "gradeLevel": "B.Tech Final Year",
        "parentName": "Ritika Sharma",
        "lmsUserId": "LMS-1001",
    },
    {
        "id": "stu-002",
        "name": "Rohan Mehta",
        "gradeLevel": "B.Tech Final Year",
        "parentName": "Sanjay Mehta",
        "lmsUserId": "LMS-1002",
    },
    {
        "id": "stu-003",
        "name": "Kavya Iyer",
        "gradeLevel": "B.Tech Final Year",
        "parentName": "Meera Iyer",
        "lmsUserId": "LMS-1003",
    },
]

AUTH_USERS = [
    {
        "id": "user-stu-001",
        "role": "student",
        "name": "Aanya Sharma",
        "email": "aanya@student.demo",
        "password": "math123",
        "studentId": "stu-001",
    },
    {
        "id": "user-stu-002",
        "role": "student",
        "name": "Rohan Mehta",
        "email": "rohan@student.demo",
        "password": "math123",
        "studentId": "stu-002",
    },
    {
        "id": "user-stu-003",
        "role": "student",
        "name": "Kavya Iyer",
        "email": "kavya@student.demo",
        "password": "math123",
        "studentId": "stu-003",
    },
    {
        "id": "user-teacher-001",
        "role": "teacher",
        "name": "Dr. Nidhi Rao",
        "email": "nidhi@teacher.demo",
        "password": "teach123",
        "department": "Department of Mathematics",
    },
    {
        "id": "user-admin-001",
        "role": "admin",
        "name": "Systems Admin",
        "email": "admin@demo.local",
        "password": "admin123",
        "department": "Academic Operations",
    },
]

LMS_CONNECTORS = [
    {
        "name": "Moodle",
        "status": "connected",
        "syncFrequency": "5 min",
        "lastSync": "2026-04-09T09:15:00Z",
    },
    {
        "name": "Canvas",
        "status": "connected",
        "syncFrequency": "10 min",
        "lastSync": "2026-04-09T09:10:00Z",
    },
    {
        "name": "Google Classroom",
        "status": "pilot",
        "syncFrequency": "manual",
        "lastSync": "2026-04-08T18:30:00Z",
    },
]

LEARNING_EVENTS = [
    {
        "eventId": "evt-001",
        "studentId": "stu-001",
        "platform": "Moodle",
        "topic": "Algebra",
        "subtopic": "Linear Equations",
        "scorePct": 88,
        "difficulty": "medium",
        "timeSpentMin": 16,
        "completionRate": 1.0,
        "hintsUsed": 1,
        "timestamp": "2026-04-01T10:15:00Z",
    },
    {
        "eventId": "evt-002",
        "studentId": "stu-001",
        "platform": "Moodle",
        "topic": "Calculus",
        "subtopic": "Derivatives",
        "scorePct": 62,
        "difficulty": "hard",
        "timeSpentMin": 26,
        "completionRate": 1.0,
        "hintsUsed": 2,
        "timestamp": "2026-04-03T11:05:00Z",
    },
    {
        "eventId": "evt-003",
        "studentId": "stu-001",
        "platform": "Canvas",
        "topic": "Trigonometry",
        "subtopic": "Identities",
        "scorePct": 72,
        "difficulty": "medium",
        "timeSpentMin": 18,
        "completionRate": 1.0,
        "hintsUsed": 1,
        "timestamp": "2026-04-06T09:45:00Z",
    },
    {
        "eventId": "evt-004",
        "studentId": "stu-002",
        "platform": "Moodle",
        "topic": "Algebra",
        "subtopic": "Quadratic Equations",
        "scorePct": 54,
        "difficulty": "medium",
        "timeSpentMin": 24,
        "completionRate": 0.95,
        "hintsUsed": 3,
        "timestamp": "2026-04-01T12:10:00Z",
    },
    {
        "eventId": "evt-005",
        "studentId": "stu-002",
        "platform": "Canvas",
        "topic": "Trigonometry",
        "subtopic": "Special Angles",
        "scorePct": 49,
        "difficulty": "easy",
        "timeSpentMin": 21,
        "completionRate": 1.0,
        "hintsUsed": 2,
        "timestamp": "2026-04-04T14:20:00Z",
    },
    {
        "eventId": "evt-006",
        "studentId": "stu-002",
        "platform": "Google Classroom",
        "topic": "Calculus",
        "subtopic": "Limits",
        "scorePct": 58,
        "difficulty": "medium",
        "timeSpentMin": 23,
        "completionRate": 0.9,
        "hintsUsed": 3,
        "timestamp": "2026-04-07T10:25:00Z",
    },
    {
        "eventId": "evt-007",
        "studentId": "stu-003",
        "platform": "Canvas",
        "topic": "Algebra",
        "subtopic": "Sequences",
        "scorePct": 91,
        "difficulty": "hard",
        "timeSpentMin": 17,
        "completionRate": 1.0,
        "hintsUsed": 0,
        "timestamp": "2026-04-02T08:55:00Z",
    },
    {
        "eventId": "evt-008",
        "studentId": "stu-003",
        "platform": "Moodle",
        "topic": "Calculus",
        "subtopic": "Integration",
        "scorePct": 86,
        "difficulty": "hard",
        "timeSpentMin": 20,
        "completionRate": 1.0,
        "hintsUsed": 1,
        "timestamp": "2026-04-05T15:00:00Z",
    },
    {
        "eventId": "evt-009",
        "studentId": "stu-003",
        "platform": "Canvas",
        "topic": "Trigonometry",
        "subtopic": "Double Angle",
        "scorePct": 84,
        "difficulty": "medium",
        "timeSpentMin": 19,
        "completionRate": 1.0,
        "hintsUsed": 1,
        "timestamp": "2026-04-07T13:40:00Z",
    },
]

RUNTIME_DIR = Path("output/runtime")
RUNTIME_USERS_FILE = RUNTIME_DIR / "runtime-users.json"
RUNTIME_STUDENTS_FILE = RUNTIME_DIR / "runtime-students.json"
RUNTIME_CONNECTORS_FILE = RUNTIME_DIR / "runtime-connectors.json"
RUNTIME_EVENTS_FILE = RUNTIME_DIR / "runtime-events.json"


def _public_user(user):
    payload = deepcopy(user)
    payload.pop("password", None)
    return payload


def _load_runtime_list(path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _save_runtime_list(path, items):
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(items, handle, indent=2)


def get_students():
    return deepcopy(STUDENTS + _load_runtime_list(RUNTIME_STUDENTS_FILE))


def get_student(student_id):
    for student in get_students():
        if student["id"] == student_id:
            return deepcopy(student)
    return None


def get_users(include_password=False):
    items = deepcopy(AUTH_USERS + _load_runtime_list(RUNTIME_USERS_FILE))
    if include_password:
        return items
    return [_public_user(item) for item in items]


def get_user(user_id):
    for user in get_users(include_password=True):
        if user["id"] == user_id:
            return _public_user(user)
    return None


def authenticate_user(email, password):
    for user in get_users(include_password=True):
        if user["email"].lower() == email.lower() and user["password"] == password:
            return _public_user(user)
    return None


def add_user(payload):
    role = payload.get("role", "").strip().lower()
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "").strip()
    if role not in {"student", "teacher", "admin"}:
        raise ValueError("invalid_role")
    if not all([name, email, password]):
        raise ValueError("missing_required_fields")
    runtime_users = _load_runtime_list(RUNTIME_USERS_FILE)
    runtime_students = _load_runtime_list(RUNTIME_STUDENTS_FILE)
    existing_users = AUTH_USERS + runtime_users

    if any(user["email"].lower() == email for user in existing_users):
        raise ValueError("duplicate_email")

    user = {
        "id": f"user-{uuid4().hex[:8]}",
        "role": role,
        "name": name,
        "email": email,
        "password": password,
    }

    if role == "student":
        student_id = payload.get("studentId", "").strip() or f"stu-{uuid4().hex[:6]}"
        student_record = {
            "id": student_id,
            "name": name,
            "gradeLevel": payload.get("gradeLevel", "B.Tech Final Year").strip() or "B.Tech Final Year",
            "parentName": payload.get("parentName", "Not Assigned").strip() or "Not Assigned",
            "lmsUserId": payload.get("lmsUserId", f"LMS-{uuid4().hex[:6].upper()}").strip()
            or f"LMS-{uuid4().hex[:6].upper()}",
        }
        runtime_students.append(student_record)
        _save_runtime_list(RUNTIME_STUDENTS_FILE, runtime_students)
        user["studentId"] = student_id
    else:
        user["department"] = payload.get("department", "Academic Operations").strip() or "Academic Operations"

    runtime_users.append(user)
    _save_runtime_list(RUNTIME_USERS_FILE, runtime_users)
    return _public_user(user)


def get_connectors():
    runtime_connectors = _load_runtime_list(RUNTIME_CONNECTORS_FILE)
    return deepcopy(runtime_connectors or LMS_CONNECTORS)


def update_connector(connector_name, updates):
    connectors = _load_runtime_list(RUNTIME_CONNECTORS_FILE) or deepcopy(LMS_CONNECTORS)
    for connector in connectors:
        if connector["name"].lower() == connector_name.lower():
            if "status" in updates and updates["status"]:
                connector["status"] = updates["status"]
            if "syncFrequency" in updates and updates["syncFrequency"]:
                connector["syncFrequency"] = updates["syncFrequency"]
            if "lastSync" in updates and updates["lastSync"]:
                connector["lastSync"] = updates["lastSync"]
            _save_runtime_list(RUNTIME_CONNECTORS_FILE, connectors)
            return deepcopy(connector)
    return None


def get_events():
    return deepcopy(LEARNING_EVENTS + _load_runtime_list(RUNTIME_EVENTS_FILE))


def add_runtime_event(event):
    payload = deepcopy(event)
    payload.setdefault("eventId", f"evt-runtime-{uuid4().hex[:8]}")
    runtime_events = _load_runtime_list(RUNTIME_EVENTS_FILE)
    runtime_events.append(payload)
    _save_runtime_list(RUNTIME_EVENTS_FILE, runtime_events)
    return deepcopy(payload)
