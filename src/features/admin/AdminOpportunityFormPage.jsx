import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card, { CardBody } from '../../components/ui/Card';

const AdminOpportunityFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { opportunities, addOpportunity, updateOpportunity } = useDataStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'funding',
    status: 'open',
    link: ''
  });

  useEffect(() => {
    if (isEditing) {
      const opp = opportunities.find(o => o.id === id);
      if (opp) {
        setFormData({
          title: opp.title_i18n?.fr || opp.title || '',
          description: opp.summary_i18n?.fr || opp.description || '',
          deadline: opp.deadline ? opp.deadline.split('T')[0] : '', // simple date input format
          category: opp.category || 'funding',
          status: opp.status || 'open',
          link: opp.link || ''
        });
      } else {
        navigate('/dashboard/admin/opportunities');
      }
    }
  }, [id, opportunities, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct element compatible with the mockData array structure
    const oppObj = {
      ...formData,
      title_i18n: { fr: formData.title, ar: formData.title, en: formData.title },
      summary_i18n: { fr: formData.description, ar: formData.description, en: formData.description },
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : '',
      tags: [formData.category], 
    };

    if (isEditing) {
      updateOpportunity({ ...oppObj, id });
    } else {
      oppObj.createdAt = new Date().toISOString();
      addOpportunity(oppObj);
    }
    
    navigate('/dashboard/admin/opportunities');
  };

  return (
    <div className="pb-12 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/admin/opportunities')} className="p-2 bg-surface hover:bg-surface-hover rounded-full transition-colors border border-border">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Modifier l\'opportunité' : 'Créer une nouvelle opportunité'}</h1>
      </div>

      <Card>
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Titre de l'opportunité"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Input
                type="date"
                label="Date limite de candidature"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <Textarea
              label="Description complète"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  { value: 'funding', label: 'Financement' },
                  { value: 'training', label: 'Formation' },
                  { value: 'mentoring', label: 'Mentorat' },
                  { value: 'competition', label: 'Compétition' },
                  { value: 'networking', label: 'Networking' },
                ]}
              />
              <Select
                label="Statut"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'open', label: 'Ouvert / En cours' },
                  { value: 'closed', label: 'Fermé / Expiré' },
                ]}
              />
            </div>
            
            <Input
                type="url"
                label="Lien d'inscription externe (Optionnel)"
                name="link"
                placeholder="https://..."
                value={formData.link}
                onChange={handleChange}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard/admin/opportunities')}
                className="px-6 py-2 bg-surface-200 hover:bg-surface-300 text-surface-800 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors"
              >
                {isEditing ? 'Enregistrer les modifications' : 'Créer l\'opportunité'}
              </button>
            </div>
            
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminOpportunityFormPage;
