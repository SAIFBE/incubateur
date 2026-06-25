import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import Badge from '../../components/ui/Badge';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const valueLabels = {
  male: 'Homme',
  female: 'Femme',
  single: 'Celibataire',
  married: 'Marie(e)',
  divorced: 'Divorce(e)',
  widowed: 'Veuf(ve)',
  primary: 'Primaire',
  secondary: 'Secondaire',
  baccalaureate: 'Bachelier',
  higher_diploma: 'Diplome superieur',
  ofppt_diploma: 'Diplome OFPPT',
  none: 'Aucun',
  student: 'Etudiant(e)',
  trainee: 'En formation',
  employee: 'Salarie(e)',
  entrepreneur: 'Entrepreneur(e)',
  job_seeker: 'En recherche d emploi',
  other: 'Autre',
  ofppt_trainee: "Stagiaire de l'OFPPT",
  outside_ofppt: 'Hors OFPPT',
  auto_entrepreneur: 'Auto-entrepreneur',
  sarl: 'SARL',
  cooperative: 'Cooperative',
  association: 'Association',
};

const hasValue = (value) => value !== null && value !== undefined && value !== '';

const displayValue = (value, type = 'text') => {
  if (!hasValue(value)) return 'Non renseigne';
  if (type === 'boolean') return value === true || value === 1 || value === '1' ? 'Oui' : 'Non';
  if (type === 'date') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('fr-FR');
  }
  return valueLabels[value] || value;
};

const DetailItem = ({ label, value, type }) => (
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className={`detail-value ${!hasValue(value) ? 'text-tertiary' : ''}`}>{displayValue(value, type)}</span>
  </div>
);

const DetailSection = ({ title, children }) => (
  <Card>
    <CardHeader title={title} />
    <CardBody>
      <div className="details-grid">{children}</div>
    </CardBody>
  </Card>
);

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSubmission } = useAppData();
  const { showToast } = useToast();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    getSubmission(id)
      .then((data) => {
        if (active) setSubmission(data);
      })
      .catch(() => {
        if (active) {
          setLoadError(true);
          showToast({ title: 'Erreur', message: 'Soumission introuvable ou non autorisee.', type: 'error' });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [getSubmission, id, showToast]);

  if (loading) {
    return <div className="text-center p-12 text-tertiary">Chargement de la soumission...</div>;
  }

  if (loadError || !submission) {
    return (
      <div className="text-center p-12">
        <h2 className="text-h2 mb-4">Soumission introuvable</h2>
        <Button onClick={() => navigate('/dashboard/trainee/my-submissions')}>Retour aux soumissions</Button>
      </div>
    );
  }

  const canEdit = false;

  return (
    <div className="pb-12">
      <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <button className="text-secondary text-sm mb-2 hover:text-primary transition-colors flex items-center gap-1" onClick={() => navigate(-1)}>
            Retour
          </button>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="page-title mb-0">{submission.title || `Fiche OFPPT - ${submission.full_name}`}</h1>
            <Badge status={submission.status} />
          </div>
          <p className="text-sm text-secondary">
            Cree le {displayValue(submission.created_at, 'date')}
            <span className="mx-2">-</span>
            Derniere MAJ: {displayValue(submission.updated_at, 'date')}
          </p>
        </div>

        {canEdit && (
          <Button variant="secondary" onClick={() => navigate(`/dashboard/trainee/new-submission?edit=${submission.id}`)}>
            Modifier
          </Button>
        )}
      </div>

      {submission.admin_comment && (
        <Card className="mb-6 border-primary">
          <CardHeader title="Commentaire administrateur" />
          <CardBody>
            <p className="text-body whitespace-pre-wrap">{submission.admin_comment}</p>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailSection title="Informations personnelles">
          <DetailItem label="Nom et prenom" value={submission.full_name} />
          <DetailItem label="CIN" value={submission.cin} />
          <DetailItem label="Sexe" value={submission.gender} />
          <DetailItem label="Date de naissance" value={submission.birth_date} type="date" />
          <DetailItem label="Lieu de naissance" value={submission.birth_place} />
          <DetailItem label="Situation familiale" value={submission.family_status} />
          <DetailItem label="Adresse actuelle" value={submission.current_address} />
          <DetailItem label="Email" value={submission.email} />
          <DetailItem label="Telephone" value={submission.phone} />
        </DetailSection>

        <DetailSection title="Niveau d'instruction">
          <DetailItem label="Niveau d'instruction" value={submission.education_level} />
          <DetailItem label="Possede un diplome" value={submission.has_diploma} type="boolean" />
          <DetailItem label="Specialite du diplome" value={submission.diploma_specialty} />
          <DetailItem label="Annee d'obtention" value={submission.diploma_year} />
          <DetailItem label="Etablissement" value={submission.diploma_establishment} />
          <DetailItem label="Laureat OFPPT" value={submission.is_ofppt_graduate} type="boolean" />
          <DetailItem label="Niveau de qualification" value={submission.qualification_level} />
          <DetailItem label="Specialite OFPPT" value={submission.ofppt_specialty} />
          <DetailItem label="Annee diplome OFPPT" value={submission.ofppt_diploma_year} />
          <DetailItem label="En formation" value={submission.is_in_training} type="boolean" />
          <DetailItem label="Type de formation" value={submission.training_type} />
          <DetailItem label="Specialite formation" value={submission.training_specialty} />
          <DetailItem label="Niveau formation" value={submission.training_level} />
          <DetailItem label="Etablissement formation" value={submission.training_establishment} />
        </DetailSection>

        <DetailSection title="Activite actuelle">
          <DetailItem label="Activite actuelle" value={submission.current_activity} />
          <DetailItem label="Autre activite" value={submission.current_activity_other} />
        </DetailSection>

        <DetailSection title="Objet de l'inscription">
          <DetailItem label="Employabilite" value={submission.interested_employability} type="boolean" />
          <DetailItem label="Entrepreneuriat" value={submission.interested_entrepreneurship} type="boolean" />
          <DetailItem label="Idee de projet" value={submission.has_project_idea} type="boolean" />
          <DetailItem label="Projet existant" value={submission.has_project} type="boolean" />
          <DetailItem label="Autre objectif" value={submission.registration_objective_other} />
          <DetailItem label="Description idee" value={submission.project_idea_description} />
          <DetailItem label="Description projet" value={submission.project_description} />
        </DetailSection>

        <DetailSection title="Entreprise existante">
          <DetailItem label="Entreprise creee" value={submission.has_created_company} type="boolean" />
          <DetailItem label="Statut juridique" value={submission.legal_status} />
          <DetailItem label="Autre statut" value={submission.legal_status_other} />
          <DetailItem label="Activite entreprise" value={submission.company_activity} />
          <DetailItem label="Date creation" value={submission.company_creation_date} type="date" />
          <DetailItem label="Entreprise active" value={submission.company_is_active} type="boolean" />
          <DetailItem label="Date debut activite" value={submission.activity_start_date} type="date" />
        </DetailSection>

        <DetailSection title="Accompagnement entrepreneurial">
          <DetailItem label="Souhaite un accompagnement" value={submission.interested_in_support} type="boolean" />
        </DetailSection>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;

