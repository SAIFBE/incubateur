import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  id, 
  className = '', 
  containerClass = '',
  required,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group ${containerClass}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`form-control ${error ? 'border-danger' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;