import React, { useState, useEffect } from 'react';
import {
  HiOutlineCog6Tooth,
  HiOutlineCheck,
  HiOutlineServer,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineCircleStack,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineClock,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { settingsService } from '../../api';

const SystemSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    modelVersion: 'yolov8n',
    confidenceThreshold: 0.5,
    iouThreshold: 0.45,
    maxDetections: 100,
    imgSize: 640,
    autoDetect: true,
    emailNotifications: true,
    slackNotifications: false,
    sessionTimeout: 30,
    twoFactor: false,
    auditLog: true,
    autoBackup: true,
    backupFrequency: 'daily',
    apiRateLimit: 100,
  });

  useEffect(() => {
    settingsService.get().then((data) => {
      setSettings((prev) => ({
        ...prev,
        confidenceThreshold: data.model.confidenceThreshold,
        iouThreshold: data.model.iouThreshold,
        maxDetections: data.model.maxDetections,
        autoDetect: data.model.autoRetrain,
        emailNotifications: data.notifications.emailAlerts,
        sessionTimeout: data.security.sessionTimeout,
        twoFactor: data.security.mfaEnabled,
        autoBackup: data.system.autoBackup,
        backupFrequency: data.system.backupFrequency,
      }));
    }).catch(() => { /* use default fallback */ });
  }, []);

  const handleSave = () => {
    settingsService.save({
      model: {
        confidenceThreshold: settings.confidenceThreshold,
        iouThreshold: settings.iouThreshold,
        maxDetections: settings.maxDetections,
        enableGPU: true,
        autoRetrain: settings.autoDetect,
        retrainThreshold: 0.8,
      },
      notifications: {
        emailAlerts: settings.emailNotifications,
        scanCompletionNotify: true,
        trainingCompletionNotify: true,
        systemAlerts: true,
      },
      security: {
        sessionTimeout: settings.sessionTimeout,
        mfaEnabled: settings.twoFactor,
        passwordExpiry: 90,
        ipWhitelisting: false,
      },
      system: {
        darkMode: false,
        autoBackup: settings.autoBackup,
        backupFrequency: settings.backupFrequency,
        logLevel: 'info',
        maintenanceMode: false,
      },
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({
    value,
    onChange,
  }) => (
    <button onClick={() => onChange(!value)} className="flex items-center">
      {value ? (
        <span className="inline-flex h-5 w-9 items-center rounded-full bg-primary-500 transition-colors">
          <span className="inline-block h-3.5 w-3.5 translate-x-4 rounded-full bg-white shadow transition-transform" />
        </span>
      ) : (
        <span className="inline-flex h-5 w-9 items-center rounded-full bg-gray-300 transition-colors">
          <span className="inline-block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
        </span>
      )}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure model parameters, security, and system preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
        >
          {saved ? (
            <>
              <HiOutlineCheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <HiOutlineCheck className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Model Configuration */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <HiOutlineCpuChip className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Model Configuration</h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Model Version</label>
              <select
                value={settings.modelVersion}
                onChange={(e) => setSettings({ ...settings, modelVersion: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="yolov8n">YOLOv8n (Nano) — 3.2M params</option>
                <option value="yolov8s">YOLOv8s (Small) — 11.2M params</option>
                <option value="yolov8m">YOLOv8m (Medium) — 25.9M params</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Input Image Size
              </label>
              <select
                value={settings.imgSize}
                onChange={(e) => setSettings({ ...settings, imgSize: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value={320}>320 × 320</option>
                <option value={416}>416 × 416</option>
                <option value={512}>512 × 512</option>
                <option value={640}>640 × 640</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confidence Threshold
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="0.95"
                value={settings.confidenceThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                IoU Threshold
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="0.95"
                value={settings.iouThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, iouThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Max Detections
              </label>
              <input
                type="number"
                value={settings.maxDetections}
                onChange={(e) =>
                  setSettings({ ...settings, maxDetections: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto-Detection on Upload</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Automatically run tumor detection when a new MRI scan is uploaded.
              </p>
            </div>
            <Toggle
              value={settings.autoDetect}
              onChange={(v) => setSettings({ ...settings, autoDetect: v })}
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <HiOutlineShieldCheck className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Security</h3>
        </div>
        <div className="p-6 space-y-1">
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Session Timeout</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Auto-logout after inactivity period (minutes).
              </p>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({ ...settings, sessionTimeout: Number(e.target.value) })
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 mt-0.5">Require 2FA for all user logins.</p>
            </div>
            <Toggle
              value={settings.twoFactor}
              onChange={(v) => setSettings({ ...settings, twoFactor: v })}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Audit Logging</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Record all user actions for compliance tracking.
              </p>
            </div>
            <Toggle
              value={settings.auditLog}
              onChange={(v) => setSettings({ ...settings, auditLog: v })}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <HiOutlineBell className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="p-6 space-y-1">
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Send email alerts for tumor detections and system events.
              </p>
            </div>
            <Toggle
              value={settings.emailNotifications}
              onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Slack Integration</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Push notifications to a Slack channel.
              </p>
            </div>
            <Toggle
              value={settings.slackNotifications}
              onChange={(v) => setSettings({ ...settings, slackNotifications: v })}
            />
          </div>
        </div>
      </div>

      {/* System */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <HiOutlineServer className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">System</h3>
        </div>
        <div className="p-6 space-y-1">
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Automatic Backups</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Schedule automatic database and model backups.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={settings.backupFrequency}
                onChange={(e) =>
                  setSettings({ ...settings, backupFrequency: e.target.value })
                }
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <Toggle
                value={settings.autoBackup}
                onChange={(v) => setSettings({ ...settings, autoBackup: v })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">API Rate Limit</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Maximum API requests per minute per user.
              </p>
            </div>
            <input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) =>
                setSettings({ ...settings, apiRateLimit: Number(e.target.value) })
              }
              className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>NeuroScan AI v2.4.1</span>
            <span>•</span>
            <span>YOLOv8 Runtime v8.1.0</span>
            <span>•</span>
            <span>Last Updated: Feb 26, 2026</span>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
            <HiOutlineArrowPath className="w-3 h-3" />
            Check for Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
