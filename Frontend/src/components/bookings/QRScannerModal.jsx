import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Camera, CheckCircle2, Loader2, Keyboard, QrCode, X, XCircle } from 'lucide-react'

function extractRawValue(scanResult) {
  if (!scanResult) return ''

  if (Array.isArray(scanResult)) {
    const first = scanResult[0]
    return first?.rawValue || first?.raw || first?.text || ''
  }

  return scanResult?.rawValue || scanResult?.raw || scanResult?.text || ''
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onDetected,
  bookingId,
}) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [entryMode, setEntryMode] = useState('scan')
  const [manualCode, setManualCode] = useState('')
  const hasHandledResultRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      setIsInitializing(true)
      setErrorMessage('')
      setIsSubmitting(false)
      setSuccessMessage('')
      setEntryMode('scan')
      setManualCode('')
      hasHandledResultRef.current = false
      return
    }

    const timer = window.setTimeout(() => {
      setIsInitializing(false)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [isOpen])

  const canScan = useMemo(
    () => isOpen && entryMode === 'scan' && !isSubmitting && !successMessage,
    [isOpen, entryMode, isSubmitting, successMessage]
  )

  const canSubmitManual = useMemo(
    () => entryMode === 'manual' && manualCode.trim().length > 0 && !isSubmitting && !successMessage,
    [entryMode, manualCode, isSubmitting, successMessage]
  )

  const verifySecretCode = async (secretCode) => {
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await onDetected(bookingId, secretCode)
      setSuccessMessage('Clés validées, paiement déclenché !')
      window.setTimeout(() => onClose(), 1300)
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        (error?.response?.data?.errors && Object.values(error.response.data.errors)[0]) ||
        error?.message
      setErrorMessage(apiMessage || 'Code invalide')
      hasHandledResultRef.current = false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScan = async (result) => {
    if (!canScan || hasHandledResultRef.current) return

    const secretCode = extractRawValue(result)?.trim()
    if (!secretCode) return

    hasHandledResultRef.current = true
    await verifySecretCode(secretCode)
  }

  const handleScannerError = (error) => {
    const name = error?.name || ''
    const message = String(error?.message || '')

    if (name === 'NotAllowedError' || message.toLowerCase().includes('permission')) {
      setErrorMessage('Accès caméra refusé. Autorisez la caméra dans votre navigateur, puis réessayez.')
      return
    }

    if (name === 'NotFoundError') {
      setErrorMessage('Aucune caméra détectée sur cet appareil.')
      return
    }

    setErrorMessage('Impossible d\'initialiser la caméra. Vérifiez les permissions et réessayez.')
  }

  const handleManualSubmit = async () => {
    if (!canSubmitManual) return
    hasHandledResultRef.current = true
    await verifySecretCode(manualCode.trim())
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="w-full max-w-md rounded-2xl bg-primary-50 border border-primary-200 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary-200">
              <div className="flex items-center gap-2 text-primary-800 font-semibold text-sm">
                <Camera className="w-4 h-4" /> Scanner le QR du Guest
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200"
              >
                <X className="w-3.5 h-3.5" /> Fermer
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-primary-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setEntryMode('scan')
                    setErrorMessage('')
                    hasHandledResultRef.current = false
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    entryMode === 'scan' ? 'bg-white text-primary-800 shadow-sm' : 'text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" /> Scanner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEntryMode('manual')
                    setErrorMessage('')
                    hasHandledResultRef.current = false
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    entryMode === 'manual' ? 'bg-white text-primary-800 shadow-sm' : 'text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" /> Saisir la clé
                </button>
              </div>

              {entryMode === 'scan' && (
                <div className="relative rounded-2xl overflow-hidden border border-primary-200 bg-black">
                  {canScan && (
                    <Scanner
                      onScan={handleScan}
                      onError={handleScannerError}
                      constraints={{ facingMode: 'environment' }}
                      styles={{ container: { width: '100%', minHeight: '280px' } }}
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative w-56 h-56 rounded-2xl border-2 border-primary-200/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]">
                      <div className="absolute left-2 right-2 h-0.5 bg-primary-200/90 animate-pulse top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {isInitializing && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-primary-50 text-sm font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" /> Initialisation caméra...
                      </div>
                    </div>
                  )}

                  {isSubmitting && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-primary-50 text-sm font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" /> Vérification du code...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {entryMode === 'manual' && (
                <div className="rounded-2xl border border-primary-200 bg-white p-3 space-y-2">
                  <label className="text-xs font-semibold text-primary-700">Entrez la clé secrète du guest</label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(event) => setManualCode(event.target.value)}
                    placeholder="UUID / secretCode"
                    className="w-full rounded-xl border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                  />
                  <button
                    type="button"
                    onClick={handleManualSubmit}
                    disabled={!canSubmitManual}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Vérifier la clé
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-xs text-primary-500">
                {entryMode === 'scan'
                  ? 'Placez le QR du guest dans le cadre pour valider la remise des clés.'
                  : 'Vous pouvez valider manuellement si la caméra ne fonctionne pas.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
