import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import { USERS } from '../../data/users';

const AdminSubmissionsPage = () => {
  const { submissions, categories, programs } = useAppData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  const filteredSubmissions = submissions.filter(sub => {
    const user = USERS.find(u => u.id === sub.userId);
    const searchString = `${sub.title} ${user?.fullName} ${user?.cef}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || sub.category === categoryFilter;
    const matchesProg = programFilter === 'all' || sub.program === programFilter;
    
    return matchesSearch && matchesStatus && matchesCat && matchesProg;
  }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const columns = [
    { field: 'title', header: 'Titre du Projet', width: '25%', render: (val) => <span className="font-semibold">{val}</span> },
    { field: 'userId', header: 'Stagiaire', width: '20%', render: (val) => {
      const user = USERS.find(u => u.id === val);
      return (
        <div>
          <div className="font-medium">{user?.fullName || 'Inconnu'}</div>
          <div className="text-xs text-secondary">{user?.cef || '-'}</div>
        </div>
      );
    }},
    { field: 'category', header: 'Catégorie', width: '15%', render: (val) => categories.find(c => c.id === val)?.name || '-' },
    { field: 'program', header: 'Filière', width: '15%', render: (val) => programs.find(p => p.id === val)?.name || '-' },
    { field: 'status', header: 'Statut', width: '15%', render: (val) => <Badge status={val} /> },
    { field: 'updatedAt', header: 'Date MAJ', width: '10%', render: (val) => <span className="text-xs text-secondary">{new Date(val).toLocaleDateString('fr-FR')}</span> },
  ];

  return (
    <div className="pb-12">
      <div className="page-header mb-8 bg-surface p-6 rounded-xl border border-glass-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary-dim text-primary flex items-center justify-center border border-primary-border">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <div>
          <h1 className="page-title mb-1 text-2xl">Toutes les soumissions</h1>
          <p className="page-subtitle mb-0">Gérez et évaluez les projets des stagiaires</p>
        </div>
      </div>

      <div className="filter-bar">
        <Input 
          placeholder="Rechercher (Titre, Nom, CEF)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClass="flex-1 min-w-[250px] mb-0"
        />
        
        <Select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          containerClass="mb-0 min-w-[150px]"
          options={[
            { value: 'all', label: 'Tous les statuts' },
            { value: 'draft', label: 'Brouillon' },
            { value: 'submitted', label: 'Soumis' },
            { value: 'received', label: 'Reçu' },
            { value: 'under_review', label: 'En Évaluation' },
            { value: 'requires_changes', label: 'Modifs. Requises' },
            { value: 'revised', label: 'Révisé' },
            { value: 'accepted', label: 'Accepté' },
            { value: 'rejected', label: 'Rejeté' },
            { value: 'archived', label: 'Archivé' },
          ]}
        />

        <Select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          containerClass="mb-0 min-w-[150px]"
          options={[{ value: 'all', label: 'Toutes les catégories' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
        />

        <Select 
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          containerClass="mb-0 min-w-[150px]"
          options={[{ value: 'all', label: 'Toutes les filières' }, ...programs.map(p => ({ value: p.id, label: p.name }))]}
        />
      </div>

      <Card>
        <CardBody style={{ padding: 0 }}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover">
            <span className="text-sm font-medium">{filteredSubmissions.length} projets trouvés</span>
          </div>
          <Table 
            columns={columns} 
            data={filteredSubmissions} 
            keyField="id"
            onRowClick={(row) => navigate(`/dashboard/admin/submissions/${row.id}`)}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminSubmissionsPage;
