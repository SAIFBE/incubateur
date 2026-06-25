import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const statusMap = {
  pending: { label: 'En attente', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  under_review: { label: 'En etude', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  selected: { label: 'Selectionne', className: 'bg-green-500/20 text-green-300 border-green-500/30' },
  rejected: { label: 'Refuse', className: 'bg-red-500/20 text-red-300 border-red-500/30' },
  account_requested: { label: 'Compte demande', className: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  account_created: { label: 'Compte cree', className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

const StatusBadge = ({ status }) => {
  const item = statusMap[status] || statusMap.pending;
  return <span className={`px-2 py-1 rounded text-xs font-semibold border ${item.className}`}>{item.label}</span>;
};

const normalizePage = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

const AdminSubmissionsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const params = filter === 'all' ? { page: 1 } : { page: 1, status: filter };
      const first = await api.get('/admin/project-ideas', { params });
      const firstItems = normalizePage(first.data);
      const lastPage = first.data?.meta?.last_page || 1;
      if (lastPage <= 1) {
        setSubmissions(firstItems);
        return;
      }
      const pages = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) => api.get('/admin/project-ideas', { params: { ...params, page: index + 2 } })));
      setSubmissions([...firstItems, ...pages.flatMap((response) => normalizePage(response.data))]);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const updateRow = (updated) => {
    setSubmissions((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
  };

  const runAction = async (submission, action) => {
    setSavingId(`${submission.id}:${action}`);
    try {
      const response = action === 'under_review'
        ? await api.patch(`/admin/project-ideas/${submission.id}/review`, { status: 'under_review', admin_comment: submission.admin_comment || '' })
        : await api.post(`/admin/project-ideas/${submission.id}/${action}`);
      updateRow(response.data?.data ?? response.data);
    } finally {
      setSavingId(null);
    }
  };

  const sortedSubmissions = useMemo(() => [...submissions].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)), [submissions]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des idees publiques</h1>
          <p className="text-tertiary">Evaluez, selectionnez et gerez les idees envoyees depuis le formulaire public</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Tous</Button>
        <Button variant={filter === 'pending' ? 'primary' : 'secondary'} onClick={() => setFilter('pending')}>En attente</Button>
        <Button variant={filter === 'under_review' ? 'primary' : 'secondary'} onClick={() => setFilter('under_review')}>En etude</Button>
        <Button variant={filter === 'selected' ? 'primary' : 'secondary'} onClick={() => setFilter('selected')}>Selectionnes</Button>
        <Button variant={filter === 'rejected' ? 'primary' : 'secondary'} onClick={() => setFilter('rejected')}>Refusees</Button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center text-tertiary">Chargement...</div> : loadError ? <div className="p-8 text-center text-danger">Impossible de charger les soumissions depuis Laravel.</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                <th className="p-4 font-semibold">Candidat</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Telephone</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubmissions.length > 0 ? sortedSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{submission.full_name || submission.user?.name || 'Non renseigne'}</td>
                  <td className="p-4 text-secondary">{submission.email || submission.user?.email || 'Non renseigne'}</td>
                  <td className="p-4 text-secondary">{submission.phone || 'Non renseigne'}</td>
                  <td className="p-4 text-secondary">{submission.created_at ? new Date(submission.created_at).toLocaleDateString('fr-FR') : 'Non renseigne'}</td>
                  <td className="p-4"><StatusBadge status={submission.status} /></td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      {!isReadOnlyAdmin && (
                        <>
                          {['pending', 'under_review'].includes(submission.status) && <Button variant="secondary" size="sm" onClick={() => runAction(submission, 'under_review')} isLoading={savingId === `${submission.id}:under_review`}>Etude</Button>}
                          {!['account_requested', 'account_created'].includes(submission.status) && <Button variant="secondary" size="sm" onClick={() => runAction(submission, 'select')} isLoading={savingId === `${submission.id}:select`}>Selectionner</Button>}
                          {submission.status !== 'account_created' && <Button variant="danger" size="sm" onClick={() => runAction(submission, 'reject')} disabled={Boolean(savingId)}>Refuser</Button>}
                        </>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/admin/submissions/${submission.id}`)}>Ouvrir</Button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="p-8 text-center text-tertiary">Aucune idee trouvee.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSubmissionsPage;
