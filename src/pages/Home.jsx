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
            <section className="py-12 bg-white border-b border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <stat.icon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-surface-900">{stat.value}</div>
                                <div className="text-sm text-surface-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-surface-900 mb-3">{t('home.whyUs')}</h2>
                        <p className="text-surface-500 text-lg max-w-2xl mx-auto">{t('home.whyUsDesc')}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feat, i) => (
                            <Card key={i} hover={false} className="text-center p-8">
                                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <feat.icon className="h-7 w-7 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-bold text-surface-900 mb-3">{feat.title}</h3>
                                <p className="text-surface-500">{feat.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Opportunities */}
            <section className="py-16 lg:py-20 bg-surface-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">
                            {t('home.featuredOpportunities')}
                        </h2>
                        <Link to="/opportunities" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                            {t('home.viewAll')}
                            <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>
                    {featuredOpps.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredOpps.map(opp => (
                                <Link key={opp.id} to={`/opportunities/${opp.id}`}>
                                    <Card className="h-full p-6 md:p-8 shadow-md">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge status={opp.status}>
                                                {t(`opportunities.${opp.status}`)}
                                            </Badge>
                                            <Badge color="purple">
                                                {t(`opportunities.categories.${opp.category}`)}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-surface-900 mb-2 line-clamp-2">
                                            {opp.title_i18n[lang] || opp.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-500 text-sm mb-4 line-clamp-3">
                                            {opp.summary_i18n[lang] || opp.summary_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {opp.tags.map(tag => (
                                                <Badge key={tag} color="gray" size="xs">#{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-surface-100 text-sm text-surface-400">
                                            {t('opportunities.deadline')}: {new Date(opp.deadline).toLocaleDateString(lang)}
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-surface-400">
                            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>{t('home.noItems')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">
                            {t('home.upcomingEvents')}
                        </h2>
                        <Link to="/events" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                            {t('home.viewAll')}
                            <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map(event => (
                                <Link key={event.id} to={`/events/${event.id}`}>
                                    <Card className="h-full p-6 md:p-8 shadow-md">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge status={event.mode}>
                                                {t(`events.${event.mode}`)}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-surface-900 mb-2">
                                            {event.title_i18n[lang] || event.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-500 text-sm mb-4 line-clamp-2">
                                            {event.description_i18n[lang] || event.description_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {event.tags.map(tag => (
                                                <Badge key={tag} color="gray" size="xs">#{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-surface-100 text-sm text-surface-400 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(event.startDate).toLocaleDateString(lang, {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-surface-400">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>{t('home.noItems')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
