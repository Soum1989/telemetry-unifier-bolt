import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TelemetryData } from '../types/telemetry';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  data: TelemetryData[];
}

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  // Temperature over time line chart
  const temperatureData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map(item => item.temperature),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  // Status distribution bar chart
  const statusCounts = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Count',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // green for healthy
          'rgba(239, 68, 68, 0.8)',   // red for overheating/failure
          'rgba(245, 158, 11, 0.8)',  // yellow for maintenance
          'rgba(156, 163, 175, 0.8)', // gray for others
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No data available for charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Temperature Over Time
        </h3>
        <div className="h-80">
          <Line data={temperatureData} options={{ ...chartOptions, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Status Distribution
          </h3>
          <div className="h-64">
            <Bar data={statusData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Data Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Total Records:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Avg Temperature:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Avg Vibration:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(data.reduce((sum, item) => sum + item.vibration, 0) / data.length).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Devices:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Set(data.map(item => item.device_id)).size}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};