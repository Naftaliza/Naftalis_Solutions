import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/context/LanguageContext';

export default function NotFoundPage() {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.notFoundPage;

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center py-32"
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <h1 className="text-9xl font-extrabold text-teal-500">{t.heading}</h1>
        <h2 className="text-3xl font-bold text-slate-800 mt-6 mb-3">{t.title}</h2>
        <p className="text-slate-500 mb-10">{t.subtitle}</p>
        <Link to="/">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-full text-lg">
            {t.button}
          </Button>
        </Link>
      </motion.div>
    </>
  );
}
