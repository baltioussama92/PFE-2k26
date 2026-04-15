import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DICTIONARY, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY } from '../i18n/dictionary'

const LanguageContext = createContext(null)

const getInitialLanguage = () => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved && LANGUAGE_OPTIONS.some((item) => item.code === saved)) {
      return saved
    }
  } catch {
    // Ignore storage errors and use fallback language.
  }
  return 'fr'
}

const getDocumentLang = (code) => (code === 'tn' ? 'ar' : code)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => getInitialLanguage())

  useEffect(() => {
    document.documentElement.lang = getDocumentLang(language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = useCallback((nextLanguage) => {
    if (!LANGUAGE_OPTIONS.some((item) => item.code === nextLanguage)) {
      return
    }

    setLanguageState(nextLanguage)

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    } catch {
      // Ignore storage errors in restricted contexts.
    }

  }, [])

  const t = useCallback((key) => {
    const selected = DICTIONARY[language] || {}
    const fallback = DICTIONARY.fr || {}
    return selected[key] || fallback[key] || key
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    languageOptions: LANGUAGE_OPTIONS,
    t,
  }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
