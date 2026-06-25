import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardList, Save, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const taskStatuses = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
];

const evaluationCriteria = [
  { id: 'digital_text', module: 'M3. Digital skills', label: 'Savoir utiliser les fonctions avancées du traitement du texte' },
  { id: 'digital_spreadsheet', module: 'M3. Digital skills', label: 'Savoir utiliser les fonctions avancées du tableur' },
  { id: 'digital_powerpoint', module: 'M3. Digital skills', label: 'Savoir utiliser les fonctions avancées du PowerPoint' },
  { id: 'digital_web', module: 'M3. Digital skills', label: 'Savoir utiliser des outils de navigation, recherche et messagerie sur Internet' },
  { id: 'marketing_market', module: 'M4. Stratégie marketing', label: 'Savoir caractériser le marché' },
  { id: 'marketing_tools', module: 'M4. Stratégie marketing', label: 'Connaissance des outils et méthodes du marketing étude (PESTEL, SWOT, 5 forces de Porter)' },
  { id: 'marketing_customer', module: 'M4. Stratégie marketing', label: 'Savoir analyser et préciser la clientèle' },
  { id: 'marketing_competition', module: 'M4. Stratégie marketing', label: 'Savoir identifier la concurrence' },
  { id: 'marketing_product', module: 'M4. Stratégie marketing', label: 'Savoir définir son produit / service' },
  { id: 'marketing_mix', module: 'M4. Stratégie marketing', label: 'Connaissance de base en marketing mix' },
  { id: 'soft_communicate', module: 'M1. SoftSkills - Communication', label: 'Savoir communiquer efficacement' },
  { id: 'soft_convince', module: 'M1. SoftSkills - Communication', label: 'Savoir convaincre' },
  { id: 'soft_persuade', module: 'M1. SoftSkills - Communication', label: 'Savoir persuader' },
  { id: 'technical_process', module: 'M5. Aspects techniques du projet 360°', label: 'Savoir élaborer les processus' },
  { id: 'technical_resources', module: 'M5. Aspects techniques du projet 360°', label: 'Savoir identifier les moyens d’exploitation (terrain/local, ressources matérielles et humaines)' },
  { id: 'technical_stock', module: 'M5. Aspects techniques du projet 360°', label: 'Savoir gérer le stock' },
  { id: 'technical_suppliers', module: 'M5. Aspects techniques du projet 360°', label: 'Savoir identifier les fournisseurs et sous-traitants' },
  { id: 'technical_quality', module: 'M5. Aspects techniques du projet 360°', label: 'Savoir contrôler la qualité et la sécurité' },
  { id: 'technical_technology', module: 'M5. Aspects techniques du projet 360°', label: 'Savoir identifier les technologies envisagées' },
  { id: 'leadership_integrity', module: 'M1. SoftSkills - Leadership responsable', label: 'Comprendre les comportements d’intégrité, honnêteté, responsabilité, courage et engagement' },
  { id: 'leadership_environment', module: 'M1. SoftSkills - Leadership responsable', label: 'Reconnaître des comportements respectueux de l’environnement par les entreprises' },
  { id: 'leadership_qualities', module: 'M1. SoftSkills - Leadership responsable', label: 'Connaître les qualités du leader' },
  { id: 'leadership_vision', module: 'M1. SoftSkills - Leadership responsable', label: 'Pouvoir définir sa vision du leader' },
  { id: 'legal_statuses', module: 'M6. Aspects juridiques et fiscaux', label: 'Connaissance des différents statuts juridiques' },
  { id: 'legal_tax', module: 'M6. Aspects juridiques et fiscaux', label: 'Connaissance de base en fiscalité' },
  { id: 'legal_ip', module: 'M6. Aspects juridiques et fiscaux', label: 'Prise de conscience de la protection de la propriété intellectuelle' },
  { id: 'finance_plan', module: 'M7. Plan financier', label: 'Compréhension des éléments constitutifs du plan financier (bilan, compte de résultat, plan de trésorerie)' },
  { id: 'finance_investment', module: 'M7. Plan financier', label: 'Savoir élaborer le programme d’investissement' },
  { id: 'finance_funding_methods', module: 'M7. Plan financier', label: 'Connaître les modalités de financement' },
  { id: 'finance_funding_plan', module: 'M7. Plan financier', label: 'Savoir élaborer le plan de financement' },
  { id: 'finance_revenue', module: 'M7. Plan financier', label: 'Savoir estimer le chiffre d’affaires' },
  { id: 'finance_costs', module: 'M7. Plan financier', label: 'Savoir estimer les charges prévisionnelles' },
  { id: 'finance_income_statement', module: 'M7. Plan financier', label: 'Savoir établir le compte d’exploitation prévisionnel' },
];

