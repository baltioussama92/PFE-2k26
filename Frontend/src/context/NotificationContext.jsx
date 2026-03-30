import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const NotificationContext = createContext({
  notify: (_message, _type = 'info') => {},
})

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    const onNotify = (event) => {
      const payload = event?.detail || {}
      if (payload?.message) {
        notify(payload.message, payload.type || 'info')
      }
    }

    window.addEventListener('app:notify', onNotify)
    return () => window.removeEventListener('app:notify', onNotify)
  }, [notify])

  useEffect(() => {
    const authError = sessionStorage.getItem('appAuthError')
    if (authError) {
      notify(authError, 'error')
      sessionStorage.removeItem('appAuthError')
    }
  }, [notify])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[260px] max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : toast.type === 'success'
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-primary-200 text-primary-700'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
