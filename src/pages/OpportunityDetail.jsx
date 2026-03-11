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
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Badge status={opp.status} className="border border-white/10 bg-surface-900/50 backdrop-blur-md">
                            {t(`opportunities.${opp.status}`)}
                        </Badge>
                        <Badge color="purple" className="border border-white/10 bg-primary-500/20 text-primary-300">
                            {t(`opportunities.categories.${opp.category}`)}
                        </Badge>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 max-w-4xl">
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
                        <div className="card-modern p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
                                <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                Description
                            </h2>
                            <p className="text-surface-300 leading-relaxed whitespace-pre-line text-lg relative z-10">
                                {opp.summary_i18n[lang] || opp.summary_i18n.fr}
                            </p>
                        </div>

                        <div className="card-modern p-8 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-highlight/5 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2 group-hover:bg-highlight/10 transition-colors"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
                                <span className="w-2 h-6 bg-highlight rounded-full"></span>
                                {t('opportunities.eligibility')}
                            </h2>
                            <p className="text-surface-300 leading-relaxed text-lg relative z-10">
                                {opp.eligibility_i18n[lang] || opp.eligibility_i18n.fr}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card-modern p-8 space-y-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-5 bg-warning-500 rounded-full"></span>
                                Informations
                            </h3>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 transition-colors hover:bg-surface-800 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                                    <Calendar className="h-5 w-5 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-1">{t('opportunities.deadline')}</div>
                                    <div className="font-medium text-white">
                                        {new Date(opp.deadline).toLocaleDateString(lang, {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 transition-colors hover:bg-surface-800 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                                    <Tag className="h-5 w-5 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-1">{t('opportunities.category')}</div>
                                    <div className="font-medium text-white">
                                        {t(`opportunities.categories.${opp.category}`)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 transition-colors hover:bg-surface-800 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                                    <Users className="h-5 w-5 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">{t('opportunities.tags')}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {opp.tags.map(tag => (
                                            <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-900 text-surface-300 border border-white/5 group-hover:border-white/10 transition-colors">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {opp.status === 'open' && (
                                <div className="pt-6 mt-6 border-t border-white/10">
                                    <Link to="/submit" className="block">
                                        <button className="modern-btn modern-btn-primary w-full py-4 text-lg flex justify-center items-center gap-2 group">
                                            {t('opportunities.apply')}
                                            <ArrowRight className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
