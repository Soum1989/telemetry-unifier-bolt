import React, { useState, useMemo } from 'react';
import { TelemetryData, FilterOptions } from '../types/telemetry';
import { FilterPanel } from './FilterPanel';
import { DataTable } from './DataTable';
import { Charts } from './Charts';
import { Download, BarChart3, Table } from 'lucide-react';

interface DashboardProps {
  data: TelemetryData[];
  onExportCSV: (data: TelemetryData[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onExportCSV }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    statusFilter: '',
    temperatureMin: 0,
    temperatureMax: 100,
    durationMin: 0,
    durationMax: 86400,
    dateStart: '',
    dateEnd: '',
  });

  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Text search
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        if (!item.device_id.toLowerCase().includes(searchLower) &&
            !item.location.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.statusFilter && item.status !== filters.statusFilter) {
        return false;
      }

      // Temperature range
      if (item.temperature < filters.temperatureMin || item.temperature > filters.temperatureMax) {
        return false;
      }

      // Duration range
      if (item.duration < filters.durationMin || item.duration > filters.durationMax) {
        return false;
      }

      // Date range
      if (filters.dateStart) {
        const startDate = new Date(filters.dateStart).getTime();
        if (item.timestamp < startDate) return false;
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd).getTime() + 86400000; // Add 24 hours
        if (item.timestamp > endDate) return false;
      }

      return true;
    });
  }, [data, filters]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Telemetry Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredData.length} of {data.length} records
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Table className="w-4 h-4 mr-1 inline" />
                Table
              </button>
              <button
                onClick={() => setViewMode('charts')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'charts'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-1 inline" />
                Charts
              </button>
            </div>
            
            <button
              onClick={() => onExportCSV(filteredData)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <FilterPanel filters={filters} onFiltersChange={setFilters} />
      </div>

      {viewMode === 'table' ? (
        <DataTable data={filteredData} />
      ) : (
        <Charts data={filteredData} />
      )}
    </div>
  );
};