import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LanguageContext } from '@/context/LanguageContext';

const PrivacyPolicyPage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.privacyPolicyPage;

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <link rel="canonical" href="https://naftalissolutions.com/privacy-policy" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div dir={language === 'he' ? 'rtl' : 'ltr'}>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{t.hero.title}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.hero.subtitle}</p>
        </motion.section>

        <section className="max-w-3xl mx-auto pb-24 space-y-10">
          {t.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{section.heading}</h2>
              <p className="text-slate-600 leading-relaxed">{section.body}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
