import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card, { CardBody } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import AdminImagePicker from '../../components/ui/AdminImagePicker';

const apiError = (error, fallback) => (
  Object.values(error.response?.data?.errors ?? {}).flat()[0]
  || error.response?.data?.message
  || fallback
);

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
  date: '',
  category: '',
  location: '',
  impactSummary: '',
  is_published: true,
  images: [],
};

const AdminHighlightFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [galleryTouched, setGalleryTouched] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  useEffect(() => {
    if (isReadOnlyAdmin) {
      navigate('/dashboard/admin/highlights', { replace: true });
    }
  }, [isReadOnlyAdmin, navigate]);

  // Compte consultation redirige avant tout chargement de formulaire.
  useEffect(() => {
    if (!isEditing) return;

    api.get('/admin/impact-moments/' + id)
      .then((response) => {
        const moment = response.data.data;
        setFormData({
          title: moment.title || '',
          description: moment.description || '',
          date: moment.date || '',
          category: moment.category || '',
          location: moment.location || '',
          impactSummary: moment.impactSummary || '',
          is_published: moment.is_published ?? true,
          images: imageItemsFromUrls(moment.images?.length ? moment.images : moment.image ? [moment.image] : []),
        });
        setGalleryTouched(false);
      })
      .catch((error) => {
        showToast({ title: 'Erreur', message: apiError(error, 'Moment d’impact introuvable.'), type: 'error' });
        navigate('/dashboard/admin/highlights');
      })
      .finally(() => setLoading(false));
  }, [id, isEditing, navigate, showToast]);

  const handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData((current) => ({ ...current, [target.name]: value }));
  };

  const handleImagesChange = (items) => {
    setGalleryTouched(true);
    setFormData((current) => ({ ...current, images: items }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const body = new FormData();
    ['title', 'description', 'date', 'category', 'location', 'impactSummary'].forEach((field) => {
      if (formData[field] !== '') body.append(field, formData[field]);
    });
    body.append('is_published', formData.is_published ? '1' : '0');
    if (galleryTouched) body.append('clear_images', '1');
    filesFromItems(formData.images).forEach((file) => body.append('images[]', file));

    try {
      if (isEditing) {
        body.append('_method', 'PUT');
        await api.post('/admin/impact-moments/' + id, body);
      } else {
        await api.post('/admin/impact-moments', body);
      }
      showToast({ title: 'Succès', message: 'Le Moment d’impact a été ' + (isEditing ? 'modifié' : 'créé') + '.' });
      navigate('/dashboard/admin/highlights');
    } catch (error) {
      const message = error.response?.status === 401
        ? 'Votre session a expiré. Reconnectez-vous avant de publier.'
        : apiError(error, 'Impossible d’enregistrer ce Moment d’impact.');
      setFormError(message);
      showToast({ title: 'Erreur', message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-tertiary">Chargement...</div>;

  return (
    <div className="admin-form-page animate-fade-in">
      <div className="admin-form-heading">
        <button onClick={() => navigate('/dashboard/admin/highlights')} className="admin-back-button" aria-label="Retour">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p>Moments d’impact</p>
          <h1>{isEditing ? 'Modifier le Moment d’impact' : 'Créer un Moment d’impact'}</h1>
        </div>
      </div>

      <Card className="admin-form-card">
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="admin-form-grid">
            {formError && <div className="form-error">{formError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Titre" name="title" value={formData.title} onChange={handleChange} required />
              <Input label="Date ou période" name="date" value={formData.date} onChange={handleChange} />
              <Input label="Catégorie" name="category" value={formData.category} onChange={handleChange} />
              <Input label="Lieu" name="location" value={formData.location} onChange={handleChange} />
            </div>

            <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={5} required />
            <Textarea label="Résumé de l’impact" name="impactSummary" value={formData.impactSummary} onChange={handleChange} rows={3} />

            <label className="admin-toggle-row">
              <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
              <span>Publier ce Moment d’impact</span>
            </label>

            <AdminImagePicker label="Photos du Moment d’impact" help="Ajoutez les photos fortes de ce moment. La première photo sera utilisée comme couverture." value={formData.images} onChange={handleImagesChange} />

            <div className="admin-form-actions">
              <button type="button" onClick={() => navigate('/dashboard/admin/highlights')} className="btn btn-secondary">Annuler</button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                <Save size={16} />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminHighlightFormPage;
