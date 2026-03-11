import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import { USERS } from '../../data/users';
import { Tabs, TabPanel } from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../components/ui/Toast';

const STATUS_OPTIONS = [
  { value: 'received', label: 'Marquer comme Reçu', color: 'var(--color-info)' },
  { value: 'under_review', label: 'En cours d\'évaluation', color: 'var(--color-warning)' },
  { value: 'requires_changes', label: 'Demander des modifications', color: 'var(--color-danger)' },
  { value: 'accepted', label: 'Accepter le projet', color: 'var(--color-success)' },
  { value: 'rejected', label: 'Rejeter le projet', color: 'var(--color-danger)' },
  { value: 'archived', label: 'Archiver', color: 'var(--color-text-tertiary)' },
];

const AdminSubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submissions, categories, programs, comments, statusHistory, addComment, changeSubmissionStatus } = useAppData();
  const { showToast } = useToast();

  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submission = submissions.find(s => s.id === id);

  if (!submission) {
    return (
      <div className="text-center p-12">
        <h2 className="text-h2 mb-4">Projet Introuvable</h2>
        <Button onClick={() => navigate('/dashboard/admin/submissions')}>Retour à la liste</Button>
      </div>
    );
  }

  const trainee = USERS.find(u => u.id === submission.userId);
  const category = categories.find(c => c.id === submission.category);
  const program = programs.find(p => p.id === submission.program);
  
  const projectComments = comments.filter(c => c.submissionId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const projectHistory = statusHistory.filter(h => h.submissionId === id).sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

  const handleSaveEvaluation = async () => {
    setIsSubmitting(true);
    try {
      let isSuccess = false;
      // If a new status is selected and it's different from the current one
      if (selectedStatus && selectedStatus !== submission.status) {
        await changeSubmissionStatus(id, selectedStatus);
        isSuccess = true;
      }
      
      // If there's a comment
      if (newComment.trim()) {
        await addComment(id, newComment);
        setNewComment('');
        isSuccess = true;
      }

      if (isSuccess) {
        setSelectedStatus(''); // reset
        showToast({ title: 'Succès', message: 'Évaluation enregistrée avec succès.' });
      } else {
         showToast({ title: 'Info', message: 'Aucune modification apportée.', type: 'info' });
      }
    } catch (err) {
      showToast({ title: 'Erreur', message: 'Échec de l\'enregistrement.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="mb-6">
        <button className="text-secondary text-sm mb-2 hover:text-primary transition-colors flex items-center gap-1" onClick={() => navigate('/dashboard/admin/submissions')}>
          ← Retour aux soumissions
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="page-title mb-0">{submission.title}</h1>
            <Badge status={submission.status} />
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{trainee?.fullName}</div>
            <div className="text-xs text-secondary">CEF: {trainee?.cef}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & History */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Tabs defaultActive="project">
            <TabPanel value="project" label="Détails du projet">
              <Card>
                <CardBody className="flex flex-col gap-6">
                  <div className="details-grid pb-6 border-b border-border">
                    <div className="detail-item">
                      <span className="detail-label">Catégorie</span>
                      <span className="detail-value flex items-center gap-2">
                        {category?.icon} {category?.name}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Filière</span>
                      <span className="detail-value">{program?.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">{submission.projectType === 'team' ? 'En Équipe' : 'Individuel'}</span>
                    </div>
                     <div className="detail-item">
                      <span className="detail-label">Soumis le</span>
                      <span className="detail-value text-secondary">
                         {new Date(submission.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* Fields */}
                  <div>
                    <h3 className="text-h3 text-primary mb-2">Résumé</h3>
                    <p className="text-sm text-body whitespace-pre-wrap">{submission.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                     <div>
                      <h4 className="font-semibold text-danger mb-2 text-sm">Problème</h4>
                      <p className="text-sm text-secondary whitespace-pre-wrap">{submission.problem}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-success mb-2 text-sm">Solution</h4>
                      <p className="text-sm text-secondary whitespace-pre-wrap">{submission.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Objectifs</h4>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.objectives || '-'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Innovation</h4>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.innovation || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                     <div>
                      <h4 className="font-semibold mb-1 text-sm">Membres de l'équipe</h4>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.teamMembers}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Compétences</h4>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.skills}</p>
                    </div>
                  </div>

                   <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold mb-2 text-sm">Accompagnement souhaité</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.supportNeeds.map(need => (
                          <Badge key={need} className="bg-surface-hover text-primary border-primary-dim">{need.replace('_', ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel value="attachments" label={`Pièces jointes (${submission.attachments.length})`}>
              <Card>
                <CardBody>
                  {submission.attachments.length > 0 ? (
                    <div className="file-list m-0">
                      {submission.attachments.map((file, idx) => (
                        <div key={idx} className="file-item hover:border-primary transition-colors cursor-pointer">
                          <div className="file-info">
                            <span className="file-icon flex items-center text-primary">
                              {file.name.endsWith('.pdf') ? (
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              ) : (
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              )}
                            </span>
                            <div>
                              <div className="file-name">{file.name}</div>
                              <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Télécharger</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-tertiary">
                      Aucune pièce jointe.
                    </div>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel value="history" label="Historique complet">
              <Card>
                <CardBody>
                   {projectHistory.length > 0 ? (
                    <div className="timeline">
                      {projectHistory.map(activity => (
                        <div className="timeline-item" key={activity.id}>
                          <div className={`timeline-icon ${activity === projectHistory[0] ? 'active' : ''}`}></div>
                          <div className="timeline-content">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge status={activity.fromStatus} />
                              <span className="text-secondary text-xs">→</span>
                              <Badge status={activity.toStatus} />
                            </div>
                            <p className="timeline-meta">
                              {activity.changedBy} • {new Date(activity.changedAt).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-tertiary text-sm py-4">Aucun historique disponible.</p>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </Tabs>
        </div>

        {/* Right Column - Evaluation Panel */}
        <div>
          <div className="review-panel">
            <Card>
              <CardHeader title="Évaluation & Feedback" />
              <CardBody>
                {/* Chat History summary */}
                 <div className="comment-list mb-6" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                  {projectComments.length > 0 ? (
                    projectComments.map(comment => (
                      <div key={comment.id} className={`comment-item ${comment.authorRole === 'admin' ? 'is-me' : ''}`}>
                        <div className="comment-body">
                          <div className="comment-header">
                            <span className="comment-author">{comment.authorName}</span>
                            <span className="comment-date text-xs">
                              {new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <p className="comment-text text-xs">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-tertiary text-sm py-2">Aucun message précédent.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm mb-3">Nouvelle action</h4>
                  
                  <div className="mb-4">
                    {STATUS_OPTIONS.map(opt => {
                      // Don't show options that don't make sense (like moving back to draft)
                      if (submission.status === opt.value) return null;
                      return (
                        <label 
                          key={opt.value} 
                          className={`status-option ${selectedStatus === opt.value ? 'selected' : ''}`}
                        >
                          <input 
                            type="radio" 
                            name="statusUpdate" 
                            value={opt.value} 
                            checked={selectedStatus === opt.value}
                            onChange={() => setSelectedStatus(opt.value)}
                          />
                          <span style={{ color: opt.color, fontWeight: '500', fontSize: '0.875rem' }}>
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <Textarea 
                    placeholder="Ajouter un commentaire pour le stagiaire (optionnel, mais recommandé pour rejets/modifs)..." 
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    containerClass="mb-4"
                  />
                  
                  <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={handleSaveEvaluation}
                    disabled={(!newComment.trim() && !selectedStatus) || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Enregistrer l'évaluation
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionDetailPage;
