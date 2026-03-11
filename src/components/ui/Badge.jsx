import React from 'react';

const Badge = ({ 
  status, 
  children,
  className = '' 
}) => {
  // Translate common statuses for display
  const statusLabels = {
    draft: 'Brouillon',
    submitted: 'Soumis',
    received: 'Reçu',
    under_review: 'En cours d\'évaluation',
    requires_changes: 'Modifications requises',
    revised: 'Révisé',
    accepted: 'Accepté',
    rejected: 'Rejeté',
    archived: 'Archivé'
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