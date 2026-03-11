import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Lightbulb, Users, Rocket, Calendar, TrendingUp, Handshake, Building2 } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EventSlideshow from '../components/ui/EventSlideshow';

export default function Home() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { opportunities, events } = useDataStore();
    const isRTL = lang === 'ar';

    const featuredOpps = opportunities.filter(o => o.status === 'open').slice(0, 3);
    const upcomingEvents = events
        .filter(e => new Date(e.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 3);

    const stats = [
        { icon: Rocket, value: '150+', label: t('home.stats.projects') },
        { icon: Users, value: '300+', label: t('home.stats.entrepreneurs') },
        { icon: Handshake, value: '50+', label: t('home.stats.partners') },
        { icon: Calendar, value: '200+', label: t('home.stats.events') },
    ];

    const features = [
        { icon: Lightbulb, title: t('home.feature1Title'), desc: t('home.feature1Desc') },
        { icon: Users, title: t('home.feature2Title'), desc: t('home.feature2Desc') },
        { icon: Building2, title: t('home.feature3Title'), desc: t('home.feature3Desc') },
    ];

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <EventSlideshow />

            {/* Stats */}
            <section className="py-16 bg-bg-primary border-t border-b border-white/5 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                    <stat.icon className="h-8 w-8 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div className="text-3xl font-bold text-white tracking-tight mb-1">{stat.value}</div>
                                <div className="text-sm text-surface-400 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                            Pourquoi choisir <span className="text-gradient">CMC BMK</span> ?
                        </h2>
                        <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('home.whyUsDesc')}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feat, i) => (
                            <div key={i} className="card-modern text-center p-8 group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500/20 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all duration-300 border border-white/5">
                                    <feat.icon className="h-8 w-8 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feat.title}</h3>
                                <p className="text-surface-400 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Opportunities */}
            <section className="py-20 lg:py-28 bg-surface-900/30 border-y border-white/5 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-highlight/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-highlight rounded-full"></span>
                            {t('home.featuredOpportunities')}
                        </h2>
                        <Link to="/opportunities" className="modern-btn group flex items-center gap-2">
                            {t('home.viewAll')}
                            <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </Link>
                    </div>
                    {featuredOpps.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredOpps.map(opp => (
                                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block group">
                                    <div className="card-modern h-full p-8 flex flex-col group-hover:border-highlight/50 transition-colors duration-300">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Badge status={opp.status}>
                                                {t(`opportunities.${opp.status}`)}
                                            </Badge>
                                            <Badge color="purple" className="bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                                {t(`opportunities.categories.${opp.category}`)}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-highlight transition-colors">
                                            {opp.title_i18n[lang] || opp.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                                            {opp.summary_i18n[lang] || opp.summary_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto mb-6">
                                            {opp.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-800 text-surface-300 border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 text-sm font-medium text-surface-400 flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary-400" />
                                                {t('opportunities.deadline')}: {new Date(opp.deadline).toLocaleDateString(lang)}
                                            </span>
                                            <ArrowRight className={`w-4 h-4 text-surface-500 group-hover:text-highlight transition-colors ${isRTL ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card-modern text-center py-16 flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent">
                            <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
                                <TrendingUp className="h-8 w-8 text-surface-500" />
                            </div>
                            <p className="text-surface-400 text-lg">{t('home.noItems')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="py-20 lg:py-28 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                            {t('home.upcomingEvents')}
                        </h2>
                        <Link to="/events" className="modern-btn group flex items-center gap-2">
                            {t('home.viewAll')}
                            <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </Link>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map(event => (
                                <Link key={event.id} to={`/events/${event.id}`} className="block group">
                                    <div className="card-modern h-full p-8 flex flex-col group-hover:border-primary-500/50 transition-colors duration-300 relative overflow-hidden">
                                        
                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <Badge status={event.mode}>
                                                {t(`events.${event.mode}`)}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors relative z-10">
                                            {event.title_i18n[lang] || event.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow relative z-10">
                                            {event.description_i18n[lang] || event.description_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                            {event.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-surface-300 border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 text-sm font-medium text-surface-400 flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-white/5">
                                                    <Calendar className="h-4 w-4 text-highlight" />
                                                </div>
                                                <span className="text-white">
                                                    {new Date(event.startDate).toLocaleDateString(lang, { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <ArrowRight className={`w-4 h-4 text-surface-500 group-hover:text-primary-400 transition-colors ${isRTL ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card-modern text-center py-16 flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent">
                            <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-surface-500" />
                            </div>
                            <p className="text-surface-400 text-lg">{t('home.noItems')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
