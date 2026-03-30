import React, { useState } from 'react'
import { settingsDefaults } from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import AdminButton from '../../../components/admin/AdminButton'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(settingsDefaults)

  const updateField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const toggleNotification = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const toggleSecurity = (key) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: !prev.security[key],
      },
    }))
  }

  return (
    <AdminPanelCard title="Settings" subtitle="Configure platform defaults and controls">
      <div className="admin-settings-grid">
        <label>
          <span>Platform Name</span>
          <input
            className="admin-input"
            value={settings.platformName}
            onChange={(e) => updateField('platformName', e.target.value)}
          />
        </label>

        <label>
          <span>Contact Email</span>
          <input
            className="admin-input"
            value={settings.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
          />
        </label>
      </div>

      <div className="admin-settings-block">
        <h4>Notification Settings</h4>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={settings.notifications.bookingAlerts}
            onChange={() => toggleNotification('bookingAlerts')}
          />
          <span>Booking alerts</span>
        </label>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={settings.notifications.userReports}
            onChange={() => toggleNotification('userReports')}
          />
          <span>User report alerts</span>
        </label>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={settings.notifications.weeklyDigest}
            onChange={() => toggleNotification('weeklyDigest')}
          />
          <span>Weekly digest</span>
        </label>
      </div>

      <div className="admin-settings-block">
        <h4>Security Settings</h4>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={settings.security.twoFactorRequired}
            onChange={() => toggleSecurity('twoFactorRequired')}
          />
          <span>Require two-factor authentication for admins</span>
        </label>
        <label>
          <span>Session timeout (minutes)</span>
          <input
            type="number"
            min="5"
            max="240"
            className="admin-input"
            value={settings.security.sessionTimeout}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                security: {
                  ...prev.security,
                  sessionTimeout: Number(e.target.value),
                },
              }))
            }
          />
        </label>
      </div>

      <div className="admin-settings-actions">
        <AdminButton>Save Settings</AdminButton>
        <AdminButton variant="ghost">Reset</AdminButton>
      </div>
    </AdminPanelCard>
  )
}
