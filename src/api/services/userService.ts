// ─────────────────────────────────────────────────────────
// User Service — CRUD, activate/deactivate users
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  UserListParams,
  UserRecord,
  CreateUserRequest,
  UpdateUserRequest,
} from '../types';

const USERS = '/users';

const userService = {
  /**
   * GET /users?page=&pageSize=&role=&isActive=&search=&sortBy=&sortOrder=
   * Paginated list of users with optional filters.
   */
  async list(params?: UserListParams): Promise<PaginatedResponse<UserRecord>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<UserRecord>>>(
      USERS,
      { params },
    );
    return data.data;
  },

  /**
   * GET /users/:id
   * Get a single user by ID.
   */
  async getById(userId: string): Promise<UserRecord> {
    const { data } = await apiClient.get<ApiResponse<UserRecord>>(
      `${USERS}/${userId}`,
    );
    return data.data;
  },

  /**
   * POST /users
   * Create a new user account.
   */
  async create(payload: CreateUserRequest): Promise<UserRecord> {
    const { data } = await apiClient.post<ApiResponse<UserRecord>>(
      USERS,
      payload,
    );
    return data.data;
  },

  /**
   * PATCH /users/:id
   * Update user fields (name, email, role, department).
   */
  async update(
    userId: string,
    payload: UpdateUserRequest,
  ): Promise<UserRecord> {
    const { data } = await apiClient.patch<ApiResponse<UserRecord>>(
      `${USERS}/${userId}`,
      payload,
    );
    return data.data;
  },

  /**
   * PATCH /users/:id/toggle-active
   * Toggle a user's isActive status.
   */
  async toggleActive(userId: string): Promise<UserRecord> {
    const { data } = await apiClient.patch<ApiResponse<UserRecord>>(
      `${USERS}/${userId}/toggle-active`,
    );
    return data.data;
  },

  /**
   * DELETE /users/:id
   * Remove a user account.
   */
  async delete(userId: string): Promise<void> {
    await apiClient.delete(`${USERS}/${userId}`);
  },
};

export default userService;
