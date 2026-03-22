// ─────────────────────────────────────────────────────────
// Domain-specific hooks — one per service, with typed
// convenience wrappers around the generic useApi hook.
// ─────────────────────────────────────────────────────────

import { useCallback } from 'react';
import { useApi } from './useApi';

import { authService } from '../api';
import { dashboardService } from '../api';
import { scanService } from '../api';
import { trainingService } from '../api';
import { datasetService } from '../api';
import { modelService } from '../api';
import { reportService } from '../api';
import { userService } from '../api';
import { patientService } from '../api';
import { notificationService } from '../api';
import { settingsService } from '../api';

import type {
  LoginRequest,
  LoginResponse,
  AuthUser,
  DashboardStats,
  WeeklyActivityParams,
  WeeklyActivityPoint,
  TumorDistribution,
  PaginatedResponse,
  ScanRecord,
  ScanListParams,
  UploadScanResponse,
  DetectionResult,
  TrainingJob,
  StartTrainingRequest,
  TrainingEpochMetrics,
  TrainingLogEntry,
  TrainingHistoryParams,
  DatasetRecord,
  DatasetListParams,
  DatasetSummary,
  CreateDatasetRequest,
  ModelInfo,
  ModelMetricsSummary,
  PRCurvePoint,
  ConfusionMatrix,
  LossHistoryPoint,
  ReportRecord,
  ReportListParams,
  GenerateReportRequest,
  GenerateReportResponse,
  UserRecord,
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
  PatientRecord,
  PatientListParams,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientClinicalNote,
  NotificationRecord,
  NotificationListParams,
  SystemSettings,
  SystemInfo,
  UploadProgressCallback,
} from '../api/types';

// ─── Auth ────────────────────────────────────────────────

export function useLogin() {
  const hook = useApi<LoginResponse>(authService.login);
  return {
    ...hook,
    login: (payload: LoginRequest) => hook.execute(payload),
  };
}

export function useCurrentUser() {
  const hook = useApi<AuthUser>(authService.getCurrentUser);
  return {
    ...hook,
    fetchUser: () => hook.execute(),
  };
}

export function useForgotPassword() {
  const hook = useApi<void>(authService.forgotPassword);
  return {
    ...hook,
    sendResetEmail: (email: string) => hook.execute({ email }),
  };
}

// ─── Dashboard ───────────────────────────────────────────

export function useDashboardStats() {
  const hook = useApi<DashboardStats>(dashboardService.getStats);
  return {
    ...hook,
    fetchStats: () => hook.execute(),
  };
}

export function useWeeklyActivity() {
  const hook = useApi<WeeklyActivityPoint[]>(dashboardService.getWeeklyActivity);
  return {
    ...hook,
    fetchActivity: (params?: WeeklyActivityParams) => hook.execute(params),
  };
}

export function useTumorDistribution() {
  const hook = useApi<TumorDistribution[]>(dashboardService.getTumorDistribution);
  return {
    ...hook,
    fetchDistribution: () => hook.execute(),
  };
}

// ─── Scans ───────────────────────────────────────────────

export function useScanList() {
  const hook = useApi<PaginatedResponse<ScanRecord>>(scanService.list);
  return {
    ...hook,
    fetchScans: (params?: ScanListParams) => hook.execute(params),
  };
}

export function useScanDetail() {
  const hook = useApi<ScanRecord>(scanService.getById);
  return {
    ...hook,
    fetchScan: (scanId: string) => hook.execute(scanId),
  };
}

export function useUploadScan() {
  const hook = useApi<UploadScanResponse>(
    (file: File, patientId: string, onProgress?: UploadProgressCallback) =>
      scanService.upload(file, patientId, onProgress),
  );
  return {
    ...hook,
    upload: (file: File, patientId: string, onProgress?: UploadProgressCallback) =>
      hook.execute(file, patientId, onProgress),
  };
}

export function useRunDetection() {
  const hook = useApi<DetectionResult>(scanService.runDetection);
  return {
    ...hook,
    detect: (scanId: string, modelId?: string) =>
      hook.execute({ scanId, modelId }),
  };
}

export function useDetectionResult() {
  const hook = useApi<DetectionResult>(scanService.getDetectionResult);
  return {
    ...hook,
    fetchResult: (scanId: string) => hook.execute(scanId),
  };
}

// ─── Training ────────────────────────────────────────────

export function useStartTraining() {
  const hook = useApi<TrainingJob>(trainingService.start);
  return {
    ...hook,
    startTraining: (payload: StartTrainingRequest) => hook.execute(payload),
  };
}

