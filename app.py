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

# PostgreSQL database setup for Render
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://telemetry_db_tgb2_user:URusszRgtlKIx1abGsz3EO8puD30gPBX@dpg-d236g6vgi27c73fl458g-a.singapore-postgres.render.com/telemetry_db_tgb2"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(unify_routes)
app.register_blueprint(dashboard_routes)

with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return {"message": "Telemetry Unifier Backend Running."}

@app.route("/init-db")
def init_db():
    try:
        db.create_all()
        return "Database initialized successfully."
    except Exception as e:
        return f"Error initializing DB: {str(e)}"

if __name__ == "__main__":
    app.run(debug=True)
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
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://telemetry_db_tgb2_user:URusszRgtlKIx1abGsz3EO8puD30gPBX@dpg-d236g6vgi27c73fl458g-a.singapore-postgres.render.com/telemetry_db_tgb2'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(unify_routes)
app.register_blueprint(dashboard_routes)

with app.app_context():
        db.create_all()


@app.route("/")
def index():
    return {"message": "Telemetry Unifier Backend Running."}

@app.route("/init-db")
def init_db():
    try:
        db.create_all()
        return "Database initialized successfully."
    except Exception as e:
        return f"Error initializing DB: {str(e)}"

if __name__ == "__main__":
        app.run(debug=True)
