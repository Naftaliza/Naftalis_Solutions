import React, { useContext } from 'react';
import { MessageCircle } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/whatsapp';

const WhatsAppButton = () => {
  const { language, translations } = useContext(LanguageContext);
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE[language])}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={translations.whatsappWidget.ariaLabel}
      className="fixed bottom-20 md:bottom-6 left-4 z-40 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
};

export default WhatsAppButton;