const emptyTask = { title: '', description: '', due_date: '' };
const formatDate = (value) => value ? new Date(value).toLocaleDateString('fr-FR') : 'Non renseignée';

export default function AdminAcceptedProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [savingTask, setSavingTask] = useState(false);
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState('');

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await api.get('/admin/accepted-projects/' + id);
      const data = response.data?.data ?? response.data;
      setProject(data);
      setScores(data.evaluation?.scores ?? {});
      setNotes(data.evaluation?.notes ?? '');
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const tasks = Array.isArray(project?.tasks) ? project.tasks : [];
  const projectName = project?.latest_account_request?.project_name || project?.title || 'Projet accepté';

  const totals = useMemo(() => {
    const values = evaluationCriteria.map((criterion) => scores[criterion.id]).filter((value) => value !== '' && value !== undefined && value !== null).map(Number);
    const total = values.reduce((sum, value) => sum + value, 0);
    return { total, count: values.length, average: values.length ? (total / values.length).toFixed(2) : '0.00' };
  }, [scores]);

  const addTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title.trim()) return;
    setSavingTask(true);
    try {
      const response = await api.post(`/admin/accepted-projects/${id}/tasks`, taskForm);
      const task = response.data?.data ?? response.data;
      setProject((current) => ({ ...current, tasks: [task, ...(current.tasks ?? [])] }));
      setTaskForm(emptyTask);
    } finally {
      setSavingTask(false);
    }
  };

  const updateTaskStatus = async (task, status) => {
    const response = await api.patch('/admin/project-tasks/' + task.id, { status });
    const updated = response.data?.data ?? response.data;
    setProject((current) => ({ ...current, tasks: (current.tasks ?? []).map((item) => item.id === updated.id ? updated : item) }));
  };

  const deleteTask = async (task) => {
    await api.delete('/admin/project-tasks/' + task.id);
    setProject((current) => ({ ...current, tasks: (current.tasks ?? []).filter((item) => item.id !== task.id) }));
  };

  const saveEvaluation = async (event) => {
    event.preventDefault();
    setSavingEvaluation(true);
    try {
      const response = await api.put(`/admin/accepted-projects/${id}/evaluation`, { scores, notes });
      const evaluation = response.data?.data ?? response.data;
      setProject((current) => ({ ...current, evaluation }));
    } finally {
      setSavingEvaluation(false);
    }
  };

  if (loading) return <div className="admin-empty-state">Chargement du projet...</div>;
  if (loadError || !project) return <div className="admin-empty-state text-danger">Impossible de charger ce projet accepté.</div>;

  return (
    <div className="animate-fade-in accepted-project-detail">
      <button onClick={() => navigate('/dashboard/admin/accepted-projects')} className="admin-back-button" aria-label="Retour">
        <ArrowLeft size={18} />
      </button>

      <div className="accepted-project-hero">
        <div>
          <span className="admin-section-eyebrow">Projet accepté</span>
          <h1>{projectName}</h1>
          <p>{project.project_description || project.project_idea_description || project.description || 'Aucune description détaillée renseignée.'}</p>
        </div>
        <Badge status={project.status} />
      </div>

      <div className="accepted-project-grid">
        <section className="admin-panel accepted-project-info">
          <h2>Informations du porteur</h2>
          <dl>
            <div><dt>Nom</dt><dd>{project.full_name || project.user?.name || 'Non renseigné'}</dd></div>
            <div><dt>Email</dt><dd>{project.email || project.user?.email || 'Non renseigné'}</dd></div>
            <div><dt>Téléphone</dt><dd>{project.phone || project.user?.phone || 'Non renseigné'}</dd></div>
            <div><dt>Suivi</dt><dd>{project.tracking_code}</dd></div>
            <div><dt>Date de dépôt</dt><dd>{formatDate(project.created_at)}</dd></div>
          </dl>
        </section>

        <section className="admin-panel accepted-task-panel">
          <div className="admin-panel-title-row">
            <h2><ClipboardList size={18} /> Tâches à faire</h2>
            <span>{tasks.filter((task) => task.status === 'done').length}/{tasks.length} terminées</span>
          </div>

          {!isReadOnlyAdmin && (
            <form onSubmit={addTask} className="accepted-task-form">
              <input className="form-control" value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} placeholder="Titre de la tâche" required />
              <textarea className="form-control" value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} placeholder="Détails ou consignes" rows={3} />
              <div className="accepted-task-form-row">
                <input className="form-control" type="date" value={taskForm.due_date} onChange={(event) => setTaskForm((current) => ({ ...current, due_date: event.target.value }))} />
                <Button type="submit" isLoading={savingTask}>Affecter</Button>
              </div>
            </form>
          )}

          <div className="accepted-task-list">
            {tasks.length ? tasks.map((task) => (
              <article key={task.id} className="accepted-task-card">
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <small>Échéance : {formatDate(task.due_date)}</small>
                </div>
                <div className="accepted-task-actions">
                  <select className="form-control" value={task.status} onChange={(event) => updateTaskStatus(task, event.target.value)} disabled={isReadOnlyAdmin}>
                    {taskStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                  {!isReadOnlyAdmin && <button type="button" className="accepted-icon-button" onClick={() => deleteTask(task)} aria-label="Supprimer la tâche"><Trash2 size={16} /></button>}
                </div>
              </article>
            )) : <div className="admin-empty-inline">Aucune tâche affectée pour le moment.</div>}
          </div>
        </section>
      </div>

      <section className="admin-panel accepted-evaluation-panel">
        <div className="admin-panel-title-row">
          <h2><CheckCircle2 size={18} /> Diagnostic individuel</h2>
          <div className="accepted-score-summary">
            <strong>{totals.total}</strong>
            <span>Total sur {totals.count * 10 || evaluationCriteria.length * 10}</span>
            <strong>{totals.average}/10</strong>
          </div>
        </div>

        <form onSubmit={saveEvaluation}>
          <div className="accepted-evaluation-table-wrap">
            <table className="accepted-evaluation-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Élément évalué</th>
                  <th>Score /10</th>
                </tr>
              </thead>
              <tbody>
                {evaluationCriteria.map((criterion) => (
                  <tr key={criterion.id}>
                    <td>{criterion.module}</td>
                    <td>{criterion.label}</td>
                    <td>
                      <input
                        className="form-control accepted-score-input"
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={scores[criterion.id] ?? ''}
                        onChange={(event) => setScores((current) => ({ ...current, [criterion.id]: event.target.value }))}
                        disabled={isReadOnlyAdmin}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label className="accepted-notes-field">
            Notes administrateur
            <textarea className="form-control" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Observations, points forts, axes d’amélioration..." disabled={isReadOnlyAdmin} />
          </label>
          {!isReadOnlyAdmin && (
            <div className="accepted-form-actions">
              <Button type="submit" isLoading={savingEvaluation}><Save size={16} /> Enregistrer le diagnostic</Button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
