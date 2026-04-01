import { getStoredAuthToken } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import type { GuestVerificationSummary, VerificationStatus } from '../utils/contracts'

const API_ROOT = '/api'

interface VerifyOtpPayload {
  otp: string
}

interface SendOtpPayload {
  email?: string
  phone?: string
}

interface IdentitySubmissionPayload {
  governmentId: File
  selfie: File
}

interface ApiSummaryResponse {
  emailVerified?: boolean
  phoneVerified?: boolean
  identityStatus?: VerificationStatus
  verificationLevel?: 0 | 1 | 2 | 3
  rejectionReason?: string
}

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getStoredAuthToken()
  const headers = new Headers(init.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(`${API_ROOT}${path}`, {
    ...init,
    headers,
  })
}

function normalizeSummary(payload?: ApiSummaryResponse): GuestVerificationSummary {
  const emailVerified = Boolean(payload?.emailVerified)
  const phoneVerified = Boolean(payload?.phoneVerified)
  const identityStatus = payload?.identityStatus || 'not_verified'

  const derivedLevel = identityStatus === 'approved'
    ? 3
    : phoneVerified
    ? 2
    : emailVerified
    ? 1
    : 0

  return {
    emailVerified,
    phoneVerified,
    identityStatus,
    verificationLevel: payload?.verificationLevel ?? derivedLevel,
    rejectionReason: payload?.rejectionReason,
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await authedFetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody || 'Verification request failed')
  }

  return response.json()
}

export const guestVerificationService = {
  async getStatus(): Promise<GuestVerificationSummary> {
    const response = await authedFetch(ENDPOINTS.verifications.guestStatus)

    if (!response.ok) {
      throw new Error('Unable to fetch verification status')
    }

    const payload = await response.json()
    return normalizeSummary(payload)
  },

  async sendEmailOtp(payload: SendOtpPayload): Promise<void> {
    await postJson(ENDPOINTS.verifications.sendEmailOtp, payload)
  },

  async verifyEmailOtp(payload: VerifyOtpPayload): Promise<GuestVerificationSummary> {
    const data = await postJson<ApiSummaryResponse>(ENDPOINTS.verifications.verifyEmailOtp, payload)
    return normalizeSummary(data)
  },

  async sendPhoneOtp(payload: SendOtpPayload): Promise<void> {
    await postJson(ENDPOINTS.verifications.sendPhoneOtp, payload)
  },

  async verifyPhoneOtp(payload: VerifyOtpPayload): Promise<GuestVerificationSummary> {
    const data = await postJson<ApiSummaryResponse>(ENDPOINTS.verifications.verifyPhoneOtp, payload)
    return normalizeSummary(data)
  },

  async submitIdentity(payload: IdentitySubmissionPayload): Promise<GuestVerificationSummary> {
    const formData = new FormData()
    formData.append('governmentId', payload.governmentId)
    formData.append('selfie', payload.selfie)

    const response = await authedFetch(ENDPOINTS.verifications.submitIdentity, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(errorBody || 'Unable to submit identity files')
    }

    const data = await response.json()
    return normalizeSummary(data)
  },
}
