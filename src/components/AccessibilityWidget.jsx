import React, { useState, useEffect, useContext } from 'react';
import { Eye, Type, Sun, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';

const STORAGE_KEY = 'accessibility_prefs';

const defaults = {
  fontSize: 0,       // offset in px added to root font size
  contrast: false,
  grayscale: false,
  dyslexia: false,
  highlight: false,
};

function loadPrefs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

export default function AccessibilityWidget() {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.accessibility;
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    applyPrefs(prefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  function applyPrefs(p) {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = p.fontSize !== 0 ? `${16 + p.fontSize}px` : '';

    // High contrast
    root.classList.toggle('a11y-contrast', p.contrast);

    // Grayscale
    root.classList.toggle('a11y-grayscale', p.grayscale);

    // Dyslexia font
    root.classList.toggle('a11y-dyslexia', p.dyslexia);

    // Link/focus highlight
    root.classList.toggle('a11y-highlight', p.highlight);
  }

  function update(key, value) {
    setPrefs(prev => ({ ...prev, [key]: value }));
  }

  function reset() {
    setPrefs(defaults);
  }

  const toggles = [
    { key: 'contrast', label: t.contrast, icon: Sun },
    { key: 'grayscale', label: t.grayscale, icon: Eye },
    { key: 'dyslexia', label: t.dyslexia, icon: Type },
    { key: 'highlight', label: t.highlight, icon: Eye },
  ];

  return (
    <>
      {/* Inject CSS classes */}
      <style>{`
        .a11y-contrast { filter: contrast(1.5); }
        .a11y-grayscale { filter: grayscale(1); }
        .a11y-contrast.a11y-grayscale { filter: contrast(1.5) grayscale(1); }
        .a11y-dyslexia, .a11y-dyslexia * { font-family: 'Arial', 'Arial Hebrew', 'Rubik', 'Segoe UI', sans-serif !important; letter-spacing: 0.05em; word-spacing: 0.1em; line-height: 1.8 !important; }
        .a11y-highlight a:focus, .a11y-highlight button:focus, .a11y-highlight [tabindex]:focus { outline: 3px solid #f59e0b !important; outline-offset: 3px !important; }
        .a11y-highlight a { text-decoration: underline !important; }
      `}</style>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={t.openLabel}
        aria-expanded={open}
        className="fixed bottom-36 md:bottom-20 right-4 z-50 bg-teal-600 hover:bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        <Eye size={22} aria-hidden="true" />
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t.title}
          dir={language === 'he' ? 'rtl' : 'ltr'}
          className="fixed bottom-52 md:bottom-36 right-4 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 w-64"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 text-sm">{t.title}</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label={t.closeLabel}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium">{t.textSize}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => update('fontSize', Math.max(prefs.fontSize - 2, -4))}
                aria-label={t.smaller}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
              >
                <ZoomOut size={14} aria-hidden="true" /> {t.smaller}
              </button>
              <button
                onClick={() => update('fontSize', Math.min(prefs.fontSize + 2, 10))}
                aria-label={t.larger}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
              >
                <ZoomIn size={14} aria-hidden="true" /> {t.larger}
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 mb-4">
            {toggles.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => update(key, !prefs[key])}
                aria-pressed={prefs[key]}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
                  prefs[key]
                    ? 'bg-teal-50 border-teal-400 text-teal-700 font-medium'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </span>
                <span className={`w-4 h-4 rounded-full border-2 ${prefs[key] ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`} aria-hidden="true" />
              </button>
            ))}
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={12} aria-hidden="true" />
            {t.reset}
          </button>
        </div>
      )}
    </>
  );
}
