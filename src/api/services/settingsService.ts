// ─────────────────────────────────────────────────────────
// Settings Service — system config, info, updates
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  SystemSettings,
  SystemInfo,
} from '../types';

const SETTINGS = '/settings';

const settingsService = {
  /**
   * GET /settings
   * Fetch all system settings (model, notifications, security, system).
   */
  async get(): Promise<SystemSettings> {
    const { data } = await apiClient.get<ApiResponse<SystemSettings>>(
      SETTINGS,
    );
    return data.data;
  },

  /**
   * PUT /settings
   * Save the entire settings object (full replacement).
   */
  async save(payload: SystemSettings): Promise<SystemSettings> {
    const { data } = await apiClient.put<ApiResponse<SystemSettings>>(
      SETTINGS,
      payload,
    );
    return data.data;
  },

  /**
   * GET /settings/system-info
   * Get system version, uptime, runtime info.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    const { data } = await apiClient.get<ApiResponse<SystemInfo>>(
      `${SETTINGS}/system-info`,
    );
    return data.data;
  },

  /**
   * POST /settings/check-updates
   * Check for available system updates.
   */
  async checkForUpdates(): Promise<{
    update_available: boolean;
    latest_version?: string;
    release_notes?: string;
  }> {
    const { data } = await apiClient.post<
      ApiResponse<{
        update_available: boolean;
        latest_version?: string;
        release_notes?: string;
      }>
    >(`${SETTINGS}/check-updates`);
    return data.data;
  },
};

export default settingsService;
