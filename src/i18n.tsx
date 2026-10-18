import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'zh' | 'en'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (zhText: string, enText: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'pmc_library_lang'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Mandarin ('zh') to match https://pioneercommunity.org.my/
  const [lang, setLangState] = useState<Language>('zh')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null
      if (saved === 'zh' || saved === 'en') {
        setLangState(saved)
      }
    } catch {
      // ignore localStorage errors
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      // ignore
    }
  }

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh')
  }

  const t = (zhText: string, enText: string) => {
    return lang === 'zh' ? zhText : enText
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return {
      lang: 'zh' as Language,
      setLang: () => {},
      toggleLang: () => {},
      t: (zhText: string, _enText: string) => zhText,
    }
  }
  return ctx
}
