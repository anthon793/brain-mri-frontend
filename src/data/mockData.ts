import {
  HiOutlineSquares2X2,
  HiOutlineArrowUpTray,
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineFolderOpen,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import type {
  User,
  NavItem,
  MRIScan,
  TrainingMetrics,
  DatasetItem,
  Notification,
  Report,
} from '../types';

// ─── Mock Users ───────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'usr-001',
    name: 'Dr. Alexander Reid',
    email: 'admin@neuroscan.ai',
    password: 'admin123',
    role: 'super_admin',
    avatar: 'AR',
    department: 'Neurology & AI Research',
    isActive: true,
    lastLogin: '2026-02-26T08:30:00Z',
  },
  {
    id: 'usr-002',
    name: 'Dr. Sarah Chen',
    email: 'radiologist@neuroscan.ai',
    password: 'radio123',
    role: 'radiologist',
    avatar: 'SC',
    department: 'Diagnostic Radiology',
    isActive: true,
    lastLogin: '2026-02-26T07:15:00Z',
  },
  {
    id: 'usr-003',
    name: 'Dr. James Miller',
    email: 'researcher@neuroscan.ai',
    password: 'research123',
    role: 'researcher',
    avatar: 'JM',
    department: 'AI Research Lab',
    isActive: true,
    lastLogin: '2026-02-25T16:45:00Z',
  },
  {
    id: 'usr-004',
    name: 'Dr. Emily Park',
    email: 'emily.park@neuroscan.ai',
    password: 'emily123',
    role: 'radiologist',
    avatar: 'EP',
    department: 'Neuroradiology',
    isActive: true,
    lastLogin: '2026-02-24T11:20:00Z',
  },
  {
    id: 'usr-005',
    name: 'Dr. Michael Torres',
    email: 'michael.torres@neuroscan.ai',
    password: 'michael123',
    role: 'researcher',
    avatar: 'MT',
    department: 'Computational Neuroscience',
    isActive: false,
    lastLogin: '2026-02-20T09:00:00Z',
  },
];

// ─── Navigation Items ────────────────────────────────────
export const navigationItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: HiOutlineSquares2X2,
    roles: ['super_admin', 'radiologist', 'researcher'],
  },
  {
    path: '/dashboard/upload',
    label: 'Upload MRI',
    icon: HiOutlineArrowUpTray,
    roles: ['super_admin', 'radiologist'],
  },
  {
    path: '/dashboard/training',
    label: 'Model Training',
    icon: HiOutlineCpuChip,
    roles: ['super_admin'],
  },
  {
    path: '/dashboard/datasets',
    label: 'Dataset Manager',
    icon: HiOutlineCircleStack,
    roles: ['super_admin'],
  },
  {
    path: '/dashboard/metrics',
    label: 'Evaluation Metrics',
    icon: HiOutlineChartBar,
    roles: ['super_admin', 'researcher'],
  },
  {
    path: '/dashboard/reports',
    label: 'Reports',
    icon: HiOutlineDocumentText,
    roles: ['super_admin', 'radiologist', 'researcher'],
  },
  {
    path: '/dashboard/patients',
    label: 'Patient Records',
    icon: HiOutlineFolderOpen,
    roles: ['super_admin'],
  },
  {
    path: '/dashboard/users',
    label: 'User Management',
    icon: HiOutlineUserGroup,
    roles: ['super_admin'],
  },
  {
    path: '/dashboard/settings',
    label: 'System Settings',
    icon: HiOutlineCog6Tooth,
    roles: ['super_admin'],
  },
];

