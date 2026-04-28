import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Reset password (placeholder). Token: ' + token)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-lg font-bold mb-2">Reset password</h1>
        <p className="text-sm text-slate-500 mb-4">Choose a new password. Token: {token || 'none'}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="New password"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button className="w-full py-2 bg-primary-600 text-white rounded-lg">Set new password</button>
        </form>

        <p className="text-xs text-slate-400 mt-4">This is a placeholder page. Backend endpoint may be required.</p>
      </div>
    </div>
  )
}
