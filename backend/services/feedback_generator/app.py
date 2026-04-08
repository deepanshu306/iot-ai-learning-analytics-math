from flask import Flask, jsonify
from flask_cors import CORS

from backend.shared.analytics import feedback_bundle
from backend.shared.settings import SERVICE_PORTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        return jsonify({"service": "feedback_generator", "status": "ok"})

    @app.get("/api/feedback/students/<student_id>")
    def feedback(student_id):
        payload = feedback_bundle(student_id)
        if not payload:
            return jsonify({"error": "student_not_found"}), 404
        return jsonify(payload)

    @app.get("/api/feedback/teacher/<student_id>")
    def teacher_feedback(student_id):
        payload = feedback_bundle(student_id)
        if not payload:
            return jsonify({"error": "student_not_found"}), 404
        return jsonify(
            {
                "studentId": student_id,
                "studentName": payload["studentName"],
                "feedback": payload["instructorFeedback"],
            }
        )

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=SERVICE_PORTS["feedback_generator"])