export function useStopTraining() {
  const hook = useApi<TrainingJob>(trainingService.stop);
  return {
    ...hook,
    stopTraining: (jobId: string) => hook.execute(jobId),
  };
}

export function useTrainingJob() {
  const hook = useApi<TrainingJob>(trainingService.getJob);
  return {
    ...hook,
    fetchJob: (jobId: string) => hook.execute(jobId),
  };
}

export function useTrainingMetrics() {
  const hook = useApi<TrainingEpochMetrics[]>(trainingService.getMetrics);
  return {
    ...hook,
    fetchMetrics: (jobId: string) => hook.execute(jobId),
  };
}

export function useTrainingLogs() {
  const hook = useApi<TrainingLogEntry[]>(trainingService.getLogs);
  return {
    ...hook,
    fetchLogs: (jobId: string) => hook.execute(jobId),
  };
}

export function useTrainingHistory() {
  const hook = useApi<PaginatedResponse<TrainingJob>>(trainingService.history);
  return {
    ...hook,
    fetchHistory: (params?: TrainingHistoryParams) => hook.execute(params),
  };
}

/**
 * SSE hook — returns a subscribe function that returns an EventSource.
 * The caller manages the EventSource lifecycle.
 */
export function useTrainingStream() {
  const subscribe = useCallback((jobId: string) => {
    return trainingService.subscribeToJob(jobId);
  }, []);
  return { subscribe };
}

// ─── Datasets ────────────────────────────────────────────

export function useDatasetList() {
  const hook = useApi<PaginatedResponse<DatasetRecord>>(datasetService.list);
  return {
    ...hook,
    fetchDatasets: (params?: DatasetListParams) => hook.execute(params),
  };
}

export function useDatasetSummary() {
  const hook = useApi<DatasetSummary>(datasetService.getSummary);
  return {
    ...hook,
    fetchSummary: () => hook.execute(),
  };
}

export function useCreateDataset() {
  const hook = useApi<DatasetRecord>(
    (payload: CreateDatasetRequest, onProgress?: UploadProgressCallback) =>
      datasetService.create(payload, onProgress),
  );
  return {
    ...hook,
    createDataset: (payload: CreateDatasetRequest, onProgress?: UploadProgressCallback) =>
      hook.execute(payload, onProgress),
  };
}

export function useDeleteDataset() {
  const hook = useApi<void>(datasetService.delete);
  return {
    ...hook,
    deleteDataset: (datasetId: string) => hook.execute(datasetId),
  };
}

// ─── Models / Evaluation ─────────────────────────────────

export function useModelList() {
  const hook = useApi<ModelInfo[]>(modelService.list);
  return {
    ...hook,
    fetchModels: () => hook.execute(),
  };
}

export function useModelInfo() {
  const hook = useApi<ModelInfo>(modelService.getInfo);
  return {
    ...hook,
    fetchInfo: (modelId: string) => hook.execute(modelId),
  };
}

export function useModelMetrics() {
  const hook = useApi<ModelMetricsSummary>(modelService.getMetrics);
  return {
    ...hook,
    fetchMetrics: (modelId: string) => hook.execute(modelId),
  };
}

export function usePRCurve() {
  const hook = useApi<PRCurvePoint[]>(modelService.getPRCurve);
  return {
    ...hook,
    fetchPRCurve: (modelId: string) => hook.execute(modelId),
  };
}

export function useConfusionMatrix() {
  const hook = useApi<ConfusionMatrix>(modelService.getConfusionMatrix);
  return {
    ...hook,
    fetchMatrix: (modelId: string) => hook.execute(modelId),
  };
}

export function useLossHistory() {
  const hook = useApi<LossHistoryPoint[]>(modelService.getLossHistory);
  return {
    ...hook,
    fetchLossHistory: (modelId: string) => hook.execute(modelId),
  };
}

// ─── Reports ─────────────────────────────────────────────

export function useReportList() {
  const hook = useApi<PaginatedResponse<ReportRecord>>(reportService.list);
  return {
    ...hook,
    fetchReports: (params?: ReportListParams) => hook.execute(params),
  };
}

export function useGenerateReport() {
  const hook = useApi<GenerateReportResponse>(reportService.generate);
  return {
    ...hook,
    generateReport: (payload: GenerateReportRequest) => hook.execute(payload),
  };
}

export function useReportStatus() {
  const hook = useApi<GenerateReportResponse>(reportService.getStatus);
  return {
    ...hook,
    checkStatus: (reportId: string) => hook.execute(reportId),
  };
}

// ─── Users ───────────────────────────────────────────────

