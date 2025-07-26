# api/dashboard.py

from flask import Blueprint, render_template, request
from models import TelemetryData as Telemetry
from sqlalchemy import or_

dashboard_routes = Blueprint('dashboard_routes', __name__)

@dashboard_routes.route('/dashboard', methods=['GET'])
def dashboard():
    query = Telemetry.query

    # Apply search filter
    search = request.args.get('search')
    if search:
        query = query.filter(
            or_(
                Telemetry.device_id.ilike(f'%{search}%'),
                Telemetry.location.ilike(f'%{search}%')
            )
        )

    # Filter: status
    status = request.args.get('status')
    if status:
        query = query.filter_by(status=status)

    # Filter: temperature range
    temp_min = request.args.get('temp_min')
    temp_max = request.args.get('temp_max')
    if temp_min and temp_max:
        query = query.filter(Telemetry.temperature.between(float(temp_min), float(temp_max)))

    # Filter: duration range
    duration_min = request.args.get('duration_min')
    duration_max = request.args.get('duration_max')
    if duration_min and duration_max:
        query = query.filter(Telemetry.duration.between(float(duration_min), float(duration_max)))

    # Filter: date range
    date_start = request.args.get('date_start')
    date_end = request.args.get('date_end')
    if date_start and date_end:
        query = query.filter(Telemetry.timestamp.between(date_start, date_end))

    telemetry_data = query.all()

    # Data for charts
    line_chart_data = [
        {"timestamp": t.timestamp.isoformat(), "temperature": t.temperature}
        for t in telemetry_data
    ]
    bar_chart_data = {}
    for t in telemetry_data:
        key = f"{t.status}_{int(t.temperature)}"
        bar_chart_data[key] = bar_chart_data.get(key, 0) + 1

    bar_chart_data_list = [
        {"label": k, "count": v} for k, v in bar_chart_data.items()
    ]

    return render_template(
        'dashboard.html',
        telemetry_data=telemetry_data,
        line_chart_data=line_chart_data,
        bar_chart_data=bar_chart_data_list,
        filters=request.args
    )
