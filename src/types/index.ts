import { IconType } from 'react-icons';

// ─── Roles ────────────────────────────────────────────────
export type UserRole = 'super_admin' | 'radiologist' | 'researcher';

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  radiologist: 'Radiologist',
  researcher: 'Researcher',
};

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; dot: string }> = {
  super_admin: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  radiologist: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  researcher: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
};

// ─── User ─────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
}

// ─── Navigation ───────────────────────────────────────────
export interface NavItem {
  path: string;
  label: string;
  icon: IconType;
  roles: UserRole[];
  badge?: string;
}

// ─── MRI Scan ─────────────────────────────────────────────
export interface MRIScan {
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
}

// ─── Training ─────────────────────────────────────────────
export interface TrainingMetrics {
  epoch: number;
  precision: number;
  recall: number;
  mAP50: number;
  mAP5095: number;
  f1: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  imgSize: number;
  learningRate: number;
  model: string;
}

// ─── Dataset ──────────────────────────────────────────────
export interface DatasetItem {
  id: string;
  name: string;
  size: string;
  images: number;
  annotations: number;
  uploadDate: string;
  status: 'ready' | 'processing' | 'error';
  format: string;
}

// ─── Notification ─────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// ─── Report ───────────────────────────────────────────────
export interface Report {
  id: string;
  title: string;
  type: 'detection' | 'training' | 'evaluation';
  date: string;
  generatedBy: string;
  size: string;
}

// ─── Chart Data ───────────────────────────────────────────
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
