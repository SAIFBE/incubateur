import { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    error,
    options = [],
    className = '',
    id,
    placeholder,
    ...props
}, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-surface-700">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                id={selectId}
                className={`
          w-full px-4 py-2.5 rounded-xl border bg-white text-surface-800
          transition-all duration-200 appearance-none cursor-pointer
          focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none
          ${error ? 'border-danger-500 focus:ring-danger-500' : 'border-surface-300'}
        `}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25rem',
                }}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-danger-500" role="alert">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
export default Select;
