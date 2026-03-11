import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import { useToast } from '../../components/ui/Toast';
import Stepper from '../../components/ui/Stepper';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';

const STEPS = [
  'Général',
  'Description',
  'Marché',
  'Équipe & Besoins',
  'Pièces jointes',
  'Révision'
];

const INIT_FORM = {
  title: '', category: '', sector: '', program: '', projectType: 'individual',
  summary: '', problem: '', solution: '', objectives: '', innovation: '',
  targetAudience: '', marketNeed: '', existingAlternatives: '', differentiation: '',
  teamMembers: '', skills: '', supportNeeds: [],
  attachments: []
};

const NewSubmissionPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INIT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { categories, programs, addSubmission } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentArr = formData[name] || [];
      const newArr = checked 
        ? [...currentArr, value] 
        : currentArr.filter(item => item !== value);
      setFormData({ ...formData, [name]: newArr });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files || []);
    const newAttachments = files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    }));
    setFormData({ 
      ...formData, 
      attachments: [...formData.attachments, ...newAttachments] 
    });
  };

  const removeFile = (index) => {
    const updated = [...formData.attachments];
    updated.splice(index, 1);
    setFormData({ ...formData, attachments: updated });
  };

  // Very basic validation per step to unblock UX but ensure required fields
  const validateStep = (step) => {
    switch(step) {
      case 0: return formData.title && formData.category && formData.sector && formData.program;
      case 1: return formData.summary && formData.problem && formData.solution;
      case 2: return formData.targetAudience && formData.marketNeed;
      case 3: return formData.teamMembers && formData.skills;
      default: return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo(0, 0);
    } else {
      showToast({ title: 'Erreur', message: 'Veuillez remplir tous les champs obligatoires.', type: 'error' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      if (!formData.title) {
        showToast({ title: 'Erreur', message: 'Le titre du projet est requis pour sauvegarder un brouillon.', type: 'error' });
        setIsSubmitting(false);
        return;
      }
      await addSubmission(formData, true);
      showToast({ title: 'Succès', message: 'Brouillon sauvegardé avec succès.' });
      navigate('/dashboard/trainee/my-submissions');
    } catch (err) {
      showToast({ title: 'Erreur', message: 'Échec de la sauvegarde.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addSubmission(formData, false);
      showToast({ title: 'Succès', message: 'Projet soumis avec succès à l\'évaluation.' });
      navigate('/dashboard/trainee/my-submissions');
    } catch (err) {
      showToast({ title: 'Erreur', message: 'Échec de la soumission.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendeding sub-components for steps
  const renderStep0 = () => (
    <div className="animate-fade-in">
      <h3 className="text-h3 mb-6">Informations Générales</h3>
      <div className="grid-2">
        <Input 
          label="Titre du projet" 
          name="title" 
          value={formData.title} 
          onChange={handleInputChange} 
          required 
          placeholder="Ex: Smart AgroTech" 
        />
        <Select 
          label="Catégorie" 
          name="category" 
          value={formData.category} 
          onChange={handleInputChange} 
          required
          options={categories.map(c => ({ value: c.id, label: `${c.name}` }))}
        />
        <Input 
          label="Secteur d'activité" 
          name="sector" 
          value={formData.sector} 
          onChange={handleInputChange} 
          required 
          placeholder="Ex: Agriculture, Santé..." 
        />
        <Select 
          label="Filière (Votre programme)" 
          name="program" 
          value={formData.program} 
          onChange={handleInputChange} 
          required
          options={programs.map(p => ({ value: p.id, label: p.name }))}
        />
      </div>
      <div className="mt-4">
        <label className="form-label mb-2 block">Type de projet</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 border border-border rounded-lg" style={{ background: formData.projectType === 'individual' ? 'var(--color-primary-dim)' : 'var(--color-surface)', borderColor: formData.projectType === 'individual' ? 'var(--color-primary)' : 'var(--color-border)' }}>
            <input type="radio" name="projectType" value="individual" checked={formData.projectType === 'individual'} onChange={handleInputChange} />
            Individuel
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 border border-border rounded-lg" style={{ background: formData.projectType === 'team' ? 'var(--color-primary-dim)' : 'var(--color-surface)', borderColor: formData.projectType === 'team' ? 'var(--color-primary)' : 'var(--color-border)' }}>
            <input type="radio" name="projectType" value="team" checked={formData.projectType === 'team'} onChange={handleInputChange} />
            En Équipe
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h3 className="text-h3 mb-6">Description du Projet</h3>
      <Textarea label="Résumé exécutif" name="summary" value={formData.summary} onChange={handleInputChange} required placeholder="Décrivez votre projet en quelques phrases..." rows={3} />
      <Textarea label="Problème identifié" name="problem" value={formData.problem} onChange={handleInputChange} required placeholder="Quel problème essayez-vous de résoudre ?" rows={3} />
      <Textarea label="Solution proposée" name="solution" value={formData.solution} onChange={handleInputChange} required placeholder="Comment votre projet résout-il ce problème ?" rows={3} />
      <div className="grid-2">
        <Textarea label="Objectifs" name="objectives" value={formData.objectives} onChange={handleInputChange} placeholder="Quels sont les objectifs clés ?" rows={3} />
        <Textarea label="Innovation / Valeur ajoutée" name="innovation" value={formData.innovation} onChange={handleInputChange} placeholder="En quoi votre solution est-elle innovante ?" rows={3} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <h3 className="text-h3 mb-6">Marché & Bénéficiaires</h3>
      <Textarea label="Public cible / Bénéficiaires" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} required placeholder="À qui s'adresse ce projet ?" rows={3} />
      <Textarea label="Besoin du marché" name="marketNeed" value={formData.marketNeed} onChange={handleInputChange} required placeholder="Prouvez qu'il y a une demande réelle." rows={3} />
      <div className="grid-2">
        <Textarea label="Alternatives existantes" name="existingAlternatives" value={formData.existingAlternatives} onChange={handleInputChange} placeholder="Qui sont vos concurrents ?" rows={3} />
        <Textarea label="Différenciation" name="differentiation" value={formData.differentiation} onChange={handleInputChange} placeholder="Pourquoi vous choisirait-on ?" rows={3} />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
      <h3 className="text-h3 mb-6">Équipe & Besoins d'accompagnement</h3>
      <Textarea label="Membres de l'équipe et Rôles" name="teamMembers" value={formData.teamMembers} onChange={handleInputChange} required placeholder="Lister les prénoms et rôles de chacun..." rows={3} />
      <Textarea label="Compétences existantes" name="skills" value={formData.skills} onChange={handleInputChange} required placeholder="Ex: Développement Web, Design, Marketing..." rows={2} />
      
      <div className="mt-6">
        <label className="form-label mb-2 block text-md">De quel type d'accompagnement avez-vous besoin ?</label>
        <div className="grid-2">
          {['mentoring', 'technical support', 'funding guidance', 'networking', 'training'].map((need) => (
            <label key={need} className="flex items-center gap-2 p-3 bg-surface border border-border rounded-lg cursor-pointer hover:border-primary">
              <input type="checkbox" name="supportNeeds" value={need} checked={formData.supportNeeds.includes(need)} onChange={handleInputChange} />
              <span className="capitalize">{need.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-fade-in">
      <h3 className="text-h3 mb-6">Pièces jointes <span className="text-sm font-normal text-secondary">(Optionnel)</span></h3>
      <p className="text-body mb-4">Uploadez votre Pitch Deck, Business Plan ou Maquettes (Front-end only simulation).</p>
      
      <div 
        className="upload-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => document.getElementById('fileUpload').click()}
      >
        <input 
          id="fileUpload" 
          type="file" 
          multiple 
          accept=".pdf,.png,.jpg,.jpeg" 
          style={{ display: 'none' }} 
          onChange={handleFileDrop}
        />
        <div className="upload-icon flex justify-center text-primary mb-4">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-body font-medium">Glissez et déposez vos fichiers ici</p>
        <p className="text-sm text-tertiary mt-2">ou cliquez pour parcourir (Max 10MB)</p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge>PDF</Badge>
          <Badge>PNG</Badge>
          <Badge>JPG</Badge>
        </div>
      </div>

      {formData.attachments.length > 0 && (
        <div className="file-list">
          {formData.attachments.map((file, idx) => (
            <div key={idx} className="file-item">
              <div className="file-info">
                <span className="file-icon flex items-center text-primary">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <button type="button" className="btn btn-ghost btn-icon text-danger" onClick={() => removeFile(idx)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="animate-fade-in">
      <h3 className="text-h3 mb-6">Révision finale</h3>
      
      <div className="p-6 bg-surface border border-border rounded-lg mb-6">
        <h4 className="text-xl font-bold mb-4">{formData.title || 'Sans titre'}</h4>
        
        <div className="details-grid mb-6">
          <div className="detail-item">
            <span className="detail-label">Catégorie</span>
            <span className="detail-value">{categories.find(c => c.id === formData.category)?.name || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Secteur</span>
            <span className="detail-value">{formData.sector || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Filière</span>
            <span className="detail-value">{programs.find(p => p.id === formData.program)?.name || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Type</span>
            <span className="detail-value">{formData.projectType === 'team' ? 'En équipe' : 'Individuel'}</span>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="font-semibold text-primary mb-2">Résumé exécutif</h5>
          <p className="text-body text-sm">{formData.summary}</p>
        </div>
        
        <div className="mb-4">
          <h5 className="font-semibold text-secondary mb-2">Besoins demandés</h5>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.supportNeeds.map(need => (
              <Badge key={need}>{need.replace('_', ' ')}</Badge>
            ))}
            {formData.supportNeeds.length === 0 && <span className="text-tertiary text-sm">Aucun besoin spécifié</span>}
          </div>
        </div>
        
        <div>
          <h5 className="font-semibold mb-2">Pièces jointes</h5>
          <p className="text-body text-sm">{formData.attachments.length} fichier(s) attaché(s)</p>
        </div>
      </div>
      
      <div className="p-4 bg-info-bg border border-info-border rounded-lg flex gap-4 mt-6">
        <div className="text-info pt-1">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-info mb-1">Prêt à soumettre ?</h4>
          <p className="text-sm text-body">
            En soumettant ce projet, il sera envoyé à l'administration pour évaluation. 
            Vous pouvez également le sauvegarder en tant que brouillon pour le compléter plus tard.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="submission-form-container pb-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="page-title">Nouvelle Soumission</h1>
          <p className="page-subtitle">Remplissez les informations de votre idée de projet</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/dashboard/trainee')}>
          Annuler
        </Button>
      </div>

      <Stepper steps={STEPS} currentStep={currentStep} />

      <div className="form-step-content relative">
        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        
        <div className="form-actions">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 0 || isSubmitting}
          >
            ← Précédent
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Sauvegarder Brouillon
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button variant="primary" onClick={nextStep} disabled={isSubmitting}>
                Suivant →
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
                Soumettre le Projet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSubmissionPage;
