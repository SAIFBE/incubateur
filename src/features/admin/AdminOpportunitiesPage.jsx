import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataStoreContext';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';

const AdminOpportunitiesPage = () => {
  const { opportunities, deleteOpportunity } = useDataStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOpportunities = opportunities.filter(opp => {
    const searchString = `${opp.title_i18n?.fr || opp.title} ${opp.category}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.createdAt || b.deadline) - new Date(a.createdAt || a.deadline));

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette opportunité ?")) {
      deleteOpportunity(id);
    }
  };

  const columns = [
    { field: 'title', header: 'Titre', width: '35%', render: (_, row) => <span className="font-semibold">{row.title_i18n?.fr || row.title}</span> },
    { field: 'category', header: 'Catégorie', width: '15%', render: (val) => <span className="capitalize">{val}</span> },
    { field: 'deadline', header: 'Date Limite', width: '15%', render: (val) => val ? <span className="text-sm">{new Date(val).toLocaleDateString('fr-FR')}</span> : '-' },
    { field: 'status', header: 'Statut', width: '10%', render: (val) => (
      <Badge color={val === 'open' ? 'green' : 'gray'}>
        {val === 'open' ? 'Ouvert' : 'Fermé'}
      </Badge>
    )},
    { field: 'actions', header: 'Actions', width: '25%', render: (_, row) => (
      <div className="flex gap-2 justify-end">
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin/opportunities/${row.id}/edit`); }}
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
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <div>
            <h1 className="page-title mb-1 text-2xl">Opportunités</h1>
            <p className="page-subtitle mb-0">Programmes, bourses, et concours</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard/admin/opportunities/new')}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Créer une opportunité
        </button>
      </div>

      <div className="filter-bar mb-6">
        <Input 
          placeholder="Rechercher une opportunité..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClass="flex-1 max-w-md mb-0"
        />
      </div>

      <Card>
        <CardBody style={{ padding: 0 }}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover">
            <span className="text-sm font-medium">{filteredOpportunities.length} opportunités trouvées</span>
          </div>
          <Table 
            columns={columns} 
            data={filteredOpportunities} 
            keyField="id"
            onRowClick={(row) => navigate(`/dashboard/admin/opportunities/${row.id}/edit`)}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminOpportunitiesPage;
