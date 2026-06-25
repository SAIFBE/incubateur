import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const normalizePage = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

const taskSummary = (project) => {
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  const done = tasks.filter((task) => task.status === 'done').length;
  return { total: tasks.length, done };
};

export default function AdminAcceptedProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const params = filter === 'all' ? { page: 1 } : { page: 1, status: filter };
      const first = await api.get('/admin/accepted-projects', { params });
      const firstItems = normalizePage(first.data);
      const lastPage = first.data?.meta?.last_page || 1;
      if (lastPage <= 1) {
        setProjects(firstItems);
        return;
      }
      const pages = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) => api.get('/admin/accepted-projects', { params: { ...params, page: index + 2 } })));
      setProjects([...firstItems, ...pages.flatMap((response) => normalizePage(response.data))]);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const sortedProjects = useMemo(() => [...projects].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)), [projects]);

  return (
    <div className="animate-fade-in admin-accepted-projects">
      <div className="mb-8 flex justify-between items-end gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projets acceptés</h1>
          <p className="text-tertiary">Affectez les tâches et suivez le diagnostic individuel des porteurs sélectionnés.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Tous</Button>
        <Button variant={filter === 'selected' ? 'primary' : 'secondary'} onClick={() => setFilter('selected')}>Sélectionnés</Button>
        <Button variant={filter === 'account_requested' ? 'primary' : 'secondary'} onClick={() => setFilter('account_requested')}>Compte demandé</Button>
        <Button variant={filter === 'account_created' ? 'primary' : 'secondary'} onClick={() => setFilter('account_created')}>Compte créé</Button>
      </div>

      <div className="admin-table-shell">
        {loading ? <div className="admin-empty-state">Chargement...</div> : loadError ? <div className="admin-empty-state text-danger">Impossible de charger les projets acceptés depuis Laravel.</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                <th className="p-4 font-semibold">Porteur</th>
                <th className="p-4 font-semibold">Projet</th>
                <th className="p-4 font-semibold">Téléphone</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Tâches</th>
                <th className="p-4 font-semibold">Diagnostic</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.length > 0 ? sortedProjects.map((project) => {
                const summary = taskSummary(project);
                return (
                  <tr key={project.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{project.full_name || project.user?.name || 'Non renseigné'}</td>
                    <td className="p-4 text-secondary">
                      <strong className="accepted-project-title">{project.latest_account_request?.project_name || project.title || 'Projet sans nom'}</strong>
                      <span>{project.tracking_code}</span>
                    </td>
                    <td className="p-4 text-secondary">{project.phone || project.user?.phone || 'Non renseigné'}</td>
                    <td className="p-4"><Badge status={project.status} /></td>
                    <td className="p-4 text-secondary">{summary.done}/{summary.total}</td>
                    <td className="p-4 text-secondary">{project.evaluation ? `${project.evaluation.total_score} pts` : 'Non évalué'}</td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/dashboard/admin/accepted-projects/${project.id}`)}>Ouvrir</Button>
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan="7" className="admin-empty-state">Aucun projet accepté trouvé.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
