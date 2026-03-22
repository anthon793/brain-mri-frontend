// ─────────────────────────────────────────────────────────
// Scan Service — upload MRI, run detection, list scans
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  ScanListParams,
  ScanRecord,
  UploadScanResponse,
  DetectionRequest,
  DetectionResult,
  UploadProgressCallback,
} from '../types';

const SCANS = '/scans';

const scanService = {
  /**
   * GET /scans?page=&pageSize=&status=&patientId=&search=&sortBy=&sortOrder=
   * Paginated list of MRI scans with optional filters.
   */
  async list(params?: ScanListParams): Promise<PaginatedResponse<ScanRecord>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<ScanRecord>>>(
      SCANS,
      { params },
    );
    return data.data;
  },

  /**
   * GET /scans/:id
   * Get a single scan record by ID.
   */
  async getById(scanId: string): Promise<ScanRecord> {
    const { data } = await apiClient.get<ApiResponse<ScanRecord>>(
      `${SCANS}/${scanId}`,
    );
    return data.data;
  },

  /**
   * POST /scans/upload
   * Upload a new MRI image file (multipart/form-data).
   * Accepts JPEG, PNG, DICOM — max 50 MB.
   */
  async upload(
    file: File,
    patientId: string,
    onProgress?: UploadProgressCallback,
  ): Promise<UploadScanResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);

    const { data } = await apiClient.post<ApiResponse<UploadScanResponse>>(
      `${SCANS}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000, // 2 min for large files
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      },
    );
    return data.data;
  },

  /**
   * POST /scans/:id/detect
   * Trigger YOLOv8 inference on an uploaded scan.
   * Optionally specify which model version to use.
   */
  async runDetection(payload: DetectionRequest): Promise<DetectionResult> {
    const { data } = await apiClient.post<ApiResponse<DetectionResult>>(
      `${SCANS}/${payload.scanId}/detect`,
      { modelId: payload.modelId },
    );
    return data.data;
  },

  /**
   * GET /scans/:id/result
   * Fetch the detection result for a previously processed scan.
   */
  async getDetectionResult(scanId: string): Promise<DetectionResult> {
    const { data } = await apiClient.get<ApiResponse<DetectionResult>>(
      `${SCANS}/${scanId}/result`,
    );
    return data.data;
  },

  /**
   * GET /scans/:id/annotated
   * Download the annotated image with bounding boxes as a Blob.
   */
  async downloadAnnotated(scanId: string): Promise<Blob> {
    const response = await apiClient.get(`${SCANS}/${scanId}/annotated`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * DELETE /scans/:id
   * Delete a scan record and its associated files.
   */
  async delete(scanId: string): Promise<void> {
    await apiClient.delete(`${SCANS}/${scanId}`);
  },
};

export default scanService;
