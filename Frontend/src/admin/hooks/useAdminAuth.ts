import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const USER_STORAGE_KEY = 'user'
const ROLE_STORAGE_KEY = 'userRole'

const extractRole = (): string => {
  const explicitRole = localStorage.getItem(ROLE_STORAGE_KEY)
  if (explicitRole) return explicitRole.toLowerCase()

  const userRaw = localStorage.getItem(USER_STORAGE_KEY)
  if (!userRaw) return ''

  try {
    const parsed = JSON.parse(userRaw)
    return String(parsed?.role || '').toLowerCase()
  } catch {
    return ''
  }
}

export function useAdminAuth() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [role, setRole] = useState('')

  useEffect(() => {
    const currentRole = extractRole()
    setRole(currentRole)

    if (currentRole !== 'admin') {
      navigate('/', { replace: true })
      return
    }

    setIsChecking(false)
  }, [navigate])

  const isAdmin = useMemo(() => role === 'admin', [role])

  return {
    isChecking,
    isAdmin,
  }
}
