// ─────────────────────────────────────────────────────────
// Barrel export — single import for all API services
//
// Usage:
//   import { authService, scanService } from '@/api';
//   import api from '@/api';
//   api.scans.list({ page: 1 });
// ─────────────────────────────────────────────────────────

export { default as apiClient } from './client';
export { getToken, setToken, getRefreshToken, setRefreshToken, clearTokens } from './client';

// Services
export { default as authService } from './services/authService';
export { default as dashboardService } from './services/dashboardService';
export { default as scanService } from './services/scanService';
export { default as trainingService } from './services/trainingService';
export { default as datasetService } from './services/datasetService';
export { default as modelService } from './services/modelService';
export { default as reportService } from './services/reportService';
export { default as userService } from './services/userService';
export { default as patientService } from './services/patientService';
export { default as notificationService } from './services/notificationService';
export { default as settingsService } from './services/settingsService';

// Grouped namespace
import authService from './services/authService';
import dashboardService from './services/dashboardService';
import scanService from './services/scanService';
import trainingService from './services/trainingService';
import datasetService from './services/datasetService';
import modelService from './services/modelService';
import reportService from './services/reportService';
import userService from './services/userService';
import patientService from './services/patientService';
import notificationService from './services/notificationService';
import settingsService from './services/settingsService';

const api = {
  auth: authService,
  dashboard: dashboardService,
  scans: scanService,
  training: trainingService,
  datasets: datasetService,
  models: modelService,
  reports: reportService,
  users: userService,
  patients: patientService,
  notifications: notificationService,
  settings: settingsService,
} as const;

export default api;

// Re-export all types
export type * from './types';
