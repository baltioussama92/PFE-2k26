import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function GuestCheckInQRCode({ secretCode }) {
  if (!secretCode) return null

  return (
    <div className="mt-4 rounded-2xl border border-primary-200 bg-primary-50 p-4">
      <p className="text-sm font-semibold text-primary-800 mb-3">Code QR de check-in</p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="rounded-xl bg-white p-3 border border-primary-100">
          <QRCodeSVG value={secretCode} size={164} includeMargin />
        </div>
        <div className="text-sm text-primary-600">
          <p className="font-medium text-primary-700 mb-2">
            Show this to the host at check-in to receive your keys.
          </p>
          <p className="text-xs text-primary-500 break-all">
            Secret code: {secretCode}
          </p>
        </div>
      </div>
    </div>
  )
}
