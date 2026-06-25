import React, { forwardRef, useId } from 'react';

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
  const generatedId = useId();
  const inputId = id || generatedId;

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
