import React, { useState, useEffect } from 'react';
import { TelemetryData } from './types/telemetry';
import { unifyTelemetryData } from './utils/unifier';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { FlashMessage } from './components/FlashMessage';
import { Activity } from 'lucide-react';

interface FlashMsg {
  message: string;
  type: 'success' | 'error' | 'warning';
}

function App() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [flashMessage, setFlashMessage] = useState<FlashMsg | null>(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showFlashMessage = (message: string, type: 'success' | 'error' | 'warning') => {
    setFlashMessage({ message, type });
  };

  const handleFilesUploaded = async (files: File[]) => {
    setIsProcessing(true);
    
    try {
      const allData: any[] = [];
      
      for (const file of files) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        
        // Handle both single objects and arrays
        if (Array.isArray(parsed)) {
          allData.push(...parsed);
        } else {
          allData.push(parsed);
        }
      }
      
      const unified = unifyTelemetryData(allData);
      setTelemetryData(prev => [...prev, ...unified]);
      
      showFlashMessage(
        `Successfully processed ${unified.length} records from ${files.length} file(s)`,
        'success'
      );
    } catch (error) {
      console.error('Error processing files:', error);
      showFlashMessage('Error processing files. Please check the format and try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = (data: TelemetryData[]) => {
    if (data.length === 0) {
      showFlashMessage('No data to export', 'warning');
      return;
    }

    const headers = [
      'Device ID',
      'Device Type',
      'Location',
      'Status',
      'Temperature (°C)',
      'Vibration',
      'Duration (seconds)',
      'Start Time',
      'End Time',
      'Timestamp'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.device_id,
        item.device_type,
        item.location,
        item.status,
        item.temperature,
        item.vibration,
        item.duration,
        new Date(item.start_time).toISOString(),
        new Date(item.end_time).toISOString(),
        new Date(item.timestamp).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showFlashMessage(`Exported ${data.length} records to CSV`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
      
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Telemetry Unifier
              </h1>
            </div>
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FileUpload onFilesUploaded={handleFilesUploaded} isProcessing={isProcessing} />
          
          {telemetryData.length > 0 && (
            <Dashboard data={telemetryData} onExportCSV={handleExportCSV} />
          )}
          
          {telemetryData.length === 0 && !isProcessing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <Activity className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Data Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your telemetry JSON files to get started with data analysis and visualization.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;