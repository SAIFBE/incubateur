import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const unwrapContacts = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

export default function AdminStaffContactsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/staff-contacts');
      setContacts(unwrapContacts(response.data));
    } catch {
      setError('Impossible de charger le personnel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) => [
      contact.name,
      contact.role_title,
      contact.department,
      contact.whatsapp_phone,
    ].filter(Boolean).join(' ').toLowerCase().includes(query));
  }, [contacts, searchTerm]);

  const deactivateContact = async (contact, event) => {
    event.stopPropagation();
    if (!window.confirm('Desactiver ce contact personnel ?')) return;

    await api.delete(`/admin/staff-contacts/${contact.id}`);
    await loadContacts();
  };

  const columns = [
    { field: 'name', header: 'Nom', width: '22%', render: (value) => <span className="font-semibold">{value}</span> },
    { field: 'role_title', header: 'Fonction', width: '22%', render: (value) => value || '-' },
    { field: 'department', header: 'Departement', width: '18%', render: (value) => value || '-' },
    { field: 'whatsapp_phone', header: 'WhatsApp', width: '16%', render: (value) => <span className="font-mono text-sm">{value}</span> },
    {
      field: 'is_active',
      header: 'Statut',
      width: '10%',
      render: (value) => <Badge color={value ? 'green' : 'gray'}>{value ? 'Actif' : 'Inactif'}</Badge>,
    },
    {
      field: 'actions',
      header: 'Actions',
      width: '12%',
      render: (_, row) => (
        <div className="admin-event-actions">
          {!isReadOnlyAdmin && (
            <>
              <button
                type="button"
                className="admin-inline-action"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/dashboard/admin/staff-contacts/${row.id}/edit`);
                }}
              >
                Editer
              </button>
              {row.is_active && (
                <button
                  type="button"
                  className="admin-inline-action admin-inline-action--danger"
                  onClick={(event) => deactivateContact(row, event)}
                >
                  Desactiver
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header mb-8 bg-surface p-6 rounded-xl border border-glass-border shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title mb-1 text-2xl">Personnel CMC</h1>
          <p className="page-subtitle mb-0">Contacts WhatsApp utilises pour informer les stagiaires via les groupes.</p>
        </div>
        {!isReadOnlyAdmin && (
          <button
            type="button"
            className="admin-create-action admin-create-action--events"
            onClick={() => navigate('/dashboard/admin/staff-contacts/new')}
          >
            Ajouter un contact
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
            <span className="text-sm font-medium">{filteredContacts.length} contact(s)</span>
            <button type="button" className="admin-inline-action" onClick={loadContacts} disabled={loading}>
              Actualiser
            </button>
          </div>
          {error ? (
            <div className="admin-empty-inline text-danger">{error}</div>
          ) : loading ? (
            <div className="admin-empty-inline">Chargement...</div>
          ) : (
            <Table
              columns={columns}
              data={filteredContacts}
              keyField="id"
              onRowClick={!isReadOnlyAdmin ? (row) => navigate(`/dashboard/admin/staff-contacts/${row.id}/edit`) : undefined}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
