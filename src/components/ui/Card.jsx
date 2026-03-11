import React from 'react';

// Using the same Card.jsx that might already exist, but ensuring our structure
// We will overwrite if it exists to match the dashboard design.
const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, action }) => {
  if (title || action) {
    return (
      <div className={`card-header ${className}`}>
        {title && <h3 className="card-title">{title}</h3>}
        {action && <div>{action}</div>}
        {children}
      </div>
    );
  }
  return <div className={`card-header ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

export default Card;