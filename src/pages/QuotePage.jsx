import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '@/context/LanguageContext';

const PricingCard = ({ plan, index }) => {
  const { translations } = useContext(LanguageContext);
  const isPopular = plan.popular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative flex flex-col rounded-2xl shadow-lg p-8 ${isPopular ? 'bg-slate-800 text-white' : 'bg-white'}`}
    >
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">{translations.quotePage.popular}</span>
        </div>
      )}
      <h3 className={`text-2xl font-bold ${isPopular ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
      <p className={`mt-2 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>{plan.description}</p>
      
      <div className="mt-6">
        <span className={`text-5xl font-extrabold ${isPopular ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
        <span className={`ml-1 text-lg font-medium ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.period}</span>
      </div>

      <ul className="mt-8 space-y-4 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <CheckCircle2 className={`h-6 w-6 flex-shrink-0 ${isPopular ? 'text-teal-400' : 'text-teal-500'}`} />
            <span className="ml-3">{feature}</span>
          </li>
        ))}
      </ul>

      <Link to="/quote-thank-you" state={{ selectedPlan: plan }} className="mt-8">
        <Button size="lg" className={`w-full font-bold text-lg ${isPopular ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
          {translations.quotePage.ctaButton}
        </Button>
      </Link>
    </motion.div>
  );
};

const QuotePage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.quotePage;

  const plans = [
    {
      name: t.plans.basic.name,
      description: t.plans.basic.description,
      price: t.plans.basic.price,
      period: t.plans.basic.period,
      features: t.plans.basic.features,
      popular: false,
    },
    {
      name: t.plans.standard.name,
      description: t.plans.standard.description,
      price: t.plans.standard.price,
      period: t.plans.standard.period,
      features: t.plans.standard.features,
      popular: true,
    },
    {
      name: t.plans.premium.name,
      description: t.plans.premium.description,
      price: t.plans.premium.price,
      period: t.plans.premium.period,
      features: t.plans.premium.features,
      popular: false,
    },
  ];
  
  const rawPlans = {
    en: [
        { name: "Basic", price: "$99", period: "/mo", features: ["Smart Appointment Scheduling", "Email & SMS Reminders", "Basic Calendar Integration", "Email Support"]},
        { name: "Standard", price: "$199", period: "/mo", features: ["Everything in Basic, plus:", "WhatsApp Business Integration", "Simple Business Dashboard", "Priority Email & Chat Support"]},
        { name: "Premium", price: "Custom", period: "", features: ["Everything in Standard, plus:", "Advanced Custom Dashboard", "Bespoke Feature Development", "Dedicated Account Manager", "Phone & Priority Support"]},
    ],
    he: [
        { name: "בסיסית", price: "₪349", period: "/חודש", features: ["מערכת חכמה לקביעת תורים", "תזכורות במייל וב-SMS", "אינטגרציה בסיסית עם יומן", "תמיכה במייל"]},
        { name: "סטנדרט", price: "₪699", period: "/חודש", features: ["כל מה שבחבילת הבסיס, ובנוסף:", "אינטגרציה עסקית עם וואטסאפ", "דשבורד עסקי פשוט", "תמיכה בעדיפות במייל ובצ'אט"]},
        { name: "פרימיום", price: "מותאם", period: "", features: ["כל מה שבחבילת הסטנדרט, ובנוסף:", "דשבורד מותאם אישית מתקדם", "פיתוח פיצ'רים ייעודיים", "מנהל תיק לקוח אישי", "תמיכה טלפונית ובעדיפות עליונה"]},
    ]
  };

  const currentPlans = plans.map((plan, index) => ({
    ...plan,
    raw: rawPlans[language][index]
  }));

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

        <section className="grid lg:grid-cols-3 gap-10 items-stretch">
          {currentPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </section>
      </div>
    </>
  );
};

export default QuotePage;