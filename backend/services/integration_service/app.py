from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.shared.seed_data import get_connectors
from backend.shared.settings import KAFKA_BOOTSTRAP_SERVERS, SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        return jsonify(
            {
                "service": "integration_service",
                "status": "ok",
                "kafkaBootstrapServers": KAFKA_BOOTSTRAP_SERVERS,
            }
        )

    @app.get("/api/integrations/lms")
    def integrations():
        return jsonify({"connectors": get_connectors()})

    @app.post("/api/integrations/lms/sync")
    def sync():
        payload = request.get_json(silent=True) or {}
        connector = payload.get("connector", "Moodle")
        return jsonify(
            {
                "message": "LMS sync simulated successfully.",
                "connector": connector,
                "syncMode": "development",
                "recordsQueued": 24,
            }
        )

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["integration_service"])

