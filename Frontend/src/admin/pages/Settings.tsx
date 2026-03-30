import { FormEvent, useEffect, useState } from 'react'
import Card from '../components/Card'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminSettings } from '../services/adminApi'

const defaultSettings: AdminSettings = {
  commissionPercentage: 10,
  enableSmartPricing: true,
  enableNewHostOnboarding: true,
  emailNotifications: true,
  inAppNotifications: true,
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (nextValue: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-[#CBAD8D]/40 bg-[#FFFFFF] px-4 py-3">
      <span className="text-sm font-medium text-[#3A2D28]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`h-7 w-12 rounded-full p-1 transition ${value ? 'bg-[#3A2D28]' : 'bg-[#EBE3DB]'}`}
      >
        <span className={`block h-5 w-5 rounded-full bg-[#FFFFFF] transition ${value ? 'translate-x-5' : ''}`} />
      </button>
    </label>
  )
}

export default function Settings() {
  const { showToast } = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)

  useEffect(() => {
    let active = true
    adminApi.getSettings()
      .then((data) => {
        if (active) setSettings(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const saved = await adminApi.saveSettings(settings)
      setSettings(saved)
      showToast('Settings updated successfully.')
    } catch {
      showToast('Failed to save settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card title="Platform Settings">
        <p className="text-sm text-[#3A2D28]/75">Loading settings...</p>
      </Card>
    )
  }

  return (
    <Card title="Platform Settings" subtitle="Control platform rules and feature toggles">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="commission" className="mb-2 block text-sm font-medium text-[#3A2D28]">
            Commission percentage
          </label>
          <input
            id="commission"
            type="number"
            min={0}
            max={100}
            value={settings.commissionPercentage}
            onChange={(e) => setSettings((prev) => ({ ...prev, commissionPercentage: Number(e.target.value) }))}
            className="w-full rounded-xl border border-[#CBAD8D]/50 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
          />
        </div>

        <div className="grid gap-3">
          <ToggleField
            label="Enable smart pricing"
            value={settings.enableSmartPricing}
            onChange={(next) => setSettings((prev) => ({ ...prev, enableSmartPricing: next }))}
          />
          <ToggleField
            label="Enable new host onboarding"
            value={settings.enableNewHostOnboarding}
            onChange={(next) => setSettings((prev) => ({ ...prev, enableNewHostOnboarding: next }))}
          />
          <ToggleField
            label="Email notifications"
            value={settings.emailNotifications}
            onChange={(next) => setSettings((prev) => ({ ...prev, emailNotifications: next }))}
          />
          <ToggleField
            label="In-app notifications"
            value={settings.inAppNotifications}
            onChange={(next) => setSettings((prev) => ({ ...prev, inAppNotifications: next }))}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#3A2D28] px-5 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-[#3A2D28]/90 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </Card>
  )
}
