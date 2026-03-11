import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const MySubmissionsPage = () => {
  const { currentUser } = useAuth();
  const { submissions, categories } = useAppData();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mySubmissions = submissions.filter(s => s.userId === currentUser.id);

  const filteredSubmissions = mySubmissions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes Projets</h1>
          <p className="page-subtitle">Consultez et gérez vos soumissions à l'incubateur</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/dashboard/trainee/new-submission')}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Nouvelle Soumission
        </Button>
      </div>

      <Card className="mb-8">
        <CardBody className="flex gap-4 flex-wrap items-end">
          <Input 
            placeholder="Rechercher par titre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClass="flex-1 min-w-[200px] mb-0"
          />
          <div className="form-group mb-0 min-w-[200px]">
            <select 
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="submitted">Soumis</option>
              <option value="under_review">En Évaluation</option>
              <option value="requires_changes">Modifications Requises</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {filteredSubmissions.length > 0 ? (
        <div className="grid-cards">
          {filteredSubmissions.map(sub => {
            const category = categories.find(c => c.id === sub.category);
            const canEdit = ['draft', 'requires_changes'].includes(sub.status);
            
            return (
              <Card key={sub.id} className="flex flex-col h-full hover:border-primary cursor-pointer transition-all" onClick={() => navigate(`/dashboard/trainee/my-submissions/${sub.id}`)}>
                <CardBody className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge status={sub.status} />
                    <span className="text-xl" title={category?.name}>{category?.icon}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{sub.title}</h3>
                  <p className="text-sm text-secondary line-clamp-2 mb-4 flex-1">
                    {sub.summary || sub.problem || 'Aucune description fournie.'}
                  </p>
                  
                  <div className="pt-4 border-t border-border mt-auto flex justify-between items-center">
                    <span className="text-xs text-tertiary">
                      MAJ: {new Date(sub.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                    <Button variant={canEdit ? 'secondary' : 'ghost'} size="sm">
                      {canEdit ? 'Éditer' : 'Voir'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon={<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
          title="Aucun projet trouvé"
          description={mySubmissions.length === 0 ? "Vous n'avez pas encore soumis de projet." : "Aucun projet ne correspond à vos filtres."}
          actionLabel={mySubmissions.length === 0 ? "Créer un Projet" : "Réinitialiser les filtres"}
          onAction={() => mySubmissions.length === 0 ? navigate('/dashboard/trainee/new-submission') : setStatusFilter('all')}
        />
      )}
    </div>
  );
};

export default MySubmissionsPage;
