import React from 'react';
import { IconType } from 'react-icons';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown, HiOutlineMinus } from 'react-icons/hi2';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const colorMap = {
  blue: {
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  green: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  red: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  purple: {
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-card hover:shadow-elevated transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.value > 0 ? (
                <HiOutlineArrowTrendingUp className={`w-3.5 h-3.5 ${c.trendUp}`} />
              ) : trend.value < 0 ? (
                <HiOutlineArrowTrendingDown className={`w-3.5 h-3.5 ${c.trendDown}`} />
              ) : (
                <HiOutlineMinus className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trend.value > 0 ? c.trendUp : trend.value < 0 ? c.trendDown : 'text-gray-400'
                }`}
              >
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`${c.iconBg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${c.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
