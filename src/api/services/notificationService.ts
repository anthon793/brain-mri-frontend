// ─────────────────────────────────────────────────────────
// Notification Service — list, read, mark read/unread
// ─────────────────────────────────────────────────────────

import apiClient from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  NotificationListParams,
  NotificationRecord,
} from '../types';

const NOTIFICATIONS = '/notifications';

const notificationService = {
  /**
   * GET /notifications?unreadOnly=&page=&pageSize=
   * Paginated list of notifications.
   */
  async list(
    params?: NotificationListParams,
  ): Promise<PaginatedResponse<NotificationRecord>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<NotificationRecord>>>(
      NOTIFICATIONS,
      { params },
    );
    return data.data;
  },

  /**
   * GET /notifications/unread-count
   * Quick count of unread notifications for the badge.
   */
  async getUnreadCount(): Promise<number> {
    const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
      `${NOTIFICATIONS}/unread-count`,
    );
    return data.data.count;
  },

  /**
   * PATCH /notifications/:id/read
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${NOTIFICATIONS}/${notificationId}/read`);
  },

  /**
   * PATCH /notifications/read-all
   * Mark all notifications as read.
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.patch(`${NOTIFICATIONS}/read-all`);
  },

  /**
   * DELETE /notifications/:id
   * Delete a notification.
   */
  async delete(notificationId: string): Promise<void> {
    await apiClient.delete(`${NOTIFICATIONS}/${notificationId}`);
  },
};

export default notificationService;
