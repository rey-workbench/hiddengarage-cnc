import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center rounded-lg font-semibold 
      transition-all duration-300 
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-95
    `;
    
    const variants = {
      primary: `
        bg-gradient-to-br from-primary-500 to-primary-600 
        hover:from-primary-400 hover:to-primary-500
        text-white 
        shadow-[0_4px_12px_rgba(59,130,246,0.25)]
        hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]
        hover:-translate-y-0.5
        border border-primary-700/50
      `,
      secondary: `
        bg-gradient-to-br from-dark-700 to-dark-800 
        hover:from-dark-600 hover:to-dark-700
        text-gray-100 
        border border-dark-600/60
        hover:border-dark-500/80
        shadow-[0_2px_8px_rgba(0,0,0,0.2)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
        hover:-translate-y-0.5
      `,
      danger: `
        bg-gradient-to-br from-red-500 to-red-600 
        hover:from-red-400 hover:to-red-500
        text-white 
        shadow-[0_4px_12px_rgba(239,68,68,0.25)]
        hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]
        hover:-translate-y-0.5
        border border-red-700/50
      `,
      ghost: `
        hover:bg-gradient-to-br hover:from-dark-800/50 hover:to-dark-900/50
        text-gray-300 hover:text-gray-100
        hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
      `,
      outline: `
        border border-dark-600/70 
        hover:border-primary-500/80 
        hover:bg-gradient-to-br hover:from-primary-500/10 hover:to-primary-600/5
        text-gray-300 hover:text-primary-300
        backdrop-blur-sm
        hover:shadow-[0_0_16px_rgba(59,130,246,0.15)]
      `,
    };

    const sizes = {
      sm: 'px-2 py-1 text-[10px] gap-1',
      md: 'px-3 py-1.5 text-xs gap-1.5',
      lg: 'px-4 py-2 text-sm gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