// ─── Mock MRI Scans ──────────────────────────────────────
export const mockScans: MRIScan[] = [
  {
    id: 'MRI-2026-001',
    patientId: 'P-10482',
    patientName: 'John Anderson',
    date: '2026-02-26',
    status: 'completed',
    tumorDetected: true,
    confidence: 0.946,
    tumorType: 'Glioma',
    location: 'Left Temporal Lobe',
    uploadedBy: 'Dr. Sarah Chen',
  },
  {
    id: 'MRI-2026-002',
    patientId: 'P-10483',
    patientName: 'Maria Garcia',
    date: '2026-02-26',
    status: 'completed',
    tumorDetected: false,
    confidence: 0.982,
    uploadedBy: 'Dr. Sarah Chen',
  },
  {
    id: 'MRI-2026-003',
    patientId: 'P-10484',
    patientName: 'Robert Lee',
    date: '2026-02-25',
    status: 'completed',
    tumorDetected: true,
    confidence: 0.873,
    tumorType: 'Meningioma',
    location: 'Right Frontal Lobe',
    uploadedBy: 'Dr. Emily Park',
  },
  {
    id: 'MRI-2026-004',
    patientId: 'P-10485',
    patientName: 'Lisa Thompson',
    date: '2026-02-25',
    status: 'completed',
    tumorDetected: true,
    confidence: 0.918,
    tumorType: 'Pituitary',
    location: 'Sella Turcica',
    uploadedBy: 'Dr. Sarah Chen',
  },
  {
    id: 'MRI-2026-005',
    patientId: 'P-10486',
    patientName: 'David Wilson',
    date: '2026-02-24',
    status: 'processing',
    tumorDetected: false,
    confidence: 0,
    uploadedBy: 'Dr. Alexander Reid',
  },
  {
    id: 'MRI-2026-006',
    patientId: 'P-10487',
    patientName: 'Jennifer Brown',
    date: '2026-02-24',
    status: 'completed',
    tumorDetected: false,
    confidence: 0.991,
    uploadedBy: 'Dr. Emily Park',
  },
  {
    id: 'MRI-2026-007',
    patientId: 'P-10488',
    patientName: 'Michael Davis',
    date: '2026-02-23',
    status: 'completed',
    tumorDetected: true,
    confidence: 0.889,
    tumorType: 'Glioblastoma',
    location: 'Right Parietal Lobe',
    uploadedBy: 'Dr. Sarah Chen',
  },
  {
    id: 'MRI-2026-008',
    patientId: 'P-10489',
    patientName: 'Susan Martinez',
    date: '2026-02-23',
    status: 'pending',
    tumorDetected: false,
    confidence: 0,
    uploadedBy: 'Dr. Alexander Reid',
  },
];

// ─── Mock Training History ───────────────────────────────
export const mockTrainingHistory: TrainingMetrics[] = Array.from({ length: 50 }, (_, i) => {
  const epoch = i + 1;
  const progress = epoch / 50;
  return {
    epoch,
    precision: Math.min(0.95, 0.45 + progress * 0.5 + (Math.random() - 0.5) * 0.03),
    recall: Math.min(0.93, 0.40 + progress * 0.53 + (Math.random() - 0.5) * 0.04),
    mAP50: Math.min(0.94, 0.38 + progress * 0.56 + (Math.random() - 0.5) * 0.03),
    mAP5095: Math.min(0.72, 0.20 + progress * 0.52 + (Math.random() - 0.5) * 0.02),
    f1: Math.min(0.94, 0.42 + progress * 0.52 + (Math.random() - 0.5) * 0.03),
    boxLoss: Math.max(0.02, 0.12 - progress * 0.10 + (Math.random() - 0.5) * 0.01),
    clsLoss: Math.max(0.01, 0.08 - progress * 0.07 + (Math.random() - 0.5) * 0.008),
    dflLoss: Math.max(0.008, 0.06 - progress * 0.05 + (Math.random() - 0.5) * 0.005),
  };
});

// ─── Mock Datasets ───────────────────────────────────────
export const mockDatasets: DatasetItem[] = [
  {
    id: 'ds-001',
    name: 'Brain Tumor MRI Dataset v3.2',
    size: '2.4 GB',
    images: 3264,
    annotations: 3264,
    uploadDate: '2026-02-20',
    status: 'ready',
    format: 'YOLO',
  },
  {
    id: 'ds-002',
    name: 'Glioma Segmentation Set',
    size: '1.8 GB',
    images: 2150,
    annotations: 2150,
    uploadDate: '2026-02-18',
    status: 'ready',
    format: 'YOLO',
  },
  {
    id: 'ds-003',
    name: 'Multi-class Tumor Dataset',
    size: '4.1 GB',
    images: 5820,
    annotations: 5820,
    uploadDate: '2026-02-15',
    status: 'ready',
    format: 'COCO',
  },
  {
    id: 'ds-004',
    name: 'Meningioma Validation Set',
    size: '890 MB',
    images: 1240,
    annotations: 1240,
    uploadDate: '2026-02-10',
    status: 'processing',
    format: 'YOLO',
  },
  {
    id: 'ds-005',
    name: 'Pituitary Tumor Collection',
    size: '1.2 GB',
    images: 1680,
    annotations: 1680,
    uploadDate: '2026-02-08',
    status: 'ready',
    format: 'YOLO',
  },
];

