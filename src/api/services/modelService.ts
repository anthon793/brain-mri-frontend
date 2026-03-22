// ─────────────────────────────────────────────────────────
// Model Service — evaluation metrics, PR curve, confusion
// matrix, loss history, model info & weights
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  ModelInfo,
  ModelMetricsSummary,
  PRCurvePoint,
  ConfusionMatrix,
  LossHistoryPoint,
} from '../types';

const MODELS = '/models';

const modelService = {
  /**
   * GET /models
   * List available trained models.
   */
  async list(): Promise<ModelInfo[]> {
    const { data } = await apiClient.get<ApiResponse<ModelInfo[]>>(MODELS);
    return data.data;
  },

  /**
   * GET /models/:id
   * Retrieve architecture details, training config, version info.
   */
  async getInfo(modelId: string): Promise<ModelInfo> {
    const { data } = await apiClient.get<ApiResponse<ModelInfo>>(
      `${MODELS}/${modelId}`,
    );
    return data.data;
  },

  /**
   * GET /models/:id/metrics
   * Summary metrics: precision, recall, mAP@50, mAP@50-95, F1.
   */
  async getMetrics(modelId: string): Promise<ModelMetricsSummary> {
    const { data } = await apiClient.get<ApiResponse<ModelMetricsSummary>>(
      `${MODELS}/${modelId}/metrics`,
    );
    return data.data;
  },

  /**
   * GET /models/:id/pr-curve
   * Array of (recall, precision) points for the PR curve chart.
   */
  async getPRCurve(modelId: string): Promise<PRCurvePoint[]> {
    const { data } = await apiClient.get<ApiResponse<PRCurvePoint[]>>(
      `${MODELS}/${modelId}/pr-curve`,
    );
    return data.data;
  },

  /**
   * GET /models/:id/confusion-matrix
   * Confusion matrix labels + percentage grid.
   */
  async getConfusionMatrix(modelId: string): Promise<ConfusionMatrix> {
    const { data } = await apiClient.get<ApiResponse<ConfusionMatrix>>(
      `${MODELS}/${modelId}/confusion-matrix`,
    );
    return data.data;
  },

  /**
   * GET /models/:id/loss-history
   * Per-epoch loss values: box, classification, DFL.
   */
  async getLossHistory(modelId: string): Promise<LossHistoryPoint[]> {
    const { data } = await apiClient.get<ApiResponse<LossHistoryPoint[]>>(
      `${MODELS}/${modelId}/loss-history`,
    );
    return data.data;
  },

  /**
   * GET /models/:id/weights
   * Download trained model weights (.pt file) as a Blob.
   */
  async downloadWeights(modelId: string): Promise<Blob> {
    const response = await apiClient.get(`${MODELS}/${modelId}/weights`, {
      responseType: 'blob',
      timeout: 300_000, // 5 min
    });
    return response.data;
  },

  /**
   * DELETE /models/:id
   * Delete a model and its artifacts.
   */
  async delete(modelId: string): Promise<void> {
    await apiClient.delete(`${MODELS}/${modelId}`);
  },
};

export default modelService;
