import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import api from '../services/api';
import { normalizeMedia } from '../services/assets';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import './OpportunityDetail.css';

const getLocalized = (item, field, lang) => {
  const value = item?.[field];
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || '';
};

export default function OpportunityDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const [loading, setLoading] = useState(true);
  const [opp, setOpp] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const statusLabel = (status) => t(`opportunities.${status}`, { defaultValue: status });
  const categoryLabel = (category) => t(`opportunities.categories.${category}`, { defaultValue: category });
  const formatDate = (value) => {
    if (!value) return t('opportunities.dateNotProvided');
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    api.get(`/opportunities/${id}`)
      .then((response) => {
        if (!active) return;
        setOpp(normalizeMedia(response.data?.data ?? response.data));
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const details = useMemo(() => {
    if (!opp) return null;
    return {
      title: getLocalized(opp, 'title_i18n', lang) || opp.title || t('opportunities.untitled'),
      summary: getLocalized(opp, 'summary_i18n', lang) || opp.description || t('opportunities.descriptionMissing'),
      category: opp.category || 'program',
      status: opp.status || 'open',
      deadline: opp.deadline,
      link: opp.link,
      tags: Array.isArray(opp.tags) ? opp.tags : [opp.category].filter(Boolean),
    };
  }, [opp, lang, t]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Skeleton lines={1} className="h-8 w-1/3 mb-8" />
        <Skeleton lines={1} className="h-12 w-3/4 mb-4" />
        <Skeleton lines={4} />
      </div>
    );
  }

  if (loadError || !details) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{t('opportunities.notFound')}</h2>
        <Link to="/opportunities">
          <Button>{t('opportunities.backToList')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="oppd-page fade-in">
      <section className="oppd-hero">
        <div className="oppd-hero-bg">
          {details.cover && <img src={details.cover} alt="" className="oppd-hero-image" />}
          <div className="oppd-hero-gradient" />
          <div className="oppd-hero-dots" />
          <div className="oppd-hero-glow" />
        </div>
        <div className="oppd-hero-content">
          <nav className="oppd-breadcrumb" aria-label="Breadcrumb">
            <Link className="oppd-breadcrumb-link" to="/">{t('nav.home')}</Link>
            <span className="oppd-breadcrumb-sep">/</span>
            <Link className="oppd-breadcrumb-link" to="/opportunities">{t('nav.opportunities')}</Link>
            <span className="oppd-breadcrumb-sep">/</span>
            <span className={`oppd-breadcrumb-badge oppd-breadcrumb-badge--${details.status}`}>
              {statusLabel(details.status)}
            </span>
          </nav>

          <h1 className="oppd-hero-title">{details.title}</h1>
          <p className="oppd-hero-sub">{details.summary}</p>

          <div className="oppd-hero-actions">
            {details.status === 'open' && (
              <Link to="/submit" className="oppd-btn-primary">
                {t('opportunities.submitMyIdea')}
                <ArrowRight size={18} />
              </Link>
            )}
            <Link to="/opportunities" className="oppd-btn-outline">
              <ArrowLeft size={18} />
              {t('opportunities.backToList')}
            </Link>
          </div>
        </div>
      </section>

      <section className="oppd-stats-section">
        <div className="oppd-stats-inner">
          <div className="oppd-stats-bar">
            <div className="oppd-stat-item">
              <div className="oppd-stat-icon"><Calendar size={18} /></div>
              <div className="oppd-stat-info">
                <span className="oppd-stat-label">{t('opportunities.deadline')}</span>
                <span className="oppd-stat-value">{formatDate(details.deadline)}</span>
              </div>
            </div>
            <div className="oppd-stat-divider" />
            <div className="oppd-stat-item">
              <div className="oppd-stat-icon"><Tag size={18} /></div>
              <div className="oppd-stat-info">
                <span className="oppd-stat-label">{t('opportunities.category')}</span>
                <span className="oppd-stat-value">{categoryLabel(details.category)}</span>
              </div>
            </div>
            <div className="oppd-stat-divider" />
            <div className="oppd-stat-item">
              <div className="oppd-stat-icon"><ArrowRight size={18} /></div>
              <div className="oppd-stat-info">
                <span className="oppd-stat-label">{t('opportunities.status')}</span>
                <span className="oppd-stat-value">{statusLabel(details.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="oppd-about-section">
        <div className="oppd-about-inner">
          <div className="oppd-about-grid">
            <main>
              <h2 className="oppd-section-title">{t('opportunities.description')}</h2>
              <p className="oppd-about-text">{details.summary}</p>

              {details.tags.length > 0 && (
                <>
                  <h3 className="oppd-sub-title">{t('opportunities.tags')}</h3>
                  <div className="oppd-sidebar-tags">
                    {details.tags.map((tag) => (
                      <span key={tag} className="oppd-tag">#{tag}</span>
                    ))}
                  </div>
                </>
              )}
            </main>

            <aside className="oppd-sidebar-card">
              <div className="oppd-sidebar-status">
                <span className={`oppd-status-badge oppd-status-badge--${details.status === 'closed' ? 'closed' : 'active'}`}>
                  {statusLabel(details.status)}
                </span>
              </div>

              {details.status === 'open' && (
                <Link to="/submit" className="oppd-sidebar-apply-btn">
                  {t('opportunities.apply')}
                  <ArrowRight size={16} />
                </Link>
              )}

              <div className="oppd-sidebar-details">
                <div className="oppd-sidebar-detail-row">
                  <span className="oppd-sidebar-detail-label">{t('opportunities.deadline')}</span>
                  <span className="oppd-sidebar-detail-value">{formatDate(details.deadline)}</span>
                </div>
                <div className="oppd-sidebar-detail-row">
                  <span className="oppd-sidebar-detail-label">{t('opportunities.category')}</span>
                  <span className="oppd-sidebar-detail-value">{categoryLabel(details.category)}</span>
                </div>
              </div>

              {details.link && (
                <a href={details.link} target="_blank" rel="noreferrer" className="oppd-sidebar-contact-btn">
                  {t('opportunities.officialLink')}
                  <span className="oppd-sidebar-contact-link">{details.link}</span>
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
