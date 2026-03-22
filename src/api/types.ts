// ─────────────────────────────────────────────────────────
// API Request / Response types for all backend endpoints
// ─────────────────────────────────────────────────────────

import type { UserRole } from '../types';

// ─── Generic ─────────────────────────────────────────────

/** Standard envelope returned by every API response */
export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data: T;
}

/** Paginated list responses */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Generic query params for list endpoints */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** File upload progress callback */
export type UploadProgressCallback = (progress: number) => void;

// ─── Auth ────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  isActive: boolean;
  lastLogin: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Dashboard ───────────────────────────────────────────

export interface DashboardStats {
  totalScans: number;
  tumorsDetected: number;
  avgConfidence: number;
  activeModels: number;
  pendingReviews: number;
  totalPatients: number;
}

export interface WeeklyActivityParams {
  startDate?: string; // ISO date
  endDate?: string;
}

export interface WeeklyActivityPoint {
  day: string;
  scans: number;
  detections: number;
}

export interface TumorDistribution {
  type: string;
  percentage: number;
  count: number;
  color: string;
}

// ─── Scans / MRI Upload ──────────────────────────────────

export interface ScanListParams extends PaginationParams {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  tumorDetected?: boolean;
  patientId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ScanRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tumorDetected: boolean;
  confidence: number;
  tumorType?: string;
  location?: string;
  uploadedBy: string;
  imageUrl?: string;
  annotatedImageUrl?: string;
}

export interface UploadScanRequest {
  patientId: string;
  file: File;
}

export interface UploadScanResponse {
  scanId: string;
  status: 'pending';
  uploadedAt: string;
}

export interface DetectionRequest {
  scanId: string;
  modelId?: string; // which model version to use
}

export interface DetectionResult {
  scanId: string;
  tumorDetected: boolean;
  confidence: number;
  tumorType: string;
  location: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  processingTime: number; // milliseconds
  modelVersion: string;
  annotatedImageUrl: string;
}

// ─── Training ────────────────────────────────────────────

export interface StartTrainingRequest {
  epochs: number;
  batchSize: number;
  imgSize: number;
  learningRate: number;
  model: string;
  datasetId: string;
}

export interface TrainingJob {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'stopped';
  config: StartTrainingRequest;
  startedAt: string;
  completedAt?: string;
  currentEpoch: number;
  totalEpochs: number;
  progress: number; // 0-100
}

export interface TrainingEpochMetrics {
  epoch: number;
  precision: number;
  recall: number;
  mAP50: number;
  mAP5095: number;
  f1: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
  elapsedTime: number; // seconds
}

export interface TrainingLogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface TrainingHistoryParams extends PaginationParams {
  status?: TrainingJob['status'];
}

// ─── Datasets ────────────────────────────────────────────

export interface DatasetListParams extends PaginationParams {
  format?: string;
  status?: 'ready' | 'processing' | 'error';
}

export interface DatasetRecord {
  id: string;
  name: string;
  size: string;
  images: number;
  annotations: number;
  uploadDate: string;
  status: 'ready' | 'processing' | 'error';
  format: string;
  description?: string;
  classes?: string[];
}

export interface CreateDatasetRequest {
  name: string;
  format: 'YOLO' | 'COCO' | 'VOC';
  description?: string;
  file: File;
}

export interface DatasetSummary {
  totalDatasets: number;
  totalImages: number;
  totalAnnotations: number;
}

// ─── Model / Evaluation Metrics ──────────────────────────

export interface ModelInfo {
  id: string;
  name: string;
  architecture: string;
  parameters: string;
  flops: string;
  inputSize: string;
  classes: string[];
  datasetName: string;
  epochs: number;
  batchSize: number;
  optimizer: string;
  trainingTime: string;
  version: string;
  createdAt: string;
}

export interface ModelMetricsSummary {
  precision: number;
  recall: number;
  mAP50: number;
  mAP5095: number;
  f1: number;
}

export interface PRCurvePoint {
  recall: number;
  precision: number;
}

export interface ConfusionMatrix {
  labels: string[];
  matrix: number[][]; // percentages
}

export interface LossHistoryPoint {
  epoch: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
}

// ─── Reports ─────────────────────────────────────────────

export interface ReportListParams extends PaginationParams {
  type?: 'detection' | 'training' | 'evaluation';
}

export interface ReportRecord {
  id: string;
  title: string;
  type: 'detection' | 'training' | 'evaluation';
  date: string;
  generatedBy: string;
  size: string;
  downloadUrl: string;
}

export interface GenerateReportRequest {
  type: 'pdf' | 'csv';
  title?: string;
  scanIds?: string[];
  trainingJobId?: string;
  dateRange?: { start: string; end: string };
}

export interface GenerateReportResponse {
  reportId: string;
  status: 'generating' | 'ready';
  estimatedTime?: number; // seconds
  downloadUrl?: string;
}

// ─── Users ───────────────────────────────────────────────

export interface UserListParams extends PaginationParams {
  role?: UserRole;
  isActive?: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
}

// ─── Patients ────────────────────────────────────────────

export interface PatientListParams extends PaginationParams {
  status?: 'active' | 'discharged' | 'referred';
}

export interface PatientRecord {
  id: string;
  fileNo: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  height: string;
  weight: string;
  bmi: number;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  primaryPhysician: string;
  registrationDate: string;
  lastVisit: string;
  status: 'active' | 'discharged' | 'referred';
  insuranceProvider: string;
  insuranceId: string;
  mriScans: number;
  diagnosis: string;
  notes: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  height: string;
  weight: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  primaryPhysician: string;
  insuranceProvider: string;
  insuranceId: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  status?: 'active' | 'discharged' | 'referred';
  diagnosis?: string;
}

export interface PatientClinicalNote {
  id: string;
  patientId: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface AddClinicalNoteRequest {
  patientId: string;
  content: string;
}

// ─── Notifications ───────────────────────────────────────

export interface NotificationListParams {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// ─── System Settings ─────────────────────────────────────

export interface SystemSettings {
  model: {
    confidenceThreshold: number;
    iouThreshold: number;
    maxDetections: number;
    enableGPU: boolean;
    autoRetrain: boolean;
    retrainThreshold: number;
  };
  notifications: {
    emailAlerts: boolean;
    scanCompletionNotify: boolean;
    trainingCompletionNotify: boolean;
    systemAlerts: boolean;
  };
  security: {
    sessionTimeout: number;
    mfaEnabled: boolean;
    passwordExpiry: number;
    ipWhitelisting: boolean;
  };
  system: {
    darkMode: boolean;
    autoBackup: boolean;
    backupFrequency: string;
    logLevel: string;
    maintenanceMode: boolean;
  };
}

export interface SystemInfo {
  version: string;
  runtimeVersion: string;
  lastUpdated: string;
  uptime: string;
  updateAvailable: boolean;
  latestVersion?: string;
}
