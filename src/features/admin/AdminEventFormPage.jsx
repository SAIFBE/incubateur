import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card, { CardBody } from '../../components/ui/Card';

const AdminEventFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { events, addEvent, updateEvent } = useDataStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    location: '',
    category: 'training',
    status: 'upcoming',
    mode: 'onsite',
    image: ''
  });

  useEffect(() => {
    if (isEditing) {
      const evt = events.find(e => e.id === id);
      if (evt) {
        setFormData({
          title: evt.title_i18n?.fr || evt.title || '',
          description: evt.description_i18n?.fr || evt.description || '',
          startDate: evt.startDate ? evt.startDate.split('T')[0] : '', // simple date input format
          location: evt.location_i18n?.fr || evt.location || '',
          category: evt.category || 'training',
          status: evt.status || 'upcoming',
          mode: evt.mode || 'onsite',
          image: evt.image || ''
        });
      } else {
        navigate('/dashboard/admin/events');
      }
    }
  }, [id, events, isEditing, navigate]);

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
    
    // Construct event object compatible with the existing mock structure + new fields
    const eventObj = {
      ...formData,
      // For legacy compatibility on public views
      title_i18n: { fr: formData.title, ar: formData.title, en: formData.title },
      description_i18n: { fr: formData.description, ar: formData.description, en: formData.description },
      location_i18n: { fr: formData.location, ar: formData.location, en: formData.location },
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      tags: [formData.category], 
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      updateEvent({ ...eventObj, id });
    } else {
      eventObj.createdAt = new Date().toISOString();
      addEvent(eventObj);
    }
    
    navigate('/dashboard/admin/events');
  };

  return (
    <div className="pb-12 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/admin/events')} className="p-2 bg-surface hover:bg-surface-hover rounded-full transition-colors border border-border">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Modifier l\'événement' : 'Créer un nouvel événement'}</h1>
      </div>

      <Card>
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Titre de l'événement"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Input
                type="date"
                label="Date de l'événement"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <Textarea
              label="Description complète"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Lieu (ou lien visio)"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <Select
                label="Mode de l'événement"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                options={[
                  { value: 'onsite', label: 'En présentiel' },
                  { value: 'online', label: 'En ligne' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  { value: 'training', label: 'Formation' },
                  { value: 'workshop', label: 'Atelier' },
                  { value: 'conference', label: 'Conférence' },
                  { value: 'networking', label: 'Networking' },
                  { value: 'hackathon', label: 'Hackathon' },
                ]}
              />
              <Select
                label="Statut de l'événement"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'upcoming', label: 'À venir' },
                  { value: 'ongoing', label: 'En cours' },
                  { value: 'completed', label: 'Terminé' },
                ]}
              />
            </div>

            <div className="border border-dashed border-primary-300 bg-primary-50 rounded-xl p-6 text-center">
              <label className="block text-sm font-medium text-primary-800 mb-2">Image de couverture (Optionnel)</label>
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
                onClick={() => navigate('/dashboard/admin/events')}
                className="px-6 py-2 bg-surface-200 hover:bg-surface-300 text-surface-800 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors"
              >
                {isEditing ? 'Enregistrer les modifications' : 'Créer l\'événement'}
              </button>
            </div>
            
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminEventFormPage;
