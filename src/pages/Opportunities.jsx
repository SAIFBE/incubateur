import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Wifi, Filter, X } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function Opportunities() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { opportunities } = useDataStore();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const filtered = opportunities.filter(opp => {
        const title = (opp.title_i18n[lang] || opp.title_i18n.fr).toLowerCase();
        const summary = (opp.summary_i18n[lang] || opp.summary_i18n.fr).toLowerCase();
        const matchSearch = !search || title.includes(search.toLowerCase()) || summary.includes(search.toLowerCase());
        const matchCategory = !category || opp.category === category;
        const matchStatus = !status || opp.status === status;
        return matchSearch && matchCategory && matchStatus;
    });

    const categoryOptions = [
        { value: 'funding', label: t('opportunities.categories.funding') },
        { value: 'training', label: t('opportunities.categories.training') },
        { value: 'mentoring', label: t('opportunities.categories.mentoring') },
        { value: 'competition', label: t('opportunities.categories.competition') },
        { value: 'networking', label: t('opportunities.categories.networking') },
    ];

    const statusOptions = [
        { value: 'open', label: t('opportunities.open') },
        { value: 'closed', label: t('opportunities.closed') },
    ];

    const hasFilters = search || category || status;

    const resetFilters = () => {
        setSearch('');
        setCategory('');
        setStatus('');
    };

    return (
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('opportunities.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('opportunities.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.opportunities') },
                ]} />

                {/* Filters */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-6 card-modern">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder={t('opportunities.search')}
                            className="flex-1 w-full sm:w-auto"
                        />
                        <button
                            className="modern-btn sm:hidden flex items-center justify-center gap-2 w-full"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-5 h-5" />
                            {t('common.filter')}
                        </button>
                        <div className="hidden sm:flex gap-4">
                            <Select
                                options={categoryOptions}
                                placeholder={t('opportunities.allCategories')}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-52"
                            />
                            <Select
                                options={statusOptions}
                                placeholder={t('opportunities.allStatuses')}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-44"
                            />
                            {hasFilters && (
                                <button className="modern-btn flex items-center justify-center gap-2" onClick={resetFilters}>
                                    <X className="w-4 h-4" />
                                    {t('common.reset')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile filters */}
                    {showFilters && (
                        <div className="sm:hidden mt-4 p-6 card-modern space-y-4">
                            <Select
                                options={categoryOptions}
                                placeholder={t('opportunities.allCategories')}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label={t('opportunities.filterCategory')}
                            />
                            <Select
                                options={statusOptions}
                                placeholder={t('opportunities.allStatuses')}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label={t('opportunities.filterStatus')}
                            />
                            {hasFilters && (
                                <button className="modern-btn modern-btn-primary w-full flex items-center justify-center gap-2" onClick={resetFilters}>
                                    <X className="w-4 h-4" />
                                    {t('common.reset')}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                             <div key={i} className="card-modern p-8 animate-pulse">
                                 <div className="flex gap-2 mb-6">
                                     <div className="h-6 w-20 bg-surface-700 rounded-md"></div>
                                     <div className="h-6 w-24 bg-surface-700 rounded-md"></div>
                                 </div>
                                 <div className="h-6 bg-surface-700 rounded-md mb-4 w-3/4"></div>
                                 <div className="h-4 bg-surface-800 rounded-md mb-2 w-full"></div>
                                 <div className="h-4 bg-surface-800 rounded-md mb-6 w-5/6"></div>
                                 <div className="flex gap-2 mb-6">
                                     <div className="h-5 w-16 bg-surface-800 rounded-md"></div>
                                     <div className="h-5 w-16 bg-surface-800 rounded-md"></div>
                                 </div>
                                 <div className="pt-4 border-t border-white/5">
                                     <div className="h-4 bg-surface-800 rounded-md w-1/2"></div>
                                 </div>
                             </div>
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(opp => {
                            const isDeadlineSoon = new Date(opp.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000 && opp.status === 'open';
                            return (
                                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block group">
                                    <div className="card-modern h-full flex flex-col p-8 group-hover:border-highlight/50 transition-colors duration-300 relative overflow-hidden">
                                        
                                        <div className="flex items-center gap-3 mb-6 flex-wrap relative z-10">
                                            <Badge status={opp.status}>
                                                {t(`opportunities.${opp.status}`)}
                                            </Badge>
                                            <Badge color="purple" className="bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                                {t(`opportunities.categories.${opp.category}`)}
                                            </Badge>
                                            {isDeadlineSoon && (
                                                <Badge color="yellow" className="bg-warning-500/20 text-warning-400 border border-warning-500/30">
                                                    {t('opportunities.deadlineSoon')}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-highlight transition-colors relative z-10">
                                            {opp.title_i18n[lang] || opp.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed relative z-10">
                                            {opp.summary_i18n[lang] || opp.summary_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                            {opp.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-800 text-surface-300 border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 text-sm font-medium text-surface-400 flex items-center justify-between relative z-10">
                                            <span className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-white/5">
                                                    <Calendar className="h-4 w-4 text-primary-400" />
                                                </div>
                                                {t('opportunities.deadline')}: {new Date(opp.deadline).toLocaleDateString(lang)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card-modern text-center py-20 flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent">
                        <div className="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mb-6">
                            <Filter className="h-10 w-10 text-surface-500 relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('opportunities.noResults')}</h3>
                        <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">{t('opportunities.noResultsDesc')}</p>
                        {hasFilters && (
                            <button className="modern-btn" onClick={resetFilters}>
                                {t('common.reset')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
