import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, Mail, Phone, MessageCircle } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/whatsapp';

const Footer = () => {
    const { language, translations } = useContext(LanguageContext);
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <Mail size={20} />, label: translations.footer.social.email, href: 'mailto:naftalissolutions@gmail.com' },
        { icon: <Phone size={20} />, label: translations.footer.social.call, href: 'tel:+972527073229' },
        { icon: <MessageCircle size={20} />, label: translations.footer.social.whatsapp, href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE[language])}` },
    ];

    const footerLinks = [
        { to: '/about', label: translations.footer.about },
        { to: '/services', label: translations.footer.services },
        { to: '/faq', label: translations.footer.faq },
        { to: '/blog', label: translations.footer.blog },
        { to: '/contact', label: translations.footer.contact },
    ];

    return (
        <footer className="bg-slate-100 border-t border-slate-200" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <NavLink to="/" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Rocket size={28} className="text-teal-500" />
                            <span>{translations.footer.brand}</span>
                        </NavLink>
                        <p className="text-slate-600 max-w-xs">
                            {translations.footer.tagline}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-slate-800 mb-4">{translations.footer.quickLinks}</p>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.to}>
                                    <NavLink to={link.to} className="text-slate-600 hover:text-teal-500 transition-colors">
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                     <div>
                        <p className="font-semibold text-slate-800 mb-4">{translations.footer.connect}</p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map(social => (
                                <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-slate-500 hover:text-teal-500 transition-colors">
                                    {social.icon}
                                    <span className="sr-only">{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 space-y-2">
                    <p>&copy; {currentYear} {translations.footer.brand}. {translations.footer.rights}</p>
                    <p>
                        <NavLink to="/privacy-policy" className="hover:text-teal-500 transition-colors underline">
                            {translations.footer.privacyPolicy}
                        </NavLink>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;