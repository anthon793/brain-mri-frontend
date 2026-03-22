import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  HiOutlineSparkles,
  HiOutlineViewfinderCircle,
  HiOutlineSignal,
  HiOutlineArrowTrendingUp,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowUpRight,
} from 'react-icons/hi2';
import { LuBrain } from 'react-icons/lu';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../context/AuthContext';
import {
  dashboardStats as mockDashboardStats,
  scansPerDayData as mockScansPerDay,
  tumorTypeData as mockTumorType,
  mockScans as mockScansFallback,
} from '../../data/mockData';
import { dashboardService, scanService } from '../../api';
import type { DashboardStats, WeeklyActivityPoint, TumorDistribution, ScanRecord } from '../../api/types';

const Overview: React.FC = () => {
  const { user } = useAuth();

  // API state with mock fallback
  const [dashboardStats, setDashboardStats] = useState(mockDashboardStats);
  const [scansPerDayData, setScansPerDayData] = useState(mockScansPerDay);
  const [tumorTypeData, setTumorTypeData] = useState(mockTumorType);
  const [mockScans, setMockScans] = useState(mockScansFallback);

  useEffect(() => {
    // Fetch from API, fall back to mock data silently
    dashboardService.getStats().then((data) => {
      setDashboardStats({
        totalScans: data.totalScans,
        tumorsDetected: data.tumorsDetected,
        avgConfidence: data.avgConfidence,
        modelMAP: 0.912,
        scansToday: 22,
        pendingReview: data.pendingReviews,
      });
    }).catch(() => { /* use mock fallback */ });

    dashboardService.getWeeklyActivity().then((data) => {
      setScansPerDayData(data.map((d) => ({ name: d.day, scans: d.scans, tumors: d.detections })));
    }).catch(() => {});

    dashboardService.getTumorDistribution().then((data) => {
      setTumorTypeData(data.map((d) => ({ name: d.type, value: d.percentage, fill: d.color })));
    }).catch(() => {});

    scanService.list({ page: 1, pageSize: 6, sortBy: 'date', sortOrder: 'desc' }).then((data) => {
      setMockScans(data.items.map((s) => ({
        id: s.id, patientId: s.patientId, patientName: s.patientName,
        date: s.date, status: s.status as any, tumorDetected: s.tumorDetected,
        confidence: s.confidence, tumorType: s.tumorType, location: s.location,
        uploadedBy: s.uploadedBy,
      })));
    }).catch(() => {});
  }, []);

  const statusColor: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name}. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total MRI Scans"
          value={dashboardStats.totalScans.toLocaleString()}
          icon={LuBrain}
          color="blue"
          trend={{ value: 12.5, label: 'vs last month' }}
        />
        <StatCard
          title="Tumors Detected"
          value={dashboardStats.tumorsDetected.toLocaleString()}
          icon={HiOutlineViewfinderCircle}
          color="red"
          trend={{ value: 8.2, label: 'vs last month' }}
        />
        <StatCard
          title="Avg Confidence"
          value={`${(dashboardStats.avgConfidence * 100).toFixed(1)}%`}
          icon={HiOutlineSignal}
          color="green"
          trend={{ value: 2.1, label: 'vs last month' }}
        />
        <StatCard
          title="Model mAP@50"
          value={`${(dashboardStats.modelMAP * 100).toFixed(1)}%`}
          icon={HiOutlineArrowTrendingUp}
          color="purple"
          trend={{ value: 1.4, label: 'vs last version' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scans Per Day - Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Weekly Scan Activity</h3>
              <p className="text-sm text-gray-500 mt-0.5">Scans processed vs tumors detected</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <span className="text-gray-500">Scans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-gray-500">Tumors</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scansPerDayData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="scans" fill="#0F4C81" radius={[6, 6, 0, 0]} />
              <Bar dataKey="tumors" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tumor Types - Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-card">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Tumor Classification</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution by type</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={tumorTypeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {tumorTypeData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {tumorTypeData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats + Recent Scans */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiOutlineClock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Scans Today</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{dashboardStats.scansToday}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiOutlineExclamationCircle className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Pending Review</span>
              </div>
              <span className="text-lg font-bold text-amber-600">{dashboardStats.pendingReview}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Detection Rate</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {((dashboardStats.tumorsDetected / dashboardStats.totalScans) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Confidence Trend */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Confidence Trend</h4>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart
                data={[
                  { day: 'M', conf: 89 },
                  { day: 'T', conf: 91 },
                  { day: 'W', conf: 88 },
                  { day: 'T', conf: 93 },
                  { day: 'F', conf: 92 },
                  { day: 'S', conf: 90 },
                  { day: 'S', conf: 94 },
                ]}
              >
                <Line
                  type="monotone"
                  dataKey="conf"
                  stroke="#0F4C81"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val}%`, 'Confidence']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Scans Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Scans</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest MRI scan results</p>
            </div>
            <button className="text-sm font-medium text-primary-500 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View All <HiOutlineArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Patient
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Scan ID
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Result
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockScans.slice(0, 6).map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{scan.patientName}</p>
                        <p className="text-xs text-gray-400">{scan.patientId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-gray-600 font-mono">{scan.id}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor[scan.status]}`}
                      >
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {scan.status === 'completed' ? (
                        <span
                          className={`text-sm font-medium ${
                            scan.tumorDetected ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {scan.tumorDetected ? scan.tumorType : 'No Tumor'}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      {scan.confidence > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${scan.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">
                            {(scan.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
