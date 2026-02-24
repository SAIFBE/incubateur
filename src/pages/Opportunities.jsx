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
        <div className="fade-in">
            <div className="hero-gradient text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('opportunities.title')}</h1>
                    <p className="text-white/80 text-lg">{t('opportunities.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.opportunities') },
                ]} />

                {/* Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder={t('opportunities.search')}
                            className="flex-1 w-full sm:w-auto"
                        />
                        <Button
                            variant="secondary"
                            icon={Filter}
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden"
                        >
                            {t('common.filter')}
                        </Button>
                        <div className="hidden sm:flex gap-3">
                            <Select
                                options={categoryOptions}
                                placeholder={t('opportunities.allCategories')}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-48"
                            />
                            <Select
                                options={statusOptions}
                                placeholder={t('opportunities.allStatuses')}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-40"
                            />
                            {hasFilters && (
                                <Button variant="ghost" icon={X} onClick={resetFilters}>
                                    {t('common.reset')}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mobile filters */}
                    {showFilters && (
                        <div className="sm:hidden mt-4 p-4 bg-white rounded-2xl border border-surface-200 space-y-3">
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
                                <Button variant="ghost" icon={X} onClick={resetFilters} className="w-full">
                                    {t('common.reset')}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(opp => {
                            const isDeadlineSoon = new Date(opp.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000 && opp.status === 'open';
                            return (
                                <Link key={opp.id} to={`/opportunities/${opp.id}`}>
                                    <Card className="h-full flex flex-col">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <Badge status={opp.status}>
                                                {t(`opportunities.${opp.status}`)}
                                            </Badge>
                                            <Badge color="purple">
                                                {t(`opportunities.categories.${opp.category}`)}
                                            </Badge>
                                            {isDeadlineSoon && (
                                                <Badge color="yellow">{t('opportunities.deadlineSoon')}</Badge>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-surface-900 mb-2 line-clamp-2">
                                            {opp.title_i18n[lang] || opp.title_i18n.fr}
                                        </h3>
                                        <p className="text-surface-500 text-sm mb-4 line-clamp-3 flex-1">
                                            {opp.summary_i18n[lang] || opp.summary_i18n.fr}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {opp.tags.map(tag => (
                                                <Badge key={tag} color="gray" size="xs">#{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-surface-100 text-sm text-surface-400 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {t('opportunities.deadline')}: {new Date(opp.deadline).toLocaleDateString(lang)}
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="h-8 w-8 text-surface-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-700 mb-2">{t('opportunities.noResults')}</h3>
                        <p className="text-surface-500">{t('opportunities.noResultsDesc')}</p>
                        {hasFilters && (
                            <Button variant="secondary" className="mt-4" onClick={resetFilters}>
                                {t('common.reset')}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
