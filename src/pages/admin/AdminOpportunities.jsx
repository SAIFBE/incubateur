import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';
import Papa from 'papaparse';
import { useDataStore } from '../../contexts/DataStoreContext';
import { useUI } from '../../contexts/UIContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const emptyOpp = {
    title_i18n: { fr: '', ar: '', en: '' },
    summary_i18n: { fr: '', ar: '', en: '' },
    eligibility_i18n: { fr: '', ar: '', en: '' },
    category: 'funding',
    deadline: '',
    status: 'open',
    tags: [],
};

export default function AdminOpportunities() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { opportunities, addOpportunity, updateOpportunity, deleteOpportunity } = useDataStore();
    const { addToast } = useUI();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyOpp);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [tagsInput, setTagsInput] = useState('');

    const openAdd = () => {
        setEditing(null);
        setForm(emptyOpp);
        setTagsInput('');
        setFormOpen(true);
    };

    const openEdit = (opp) => {
        setEditing(opp);
        setForm({ ...opp });
        setTagsInput(opp.tags.join(', '));
        setFormOpen(true);
    };

    const handleSave = () => {
        const data = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) };
        if (editing) {
            updateOpportunity(data);
            addToast({ type: 'success', title: t('admin.edit') + ' ✓' });
        } else {
            addOpportunity({ ...data, createdAt: new Date().toISOString().split('T')[0] });
            addToast({ type: 'success', title: t('admin.add') + ' ✓' });
        }
        setFormOpen(false);
    };

    const handleDelete = (id) => {
        deleteOpportunity(id);
        setConfirmDelete(null);
        addToast({ type: 'info', title: t('admin.delete') + ' ✓' });
    };

    const exportCSV = () => {
        const csv = Papa.unparse(opportunities.map(o => ({
            ID: o.id,
            Title_FR: o.title_i18n.fr,
            Title_AR: o.title_i18n.ar,
            Title_EN: o.title_i18n.en,
            Category: o.category,
            Status: o.status,
            Deadline: o.deadline,
            Tags: o.tags.join('; '),
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'opportunities.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const updateI18n = (field, lang, value) => {
        setForm(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };

    const categoryOptions = [
        { value: 'funding', label: t('opportunities.categories.funding') },
        { value: 'training', label: t('opportunities.categories.training') },
        { value: 'mentoring', label: t('opportunities.categories.mentoring') },
        { value: 'competition', label: t('opportunities.categories.competition') },
        { value: 'networking', label: t('opportunities.categories.networking') },
    ];

    return (
        <div className="fade-in space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-surface-900">{t('admin.opportunities')}</h1>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Download} onClick={exportCSV} size="sm">
                        {t('admin.export')}
                    </Button>
                    <Button icon={Plus} onClick={openAdd} size="sm">
                        {t('admin.add')}
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-50 border-b border-surface-200">
                            <tr>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">Title</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('opportunities.category')}</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('opportunities.filterStatus')}</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('opportunities.deadline')}</th>
                                <th className="text-right rtl:text-left px-4 py-3 font-semibold text-surface-600">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {opportunities.map(opp => (
                                <tr key={opp.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-surface-800 max-w-[250px] truncate">
                                        {opp.title_i18n[lang] || opp.title_i18n.fr}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge color="purple" size="xs">{t(`opportunities.categories.${opp.category}`)}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge status={opp.status} size="xs">{t(`opportunities.${opp.status}`)}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-surface-500">{opp.deadline}</td>
                                    <td className="px-4 py-3 text-right rtl:text-left">
                                        <div className="flex gap-1 justify-end rtl:justify-start">
                                            <button onClick={() => openEdit(opp)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors" aria-label={t('admin.edit')}>
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setConfirmDelete(opp.id)} className="p-1.5 rounded-lg hover:bg-danger-50 text-danger-500 transition-colors" aria-label={t('admin.delete')}>
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {opportunities.length === 0 && (
                    <div className="text-center py-12 text-surface-400">{t('admin.noData')}</div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? t('admin.edit') : t('admin.add')} size="lg">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <Input label="Title (FR)" value={form.title_i18n.fr} onChange={(e) => updateI18n('title_i18n', 'fr', e.target.value)} />
                        <Input label="Title (AR)" value={form.title_i18n.ar} onChange={(e) => updateI18n('title_i18n', 'ar', e.target.value)} />
                        <Input label="Title (EN)" value={form.title_i18n.en} onChange={(e) => updateI18n('title_i18n', 'en', e.target.value)} />
                    </div>
                    <Input label="Summary (FR)" type="textarea" value={form.summary_i18n.fr} onChange={(e) => updateI18n('summary_i18n', 'fr', e.target.value)} />
                    <Input label="Eligibility (FR)" value={form.eligibility_i18n.fr} onChange={(e) => updateI18n('eligibility_i18n', 'fr', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label={t('opportunities.category')} options={categoryOptions} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                        <Select
                            label={t('opportunities.filterStatus')}
                            options={[{ value: 'open', label: t('opportunities.open') }, { value: 'closed', label: t('opportunities.closed') }]}
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        />
                    </div>
                    <Input label={t('opportunities.deadline')} type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                    <Input label={t('opportunities.tags') + ' (comma-separated)'} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                    <div className="flex justify-end gap-2 pt-4 border-t border-surface-200">
                        <Button variant="secondary" onClick={() => setFormOpen(false)}>{t('admin.cancel')}</Button>
                        <Button onClick={handleSave}>{t('admin.save')}</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title={t('admin.delete')} size="sm">
                <p className="text-surface-600 mb-6">{t('admin.confirmDelete')}</p>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setConfirmDelete(null)}>{t('admin.cancel')}</Button>
                    <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>{t('admin.delete')}</Button>
                </div>
            </Modal>
        </div>
    );
}
