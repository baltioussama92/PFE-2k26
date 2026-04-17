import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail, Phone, ShieldCheck, BadgeCheck, Clock3, XCircle, Upload,
  Camera, RefreshCw, Check, Loader2, ArrowLeft, AlertCircle
} from 'lucide-react'
import { guestVerificationService } from '../services/guestVerificationService'
import PhoneVerificationModal from '../components/profile/PhoneVerificationModal'

const STORAGE_KEY = 'guestVerificationDraft'
const OTP_LENGTH = 6
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_FILE_SIZE = 5 * 1024 * 1024

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistDraft(draft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function buildLevel(summary) {
  if (summary.identityStatus === 'approved') return 3
  if (summary.phoneVerified) return 2
  if (summary.emailVerified) return 1
  return 0
}

function StatusBadge({ state }) {
  const styles = {
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    not_verified: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const labels = {
    approved: 'Verified',
    pending: 'Pending',
    rejected: 'Rejected',
    not_verified: 'Not verified',
  }

  const icons = {
    approved: BadgeCheck,
    pending: Clock3,
    rejected: XCircle,
    not_verified: AlertCircle,
  }

  const Icon = icons[state] || AlertCircle

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[state] || styles.not_verified}`}>
      <Icon className="h-3.5 w-3.5" />
      {labels[state] || labels.not_verified}
    </span>
  )
}

function Stepper({ level }) {
  const steps = [
    { key: 'email', label: 'Email', active: level >= 1 },
    { key: 'phone', label: 'Phone', active: level >= 2 },
    { key: 'identity', label: 'Identity', active: level >= 3 },
  ]

  return (
    <div className="rounded-2xl border border-[#DCCBB9] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step.active ? 'bg-[#CBAD8D] text-white' : 'bg-[#EFE7DF] text-[#7A5D42]'}`}>
                {index + 1}
              </div>
              <span className={`text-xs font-semibold sm:text-sm ${step.active ? 'text-black' : 'text-[#7A5D42]'}`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className="h-[2px] flex-1 bg-[#E8DDD2]" />}
          </React.Fragment>
        ))}
      </div>
      <div className="h-2 rounded-full bg-[#EFE7DF]">
        <motion.div
          className="h-2 rounded-full bg-[#CBAD8D]"
          animate={{ width: `${(level / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

function OtpInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
      inputMode="numeric"
      placeholder="Enter 6-digit code"
      className="w-full rounded-xl border border-[#DDCCBB] bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#CBAD8D] focus:ring-2 focus:ring-[#E6D5C3]"
    />
  )
}

function FileUpload({
  label,
  file,
  files,
  previewUrl,
  previewUrls,
  onFileSelect,
  accept = 'image/jpeg,image/png,application/pdf',
  hint,
  error,
  multiple = false,
}) {
  const [dragging, setDragging] = useState(false)
  const selectedFiles = Array.isArray(files) ? files : file ? [file] : []
  const selectedPreviews = Array.isArray(previewUrls) ? previewUrls : previewUrl ? [previewUrl] : []

  const onDrop = async (event) => {
    event.preventDefault()
    setDragging(false)
    const dropped = Array.from(event.dataTransfer.files || [])
    if (dropped.length === 0) return
    onFileSelect(multiple ? dropped : dropped[0])
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-4 text-center transition ${dragging ? 'border-[#CBAD8D] bg-[#F8F2EB]' : 'border-[#DCCBB9] bg-white'}`}
      >
        <label className="block cursor-pointer">
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(event) => {
              const selectedFiles = Array.from(event.target.files || [])
              if (selectedFiles.length === 0) return
              onFileSelect(multiple ? selectedFiles : selectedFiles[0])
            }}
          />
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E7DC] text-[#7A5D42]">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-[#5A4634]">Click or drag file here</p>
          <p className="text-xs text-[#7A5D42]">{hint}</p>
        </label>
      </div>
      {selectedFiles.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          {selectedFiles.map((selected, index) => (
            <p key={`${selected.name}-${selected.lastModified}-${index}`}>
              {selected.name}
            </p>
          ))}
        </div>
      )}
      {selectedPreviews.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {selectedPreviews.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`preview-${index + 1}`}
              className="h-40 w-full rounded-xl border border-[#DCCBB9] object-cover"
            />
          ))}
        </div>
      )}
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}

