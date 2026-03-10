import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Tag, Users, MapPin, ArrowRight } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';

export default function OpportunityDetail() {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const isRTL = lang === 'ar';
    const { opportunities } = useDataStore();
    const [loading, setLoading] = useState(true);
    const [opp, setOpp] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpp(opportunities.find(o => o.id === id) || null);
            setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [id, opportunities]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <Skeleton lines={1} className="h-8 w-1/3 mb-8" />
                <Skeleton lines={1} className="h-12 w-3/4 mb-4" />
                <Skeleton lines={4} />
            </div>
        );
    }

    if (!opp) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-2xl font-bold text-surface-900 mb-4">{t('common.notFound')}</h2>
                <Link to="/opportunities">
                    <Button>{t('opportunities.backToList')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge status={opp.status} className="text-white border border-white/30">
                            {t(`opportunities.${opp.status}`)}
                        </Badge>
                        <Badge color="purple" className="text-white border border-white/30">
                            {t(`opportunities.categories.${opp.category}`)}
                        </Badge>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        {opp.title_i18n[lang] || opp.title_i18n.fr}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.opportunities'), href: '/opportunities' },
                    { label: opp.title_i18n[lang] || opp.title_i18n.fr },
                ]} />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-surface-200 p-6 md:p-8 shadow-md">
                            <h2 className="text-xl font-bold text-surface-900 mb-4">Description</h2>
                            <p className="text-surface-600 leading-relaxed whitespace-pre-line">
                                {opp.summary_i18n[lang] || opp.summary_i18n.fr}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-surface-200 p-6 md:p-8 shadow-md">
                            <h2 className="text-xl font-bold text-surface-900 mb-4">{t('opportunities.eligibility')}</h2>
                            <p className="text-surface-600 leading-relaxed">
                                {opp.eligibility_i18n[lang] || opp.eligibility_i18n.fr}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-surface-200 p-6 md:p-8 shadow-md space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary-500" />
                                <div>
                                    <div className="text-xs text-surface-400">{t('opportunities.deadline')}</div>
                                    <div className="font-semibold text-surface-800">
                                        {new Date(opp.deadline).toLocaleDateString(lang, {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Tag className="h-5 w-5 text-primary-500" />
                                <div>
                                    <div className="text-xs text-surface-400">{t('opportunities.category')}</div>
                                    <div className="font-semibold text-surface-800">
                                        {t(`opportunities.categories.${opp.category}`)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-primary-500" />
                                <div>
                                    <div className="text-xs text-surface-400">{t('opportunities.tags')}</div>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {opp.tags.map(tag => (
                                            <Badge key={tag} color="gray" size="xs">#{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {opp.status === 'open' && (
                                <Link to="/submit" className="block">
                                    <Button className="w-full" size="lg">
                                        {t('opportunities.apply')}
                                        <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
