import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { notificationService } from '../services/notificationService'

const formatRelativeTime = (value) => {
  if (!value) return ''
  const now = Date.now()
  const then = new Date(value).getTime()
  const diffMinutes = Math.max(1, Math.round((now - then) / 60000))
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `il y a ${diffHours} h`
  const diffDays = Math.round(diffHours / 24)
  return `il y a ${diffDays} j`
}

export default function NotificationBell({ user }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  )

  const refreshNotifications = async () => {
    if (!user?.id) {
      setNotifications([])
      return
    }

    setLoading(true)
    try {
      const data = await notificationService.listMine()
      setNotifications(data)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
      )
    } catch {
      // Ignore transient failures to keep UI responsive.
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
    } catch {
      // Ignore transient failures to keep UI responsive.
    }
  }

  useEffect(() => {
    refreshNotifications().catch(() => {})
    const timer = window.setInterval(() => {
      refreshNotifications().catch(() => {})
    }, 12000)

    return () => window.clearInterval(timer)
  }, [user?.id])

  useEffect(() => {
    const handler = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((value) => !value)}
        className="relative p-2 rounded-xl text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-150"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-primary-100">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-96 rounded-2xl border border-primary-200/60 bg-white/80 backdrop-blur-2xl shadow-glass-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-primary-200/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-900">Notifications</p>
                <p className="text-[11px] text-primary-500">{loading ? 'Mise a jour...' : `${notifications.length} total`}</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-primary-500 text-center">
                Aucune notification pour le moment.
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => markAsRead(item.id)}
                    className={`w-full text-left px-4 py-3 border-b border-primary-100/70 transition-colors ${
                      item.isRead
                        ? 'hover:bg-primary-50/70'
                        : 'bg-[#A65B32]/10 hover:bg-[#A65B32]/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.isRead ? 'bg-primary-200' : 'bg-[#A65B32]'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary-900 truncate">{item.title}</p>
                        <p className="text-xs text-primary-700 truncate">{item.message}</p>
                        <p className="text-[11px] text-primary-500 mt-1">{formatRelativeTime(item.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
