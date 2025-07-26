export interface TelemetryData {
  id: string;
  device_id: string;
  device_type: string;
  location: string;
  timestamp: number;
  start_time: number;
  end_time: number;
  status: string;
  temperature: number;
  duration: number;
  vibration: number;
}

export interface TelemetryFormat1 {
  deviceID: string;
  deviceType: string;
  location: string;
  timestamp: number;
  startTime: number;
  endTime: number;
  operationStatus: string;
  temp: number;
  vibration: number;
}

export interface TelemetryFormat2 {
  device: {
    id: string;
    type: string;
  };
  startTime: string;
  endTime: string;
  timestamp: string;
  country: string;
  state: string;
  plant: string;
  block: string;
  data: {
    status: string;
    temperature: number;
    vibration: number;
  };
}

export interface FilterOptions {
  searchText: string;
  statusFilter: string;
  temperatureMin: number;
  temperatureMax: number;
  durationMin: number;
  durationMax: number;
  dateStart: string;
  dateEnd: string;
}