import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './auth.css';

// Simple inline SVGs for the UI
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

const LoginPage = () => {
  const [role, setRole] = useState('trainee'); // 'trainee' | 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (role === 'admin' ? '/dashboard/admin' : '/dashboard/trainee');

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
        
        // Prevent redirecting trainees to admin routes and vice versa
        if (result.user.role === 'trainee' && typeof destination === 'string' && destination.includes('/admin')) {
          destination = '/dashboard/trainee';
        } else if (result.user.role === 'admin' && typeof destination === 'string' && destination.includes('/trainee')) {
          destination = '/dashboard/admin';
        }

        if (destination && destination !== '/' && destination !== '/login') {
             navigate(destination, { replace: true });
        } else {
            if (result.user.role === 'admin') {
              navigate('/dashboard/admin', { replace: true });
            } else {
              navigate('/dashboard/trainee', { replace: true });
            }
        }
      } else {
        setError(result.message || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-page-root ${role}-theme`}>
      <div className="auth-split-container">
        
        {/* LEFT: Branding Visual Panel */}
        <div className="auth-visual-panel">
          <div className={`auth-visual-bg ${role}-theme`}></div>
          <div className="auth-visual-grid"></div>
          
          <div className="auth-visual-logo">
            <div className="logo-cube"></div>
            CMC Incubateur
          </div>

          <div className="auth-visual-content">
            <h1 className="auth-visual-title">
              {role === 'trainee' ? 'Transformez vos idées en startups.' : 'Pilotez l\'innovation de demain.'}
            </h1>
            <p className="auth-visual-desc">
              {role === 'trainee' 
                ? 'Accédez à votre espace stagiaire pour soumettre vos projets, suivre vos avancements, et collaborer avec vos mentors dans un environnement de pointe.'
                : 'Accédez au centre de contrôle administratif. Supervisez les soumissions, gérez les workflows et propulsez les meilleurs projets. Accès sécurisé.'
              }
            </p>
          </div>
        </div>

        {/* RIGHT: Interactive Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            
            {/* Mobile-only header (hidden on desktop split) */}
            <div className="auth-header-mobile">
              <div className="logo-cube" style={{ width: 48, height: 48 }}></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>CMC Incubateur</h2>
            </div>
            
            {/* Role Switcher */}
            <div className="auth-tabs">
              <button 
                type="button"
                className={`auth-tab ${role === 'trainee' ? 'active trainee' : ''}`}
                onClick={() => { setRole('trainee'); setError(''); setIdentifier(''); setPassword(''); }}
              >
                <IconUser /> Stagiaire
              </button>
              <button 
                type="button"
                className={`auth-tab ${role === 'admin' ? 'active admin' : ''}`}
                onClick={() => { setRole('admin'); setError(''); setIdentifier(''); setPassword(''); }}
              >
                <IconShield /> Administration
              </button>
            </div>

            {/* Login Box */}
            <div className="auth-form-body">
              <h2 className="auth-form-title">
                {role === 'trainee' ? 'Bienvenue dans votre espace' : 'Accès Administrateur'}
              </h2>
              <p className="auth-form-subtitle">
                {role === 'trainee' ? 'Connectez-vous avec votre Code CEF.' : 'Veuillez vous authentifier pour continuer.'}
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
                    {role === 'trainee' ? 'Code CEF (Identifiant unique)' : 'Adresse Email Professionnelle'}
                  </label>
                  <input
                    id="identifier"
                    type={role === 'trainee' ? 'text' : 'email'}
                    className="auth-input"
                    placeholder={role === 'trainee' ? 'Ex: 20240001' : 'admin@cmcbmk.ma'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    dir="ltr"
                  />
                </div>

                <div className="auth-input-group">
                  <label htmlFor="password" className="auth-label">Mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    dir="ltr"
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
