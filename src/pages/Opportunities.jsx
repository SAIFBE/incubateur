import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, GraduationCap, Rocket, Search, Trophy, Users, Wallet } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import './Opportunities.css';

const categoryMeta = {
  funding: { tone: 'orange', icon: Wallet },
  training: { tone: 'green', icon: GraduationCap },
  mentoring: { tone: 'cyan', icon: Users },
  competition: { tone: 'orange', icon: Trophy },
  networking: { tone: 'green', icon: Users },
  program: { tone: 'cyan', icon: Rocket },
};

const getLocalized = (item, field, lang) => {
  const value = item?.[field];
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || '';
};

const normalizeOpportunity = (opp, lang, t) => {
  const category = opp.category || opp.type || 'program';
  return {
    ...opp,
    id: String(opp.id),
    title: getLocalized(opp, 'title_i18n', lang) || opp.title || t('opportunities.untitled'),
    description: getLocalized(opp, 'summary_i18n', lang) || opp.description || t('opportunities.descriptionMissing'),
    category,
    status: opp.status || 'open',
    deadline: opp.deadline,
    image: opp.image || (Array.isArray(opp.images) ? opp.images[0] : null),
    images: Array.isArray(opp.images) ? opp.images : [],
  };
};

export default function Opportunities() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const { opportunities, loading } = useDataStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const categoryLabel = (category) => t(`opportunities.categories.${category}`, { defaultValue: category });
  const statusLabel = (status) => t(`opportunities.${status}`, { defaultValue: status });

  const formatDeadline = (deadline) => {
    if (!deadline) return t('opportunities.dateNotProvided');
    const parsed = new Date(deadline);
    return Number.isNaN(parsed.getTime())
      ? deadline
      : parsed.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const normalized = useMemo(
    () => opportunities.map((opp) => normalizeOpportunity(opp, lang, t)),
    [opportunities, lang, t]
  );

  const filtered = useMemo(() => normalized.filter((opp) => {
    const categoryMatch = activeCategory === 'all' || opp.category === activeCategory;
    const text = `${opp.title} ${opp.description} ${opp.category}`.toLowerCase();
    const searchMatch = !search || text.includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  }), [normalized, activeCategory, search]);

  const featured = filtered[0] || normalized[0] || null;
  const visibleCards = featured
    ? filtered.filter((item) => item.id !== featured.id).slice(0, 6)
    : [];
  const categories = ['all', ...new Set(normalized.map((item) => item.category).filter(Boolean))];

  return (
    <main className="opp-landing">
      <section className="opp-hero">
        <h1>{t('opportunities.heroTitleLine1')}<br />{t('opportunities.heroTitleLine2Prefix')} <span>{t('opportunities.heroTitleHighlight')}</span></h1>
        <p>{t('opportunities.heroSubtitleLanding')}</p>
        <div className="opp-hero-actions">
          <a href="#opportunity-cards" className="primary">{t('opportunities.explore')}</a>
          <Link to="/submit" className="secondary">{t('opportunities.submitMyIdea')}</Link>
        </div>
      </section>

      {loading ? (
        <section className="opp-feature-card opp-feature-card-empty">
          <div className="opp-loading-panel">{t('opportunities.loading')}</div>
        </section>
      ) : featured ? (
        <section className="opp-feature-card">
          <div className={`opp-feature-visual ${featured.image ? 'has-image' : ''}`} aria-hidden="true">
            {featured.image ? <img src={featured.image} alt="" /> : <div className="brain-core" />}
          </div>
          <div className="opp-feature-copy">
            <div className="feature-meta">
              <span>{categoryLabel(featured.category)}</span>
              <small><Calendar size={13} /> {formatDeadline(featured.deadline)}</small>
            </div>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <Link to={`/opportunities/${featured.id}`}>{t('opportunities.viewOpportunity')} <ArrowRight size={16} /></Link>
          </div>
        </section>
      ) : (
        <section className="opp-feature-card opp-feature-card-empty">
          <div className="opp-empty-state">
            <Rocket size={42} />
            <h2>{t('opportunities.emptyTitle')}</h2>
            {t('opportunities.emptyDesc') && <p>{t('opportunities.emptyDesc')}</p>}
            <Link to="/contact">{t('opportunities.contactUs')}</Link>
          </div>
        </section>
      )}

      <section className="opp-list-toolbar">
        <div className="opp-pills" aria-label={t('opportunities.categoryFilterAria')}>
          {categories.map((item) => (
            <button key={item} type="button" className={activeCategory === item ? 'active' : ''} onClick={() => setActiveCategory(item)}>
              {item === 'all' ? t('opportunities.all') : categoryLabel(item)}
            </button>
          ))}
        </div>
        <label className="opp-inline-search">
          <Search size={16} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('opportunities.search')} />
        </label>
      </section>

      <section id="opportunity-cards" className="opp-card-row">
        {loading ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="opp-show-card loading" />) : visibleCards.map((opp, index) => {
          const meta = categoryMeta[opp.category] || categoryMeta.program;
          const Icon = meta.icon;
          return (
            <article key={opp.id} className="opp-show-card">
              <div className={`show-visual visual-${(index % 3) + 1} ${opp.image ? 'has-image' : ''}`}>
                {opp.image ? <img src={opp.image} alt="" /> : <Icon size={30} />}
                <span>{statusLabel(opp.status)}</span>
              </div>
              <div className="show-body">
                <small className={meta.tone}>{categoryLabel(opp.category)}</small>
                <h2>{opp.title}</h2>
                <p>{opp.description}</p>
                <Link to={`/opportunities/${opp.id}`}>{t('opportunities.learnMore')} <ArrowRight size={15} /></Link>
              </div>
            </article>
          );
        })}
      </section>

      {!loading && featured && visibleCards.length === 0 && (
        <section className="opp-inline-empty">
          <p>{t('opportunities.singlePublished')}</p>
        </section>
      )}

      {!loading && normalized.length > 0 && (
        <section className="opp-category-section">
          <h2>{t('opportunities.browseByCategory')}</h2>
          <div className="opp-category-grid">
            {categories.filter((item) => item !== 'all').map((category) => {
              const meta = categoryMeta[category] || categoryMeta.program;
              const Icon = meta.icon;
              const count = normalized.filter((item) => item.category === category).length;
              return (
                <article key={category}>
                  <span><Icon size={22} /></span>
                  <strong>{categoryLabel(category)}</strong>
                  <small>{t('opportunities.countLabel', { count })}</small>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="opp-cta">
        <h2>{t('opportunities.readyTitle')}</h2>
        <p>{t('opportunities.readyText')}</p>
        <div>
          <Link to="/submit" className="primary">{t('opportunities.submitMyIdea')}</Link>
          <Link to="/contact" className="secondary">{t('opportunities.contactUs')}</Link>
        </div>
      </section>
    </main>
  );
}
