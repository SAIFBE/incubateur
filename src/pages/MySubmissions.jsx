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
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('mySubmissions.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('mySubmissions.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.mySubmissions') },
                ]} />

                {submissions.length === 0 ? (
                    <div className="card-modern text-center py-20 flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent">
                        <div className="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mb-6">
                            <FileText className="h-10 w-10 text-surface-500 relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('mySubmissions.noSubmissions')}</h3>
                        <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">{t('mySubmissions.noSubmissionsDesc')}</p>
                        <Link to="/submit">
                            <button className="modern-btn modern-btn-primary flex items-center gap-2">
                                <Send className="w-4 h-4" /> {t('mySubmissions.submitNow')}
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions.map(sub => (
                            <div key={sub.id} className="card-modern flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 md:p-8 group hover:border-primary-500/50 transition-colors duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary-500/10 transition-colors"></div>
                                
                                <div className="flex-1 min-w-0 relative z-10">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        <span className="text-xs font-mono bg-surface-800 border border-white/5 px-2.5 py-1 rounded-md text-surface-300">
                                            {sub.refCode}
                                        </span>
                                        <Badge status={sub.status}>{t(`status.${sub.status}`)}</Badge>
                                    </div>
                                    <h3 className="text-xl font-bold text-white truncate mb-2 group-hover:text-primary-400 transition-colors">{sub.ideaTitle}</h3>
                                    <div className="flex items-center gap-4 text-sm text-surface-400">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary-400" />
                                            {new Date(sub.createdAt).toLocaleDateString(lang)}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-highlight"></span>
                                            {sub.user.name}
                                        </span>
                                    </div>
                                </div>
                                <button className="modern-btn whitespace-nowrap relative z-10 self-start sm:self-center" onClick={() => setSelected(sub)}>
                                    <Eye className="w-4 h-4 mr-2" /> {t('mySubmissions.details')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.ideaTitle} size="lg">
                {selected && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 flex-wrap border-b border-surface-800 pb-4">
                            <span className="text-sm font-mono bg-surface-800 border border-white/5 px-2.5 py-1 rounded-md text-surface-300">{selected.refCode}</span>
                            <Badge status={selected.status}>{t(`status.${selected.status}`)}</Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6 bg-surface-800/50 p-4 rounded-xl border border-white/5">
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-1 uppercase tracking-wider">{t('submit.name')}</div>
                                <div className="font-medium text-white">{selected.user.name}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-1 uppercase tracking-wider">{t('submit.email')}</div>
                                <div className="font-medium text-white">{selected.user.email}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-1 uppercase tracking-wider">{t('submit.domain')}</div>
                                <div className="font-medium text-white">{t(`submit.domains.${selected.domain}`)}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-1 uppercase tracking-wider">{t('mySubmissions.date')}</div>
                                <div className="font-medium text-white">{new Date(selected.createdAt).toLocaleDateString(lang)}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1 h-3 bg-primary-500 rounded-full"></span> {t('submit.problem')}
                            </div>
                            <p className="text-surface-300 text-sm bg-surface-800/50 border border-white/5 rounded-xl p-4 leading-relaxed">{selected.problem}</p>
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-highlight mb-2 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1 h-3 bg-highlight rounded-full"></span> {t('submit.solution')}
                            </div>
                            <p className="text-surface-300 text-sm bg-surface-800/50 border border-white/5 rounded-xl p-4 leading-relaxed">{selected.solution}</p>
                        </div>

                        {selected.market && (
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">{t('submit.market')}</div>
                                <p className="text-surface-300 text-sm bg-surface-800/50 border border-white/5 rounded-xl p-4 leading-relaxed">{selected.market}</p>
                            </div>
                        )}

                        {selected.teamMembers?.length > 0 && (
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-3 uppercase tracking-wider">{t('submit.teamMembers')}</div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {selected.teamMembers.map((m, i) => (
                                        <div key={i} className="text-sm bg-surface-800/50 border border-white/5 rounded-lg px-4 py-3 flex justify-between items-center group hover:border-primary-500/30 transition-colors">
                                            <span className="font-medium text-white group-hover:text-primary-400 transition-colors">{m.name}</span>
                                            <span className="text-surface-400 text-xs px-2 py-1 bg-surface-700 rounded-md">{m.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selected.adminComment && (
                            <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                                <div className="text-xs text-primary-400 font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> {t('mySubmissions.adminComment')}
                                </div>
                                <p className="text-white text-sm leading-relaxed">{selected.adminComment}</p>
                            </div>
                        )}

                        {selected.attachments?.length > 0 && (
                            <div>
                                <div className="text-xs font-semibold text-surface-400 mb-3 uppercase tracking-wider">{t('submit.attachments')}</div>
                                <div className="space-y-2">
                                    {selected.attachments.map((f, i) => (
                                        <div key={i} className="text-sm bg-surface-800/50 border border-white/5 rounded-lg px-4 py-3 flex items-center gap-3 group hover:bg-surface-800 hover:border-white/10 transition-all cursor-pointer">
                                            <div className="w-8 h-8 rounded-md bg-surface-700 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-colors">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <span className="text-surface-300 group-hover:text-white transition-colors">{f.name}</span>
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
