import { TelemetryData, TelemetryFormat1, TelemetryFormat2 } from '../types/telemetry';
import { v4 as uuidv4 } from 'uuid';

export const isFormat1 = (data: any): data is TelemetryFormat1 => {
  return data.deviceID && data.operationStatus && data.temp !== undefined;
};

export const isFormat2 = (data: any): data is TelemetryFormat2 => {
  return data.device && data.device.id && data.data && data.data.temperature !== undefined;
};

export const unifyFormat1 = (data: TelemetryFormat1): TelemetryData => {
  const duration = (data.endTime - data.startTime) / 1000; // Convert to seconds
  
  return {
    id: uuidv4(),
    device_id: data.deviceID,
    device_type: data.deviceType,
    location: data.location,
    timestamp: data.timestamp,
    start_time: data.startTime,
    end_time: data.endTime,
    status: data.operationStatus,
    temperature: data.temp,
    duration,
    vibration: data.vibration,
  };
};

export const unifyFormat2 = (data: TelemetryFormat2): TelemetryData => {
  const startTime = new Date(data.startTime).getTime();
  const endTime = new Date(data.endTime).getTime();
  const timestamp = new Date(data.timestamp).getTime();
  const duration = (endTime - startTime) / 1000; // Convert to seconds
  
  const location = `${data.country}/${data.state}/${data.plant}/${data.block}`;
  
  return {
    id: uuidv4(),
    device_id: data.device.id,
    device_type: data.device.type,
    location,
    timestamp,
    start_time: startTime,
    end_time: endTime,
    status: data.data.status,
    temperature: data.data.temperature,
    duration,
    vibration: data.data.vibration,
  };
};

export const unifyTelemetryData = (jsonData: any[]): TelemetryData[] => {
  const unified: TelemetryData[] = [];
  
  for (const item of jsonData) {
    try {
      if (isFormat1(item)) {
        unified.push(unifyFormat1(item));
      } else if (isFormat2(item)) {
        unified.push(unifyFormat2(item));
      } else {
        console.warn('Unknown data format:', item);
      }
    } catch (error) {
      console.error('Error unifying data:', error, item);
    }
  }
  
  return unified;
};