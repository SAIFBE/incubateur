import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const statusMessages = {
  pending: 'Votre idee est bien recue. Elle attend encore la premiere verification administrative.',
  under_review: 'Votre idee est actuellement en etude par l administration.',
  selected: 'Votre idee a ete selectionnee. L administration vous contactera par WhatsApp avec un lien securise pour demander votre compte.',
  rejected: 'Votre idee n a pas ete selectionnee pour le moment.',
  account_requested: 'Votre demande de compte a ete transmise a l administration.',
  account_created: 'Votre compte stagiaire a ete cree. Vous pouvez vous connecter avec votre CEF et votre mot de passe.',
};

const IdeaTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
  const [idea, setIdea] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadIdea = async (event) => {
    event?.preventDefault();
    const code = trackingCode.trim();
    if (!code) return;

    setLoading(true);
    setMessage('');
    setIdea(null);
    try {
      const response = await api.get('/project-ideas/track/' + encodeURIComponent(code));
      const nextIdea = response.data?.data ?? response.data;
      setIdea(nextIdea);
      setSearchParams({ code });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Aucune idee ne correspond a ce numero de suivi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('code')) loadIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="submission-form-container submit-public-page pb-12">
      <div className="mb-8">
        <h1 className="page-title">Suivi de votre idee</h1>
        <p className="page-subtitle">Entrez le numero de suivi recu apres le depot public.</p>
      </div>

      <Card className="mb-6">
        <CardHeader title="Numero de suivi" />
        <CardBody>
          <form className="grid-2" onSubmit={loadIdea}>
            <Input
              label="Code de suivi"
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="IDEA-20260623-ABC123"
              required
            />
            <div className="form-group flex items-end">
              <Button type="submit" isLoading={loading}>Verifier la decision</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {message && (
        <Card className="mb-6">
          <CardBody>{message}</CardBody>
        </Card>
      )}

      {idea && (
        <Card>
          <CardHeader title={idea.title || 'Idee de projet'} action={<Badge status={idea.status} />} />
          <CardBody>
            <p className="text-secondary mb-4">{statusMessages[idea.status] || 'Votre dossier est en cours de traitement.'}</p>
            <div className="details-grid mb-6">
              <div className="detail-item"><span className="detail-label">Candidat</span><span className="detail-value">{idea.full_name}</span></div>
              <div className="detail-item"><span className="detail-label">Numero de suivi</span><span className="detail-value">{idea.tracking_code}</span></div>
              <div className="detail-item"><span className="detail-label">Telephone</span><span className="detail-value">{idea.phone || 'Non renseigne'}</span></div>
              <div className="detail-item"><span className="detail-label">Date de depot</span><span className="detail-value">{idea.created_at ? new Date(idea.created_at).toLocaleDateString('fr-FR') : 'Non renseigne'}</span></div>
            </div>
            {idea.status === 'account_created' && <Link className="btn btn-primary" to="/login">Se connecter</Link>}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default IdeaTrackingPage;
