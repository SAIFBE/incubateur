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
  startDate: '',
  location: '',
  category: 'training',
  status: 'upcoming',
  mode: 'onsite',
  images: [],
};

const AdminEventFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const { events, addEvent, updateEvent } = useDataStore();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [galleryTouched, setGalleryTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isReadOnlyAdmin) {
      navigate('/dashboard/admin/events', { replace: true });
    }
  }, [isReadOnlyAdmin, navigate]);

  // Compte consultation redirige avant tout chargement de formulaire.
  useEffect(() => {
    if (!isEditing) return;

    const evt = events.find((event) => String(event.id) === String(id));
    if (!evt) {
      navigate('/dashboard/admin/events');
      return;
    }

    setFormData({
      title: evt.title_i18n?.fr || evt.title || '',
      description: evt.description_i18n?.fr || evt.description || '',
      startDate: evt.startDate ? evt.startDate.split('T')[0] : '',
      location: evt.location_i18n?.fr || evt.location || '',
      category: evt.category || 'training',
      status: evt.status || 'upcoming',
      mode: evt.mode || 'onsite',
      images: imageItemsFromUrls(evt.images?.length ? evt.images : evt.image ? [evt.image] : []),
    });
    setGalleryTouched(false);
  }, [id, events, isEditing, navigate]);

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

    const eventObj = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      category: formData.category,
      status: formData.status,
      mode: formData.mode,
      images: filesFromItems(formData.images),
      clear_images: galleryTouched,
      title_i18n: { fr: formData.title, ar: formData.title, en: formData.title },
      description_i18n: { fr: formData.description, ar: formData.description, en: formData.description },
      location_i18n: { fr: formData.location, ar: formData.location, en: formData.location },
      tags: [formData.category],
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await updateEvent({ ...eventObj, id });
      } else {
        await addEvent({ ...eventObj, createdAt: new Date().toISOString() });
      }
      showToast({ title: 'Succès', message: isEditing ? 'Événement modifié.' : 'Événement créé.' });
      navigate('/dashboard/admin/events');
    } catch (error) {
      showToast({ title: 'Erreur', message: error.response?.data?.message || 'Impossible d’enregistrer cet événement.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-page animate-fade-in">
      <div className="admin-form-heading">
        <button onClick={() => navigate('/dashboard/admin/events')} className="admin-back-button" aria-label="Retour">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p>Événements</p>
          <h1>{isEditing ? 'Modifier l’événement' : 'Créer un nouvel événement'}</h1>
        </div>
      </div>

      <Card className="admin-form-card">
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Titre de l’événement" name="title" value={formData.title} onChange={handleChange} required />
              <Input type="date" label="Date de l’événement" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>

            <Textarea label="Description complète" name="description" value={formData.description} onChange={handleChange} rows={5} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Lieu ou lien visio" name="location" value={formData.location} onChange={handleChange} required />
              <Select label="Mode de l’événement" name="mode" value={formData.mode} onChange={handleChange} options={[{ value: 'onsite', label: 'En présentiel' }, { value: 'online', label: 'En ligne' }]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Catégorie" name="category" value={formData.category} onChange={handleChange} options={[{ value: 'training', label: 'Formation' }, { value: 'workshop', label: 'Atelier' }, { value: 'conference', label: 'Conférence' }, { value: 'networking', label: 'Networking' }, { value: 'hackathon', label: 'Hackathon' }]} />
              <Select label="Statut de l’événement" name="status" value={formData.status} onChange={handleChange} options={[{ value: 'upcoming', label: 'À venir' }, { value: 'ongoing', label: 'En cours' }, { value: 'completed', label: 'Terminé' }]} />
            </div>

            <AdminImagePicker label="Photos de l’événement" help="Ajoutez une ou plusieurs photos. La première photo sera utilisée comme couverture." value={formData.images} onChange={handleImagesChange} />

            <div className="admin-form-actions">
              <button type="button" onClick={() => navigate('/dashboard/admin/events')} className="btn btn-secondary">Annuler</button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                <Save size={16} />
                {isSubmitting ? 'Enregistrement...' : isEditing ? 'Enregistrer les modifications' : 'Créer l’événement'}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminEventFormPage;
