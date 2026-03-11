import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import './admin.css';

const Icons = {
  shield: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  list: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  hourglass: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  refresh: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  star: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
};

const AdminDashboardPage = () => {
  const { submissions, categories, programs } = useAppData();
  const navigate = useNavigate();

  const stats = {
    total: submissions.length,
    drafts: submissions.filter(s => s.status === 'draft').length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    underReview: submissions.filter(s => ['received', 'under_review'].includes(s.status)).length,
    requiresChanges: submissions.filter(s => s.status === 'requires_changes').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  const actionableCount = stats.submitted + stats.underReview + submissions.filter(s => s.status === 'revised').length;

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const columns = [
    { field: 'title', header: 'Projet', width: '30%', render: (val) => <span className="font-semibold text-primary line-clamp-1">{val}</span> },
    { field: 'category', header: 'Catégorie', width: '20%', render: (val) => {
      const c = categories.find(cat => cat.id === val);
      return c ? <span className="text-secondary">{c.name}</span> : '-';
    }},
    { field: 'updatedAt', header: 'Dernière MAJ', width: '20%', render: (val) => <span className="text-tertiary">{new Date(val).toLocaleDateString('fr-FR')}</span> },
    { field: 'status', header: 'Statut', width: '20%', render: (val) => <Badge status={val} /> },
    { field: 'action', header: 'Action', width: '10%', align: 'right', render: (_, row) => (
      <button 
        className="text-primary font-medium hover:text-primary-hover transition-colors text-sm"
        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin/submissions/${row.id}`); }}
      >
        Ouvrir →
      </button>
    )}
  ];

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header relative overflow-hidden bg-surface p-8 rounded-2xl border border-glass-border mb-10 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full opacity-10 filter blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full opacity-5 filter blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        <div className="relative z-10 flex gap-4 items-center">
          <div className="w-16 h-16 rounded-xl bg-primary-dim text-primary flex items-center justify-center shadow-inner border border-primary-border">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary mb-1 tracking-tight">Poste de Contrôle Incubateur</h1>
            <p className="text-lg text-text-secondary">
              Vue d'ensemble stratégique. 
              Vous avez <strong className="text-warning font-semibold">{actionableCount} projets</strong> nécessitant votre évaluation.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-overview-grid">
        <div className="kpi-wrapper">
          <div className="kpi-card primary">
            <div className="kpi-icon">{Icons.list}</div>
            <div className="kpi-content">
              <h3 className="kpi-value">{stats.total}</h3>
              <p className="kpi-label">Projets Déposés</p>
            </div>
          </div>
        </div>
        <div className="kpi-wrapper">
          <div className="kpi-card warning">
            <div className="kpi-icon">{Icons.hourglass}</div>
            <div className="kpi-content">
              <h3 className="kpi-value">{actionableCount}</h3>
              <p className="kpi-label">En Attente d'Action</p>
            </div>
          </div>
        </div>
        <div className="kpi-wrapper">
          <div className="kpi-card danger">
            <div className="kpi-icon">{Icons.refresh}</div>
            <div className="kpi-content">
              <h3 className="kpi-value">{stats.requiresChanges}</h3>
              <p className="kpi-label">Demandes de Retour</p>
            </div>
          </div>
        </div>
        <div className="kpi-wrapper">
          <div className="kpi-card success">
            <div className="kpi-icon">{Icons.star}</div>
            <div className="kpi-content">
              <h3 className="kpi-value">{stats.accepted}</h3>
              <p className="kpi-label">Startups Validées</p>
            </div>
          </div>
        </div>

        {/* CSS Chart for categories */}
        <Card className="chart-card">
          <CardHeader title="Distribution Sectorielle" />
          <CardBody>
            <div className="css-chart">
              {categories.slice(0, 6).map(cat => {
                const count = submissions.filter(s => s.category === cat.id).length;
                const max = Math.max(...categories.map(c => submissions.filter(s => s.category === c.id).length), 1);
                const heightPercent = `${(count / max) * 100}%`;
                
                return (
                  <div key={cat.id} className="css-bar-wrapper">
                    <div className="css-bar" style={{ height: count > 0 ? heightPercent : '4px' }}>
                      <span className="css-bar-tooltip">{count} soumissions</span>
                    </div>
                    <span className="css-bar-label" title={cat.name}>{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Quick Recent List */}
        <Card className="chart-card">
          <CardHeader title="Activité Récente des Projets" action={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard/admin/submissions')}>Gérer le Flux</button>} />
          <CardBody style={{ padding: 0 }}>
            <Table 
              columns={columns} 
              data={recentSubmissions} 
              onRowClick={(row) => navigate(`/dashboard/admin/submissions/${row.id}`)}
              className="border-0 rounded-none bg-transparent"
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
