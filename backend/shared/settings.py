import os


KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC_EVENTS = os.getenv("KAFKA_TOPIC_EVENTS", "learning-events")
CASSANDRA_CONTACT_POINTS = os.getenv("CASSANDRA_CONTACT_POINTS", "localhost")
CASSANDRA_KEYSPACE = os.getenv("CASSANDRA_KEYSPACE", "learning_analytics")
DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"

SERVICE_PORTS = {
    "data_collector": 5001,
    "data_processor": 5002,
    "feedback_generator": 5003,
    "visualization_service": 5004,
    "integration_service": 5005,
}

