import React from 'react'
import { useParams } from 'react-router-dom'

export default function BookingConfirm({ user }) {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-lg font-bold mb-2">Booking confirmation</h1>
        <p className="text-sm text-slate-500 mb-4">Booking ID: {id}</p>

        <p className="mb-4">This page is a placeholder for the post-booking summary and simulated payment step.</p>

        <div className="flex gap-3">
          <button className="py-2 px-4 bg-primary-600 text-white rounded-lg">Simulate payment</button>
          <button className="py-2 px-4 border rounded-lg">Back to bookings</button>
        </div>
      </div>
    </div>
  )
}
