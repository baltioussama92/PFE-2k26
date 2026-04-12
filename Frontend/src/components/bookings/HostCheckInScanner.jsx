import React, { useMemo, useState } from 'react'

export default function HostCheckInScanner({ bookingId, onVerify, loading }) {
  const [manualCode, setManualCode] = useState('')

  const canSubmitManual = useMemo(() => manualCode.trim().length > 0 && !loading, [manualCode, loading])

  return (
    <div className="mt-4 rounded-2xl border border-primary-200 bg-primary-50 p-4">
      <p className="text-sm font-semibold text-primary-800 mb-3">Scanner le QR du locataire</p>

      <div className="rounded-xl border border-primary-200 bg-white px-3 py-2">
        <p className="text-xs text-primary-500">
          Fallback manuel activé: collez le `secretCode` affiché sur le QR du locataire puis validez.
        </p>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Coller le secretCode"
          className="flex-1 px-3 py-2 rounded-xl border border-primary-200 text-sm text-primary-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none"
        />
        <button
          type="button"
          disabled={!canSubmitManual}
          onClick={() => onVerify(bookingId, manualCode.trim())}
          className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-60"
        >
          Vérifier le check-in
        </button>
      </div>
    </div>
  )
}
