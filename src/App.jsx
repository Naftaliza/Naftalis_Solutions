import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SolutionsPage from '@/pages/SolutionsPage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';
import QuotePage from '@/pages/QuotePage';
import QuoteThankYouPage from '@/pages/QuoteThankYouPage';
import { LanguageProvider } from '@/context/LanguageContext';

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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<SolutionsPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/quote-thank-you" element={<QuoteThankYouPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </LanguageProvider>
  );
}

export default App;