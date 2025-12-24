
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Language, translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language] || translations['en'],
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  // Ensure t is never undefined even if a sub-key is accessed
  return {
    ...context,
    t: context.t || translations['en']
  };
};
