import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import api from '../../services/api';

const emptySubmission = (user) => ({
  full_name: user?.name || user?.fullName || '',
  cin: '',
  gender: '',
  birth_date: '',
  birth_place: '',
  family_status: '',
  current_address: '',
  email: user?.email || '',
  phone: user?.phone || '',
  education_level: '',
  has_diploma: '',
  diploma_specialty: '',
  diploma_year: '',
  diploma_establishment: '',
  is_ofppt_graduate: '',
  qualification_level: '',
  ofppt_specialty: '',
  ofppt_diploma_year: '',
  is_in_training: '',
  training_type: '',
  training_specialty: '',
  training_level: '',
  training_establishment: '',
  current_activity: '',
  current_activity_other: '',
  interested_employability: false,
  interested_entrepreneurship: false,
  has_project_idea: false,
  has_project: false,
  registration_objective_other: '',
  project_idea_description: '',
  project_description: '',
  has_created_company: false,
  legal_status: '',
  legal_status_other: '',
  company_activity: '',
  company_creation_date: '',
  company_is_active: false,
  activity_start_date: '',
  interested_in_support: false,
});

const requiredFields = [
  'full_name',
  'cin',
  'gender',
  'birth_date',
  'birth_place',
  'family_status',
  'current_address',
  'email',
  'phone',
  'education_level',
  'has_diploma',
  'is_ofppt_graduate',
  'is_in_training',
];

const fieldLabels = {
  full_name: 'Nom et prenom',
  cin: 'CIN',
  gender: 'Sexe',
  birth_date: 'Date de naissance',
  birth_place: 'Lieu de naissance',
  family_status: 'Situation familiale',
  current_address: 'Adresse actuelle',
  email: 'Email',
  phone: 'Telephone',
  education_level: "Niveau d'instruction",
  has_diploma: 'Diplome',
  diploma_specialty: 'Specialite du diplome',
  diploma_year: "Annee d'obtention",
  diploma_establishment: 'Etablissement',
  is_ofppt_graduate: 'Laureat OFPPT',
  qualification_level: 'Niveau de qualification',
  ofppt_specialty: 'Specialite OFPPT',
  ofppt_diploma_year: 'Annee du diplome OFPPT',
  is_in_training: 'Formation actuelle',
  training_type: 'Type de formation',
  training_specialty: 'Specialite de formation',
  training_level: 'Niveau de formation',
  training_establishment: 'Etablissement de formation',
  registration_objective: "Objet de l'inscription",
  project_idea_description: "Description de l'idee de projet",
  project_description: 'Description du projet',
};

const booleanOptions = [
  { value: true, label: 'Oui' },
  { value: false, label: 'Non' },
];

const toSelectOptions = (items) => items.map(([value, label]) => ({ value, label }));

const sectionBadge = (required) => (
  <span className={`ofppt-section-badge ${required ? 'is-required' : ''}`}>
    {required ? 'Obligatoire' : 'Facultatif'}
  </span>
);

const isEmpty = (value) => value === null || value === undefined || value === '';

const buildPayload = (formData) => ({
  ...formData,
  title: `Fiche OFPPT - ${formData.full_name}`,
  category: 'ofppt_registration',
  description: formData.project_description || formData.project_idea_description || 'Fiche inscription OFPPT',
});

const objectiveFields = [
  'interested_employability',
  'interested_entrepreneurship',
  'has_project_idea',
  'has_project',
];

const hasRegistrationObjective = (data) => (
  objectiveFields.some((field) => Boolean(data[field])) || !isEmpty(data.registration_objective_other)
);

const isObjectiveComplete = (data) => (
  hasRegistrationObjective(data)
  && (!data.has_project_idea || !isEmpty(data.project_idea_description))
  && (!data.has_project || !isEmpty(data.project_description))
);

