import React, { useState, useContext, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const { toast } = useToast();
  const { language, translations } = useContext(LanguageContext);
  const t = translations.contactPage;
  const form = useRef();
  const location = useLocation();
  
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    if (location.state?.selectedPlan) {
      const { selectedPlan } = location.state;
      const plan = selectedPlan.raw;
      
      const subject = language === 'he' 
        ? `בקשת הצעת מחיר: ${plan.name}`
        : `Quote Request: ${plan.name} Plan`;

      const priceInfo = plan.price === 'Custom' || plan.price === 'מותאם'
        ? (language === 'he' ? 'מחיר מותאם אישית' : 'Custom Pricing')
        : `${plan.price}${plan.period}`;

      const messageBody = language === 'he'
? `שלום,

אני מעוניין/ת בתוכנית "${plan.name}".

פרטי התוכנית:
מחיר: ${priceInfo}
פיצ'רים כלולים:
- ${plan.features.join('\n- ')}

אשמח לקבל מידע נוסף.

תודה,
`
: `Hello,

I am interested in the "${plan.name}" plan.

Plan Details:
Price: ${priceInfo}
Features included:
- ${plan.features.join('\n- ')}

I would like to receive more information.

Thanks,
`;

      setFormData(prev => ({
        ...prev,
        subject: subject,
        message: messageBody,
      }));
    }
  }, [location.state, language]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (!serviceId || !templateId || !publicKey || serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
        toast({
            variant: "destructive",
            title: "EmailJS Not Configured!",
            description: "Please follow the setup instructions to enable email sending.",
        });
        setIsSending(false);
        return;
    }

    const fullMessage = language === 'he'
      ? `שם: ${formData.name}\nאימייל: ${formData.email}\n\n${formData.message}`
      : `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    
    const emailJsData = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: fullMessage,
    };

    emailjs.send(serviceId, templateId, emailJsData, publicKey)
      .then((result) => {
          console.log(result.text);
          toast({
            title: t.toast.title,
            description: t.toast.description,
          });
          setFormData({ name: '', email: '', subject: '', message: '' });
      }, (error) => {
          console.log(error.text);
          toast({
            variant: "destructive",
            title: "Oops! Something went wrong.",
            description: "Failed to send message. Please try again later.",
          });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const contactInfo = [
    { icon: <Mail size={24} className="text-teal-500" />, label: t.info.email.label, value: 'naftalissolutions@gmail.com' },
    { icon: <Phone size={24} className="text-teal-500" />, label: t.info.call.label, value: '052-7073229' },
    { icon: <MapPin size={24} className="text-teal-500" />, label: t.info.location.label, value: t.info.location.value },
  ];

  return (
    <>
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <link rel="canonical" href="https://naftalissolutions.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://naftalissolutions.com/contact" />
        <meta property="og:title" content={t.meta.title} />
        <meta property="og:description" content={t.meta.description} />
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

        <section className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: language === 'he' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{t.form.title}</h2>
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">{t.form.name}</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-100 border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">{t.form.email}</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-100 border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"/>
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">{t.form.subject}</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-100 border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">{t.form.message}</label>
                <textarea name="message" id="message" rows="8" value={formData.message} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-100 border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"></textarea>
              </div>
              <div>
                <Button type="submit" size="lg" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" disabled={isSending}>
                  {isSending ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Send className={language === 'he' ? 'ml-2' : 'mr-2'} size={20} /> {t.form.button}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: language === 'he' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-slate-900">{t.info.title}</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{info.label}</h3>
                    <p className="text-slate-600">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;