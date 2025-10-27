import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-xs font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-2.5 py-1.5 rounded-lg text-xs
            bg-gradient-to-br from-dark-900/70 to-dark-800/60 border text-gray-100
            ${error ? 'border-red-500/60' : 'border-dark-600/60'}
            focus:outline-none focus:ring-2
            ${error ? 'focus:ring-red-500/30 focus:border-red-500' : 'focus:ring-primary-500/30 focus:border-primary-500'}
            backdrop-blur-sm
            shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]
            hover:border-dark-500/80
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y
            font-mono text-xs leading-relaxed
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-dark-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
