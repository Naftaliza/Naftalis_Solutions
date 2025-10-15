import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MessageCircle, BarChart2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LanguageContext } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';

const SolutionCard = ({ icon, title, description, index }) => {
  const { language, translations } = useContext(LanguageContext);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
      <Link to="/services">
        <Button variant="link" className="text-teal-600 font-bold p-0 mt-6 self-start hover:text-teal-700">
          {translations.learnMore} <ArrowRight className={language === 'he' ? 'mr-2' : 'ml-2'} size={16} />
        </Button>
      </Link>
    </motion.div>
  );
};

const SolutionsPage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.solutionsPage;
  
  const solutions = [
    {
      icon: <Calendar size={32} />,
      title: t.cards.scheduling.title,
      description: t.cards.scheduling.description,
    },
    {
      icon: <MessageCircle size={32} />,
      title: t.cards.whatsapp.title,
      description: t.cards.whatsapp.description,
    },
    {
      icon: <BarChart2 size={32} />,
      title: t.cards.dashboards.title,
      description: t.cards.dashboards.description,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-24"
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <div className="text-center py-20 md:py-28">
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
           >
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t.hero.title1} <span className="gradient-text">{t.hero.title2}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  {t.hero.ctaExplore}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-bold py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2">
                  {t.hero.ctaQuote}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900">{t.solutions.title}</h2>
            <p className="mt-4 text-lg text-slate-500">{t.solutions.subtitle}</p>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} index={index} {...solution} />
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default SolutionsPage;