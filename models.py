from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TelemetryData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(80))
    location = db.Column(db.String(120))
    timestamp = db.Column(db.String(80))
    start_time = db.Column(db.String(80))
    end_time = db.Column(db.String(80))
    status = db.Column(db.String(20))
    temperature = db.Column(db.Float)
    duration = db.Column(db.Float)
    vibration = db.Column(db.Float)

    def to_dict(self):
        return {
            "device_id": self.device_id,
            "location": self.location,
            "timestamp": self.timestamp,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "status": self.status,
            "temperature": self.temperature,
            "duration": self.duration,
            "vibration": self.vibration,
        }
