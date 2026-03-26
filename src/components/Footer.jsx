import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, Twitter, Linkedin, Github } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LanguageContext } from '@/context/LanguageContext';

const Footer = () => {
    const { toast } = useToast();
    const { language, translations } = useContext(LanguageContext);
    const currentYear = new Date().getFullYear();

    const handleSocialClick = () => {
        toast({
            title: "🚧 Feature Coming Soon!",
            description: "Social media links are not yet configured. You can request this in a future prompt!",
        });
    };

    const socialLinks = [
        { icon: <Twitter size={20} />, label: 'Twitter' },
        { icon: <Linkedin size={20} />, label: 'LinkedIn' },
        { icon: <Github size={20} />, label: 'GitHub' },
    ];

    const footerLinks = [
        { to: '/about', label: translations.footer.about },
        { to: '/services', label: translations.footer.services },
        { to: '/contact', label: translations.footer.contact },
    ];

    return (
        <footer className="bg-slate-900/80 backdrop-blur border-t border-slate-700/50" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <NavLink to="/" className="flex items-center gap-3 text-2xl font-bold text-white">
                            <Rocket size={28} className="text-teal-500" />
                            <span>{translations.footer.brand}</span>
                        </NavLink>
                        <p className="text-slate-400 max-w-xs">
                            {translations.footer.tagline}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-white mb-4">{translations.footer.quickLinks}</p>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.to}>
                                    <NavLink to={link.to} className="text-slate-400 hover:text-teal-400 transition-colors">
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                     <div>
                        <p className="font-semibold text-white mb-4">{translations.footer.connect}</p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map(social => (
                                <button key={social.label} onClick={handleSocialClick} className="text-slate-400 hover:text-teal-400 transition-colors">
                                    {social.icon}
                                    <span className="sr-only">{social.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-700/50 text-center text-slate-500">
                    <p>&copy; {currentYear} {translations.footer.brand}. {translations.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;