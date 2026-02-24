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

const emptyEvent = {
    title_i18n: { fr: '', ar: '', en: '' },
    description_i18n: { fr: '', ar: '', en: '' },
    location_i18n: { fr: '', ar: '', en: '' },
    startDate: '',
    endDate: '',
    mode: 'onsite',
    tags: [],
};

export default function AdminEvents() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { events, addEvent, updateEvent, deleteEvent } = useDataStore();
    const { addToast } = useUI();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyEvent);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [tagsInput, setTagsInput] = useState('');

    const openAdd = () => {
        setEditing(null);
        setForm(emptyEvent);
        setTagsInput('');
        setFormOpen(true);
    };

    const openEdit = (evt) => {
        setEditing(evt);
        setForm({ ...evt, startDate: evt.startDate.substring(0, 16), endDate: evt.endDate.substring(0, 16) });
        setTagsInput(evt.tags.join(', '));
        setFormOpen(true);
    };

    const handleSave = () => {
        const data = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) };
        if (editing) {
            updateEvent(data);
            addToast({ type: 'success', title: t('admin.edit') + ' ✓' });
        } else {
            addEvent({ ...data, createdAt: new Date().toISOString().split('T')[0] });
            addToast({ type: 'success', title: t('admin.add') + ' ✓' });
        }
        setFormOpen(false);
    };

    const handleDelete = (id) => {
        deleteEvent(id);
        setConfirmDelete(null);
        addToast({ type: 'info', title: t('admin.delete') + ' ✓' });
    };

    const exportCSV = () => {
        const csv = Papa.unparse(events.map(e => ({
            ID: e.id,
            Title_FR: e.title_i18n.fr,
            Title_AR: e.title_i18n.ar,
            Title_EN: e.title_i18n.en,
            StartDate: e.startDate,
            EndDate: e.endDate,
            Mode: e.mode,
            Tags: e.tags.join('; '),
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const updateI18n = (field, lang, value) => {
        setForm(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };

    return (
        <div className="fade-in space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-surface-900">{t('admin.events')}</h1>
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
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('events.date')}</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">Mode</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">{t('events.location')}</th>
                                <th className="text-right rtl:text-left px-4 py-3 font-semibold text-surface-600">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {events.map(evt => (
                                <tr key={evt.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-surface-800 max-w-[200px] truncate">
                                        {evt.title_i18n[lang] || evt.title_i18n.fr}
                                    </td>
                                    <td className="px-4 py-3 text-surface-500 text-xs">
                                        {new Date(evt.startDate).toLocaleDateString(lang)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge status={evt.mode} size="xs">{t(`events.${evt.mode}`)}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-surface-500 text-xs max-w-[150px] truncate">
                                        {evt.location_i18n[lang] || evt.location_i18n.fr}
                                    </td>
                                    <td className="px-4 py-3 text-right rtl:text-left">
                                        <div className="flex gap-1 justify-end rtl:justify-start">
                                            <button onClick={() => openEdit(evt)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors" aria-label={t('admin.edit')}>
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setConfirmDelete(evt.id)} className="p-1.5 rounded-lg hover:bg-danger-50 text-danger-500 transition-colors" aria-label={t('admin.delete')}>
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {events.length === 0 && (
                    <div className="text-center py-12 text-surface-400">{t('admin.noData')}</div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? t('admin.edit') : t('admin.add')} size="lg">
                <div className="space-y-4">
                    <Input label="Title (FR)" value={form.title_i18n.fr} onChange={(e) => updateI18n('title_i18n', 'fr', e.target.value)} />
                    <Input label="Title (AR)" value={form.title_i18n.ar} onChange={(e) => updateI18n('title_i18n', 'ar', e.target.value)} />
                    <Input label="Title (EN)" value={form.title_i18n.en} onChange={(e) => updateI18n('title_i18n', 'en', e.target.value)} />
                    <Input label="Description (FR)" type="textarea" value={form.description_i18n.fr} onChange={(e) => updateI18n('description_i18n', 'fr', e.target.value)} />
                    <Input label="Location (FR)" value={form.location_i18n.fr} onChange={(e) => updateI18n('location_i18n', 'fr', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Start Date" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                        <Input label="End Date" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                    </div>
                    <Select
                        label="Mode"
                        options={[
                            { value: 'onsite', label: t('events.onsite') },
                            { value: 'online', label: t('events.online') },
                        ]}
                        value={form.mode}
                        onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    />
                    <Input label={t('opportunities.tags') + ' (comma-separated)'} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                    <div className="flex justify-end gap-2 pt-4 border-t border-surface-200">
                        <Button variant="secondary" onClick={() => setFormOpen(false)}>{t('admin.cancel')}</Button>
                        <Button onClick={handleSave}>{t('admin.save')}</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm */}
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
