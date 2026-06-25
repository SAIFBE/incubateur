import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card, { CardBody } from '../../components/ui/Card';
import AdminImagePicker from '../../components/ui/AdminImagePicker';

const imageItemsFromUrls = (urls = []) => urls.filter(Boolean).map((url, index) => ({
  id: 'existing-' + index + '-' + url,
  url,
  name: 'Photo ' + (index + 1),
  isExisting: true,
}));

const filesFromItems = (items) => items.filter((item) => item.file).map((item) => item.file);


const initialForm = {
  title: '',
  description: '',
  deadline: '',
  category: 'funding',
  status: 'open',
  link: '',
  images: [],
};

const AdminOpportunityFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const { opportunities, addOpportunity, updateOpportunity } = useDataStore();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [galleryTouched, setGalleryTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isReadOnlyAdmin) {
      navigate('/dashboard/admin/opportunities', { replace: true });
    }
  }, [isReadOnlyAdmin, navigate]);

  // Compte consultation redirige avant tout chargement de formulaire.
  useEffect(() => {
    if (!isEditing) return;

    const opp = opportunities.find((item) => String(item.id) === String(id));
    if (!opp) {
      navigate('/dashboard/admin/opportunities');
      return;
    }

    setFormData({
      title: opp.title_i18n?.fr || opp.title || '',
      description: opp.summary_i18n?.fr || opp.description || '',
      deadline: opp.deadline ? opp.deadline.split('T')[0] : '',
      category: opp.category || 'funding',
      status: opp.status || 'open',
      link: opp.link || '',
      images: imageItemsFromUrls(opp.images?.length ? opp.images : opp.image ? [opp.image] : []),
    });
    setGalleryTouched(false);
  }, [id, opportunities, isEditing, navigate]);

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleImagesChange = (items) => {
    setGalleryTouched(true);
    setFormData((current) => ({ ...current, images: items }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const oppObj = {
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : '',
      category: formData.category,
      status: formData.status,
      link: formData.link,
      images: filesFromItems(formData.images),
      clear_images: galleryTouched,
      title_i18n: { fr: formData.title, ar: formData.title, en: formData.title },
      summary_i18n: { fr: formData.description, ar: formData.description, en: formData.description },
      tags: [formData.category],
    };

    try {
      if (isEditing) {
        await updateOpportunity({ ...oppObj, id });
      } else {
        await addOpportunity({ ...oppObj, createdAt: new Date().toISOString() });
      }
      showToast({ title: 'Succès', message: isEditing ? 'Opportunité modifiée.' : 'Opportunité créée.' });
      navigate('/dashboard/admin/opportunities');
    } catch (error) {
      showToast({ title: 'Erreur', message: error.response?.data?.message || 'Impossible d’enregistrer cette opportunité.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-page animate-fade-in">
      <div className="admin-form-heading">
        <button onClick={() => navigate('/dashboard/admin/opportunities')} className="admin-back-button" aria-label="Retour">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p>Opportunités</p>
          <h1>{isEditing ? 'Modifier l’opportunité' : 'Créer une nouvelle opportunité'}</h1>
        </div>
      </div>

      <Card className="admin-form-card">
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Titre de l’opportunité" name="title" value={formData.title} onChange={handleChange} required />
              <Input type="date" label="Date limite de candidature" name="deadline" value={formData.deadline} onChange={handleChange} />
            </div>

            <Textarea label="Description complète" name="description" value={formData.description} onChange={handleChange} rows={4} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Catégorie" name="category" value={formData.category} onChange={handleChange} options={[{ value: 'funding', label: 'Financement' }, { value: 'training', label: 'Formation' }, { value: 'mentoring', label: 'Mentorat' }, { value: 'competition', label: 'Compétition' }, { value: 'networking', label: 'Networking' }]} />
              <Select label="Statut" name="status" value={formData.status} onChange={handleChange} options={[{ value: 'open', label: 'Ouvert / En cours' }, { value: 'upcoming', label: 'À venir' }, { value: 'closed', label: 'Fermé / Expiré' }]} />
            </div>

            <Input type="url" label="Lien d’inscription externe" name="link" placeholder="https://..." value={formData.link} onChange={handleChange} />

            <AdminImagePicker label="Photos de l’opportunité" help="Ajoutez des visuels pour illustrer le programme, concours ou appel à projets." value={formData.images} onChange={handleImagesChange} />

            <div className="admin-form-actions">
              <button type="button" onClick={() => navigate('/dashboard/admin/opportunities')} className="btn btn-secondary">Annuler</button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                <Save size={16} />
                {isSubmitting ? 'Enregistrement...' : isEditing ? 'Enregistrer les modifications' : 'Créer l’opportunité'}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminOpportunityFormPage;