// ─── Mock Notifications ──────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: 'n-001',
    title: 'New MRI Uploaded',
    message: 'Patient P-10486 MRI scan is being processed',
    time: '5 min ago',
    read: false,
    type: 'info',
  },
  {
    id: 'n-002',
    title: 'Tumor Detected',
    message: 'High-confidence glioma detected in scan MRI-2026-001',
    time: '23 min ago',
    read: false,
    type: 'warning',
  },
  {
    id: 'n-003',
    title: 'Training Complete',
    message: 'YOLOv8 model training finished — mAP@50: 0.912',
    time: '1 hour ago',
    read: true,
    type: 'success',
  },
  {
    id: 'n-004',
    title: 'System Update',
    message: 'NeuroScan AI v2.4.1 has been deployed',
    time: '3 hours ago',
    read: true,
    type: 'info',
  },
];

// ─── Mock Reports ────────────────────────────────────────
export const mockReports: Report[] = [
  {
    id: 'rpt-001',
    title: 'Weekly Detection Summary',
    type: 'detection',
    date: '2026-02-26',
    generatedBy: 'Dr. Alexander Reid',
    size: '2.4 MB',
  },
  {
    id: 'rpt-002',
    title: 'Model Performance Report — Feb 2026',
    type: 'training',
    date: '2026-02-25',
    generatedBy: 'System',
    size: '1.8 MB',
  },
  {
    id: 'rpt-003',
    title: 'Evaluation Benchmark v3.2',
    type: 'evaluation',
    date: '2026-02-22',
    generatedBy: 'Dr. James Miller',
    size: '3.1 MB',
  },
  {
    id: 'rpt-004',
    title: 'Monthly Scan Analytics',
    type: 'detection',
    date: '2026-02-20',
    generatedBy: 'System',
    size: '4.5 MB',
  },
  {
    id: 'rpt-005',
    title: 'Cross-validation Results',
    type: 'evaluation',
    date: '2026-02-18',
    generatedBy: 'Dr. James Miller',
    size: '2.2 MB',
  },
];

// ─── Chart Data: Scans Per Day ───────────────────────────
export const scansPerDayData = [
  { name: 'Mon', scans: 12, tumors: 4 },
  { name: 'Tue', scans: 19, tumors: 7 },
  { name: 'Wed', scans: 15, tumors: 5 },
  { name: 'Thu', scans: 22, tumors: 8 },
  { name: 'Fri', scans: 18, tumors: 6 },
  { name: 'Sat', scans: 8, tumors: 3 },
  { name: 'Sun', scans: 6, tumors: 2 },
];

// ─── Chart Data: Tumor Types ─────────────────────────────
export const tumorTypeData = [
  { name: 'Glioma', value: 42, fill: '#0F4C81' },
  { name: 'Meningioma', value: 28, fill: '#3B82F6' },
  { name: 'Pituitary', value: 18, fill: '#10B981' },
  { name: 'No Tumor', value: 12, fill: '#94A3B8' },
];

// ─── Chart Data: Precision-Recall Curve ──────────────────
export const precisionRecallData = Array.from({ length: 20 }, (_, i) => {
  const recall = (i + 1) / 20;
  const precision = Math.max(0.5, 1 - recall * 0.45 + (Math.random() - 0.5) * 0.05);
  return { recall: parseFloat(recall.toFixed(2)), precision: parseFloat(precision.toFixed(3)) };
});

// ─── Chart Data: Confusion Matrix ────────────────────────
export const confusionMatrixData = {
  labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
  matrix: [
    [89, 3, 2, 6],
    [4, 85, 5, 6],
    [2, 4, 88, 6],
    [3, 2, 3, 92],
  ],
};

// ─── Chart Data: Loss Over Epochs ────────────────────────
export const lossData = mockTrainingHistory.map((m) => ({
  epoch: m.epoch,
  boxLoss: parseFloat(m.boxLoss.toFixed(4)),
  clsLoss: parseFloat(m.clsLoss.toFixed(4)),
  dflLoss: parseFloat(m.dflLoss.toFixed(4)),
}));

// ─── Dashboard Stats ─────────────────────────────────────
export const dashboardStats = {
  totalScans: 1284,
  tumorsDetected: 467,
  avgConfidence: 0.912,
  modelMAP: 0.918,
  scansToday: 22,
  pendingReview: 8,
};
