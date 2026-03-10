import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, List, MapPin, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import { CardSkeleton } from '../components/ui/Skeleton';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function Events() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { events } = useDataStore();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [view, setView] = useState('list');
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const filtered = events.filter(evt => {
        const title = (evt.title_i18n[lang] || evt.title_i18n.fr).toLowerCase();
        return !search || title.includes(search.toLowerCase());
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Calendar helpers
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    }, [calMonth, calYear, daysInMonth, firstDayOfMonth]);

    const eventsForDay = (day) => {
        if (!day) return [];
        return events.filter(evt => {
            const d = new Date(evt.startDate);
            return d.getDate() === day && d.getMonth() === calMonth && d.getFullYear() === calYear;
        });
    };

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
        else setCalMonth(calMonth - 1);
    };

    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
        else setCalMonth(calMonth + 1);
    };

    const isRTL = lang === 'ar';

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('events.title')}</h1>
                    <p className="text-white/80 text-lg">{t('events.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.events') },
                ]} />

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder={t('events.search')}
                        className="flex-1 w-full sm:max-w-md"
                    />
                    <div className="flex gap-2 bg-surface-100 rounded-xl p-1">
                        <button
                            onClick={() => setView('list')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500'
                                }`}
                        >
                            <List className="h-4 w-4" /> {t('events.listView')}
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500'
                                }`}
                        >
                            <Calendar className="h-4 w-4" /> {t('events.calendarView')}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : view === 'list' ? (
                    /* List View */
                    filtered.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(event => (
                                <Link key={event.id} to={`/events/${event.id}`}>
                                    <Card className="h-full flex flex-col p-6 md:p-8 shadow-md">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge status={event.mode}>
                                                {event.mode === 'online' ? (
                                                    <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> {t('events.online')}</span>
                                                ) : (
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('events.onsite')}</span>
                                                )}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-surface-900 mb-2">
                                            {event.title_i18n[lang] || event.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-500 text-sm mb-4 line-clamp-2 flex-1">
                                            {event.description_i18n[lang] || event.description_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {event.tags.map(tag => (
                                                <Badge key={tag} color="gray" size="xs">#{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-surface-100 space-y-1">
                                            <div className="text-sm text-surface-500 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(event.startDate).toLocaleDateString(lang, {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-sm text-surface-400 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {event.location_i18n[lang] || event.location_i18n.fr}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Calendar className="h-12 w-12 text-surface-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-surface-700 mb-2">{t('events.noResults')}</h3>
                            <p className="text-surface-500">{t('events.noResultsDesc')}</p>
                        </div>
                    )
                ) : (
                    /* Calendar View */
                    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-surface-200">
                            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                                <ChevronLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                            <h3 className="text-lg font-bold text-surface-900">
                                {t(`events.months.${calMonth}`)} {calYear}
                            </h3>
                            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                                <ChevronRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 border-b border-surface-200">
                            {[0, 1, 2, 3, 4, 5, 6].map(d => (
                                <div key={d} className="p-2 text-center text-xs font-semibold text-surface-500 border-r border-surface-100 last:border-r-0">
                                    {t(`events.days.${d}`)}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {calendarDays.map((day, i) => {
                                const dayEvents = eventsForDay(day);
                                return (
                                    <div
                                        key={i}
                                        className={`min-h-[80px] sm:min-h-[100px] p-1.5 border-r border-b border-surface-100 last:border-r-0 ${day ? 'bg-white' : 'bg-surface-50'
                                            }`}
                                    >
                                        {day && (
                                            <>
                                                <div className="text-xs font-medium text-surface-500 mb-1">{day}</div>
                                                {dayEvents.map(evt => (
                                                    <Link key={evt.id} to={`/events/${evt.id}`}>
                                                        <div className="text-xs bg-primary-100 text-primary-700 rounded px-1.5 py-0.5 mb-1 truncate hover:bg-primary-200 transition-colors cursor-pointer">
                                                            {evt.title_i18n[lang] || evt.title_i18n.fr}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
