import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { ToastProvider } from '../ui/Toast';

const DashboardLayout = ({ role }) => {
  const { currentRole, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extra security check beyond RoleRoute
  if (!isAuthenticated || currentRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ToastProvider>
      <div className="dashboard-root dashboard-layout">
        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 45, backdropFilter: 'blur(4px)' }}
          />
        )}
        
        <Sidebar 
          role={role} 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        
        <div className="dashboard-main">
          <DashboardHeader onMenuClick={toggleMobileMenu} />
          
          <main className="dashboard-content fade-in" id="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default DashboardLayout;
