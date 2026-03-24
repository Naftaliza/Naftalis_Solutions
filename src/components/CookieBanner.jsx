import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '@/context/LanguageContext';

const text = {
  en: {
    message: 'We use cookies to improve your experience and analyze site traffic with Google Analytics.',
    accept: 'Accept',
    decline: 'Decline',
    policy: 'Privacy Policy',
  },
  he: {
    message: 'אנו משתמשים בעוגיות לשיפור חווית המשתמש וניתוח תנועת האתר עם Google Analytics.',
    accept: 'אישור',
    decline: 'דחייה',
    policy: 'מדיניות פרטיות',
  },
};

export default function CookieBanner() {
  const { language } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);
  const t = text[language] || text.en;

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);

    if (consent === 'accepted') enableAnalytics();
  }, []);

  function enableAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  }

  function handleAccept() {
    localStorage.setItem('cookie_consent', 'accepted');
    enableAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl"
        >
          <p className="text-sm text-slate-300 max-w-2xl">
            {t.message}
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm rounded border border-slate-500 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {t.decline}
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm rounded bg-teal-500 hover:bg-teal-400 text-white font-medium transition-colors"
            >
              {t.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
