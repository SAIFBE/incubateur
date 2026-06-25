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
  refresh: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" /></svg>,
  star: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L3.077 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
};

const dateLabel = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '-');

const AdminDashboardPage = () => {
  const { submissions, categories } = useAppData();
  const navigate = useNavigate();

  const stats = {
    total: submissions.length,
    pending: submissions.filter((item) => item.status === 'pending').length,
    underReview: submissions.filter((item) => item.status === 'under_review').length,
    accepted: submissions.filter((item) => item.status === 'selected' || item.status === 'account_requested' || item.status === 'account_created').length,
    rejected: submissions.filter((item) => item.status === 'rejected').length,
  };

  const actionableCount = stats.pending + stats.underReview;

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))
    .slice(0, 5);

  const columns = [
    {
      field: 'title',
      header: 'Projet',
      width: '30%',
      render: (value, row) => <span className="text-primary">{value || `Fiche OFPPT - ${row.full_name || 'Sans nom'}`}</span>,
    },
    {
      field: 'category',
      header: 'Categorie',
      width: '20%',
      render: (value) => {
        const category = categories.find((item) => item.id === value);
        return <span className="text-secondary">{category?.name || value || 'OFPPT'}</span>;
      },
    },
    {
      field: 'updated_at',
      header: 'Derniere MAJ',
      width: '20%',
      render: (value, row) => <span className="text-muted">{dateLabel(value || row.created_at)}</span>,
    },
    { field: 'status', header: 'Statut', width: '20%', render: (value) => <Badge status={value} /> },
    {
      field: 'action',
      header: 'Action',
      width: '10%',
      align: 'right',
      render: (_, row) => (
        <button
          className="btn btn-ghost btn-sm"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/dashboard/admin/submissions/${row.id}`);
          }}
        >
          Ouvrir
        </button>
      ),
    },
  ];

  return (
    <div className="fade-in pb-12">
      <div className="page-banner">
        <div className="page-banner-icon">{Icons.shield}</div>
        <div className="page-banner-content">
          <h1>Poste de Controle Incubateur</h1>
          <p>
            Vue d'ensemble strategique.
            {' '}
            Vous avez <strong className="text-warning">{actionableCount} projets</strong> necessitant votre evaluation.
          </p>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-4 mb-8">
        <div className="kpi-card primary">
          <div className="kpi-icon">{Icons.list}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.total}</h3>
            <p className="kpi-label">Idees deposees</p>
          </div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-icon">{Icons.hourglass}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{actionableCount}</h3>
            <p className="kpi-label">En attente d'action</p>
          </div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-icon">{Icons.refresh}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.rejected}</h3>
            <p className="kpi-label">Idees refusees</p>
          </div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-icon">{Icons.star}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.accepted}</h3>
            <p className="kpi-label">Idees acceptees</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-2">
        <Card className="chart-card">
          <CardHeader title="Distribution par statut" />
          <CardBody>
            <div className="css-chart d-flex items-center" style={{ flexDirection: 'row', alignItems: 'flex-end', height: '240px', gap: '16px', padding: '16px 0' }}>
              {[
                ['pending', 'En attente', stats.pending],
                ['under_review', 'Evaluation', stats.underReview],
                ['selected', 'Selectionnees', stats.accepted],
                ['rejected', 'Refusees', stats.rejected],
              ].map(([key, label, count]) => {
                const max = Math.max(stats.pending, stats.underReview, stats.accepted, stats.rejected, 1);
                const heightPercent = `${(count / max) * 100}%`;

                return (
                  <div key={key} className="css-bar-wrapper d-flex flex-col items-center" style={{ flex: 1, gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                    <div className="css-bar-container" style={{ height: '100%', width: '36px', display: 'flex', alignItems: 'flex-end', background: 'var(--color-bg-deep)', borderRadius: 'var(--radius-sm)' }}>
                      <div className="css-bar" style={{ height: count > 0 ? heightPercent : '4px', width: '100%', background: 'linear-gradient(0deg, var(--color-primary), var(--color-secondary))', borderRadius: 'var(--radius-sm)' }} />
                    </div>
                    <span className="css-bar-label text-center text-xs">{label}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="chart-card">
          <CardHeader title="Activite recente des fiches" action={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard/admin/submissions')}>Gerer le flux</button>} />
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

