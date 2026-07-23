import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LanguageContext } from '@/context/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const FAQPage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.faqPage;
  const [activeTab, setActiveTab] = useState(t.categories[0].key);

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <link rel="canonical" href="https://naftalissolutions.com/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://naftalissolutions.com/faq" />
        <meta property="og:title" content={t.meta.title} />
        <meta property="og:description" content={t.meta.description} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: t.categories.flatMap(cat => cat.items.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          }))),
        })}</script>
      </Helmet>

      <div className="space-y-16" dir={language === 'he' ? 'rtl' : 'ltr'}>
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

        <section className="max-w-3xl mx-auto pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-4">
              <TabsList>
                {t.categories.map(cat => (
                  <TabsTrigger key={cat.key} value={cat.key}>{cat.label}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            {t.categories.map(cat => (
              <TabsContent key={cat.key} value={cat.key}>
                <Accordion type="single" collapsible className="bg-white rounded-2xl shadow-lg px-6">
                  {cat.items.map((item, i) => (
                    <AccordionItem key={i} value={`${cat.key}-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </>
  );
};

export default FAQPage;
