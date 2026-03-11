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
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('events.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('events.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.events') },
                ]} />

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-12 p-6 card-modern">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder={t('events.search')}
                        className="flex-1 w-full sm:max-w-md"
                    />
                    <div className="flex gap-2 bg-bg-card border border-white/5 rounded-xl p-1 w-full sm:w-auto">
                        <button
                            onClick={() => setView('list')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${view === 'list' ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-surface-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <List className="h-4 w-4" /> {t('events.listView')}
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${view === 'calendar' ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-surface-400 hover:text-white hover:bg-white/5'
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
                                <Link key={event.id} to={`/events/${event.id}`} className="block group">
                                    <div className="card-modern h-full flex flex-col p-8 group-hover:border-primary-500/50 transition-colors duration-300 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary-500/10 transition-colors"></div>
                                        
                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <Badge status={event.mode}>
                                                {event.mode === 'online' ? (
                                                    <span className="flex items-center gap-2"><Wifi className="h-3.5 w-3.5" /> {t('events.online')}</span>
                                                ) : (
                                                    <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {t('events.onsite')}</span>
                                                )}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors relative z-10">
                                            {event.title_i18n[lang] || event.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed relative z-10">
                                            {event.description_i18n[lang] || event.description_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                            {event.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-800 text-surface-300 border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
                                            <div className="text-sm font-medium text-surface-400 flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-white/5">
                                                        <Calendar className="h-4 w-4 text-primary-400" />
                                                    </div>
                                                    <span className="text-white">
                                                        {new Date(event.startDate).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="text-sm font-medium text-surface-400 flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-white/5">
                                                        <MapPin className="h-4 w-4 text-highlight" />
                                                    </div>
                                                    {event.location_i18n[lang] || event.location_i18n.fr}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card-modern text-center py-20 flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent">
                            <div className="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mb-6">
                                <Calendar className="h-10 w-10 text-surface-500 relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{t('events.noResults')}</h3>
                            <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">{t('events.noResultsDesc')}</p>
                        </div>
                    )
                ) : (
                    /* Calendar View */
                    <div className="card-modern rounded-2xl overflow-hidden p-0 border border-white/10">
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-surface-800/50">
                            <button onClick={prevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-700 text-surface-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
                                <ChevronLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                            <h3 className="text-xl font-bold text-white tracking-wide">
                                {t(`events.months.${calMonth}`)} <span className="text-primary-400">{calYear}</span>
                            </h3>
                            <button onClick={nextMonth} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-700 text-surface-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
                                <ChevronRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 border-b border-white/10 bg-surface-900/50">
                            {[0, 1, 2, 3, 4, 5, 6].map(d => (
                                <div key={d} className="p-4 text-center text-sm font-semibold text-surface-400 border-r border-white/5 last:border-r-0 uppercase tracking-wider">
                                    {t(`events.days.${d}`)}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 bg-surface-900/20">
                            {calendarDays.map((day, i) => {
                                const dayEvents = eventsForDay(day);
                                const isToday = day === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear();
                                return (
                                    <div
                                        key={i}
                                        className={`min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-white/5 last:border-r-0 transition-colors ${day ? 'hover:bg-surface-800/30' : 'bg-surface-900/50 opacity-50'
                                            }`}
                                    >
                                        {day && (
                                            <>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isToday ? 'bg-primary-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'text-surface-400'}`}>{day}</div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {dayEvents.map(evt => (
                                                        <Link key={evt.id} to={`/events/${evt.id}`}>
                                                            <div className="text-xs bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-md px-2 py-1.5 truncate hover:bg-primary-500/40 hover:text-white transition-colors cursor-pointer group relative">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 inline-block mr-1.5 group-hover:scale-125 transition-transform"></span>
                                                                {evt.title_i18n[lang] || evt.title_i18n.fr}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
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
