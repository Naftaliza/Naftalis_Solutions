import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';

const BlogPage = () => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations.blogPage;

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <link rel="canonical" href="https://naftalissolutions.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://naftalissolutions.com/blog" />
        <meta property="og:title" content={t.meta.title} />
        <meta property="og:description" content={t.meta.description} />
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

        <section className="max-w-3xl mx-auto pb-24 space-y-16">
          {t.posts.map((post, index) => (
            <motion.article
              key={post.slug}
              id={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg scroll-mt-24"
            >
              <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-3">
                <Clock size={14} aria-hidden="true" />
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{post.title}</h2>
              <p className="text-slate-500 italic mb-6">{post.excerpt}</p>
              <div className="space-y-5">
                {post.content.map((block, i) => (
                  <div key={i}>
                    {block.heading && <h3 className="text-lg font-semibold text-slate-800 mb-2">{block.heading}</h3>}
                    <p className="text-slate-600 leading-relaxed">{block.body}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </>
  );
};

export default BlogPage;
