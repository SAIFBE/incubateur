import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, Send, Eye } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function MySubmissions() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { submissions } = useDataStore();
    const [selected, setSelected] = useState(null);

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('mySubmissions.title')}</h1>
                    <p className="text-white/80 text-lg">{t('mySubmissions.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.mySubmissions') },
                ]} />

                {submissions.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="h-16 w-16 text-surface-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-surface-700 mb-2">{t('mySubmissions.noSubmissions')}</h3>
                        <p className="text-surface-500 mb-6">{t('mySubmissions.noSubmissionsDesc')}</p>
                        <Link to="/submit">
                            <Button icon={Send}>{t('mySubmissions.submitNow')}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions.map(sub => (
                            <Card key={sub.id} hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 shadow-md">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-xs font-mono bg-surface-100 px-2 py-1 rounded text-surface-600">
                                            {sub.refCode}
                                        </span>
                                        <Badge status={sub.status}>{t(`status.${sub.status}`)}</Badge>
                                    </div>
                                    <h3 className="font-bold text-surface-900 truncate">{sub.ideaTitle}</h3>
                                    <div className="flex items-center gap-4 text-sm text-surface-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(sub.createdAt).toLocaleDateString(lang)}
                                        </span>
                                        <span>{sub.user.name}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" icon={Eye} onClick={() => setSelected(sub)} size="sm">
                                    {t('mySubmissions.details')}
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.ideaTitle} size="lg">
                {selected && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-mono bg-surface-100 px-2 py-1 rounded">{selected.refCode}</span>
                            <Badge status={selected.status}>{t(`status.${selected.status}`)}</Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-surface-400 mb-1">{t('submit.name')}</div>
                                <div className="font-medium">{selected.user.name}</div>
                            </div>
                            <div>
                                <div className="text-xs text-surface-400 mb-1">{t('submit.email')}</div>
                                <div className="font-medium">{selected.user.email}</div>
                            </div>
                            <div>
                                <div className="text-xs text-surface-400 mb-1">{t('submit.domain')}</div>
                                <div className="font-medium">{t(`submit.domains.${selected.domain}`)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-surface-400 mb-1">{t('mySubmissions.date')}</div>
                                <div className="font-medium">{new Date(selected.createdAt).toLocaleDateString(lang)}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-surface-400 mb-1">{t('submit.problem')}</div>
                            <p className="text-surface-700 text-sm bg-surface-50 rounded-xl p-3">{selected.problem}</p>
                        </div>

                        <div>
                            <div className="text-xs text-surface-400 mb-1">{t('submit.solution')}</div>
                            <p className="text-surface-700 text-sm bg-surface-50 rounded-xl p-3">{selected.solution}</p>
                        </div>

                        {selected.market && (
                            <div>
                                <div className="text-xs text-surface-400 mb-1">{t('submit.market')}</div>
                                <p className="text-surface-700 text-sm bg-surface-50 rounded-xl p-3">{selected.market}</p>
                            </div>
                        )}

                        {selected.teamMembers?.length > 0 && (
                            <div>
                                <div className="text-xs text-surface-400 mb-2">{t('submit.teamMembers')}</div>
                                <div className="space-y-1">
                                    {selected.teamMembers.map((m, i) => (
                                        <div key={i} className="text-sm bg-surface-50 rounded-lg px-3 py-2 flex justify-between">
                                            <span className="font-medium">{m.name}</span>
                                            <span className="text-surface-400">{m.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selected.adminComment && (
                            <div className="bg-primary-50 rounded-xl p-4">
                                <div className="text-xs text-primary-600 font-medium mb-1">{t('mySubmissions.adminComment')}</div>
                                <p className="text-primary-800 text-sm">{selected.adminComment}</p>
                            </div>
                        )}

                        {selected.attachments?.length > 0 && (
                            <div>
                                <div className="text-xs text-surface-400 mb-2">{t('submit.attachments')}</div>
                                <div className="space-y-1">
                                    {selected.attachments.map((f, i) => (
                                        <div key={i} className="text-sm bg-surface-50 rounded-lg px-3 py-2 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-surface-400" />
                                            <span>{f.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
