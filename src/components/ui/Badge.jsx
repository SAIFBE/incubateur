import React from 'react';

const Badge = ({
  status,
  children,
  className = ''
}) => {
  const statusLabels = {
    pending: 'En attente',
    draft: 'Brouillon',
    submitted: 'Soumis',
    received: 'Recu',
    under_review: 'En etude',
    requires_changes: 'Modifications requises',
    revised: 'Revise',
    accepted: 'Accepte',
    selected: 'Selectionne',
    rejected: 'Refuse',
    account_requested: 'Compte demande',
    account_created: 'Compte cree',
    approved: 'Approuve',
    archived: 'Archive'
  };

  const label = children || statusLabels[status] || status;
  const statusClass = status ? `badge-${status}` : 'badge-draft';

  return (
    <span className={`badge ${statusClass} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
