"use client";
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [fontSize, setFontSize] = useState(100); // percentage
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedFontSize = localStorage.getItem('fontSize');
    const savedReducedMotion = localStorage.getItem('reducedMotion');
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedDyslexicFont = localStorage.getItem('dyslexicFont');
    const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const systemHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      setThemeState('system');
    }
    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedReducedMotion !== null) {
      setIsReducedMotion(savedReducedMotion === 'true');
    } else {
      setIsReducedMotion(systemReducedMotion);
    }
    if (savedHighContrast !== null) {
      setHighContrast(savedHighContrast === 'true');
    } else {
      setHighContrast(systemHighContrast);
    }
    if (savedDyslexicFont !== null) {
      setDyslexicFont(savedDyslexicFont === 'true');
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      const html = document.querySelector('html');
      let appliedTheme = theme;
      if (theme === 'system') {
        appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (html) {
        html.className = appliedTheme;
        html.setAttribute('data-theme', appliedTheme);
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme, isMounted]);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.setProperty('--font-size', `${fontSize}%`);
      localStorage.setItem('fontSize', fontSize.toString());
    }
  }, [fontSize, isMounted]);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.setAttribute('data-reduced-motion', isReducedMotion.toString());
      document.documentElement.style.setProperty('--motion-speed', isReducedMotion ? '0.01ms' : '0.3s');
      localStorage.setItem('reducedMotion', isReducedMotion.toString());
    }
  }, [isReducedMotion, isMounted]);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.setAttribute('data-high-contrast', highContrast.toString());
      localStorage.setItem('highContrast', highContrast.toString());
    }
  }, [highContrast, isMounted]);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.setAttribute('data-dyslexic-font', dyslexicFont.toString());
      localStorage.setItem('dyslexicFont', dyslexicFont.toString());
    }
  }, [dyslexicFont, isMounted]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const toggleReducedMotion = () => setIsReducedMotion((v) => !v);
  const toggleHighContrast = () => setHighContrast((v) => !v);
  const toggleDyslexicFont = () => setDyslexicFont((v) => !v);

  if (!isMounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: 'light',
          setTheme: () => {},
          fontSize: 100,
          setFontSize: () => {},
          isReducedMotion: false,
          toggleReducedMotion: () => {},
          highContrast: false,
          toggleHighContrast: () => {},
          dyslexicFont: false,
          toggleDyslexicFont: () => {},
        }}
      >
        <div className="min-h-screen bg-background">{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        isReducedMotion,
        toggleReducedMotion,
        highContrast,
        toggleHighContrast,
        dyslexicFont,
        toggleDyslexicFont,
      }}
    >
      <div
        className={theme}
        data-theme={theme}
        style={{
          '--font-size': `${fontSize}%`,
          '--motion-speed': isReducedMotion ? '0.01ms' : '0.3s',
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}