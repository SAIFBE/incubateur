import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const initialForm = {
  name: '',
  role_title: '',
  department: '',
  phone: '',
  whatsapp_phone: '',
  is_active: true,
};

export default function AdminStaffContactFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (isReadOnlyAdmin) {
      navigate('/dashboard/admin/staff-contacts', { replace: true });
    }
  }, [isReadOnlyAdmin, navigate]);

  useEffect(() => {
    if (!isEditing) return;

    api.get(`/admin/staff-contacts/${id}`)
      .then((response) => setFormData({ ...initialForm, ...(response.data?.data || {}) }))
      .catch(() => setLoadError('Impossible de charger ce contact.'));
  }, [id, isEditing]);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      if (isEditing) {
        await api.patch(`/admin/staff-contacts/${id}`, formData);
      } else {
        await api.post('/admin/staff-contacts', formData);
      }
      navigate('/dashboard/admin/staff-contacts');
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setLoadError(error.response?.data?.message || 'Impossible d enregistrer ce contact.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-page animate-fade-in">
      <div className="admin-form-heading">
        <button onClick={() => navigate('/dashboard/admin/staff-contacts')} className="admin-back-button" aria-label="Retour">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p>Personnel</p>
          <h1>{isEditing ? 'Modifier le contact' : 'Ajouter un contact personnel'}</h1>
        </div>
      </div>

      <Card className="admin-form-card">
        <CardBody className="p-8">
          {loadError && <div className="admin-registrations-error mb-6">{loadError}</div>}
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nom" name="name" value={formData.name} onChange={handleChange} error={errors.name?.[0]} required />
              <Input label="Fonction" name="role_title" value={formData.role_title || ''} onChange={handleChange} error={errors.role_title?.[0]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Departement" name="department" value={formData.department || ''} onChange={handleChange} error={errors.department?.[0]} />
              <Input label="Telephone" name="phone" value={formData.phone || ''} onChange={handleChange} error={errors.phone?.[0]} />
            </div>

            <Input
              label="Numero WhatsApp"
              name="whatsapp_phone"
              value={formData.whatsapp_phone || ''}
              onChange={handleChange}
              error={errors.whatsapp_phone?.[0]}
              required
            />

            <label className="admin-checkbox-line">
              <input type="checkbox" name="is_active" checked={Boolean(formData.is_active)} onChange={handleChange} />
              Contact actif
            </label>

            <div className="admin-form-actions">
              <button type="button" onClick={() => navigate('/dashboard/admin/staff-contacts')} className="btn btn-secondary">Annuler</button>
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
}
