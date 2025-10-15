import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/context/LanguageContext';
import { CheckCircle, ArrowRight } from 'lucide-react';

const QuoteThankYouPage = () => {
    const { language, translations } = useContext(LanguageContext);
    const location = useLocation();

    if (!location.state?.selectedPlan) {
        return <Navigate to="/quote" replace />;
    }

    const { selectedPlan } = location.state;
    const t = translations.quoteThankYouPage;

    return (
        <>
            <Helmet>
                <title>{t.meta.title}</title>
                <meta name="description" content={t.meta.description} />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center py-20"
                dir={language === 'he' ? 'rtl' : 'ltr'}
            >
                <CheckCircle className="w-24 h-24 text-teal-500 mb-6" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                    {t.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                    {t.hero.subtitle.replace('{planName}', selectedPlan.name)}
                </p>
                <Link to="/contact" state={{ selectedPlan }}>
                    <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 text-lg">
                        {t.ctaButton}
                        <ArrowRight className={language === 'he' ? 'mr-2' : 'ml-2'} />
                    </Button>
                </Link>
            </motion.div>
        </>
    );
};

export default QuoteThankYouPage;