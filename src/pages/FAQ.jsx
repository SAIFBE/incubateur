import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './FAQ.css';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = Array.from({ length: 6 }, (_, index) => ({ question: t(`faq.q${index + 1}`), answer: t(`faq.a${index + 1}`) }));

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <span><HelpCircle size={15} /> {t('faq.badge')}</span>
        <h1>{t('faq.title')}</h1>
        <p>{t('faq.subtitle')}</p>
      </section>

      <section className="faq-layout">
        <aside className="faq-side-card">
          <ShieldCheck size={34} />
          <h2>{t('faq.sideTitle')}</h2>
          <p>{t('faq.sideText')}</p>
          <Link to="/contact">{t('faq.askQuestion')} <ArrowRight size={15} /></Link>
        </aside>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={faq.question} className={isOpen ? 'open' : ''}>
                <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{faq.question}</strong>
                  <ChevronDown size={20} />
                </button>
                <div className="faq-answer"><p>{faq.answer}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="faq-cta">
        <MessageCircle size={24} />
        <h2>{t('faq.ctaTitle')}</h2>
        <p>{t('faq.ctaText')}</p>
        <Link to="/contact">{t('faq.ctaBtn')}</Link>
      </section>
    </main>
  );
}
