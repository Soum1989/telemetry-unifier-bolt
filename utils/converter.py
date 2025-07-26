# utils/converter.py

from datetime import datetime

def convert_json_files(data1, data2):
    unified_data = []

    for item in data1:
        unified_data.append({
            "device_id": item.get("deviceID"),
            "location": item.get("location"),
            "timestamp": datetime.fromtimestamp(item.get("timestamp") / 1000.0),
            "start_time": datetime.fromtimestamp(item.get("startTime") / 1000.0),
            "end_time": datetime.fromtimestamp(item.get("endTime") / 1000.0),
            "status": item.get("status"),
            "temperature": item.get("temperature"),
            "duration": item.get("duration"),
            "vibration": item.get("vibration"),
        })

    for item in data2:
        unified_data.append({
            "device_id": item.get("device", {}).get("id"),
            "location": item.get("device", {}).get("location"),
            "timestamp": datetime.fromisoformat(item.get("timestamp")),
            "start_time": datetime.fromisoformat(item.get("start")),
            "end_time": datetime.fromisoformat(item.get("end")),
            "status": item.get("data", {}).get("status"),
            "temperature": item.get("data", {}).get("temp"),
            "duration": item.get("data", {}).get("duration"),
            "vibration": item.get("data", {}).get("vibration"),
        })

    return unified_data


