import React, { forwardRef, useId } from 'react';

const Select = forwardRef(({ 
  label, 
  error, 
  id, 
  className = '', 
  containerClass = '',
  required,
  options = [],
  placeholder = 'Sélectionner...',
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
      <select
        id={inputId}
        ref={ref}
        className={`form-control ${error ? 'border-danger' : ''} ${className}`}
        required={required}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
