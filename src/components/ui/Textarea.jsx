import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label, 
  error, 
  id, 
  className = '', 
  containerClass = '',
  required,
  rows = 4,
  ...props 
}, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group ${containerClass}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={`form-control ${error ? 'border-danger' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
