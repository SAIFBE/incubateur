import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminEventsPage = () => {
  const { events, deleteEvent } = useDataStore();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationsEvent, setRegistrationsEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationsError, setRegistrationsError] = useState('');

  const eventTitle = (event) => event?.title_i18n?.fr || event?.title || 'Evenement';

  const filteredEvents = events.filter(evt => {
    const searchString = `${evt.title_i18n?.fr || evt.title} ${evt.category}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.startDate || b.createdAt) - new Date(a.startDate || a.createdAt));

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Etes-vous sur de vouloir supprimer cet evenement ?')) {
      deleteEvent(id);
    }
  };

  const loadRegistrations = async (event, e) => {
    e.stopPropagation();
    setRegistrationsEvent(event);
    setEventRegistrations([]);
    setRegistrationsError('');
    setRegistrationsLoading(true);

    try {
      const response = await api.get(`/admin/events/${event.id}/registrations`);
      setRegistrationsEvent({
        ...event,
        registrations_count: response.data?.registrations_count ?? event.registrations_count ?? 0,
      });
      setEventRegistrations(response.data?.data || []);
    } catch {
      setRegistrationsError("Impossible de charger les inscriptions de cet evenement.");
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const exportRegistrations = async (event, e) => {
    e.stopPropagation();

    try {
      const response = await api.get(`/admin/events/${event.id}/registrations/export`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inscriptions-evenement-${event.id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setRegistrationsError("Impossible d'exporter les inscriptions.");
      setRegistrationsEvent(event);
    }
  };

  const columns = [
    { field: 'title', header: 'Titre', width: '28%', render: (_, row) => <span className="font-semibold">{eventTitle(row)}</span> },
    { field: 'startDate', header: 'Date', width: '13%', render: (val) => val ? <span className="text-sm">{new Date(val).toLocaleDateString('fr-FR')}</span> : '-' },
    { field: 'registrations_count', header: 'Inscriptions', width: '12%', render: (val) => <span className="admin-registration-count">{val ?? 0}</span> },
    { field: 'status', header: 'Statut', width: '13%', render: (val) => {
      const statusMap = {
        upcoming: { label: 'A venir', color: 'blue' },
        ongoing: { label: 'En cours', color: 'yellow' },
        completed: { label: 'Termine', color: 'gray' },
      };
      const s = statusMap[val] || { label: val || 'upcoming', color: 'gray' };
      return <Badge color={s.color}>{s.label}</Badge>;
    }},
    { field: 'mode', header: 'Mode', width: '8%', render: (val) => <span className="text-sm uppercase text-secondary">{val}</span> },
    { field: 'actions', header: 'Actions', width: '26%', render: (_, row) => (
      <div className="admin-event-actions">
        <button
          onClick={(e) => loadRegistrations(row, e)}
          className="admin-inline-action admin-inline-action--info"
        >
          Voir
        </button>
        <button
          onClick={(e) => exportRegistrations(row, e)}
          className="admin-inline-action admin-inline-action--success"
        >
          Excel
        </button>
        {!isReadOnlyAdmin && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin/events/${row.id}/notify-staff`); }}
              className="admin-inline-action admin-inline-action--info"
            >
              Notifier
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin/events/${row.id}/edit`); }}
              className="admin-inline-action"
            >
              Editer
            </button>
            <button
              onClick={(e) => handleDelete(row.id, e)}
              className="admin-inline-action admin-inline-action--danger"
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header mb-8 bg-surface p-6 rounded-xl border border-glass-border shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-dim text-primary flex items-center justify-center border border-primary-border">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h1 className="page-title mb-1 text-2xl">Evenements Incubateur</h1>
            <p className="page-subtitle mb-0">Gestion des evenements, ateliers et webinaires</p>
          </div>
        </div>
        {!isReadOnlyAdmin && (
          <button
            onClick={() => navigate('/dashboard/admin/events/new')}
            className="admin-create-action admin-create-action--events"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Creer un evenement
          </button>
        )}
      </div>

      <div className="filter-bar mb-6">
        <Input
          placeholder="Rechercher un evenement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClass="flex-1 max-w-md mb-0"
        />
      </div>

      <Card>
        <CardBody style={{ padding: 0 }}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover">
            <span className="text-sm font-medium">{filteredEvents.length} evenements trouves</span>
          </div>
          <Table
            columns={columns}
            data={filteredEvents}
            keyField="id"
            onRowClick={!isReadOnlyAdmin ? (row) => navigate(`/dashboard/admin/events/${row.id}/edit`) : undefined}
          />
        </CardBody>
      </Card>

      {registrationsEvent && (
        <Card className="admin-registrations-panel">
          <CardBody>
            <div className="admin-registrations-header">
              <div>
                <span className="admin-section-eyebrow">Inscriptions evenement</span>
                <h2>{eventTitle(registrationsEvent)}</h2>
                <p>{registrationsEvent.registrations_count ?? eventRegistrations.length} inscription(s)</p>
              </div>
              <div className="admin-registrations-actions">
                <button
                  type="button"
                  className="admin-inline-action admin-inline-action--success"
                  onClick={(e) => exportRegistrations(registrationsEvent, e)}
                >
                  Exporter Excel
                </button>
                <button
                  type="button"
                  className="admin-inline-action"
                  onClick={() => {
                    setRegistrationsEvent(null);
                    setEventRegistrations([]);
                    setRegistrationsError('');
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>

            {registrationsError && <p className="admin-registrations-error">{registrationsError}</p>}

            {registrationsLoading ? (
              <div className="admin-empty-inline">Chargement des inscriptions...</div>
            ) : eventRegistrations.length === 0 ? (
              <div className="admin-empty-inline">Aucune inscription pour cet evenement.</div>
            ) : (
              <div className="admin-registrations-table-wrap">
                <table className="admin-registrations-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Date inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRegistrations.map((registration) => (
                      <tr key={registration.id}>
                        <td>{registration.name}</td>
                        <td>{registration.email}</td>
                        <td>
                          {registration.registered_at
                            ? new Date(registration.registered_at).toLocaleString('fr-FR')
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default AdminEventsPage;

