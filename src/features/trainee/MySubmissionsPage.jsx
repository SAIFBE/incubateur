import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'under_review', label: 'En evaluation' },
  { value: 'selected', label: 'Selectionne' },
  { value: 'account_requested', label: 'Compte demande' },
  { value: 'account_created', label: 'Compte cree' },
];

const getSubmissionTitle = (submission) => (
  submission.title || `Fiche OFPPT - ${submission.full_name || 'Sans nom'}`
);

const getSubmissionDescription = (submission) => (
  submission.project_description
  || submission.project_idea_description
  || submission.description
  || 'Aucune description fournie.'
);

const getDateValue = (submission) => (
  submission.updated_at || submission.created_at || submission.updatedAt || submission.createdAt
);

const MySubmissionsPage = () => {
  const { currentUser } = useAuth();
  const { submissions, getMySubmissions, loading } = useAppData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadError(false);
    getMySubmissions().catch(() => {
      if (active) setLoadError(true);
    });
    return () => { active = false; };
  }, [getMySubmissions]);

  const mySubmissions = useMemo(() => (
    submissions.filter((submission) => String(submission.user_id) === String(currentUser?.id))
  ), [currentUser?.id, submissions]);

  const filteredSubmissions = useMemo(() => (
    mySubmissions
      .filter((submission) => {
        const title = getSubmissionTitle(submission).toLowerCase();
        const applicant = (submission.full_name || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = title.includes(search) || applicant.includes(search);
        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(getDateValue(b) || 0) - new Date(getDateValue(a) || 0))
  ), [mySubmissions, searchTerm, statusFilter]);

  return (
    <div className="pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mon idee acceptee</h1>
          <p className="page-subtitle">Consultez votre idee acceptee et son suivi administratif</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardBody className="flex gap-4 flex-wrap items-end">
          <Input
            placeholder="Rechercher par nom ou titre..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            containerClass="flex-1 min-w-[200px] mb-0"
          />
          <div className="form-group mb-0 min-w-[200px]">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {loadError && (
        <Card className="mb-6 border-danger">
          <CardBody className="text-danger">Impossible de charger votre idee depuis Laravel.</CardBody>
        </Card>
      )}

      {loading ? (
        <div className="p-8 text-center text-tertiary">Chargement de votre idee...</div>
      ) : filteredSubmissions.length > 0 ? (
        <div className="grid-cards">
          {filteredSubmissions.map((submission) => {
            const canEdit = false;
            const updatedAt = getDateValue(submission);

            return (
              <Card
                key={submission.id}
                className="flex flex-col h-full hover:border-primary cursor-pointer transition-all"
                onClick={() => navigate(`/dashboard/trainee/my-submissions/${submission.id}`)}
              >
                <CardBody className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge status={submission.status} />
                    <span className="text-xs text-tertiary uppercase tracking-wider">OFPPT</span>
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">
                    {getSubmissionTitle(submission)}
                  </h3>
                  <p className="text-sm text-secondary line-clamp-2 mb-4 flex-1">
                    {getSubmissionDescription(submission)}
                  </p>

                  <div className="pt-4 border-t border-border mt-auto flex justify-between items-center gap-3">
                    <span className="text-xs text-tertiary">
                      MAJ: {updatedAt ? new Date(updatedAt).toLocaleDateString('fr-FR') : 'Non renseigne'}
                    </span>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/dashboard/trainee/new-submission?edit=${submission.id}`);
                          }}
                        >
                          Modifier
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">Voir</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
          title="Aucune idee trouvee"
          description={mySubmissions.length === 0 ? "Aucune idee n est encore associee a votre compte." : 'Aucune idee ne correspond a vos filtres.'}
          actionLabel={mySubmissions.length === 0 ? 'Retour au tableau de bord' : 'Reinitialiser les filtres'}
          onAction={() => (mySubmissions.length === 0 ? navigate('/dashboard/trainee') : setStatusFilter('all'))}
        />
      )}
    </div>
  );
};

export default MySubmissionsPage;


