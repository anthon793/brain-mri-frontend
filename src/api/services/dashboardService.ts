// ─────────────────────────────────────────────────────────
// Dashboard Service — aggregate stats, charts, activity
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  DashboardStats,
  WeeklyActivityParams,
  WeeklyActivityPoint,
  TumorDistribution,
} from '../types';

const DASHBOARD = '/dashboard';

const dashboardService = {
  /**
   * GET /dashboard/stats
   * Aggregate counts: total scans, tumors detected,
   * avg confidence, active models, pending reviews, total patients.
   */
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>(
      `${DASHBOARD}/stats`,
    );
    return data.data;
  },

  /**
   * GET /dashboard/weekly-activity?startDate=&endDate=
   * Scan activity grouped by day for the bar chart.
   */
  async getWeeklyActivity(
    params?: WeeklyActivityParams,
  ): Promise<WeeklyActivityPoint[]> {
    const { data } = await apiClient.get<ApiResponse<WeeklyActivityPoint[]>>(
      `${DASHBOARD}/weekly-activity`,
      { params },
    );
    return data.data;
  },

  /**
   * GET /dashboard/tumor-distribution
   * Tumor type percentage breakdown for the pie chart.
   */
  async getTumorDistribution(): Promise<TumorDistribution[]> {
    const { data } = await apiClient.get<ApiResponse<TumorDistribution[]>>(
      `${DASHBOARD}/tumor-distribution`,
    );
    return data.data;
  },
};

export default dashboardService;
