from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.shared.analytics import admin_dashboard_payload, demo_accounts
from backend.shared.pipeline import pipeline_status
from backend.shared.seed_data import add_user, authenticate_user, get_connectors, get_users, update_connector
from backend.shared.settings import KAFKA_BOOTSTRAP_SERVERS, SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        modes = pipeline_status()
        return jsonify(
            {
                "service": "integration_service",
                "status": "ok",
                "kafkaBootstrapServers": KAFKA_BOOTSTRAP_SERVERS,
                "messaging": modes["messaging"],
                "storage": modes["storage"],
            }
        )

    @app.post("/api/auth/login")
    def login():
        payload = request.get_json(silent=True) or {}
        email = payload.get("email", "")
        password = payload.get("password", "")
        user = authenticate_user(email, password)
        if not user:
            return jsonify({"error": "invalid_credentials"}), 401
        return jsonify(
            {
                "token": f"demo-token-{user['id']}",
                "user": user,
            }
        )

    @app.get("/api/auth/demo-accounts")
    def accounts():
        return jsonify({"accounts": demo_accounts()})

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

    @app.get("/api/admin/users")
    def users():
        return jsonify({"users": get_users()})

    @app.post("/api/admin/users")
    def create_user():
        payload = request.get_json(silent=True) or {}
        try:
            user = add_user(payload)
        except ValueError as error:
            return jsonify({"error": str(error)}), 400
        return jsonify({"user": user}), 201

    @app.patch("/api/admin/connectors/<connector_name>")
    def patch_connector(connector_name):
        payload = request.get_json(silent=True) or {}
        connector = update_connector(connector_name, payload)
        if not connector:
            return jsonify({"error": "connector_not_found"}), 404
        return jsonify({"connector": connector})

    @app.get("/api/admin/dashboard")
    def admin_dashboard():
        return jsonify(admin_dashboard_payload())

    @app.get("/api/system/runtime")
    def runtime():
        return jsonify(
            {
                "pipeline": pipeline_status(),
                "services": admin_dashboard_payload()["serviceTopology"],
            }
        )

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["integration_service"])
