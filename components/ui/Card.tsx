import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'bordered';
}

export function Card({
  children,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const variants = {
    default: `
      bg-gradient-to-br from-dark-800/70 to-dark-900/60 
      border border-dark-700/60
      shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]
      hover:border-dark-600/70
      transition-all duration-300
    `,
    glass: `
      bg-gradient-to-br from-dark-800/50 to-dark-900/40 
      backdrop-blur-xl 
      border border-dark-700/40
      shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.03)]
      hover:border-dark-600/60
      transition-all duration-300
    `,
    bordered: `
      bg-transparent 
      border-2 border-dark-700/70
      shadow-[inset_0_0_0_1px_rgba(59,130,246,0.05)]
      hover:border-dark-600/90
      hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)]
      transition-all duration-300
    `,
  };

  return (
    <div
      className={`
        rounded-xl relative
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-3 pb-2 border-b border-dark-700/50 relative ${className}`}
      {...props}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      
      <div>
        <h3 className="text-xs font-bold text-gray-100 tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-dark-400 mt-0.5 font-medium">{subtitle}</p>
        )}
      </div>
      {action && <div className="relative z-10">{action}</div>}
    </div>
  );
}
