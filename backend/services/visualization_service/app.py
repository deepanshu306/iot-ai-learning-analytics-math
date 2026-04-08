from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.shared.analytics import visualization_payload
from backend.shared.settings import SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        return jsonify({"service": "visualization_service", "status": "ok"})

    @app.get("/api/dashboard")
    def dashboard():
        student_id = request.args.get("student_id")
        return jsonify(visualization_payload(student_id))

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["visualization_service"])

