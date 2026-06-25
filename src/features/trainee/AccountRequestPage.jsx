import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const emptyForm = {
  cef: '',
  project_name: '',
  password: '',
  password_confirmation: '',
};

const AccountRequestPage = () => {
  const { token } = useParams();
  const [idea, setIdea] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setMessage('');
    api.get(`/account-invitations/${encodeURIComponent(token)}`)
      .then((response) => {
        if (!active) return;
        const nextIdea = response.data?.data ?? response.data;
        setIdea(nextIdea);
        setFormData((previous) => ({
          ...previous,
          project_name: previous.project_name || nextIdea.title || nextIdea.project_description || '',
        }));
      })
      .catch((error) => {
        if (active) setMessage(error.response?.data?.message || 'Ce lien est invalide ou expire.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const requestAccount = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage('');

    try {
      await api.post(`/account-invitations/${encodeURIComponent(token)}/request`, formData);
      setSubmitted(true);
      setMessage('Votre demande de compte a ete transmise a l administration.');
      setFormData(emptyForm);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        setErrors(Object.fromEntries(Object.entries(apiErrors).map(([field, values]) => [field, values[0]])));
      }
      setMessage(error.response?.data?.message || 'Impossible d envoyer la demande de compte.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submission-form-container submit-public-page pb-12">
      <div className="mb-8">
        <h1 className="page-title">Demande de creation de compte</h1>
        <p className="page-subtitle">Ce formulaire est reserve aux candidats selectionnes par l administration.</p>
      </div>

      {loading ? (
        <Card>
          <CardBody>Verification du lien securise...</CardBody>
        </Card>
      ) : message && !idea ? (
        <Card>
          <CardHeader title="Lien indisponible" />
          <CardBody>
            <p className="text-secondary mb-4">{message}</p>
            <Link className="btn btn-secondary" to="/">Retour a l accueil</Link>
          </CardBody>
        </Card>
      ) : submitted ? (
        <Card>
          <CardHeader title="Demande envoyee" action={<Badge status="pending" />} />
          <CardBody>
            <p className="text-secondary mb-4">{message}</p>
            <Link className="btn btn-primary" to="/login">Aller a la connexion</Link>
          </CardBody>
        </Card>
      ) : idea ? (
        <Card>
          <CardHeader title={idea.title || 'Idee selectionnee'} action={<Badge status={idea.status} />} />
          <CardBody>
            <div className="details-grid mb-6">
              <div className="detail-item"><span className="detail-label">Candidat</span><span className="detail-value">{idea.full_name}</span></div>
              <div className="detail-item"><span className="detail-label">Telephone</span><span className="detail-value">{idea.phone}</span></div>
              <div className="detail-item"><span className="detail-label">Suivi</span><span className="detail-value">{idea.tracking_code}</span></div>
            </div>

            {message && <div className="form-error mb-4">{message}</div>}

            <form onSubmit={requestAccount}>
              <div className="grid-2">
                <Input label="CEF" name="cef" value={formData.cef} onChange={handleChange} error={errors.cef} required />
                <Input label="Nom du projet" name="project_name" value={formData.project_name} onChange={handleChange} error={errors.project_name} required />
                <Input label="Mot de passe" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
                <Input label="Confirmer le mot de passe" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} required />
              </div>
              <div className="flex gap-3 flex-wrap mt-4">
                <Button type="submit" isLoading={submitting}>Envoyer la demande</Button>
                <Link className="btn btn-secondary" to="/">Annuler</Link>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
};

export default AccountRequestPage;
