// ─────────────────────────────────────────────────────────
// Report Service — generate, list, download reports
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  ReportListParams,
  ReportRecord,
  GenerateReportRequest,
  GenerateReportResponse,
} from '../types';

const REPORTS = '/reports';

const reportService = {
  /**
   * GET /reports?page=&pageSize=&type=&search=&sortBy=&sortOrder=
   * Paginated list of generated reports with optional type filter.
   */
  async list(
    params?: ReportListParams,
  ): Promise<PaginatedResponse<ReportRecord>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<ReportRecord>>>(
      REPORTS,
      { params },
    );
    return data.data;
  },

  /**
   * GET /reports/:id
   * Get metadata for a single report.
   */
  async getById(reportId: string): Promise<ReportRecord> {
    const { data } = await apiClient.get<ApiResponse<ReportRecord>>(
      `${REPORTS}/${reportId}`,
    );
    return data.data;
  },

  /**
   * POST /reports/generate
   * Generate a new report (PDF diagnostic summary or CSV export).
   * Returns a report ID and status. Poll or use WebSocket for completion.
   */
  async generate(
    payload: GenerateReportRequest,
  ): Promise<GenerateReportResponse> {
    const { data } = await apiClient.post<ApiResponse<GenerateReportResponse>>(
      `${REPORTS}/generate`,
      payload,
    );
    return data.data;
  },

  /**
   * GET /reports/:id/status
   * Check generation status of a report being built.
   */
  async getStatus(
    reportId: string,
  ): Promise<GenerateReportResponse> {
    const { data } = await apiClient.get<ApiResponse<GenerateReportResponse>>(
      `${REPORTS}/${reportId}/status`,
    );
    return data.data;
  },

  /**
   * GET /reports/:id/download
   * Download a generated report file as a Blob.
   */
  async download(reportId: string): Promise<Blob> {
    const response = await apiClient.get(`${REPORTS}/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * DELETE /reports/:id
   * Delete a generated report.
   */
  async delete(reportId: string): Promise<void> {
    await apiClient.delete(`${REPORTS}/${reportId}`);
  },
};

export default reportService;
