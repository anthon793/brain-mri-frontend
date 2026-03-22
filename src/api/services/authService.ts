// ─────────────────────────────────────────────────────────
// Auth Service — login, logout, token refresh, password
// ─────────────────────────────────────────────────────────

import apiClient, { setToken, setRefreshToken, clearTokens } from '../client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  AuthUser,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../types';

const AUTH = '/auth';

const authService = {
  /**
   * POST /auth/login
   * Authenticate user with email & password.
   * Returns JWT tokens + user profile.
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      `${AUTH}/login`,
      payload,
    );
    // Persist tokens
    setToken(data.data.token);
    setRefreshToken(data.data.refreshToken);
    return data.data;
  },

  /**
   * POST /auth/logout
   * Invalidate current session / refresh token server-side.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${AUTH}/logout`);
    } finally {
      clearTokens();
    }
  },

  /**
   * GET /auth/me
   * Validate stored token & retrieve current user profile.
   */
  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>(
      `${AUTH}/me`,
    );
    return data.data;
  },

  /**
   * POST /auth/forgot-password
   * Send password-reset email.
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(`${AUTH}/forgot-password`, payload);
  },

  /**
   * POST /auth/reset-password
   * Reset password using emailed token.
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await apiClient.post(`${AUTH}/reset-password`, payload);
  },

  /**
   * POST /auth/change-password
   * Change password for authenticated user.
   */
  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiClient.post(`${AUTH}/change-password`, payload);
  },
};

export default authService;
