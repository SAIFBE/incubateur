import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, Users, Wifi } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDataStore } from '../contexts/DataStoreContext';
import { useUI } from '../contexts/UIContext';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import './EventDetail.css';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const getLocalized = (item, field, lang) => {
  const value = item?.[field];
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || '';
};

const eventImages = (event) => {
  const images = Array.isArray(event?.images) ? event.images.filter(Boolean) : [];
  if (!images.length && event?.image) return [event.image];
  return images;
};

export default function EventDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const { events, registerForEvent } = useDataStore();
  const { addToast } = useUI();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvent(events.find((item) => String(item.id) === String(id)) || null);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [id, events]);

  const details = useMemo(() => {
    if (!event) return null;
    const startDate = event.startDate ? new Date(event.startDate) : null;
    const endDate = event.endDate ? new Date(event.endDate) : null;
    const validStart = startDate && !Number.isNaN(startDate.getTime());
    const validEnd = endDate && !Number.isNaN(endDate.getTime());
    const images = eventImages(event);

    return {
      title: getLocalized(event, 'title_i18n', lang) || event.title || t('events.defaultTitle'),
      description: getLocalized(event, 'description_i18n', lang) || event.description || t('events.defaultDescription'),
      location: getLocalized(event, 'location_i18n', lang) || event.location || 'CMC BMK',
      category: event.category || t('events.incubatorCategory'),
      mode: event.mode || 'onsite',
      status: event.status || 'upcoming',
      tags: Array.isArray(event.tags) ? event.tags : [event.category].filter(Boolean),
      images,
      cover: images[0],
      dateLabel: validStart ? startDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : t('events.dateSoon'),
      timeLabel: validStart
        ? startDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) + (validEnd ? ' - ' + endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : '')
        : '09:00',
    };
  }, [event, lang, locale, t]);

  const onRegister = async (data) => {
    try {
      await registerForEvent(id, data);
      setRegistered(true);
      setShowRegForm(false);
      addToast({ type: 'success', title: t('events.registerSuccess'), message: t('events.registerSuccessDesc') });
    } catch (error) {
      addToast({ type: 'error', title: 'Erreur', message: error.response?.data?.message || 'Impossible de confirmer l’inscription.' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Skeleton lines={1} className="h-8 w-1/3 mb-8" />
        <Skeleton lines={1} className="h-12 w-3/4 mb-4" />
        <Skeleton lines={4} />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{t('common.notFound')}</h2>
        <Link to="/events"><Button>{t('events.backToList')}</Button></Link>
      </div>
    );
  }

  return (
    <main className="evd-page fade-in">
      <section className="evd-hero">
        <div className="evd-hero-bg">
          <div className="evd-hero-gradient" />
          <div className="evd-hero-dots" />
        </div>
        <div className="evd-hero-content">
          <nav className="evd-breadcrumb" aria-label="Breadcrumb">
            <Link className="evd-breadcrumb-link" to="/">{t('nav.home')}</Link>
            <span className="evd-breadcrumb-sep">/</span>
            <Link className="evd-breadcrumb-link" to="/events">{t('nav.events')}</Link>
            <span className="evd-breadcrumb-sep">/</span>
            <span className={'evd-breadcrumb-badge evd-breadcrumb-badge--' + details.mode}>
              <span className="evd-badge-inner">{details.mode === 'online' ? <Wifi size={13} /> : <MapPin size={13} />}{details.mode === 'online' ? t('events.online') : t('events.onsite')}</span>
            </span>
          </nav>
          <h1 className="evd-hero-title">{details.title}</h1>
          <p className="evd-hero-sub">{details.description}</p>
          <div className="evd-hero-actions">
            <button className="evd-btn-primary" type="button" onClick={() => setShowRegForm(true)}>
              <Users size={18} />
              {t('events.register')}
            </button>
            <Link to="/events" className="evd-btn-outline"><ArrowLeft size={18} />{t('events.backToList')}</Link>
          </div>
        </div>
      </section>

      <section className="evd-stats-section">
        <div className="evd-stats-inner">
          <div className="evd-stats-bar">
            <div className="evd-stat-item"><div className="evd-stat-icon"><Calendar size={18} /></div><div className="evd-stat-info"><span className="evd-stat-label">{t('events.date')}</span><span className="evd-stat-value">{details.dateLabel}</span></div></div>
            <div className="evd-stat-divider" />
            <div className="evd-stat-item"><div className="evd-stat-icon"><Clock size={18} /></div><div className="evd-stat-info"><span className="evd-stat-label">{t('events.time')}</span><span className="evd-stat-value">{details.timeLabel}</span></div></div>
            <div className="evd-stat-divider" />
            <div className="evd-stat-item"><div className="evd-stat-icon"><MapPin size={18} /></div><div className="evd-stat-info"><span className="evd-stat-label">{t('events.location')}</span><span className="evd-stat-value">{details.location}</span></div></div>
          </div>
        </div>
      </section>

      <section className="evd-about-section">
        <div className="evd-about-inner">
          <div className="evd-about-grid">
            <main>
              <h2 className="evd-section-title">{t('events.aboutEvent')}</h2>
              <p className="evd-about-text">{details.description}</p>

              {details.tags.length > 0 && (
                <div className="evd-sidebar-tags">
                  {details.tags.map((tag) => <span key={tag} className="evd-tag">#{tag}</span>)}
                </div>
              )}
            </main>

            <aside className="evd-sidebar-card">
              <div className="evd-sidebar-status"><span className={'evd-status-badge evd-status-badge--' + details.status}>{details.status}</span></div>

              {registered ? (
                <div className="evd-registered-banner"><CheckCircle2 size={17} />{t('events.registered')}</div>
              ) : showRegForm ? (
                <form onSubmit={handleSubmit(onRegister)} className="evd-reg-form">
                  <h3 className="evd-reg-form-title">{t('events.registerTitle')}</h3>
                  <label className="evd-reg-field"><input className="evd-reg-input" placeholder={t('events.registerName')} {...register('name')} />{errors.name?.message && <span className="evd-reg-error">{errors.name.message}</span>}</label>
                  <label className="evd-reg-field"><input type="email" className="evd-reg-input" placeholder={t('events.registerEmail')} {...register('email')} />{errors.email?.message && <span className="evd-reg-error">{errors.email.message}</span>}</label>
                  <div className="evd-reg-actions"><button type="submit" disabled={isSubmitting} className="evd-sidebar-register-btn">{isSubmitting ? t('common.loading') : t('events.register')}</button><button type="button" className="evd-reg-cancel" onClick={() => setShowRegForm(false)}>{t('admin.cancel')}</button></div>
                </form>
              ) : (
                <button type="button" className="evd-sidebar-register-btn" onClick={() => setShowRegForm(true)}><Users size={17} />{t('events.register')}</button>
              )}

              <div className="evd-sidebar-details">
                <div className="evd-sidebar-detail-row"><span className="evd-sidebar-detail-label">{t('events.date')}</span><span className="evd-sidebar-detail-value">{details.dateLabel}</span></div>
                <div className="evd-sidebar-detail-row"><span className="evd-sidebar-detail-label">{t('events.time')}</span><span className="evd-sidebar-detail-value">{details.timeLabel}</span></div>
                <div className="evd-sidebar-detail-row"><span className="evd-sidebar-detail-label">{t('events.location')}</span><span className="evd-sidebar-detail-value">{details.location}</span></div>
                <div className="evd-sidebar-detail-row"><span className="evd-sidebar-detail-label">Catégorie</span><span className="evd-sidebar-detail-value">{details.category}</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
