import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  GraduationCap,
  Handshake,
  Lightbulb,
  Link2,
  MessageCircle,
  UserRound,
  XCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import './admin.css';

const statusLabels = {
  pending: 'En attente',
  under_review: 'En etude',
  selected: 'Selectionne',
  rejected: 'Refuse',
  account_requested: 'Compte demande',
  account_created: 'Compte cree',
};

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
  in_training: 'En cours de formation',
  job_seeker: 'Chercheur d emploi',
  employee: 'Salarie(e) / Employe(e)',
  entrepreneur: 'Entrepreneur',
  informal: 'Informel',
  neet: 'NEET',
  other: 'Autre',
  ofppt_trainee: 'Stagiaire de l OFPPT',
  outside_ofppt: 'Hors OFPPT',
  auto_entrepreneur: 'Auto-entrepreneur',
  legal_entity: 'Personne morale',
  cooperative: 'Cooperative',
  individual: 'Personne physique',
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

const getInvitationLink = (token) => (
  token ? window.location.origin + window.location.pathname + '#/demande-compte/' + token : ''
);

const normalizePhoneForWhatsApp = (phone) => {
  const digits = String(phone || '').replace(/D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return '212' + digits.slice(1);
  return digits;
};

const buildWhatsAppUrl = (submission, invitationLink) => {
  const phone = normalizePhoneForWhatsApp(submission.phone);
  if (!phone) return '';
  const message = invitationLink
    ? 'Bonjour ' + (submission.full_name || '') + ', votre idee a ete selectionnee par l incubateur. Merci de remplir votre demande de compte stagiaire via ce lien securise : ' + invitationLink
    : 'Bonjour ' + (submission.full_name || '') + ', votre idee a ete selectionnee par l incubateur. L administration vous contactera pour la suite.';
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
};

const DetailItem = ({ label, value, type, wide = false }) => (
  <div className={'admin-submission-field ' + (wide ? 'is-wide' : '')}>
    <span>{label}</span>
    <strong className={!hasValue(value) ? 'is-empty' : ''}>{displayValue(value, type)}</strong>
  </div>
);

const DetailSection = ({ number, title, icon: Icon, children }) => (
  <section className="admin-submission-section">
    <header>
      <div className="admin-submission-section-icon"><Icon size={19} /></div>
      <div>
        <span>Section {String(number).padStart(2, '0')}</span>
        <h2>{title}</h2>
      </div>
    </header>
    <div className="admin-submission-fields">{children}</div>
  </section>
);

const AdminSubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [submission, setSubmission] = useState(null);
  const [status, setStatus] = useState('pending');
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingInvitation, setIsGeneratingInvitation] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    setIsDetailLoading(true);
    setLoadError(false);
    api.get('/admin/project-ideas/' + id)
      .then((response) => {
        if (!active) return;
        const nextSubmission = response.data?.data ?? response.data;
        setSubmission(nextSubmission);
        setStatus(nextSubmission.status || 'pending');
        setComment(nextSubmission.admin_comment || '');
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsDetailLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (submission) {
      setStatus(submission.status || 'pending');
      setComment(submission.admin_comment || '');
    }
  }, [submission]);

  const invitationLink = useMemo(() => getInvitationLink(submission?.invitation_token), [submission?.invitation_token]);
  const whatsappUrl = useMemo(() => (submission ? buildWhatsAppUrl(submission, invitationLink) : ''), [submission, invitationLink]);

  if (isDetailLoading && !submission) return <div className="admin-submission-state">Chargement de la soumission...</div>;
  if (loadError && !submission) return <div className="admin-submission-state">Soumission introuvable.</div>;
  if (!submission) return <div className="admin-submission-state">Soumission introuvable.</div>;

  const saveReview = async (nextStatus = status) => {
    setIsSaving(true);
    setStatus(nextStatus);
    try {
      let response;
      if (nextStatus === 'selected') {
        response = await api.post('/admin/project-ideas/' + submission.id + '/select', { admin_comment: comment });
      } else if (nextStatus === 'rejected') {
        response = await api.post('/admin/project-ideas/' + submission.id + '/reject', { admin_comment: comment });
      } else {
        response = await api.patch('/admin/project-ideas/' + submission.id + '/review', { status: nextStatus, admin_comment: comment });
      }
      setSubmission(response.data?.data ?? response.data);
      showToast({ title: 'Succes', message: 'Evaluation enregistree avec succes.' });
    } catch (error) {
      showToast({ title: 'Erreur', message: error.response?.data?.message || 'Impossible de sauvegarder l evaluation.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const generateInvitation = async () => {
    setIsGeneratingInvitation(true);
    try {
      const response = await api.post('/admin/project-ideas/' + submission.id + '/generate-invitation');
      setSubmission(response.data?.data ?? response.data);
      showToast({ title: 'Succes', message: 'Lien securise genere.' });
    } catch (error) {
      showToast({ title: 'Erreur', message: error.response?.data?.message || 'Impossible de generer le lien.', type: 'error' });
    } finally {
      setIsGeneratingInvitation(false);
    }
  };

  const copyInvitation = async () => {
    if (!invitationLink) return;
    await navigator.clipboard.writeText(invitationLink);
    showToast({ title: 'Copie', message: 'Lien de creation de compte copie.' });
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="admin-submission-topbar">
        <Button variant="ghost" onClick={() => navigate('/dashboard/admin/submissions')}>
          <ArrowLeft size={17} /> Retour
        </Button>
      </div>

      <div className="admin-submission-heading">
        <div>
          <p>Fiche d inscription OFPPT</p>
          <h1>{displayValue(submission.full_name || submission.user?.name)}</h1>
          <span>Soumission #{submission.id} - recue le {displayValue(submission.created_at, 'date')}</span>
        </div>
        <span className={'admin-status-badge is-' + submission.status}>{statusLabels[submission.status] || submission.status}</span>
      </div>

      <div className="admin-submission-layout">
        <main className="admin-submission-sections">
          <DetailSection number={1} title="Informations personnelles" icon={UserRound}>
            <DetailItem label="Nom et prenom" value={submission.full_name} />
            <DetailItem label="CIN" value={submission.cin} />
            <DetailItem label="Sexe" value={submission.gender} />
            <DetailItem label="Date de naissance" value={submission.birth_date} type="date" />
            <DetailItem label="Lieu de naissance" value={submission.birth_place} />
            <DetailItem label="Situation familiale" value={submission.family_status} />
            <DetailItem label="Adresse actuelle" value={submission.current_address} wide />
            <DetailItem label="Email" value={submission.email} />
            <DetailItem label="Telephone" value={submission.phone} />
          </DetailSection>

          <DetailSection number={2} title="Niveau d instruction" icon={GraduationCap}>
            <DetailItem label="Niveau d instruction" value={submission.education_level} />
            <DetailItem label="Possede un diplome" value={submission.has_diploma} type="boolean" />
            <DetailItem label="Specialite du diplome" value={submission.diploma_specialty} />
            <DetailItem label="Annee d obtention" value={submission.diploma_year} />
            <DetailItem label="Etablissement du diplome" value={submission.diploma_establishment} wide />
            <DetailItem label="Laureat de l OFPPT" value={submission.is_ofppt_graduate} type="boolean" />
            <DetailItem label="Niveau de qualification" value={submission.qualification_level} />
            <DetailItem label="Specialite OFPPT" value={submission.ofppt_specialty} />
            <DetailItem label="Annee du diplome OFPPT" value={submission.ofppt_diploma_year} />
            <DetailItem label="Actuellement en formation" value={submission.is_in_training} type="boolean" />
            <DetailItem label="Type de formation" value={submission.training_type} />
            <DetailItem label="Specialite de formation" value={submission.training_specialty} />
            <DetailItem label="Niveau de formation" value={submission.training_level} />
            <DetailItem label="Etablissement de formation" value={submission.training_establishment} wide />
          </DetailSection>

          <DetailSection number={3} title="Activite actuelle" icon={BriefcaseBusiness}>
            <DetailItem label="Activite actuelle" value={submission.current_activity} />
            <DetailItem label="Autre activite" value={submission.current_activity_other} />
          </DetailSection>

          <DetailSection number={4} title="Objet de l inscription" icon={Lightbulb}>
            <DetailItem label="Interesse(e) par l employabilite" value={submission.interested_employability} type="boolean" />
            <DetailItem label="Interesse(e) par l entrepreneuriat" value={submission.interested_entrepreneurship} type="boolean" />
            <DetailItem label="Porteur d idee de projet" value={submission.has_project_idea} type="boolean" />
            <DetailItem label="Porteur de projet" value={submission.has_project} type="boolean" />
            <DetailItem label="Autre objectif d inscription" value={submission.registration_objective_other} wide />
            <DetailItem label="Description de l idee" value={submission.project_idea_description} wide />
            <DetailItem label="Description du projet" value={submission.project_description} wide />
          </DetailSection>

          <DetailSection number={5} title="Entreprise existante" icon={Building2}>
            <DetailItem label="A cree une entreprise" value={submission.has_created_company} type="boolean" />
            <DetailItem label="Statut juridique" value={submission.legal_status} />
            <DetailItem label="Autre statut juridique" value={submission.legal_status_other} />
            <DetailItem label="Activite de l entreprise" value={submission.company_activity} />
            <DetailItem label="Date de creation" value={submission.company_creation_date} type="date" />
            <DetailItem label="Entreprise active" value={submission.company_is_active} type="boolean" />
            <DetailItem label="Date de debut d activite" value={submission.activity_start_date} type="date" />
          </DetailSection>

          <DetailSection number={6} title="Accompagnement entrepreneurial" icon={Handshake}>
            <DetailItem label="Souhaite un accompagnement entrepreneurial" value={submission.interested_in_support} type="boolean" wide />
          </DetailSection>
        </main>

        <aside className="admin-review-panel">
          {isReadOnlyAdmin ? (
            <div className="admin-review-card">
              <div className="admin-review-heading"><span>Mode consultation</span><h2>Lecture seule</h2></div>
              <p className="text-tertiary text-sm">Ce compte peut consulter la fiche et son statut, mais ne peut pas modifier la decision, generer un lien ou contacter le candidat.</p>
            </div>
          ) : (
            <>
              <div className="admin-review-card">
                <div className="admin-review-heading"><span>Decision administrative</span><h2>Evaluation de la fiche</h2></div>
                <div className="admin-review-quick-actions">
                  <button type="button" className="is-review" onClick={() => saveReview('under_review')} disabled={isSaving}><Clock3 size={17} /> Mettre en etude</button>
                  <button type="button" className="is-accept" onClick={() => saveReview('selected')} disabled={isSaving}><CheckCircle2 size={17} /> Selectionner</button>
                  <button type="button" className="is-reject" onClick={() => saveReview('rejected')} disabled={isSaving}><XCircle size={17} /> Refuser</button>
                </div>
                <Select label="Statut de decision" value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: 'pending', label: 'En attente' }, { value: 'under_review', label: 'En etude' }, { value: 'selected', label: 'Selectionne' }, { value: 'rejected', label: 'Refuse' }]} />
                <Textarea label="Commentaire de l administration" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ajoutez vos retours, conseils ou motifs de decision..." rows={6} />
                <Button variant="primary" fullWidth onClick={() => saveReview()} isLoading={isSaving}>Enregistrer l evaluation</Button>
              </div>

              <div className="admin-review-card mt-4">
                <div className="admin-review-heading"><span>Compte stagiaire</span><h2>Invitation securisee</h2></div>
                <Button variant="secondary" fullWidth onClick={generateInvitation} isLoading={isGeneratingInvitation} disabled={submission.status !== 'selected'}><Link2 size={17} /> Generer le lien de creation de compte</Button>
                {invitationLink && <div className="admin-invitation-box"><span>Lien securise</span><code>{invitationLink}</code><Button variant="ghost" size="sm" onClick={copyInvitation}><Copy size={16} /> Copier</Button></div>}
                {whatsappUrl ? <a className="btn btn-primary w-full justify-center" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Contacter sur WhatsApp</a> : <p className="text-tertiary text-sm">Telephone non renseigne pour WhatsApp.</p>}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AdminSubmissionDetailPage;
