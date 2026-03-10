import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Download, MessageSquare } from 'lucide-react';
import Papa from 'papaparse';
import { useDataStore } from '../../contexts/DataStoreContext';
import { useUI } from '../../contexts/UIContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

export default function AdminSubmissions() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { submissions, updateSubmission } = useDataStore();
    const { addToast } = useUI();
    const [selected, setSelected] = useState(null);
    const [reviewStatus, setReviewStatus] = useState('');
    const [reviewComment, setReviewComment] = useState('');

    const openReview = (sub) => {
        setSelected(sub);
        setReviewStatus(sub.status);
        setReviewComment(sub.adminComment || '');
    };

    const handleSaveReview = () => {
        updateSubmission({
            id: selected.id,
            status: reviewStatus,
            adminComment: reviewComment,
        });
        addToast({ type: 'success', title: t('admin.review.save') + ' ✓' });
        setSelected(null);
    };

    const exportCSV = () => {
        const csv = Papa.unparse(submissions.map(s => ({
            RefCode: s.refCode,
            Name: s.user.name,
            Email: s.user.email,
            IdeaTitle: s.ideaTitle,
            Domain: s.domain,
            Status: s.status,
            Comment: s.adminComment,
            CreatedAt: s.createdAt,
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'submissions.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const statusOptions = [
        { value: 'received', label: t('status.received') },
        { value: 'under_review', label: t('status.under_review') },
        { value: 'accepted', label: t('status.accepted') },
        { value: 'rejected', label: t('status.rejected') },
    ];

    return (
        <div className="fade-in space-y-6">
            <div className="flex flex-col items-center justify-center text-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-surface-900">{t('admin.submissions')}</h1>
                <Button variant="secondary" icon={Download} onClick={exportCSV} size="sm">
                    {t('admin.export')}
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-50 border-b border-surface-200">
                            <tr>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('mySubmissions.refCode')}</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">Title</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('submit.name')}</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('mySubmissions.status')}</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('mySubmissions.date')}</th>
                                <th className="text-right rtl:text-left px-4 py-3 font-semibold text-surface-600">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-surface-500">{sub.refCode}</td>
                                    <td className="px-4 py-3 font-medium text-surface-800 max-w-[200px] truncate">{sub.ideaTitle}</td>
                                    <td className="px-4 py-3 text-surface-600">{sub.user.name}</td>
                                    <td className="px-4 py-3"><Badge status={sub.status} size="xs">{t(`status.${sub.status}`)}</Badge></td>
                                    <td className="px-4 py-3 text-surface-500 text-xs">{new Date(sub.createdAt).toLocaleDateString(lang)}</td>
                                    <td className="px-4 py-3 text-right rtl:text-left">
                                        <button
                                            onClick={() => openReview(sub)}
                                            className="p-1.5 rounded-lg hover:bg-surface-100 text-primary-500 transition-colors"
                                            aria-label="Review"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {submissions.length === 0 && (
                    <div className="text-center py-12 text-surface-400">{t('admin.noData')}</div>
                )}
            </div>

            {/* Review Modal */}
            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={t('admin.review.title')} size="lg">
                {selected && (
                    <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-surface-400 mb-1">{t('mySubmissions.refCode')}</div>
                                <div className="font-mono font-medium">{selected.refCode}</div>
                            </div>
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
                        </div>

                        <div>
                            <div className="text-xs text-surface-400 mb-1">{t('submit.ideaTitle')}</div>
                            <div className="font-bold text-surface-900">{selected.ideaTitle}</div>
                        </div>

                        <div>
                            <div className="text-xs text-surface-400 mb-1">{t('submit.problem')}</div>
                            <p className="text-sm bg-surface-50 rounded-xl p-3">{selected.problem}</p>
                        </div>

                        <div>
                            <div className="text-xs text-surface-400 mb-1">{t('submit.solution')}</div>
                            <p className="text-sm bg-surface-50 rounded-xl p-3">{selected.solution}</p>
                        </div>

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

                        <div className="border-t border-surface-200 pt-5 space-y-4">
                            <h3 className="font-bold text-surface-900 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary-500" />
                                {t('admin.review.title')}
                            </h3>
                            <Select
                                label={t('admin.review.status')}
                                options={statusOptions}
                                value={reviewStatus}
                                onChange={(e) => setReviewStatus(e.target.value)}
                            />
                            <Input
                                label={t('admin.review.comment')}
                                type="textarea"
                                placeholder={t('admin.review.commentPlaceholder')}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => setSelected(null)}>{t('admin.cancel')}</Button>
                                <Button onClick={handleSaveReview}>{t('admin.review.save')}</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
