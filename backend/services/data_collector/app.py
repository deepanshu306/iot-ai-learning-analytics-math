from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.shared.pipeline import persist_event, pipeline_status, publish_event
from backend.shared.seed_data import add_runtime_event, get_connectors, get_events
from backend.shared.settings import CASSANDRA_KEYSPACE, KAFKA_TOPIC_EVENTS, SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        modes = pipeline_status()
        return jsonify(
            {
                "service": "data_collector",
                "status": "ok",
                "publishesTo": KAFKA_TOPIC_EVENTS,
                "storageSink": CASSANDRA_KEYSPACE,
                "messaging": modes["messaging"],
                "storage": modes["storage"],
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
        required = {"studentId", "platform", "topic", "scorePct", "timestamp"}
        missing = sorted(required - payload.keys())
        if missing:
            return jsonify({"error": "missing_fields", "fields": missing}), 400
        stored = add_runtime_event(payload)
        messaging = publish_event(stored)
        storage = persist_event(stored)
        return jsonify(
            {
                "message": "Event accepted and routed through the current messaging and storage workflow.",
                "messaging": messaging,
                "storage": storage,
                "event": stored,
            }
        ), 202

    @app.get("/api/connectors")
    def connectors():
        return jsonify({"connectors": get_connectors()})

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["data_collector"])
