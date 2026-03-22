import React, { useState, useEffect } from 'react';
import {
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlineDocumentPlus,
  HiOutlineTableCells,
  HiOutlineCube,
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineServerStack,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFunnel,
} from 'react-icons/hi2';
import { mockReports } from '../../data/mockData';
import { reportService } from '../../api';
import type { Report } from '../../types';

const Reports: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [generating, setGenerating] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>(mockReports);

  useEffect(() => {
    reportService.list({ page: 1, pageSize: 50 }).then((data) => {
      setReports(data.items.map((r) => ({
        id: r.id, title: r.title, type: r.type,
        date: r.date, generatedBy: r.generatedBy, size: r.size,
      })));
    }).catch(() => { /* use mock fallback */ });
  }, []);

  const filteredReports = reports.filter(
    (r) => filterType === 'all' || r.type === filterType
  );

  const typeConfig: Record<string, { color: string; bg: string }> = {
    detection: { color: 'text-blue-700', bg: 'bg-blue-100' },
    training: { color: 'text-purple-700', bg: 'bg-purple-100' },
    evaluation: { color: 'text-emerald-700', bg: 'bg-emerald-100' },
  };

  const handleGenerate = (type: string) => {
    setGenerating(type);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and export diagnostic reports, model weights, and data.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => handleGenerate('pdf')}
          disabled={generating === 'pdf'}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-card hover:shadow-elevated hover:border-primary-200 transition-all text-left group"
        >
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
            <HiOutlineDocumentText className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Generate PDF Report</h3>
          <p className="text-sm text-gray-500">
            {generating === 'pdf' ? 'Generating...' : 'Create a comprehensive diagnostic summary.'}
          </p>
          {generating === 'pdf' && (
            <div className="mt-3 progress-bar">
              <div className="progress-bar-fill animate-pulse" style={{ width: '70%' }} />
            </div>
          )}
        </button>

        <button
          onClick={() => handleGenerate('model')}
          disabled={generating === 'model'}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-card hover:shadow-elevated hover:border-primary-200 transition-all text-left group"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <HiOutlineCube className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Download Model (.pt)</h3>
          <p className="text-sm text-gray-500">
            {generating === 'model' ? 'Preparing...' : 'Export the trained YOLOv8 model weights.'}
          </p>
          {generating === 'model' && (
            <div className="mt-3 progress-bar">
              <div className="progress-bar-fill animate-pulse" style={{ width: '50%' }} />
            </div>
          )}
        </button>

        <button
          onClick={() => handleGenerate('csv')}
          disabled={generating === 'csv'}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-card hover:shadow-elevated hover:border-primary-200 transition-all text-left group"
        >
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <HiOutlineTableCells className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Export CSV Data</h3>
          <p className="text-sm text-gray-500">
            {generating === 'csv' ? 'Exporting...' : 'Export scan results and metrics as CSV.'}
          </p>
          {generating === 'csv' && (
            <div className="mt-3 progress-bar">
              <div className="progress-bar-fill animate-pulse" style={{ width: '85%' }} />
            </div>
          )}
        </button>
      </div>

      {/* Report History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Report History</h3>
            <p className="text-sm text-gray-500 mt-0.5">Previously generated reports</p>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineFunnel className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="detection">Detection</option>
              <option value="training">Training</option>
              <option value="evaluation">Evaluation</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <HiOutlineDocumentText className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${typeConfig[report.type].bg} ${typeConfig[report.type].color}`}
                    >
                      {report.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiOutlineCalendarDays className="w-3 h-3" /> {report.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiOutlineUser className="w-3 h-3" /> {report.generatedBy}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiOutlineServerStack className="w-3 h-3" /> {report.size}
                    </span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <HiOutlineArrowDownTray className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="py-12 text-center">
            <HiOutlineDocumentText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No reports found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
