from flask import Flask, jsonify
from flask_cors import CORS

from backend.shared.analytics import class_overview, student_summary, student_dashboard_payload, teacher_dashboard_payload
from backend.shared.settings import SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        return jsonify({"service": "data_processor", "status": "ok"})

    @app.get("/api/analytics/overview")
    def overview():
        return jsonify(class_overview())

    @app.get("/api/analytics/students")
    def students():
        data = class_overview()
        return jsonify({"students": data["studentOptions"]})

    @app.get("/api/analytics/students/<student_id>")
    def student(student_id):
        payload = student_summary(student_id)
        if not payload:
            return jsonify({"error": "student_not_found"}), 404
        return jsonify(payload)

    @app.get("/api/analytics/students/<student_id>/dashboard")
    def student_dashboard(student_id):
        payload = student_dashboard_payload(student_id)
        if not payload:
            return jsonify({"error": "student_not_found"}), 404
        return jsonify(payload)

    @app.get("/api/analytics/teacher")
    def teacher():
        return jsonify(teacher_dashboard_payload())

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["data_processor"])
