import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { HiOutlineChartBar, HiOutlineViewfinderCircle, HiOutlineSignal, HiOutlineArrowTrendingUp, HiOutlineChartPie } from 'react-icons/hi2';
import {
  precisionRecallData as mockPRData,
  confusionMatrixData as mockConfusionData,
  lossData as mockLossData,
  mockTrainingHistory,
} from '../../data/mockData';
import { modelService } from '../../api';

const EvaluationMetrics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'pr' | 'loss' | 'confusion'>('pr');

  // API state with mock fallback
  const [precisionRecallData, setPrecisionRecallData] = useState(mockPRData);
  const [confusionMatrixData, setConfusionMatrixData] = useState(mockConfusionData);
  const [lossData, setLossData] = useState(mockLossData);

  const [lastMetric, setLastMetric] = useState(mockTrainingHistory[mockTrainingHistory.length - 1]);

  useEffect(() => {
    const modelId = 'latest'; // Use active model
    modelService.getMetrics(modelId).then((data) => {
      setLastMetric({
        ...mockTrainingHistory[mockTrainingHistory.length - 1],
        precision: data.precision,
        recall: data.recall,
        mAP50: data.mAP50,
        f1: data.f1,
      });
    }).catch(() => {});

    modelService.getPRCurve(modelId).then((data) => {
      setPrecisionRecallData(data.map((p) => ({ recall: p.recall, precision: p.precision })));
    }).catch(() => {});

    modelService.getConfusionMatrix(modelId).then((data) => {
      setConfusionMatrixData({ labels: data.labels, matrix: data.matrix });
    }).catch(() => {});

    modelService.getLossHistory(modelId).then((data) => {
      setLossData(data.map((d) => ({
        epoch: d.epoch, boxLoss: d.boxLoss, clsLoss: d.clsLoss, dflLoss: d.dflLoss,
      })));
    }).catch(() => {});
  }, []);

  const summaryCards = [
    { label: 'Precision', value: `${(lastMetric.precision * 100).toFixed(1)}%`, icon: HiOutlineViewfinderCircle, color: 'bg-blue-50 text-blue-600' },
    { label: 'Recall', value: `${(lastMetric.recall * 100).toFixed(1)}%`, icon: HiOutlineSignal, color: 'bg-green-50 text-green-600' },
    { label: 'mAP@50', value: `${(lastMetric.mAP50 * 100).toFixed(1)}%`, icon: HiOutlineArrowTrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'F1 Score', value: `${(lastMetric.f1 * 100).toFixed(1)}%`, icon: HiOutlineChartPie, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evaluation Metrics</h1>
        <p className="text-gray-500 mt-1">
          Comprehensive model evaluation with precision-recall curves, confusion matrix, and loss analysis.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-1">
          {[
            { key: 'pr', label: 'Precision-Recall Curve' },
            { key: 'loss', label: 'Loss Graph' },
            { key: 'confusion', label: 'Confusion Matrix' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedMetric(tab.key as 'pr' | 'loss' | 'confusion')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === tab.key
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Precision-Recall Curve */}
          {selectedMetric === 'pr' && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">Precision-Recall Curve</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Shows the trade-off between precision and recall at various thresholds.
                  AUC = 0.912
                </p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={precisionRecallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="recall"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    label={{ value: 'Recall', position: 'bottom', offset: -5, style: { fontSize: 13, fill: '#64748b' } }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    domain={[0.4, 1]}
                    label={{ value: 'Precision', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 13, fill: '#64748b' } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                    formatter={(val: number) => [(val * 100).toFixed(1) + '%']}
                  />
                  <Area
                    type="monotone"
                    dataKey="precision"
                    stroke="#0F4C81"
                    fill="#0F4C81"
                    fillOpacity={0.1}
                    strokeWidth={2.5}
                    dot={{ fill: '#0F4C81', r: 3 }}
                    activeDot={{ r: 5, fill: '#0F4C81' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Loss Graph */}
          {selectedMetric === 'loss' && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">Training Loss Over Epochs</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Box, classification, and DFL loss curves showing model convergence.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lossData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="epoch"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    label={{ value: 'Epoch', position: 'bottom', offset: -5, style: { fontSize: 13, fill: '#64748b' } }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="boxLoss" stroke="#EF4444" strokeWidth={2} dot={false} name="Box Loss" />
                  <Line type="monotone" dataKey="clsLoss" stroke="#3B82F6" strokeWidth={2} dot={false} name="Cls Loss" />
                  <Line type="monotone" dataKey="dflLoss" stroke="#10B981" strokeWidth={2} dot={false} name="DFL Loss" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Confusion Matrix */}
          {selectedMetric === 'confusion' && (
            <div>
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900">Confusion Matrix</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Classification accuracy breakdown per tumor type. Values shown as percentages.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="inline-block">
                  {/* Column Headers */}
                  <div className="flex ml-[120px] mb-2">
                    {confusionMatrixData.labels.map((label, i) => (
                      <div
                        key={i}
                        className="w-20 text-center text-xs font-semibold text-gray-500"
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Matrix Rows */}
                  {confusionMatrixData.matrix.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-center">
                      <div className="w-[120px] text-right pr-4 text-xs font-semibold text-gray-500">
                        {confusionMatrixData.labels[rowIdx]}
                      </div>
                      {row.map((val, colIdx) => {
                        const isCorrect = rowIdx === colIdx;
                        const intensity = val / 100;
                        return (
                          <div
                            key={colIdx}
                            className={`w-20 h-16 flex items-center justify-center border border-white rounded-lg m-0.5 transition-all hover:scale-105 ${
                              isCorrect ? 'font-bold' : ''
                            }`}
                            style={{
                              backgroundColor: isCorrect
                                ? `rgba(15, 76, 129, ${0.15 + intensity * 0.7})`
                                : `rgba(239, 68, 68, ${0.05 + (val / 100) * 0.3})`,
                              color: isCorrect && intensity > 0.6 ? 'white' : '#1f2937',
                            }}
                          >
                            <span className="text-sm font-semibold">{val}%</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Axis labels */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400 font-medium">Predicted Label</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90">
                <p className="text-xs text-gray-400 font-medium">Actual Label</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Model Information</h4>
            {[
              ['Architecture', 'YOLOv8n (Nano)'],
              ['Parameters', '3.2M'],
              ['FLOPs', '8.7G'],
              ['Input Size', '640 × 640'],
              ['Classes', '3 (Glioma, Meningioma, Pituitary)'],
            ].map(([key, val], i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-sm text-gray-500">{key}</span>
                <span className="text-sm font-medium text-gray-900">{val}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Training Details</h4>
            {[
              ['Dataset', 'Brain Tumor MRI v3.2 (3,264 images)'],
              ['Epochs', '50'],
              ['Batch Size', '16'],
              ['Optimizer', 'SGD (lr=0.01)'],
              ['Training Time', '2h 14m'],
            ].map(([key, val], i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-sm text-gray-500">{key}</span>
                <span className="text-sm font-medium text-gray-900">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationMetrics;
