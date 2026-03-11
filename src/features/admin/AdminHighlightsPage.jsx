import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';

const AdminHighlightsPage = () => {
  const { pastEvents, deletePastEvent } = useDataStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHighlights = pastEvents.filter(evt => {
    const searchString = `${evt.title_i18n?.fr || evt.title} ${evt.date}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce moment d'impact ?")) {
      deletePastEvent(id);
    }
  };

  const columns = [
    { field: 'title', header: 'Nom de l\'événement', width: '35%', render: (_, row) => <span className="font-semibold">{row.title_i18n?.fr || row.title}</span> },
    { field: 'date', header: 'Période/Date', width: '20%', render: (val) => <span className="text-sm">{val || '-'}</span> },
    { field: 'location', header: 'Lieu', width: '20%', render: (_, row) => <span className="text-sm text-secondary">{row.location_i18n?.fr || row.location || '-'}</span> },
    { field: 'actions', header: 'Actions', width: '25%', render: (_, row) => (
      <div className="flex gap-2 justify-end">
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin/highlights/${row.id}/edit`); }}
          className="px-3 py-1 bg-surface-200 hover:bg-surface-300 text-surface-700 rounded-md text-sm font-medium transition-colors"
        >
          Éditer
        </button>
        <button 
          onClick={(e) => handleDelete(row.id, e)}
          className="px-3 py-1 bg-danger-50 hover:bg-danger-100 text-danger-600 rounded-md text-sm font-medium transition-colors"
        >
          Supprimer
        </button>
      </div>
    )},
  ];

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header mb-8 bg-surface p-6 rounded-xl border border-glass-border shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-dim text-primary flex items-center justify-center border border-primary-border">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h1 className="page-title mb-1 text-2xl">Moments d'Impact</h1>
            <p className="page-subtitle mb-0">Galerie des événements passés et des success stories</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard/admin/highlights/new')}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Ajouter un Moment
        </button>
      </div>

      <div className="filter-bar mb-6">
        <Input 
          placeholder="Rechercher..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClass="flex-1 max-w-md mb-0"
        />
      </div>

      <Card>
        <CardBody style={{ padding: 0 }}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover">
            <span className="text-sm font-medium">{filteredHighlights.length} moments trouvés</span>
          </div>
          <Table 
            columns={columns} 
            data={filteredHighlights} 
            keyField="id"
            onRowClick={(row) => navigate(`/dashboard/admin/highlights/${row.id}/edit`)}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminHighlightsPage;
