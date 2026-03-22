import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineCpuChip,
  HiOutlineSignal,
  HiOutlineViewfinderCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineChartPie,
  HiOutlineClock,
  HiOutlineCommandLine,
} from 'react-icons/hi2';
import { mockTrainingHistory } from '../../data/mockData';
import { trainingService } from '../../api';
import type { TrainingMetrics } from '../../types';

const ModelTraining: React.FC = () => {
  const [epochs, setEpochs] = useState(50);
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingData, setTrainingData] = useState<TrainingMetrics[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const latestMetrics = trainingData.length > 0 ? trainingData[trainingData.length - 1] : null;

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingData([]);
    setLogs([
      `[${new Date().toLocaleTimeString()}] Initializing YOLOv8n model...`,
      `[${new Date().toLocaleTimeString()}] Loading brain tumor dataset (3,264 images)...`,
      `[${new Date().toLocaleTimeString()}] Model: YOLOv8n | Image Size: 640 | Batch: 16 | Epochs: ${epochs}`,
      `[${new Date().toLocaleTimeString()}] Training started...`,
    ]);

    let epoch = 0;
    const interval = setInterval(() => {
      epoch++;
      if (epoch > epochs) {
        clearInterval(interval);
        setIsTraining(false);
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ✅ Training complete! Best mAP@50: ${(mockTrainingHistory[Math.min(epoch - 2, 49)]?.mAP50 * 100 || 91.2).toFixed(1)}%`,
          `[${new Date().toLocaleTimeString()}] Model saved to: runs/detect/brain_tumor_v3/weights/best.pt`,
        ]);
        return;
      }

      const idx = Math.min(epoch - 1, mockTrainingHistory.length - 1);
      const scaledMetric = { ...mockTrainingHistory[idx], epoch };
      setCurrentEpoch(epoch);
      setTrainingData((prev) => [...prev, scaledMetric]);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Epoch ${epoch}/${epochs} — loss: ${scaledMetric.boxLoss.toFixed(4)} | P: ${(scaledMetric.precision * 100).toFixed(1)}% | R: ${(scaledMetric.recall * 100).toFixed(1)}% | mAP@50: ${(scaledMetric.mAP50 * 100).toFixed(1)}%`,
      ]);
    }, 300);

    return () => clearInterval(interval);
  };

  const stopTraining = () => {
    setIsTraining(false);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ⚠️ Training stopped by user at epoch ${currentEpoch}`,
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Model Training</h1>
        <p className="text-gray-500 mt-1">Train and fine-tune the YOLOv8 tumor detection model.</p>
      </div>

      {/* Training Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Training Configuration</h3>
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Epochs</label>
            <select
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              disabled={isTraining}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-50"
            >
              {[10, 25, 50, 100, 150, 200].map((v) => (
                <option key={v} value={v}>{v} epochs</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Batch Size</label>
            <select
              disabled={isTraining}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-50"
              defaultValue="16"
            >
              {[8, 16, 32, 64].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image Size</label>
            <select
              disabled={isTraining}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-50"
              defaultValue="640"
            >
              {[320, 416, 512, 640].map((v) => (
                <option key={v} value={v}>{v}×{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
            <select
              disabled={isTraining}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-50"
              defaultValue="yolov8n"
            >
              <option value="yolov8n">YOLOv8n (Nano)</option>
              <option value="yolov8s">YOLOv8s (Small)</option>
              <option value="yolov8m">YOLOv8m (Medium)</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        {(isTraining || currentEpoch > 0) && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isTraining ? 'Training in Progress...' : 'Training Complete'}
              </span>
              <span className="text-sm font-semibold text-primary-600">
                {currentEpoch}/{epochs} epochs ({((currentEpoch / epochs) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-bar-fill ${isTraining ? 'animate-pulse' : ''}`}
                style={{ width: `${(currentEpoch / epochs) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isTraining ? (
            <button
              onClick={startTraining}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
            >
              <HiOutlinePlay className="w-4 h-4" />
              Start Training
            </button>
          ) : (
            <button
              onClick={stopTraining}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/25"
            >
              <HiOutlineStop className="w-4 h-4" />
              Stop Training
            </button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      {latestMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Precision', value: `${(latestMetrics.precision * 100).toFixed(1)}%`, icon: HiOutlineViewfinderCircle, color: 'text-blue-600 bg-blue-50' },
            { label: 'Recall', value: `${(latestMetrics.recall * 100).toFixed(1)}%`, icon: HiOutlineSignal, color: 'text-green-600 bg-green-50' },
            { label: 'mAP@50', value: `${(latestMetrics.mAP50 * 100).toFixed(1)}%`, icon: HiOutlineArrowTrendingUp, color: 'text-purple-600 bg-purple-50' },
            { label: 'mAP@50:95', value: `${(latestMetrics.mAP5095 * 100).toFixed(1)}%`, icon: HiOutlineChartPie, color: 'text-amber-600 bg-amber-50' },
            { label: 'F1 Score', value: `${(latestMetrics.f1 * 100).toFixed(1)}%`, icon: HiOutlineCpuChip, color: 'text-red-600 bg-red-50' },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.color}`}>
                  <m.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-500">{m.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Training Chart + Logs */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Training Metrics</h3>
          {trainingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="epoch"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'Epoch', position: 'bottom', offset: -5, style: { fontSize: 12, fill: '#64748b' } }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => (val * 100).toFixed(1) + '%'}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line type="monotone" dataKey="precision" stroke="#3B82F6" strokeWidth={2} dot={false} name="Precision" />
                <Line type="monotone" dataKey="recall" stroke="#10B981" strokeWidth={2} dot={false} name="Recall" />
                <Line type="monotone" dataKey="mAP50" stroke="#8B5CF6" strokeWidth={2} dot={false} name="mAP@50" />
                <Line type="monotone" dataKey="f1" stroke="#EF4444" strokeWidth={2} dot={false} name="F1" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <HiOutlineArrowTrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start training to see metrics</p>
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="bg-gray-900 rounded-xl p-4 shadow-card overflow-hidden flex flex-col max-h-[420px]">
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <HiOutlineCommandLine className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-300">Training Logs</span>
            {isTraining && (
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-400 font-medium">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin font-mono text-xs space-y-0.5">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <p key={i} className="text-gray-400 leading-relaxed">
                  {log}
                </p>
              ))
            ) : (
              <p className="text-gray-600 italic">No training logs yet...</p>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
