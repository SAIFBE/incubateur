import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, danger, ghost
  size = 'md', // sm, md
  className = '', 
  isLoading = false,
  disabled = false,
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="opacity-70">Chargement...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;