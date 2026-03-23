import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LanguageContext } from '@/context/LanguageContext';
import founderImg from '@/img/1753517099229.jpg';

const ValueCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-8 rounded-2xl shadow-lg text-center"
  >
    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 mx-auto">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const AboutPage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.aboutPage;

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
      </Helmet>

      <div className="space-y-24" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            {t.hero.title1} <span className="gradient-text">{t.hero.title2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>
        </motion.section>

        <section className="flex flex-col md:flex-row items-center gap-12 bg-slate-100 p-12 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl flex-shrink-0"
          >
            <img alt={t.founder.alt} className="w-full h-full object-cover" src={founderImg} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.founder.title}</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {t.founder.quote}
            </p>
            <p className="font-semibold text-slate-900">{t.founder.name}</p>
          </motion.div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">{t.values.title}</h2>
          <p className="mt-4 text-lg text-slate-500">{t.values.subtitle}</p>
          <div className="w-24 h-1.5 bg-teal-500 mx-auto mt-6 rounded-full"></div>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <ValueCard
              icon={<Users size={32} />}
              title={t.values.cards.customer.title}
              description={t.values.cards.customer.description}
              delay={0.2}
            />
            <ValueCard
              icon={<Zap size={32} />}
              title={t.values.cards.simplicity.title}
              description={t.values.cards.simplicity.description}
              delay={0.4}
            />
            <ValueCard
              icon={<Target size={32} />}
              title={t.values.cards.impact.title}
              description={t.values.cards.impact.description}
              delay={0.6}
            />
          </div>
        </section>

        <section className="text-center bg-teal-500 text-white p-16 rounded-2xl">
          <h2 className="text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-8">
            {t.cta.subtitle}
          </p>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="bg-white text-teal-600 hover:bg-slate-100 font-bold py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2">
              {t.cta.button}
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default AboutPage;