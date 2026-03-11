import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRoute = ({ allowedRole, allowedRoles, children }) => {
  const { currentRole } = useAuth();

  // Support both single role and array of roles
  const roles = allowedRoles || (allowedRole ? [allowedRole] : []);

  if (!roles.includes(currentRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
