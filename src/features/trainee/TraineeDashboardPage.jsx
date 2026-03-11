import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import Badge from '../../components/ui/Badge';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import './trainee.css';

// Premium SVG Icons
const Icons = {
  folder: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  document: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  hourglass: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  alert: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  rocket: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  plus: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
};

const TraineeDashboardPage = () => {
  const { currentUser } = useAuth();
  const { submissions, statusHistory } = useAppData();
  const navigate = useNavigate();

  const mySubmissions = submissions.filter(s => s.userId === currentUser.id);
  
  const stats = {
    total: mySubmissions.length,
    drafts: mySubmissions.filter(s => s.status === 'draft').length,
    underReview: mySubmissions.filter(s => ['submitted', 'received', 'under_review'].includes(s.status)).length,
    requiresChanges: mySubmissions.filter(s => s.status === 'requires_changes').length,
    accepted: mySubmissions.filter(s => s.status === 'accepted').length
  };

  const myHistory = statusHistory
    .filter(h => mySubmissions.some(s => s.id === h.submissionId))
    .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
    .slice(0, 5); // Last 5 activities

  const getSubTitle = (id) => mySubmissions.find(s => s.id === id)?.title || 'Projet Inconnu';

  return (
    <div className="animate-fade-in">
      {/* Premium Radiant Welcome Card */}
      <div className="trainee-welcome-card">
        <div className="welcome-content-wrapper">
          <h1 className="welcome-title">Bonjour, {currentUser.fullName}.</h1>
          <p className="welcome-subtitle">
            Votre espace d'incubation personnel. Transformez vos idées brillantes en produits concrets, suivez la validation de vos livrables et interagissez avec vos mentors.
          </p>
        </div>
      </div>

      <div className="page-header mt-8">
        <div>
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Vue d'Ensemble</h2>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid-cards">
        <div className="kpi-card primary">
          <div className="kpi-icon">{Icons.folder}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.total}</h3>
            <p className="kpi-label">Projets Totaux</p>
          </div>
        </div>
        <div className="kpi-card info">
          <div className="kpi-icon">{Icons.document}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.drafts}</h3>
            <p className="kpi-label">Brouillons Actifs</p>
          </div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-icon">{Icons.hourglass}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.underReview}</h3>
            <p className="kpi-label">En Cours d'Évaluation</p>
          </div>
        </div>
        {stats.requiresChanges > 0 && (
          <div className="kpi-card danger">
            <div className="kpi-icon">{Icons.alert}</div>
            <div className="kpi-content">
              <h3 className="kpi-value">{stats.requiresChanges}</h3>
              <p className="kpi-label">Modifications Requises</p>
            </div>
          </div>
        )}
        <div className="kpi-card success">
          <div className="kpi-icon">{Icons.rocket}</div>
          <div className="kpi-content">
            <h3 className="kpi-value">{stats.accepted}</h3>
            <p className="kpi-label">Projets Propulsés</p>
          </div>
        </div>
      </div>

      <div className="grid-2 mt-8">
        {/* Quick Actions Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Actions Rapides</h2>
          <div className="grid-2 h-full">
            <Link to="/dashboard/trainee/new-submission" className="action-card">
              <div className="action-card-icon">{Icons.plus}</div>
              <h3 className="action-card-title">Nouvelle Soumission</h3>
              <p className="action-card-desc">Initiez un nouveau dossier d'incubation pour votre startup ou idée de projet.</p>
            </Link>
            
            <Link to="/dashboard/trainee/my-submissions" className="action-card">
              <div className="action-card-icon">{Icons.folder}</div>
              <h3 className="action-card-title">Mes Projets</h3>
              <p className="action-card-desc">Gérez votre portefeuille, répondez aux évaluateurs et suivez l'évolution de vos projets.</p>
            </Link>
          </div>
        </div>

        {/* Timeline Activity Panel */}
        <div className="flex flex-col gap-4">
           <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Activité Récente</h2>
          <Card className="h-full relative z-10" style={{ padding: 0 }}>
            <CardBody style={{ padding: 'var(--spacing-xl)' }}>
              {myHistory.length > 0 ? (
                <div className="timeline">
                  {myHistory.map(activity => (
                    <div className="timeline-item" key={activity.id}>
                      <div className="timeline-icon active"></div>
                      <div className="timeline-content">
                        <h4 className="timeline-title">
                          Statut mis à jour : {getSubTitle(activity.submissionId)}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 mb-2">
                          <Badge status={activity.fromStatus} />
                          <span className="text-secondary text-sm">→</span>
                          <Badge status={activity.toStatus} />
                        </div>
                        <p className="timeline-meta" style={{ marginTop: '8px' }}>
                          Par <strong>{activity.changedBy}</strong> • {new Date(activity.changedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-secondary" style={{ border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                  <p>Aucune activité récente.</p>
                  <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard/trainee/new-submission')}>
                    Créer mon premier projet
                  </button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboardPage;
