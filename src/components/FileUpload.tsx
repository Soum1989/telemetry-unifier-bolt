import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, isProcessing }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/json' || file.name.endsWith('.json')
    );
    if (files.length > 0) {
      onFilesUploaded(files);
    }
  }, [onFilesUploaded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUploaded(files);
    }
  }, [onFilesUploaded]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Upload Telemetry Files
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isProcessing
            ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            : 'border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
        
        <Upload className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {isProcessing ? 'Processing Files...' : 'Upload JSON Files'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Drag and drop your telemetry JSON files here, or click to browse
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span>Supports multiple JSON files</span>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Supported Formats:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Format 1: deviceID, operationStatus, temp fields</li>
              <li>Format 2: device.id, data.status, data.temperature fields</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};