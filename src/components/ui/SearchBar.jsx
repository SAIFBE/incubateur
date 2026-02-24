import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none rtl:left-auto rtl:right-3" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-surface-300 bg-white
          text-surface-800 placeholder:text-surface-400
          focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none
          transition-all duration-200"
                aria-label={placeholder}
            />
        </div>
    );
}
