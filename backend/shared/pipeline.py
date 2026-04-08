import json
from datetime import datetime, timezone
from importlib.util import find_spec
from pathlib import Path

from .settings import (
    CASSANDRA_CONTACT_POINTS,
    CASSANDRA_KEYSPACE,
    DEV_MODE,
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_TOPIC_EVENTS,
)


RUNTIME_DIR = Path("output/runtime")
KAFKA_LOG = RUNTIME_DIR / "kafka-simulated-topic.jsonl"
CASSANDRA_LOG = RUNTIME_DIR / "cassandra-simulated-events.jsonl"


def _module_available(module_name):
    return find_spec(module_name) is not None


def _append_jsonl(path, payload):
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def pipeline_status():
    kafka_available = _module_available("kafka")
    cassandra_available = _module_available("cassandra")

    if DEV_MODE or not kafka_available:
        messaging = {
            "technology": "Apache Kafka",
            "mode": "simulated",
            "detail": "Events are mirrored to a local topic log for development and demo execution.",
            "target": KAFKA_TOPIC_EVENTS,
            "connection": KAFKA_BOOTSTRAP_SERVERS,
        }
    else:
        messaging = {
            "technology": "Apache Kafka",
            "mode": "configured",
            "detail": "Kafka client libraries are available and the service can be wired to a live broker.",
            "target": KAFKA_TOPIC_EVENTS,
            "connection": KAFKA_BOOTSTRAP_SERVERS,
        }

    if DEV_MODE or not cassandra_available:
        storage = {
            "technology": "Apache Cassandra",
            "mode": "simulated",
            "detail": "Events are mirrored to a local persistence log for development and demo execution.",
            "target": CASSANDRA_KEYSPACE,
            "connection": CASSANDRA_CONTACT_POINTS,
        }
    else:
        storage = {
            "technology": "Apache Cassandra",
            "mode": "configured",
            "detail": "Cassandra client libraries are available and the service can be wired to a live cluster.",
            "target": CASSANDRA_KEYSPACE,
            "connection": CASSANDRA_CONTACT_POINTS,
        }

    return {"messaging": messaging, "storage": storage}


def publish_event(event):
    status = pipeline_status()["messaging"]
    record = {
        "recordedAt": datetime.now(timezone.utc).isoformat(),
        "topic": KAFKA_TOPIC_EVENTS,
        "mode": status["mode"],
        "event": event,
    }
    _append_jsonl(KAFKA_LOG, record)
    return {
        "technology": status["technology"],
        "mode": status["mode"],
        "target": status["target"],
        "detail": status["detail"],
    }


def persist_event(event):
    status = pipeline_status()["storage"]
    record = {
        "recordedAt": datetime.now(timezone.utc).isoformat(),
        "keyspace": CASSANDRA_KEYSPACE,
        "mode": status["mode"],
        "event": event,
    }
    _append_jsonl(CASSANDRA_LOG, record)
    return {
        "technology": status["technology"],
        "mode": status["mode"],
        "target": status["target"],
        "detail": status["detail"],
    }
