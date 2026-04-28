import React, { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Password reset request submitted (placeholder)')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-lg font-bold mb-2">Forgot password</h1>
        <p className="text-sm text-slate-500 mb-4">Enter your email and we'll send a reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button className="w-full py-2 bg-primary-600 text-white rounded-lg">Send reset link</button>
        </form>

        <p className="text-xs text-slate-400 mt-4">This is a placeholder page. Backend endpoint may be required.</p>
      </div>
    </div>
  )
}
