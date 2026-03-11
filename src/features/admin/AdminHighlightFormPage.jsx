import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card, { CardBody } from '../../components/ui/Card';

const AdminHighlightFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { pastEvents, addPastEvent, updatePastEvent } = useDataStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    impactSummary: '',
    image: ''
  });

  useEffect(() => {
    if (isEditing) {
      const evt = pastEvents.find(e => e.id == id);
      if (evt) {
        setFormData({
          title: evt.title_i18n?.fr || evt.title || '',
          description: evt.description_i18n?.fr || evt.description || '',
          date: evt.date || '',
          location: evt.location_i18n?.fr || evt.location || '',
          impactSummary: evt.impactSummary || '',
          image: evt.images && evt.images.length > 0 ? evt.images[0] : ''
        });
      } else {
        navigate('/dashboard/admin/highlights');
      }
    }
  }, [id, pastEvents, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct object compatible with existing Past Events structure
    const evtObj = {
      ...formData,
      title_i18n: { fr: formData.title, ar: formData.title, en: formData.title },
      description_i18n: { fr: formData.description, ar: formData.description, en: formData.description },
      location_i18n: { fr: formData.location, ar: formData.location, en: formData.location },
      images: formData.image ? [formData.image] : [],
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      updatePastEvent({ ...evtObj, id: Number(id) || id }); // Handling possibility of id being numeric in old mock strings
    } else {
      evtObj.createdAt = new Date().toISOString();
      addPastEvent(evtObj);
    }
    
    navigate('/dashboard/admin/highlights');
  };

  return (
    <div className="pb-12 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/admin/highlights')} className="p-2 bg-surface hover:bg-surface-hover rounded-full transition-colors border border-border">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Modifier le Moment d\'Impact' : 'Créer un Moment d\'Impact'}</h1>
      </div>

      <Card>
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom de l'événement"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Input
                label="Date (ex: Mars 2026, Hier...)"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Lieu"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Description de l'événement"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />

            <Textarea
              label="Résumé de l'Impact (Chiffres clés, succès, etc.)"
              name="impactSummary"
              value={formData.impactSummary}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: 5 startups créées, 100k MAD de fonds levés..."
            />

            <div className="border border-dashed border-primary-300 bg-primary-50 rounded-xl p-6 text-center">
              <label className="block text-sm font-medium text-primary-800 mb-2">Photo de l'événement</label>
              {formData.image && (
                <div className="mb-4 relative w-full max-w-sm mx-auto h-48 rounded-lg overflow-hidden border border-surface-200">
                  <img src={formData.image} alt="Aperçu" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData(prev => ({...prev, image: ''}))} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard/admin/highlights')}
                className="px-6 py-2 bg-surface-200 hover:bg-surface-300 text-surface-800 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors"
              >
                {isEditing ? 'Enregistrer les modifications' : 'Ajouter le Moment'}
              </button>
            </div>
            
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminHighlightFormPage;
