import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminSettings } from '../services/adminApi'
import { FilterSelect, SectionTabs, SurfaceCard } from '../components/ui'
import { apiClient } from '../../api/apiClient'
import { ENDPOINTS } from '../../api/endpoints'

const defaultSettings: AdminSettings = {
  commissionPercentage: 10,
  enableSmartPricing: true,
  enableNewHostOnboarding: true,
  emailNotifications: true,
  inAppNotifications: true,
}

type SettingsPanel = 'settings' | 'content' | 'notifications'

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
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { showToast } = useAdminToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)

  const [platformLanguage, setPlatformLanguage] = useState('en')
  const [currency, setCurrency] = useState('DT')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [logoUrl, setLogoUrl] = useState('https://placehold.co/300x120?text=MASKAN+Logo')

  const [bannerText, setBannerText] = useState('Find your next premium stay in Morocco.')
  const [faqText, setFaqText] = useState('Q: How does verification work? A: We review identity and listing evidence manually and automatically.')
  const [termsText, setTermsText] = useState('Updated terms and conditions draft for host liabilities and cancellation policies.')
  const [privacyText, setPrivacyText] = useState('Privacy policy draft including retention and identity verification clauses.')
  const [footerContact, setFooterContact] = useState('support@maskan.com | +212 5 22 00 00 00')

  const [notificationType, setNotificationType] = useState('announcement')
  const [notificationTitle, setNotificationTitle] = useState('Platform maintenance update')
  const [notificationBody, setNotificationBody] = useState('Scheduled maintenance on Saturday 01:00-03:00 UTC. Booking remains available.')
  const [notificationTemplate, setNotificationTemplate] = useState('maintenance')
  const [notificationSchedule, setNotificationSchedule] = useState('2026-04-27T10:00')
  const [notificationTemplates, setNotificationTemplates] = useState<Array<{ label: string; value: string }>>([
    { label: 'General Template', value: 'general' },
    { label: 'Promotion Template', value: 'promo' },
    { label: 'Maintenance Template', value: 'maintenance' },
  ])

  const panel = (params.get('panel') === 'content' ? 'content' : params.get('panel') === 'notifications' ? 'notifications' : 'settings') as SettingsPanel

  useEffect(() => {
    let active = true

    adminApi.getSettings()
      .then((data) => {
        if (active) setSettings(data)
      })
      .catch(() => {
        showToast('Failed to load settings, using defaults.', 'error')
        if (active) setSettings(defaultSettings)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    Promise.all([
      apiClient.get<Record<string, any>>(ENDPOINTS.admin.content),
      apiClient.get<any[]>(ENDPOINTS.admin.notificationTemplates),
    ]).then(([contentResponse, templatesResponse]) => {
      if (!active) return

      const content = contentResponse.data || {}
      setBannerText(String(content.bannerText || bannerText))
      setFaqText(String(content.faqText || faqText))
      setTermsText(String(content.termsText || termsText))
      setPrivacyText(String(content.privacyText || privacyText))
      setFooterContact(String(content.footerContact || footerContact))

      const mappedTemplates = (templatesResponse.data || []).map((tpl) => ({
        label: String(tpl?.name || tpl?.title || tpl?.type || 'Template'),
        value: String(tpl?.code || tpl?.id || tpl?.type || 'general'),
      }))

      if (mappedTemplates.length > 0) {
        setNotificationTemplates(mappedTemplates)
      }
    }).catch(() => {
      // Keep local defaults
    })

    return () => {
      active = false
    }
  }, [showToast])

  const onSubmitPlatform = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const saved = await adminApi.saveSettings(settings)
      setSettings(saved)
      showToast('Platform settings saved successfully.')
    } catch {
      showToast('Failed to save settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveContent = async () => {
    try {
      await apiClient.put(ENDPOINTS.admin.content, {
        bannerText,
        faqText,
        termsText,
        privacyText,
        footerContact,
      })
      showToast('Content saved and published.')
    } catch {
      showToast('Failed to save content.', 'error')
    }
  }

  const scheduleNotificationAction = async () => {
    try {
      await apiClient.post(ENDPOINTS.admin.notificationsSchedule, {
        type: notificationType,
        template: notificationTemplate,
        title: notificationTitle,
        body: notificationBody,
        scheduledAt: notificationSchedule,
      })
      showToast('Notification queued successfully.')
    } catch {
      showToast('Failed to schedule notification.', 'error')
    }
  }

  const applyTemplate = async () => {
    try {
      await apiClient.post(ENDPOINTS.admin.notificationsSend, {
        type: notificationType,
        template: notificationTemplate,
        title: notificationTitle,
        body: notificationBody,
      })
      showToast('Template applied.')
    } catch {
      showToast('Failed to apply template.', 'error')
    }
  }

  if (loading) {
    return (
      <SurfaceCard title="Settings" subtitle="Loading platform configuration...">
        <p className="text-sm text-[#3A2D28]/75">Please wait...</p>
      </SurfaceCard>
    )
  }

  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Control Settings"
        subtitle="Platform configuration, content management, and communications"
        action={
          <SectionTabs
            options={[
              { key: 'settings', label: 'Settings' },
              { key: 'content', label: 'Content Management' },
              { key: 'notifications', label: 'Notifications' },
            ]}
            value={panel}
            onChange={(next) => navigate(`/admin/settings${next === 'settings' ? '' : `?panel=${next}`}`)}
          />
        }
      >
        {panel === 'settings' ? (
          <form className="space-y-5" onSubmit={onSubmitPlatform}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="commission" className="mb-2 block text-sm font-medium text-[#3A2D28]">Commission percentage</label>
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

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Currency</label>
                <FilterSelect
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { label: 'DT', value: 'DT' },
                    { label: 'USD', value: 'USD' },
                    { label: 'MAD', value: 'MAD' },
                    { label: 'EUR', value: 'EUR' },
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Language</label>
                <FilterSelect
                  value={platformLanguage}
                  onChange={setPlatformLanguage}
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'French', value: 'fr' },
                    { label: 'Arabic', value: 'ar' },
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Brand Logo URL</label>
                <input
                  value={logoUrl}
                  onChange={(event) => setLogoUrl(event.target.value)}
                  className="w-full rounded-xl border border-[#CBAD8D]/50 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <ToggleField label="Enable smart pricing" value={settings.enableSmartPricing} onChange={(next) => setSettings((prev) => ({ ...prev, enableSmartPricing: next }))} />
              <ToggleField label="Enable new host onboarding" value={settings.enableNewHostOnboarding} onChange={(next) => setSettings((prev) => ({ ...prev, enableNewHostOnboarding: next }))} />
              <ToggleField label="Email notifications" value={settings.emailNotifications} onChange={(next) => setSettings((prev) => ({ ...prev, emailNotifications: next }))} />
              <ToggleField label="In-app notifications" value={settings.inAppNotifications} onChange={(next) => setSettings((prev) => ({ ...prev, inAppNotifications: next }))} />
              <ToggleField label="Maintenance mode" value={maintenanceMode} onChange={setMaintenanceMode} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#E2D4C2] bg-[#FBF6EF] p-4 text-sm text-[#4C3B2F]">
                <p className="font-semibold">Email Settings</p>
                <p className="mt-1">SMTP host: smtp.maskan.com</p>
                <p>Sender: no-reply@maskan.com</p>
              </div>
              <div className="rounded-2xl border border-[#E2D4C2] bg-[#FBF6EF] p-4 text-sm text-[#4C3B2F]">
                <p className="font-semibold">SMS Settings</p>
                <p className="mt-1">Provider: Twilio</p>
                <p>From: +212 5 44 00 00 00</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2D4C2] bg-[#FBF6EF] p-4 text-sm text-[#4C3B2F]">
              <p className="font-semibold">Admin Roles & Permissions</p>
              <p className="mt-1">Super Admin: full access</p>
              <p>Finance Admin: payments and exports</p>
              <p>Moderation Admin: reports, disputes, chat moderation</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3A2D28] px-5 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-[#3A2D28]/90 disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save settings'}
            </button>
          </form>
        ) : panel === 'content' ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <ContentEditor title="Homepage Banner" value={bannerText} onChange={setBannerText} />
            <ContentEditor title="FAQ" value={faqText} onChange={setFaqText} />
            <ContentEditor title="Terms & Conditions" value={termsText} onChange={setTermsText} />
            <ContentEditor title="Privacy Policy" value={privacyText} onChange={setPrivacyText} />
            <ContentEditor title="Footer & Contact" value={footerContact} onChange={setFooterContact} />
            <div className="rounded-2xl border border-[#E2D4C2] bg-[#FBF6EF] p-4">
              <p className="text-sm font-semibold text-[#3A2D28]">Save Published Content</p>
              <p className="mt-1 text-sm text-[#6F5D4D]">Push all edited blocks to production content delivery.</p>
              <button
                type="button"
                onClick={saveContent}
                className="mt-3 rounded-xl bg-[#3A2D28] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2C221E]"
              >
                Save Content
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Notification Type</label>
                <FilterSelect
                  value={notificationType}
                  onChange={setNotificationType}
                  options={[
                    { label: 'Announcement', value: 'announcement' },
                    { label: 'Email Campaign', value: 'email' },
                    { label: 'Push Notification', value: 'push' },
                    { label: 'Maintenance Alert', value: 'maintenance' },
                  ]}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Template</label>
                <FilterSelect
                  value={notificationTemplate}
                  onChange={setNotificationTemplate}
                  options={notificationTemplates}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Title</label>
              <input
                value={notificationTitle}
                onChange={(event) => setNotificationTitle(event.target.value)}
                className="w-full rounded-xl border border-[#CBAD8D]/50 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Message</label>
              <textarea
                rows={4}
                value={notificationBody}
                onChange={(event) => setNotificationBody(event.target.value)}
                className="w-full rounded-xl border border-[#CBAD8D]/50 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3A2D28]">Schedule</label>
              <input
                type="datetime-local"
                value={notificationSchedule}
                onChange={(event) => setNotificationSchedule(event.target.value)}
                className="w-full rounded-xl border border-[#CBAD8D]/50 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={scheduleNotificationAction}
                className="rounded-xl bg-[#3A2D28] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2C221E]"
              >
                Schedule Notification
              </button>
              <button
                type="button"
                onClick={applyTemplate}
                className="rounded-xl border border-[#CBAD8D]/60 bg-white px-4 py-2 text-sm font-semibold text-[#3A2D28] transition hover:bg-[#F5EBDF]"
              >
                Apply Template
              </button>
            </div>
          </div>
        )}
      </SurfaceCard>
    </div>
  )
}

function ContentEditor({
  title,
  value,
  onChange,
}: {
  title: string
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="rounded-2xl border border-[#E2D4C2] bg-[#FBF6EF] p-4">
      <p className="text-sm font-semibold text-[#3A2D28]">{title}</p>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#CBAD8D]/50 bg-white px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
      />
    </div>
  )
}
