from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import jsonify
from sqlalchemy.exc import OperationalError
import os

from models import db, TelemetryData as Telemetry
from utils.converter import convert_json_files
from api.unify import unify_routes
from api.dashboard import dashboard_routes

app = Flask(__name__)
CORS(app)

# Database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://telemetry_db_tgb2_user:URusszRgtlKIx1abGsz3EO8puD30gPBX@dpg-d236g6vgi27c73fl458g-a.singapore-postgres.render.com/telemetry_db_tgb2"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(unify_routes)
app.register_blueprint(dashboard_routes)

@app.route("/")
def index():
    return {"message": "Telemetry Unifier Backend Running."}

@app.route("/test-db")
def test_db_connection():
    try:
        # Try running a simple query
        db.session.execute("SELECT 1")
        return jsonify({"status": "success", "message": "Database connected successfully!"})
    except OperationalError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/init-db")
def init_db():
    try:
        db.create_all()
        return jsonify({"status": "success", "message": "Tables created!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
