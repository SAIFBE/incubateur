import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ImageOff, RefreshCw, Sparkles, Tag } from 'lucide-react';
import useImpactMoments from '../features/impact/useImpactMoments';
import './Impact.css';

export default function Impact() {
  const { t } = useTranslation();
  const { moments, loading, error, refresh } = useImpactMoments();
  const [category, setCategory] = useState('all');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = useMemo(() => ['all', ...new Set(moments.map((moment) => moment.category).filter(Boolean))], [moments]);
  const visibleMoments = category === 'all' ? moments : moments.filter((moment) => moment.category === category);

  return (
    <main className="impact-page">
      <section className="impact-hero">
        <span><Sparkles size={15} /> {t('impact.badge')}</span>
        <h1>{t('impact.title')}</h1>
        <p>{t('impact.subtitle')}</p>
      </section>

      <section className="impact-filter-row" aria-label={t('impact.filterAria')}>
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={category === item ? 'active' : ''}>
            {item === 'all' ? t('impact.all') : item}
          </button>
        ))}
      </section>

      {loading && <section className="impact-grid">{Array.from({ length: 6 }).map((_, index) => <article key={index} className="impact-card loading" />)}</section>}

      {error && (
        <section className="impact-state error">
          <p>{error}</p>
          <button type="button" onClick={refresh}><RefreshCw size={16} /> {t('impact.retry')}</button>
        </section>
      )}

      {!loading && !error && visibleMoments.length === 0 && (
        <section className="impact-state"><ImageOff size={40} /><p>{t('impact.empty')}</p></section>
      )}

      {!loading && !error && visibleMoments.length > 0 && (
        <section className="impact-grid">
          {visibleMoments.map((moment, index) => (
            <article key={moment.id} className="impact-card">
              <div className={`impact-media media-${(index % 3) + 1}`}>
                {moment.image ? <img src={moment.image} alt={moment.title} /> : <ImageOff size={42} />}
              </div>
              <div className="impact-body">
                <div className="impact-meta">
                  {moment.date && <span><Calendar size={14} />{moment.date}</span>}
                  {moment.category && <span><Tag size={14} />{moment.category}</span>}
                </div>
                <h2>{moment.title}</h2>
                <p>{moment.description}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
