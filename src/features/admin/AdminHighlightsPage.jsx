import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';

const apiError = (error, fallback) => (
  Object.values(error.response?.data?.errors ?? {}).flat()[0]
  || error.response?.data?.message
  || fallback
);

const AdminHighlightsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchMoments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/impact-moments');
      setMoments(response.data.data ?? []);
    } catch (error) {
      showToast({
        title: 'Erreur',
        message: apiError(error, 'Impossible de charger les Moments d’impact.'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMoments();
  }, [fetchMoments]);

  const filteredMoments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return moments.filter((moment) => (
      `${moment.title} ${moment.date ?? ''} ${moment.category ?? ''}`
        .toLowerCase()
        .includes(query)
    ));
  }, [moments, searchTerm]);

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce Moment d’impact ?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/admin/impact-moments/${id}`);
      setMoments((current) => current.filter((moment) => String(moment.id) !== String(id)));
      showToast({ title: 'Succès', message: 'Le Moment d’impact a été supprimé.' });
    } catch (error) {
      showToast({
        title: 'Erreur',
        message: apiError(error, 'Impossible de supprimer ce Moment d’impact.'),
        type: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      field: 'title',
      header: 'Moment d’impact',
      width: '35%',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {row.image && <img src={row.image} alt="" className="w-12 h-12 rounded-md object-cover border border-border" />}
          <span className="font-semibold">{row.title}</span>
        </div>
      ),
    },
    { field: 'date', header: 'Période/Date', width: '18%', render: (value) => <span className="text-sm">{value || 'Non renseignée'}</span> },
    { field: 'category', header: 'Catégorie', width: '17%', render: (value) => <span className="text-sm text-secondary">{value || 'Non renseignée'}</span> },
    {
      field: 'is_published',
      header: 'Publication',
      width: '12%',
      render: (value) => <span className={`badge ${value ? 'badge-accepted' : 'badge-draft'}`}>{value ? 'Publié' : 'Masqué'}</span>,
    },
    {
      field: 'actions',
      header: 'Actions',
      width: '18%',
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
          {!isReadOnlyAdmin ? (
            <>
              <button
                onClick={(event) => { event.stopPropagation(); navigate(`/dashboard/admin/highlights/${row.id}/edit`); }}
                className="admin-inline-action"
              >
                Modifier
              </button>
              <button
                onClick={(event) => handleDelete(row.id, event)}
                disabled={String(deletingId) === String(row.id)}
                className="admin-inline-action admin-inline-action--danger"
              >
                {String(deletingId) === String(row.id) ? 'Suppression...' : 'Supprimer'}
              </button>
            </>
          ) : <span className="text-tertiary text-sm">Lecture seule</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header mb-8 bg-surface p-6 rounded-xl border border-glass-border shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title mb-1 text-2xl">Moments d’impact</h1>
          <p className="page-subtitle mb-0">Gérez les moments forts publiés sur la plateforme.</p>
        </div>
        {!isReadOnlyAdmin && (
          <button
            onClick={() => navigate('/dashboard/admin/highlights/new')}
            className="admin-create-action admin-create-action--events"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un Moment
          </button>
        )}
      </div>

      <div className="filter-bar mb-6">
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          containerClass="flex-1 max-w-md mb-0"
        />
      </div>

      <Card>
        <CardBody style={{ padding: 0 }}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover">
            <span className="text-sm font-medium">
              {loading ? 'Chargement...' : `${filteredMoments.length} moments trouvés`}
            </span>
          </div>
          {!loading && (
            <Table
              columns={columns}
              data={filteredMoments}
              keyField="id"
              onRowClick={!isReadOnlyAdmin ? (row) => navigate(`/dashboard/admin/highlights/${row.id}/edit`) : undefined}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminHighlightsPage;
