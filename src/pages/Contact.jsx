import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useUI } from '../contexts/UIContext';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(3),
    message: z.string().min(10),
});

export default function Contact() {
    const { t } = useTranslation();
    const { addToast } = useUI();
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async () => {
        await new Promise(r => setTimeout(r, 1000));
        addToast({ type: 'success', title: t('contact.success'), message: t('contact.successDesc') });
        setSent(true);
        reset();
    };

    const contactInfo = [
        { icon: MapPin, label: t('contact.info.address') },
        { icon: Phone, label: t('contact.info.phone') },
        { icon: Mail, label: t('contact.info.email') },
        { icon: Clock, label: t('contact.info.hours') },
    ];

    return (
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('contact.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('contact.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.contact') },
                ]} />

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('contact.info.title')}</h2>
                            <p className="text-surface-400 mb-6 block">Nos équipes sont à votre disposition pour répondre à toutes vos questions.</p>
                        </div>
                        <div className="space-y-4">
                            {contactInfo.map((item, i) => (
                                <div key={i} className="card-modern flex items-center gap-5 p-6 group hover:border-primary-500/50 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-surface-800 border border-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-300 shadow-lg">
                                        <item.icon className="h-6 w-6 text-primary-400 group-hover:text-highlight transition-colors" />
                                    </div>
                                    <span className="text-surface-300 font-medium group-hover:text-white transition-colors">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {sent ? (
                            <div className="card-modern text-center py-20 flex flex-col items-center justify-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-success-500/20 blur-xl rounded-full"></div>
                                    <CheckCircle className="h-20 w-20 text-success-400 relative z-10 animate-[scale-in_0.5s_ease-out]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{t('contact.success')}</h3>
                                <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">{t('contact.successDesc')}</p>
                                <button className="modern-btn modern-btn-primary" onClick={() => setSent(false)}>
                                    {t('contact.send')} nouveau message
                                </button>
                            </div>
                        ) : (
                            <div className="card-modern p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-highlight/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                
                                <h3 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
                                    <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                    Envoyez-nous un message
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-surface-300">{t('contact.name')}</label>
                                            <input
                                                className="modern-input"
                                                {...register('name')}
                                            />
                                            {errors.name?.message && <span className="text-error-400 text-xs mt-1 block">{errors.name.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-surface-300">{t('contact.email')}</label>
                                            <input
                                                type="email"
                                                className="modern-input"
                                                {...register('email')}
                                            />
                                            {errors.email?.message && <span className="text-error-400 text-xs mt-1 block">{errors.email.message}</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-surface-300">{t('contact.subject')}</label>
                                        <input
                                            className="modern-input"
                                            {...register('subject')}
                                        />
                                        {errors.subject?.message && <span className="text-error-400 text-xs mt-1 block">{errors.subject.message}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-surface-300">{t('contact.message')}</label>
                                        <textarea
                                            className="modern-input min-h-[150px] resize-y"
                                            placeholder={t('contact.messagePlaceholder')}
                                            {...register('message')}
                                        />
                                        {errors.message?.message && <span className="text-error-400 text-xs mt-1 block">{errors.message.message}</span>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="modern-btn modern-btn-primary w-full flex justify-center items-center gap-2 py-4 text-lg mt-8"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                {t('contact.sending')}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                {t('contact.send')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
