import { useTranslation } from 'react-i18next';
import { Briefcase, Calendar, FileText, Clock, TrendingUp, Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { opportunities, events, submissions } = useDataStore();

    const pendingReview = submissions.filter(s => s.status === 'received' || s.status === 'under_review').length;

    const stats = [
        { label: t('admin.stats.totalOpportunities'), value: opportunities.length, icon: Briefcase, color: 'text-primary-500 bg-primary-100' },
        { label: t('admin.stats.totalEvents'), value: events.length, icon: Calendar, color: 'text-accent-500 bg-accent-100' },
        { label: t('admin.stats.totalSubmissions'), value: submissions.length, icon: FileText, color: 'text-success-500 bg-success-50' },
        { label: t('admin.stats.pendingReview'), value: pendingReview, icon: Clock, color: 'text-warning-500 bg-warning-50' },
    ];

    const recentSubmissions = [...submissions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="fade-in space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-surface-900">{t('admin.dashboard')}</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} hover={false} className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-surface-900">{stat.value}</div>
                            <div className="text-sm text-surface-500">{stat.label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <Card hover={false}>
                    <h2 className="text-lg font-bold text-surface-900 mb-4">{t('admin.quickActions')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/admin/opportunities">
                            <Button variant="outline" className="w-full justify-start" icon={Plus} size="sm">
                                {t('admin.opportunities')}
                            </Button>
                        </Link>
                        <Link to="/admin/events">
                            <Button variant="outline" className="w-full justify-start" icon={Plus} size="sm">
                                {t('admin.events')}
                            </Button>
                        </Link>
                        <Link to="/admin/submissions">
                            <Button variant="outline" className="w-full justify-start" icon={FileText} size="sm">
                                {t('admin.submissions')}
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="ghost" className="w-full justify-start" icon={TrendingUp} size="sm">
                                {t('common.viewMore')}
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Recent Submissions */}
                <Card hover={false}>
                    <h2 className="text-lg font-bold text-surface-900 mb-4">{t('admin.recentActivity')}</h2>
                    {recentSubmissions.length > 0 ? (
                        <div className="space-y-3">
                            {recentSubmissions.map(sub => (
                                <div key={sub.id} className="flex items-center justify-between bg-surface-50 rounded-xl p-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-surface-800 text-sm truncate">{sub.ideaTitle}</div>
                                        <div className="text-xs text-surface-400">{sub.user.name} · {new Date(sub.createdAt).toLocaleDateString(lang)}</div>
                                    </div>
                                    <Badge status={sub.status} size="xs">{t(`status.${sub.status}`)}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-surface-400 text-sm">{t('admin.noData')}</p>
                    )}
                </Card>
            </div>
        </div>
    );
}