function VerificationRow({ icon: Icon, title, description, state }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E4D5C5] bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-[#F1E7DC] p-2 text-[#7A5D42]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="text-xs text-[#7A5D42]">{description}</p>
        </div>
      </div>
      <StatusBadge state={state} />
    </div>
  )
}

export default function GuestVerificationPage({ user, onUserUpdate }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromBooking = searchParams.get('context') === 'booking'
  const draft = useMemo(() => loadDraft(), [])

  const [phone, setPhone] = useState(draft.phone || '')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpSent, setEmailOtpSent] = useState(Boolean(draft.emailOtpSent))
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)
  const [governmentIdFiles, setGovernmentIdFiles] = useState([])
  const [governmentIdPreviews, setGovernmentIdPreviews] = useState([])
  const [otherAttachmentFiles, setOtherAttachmentFiles] = useState([])
  const [otherAttachmentPreviews, setOtherAttachmentPreviews] = useState([])
  const [selfieFile, setSelfieFile] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(draft.selfiePreview || '')

  const [summary, setSummary] = useState({
    emailVerified: Boolean(user?.emailVerified),
    phoneVerified: Boolean(user?.phoneVerified),
    identityStatus: user?.identityStatus || 'not_verified',
    verificationLevel: user?.verificationLevel || 0,
    rejectionReason: user?.rejectionReason,
  })

  const [cameraActive, setCameraActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  if (!user) {
    return <Navigate to="/" replace />
  }

  const level = buildLevel(summary)

  useEffect(() => {
    persistDraft({
      phone,
      emailOtpSent,
      selfiePreview,
    })
  }, [phone, emailOtpSent, selfiePreview])

  useEffect(() => {
    let active = true

    const loadStatus = async () => {
      try {
        const latest = await guestVerificationService.getStatus()
        if (!active) return
        setSummary(latest)
        onUserUpdate?.({ ...user, ...latest })
      } catch {
        // Keep UI usable even if backend endpoint is unavailable.
      }
    }

    loadStatus()

    return () => {
      active = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const validateFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('File type not allowed. Use JPG, PNG, or PDF.')
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum allowed size is 5MB.')
    }
  }

  const handleGovernmentId = async (selectedFiles) => {
    try {
      setError('')
      const filesToUse = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles]
      filesToUse.forEach(validateFile)
      setGovernmentIdFiles(filesToUse)

      const previewCandidates = filesToUse.filter((file) => file.type.startsWith('image/'))
      const previews = await Promise.all(previewCandidates.map((file) => fileToDataUrl(file)))
      setGovernmentIdPreviews(previews.map(String))
    } catch (err) {
      setError(err.message || 'Invalid ID document')
    }
  }

  const handleOtherAttachments = async (selectedFiles) => {
    try {
      setError('')
      const filesToUse = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles]
      filesToUse.forEach(validateFile)
      setOtherAttachmentFiles(filesToUse)

      const previewCandidates = filesToUse.filter((file) => file.type.startsWith('image/'))
      const previews = await Promise.all(previewCandidates.map((file) => fileToDataUrl(file)))
      setOtherAttachmentPreviews(previews.map(String))
    } catch (err) {
      setError(err.message || 'Invalid attachment file')
    }
  }

  const handleSelfieUpload = async (file) => {
    try {
      setError('')
      validateFile(file)
      setSelfieFile(file)
      const preview = await fileToDataUrl(file)
      setSelfiePreview(String(preview))
    } catch (err) {
      setError(err.message || 'Invalid selfie file')
    }
  }

  const startCamera = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch {
      setError('Could not access camera. Please upload a selfie image instead.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const captureSelfie = async () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(videoRef.current, 0, 0)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95))
    if (!blob) {
      setError('Failed to capture selfie')
      return
    }

    const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' })
    await handleSelfieUpload(file)
    stopCamera()
  }

  const patchSummary = (nextSummary) => {
    setSummary(nextSummary)
    onUserUpdate?.({ ...user, ...nextSummary })
  }

  const sendEmailOtp = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await guestVerificationService.sendEmailOtp({ email: user.email })
      setEmailOtpSent(true)
      setSuccess('Verification code sent to your email.')
    } catch (err) {
      setError(err.message || 'Could not send email OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyEmailOtp = async () => {
    try {
      if (emailOtp.length !== OTP_LENGTH) {
        setError('Please enter a valid 6-digit email OTP.')
        return
      }

      setLoading(true)
      setError('')
      setSuccess('')
      const nextSummary = await guestVerificationService.verifyEmailOtp({ otp: emailOtp })
      patchSummary(nextSummary)
      setSuccess('Email verified successfully.')
    } catch (err) {
      setError(err.message || 'Invalid email OTP')
    } finally {
      setLoading(false)
    }
  }

  const submitIdentity = async () => {
    try {
      if (governmentIdFiles.length === 0 || !selfieFile) {
        setError('At least one government ID and one selfie are required.')
        return
      }

      setLoading(true)
      setError('')
      setSuccess('')
      const nextSummary = await guestVerificationService.submitIdentity({
        governmentIds: governmentIdFiles,
        otherAttachments: otherAttachmentFiles,
        selfie: selfieFile,
      })
      patchSummary(nextSummary)
      setSuccess('Identity verification submitted. Status is now pending review.')
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      setError(err.message || 'Could not submit identity verification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#EBE3DB] px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DCCBB9] bg-white px-3 py-2 text-sm font-semibold text-[#5A4634] transition hover:bg-[#F7F1EA]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <StatusBadge state={summary.identityStatus === 'approved' ? 'approved' : 'not_verified'} />
        </div>

        {fromBooking && (
          <div className="rounded-2xl border border-[#D8C2A8] bg-[#FFF7EE] p-4 text-sm font-medium text-[#6B4E32]">
            Complete your guest verification to continue booking this property.
          </div>
        )}

        <div className="rounded-3xl border border-[#DCCBB9] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-black">Guest Verification</h1>
            <p className="mt-1 text-sm text-[#6F5944]">
              Browse freely, but booking is enabled only after identity approval.
            </p>
          </div>

          <Stepper level={level} />

          <div className="mt-6 space-y-3">
            <VerificationRow
              icon={Mail}
              title="Level 1 - Email"
              description={user.email || 'No email found'}
              state={summary.emailVerified ? 'approved' : 'not_verified'}
            />
            <VerificationRow
              icon={Phone}
              title="Level 2 - Phone"
              description={phone || 'Add your phone number to verify'}
              state={summary.phoneVerified ? 'approved' : 'not_verified'}
            />
            <VerificationRow
              icon={ShieldCheck}
              title="Level 3 - Identity"
              description="Upload ID + selfie. Booking unlocks after approval."
              state={summary.identityStatus}
            />
          </div>

          <div className="mt-8 space-y-5 border-t border-[#E8DDD2] pt-6">
            {!summary.emailVerified && (
              <div className="space-y-3 rounded-2xl border border-[#E8DDD2] bg-[#FBF8F4] p-4">
                <p className="text-sm font-semibold text-black">Verify your email</p>
                <button
                  onClick={sendEmailOtp}
                  disabled={loading}
                  className="rounded-xl bg-[#CBAD8D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#B99875] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Sending...' : emailOtpSent ? 'Resend code' : 'Send code'}
                </button>
                {emailOtpSent && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <OtpInput value={emailOtp} onChange={setEmailOtp} />
                    <button
                      onClick={verifyEmailOtp}
                      disabled={loading}
                      className="rounded-xl border border-[#CCB092] bg-white px-4 py-2 text-sm font-semibold text-[#6E533B] hover:bg-[#F8F1EA]"
                    >
                      Verify email
                    </button>
                  </div>
                )}
              </div>
            )}

            {summary.emailVerified && !summary.phoneVerified && (
              <div className="space-y-3 rounded-2xl border border-[#E8DDD2] bg-[#FBF8F4] p-4">
                <p className="text-sm font-semibold text-black">Verify your phone</p>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number (E.164, ex: +216XXXXXXXX)"
                  className="w-full rounded-xl border border-[#DDCCBB] bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#CBAD8D] focus:ring-2 focus:ring-[#E6D5C3]"
                />
                <button
                  onClick={() => {
                    setError('')
                    setSuccess('')
                    setPhoneModalOpen(true)
                  }}
                  disabled={loading}
                  className="rounded-xl bg-[#A65B32] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Verify phone number
                </button>
              </div>
            )}

            {summary.emailVerified && summary.phoneVerified && summary.identityStatus !== 'approved' && (
              <div className="space-y-4 rounded-2xl border border-[#E8DDD2] bg-[#FBF8F4] p-4">
                <p className="text-sm font-semibold text-black">Identity verification before booking</p>
                <p className="text-xs text-[#7A5D42]">
                  Upload a government-issued ID (passport or national ID) and provide a live selfie.
                </p>

                <FileUpload
                  label="Government ID"
                  files={governmentIdFiles}
                  previewUrls={governmentIdPreviews}
                  onFileSelect={handleGovernmentId}
                  hint="Upload one or more files (JPG, PNG, PDF - max 5MB each)"
                  multiple
                />

                <FileUpload
                  label="Other attachments"
                  files={otherAttachmentFiles}
                  previewUrls={otherAttachmentPreviews}
                  onFileSelect={handleOtherAttachments}
                  hint="Optional supporting files (proof of address, utility bill, etc.)"
                  multiple
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black">Live selfie</p>
                    {cameraActive ? (
                      <button
                        onClick={stopCamera}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#DCCBB9] bg-white px-3 py-1.5 text-xs font-semibold text-[#5A4634]"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Stop camera
                      </button>
                    ) : (
                      <button
                        onClick={startCamera}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#DCCBB9] bg-white px-3 py-1.5 text-xs font-semibold text-[#5A4634]"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        Start camera
                      </button>
                    )}
                  </div>

                  {cameraActive && (
                    <div className="space-y-2 rounded-xl border border-[#DCCBB9] bg-black/95 p-3">
                      <video ref={videoRef} autoPlay playsInline className="h-56 w-full rounded-lg object-cover" />
                      <button
                        onClick={captureSelfie}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#CBAD8D] px-3 py-2 text-xs font-semibold text-white"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Capture selfie
                      </button>
                    </div>
                  )}

                  <FileUpload
                    label="Upload selfie fallback"
                    file={selfieFile}
                    previewUrl={selfiePreview}
                    onFileSelect={handleSelfieUpload}
                    hint="Use this if camera is not available"
                  />
                </div>

                {summary.identityStatus === 'rejected' && summary.rejectionReason && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                    Rejection reason: {summary.rejectionReason}
                  </div>
                )}

                {summary.identityStatus === 'pending' ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                    Your identity documents are under review.
                  </div>
                ) : (
                  <button
                    onClick={submitIdentity}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#CBAD8D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#B99875] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Submit identity verification
                  </button>
                )}
              </div>
            )}

            {summary.identityStatus === 'approved' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-bold text-emerald-700">Identity approved. You can now book properties.</p>
                <button
                  onClick={() => navigate('/explorer')}
                  className="mt-3 rounded-xl bg-[#CBAD8D] px-4 py-2 text-sm font-semibold text-white"
                >
                  Continue browsing
                </button>
              </div>
            )}

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            {success && <p className="text-sm font-semibold text-emerald-600">{success}</p>}
          </div>
        </div>
      </div>

      <PhoneVerificationModal
        isOpen={phoneModalOpen}
        initialPhoneNumber={phone}
        onClose={() => setPhoneModalOpen(false)}
        onVerified={({ summary: nextSummary, phoneNumber }) => {
          setPhone(phoneNumber)
          patchSummary(nextSummary)
          setSuccess('Phone number verified successfully.')
          setError('')
          setPhoneModalOpen(false)
        }}
      />
    </section>
  )
}
