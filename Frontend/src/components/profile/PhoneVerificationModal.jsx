import React, { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { guestVerificationService } from '../../services/guestVerificationService'

const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/
const OTP_PATTERN = /^\d{4}$/

export default function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
  initialPhoneNumber = '',
}) {
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)
  const [otpCode, setOtpCode] = useState('')
  const [reqId, setReqId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setStep(1)
    setOtpCode('')
    setReqId('')
    setError('')
    setPhoneNumber(initialPhoneNumber || '')
  }, [isOpen, initialPhoneNumber])

  const canSend = useMemo(() => PHONE_PATTERN.test(phoneNumber.trim()), [phoneNumber])
  const canVerify = useMemo(() => OTP_PATTERN.test(otpCode), [otpCode])

  if (!isOpen) return null

  const handleSendOtp = async () => {
    try {
      if (!canSend) {
        setError('Numéro invalide. Utilisez le format +216XXXXXXXX.')
        return
      }

      setIsLoading(true)
      setError('')

      const response = await guestVerificationService.sendPhoneOtp({
        phoneNumber: phoneNumber.trim(),
      })

      if (!response?.reqId) {
        throw new Error('ReqId non reçu depuis le serveur.')
      }

      setReqId(response.reqId)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Impossible d’envoyer le code OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      if (!canVerify) {
        setError('Le code OTP doit contenir exactement 4 chiffres.')
        return
      }

      if (!reqId) {
        setError('Session OTP expirée. Veuillez renvoyer un code.')
        setStep(1)
        return
      }

      setIsLoading(true)
      setError('')

      const summary = await guestVerificationService.verifyPhoneOtp({
        reqId,
        code: otpCode,
      })

      onVerified?.({ summary, phoneNumber: phoneNumber.trim() })
      onClose?.()
    } catch (err) {
      setError(err.message || 'Code OTP incorrect.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">Vérification du téléphone</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#6F5944] transition hover:bg-[#F5EEE6]"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#5A4634]">Numéro de téléphone</label>
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+216XXXXXXXX"
              className="w-full rounded-xl border border-[#DDCCBB] bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#E6D5C3]"
            />
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full rounded-xl bg-[#A65B32] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-[#6F5944]">
              Code envoyé au numéro {phoneNumber}. Entrez le code OTP à 4 chiffres.
            </p>
            <input
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              placeholder="Code OTP (4 chiffres)"
              className="w-full rounded-xl border border-[#DDCCBB] bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#E6D5C3]"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="rounded-xl border border-[#DCCBB9] bg-white px-4 py-2.5 text-sm font-semibold text-[#5A4634] transition hover:bg-[#F8F1EA] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Retour
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="rounded-xl bg-[#A65B32] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Vérification...' : 'Vérifier'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
