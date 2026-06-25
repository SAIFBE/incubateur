import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight, Clock, LayoutGrid, List, MapPin, Search, Wifi } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import './Events.css';

const getLocalized = (item, field, lang) => {
  const value = item?.[field];
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || '';
};

const eventDate = (event) => event.startDate || event.start_date || event.date;
const eventLocation = (event, lang) => getLocalized(event, 'location_i18n', lang) || event.location || 'CMC BMK';
const eventTitle = (event, lang, t) => getLocalized(event, 'title_i18n', lang) || event.title || t('events.defaultTitle');
const eventDescription = (event, lang, t) => getLocalized(event, 'description_i18n', lang) || event.description || t('events.defaultDescription');
const eventImage = (event) => event.image || (Array.isArray(event.images) ? event.images[0] : null);

export default function Events() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { events, loading } = useDataStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const filtered = useMemo(() => events
    .filter((event) => {
      const text = `${eventTitle(event, lang, t)} ${eventDescription(event, lang, t)} ${eventLocation(event, lang)}`.toLowerCase();
      return !search || text.includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(eventDate(a) || 0) - new Date(eventDate(b) || 0)), [events, lang, search, t]);

  const featured = filtered[0];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays = useMemo(() => [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ], [firstDay, daysInMonth]);

  const eventsForDay = (day) => {
    if (!day) return [];
    return filtered.filter((event) => {
      const parsed = new Date(eventDate(event));
      return parsed.getDate() === day && parsed.getMonth() === month && parsed.getFullYear() === year;
    });
  };

  const changeMonth = (direction) => {
    if (direction < 0 && month === 0) { setMonth(11); setYear(year - 1); return; }
    if (direction > 0 && month === 11) { setMonth(0); setYear(year + 1); return; }
    setMonth((current) => current + direction);
  };

  return (
    <main className="events-page">
      <section className="events-hero">
        <span>{t('events.calendarBadge')}</span>
        <h1>{t('events.title')}</h1>
        <p>{t('events.subtitle')}</p>
      </section>

      {featured && (
        <section className="events-featured">
          <div className={`events-featured-visual ${eventImage(featured) ? 'has-image' : ''}`} aria-hidden="true">
            {eventImage(featured) ? <img src={eventImage(featured)} alt="" /> : <Calendar size={72} />}
          </div>
          <div className="events-featured-copy">
            <span>{featured.mode === 'online' ? t('events.onlineSession') : t('events.onsiteEvent')}</span>
            <h2>{eventTitle(featured, lang, t)}</h2>
            <p>{eventDescription(featured, lang, t)}</p>
            <div className="events-featured-meta">
              <small><Calendar size={15} />{eventDate(featured) ? new Date(eventDate(featured)).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }) : t('events.dateSoon')}</small>
              <small><MapPin size={15} />{eventLocation(featured, lang)}</small>
            </div>
            <Link to={`/events/${featured.id}`}>{t('events.viewEvent')}</Link>
          </div>
        </section>
      )}

      <section className="events-toolbar">
        <label>
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder={t('events.search')} />
        </label>
        <div>
          <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={17} />{t('events.listView')}</button>
          <button type="button" className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}><LayoutGrid size={17} />{t('events.calendarView')}</button>
        </div>
      </section>

      {loading ? (
        <section className="events-grid">{Array.from({ length: 6 }).map((_, index) => <article key={index} className="event-card loading" />)}</section>
      ) : view === 'list' ? (
        filtered.length > 0 ? (
          <section className="events-grid">
            {filtered.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className={`event-card ${eventImage(event) ? 'has-media' : ''}`}>
                {eventImage(event) && (
                  <div className="event-card-image" aria-hidden="true">
                    <img src={eventImage(event)} alt="" />
                  </div>
                )}
                <div className="event-card-top">
                  <span>{event.mode === 'online' ? <Wifi size={14} /> : <MapPin size={14} />}{event.mode === 'online' ? t('events.online') : t('events.onsite')}</span>
                  <small>{event.category || t('events.incubatorCategory')}</small>
                </div>
                <h2>{eventTitle(event, lang, t)}</h2>
                <p>{eventDescription(event, lang, t)}</p>
                <div className="event-card-meta">
                  <span><Calendar size={16} />{eventDate(event) ? new Date(eventDate(event)).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' }) : t('events.soon')}</span>
                  <span><Clock size={16} />{event.time || '09:00'}</span>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <section className="events-empty"><Calendar size={42} /><h2>{t('events.noResults')}</h2><p>{t('events.noResultsDesc')}</p></section>
        )
      ) : (
        <section className="events-calendar">
          <header>
            <button type="button" onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
            <h2>{t(`events.months.${month}`)} <span>{year}</span></h2>
            <button type="button" onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
          </header>
          <div className="calendar-weekdays">{[0, 1, 2, 3, 4, 5, 6].map((day) => <span key={day}>{t(`events.days.${day}`)}</span>)}</div>
          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const matches = eventsForDay(day);
              return (
                <div key={`${day}-${index}`} className={!day ? 'muted' : ''}>
                  {day && <strong>{day}</strong>}
                  {matches.slice(0, 2).map((event) => <Link key={event.id} to={`/events/${event.id}`}>{eventTitle(event, lang, t)}</Link>)}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
