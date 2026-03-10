import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function FAQ() {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = Array.from({ length: 6 }, (_, i) => ({
        question: t(`faq.q${i + 1}`),
        answer: t(`faq.a${i + 1}`),
    }));

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('faq.title')}</h1>
                    <p className="text-white/80 text-lg">{t('faq.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.faq') },
                ]} />

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left rtl:text-right hover:bg-surface-50 transition-colors"
                                aria-expanded={openIndex === i}
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                                    <span className="font-semibold text-surface-800">{faq.question}</span>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-surface-400 transition-transform flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openIndex === i && (
                                <div className="px-5 pb-5 pt-0">
                                    <div className="pl-8 rtl:pr-8 rtl:pl-0 text-surface-600 leading-relaxed border-t border-surface-100 pt-4">
                                        {faq.answer}
                                        <br />
                                        <br />
                                        <a href="/contact" className="text-primary-500 hover:text-primary-600 font-semibold">
                                            {t('faq.contact')}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
