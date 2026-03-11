import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--color-warning)' }}>
          ⚠️
        </div>
        <h1 className="auth-title">Accès Refusé</h1>
        <p className="auth-subtitle mb-6 text-body">
          Vous n'avez pas l'autorisation d'accéder à cette page avec votre rôle actuel.
        </p>
        
        <div className="flex gap-4 justify-center mt-6">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Aller à la Connexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
