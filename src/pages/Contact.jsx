import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Send, CheckCircle, Handshake, Rocket, Monitor, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import api from '../services/api';
import './Contact.css';

const createSchema = (t) => z.object({
    name: z.string().min(2, { message: t('contact.validation.name') }),
    email: z.string().email({ message: t('contact.validation.email') }),
    subject: z.string().min(3, { message: t('contact.validation.subject') }),
    message: z.string().min(10, { message: t('contact.validation.message') }),
});

export default function Contact() {
    const { t } = useTranslation();
    const { addToast } = useUI();
    const [sent, setSent] = useState(false);
    const schema = useMemo(() => createSchema(t), [t]);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        await api.post('/contact', data);
        addToast({ type: 'success', title: t('contact.success'), message: t('contact.successDesc') });
        setSent(true);
        reset();
    };

    const supportCards = [
        {
            icon: Handshake,
            title: t('contact.support.partnershipTitle'),
            desc: t('contact.support.partnershipDesc'),
            color: 'purple',
        },
        {
            icon: Rocket,
            title: t('contact.support.startupTitle'),
            desc: t('contact.support.startupDesc'),
            color: 'blue',
        },
        {
            icon: Monitor,
            title: t('contact.support.technicalTitle'),
            desc: t('contact.support.technicalDesc'),
            color: 'cyan',
        },
    ];

    return (
        <div className="contact-page fade-in">
            <section className="contact-hero">
                <div className="contact-hero-bg">
                    <div className="contact-hero-gradient"></div>
                    <div className="contact-hero-dots"></div>
                    <div className="contact-hero-glow"></div>
                </div>
                <div className="contact-hero-content">
                    <h1 className="contact-hero-title">
                        {t('contact.heroTitleLine1')}<br />
                        <span className="contact-hero-highlight">{t('contact.heroTitleHighlight')}</span> {t('contact.heroTitleLine2')}
                    </h1>
                    <p className="contact-hero-sub">{t('contact.heroSubtitle')}</p>
                </div>
            </section>

            <section className="contact-main">
                <div className="contact-main-inner">
                    <div className="contact-grid">
                        <div className="contact-info-col">
                            <h2 className="contact-info-title">{t('contact.infoTitle')}</h2>
                            <p className="contact-info-sub">{t('contact.infoSub')}</p>

                            <div className="contact-details">

                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="contact-detail-text">
                                        <span className="contact-detail-label">{t('contact.addressLabel')}</span>
                                        <span className="contact-detail-value">{t('contact.info.address')}</span>
                                    </div>
                                </div>

                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="contact-detail-text">
                                        <span className="contact-detail-label">{t('contact.hoursLabel')}</span>
                                        <span className="contact-detail-value">{t('contact.info.hours')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-col">
                            {sent ? (
                                <div className="contact-form-card contact-success-state">
                                    <div className="contact-success-glow"></div>
                                    <CheckCircle className="contact-success-icon" />
                                    <h3 className="contact-success-title">{t('contact.success')}</h3>
                                    <p className="contact-success-desc">{t('contact.successDesc')}</p>
                                    <button className="contact-btn-outline" onClick={() => setSent(false)}>
                                        {t('contact.sendAnother')}
                                    </button>
                                </div>
                            ) : (
                                <div className="contact-form-card">
                                    <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                                        <div className="contact-form-row">
                                            <div className="contact-form-group">
                                                <label className="contact-form-label">{t('contact.name')}</label>
                                                <input
                                                    className="contact-input"
                                                    placeholder={t('contact.namePlaceholder')}
                                                    {...register('name')}
                                                />
                                                {errors.name?.message && <span className="contact-form-error">{errors.name.message}</span>}
                                            </div>
                                            <div className="contact-form-group">
                                                <label className="contact-form-label">{t('contact.email')}</label>
                                                <input
                                                    type="email"
                                                    className="contact-input"
                                                    placeholder={t('contact.emailPlaceholder')}
                                                    {...register('email')}
                                                />
                                                {errors.email?.message && <span className="contact-form-error">{errors.email.message}</span>}
                                            </div>
                                        </div>

                                        <div className="contact-form-group">
                                            <label className="contact-form-label">{t('contact.subject')}</label>
                                            <input
                                                className="contact-input"
                                                placeholder={t('contact.subjectPlaceholder')}
                                                {...register('subject')}
                                            />
                                            {errors.subject?.message && <span className="contact-form-error">{errors.subject.message}</span>}
                                        </div>

                                        <div className="contact-form-group">
                                            <label className="contact-form-label">{t('contact.message')}</label>
                                            <textarea
                                                className="contact-input contact-textarea"
                                                placeholder={t('contact.messagePlaceholder')}
                                                {...register('message')}
                                            />
                                            {errors.message?.message && <span className="contact-form-error">{errors.message.message}</span>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="contact-submit-btn"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="contact-spinner"></div>
                                                    {t('contact.sending')}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    {t('contact.sendMessage')}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-support-section">
                <div className="contact-support-inner">
                    <div className="contact-support-grid">
                        {supportCards.map((card) => (
                            <div key={card.title} className={`contact-support-card contact-support-card--${card.color}`}>
                                <div className={`contact-support-icon contact-support-icon--${card.color}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <h3 className="contact-support-title">{card.title}</h3>
                                <p className="contact-support-desc">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="contact-faq-bar">
                        <span className="contact-faq-text">{t('contact.faqQuestion')}</span>
                        <Link to="/faq" className="contact-faq-link">
                            {t('contact.faqLink')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="contact-cta-section">
                <div className="contact-cta-inner">
                    <div className="contact-cta-card">
                        <div className="contact-cta-bg-effects">
                            <div className="contact-cta-glow-1"></div>
                            <div className="contact-cta-glow-2"></div>
                            <div className="contact-cta-grid-overlay"></div>
                        </div>
                        <div className="contact-cta-content">
                            <h2 className="contact-cta-title">{t('contact.ctaTitle')}</h2>
                            <p className="contact-cta-sub">{t('contact.ctaSub')}</p>
                            <Link to="/submit">
                                <button className="contact-cta-btn">
                                    {t('contact.ctaBtn')}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
