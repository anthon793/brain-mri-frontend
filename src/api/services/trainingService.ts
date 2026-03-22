// ─────────────────────────────────────────────────────────
// Training Service — start/stop jobs, stream metrics/logs
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  StartTrainingRequest,
  TrainingJob,
  TrainingEpochMetrics,
  TrainingLogEntry,
  TrainingHistoryParams,
} from '../types';

const TRAINING = '/training';

const trainingService = {
  /**
   * POST /training/start
   * Kick off a new training job with the given configuration.
   */
  async start(payload: StartTrainingRequest): Promise<TrainingJob> {
    const { data } = await apiClient.post<ApiResponse<TrainingJob>>(
      `${TRAINING}/start`,
      payload,
    );
    return data.data;
  },

  /**
   * POST /training/:id/stop
   * Stop a running training job.
   */
  async stop(jobId: string): Promise<TrainingJob> {
    const { data } = await apiClient.post<ApiResponse<TrainingJob>>(
      `${TRAINING}/${jobId}/stop`,
    );
    return data.data;
  },

  /**
   * GET /training/:id
   * Get the current status and progress of a training job.
   */
  async getJob(jobId: string): Promise<TrainingJob> {
    const { data } = await apiClient.get<ApiResponse<TrainingJob>>(
      `${TRAINING}/${jobId}`,
    );
    return data.data;
  },

  /**
   * GET /training/:id/metrics
   * Retrieve epoch-by-epoch metrics for a training job.
   */
  async getMetrics(jobId: string): Promise<TrainingEpochMetrics[]> {
    const { data } = await apiClient.get<ApiResponse<TrainingEpochMetrics[]>>(
      `${TRAINING}/${jobId}/metrics`,
    );
    return data.data;
  },

  /**
   * GET /training/:id/logs
   * Retrieve training log entries for a job.
   */
  async getLogs(jobId: string): Promise<TrainingLogEntry[]> {
    const { data } = await apiClient.get<ApiResponse<TrainingLogEntry[]>>(
      `${TRAINING}/${jobId}/logs`,
    );
    return data.data;
  },

  /**
   * GET /training/history?page=&pageSize=&status=&sortBy=&sortOrder=
   * Paginated list of past training runs.
   */
  async history(
    params?: TrainingHistoryParams,
  ): Promise<PaginatedResponse<TrainingJob>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<TrainingJob>>>(
      `${TRAINING}/history`,
      { params },
    );
    return data.data;
  },

  /**
   * Connect to a WebSocket / SSE stream for real-time epoch updates.
   * Returns an EventSource instance the caller can listen to.
   *
   * Events emitted:
   *   "metric"  → TrainingEpochMetrics
   *   "log"     → TrainingLogEntry
   *   "status"  → TrainingJob  (status changes)
   *   "done"    → void
   */
  subscribeToJob(jobId: string): EventSource {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    return new EventSource(`${baseUrl}${TRAINING}/${jobId}/stream`);
  },
};

export default trainingService;
