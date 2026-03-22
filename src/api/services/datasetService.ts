// ─────────────────────────────────────────────────────────
// Dataset Service — CRUD operations, upload, download
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  DatasetListParams,
  DatasetRecord,
  CreateDatasetRequest,
  DatasetSummary,
  UploadProgressCallback,
} from '../types';

const DATASETS = '/datasets';

const datasetService = {
  /**
   * GET /datasets?page=&pageSize=&format=&status=&search=&sortBy=&sortOrder=
   * Paginated list of datasets with optional filters.
   */
  async list(
    params?: DatasetListParams,
  ): Promise<PaginatedResponse<DatasetRecord>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<DatasetRecord>>>(
      DATASETS,
      { params },
    );
    return data.data;
  },

  /**
   * GET /datasets/summary
   * Aggregate counts: total datasets, images, annotations.
   */
  async getSummary(): Promise<DatasetSummary> {
    const { data } = await apiClient.get<ApiResponse<DatasetSummary>>(
      `${DATASETS}/summary`,
    );
    return data.data;
  },

  /**
   * GET /datasets/:id
   * Get a single dataset's details.
   */
  async getById(datasetId: string): Promise<DatasetRecord> {
    const { data } = await apiClient.get<ApiResponse<DatasetRecord>>(
      `${DATASETS}/${datasetId}`,
    );
    return data.data;
  },

  /**
   * POST /datasets
   * Upload a new dataset archive (ZIP/TAR.GZ, up to 10 GB).
   * Multipart form: name, format, description, file.
   */
  async create(
    payload: CreateDatasetRequest,
    onProgress?: UploadProgressCallback,
  ): Promise<DatasetRecord> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('format', payload.format);
    if (payload.description) formData.append('description', payload.description);
    formData.append('file', payload.file);

    const { data } = await apiClient.post<ApiResponse<DatasetRecord>>(
      DATASETS,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600_000, // 10 min for large archives
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
   * GET /datasets/:id/download
   * Download a dataset archive as a Blob.
   */
  async download(datasetId: string): Promise<Blob> {
    const response = await apiClient.get(`${DATASETS}/${datasetId}/download`, {
      responseType: 'blob',
      timeout: 600_000,
    });
    return response.data;
  },

  /**
   * DELETE /datasets/:id
   * Delete a dataset and its files.
   */
  async delete(datasetId: string): Promise<void> {
    await apiClient.delete(`${DATASETS}/${datasetId}`);
  },
};

export default datasetService;
