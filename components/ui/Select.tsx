import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options?: SelectOption[];
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      options,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Custom dropdown icon */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <i className="fas fa-chevron-down text-[9px] text-dark-400" />
          </div>
          
          <select
            ref={ref}
            className={`
              w-full px-2.5 py-1.5 pr-7 rounded-lg text-xs font-medium
              bg-gradient-to-br from-dark-900/90 to-dark-800/80 border text-gray-100
              ${error ? 'border-red-500/60' : 'border-dark-600/60'}
              focus:outline-none focus:ring-2
              ${error ? 'focus:ring-red-500/30' : 'focus:ring-primary-500/30 focus:border-primary-500/50'}
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3)]
              hover:border-dark-500/60 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.4)]
              transition-all duration-200 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              appearance-none backdrop-blur-sm
              ${className}
            `}
            {...props}
          >
            {options ? (
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon ? `${opt.icon} ` : ''}{opt.label}
                </option>
              ))
            ) : (
              children
            )}
          </select>
        </div>
        {error && (
          <p className="mt-1 text-[10px] text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
