import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabPanel } from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../components/ui/Toast';

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submissions, categories, programs, comments, statusHistory, addComment, changeSubmissionStatus } = useAppData();
  const { showToast } = useToast();

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const submission = submissions.find(s => s.id === id);

  if (!submission) {
    return (
      <div className="text-center p-12">
        <h2 className="text-h2 mb-4">Projet Introuvable</h2>
        <Button onClick={() => navigate('/dashboard/trainee/my-submissions')}>Retour aux projets</Button>
      </div>
    );
  }

  // Security check: Only author can view
  if (submission.userId !== currentUser.id) {
    navigate('/unauthorized');
    return null;
  }

  const category = categories.find(c => c.id === submission.category);
  const program = programs.find(p => p.id === submission.program);
  const projectComments = comments.filter(c => c.submissionId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const projectHistory = statusHistory.filter(h => h.submissionId === id).sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

  const canEdit = ['draft', 'requires_changes'].includes(submission.status);
  const canResubmit = submission.status === 'requires_changes';

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      await addComment(id, newComment);
      setNewComment('');
      showToast({ title: 'Succès', message: 'Commentaire ajouté.' });
    } catch (err) {
      showToast({ title: 'Erreur', message: 'Impossible d\'ajouter le commentaire.', type: 'error' });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleResubmit = async () => {
    try {
      await changeSubmissionStatus(id, 'revised');
      showToast({ title: 'Projet Soumis', message: 'Le projet a été renvoyé pour réévaluation.' });
    } catch (err) {
      showToast({ title: 'Erreur', message: 'Échec de la soumission.', type: 'error' });
    }
  };

  const handleSubmitDraft = async () => {
    try {
      await changeSubmissionStatus(id, 'submitted');
      showToast({ title: 'Projet Soumis', message: 'Le projet brouillon a été soumis.' });
    } catch (err) {
      showToast({ title: 'Erreur', message: 'Échec de la soumission.', type: 'error' });
    }
  };

  return (
    <div className="pb-12">
      <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <button className="text-secondary text-sm mb-2 hover:text-primary transition-colors flex items-center gap-1" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="page-title mb-0">{submission.title}</h1>
            <Badge status={submission.status} />
          </div>
          <p className="text-sm text-secondary">
            Créé le {new Date(submission.createdAt).toLocaleDateString('fr-FR')} 
            <span className="mx-2">•</span> 
            Dernière MAJ: {new Date(submission.updatedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Button variant="secondary" onClick={() => showToast({ title: 'Info', message: 'Édition non implémentée pour la démo, mais disponible dans une vraie application.', type: 'info' })}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Éditer le projet
            </Button>
          )}
          {canResubmit && (
            <Button variant="primary" onClick={handleResubmit}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Soumettre les corrections
            </Button>
          )}
          {submission.status === 'draft' && (
            <Button variant="primary" onClick={handleSubmitDraft}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Soumettre pour évaluation
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Tabs defaultActive="details">
            <TabPanel value="details" label="Détails du projet">
              <Card>
                <CardBody className="flex flex-col gap-6">
                  {/* Metadata Row */}
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
                      <span className="detail-label">Secteur</span>
                      <span className="detail-value">{submission.sector || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">{submission.projectType === 'team' ? 'En Équipe' : 'Individuel'}</span>
                    </div>
                  </div>

                  {/* Sections */}
                  <div>
                    <h3 className="text-h3 text-primary mb-2">Résumé</h3>
                    <p className="text-body whitespace-pre-wrap">{submission.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-h3 text-primary mb-2">Problème & Solution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-active rounded-lg border border-border">
                        <h4 className="font-semibold text-danger mb-2">Problème</h4>
                        <p className="text-sm text-secondary whitespace-pre-wrap">{submission.problem}</p>
                      </div>
                      <div className="p-4 bg-surface-active rounded-lg border border-border">
                        <h4 className="font-semibold text-success mb-2">Solution</h4>
                        <p className="text-sm text-secondary whitespace-pre-wrap">{submission.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Objectifs</h3>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.objectives || '-'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Innovation</h3>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.innovation || '-'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Marché Cible</h3>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.targetAudience}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Besoin du Marché</h3>
                      <p className="text-sm text-body whitespace-pre-wrap">{submission.marketNeed}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-h3 text-primary mb-4">Équipe & Besoins</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">Membres</h4>
                        <p className="text-sm text-body whitespace-pre-wrap">{submission.teamMembers}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Compétences</h4>
                        <p className="text-sm text-body whitespace-pre-wrap">{submission.skills}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Accompagnement souhaité</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.supportNeeds.map(need => (
                          <Badge key={need} className="bg-surface-hover text-primary border-primary-dim">{need.replace('_', ' ')}</Badge>
                        ))}
                      </div>
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
          </Tabs>
        </div>

        {/* Right Column - Communications & Status */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Échanges avec l'Administration" />
            <CardBody>
              <div className="comment-list" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                {projectComments.length > 0 ? (
                  projectComments.map(comment => (
                    <div key={comment.id} className={`comment-item ${comment.authorRole === 'trainee' ? 'is-me' : ''}`}>
                      <div className="comment-avatar">
                        {comment.authorName.charAt(0)}
                      </div>
                      <div className="comment-body">
                        <div className="comment-header">
                          <span className="comment-author">{comment.authorName}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-tertiary text-sm py-4">Aucun message pour le moment.</p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <Textarea 
                  placeholder="Écrire un message à l'administration..." 
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  containerClass="mb-2"
                />
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={handleSendComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                >
                  Envoyer
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Historique du statut" />
            <CardBody>
              {projectHistory.length > 0 ? (
                <div className="timeline">
                  {projectHistory.map(activity => (
                    <div className="timeline-item" key={activity.id}>
                      <div className={`timeline-icon ${activity === projectHistory[0] ? 'active' : ''}`}></div>
                      <div className="timeline-content">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge status={activity.toStatus} />
                        </div>
                        <p className="timeline-meta">
                          {activity.changedBy} • {new Date(activity.changedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Creating initial draft is the starting point implied but not explicitly in history sometimes, adding it implicitly */}
                  <div className="timeline-item">
                    <div className="timeline-icon text-[10px] flex items-center justify-center text-tertiary"></div>
                    <div className="timeline-content">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge status="draft" />
                      </div>
                      <p className="timeline-meta">
                        {submission.userId === currentUser.id ? currentUser.fullName : 'Stagiaire'} • {new Date(submission.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-tertiary text-sm py-4">Aucun historique disponible.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
