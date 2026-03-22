// ─────────────────────────────────────────────────────────
// Patient Service — CRUD, clinical notes, scan history,
// export/print patient files
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  PatientListParams,
  PatientRecord,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientClinicalNote,
  AddClinicalNoteRequest,
  ScanRecord,
} from '../types';

const PATIENTS = '/patients';

const patientService = {
  /**
   * GET /patients?page=&pageSize=&status=&search=&sortBy=&sortOrder=
   * Paginated list of patient records with filters.
   */
  async list(
    params?: PatientListParams,
  ): Promise<PaginatedResponse<PatientRecord>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<PatientRecord>>>(
      PATIENTS,
      { params },
    );
    return data.data;
  },

  /**
   * GET /patients/:id
   * Full patient record with biodata, medical history, etc.
   */
  async getById(patientId: string): Promise<PatientRecord> {
    const { data } = await apiClient.get<ApiResponse<PatientRecord>>(
      `${PATIENTS}/${patientId}`,
    );
    return data.data;
  },

  /**
   * POST /patients
   * Create a new patient record.
   */
  async create(payload: CreatePatientRequest): Promise<PatientRecord> {
    const { data } = await apiClient.post<ApiResponse<PatientRecord>>(
      PATIENTS,
      payload,
    );
    return data.data;
  },

  /**
   * PUT /patients/:id
   * Update an existing patient record.
   */
  async update(
    patientId: string,
    payload: UpdatePatientRequest,
  ): Promise<PatientRecord> {
    const { data } = await apiClient.put<ApiResponse<PatientRecord>>(
      `${PATIENTS}/${patientId}`,
      payload,
    );
    return data.data;
  },

  /**
   * DELETE /patients/:id
   * Delete a patient record.
   */
  async delete(patientId: string): Promise<void> {
    await apiClient.delete(`${PATIENTS}/${patientId}`);
  },

  // ─── Scan History ────────────────────────────────────

  /**
   * GET /patients/:id/scans
   * List all MRI scans associated with a patient.
   */
  async getScans(patientId: string): Promise<ScanRecord[]> {
    const { data } = await apiClient.get<ApiResponse<ScanRecord[]>>(
      `${PATIENTS}/${patientId}/scans`,
    );
    return data.data;
  },

  // ─── Clinical Notes ──────────────────────────────────

  /**
   * GET /patients/:id/notes
   * List all clinical notes for a patient.
   */
  async getNotes(patientId: string): Promise<PatientClinicalNote[]> {
    const { data } = await apiClient.get<ApiResponse<PatientClinicalNote[]>>(
      `${PATIENTS}/${patientId}/notes`,
    );
    return data.data;
  },

  /**
   * POST /patients/:id/notes
   * Add a new clinical note to a patient record.
   */
  async addNote(payload: AddClinicalNoteRequest): Promise<PatientClinicalNote> {
    const { data } = await apiClient.post<ApiResponse<PatientClinicalNote>>(
      `${PATIENTS}/${payload.patientId}/notes`,
      { content: payload.content },
    );
    return data.data;
  },

  // ─── Export ──────────────────────────────────────────

  /**
   * GET /patients/:id/export?format=pdf|csv
   * Export / print patient file as PDF or CSV.
   */
  async exportFile(
    patientId: string,
    format: 'pdf' | 'csv' = 'pdf',
  ): Promise<Blob> {
    const response = await apiClient.get(
      `${PATIENTS}/${patientId}/export`,
      { params: { format }, responseType: 'blob' },
    );
    return response.data;
  },
};

export default patientService;
