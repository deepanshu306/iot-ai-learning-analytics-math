from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.shared.seed_data import add_runtime_event, get_connectors, get_events
from backend.shared.settings import CASSANDRA_KEYSPACE, KAFKA_TOPIC_EVENTS, SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        return jsonify(
            {
                "service": "data_collector",
                "status": "ok",
                "publishesTo": KAFKA_TOPIC_EVENTS,
                "storageSink": CASSANDRA_KEYSPACE,
            }
        )

    @app.get("/api/events")
    def events():
        student_id = request.args.get("student_id")
        items = get_events()
        if student_id:
            items = [item for item in items if item["studentId"] == student_id]
        return jsonify({"events": items, "count": len(items)})

    @app.post("/api/events")
    def ingest_event():
        payload = request.get_json(silent=True) or {}
        required = {"eventId", "studentId", "platform", "topic", "scorePct", "timestamp"}
        missing = sorted(required - payload.keys())
        if missing:
            return jsonify({"error": "missing_fields", "fields": missing}), 400
        stored = add_runtime_event(payload)
        return jsonify(
            {
                "message": "Event accepted and queued for Kafka publishing in development mode.",
                "kafkaTopic": KAFKA_TOPIC_EVENTS,
                "event": stored,
            }
        ), 202

    @app.get("/api/connectors")
    def connectors():
        return jsonify({"connectors": get_connectors()})

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["data_collector"])

