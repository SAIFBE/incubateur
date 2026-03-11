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
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('faq.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('faq.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.faq') },
                ]} />

                <div className="space-y-3">
                    {faqs.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={i}
                                className={`card-modern !p-0 transition-all duration-300 ${isOpen ? 'border-primary-500 shadow-[0_5px_20px_rgba(79,70,229,0.2)]' : 'border-white/5'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left rtl:text-right hover:bg-white/5 transition-colors focus:outline-none focus-visible:bg-white/5"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-primary-500/20 text-primary-400' : 'bg-surface-800 text-surface-400'}`}>
                                            <HelpCircle className="h-5 w-5 flex-shrink-0" />
                                        </div>
                                        <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-white' : 'text-surface-300'}`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-surface-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary-400' : ''}`} />
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 pt-0">
                                        <div className="pl-[3.5rem] rtl:pr-[3.5rem] rtl:pl-0 text-surface-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                            <div className="mt-4 pt-4 border-t border-white/5 inline-block">
                                                <a href="/contact" className="text-primary-400 hover:text-highlight transition-colors font-medium flex items-center gap-2 group">
                                                    {t('faq.contact')}
                                                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
