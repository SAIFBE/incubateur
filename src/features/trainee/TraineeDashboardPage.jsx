import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import Badge from '../../components/ui/Badge';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import './trainee.css';

const Icons = {
  folder: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  rocket: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
};

const getFirstName = (user) => (user?.name || user?.fullName || 'stagiaire').split(' ')[0];
const getIdeaDescription = (idea) => idea?.project_description || idea?.project_idea_description || idea?.description || 'Aucune description fournie.';

const TraineeDashboardPage = () => {
  const { currentUser } = useAuth();
  const { submissions = [] } = useAppData();
  const idea = submissions.find((item) => String(item.user_id) === String(currentUser.id)) || submissions[0];

  return (
    <div className="fade-in">
      <div className="page-banner">
        <div className="page-banner-icon">{Icons.rocket}</div>
        <div className="page-banner-content">
          <h1>Bienvenue {getFirstName(currentUser)}</h1>
          <p>Votre compte sert au suivi et aux echanges avec l administrateur autour de votre idee acceptee.</p>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-2 mt-8">
        <Card>
          <CardHeader title="Idee acceptee" action={idea ? <Badge status={idea.status} /> : null} />
          <CardBody>
            {idea ? (
              <>
                <h2 className="text-h2 mb-3">{idea.title || `Idee de projet - ${idea.full_name}`}</h2>
                <p className="text-secondary mb-4">{getIdeaDescription(idea)}</p>
                <div className="details-grid mb-6">
                  <div className="detail-item"><span className="detail-label">Numero de suivi</span><span className="detail-value">{idea.tracking_code}</span></div>
                  <div className="detail-item"><span className="detail-label">Telephone</span><span className="detail-value">{idea.phone || currentUser.phone || 'Non renseigne'}</span></div>
                  <div className="detail-item"><span className="detail-label">Email</span><span className="detail-value">{idea.email || currentUser.email || 'Non renseigne'}</span></div>
                </div>
                <Link to="/dashboard/trainee/my-submissions" className="btn btn-primary">Voir le suivi</Link>
              </>
            ) : (
              <p className="text-secondary">Aucune idee n est encore associee a ce compte.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Communication" action={<span className="kpi-icon">{Icons.folder}</span>} />
          <CardBody>
            <p className="text-secondary">
              L administrateur peut suivre votre dossier, consulter vos coordonnees et vous accompagner a partir de cette idee acceptee.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TraineeDashboardPage;
