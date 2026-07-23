import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileCtaBar from '@/components/MobileCtaBar';
import { LanguageProvider } from '@/context/LanguageContext';

const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const QuotePage = lazy(() => import('@/pages/QuotePage'));
const QuoteThankYouPage = lazy(() => import('@/pages/QuoteThankYouPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <LanguageProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-500 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:font-bold"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <Header />
        <main id="main-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-8 w-full">
          <ScrollToTop />
          <Suspense fallback={<div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" /></div>}>
            <Routes>
              <Route path="/" element={<SolutionsPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/quote-thank-you" element={<QuoteThankYouPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Toaster />
      <CookieBanner />
      <AccessibilityWidget />
      <WhatsAppButton />
      <MobileCtaBar />
    </LanguageProvider>
  );
}

export default App;
