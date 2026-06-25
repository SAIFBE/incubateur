import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

const normalizePage = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

const AdminAccountRequestsPage = () => {
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const params = filter === 'all' ? { page: 1 } : { page: 1, status: filter };
      const first = await api.get('/admin/account-requests', { params });
      const firstItems = normalizePage(first.data);
      const lastPage = first.data?.meta?.last_page || 1;
      if (lastPage <= 1) {
        setRequests(firstItems);
        return;
      }
      const pages = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) => api.get('/admin/account-requests', { params: { ...params, page: index + 2 } })));
      setRequests([...firstItems, ...pages.flatMap((response) => normalizePage(response.data))]);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const reviewRequest = async (requestId, action) => {
    setSavingId(`${requestId}:${action}`);
    try {
      const response = await api.post(`/admin/account-requests/${requestId}/${action}`);
      const updated = response.data?.data ?? response.data;
      setRequests((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
    } finally {
      setSavingId(null);
    }
  };

  const sortedRequests = useMemo(() => [...requests].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)), [requests]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demandes de creation de compte</h1>
          <p className="text-tertiary">Validez les acces stagiaires apres verification du candidat selectionne.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Toutes</Button>
        <Button variant={filter === 'pending' ? 'primary' : 'secondary'} onClick={() => setFilter('pending')}>En attente</Button>
        <Button variant={filter === 'approved' ? 'primary' : 'secondary'} onClick={() => setFilter('approved')}>Approuvees</Button>
        <Button variant={filter === 'rejected' ? 'primary' : 'secondary'} onClick={() => setFilter('rejected')}>Refusees</Button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center text-tertiary">Chargement...</div> : loadError ? <div className="p-8 text-center text-danger">Impossible de charger les demandes depuis Laravel.</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                <th className="p-4 font-semibold">Candidat</th>
                <th className="p-4 font-semibold">CEF</th>
                <th className="p-4 font-semibold">Projet</th>
                <th className="p-4 font-semibold">Idee associee</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequests.length > 0 ? sortedRequests.map((request) => (
                <tr key={request.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{request.project_idea?.full_name || 'Non renseigne'}</td>
                  <td className="p-4 text-secondary">{request.cef}</td>
                  <td className="p-4 text-secondary">{request.project_name || 'Non renseigne'}</td>
                  <td className="p-4 text-secondary">{request.project_idea?.title || request.project_idea?.tracking_code || 'Non renseignee'}</td>
                  <td className="p-4"><Badge status={request.status} /></td>
                  <td className="p-4 text-right">
                    {request.status === 'pending' && !isReadOnlyAdmin ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => reviewRequest(request.id, 'approve')} isLoading={savingId === `${request.id}:approve`}>Approuver</Button>
                        <Button size="sm" variant="danger" onClick={() => reviewRequest(request.id, 'reject')} disabled={Boolean(savingId)}>Refuser</Button>
                      </div>
                    ) : <span className="text-tertiary text-sm">{isReadOnlyAdmin ? 'Lecture seule' : 'Traitee'}</span>}
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="p-8 text-center text-tertiary">Aucune demande trouvee.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAccountRequestsPage;
