from copy import deepcopy


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

INSTRUCTORS = [
    {
        "id": "ins-001",
        "name": "Dr. Nidhi Rao",
        "department": "Department of Mathematics",
    }
]

PARENTS = [
    {"studentId": "stu-001", "name": "Ritika Sharma"},
    {"studentId": "stu-002", "name": "Sanjay Mehta"},
    {"studentId": "stu-003", "name": "Meera Iyer"},
]

LMS_CONNECTORS = [
    {
        "name": "Moodle",
        "status": "connected",
        "syncFrequency": "5 min",
        "lastSync": "2026-04-08T09:15:00Z",
    },
    {
        "name": "Canvas",
        "status": "connected",
        "syncFrequency": "10 min",
        "lastSync": "2026-04-08T09:10:00Z",
    },
    {
        "name": "Google Classroom",
        "status": "pilot",
        "syncFrequency": "manual",
        "lastSync": "2026-04-07T18:30:00Z",
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

INGESTED_EVENT_LOG = []


def get_students():
    return deepcopy(STUDENTS)


def get_events():
    return deepcopy(LEARNING_EVENTS + INGESTED_EVENT_LOG)


def get_connectors():
    return deepcopy(LMS_CONNECTORS)


def add_runtime_event(event):
    INGESTED_EVENT_LOG.append(deepcopy(event))
    return deepcopy(event)

