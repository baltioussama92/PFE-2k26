import React, { useState } from 'react'

export default function ReportPage() {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Report submitted (placeholder)')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-lg font-bold mb-2">Report user / property</h1>
        <p className="text-sm text-slate-500 mb-4">Describe the issue. Admin will receive a report.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea value={text} onChange={(e) => setText(e.target.value)} required className="w-full p-3 border rounded-lg" rows={6} />
          <button className="w-full py-2 bg-primary-600 text-white rounded-lg">Submit report</button>
        </form>

        <p className="text-xs text-slate-400 mt-4">Placeholder form. Backend report endpoint may be required.</p>
      </div>
    </div>
  )
}
