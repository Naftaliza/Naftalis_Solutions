import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, translations } = useContext(LanguageContext);

  const navLinks = [
    { to: "/about", label: translations.header.about },
    { to: "/services", label: translations.header.services },
    { to: "/faq", label: translations.header.faq },
    { to: "/contact", label: translations.header.contact },
  ];

  const NavLinkItem = ({ to, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `font-medium transition-colors duration-300 ${
          isActive ? 'text-teal-500' : 'text-slate-600 hover:text-teal-500'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-lg"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 py-4">
          <NavLink to="/" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <Rocket size={28} className="text-teal-500" aria-hidden="true" />
            <span>{translations.header.brand}</span>
          </NavLink>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => <NavLinkItem key={link.to} {...link} />)}
            <Button variant="ghost" onClick={toggleLanguage} className="font-bold">
              {language === 'en' ? 'HE' : 'EN'}
            </Button>
            <NavLink to="/quote">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                {translations.header.getQuote}
              </Button>
            </NavLink>
          </nav>
          
          <div className="md:hidden flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={toggleLanguage} className="font-bold">
              {language === 'en' ? 'HE' : 'EN'}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-50 border-b border-slate-200"
        >
          <nav className="flex flex-col items-center gap-6 py-6">
            {navLinks.map(link => <NavLinkItem key={link.to} {...link} onClick={() => setIsMenuOpen(false)} />)}
            <NavLink to="/quote" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white mt-4">
                {translations.header.getQuote}
              </Button>
            </NavLink>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;