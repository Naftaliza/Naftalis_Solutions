import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/whatsapp';

const MobileCtaBar = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.mobileCta;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE[language])}`;

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] grid grid-cols-3"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <a href="tel:+972527073229" className="flex flex-col items-center justify-center gap-0.5 py-2 text-slate-600 active:bg-slate-50">
        <Phone size={18} aria-hidden="true" />
        <span className="text-xs font-medium">{t.call}</span>
      </a>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2 text-slate-600 border-x border-slate-100 active:bg-slate-50">
        <MessageCircle size={18} aria-hidden="true" />
        <span className="text-xs font-medium">{t.whatsapp}</span>
      </a>
      <NavLink to="/quote" className="flex flex-col items-center justify-center gap-0.5 py-2 text-teal-600 font-semibold active:bg-teal-50">
        <CalendarCheck size={18} aria-hidden="true" />
        <span className="text-xs">{t.quote}</span>
      </NavLink>
    </div>
  );
};

export default MobileCtaBar;
