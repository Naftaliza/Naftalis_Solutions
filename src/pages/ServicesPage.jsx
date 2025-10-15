import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MessageCircle, BarChart2, Zap, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '@/context/LanguageContext';

const ServiceCard = ({ icon, title, description, features, index }) => {
  const { language, translations } = useContext(LanguageContext);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border-t-4 border-teal-500"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0 w-16 h-16 bg-slate-100 text-teal-600 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed mb-6 flex-grow">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-teal-500 flex-shrink-0" />
            <span className="text-slate-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/contact" className="mt-auto">
        <Button className="w-full bg-slate-800 hover:bg-teal-500 text-white font-semibold shadow-md transition-colors duration-300">
          {translations.servicesPage.inquireNow} <ArrowRight className={language === 'he' ? 'mr-2' : 'ml-2'} size={16} />
        </Button>
      </Link>
    </motion.div>
  );
};

const ServicesPage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.servicesPage;

  const services = [
    {
      icon: <Calendar size={32} />,
      title: t.cards.scheduling.title,
      description: t.cards.scheduling.description,
      features: t.cards.scheduling.features,
    },
    {
      icon: <MessageCircle size={32} />,
      title: t.cards.whatsapp.title,
      description: t.cards.whatsapp.description,
      features: t.cards.whatsapp.features,
    },
    {
      icon: <BarChart2 size={32} />,
      title: t.cards.dashboards.title,
      description: t.cards.dashboards.description,
      features: t.cards.dashboards.features,
    },
  ];

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

        <section>
          <div className="grid lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <ServiceCard key={index} index={index} {...service} />
            ))}
          </div>
        </section>

        <section className="bg-slate-100 p-12 rounded-2xl flex flex-col md:flex-row items-center gap-12">
           <motion.div
            initial={{ opacity: 0, x: language === 'he' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
           >
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 font-semibold px-4 py-1 rounded-full mb-4">
                <Settings size={16} />
                <span>{t.custom.tag}</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.custom.title}</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {t.custom.description}
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                {t.custom.button}
              </Button>
            </Link>
           </motion.div>
           <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1"
           >
              <img alt="Blueprint of a custom tech solution" className="rounded-xl shadow-lg" src="https://images.unsplash.com/photo-1578401057158-0e58789f5947" />
           </motion.div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;