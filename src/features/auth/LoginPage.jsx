import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BrandLogo from '../../components/ui/BrandLogo';
import './auth.css';

const IconUser = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LoginPage = ({ mode = 'trainee' }) => {
  const role = mode === 'admin' ? 'admin' : 'trainee';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultDestination = role === 'admin' ? '/dashboard/admin' : '/dashboard/trainee';
  const from = location.state?.from?.pathname || defaultDestination;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(identifier, password);

      if (result.success) {
        let destination = from;

        if (result.user.role === 'trainee' && typeof destination === 'string' && destination.includes('/admin')) {
          destination = '/dashboard/trainee';
        } else if (result.user.role === 'admin' && typeof destination === 'string' && destination.includes('/trainee')) {
          destination = '/dashboard/admin';
        }

        if (result.user.role === 'admin' && destination === '/zinebadmin') {
          destination = '/dashboard/admin';
        }

        if (result.user.role === 'trainee' && destination === '/login') {
          destination = '/dashboard/trainee';
        }

        navigate(destination && destination !== '/' ? destination : defaultDestination, { replace: true });
      } else {
        setError(result.message || 'Identifiants incorrects');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion. Veuillez reessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = role === 'admin';

  return (
    <div className={`auth-page-root ${role}-theme`}>
      <div className="auth-split-container">
        <div className="auth-visual-panel">
          <div className={`auth-visual-bg ${role}-theme`}></div>
          <div className="auth-visual-grid"></div>

          <div className="auth-visual-logo">
            <BrandLogo className="brand-logo-auth-visual" />
          </div>

          <div className="auth-visual-content">
            <h1 className="auth-visual-title">
              {isAdmin ? "Pilotez l'innovation de demain." : 'Transformez vos idees en startups.'}
            </h1>
            <p className="auth-visual-desc">
              {isAdmin
                ? "Acces reserve a l'administration. Supervisez les soumissions, les comptes et le suivi des projets acceptes."
                : "Accedez a votre espace stagiaire pour suivre votre projet, vos avancements et vos echanges avec l'incubateur."}
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-container">
            <div className="auth-header-mobile">
              <BrandLogo className="brand-logo-auth-mobile" />
            </div>

            <div className="auth-tabs" aria-label="Choix du type de connexion">
              <button
                type="button"
                className={`auth-tab trainee ${!isAdmin ? 'active' : ''}`}
                aria-current={!isAdmin ? 'page' : undefined}
                onClick={() => navigate('/login', { state: location.state })}
              >
                <IconUser /> Stagiaire
              </button>
              <button
                type="button"
                className={`auth-tab admin ${isAdmin ? 'active' : ''}`}
                aria-current={isAdmin ? 'page' : undefined}
                onClick={() => navigate('/zinebadmin', { state: location.state })}
              >
                <IconShield /> Administration
              </button>
            </div>

            <div className="auth-form-body">
              <h2 className="auth-form-title">
                {isAdmin ? 'Acces administrateur' : 'Bienvenue dans votre espace'}
              </h2>
              <p className="auth-form-subtitle">
                {isAdmin ? 'Veuillez vous authentifier pour continuer.' : 'Connectez-vous avec votre Code CEF.'}
              </p>

              {error && (
                <div className="auth-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <label htmlFor="identifier" className="auth-label">
                    {isAdmin ? 'Adresse email professionnelle' : 'Code CEF (identifiant unique)'}
                  </label>
                  <input
                    id="identifier"
                    type={isAdmin ? 'email' : 'text'}
                    className="auth-input"
                    placeholder=""
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    required
                    dir="ltr"
                    inputMode={isAdmin ? 'email' : 'numeric'}
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete={isAdmin ? 'email' : 'username'}
                  />
                </div>

                <div className="auth-input-group">
                  <label htmlFor="password" className="auth-label">Mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    className="auth-input"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    dir="ltr"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className={`auth-btn-submit ${role}`} disabled={isLoading}>
                  {isLoading ? 'Authentification...' : 'Se connecter'}
                </button>
              </form>
            </div>

            <a href="/" className="auth-back-link">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retourner au site principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
