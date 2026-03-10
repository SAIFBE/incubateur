import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Download, Image as ImageIcon, X } from 'lucide-react';
import Papa from 'papaparse';
import { useDataStore } from '../../contexts/DataStoreContext';
import { useUI } from '../../contexts/UIContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const emptyPastEvent = {
    title_i18n: { fr: '', ar: '', en: '' },
    description_i18n: { fr: '', ar: '', en: '' },
    location_i18n: { fr: '', ar: '', en: '' },
    date: '',
    images: [],
};

export default function AdminPastEvents() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { pastEvents, addPastEvent, updatePastEvent, deletePastEvent } = useDataStore();
    const { addToast } = useUI();
    
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyPastEvent);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyPastEvent);
        setFormOpen(true);
    };

    const openEdit = (evt) => {
        setEditing(evt);
        setForm(evt);
        setFormOpen(true);
    };

    const handleSave = () => {
        const data = { ...form };
        
        if (editing) {
            updatePastEvent(data);
            addToast({ type: 'success', title: t('admin.edit') + ' ✓' });
        } else {
            addPastEvent(data);
            addToast({ type: 'success', title: t('admin.add') + ' ✓' });
        }
        setFormOpen(false);
    };

    const handleDelete = (id) => {
        deletePastEvent(id);
        setConfirmDelete(null);
        addToast({ type: 'info', title: t('admin.delete') + ' ✓' });
    };

    const exportCSV = () => {
        const csv = Papa.unparse(pastEvents.map(e => ({
            ID: e.id,
            Title_FR: e.title_i18n.fr,
            Date: e.date,
            Location: e.location_i18n.fr,
            ImagesCount: e.images.length
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'past_events.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const updateI18n = (field, lang, value) => {
        setForm(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };

    return (
        <div className="fade-in space-y-6">
            <div className="flex flex-col items-center justify-center text-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-surface-900">{t('admin.pastEvents')}</h1>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={Download} onClick={exportCSV} size="sm">
                        {t('admin.export')}
                    </Button>
                    <Button icon={Plus} onClick={openAdd} size="sm">
                        {t('admin.add')}
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-50 border-b border-surface-200">
                            <tr>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">Title</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">Date</th>
                                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-surface-600">Images</th>
                                <th className="text-right rtl:text-left px-4 py-3 font-semibold text-surface-600">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {pastEvents.map(evt => (
                                <tr key={evt.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-surface-800 max-w-[250px] truncate">
                                        {evt.title_i18n[lang] || evt.title_i18n.fr}
                                    </td>
                                    <td className="px-4 py-3 text-surface-500">
                                        {evt.date}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-surface-500">
                                            <ImageIcon size={14} />
                                            <span>{evt.images.length}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right rtl:text-left">
                                        <div className="flex gap-1 justify-end rtl:justify-start">
                                            <button onClick={() => openEdit(evt)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setConfirmDelete(evt.id)} className="p-1.5 rounded-lg hover:bg-danger-50 text-danger-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pastEvents.length === 0 && (
                    <div className="text-center py-12 text-surface-400">{t('admin.noData')}</div>
                )}
            </div>

            {/* Form Modal */}
            <Modal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                title={editing ? t('admin.edit') : t('admin.add')}
                size="xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Title (FR)" value={form.title_i18n.fr} onChange={(e) => updateI18n('title_i18n', 'fr', e.target.value)} />
                        <Input label="Title (AR)" value={form.title_i18n.ar} onChange={(e) => updateI18n('title_i18n', 'ar', e.target.value)} />
                        <Input label="Title (EN)" value={form.title_i18n.en} onChange={(e) => updateI18n('title_i18n', 'en', e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Date (e.g. Mars 2026)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        <Input label="Location (FR)" value={form.location_i18n.fr} onChange={(e) => updateI18n('location_i18n', 'fr', e.target.value)} />
                    </div>

                    <Input label="Description (FR)" type="textarea" value={form.description_i18n.fr} onChange={(e) => updateI18n('description_i18n', 'fr', e.target.value)} />
                    
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Photographies
                        </label>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                Promise.all(files.map(file => {
                                    return new Promise((resolve) => {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => resolve(ev.target.result);
                                        reader.readAsDataURL(file);
                                    });
                                })).then(base64Images => {
                                    setForm(prev => ({
                                        ...prev,
                                        images: [...(prev.images || []), ...base64Images]
                                    }));
                                });
                            }}
                            className="w-full px-3 py-2 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                        />
                        {form.images && form.images.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {form.images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 group">
                                        <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-surface-200" />
                                        <button 
                                            type="button"
                                            onClick={() => setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))}
                                            className="absolute -top-1.5 -right-1.5 bg-danger-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
