from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

from models import db
from utils.converter import convert_json_files
from api.unify import unify_routes
from api.dashboard import dashboard_routes

app = Flask(__name__)
CORS(app)

# Database setup
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "telemetry.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(unify_routes)
app.register_blueprint(dashboard_routes)

@app.route("/")
def index():
    return {"message": "Telemetry Unifier Backend Running."}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
