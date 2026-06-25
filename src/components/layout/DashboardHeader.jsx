import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';

const IconMenu = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconGlobe = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const DashboardHeader = ({ onMenuClick }) => {
  const { theme, setTheme } = useUI();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
        >
          <IconMenu />
        </button>
      </div>

      <div className="header-actions">
        <div className="theme-switcher" aria-label="Mode d'affichage">
          <button
            type="button"
            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
            title="Mode clair"
          >
            <Sun size={17} />
          </button>
          <button
            type="button"
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
            title="Mode sombre"
          >
            <Moon size={17} />
          </button>
        </div>

        <button
          className="header-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <IconBell />
          <span className="header-badge"></span>
        </button>

        <a href="/" target="_blank" rel="noopener noreferrer" className="header-btn" title="Voir le site public">
          <IconGlobe />
        </a>
      </div>
    </header>
  );
};

export default DashboardHeader;