const NewSubmissionPage = () => {
  const { currentUser } = useAuth();
  const { updateSubmission, getSubmission } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState(() => emptySubmission(currentUser));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState(null);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(Boolean(editId));

  useEffect(() => {
    if (!editId) {
      setFormData((previous) => ({
        ...previous,
        full_name: previous.full_name || currentUser?.name || currentUser?.fullName || '',
        email: previous.email || currentUser?.email || '',
        phone: previous.phone || currentUser?.phone || '',
      }));
      return;
    }

    let active = true;
    setIsLoadingSubmission(true);
    getSubmission(editId)
      .then((submission) => {
        if (!active) return;
        setFormData({
          ...emptySubmission(currentUser),
          ...Object.fromEntries(
            Object.entries(emptySubmission(currentUser)).map(([key, fallback]) => [
              key,
              submission[key] ?? fallback,
            ])
          ),
        });
      })
      .catch(() => {
        showToast({ title: 'Erreur', message: 'Impossible de charger la soumission.', type: 'error' });
        navigate('/dashboard/trainee/my-submissions');
      })
      .finally(() => {
        if (active) setIsLoadingSubmission(false);
      });

    return () => { active = false; };
  }, [currentUser, editId, getSubmission, navigate, showToast]);

  const completion = useMemo(() => {
    const completedFields = requiredFields.filter((field) => !isEmpty(formData[field])).length;
    const totalRequired = requiredFields.length + 1;
    const completed = completedFields + (isObjectiveComplete(formData) ? 1 : 0);
    return Math.round((completed / totalRequired) * 100);
  }, [formData]);

  const setField = (name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
      ...(objectiveFields.includes(name) || name === 'registration_objective_other' ? { registration_objective: undefined } : {}),
    }));
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setField(name, type === 'checkbox' ? checked : value);
  };

  const validate = () => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (isEmpty(formData[field])) {
        nextErrors[field] = `${fieldLabels[field]} est obligatoire.`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Veuillez saisir un email valide.';
    }

    if (formData.has_diploma === true) {
      ['diploma_specialty', 'diploma_year', 'diploma_establishment'].forEach((field) => {
        if (isEmpty(formData[field])) nextErrors[field] = `${fieldLabels[field]} est obligatoire.`;
      });
    }

    if (formData.is_ofppt_graduate === true) {
      ['qualification_level', 'ofppt_specialty', 'ofppt_diploma_year'].forEach((field) => {
        if (isEmpty(formData[field])) nextErrors[field] = `${fieldLabels[field]} est obligatoire.`;
      });
    }

    if (formData.is_in_training === true) {
      ['training_type', 'training_specialty', 'training_level', 'training_establishment'].forEach((field) => {
        if (isEmpty(formData[field])) nextErrors[field] = `${fieldLabels[field]} est obligatoire.`;
      });
    }

    if (!hasRegistrationObjective(formData)) {
      nextErrors.registration_objective = "Veuillez choisir au moins un objet d'inscription.";
    }

    if (formData.has_project_idea && isEmpty(formData.project_idea_description)) {
      nextErrors.project_idea_description = fieldLabels.project_idea_description + ' est obligatoire.';
    }

    if (formData.has_project && isEmpty(formData.project_description)) {
      nextErrors.project_description = fieldLabels.project_description + ' est obligatoire.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      showToast({ title: 'Erreur', message: 'Veuillez corriger les champs obligatoires.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload(formData);
      if (editId) {
        await updateSubmission(editId, payload);
        showToast({ title: 'Succes', message: 'Soumission modifiee avec succes.' });
        navigate('/dashboard/trainee/my-submissions');
      } else {
        const response = await api.post('/project-ideas', payload);
        const idea = response.data?.data ?? response.data;
        setSubmittedIdea(idea);
        showToast({ title: 'Succes', message: 'Idee envoyee avec succes.' });
      }
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        setErrors(Object.fromEntries(
          Object.entries(apiErrors).map(([field, messages]) => [field, messages[0]])
        ));
      }
      showToast({
        title: 'Erreur',
        message: error.response?.data?.message || 'Impossible d enregistrer la soumission.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioGroup = ({ name, label, options, required = false }) => (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="ofppt-radio-grid">
        {options.map((option) => (
          <label
            key={`${name}-${String(option.value)}`}
            className={`ofppt-radio ${formData[name] === option.value ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              checked={formData[name] === option.value}
              onChange={() => setField(name, option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  const OptionalSwitch = ({ name, label }) => (
    <label className="ofppt-switch">
      <input
        type="checkbox"
        name={name}
        checked={Boolean(formData[name])}
        onChange={handleInputChange}
      />
      <span>{label}</span>
    </label>
  );

  if (submittedIdea) {
    return (
      <div className="submission-form-container submit-public-page is-confirmation">
        <Card>
          <CardHeader title="Votre idee a ete recue" action={<span className="badge badge-pending">En attente</span>} />
          <CardBody>
            <p className="text-secondary mb-4">
              Conservez ce numero de suivi. Il permet de verifier la decision de l administration. Si votre idee est selectionnee, vous recevrez ensuite un lien securise par WhatsApp.
            </p>
            <div className="detail-item mb-6">
              <span className="detail-label">Numero de suivi</span>
              <span className="detail-value text-primary font-bold">{submittedIdea.tracking_code}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Retour a l accueil
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  if (isLoadingSubmission) {
    return <div className="text-center p-12 text-tertiary">Chargement de la soumission...</div>;
  }

  return (
    <form className="submission-form-container submit-public-page" onSubmit={handleSubmit}>
      <div className="ofppt-page-heading">
        <div>
          <div className="ofppt-eyebrow">Depot public</div>
          <h1 className="page-title">{editId ? 'Modifier la soumission' : 'Soumettre une idee de projet'}</h1>
          <p className="page-subtitle">Depot public traite par l administrateur de l incubateur</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(currentUser ? '/dashboard/trainee/my-submissions' : '/')} disabled={isSubmitting}>
          Annuler
        </Button>
      </div>

      <Card className="ofppt-progress-card">
        <CardBody>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-secondary">Progression des champs obligatoires</span>
            <strong className="text-primary">{completion}%</strong>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </CardBody>
      </Card>

      <div className="ofppt-sections-grid">
        <Card>
          <CardHeader title="1. Informations personnelles" action={sectionBadge(true)} />
          <CardBody>
            <div className="grid-2">
              <Input label="Nom et prenom" name="full_name" value={formData.full_name} onChange={handleInputChange} error={errors.full_name} required />
              <Input label="CIN" name="cin" value={formData.cin} onChange={handleInputChange} error={errors.cin} required />
              <RadioGroup
                name="gender"
                label="Sexe"
                required
                options={[
                  { value: 'male', label: 'Homme' },
                  { value: 'female', label: 'Femme' },
                ]}
              />
              <Input label="Date de naissance" name="birth_date" type="date" value={formData.birth_date} onChange={handleInputChange} error={errors.birth_date} required />
              <Input label="Lieu de naissance" name="birth_place" value={formData.birth_place} onChange={handleInputChange} error={errors.birth_place} required />
              <RadioGroup
                name="family_status"
                label="Situation familiale"
                required
                options={toSelectOptions([
                  ['single', 'Celibataire'],
                  ['married', 'Marie(e)'],
                  ['divorced', 'Divorce(e)'],
                  ['widowed', 'Veuf(ve)'],
                ])}
              />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} required />
              <Input label="Telephone" name="phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} required />
            </div>
            <Textarea label="Adresse actuelle" name="current_address" value={formData.current_address} onChange={handleInputChange} error={errors.current_address} rows={3} required />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="2. Niveau d'instruction" action={sectionBadge(true)} />
          <CardBody>
            <RadioGroup
              name="education_level"
              label="Niveau d'instruction"
              required
              options={toSelectOptions([
                ['primary', 'Primaire'],
                ['secondary', 'Secondaire'],
                ['baccalaureate', 'Bachelier'],
                ['higher_diploma', 'Diplome superieur'],
                ['ofppt_diploma', 'Diplome OFPPT'],
                ['none', 'Aucun'],
              ])}
            />
            <RadioGroup name="has_diploma" label="Avez-vous un diplome ?" options={booleanOptions} required />
            {formData.has_diploma === true && (
              <div className="grid-2">
                <Input label="Specialite du diplome" name="diploma_specialty" value={formData.diploma_specialty} onChange={handleInputChange} error={errors.diploma_specialty} required />
                <Input label="Annee d'obtention" name="diploma_year" type="number" value={formData.diploma_year} onChange={handleInputChange} error={errors.diploma_year} required />
                <Input label="Etablissement" name="diploma_establishment" value={formData.diploma_establishment} onChange={handleInputChange} error={errors.diploma_establishment} required />
              </div>
            )}

            <RadioGroup name="is_ofppt_graduate" label="Etes-vous laureat de l'OFPPT ?" options={booleanOptions} required />
            {formData.is_ofppt_graduate === true && (
              <div className="grid-2">
                <RadioGroup
                  name="qualification_level"
                  label="Niveau de qualification"
                  required
                  options={toSelectOptions([
                    ['TS', 'TS'],
                    ['T', 'T'],
                    ['Q', 'Q'],
                    ['S', 'S'],
                    ['FQ', 'FQ'],
                    ['FQ:PIE', 'FQ:PIE'],
                  ])}
                />
                <Input label="Specialite" name="ofppt_specialty" value={formData.ofppt_specialty} onChange={handleInputChange} error={errors.ofppt_specialty} required />
                <Input label="Annee d'obtention du diplome" name="ofppt_diploma_year" type="number" value={formData.ofppt_diploma_year} onChange={handleInputChange} error={errors.ofppt_diploma_year} required />
              </div>
            )}

            <RadioGroup name="is_in_training" label="Etes-vous en formation ?" options={booleanOptions} required />
            {formData.is_in_training === true && (
              <div className="grid-2">
                <RadioGroup
                  name="training_type"
                  label="Type de formation"
                  required
                  options={toSelectOptions([
                    ['ofppt_trainee', "Stagiaire de l'OFPPT"],
                    ['outside_ofppt', 'Hors OFPPT'],
                    ['FQ:PIE', 'FQ:PIE'],
                  ])}
                />
                <Input label="Specialite" name="training_specialty" value={formData.training_specialty} onChange={handleInputChange} error={errors.training_specialty} required />
                <Input label="Niveau de formation" name="training_level" value={formData.training_level} onChange={handleInputChange} error={errors.training_level} required />
                <Input label="Etablissement" name="training_establishment" value={formData.training_establishment} onChange={handleInputChange} error={errors.training_establishment} required />
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="3. Activite actuelle" action={sectionBadge(false)} />
          <CardBody>
            <div className="grid-2">
              <RadioGroup
                name="current_activity"
                label="Activite actuelle"
                options={toSelectOptions([
                  ['in_training', 'En cours de formation'],
                  ['job_seeker', "Chercheur d'emploi"],
                  ['employee', 'Salarie(e) / Employe(e)'],
                  ['entrepreneur', 'Entrepreneur'],
                  ['informal', 'Informel'],
                  ['neet', 'NEET'],
                  ['other', 'Autres'],
                ])}
              />
              <Input label="Autres, preciser" name="current_activity_other" value={formData.current_activity_other} onChange={handleInputChange} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="4. Objet de l'inscription" action={sectionBadge(true)} />
          <CardBody>
            <div className="grid-2">
              <OptionalSwitch name="interested_employability" label="Interesse(e) par l'employabilite" />
              <OptionalSwitch name="interested_entrepreneurship" label="Interesse(e) par l'entrepreneuriat" />
              <OptionalSwitch name="has_project_idea" label="Porteur d'idee de projet" />
              <OptionalSwitch name="has_project" label="Porteur de projet" />
            </div>
            {errors.registration_objective && <div className="form-error ofppt-section-error">{errors.registration_objective}</div>}
            <Textarea label="Autres, preciser" name="registration_objective_other" value={formData.registration_objective_other} onChange={handleInputChange} rows={2} />
            <Textarea
              label="Decrire brievement votre idee de projet"
              name="project_idea_description"
              value={formData.project_idea_description}
              onChange={handleInputChange}
              error={errors.project_idea_description}
              rows={3}
              required={formData.has_project_idea}
            />
            <Textarea
              label="Decrire brievement votre projet"
              name="project_description"
              value={formData.project_description}
              onChange={handleInputChange}
              error={errors.project_description}
              rows={3}
              required={formData.has_project}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="5. Entreprise existante" action={sectionBadge(false)} />
          <CardBody>
            <RadioGroup name="has_created_company" label="Avez-vous cree une entreprise ?" options={booleanOptions} />
            {formData.has_created_company === true && (
              <div className="grid-2">
                <RadioGroup
                  name="legal_status"
                  label="Statut juridique"
                  options={toSelectOptions([
                    ['auto_entrepreneur', 'Auto-entrepreneur'],
                    ['legal_entity', 'Personne morale'],
                    ['cooperative', 'Cooperative'],
                    ['individual', 'Personne physique'],
                    ['other', 'Autre'],
                  ])}
                />
                <Input label="Autres, preciser" name="legal_status_other" value={formData.legal_status_other} onChange={handleInputChange} />
                <Input label="Activite de l'entreprise" name="company_activity" value={formData.company_activity} onChange={handleInputChange} />
                <Input label="Date de creation" name="company_creation_date" type="date" value={formData.company_creation_date} onChange={handleInputChange} />
                <RadioGroup name="company_is_active" label="Entreprise active ?" options={booleanOptions} />
                <Input label="Date de debut d'activite" name="activity_start_date" type="date" value={formData.activity_start_date} onChange={handleInputChange} />
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="6. Accompagnement entrepreneurial" action={sectionBadge(false)} />
          <CardBody>
            <RadioGroup name="interested_in_support" label="Souhaitez-vous un accompagnement entrepreneurial ?" options={booleanOptions} />
          </CardBody>
        </Card>
      </div>

      <div className="ofppt-form-actions">
        <Button variant="ghost" onClick={() => navigate(currentUser ? '/dashboard/trainee/my-submissions' : '/')} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          {editId ? 'Enregistrer les modifications' : 'Envoyer mon idee'}
        </Button>
      </div>
    </form>
  );
};

export default NewSubmissionPage;




