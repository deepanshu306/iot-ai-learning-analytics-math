from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.shared.analytics import admin_dashboard_payload, student_dashboard_payload, teacher_dashboard_payload, visualization_payload
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

    @app.get("/api/dashboard/student/<student_id>")
    def student_dashboard(student_id):
        payload = student_dashboard_payload(student_id)
        if not payload:
            return jsonify({"error": "student_not_found"}), 404
        return jsonify(payload)

    @app.get("/api/dashboard/teacher")
    def teacher_dashboard():
        student_id = request.args.get("student_id")
        return jsonify(teacher_dashboard_payload(student_id))

    @app.get("/api/dashboard/admin")
    def admin_dashboard():
        return jsonify(admin_dashboard_payload())

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["visualization_service"])
