# api/unify.py

import os
import json
from flask import Blueprint, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
from utils.converter import convert_json_files
from models import db, TelemetryData as Telemetry

unify_routes = Blueprint('unify_routes', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'json'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@unify_routes.route('/', methods=['GET', 'POST'])
def upload_files():
    if request.method == 'POST':
        if 'file1' not in request.files or 'file2' not in request.files:
            flash('Missing file(s)')
            return redirect(request.url)

        file1 = request.files['file1']
        file2 = request.files['file2']

        if file1.filename == '' or file2.filename == '':
            flash('No file selected')
            return redirect(request.url)

        if file1 and allowed_file(file1.filename) and file2 and allowed_file(file2.filename):
            filename1 = secure_filename(file1.filename)
            filename2 = secure_filename(file2.filename)
            path1 = os.path.join(UPLOAD_FOLDER, filename1)
            path2 = os.path.join(UPLOAD_FOLDER, filename2)

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file1.save(path1)
            file2.save(path2)

            try:
                unified_data = convert_json_files(path1, path2)

                for entry in unified_data:
                    telemetry = Telemetry(**entry)
                    db.session.add(telemetry)

                db.session.commit()
                flash('Files successfully uploaded and data unified!', 'success')
                return redirect(url_for('dashboard_routes.dashboard'))
            except Exception as e:
                flash(f'Error processing files: {str(e)}', 'danger')
                return redirect(request.url)

        else:
            flash('Invalid file format. Only .json allowed.', 'danger')
            return redirect(request.url)

    return redirect(url_for('dashboard_routes.dashboard'))