export function useUserList() {
  const hook = useApi<PaginatedResponse<UserRecord>>(userService.list);
  return {
    ...hook,
    fetchUsers: (params?: UserListParams) => hook.execute(params),
  };
}

export function useCreateUser() {
  const hook = useApi<UserRecord>(userService.create);
  return {
    ...hook,
    createUser: (payload: CreateUserRequest) => hook.execute(payload),
  };
}

export function useUpdateUser() {
  const hook = useApi<UserRecord>(
    (userId: string, payload: UpdateUserRequest) =>
      userService.update(userId, payload),
  );
  return {
    ...hook,
    updateUser: (userId: string, payload: UpdateUserRequest) =>
      hook.execute(userId, payload),
  };
}

export function useToggleUserActive() {
  const hook = useApi<UserRecord>(userService.toggleActive);
  return {
    ...hook,
    toggleActive: (userId: string) => hook.execute(userId),
  };
}

export function useDeleteUser() {
  const hook = useApi<void>(userService.delete);
  return {
    ...hook,
    deleteUser: (userId: string) => hook.execute(userId),
  };
}

// ─── Patients ────────────────────────────────────────────

export function usePatientList() {
  const hook = useApi<PaginatedResponse<PatientRecord>>(patientService.list);
  return {
    ...hook,
    fetchPatients: (params?: PatientListParams) => hook.execute(params),
  };
}

export function usePatientDetail() {
  const hook = useApi<PatientRecord>(patientService.getById);
  return {
    ...hook,
    fetchPatient: (patientId: string) => hook.execute(patientId),
  };
}

export function useCreatePatient() {
  const hook = useApi<PatientRecord>(patientService.create);
  return {
    ...hook,
    createPatient: (payload: CreatePatientRequest) => hook.execute(payload),
  };
}

export function useUpdatePatient() {
  const hook = useApi<PatientRecord>(
    (patientId: string, payload: UpdatePatientRequest) =>
      patientService.update(patientId, payload),
  );
  return {
    ...hook,
    updatePatient: (patientId: string, payload: UpdatePatientRequest) =>
      hook.execute(patientId, payload),
  };
}

export function useDeletePatient() {
  const hook = useApi<void>(patientService.delete);
  return {
    ...hook,
    deletePatient: (patientId: string) => hook.execute(patientId),
  };
}

export function usePatientScans() {
  const hook = useApi<ScanRecord[]>(patientService.getScans);
  return {
    ...hook,
    fetchScans: (patientId: string) => hook.execute(patientId),
  };
}

export function usePatientNotes() {
  const hook = useApi<PatientClinicalNote[]>(patientService.getNotes);
  return {
    ...hook,
    fetchNotes: (patientId: string) => hook.execute(patientId),
  };
}

export function useAddPatientNote() {
  const hook = useApi<PatientClinicalNote>(patientService.addNote);
  return {
    ...hook,
    addNote: (patientId: string, content: string) =>
      hook.execute({ patientId, content }),
  };
}

// ─── Notifications ───────────────────────────────────────

export function useNotificationList() {
  const hook = useApi<PaginatedResponse<NotificationRecord>>(notificationService.list);
  return {
    ...hook,
    fetchNotifications: (params?: NotificationListParams) => hook.execute(params),
  };
}

export function useUnreadCount() {
  const hook = useApi<number>(notificationService.getUnreadCount);
  return {
    ...hook,
    fetchCount: () => hook.execute(),
  };
}

export function useMarkNotificationRead() {
  const hook = useApi<void>(notificationService.markAsRead);
  return {
    ...hook,
    markRead: (notificationId: string) => hook.execute(notificationId),
  };
}

export function useMarkAllNotificationsRead() {
  const hook = useApi<void>(notificationService.markAllAsRead);
  return {
    ...hook,
    markAllRead: () => hook.execute(),
  };
}

// ─── Settings ────────────────────────────────────────────

export function useSystemSettings() {
  const hook = useApi<SystemSettings>(settingsService.get);
  return {
    ...hook,
    fetchSettings: () => hook.execute(),
  };
}

export function useSaveSettings() {
  const hook = useApi<SystemSettings>(settingsService.save);
  return {
    ...hook,
    saveSettings: (payload: SystemSettings) => hook.execute(payload),
  };
}

export function useSystemInfo() {
  const hook = useApi<SystemInfo>(settingsService.getSystemInfo);
  return {
    ...hook,
    fetchInfo: () => hook.execute(),
  };
}

export function useCheckUpdates() {
  const hook = useApi<{ update_available: boolean; latest_version?: string; release_notes?: string }>(
    settingsService.checkForUpdates,
  );
  return {
    ...hook,
    checkUpdates: () => hook.execute(),
  };
}
