import { HTMLAttributes, ReactNode } from 'react';

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Section({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
  ...props
}: SectionProps) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      <div className="flex items-center justify-between pb-1.5 border-b border-dark-700/50 relative">
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        
        <div className="flex items-center gap-2">
          {icon && (
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded blur-sm" />
              <i className={`${icon} text-primary-400 text-xs relative`} />
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-gray-100 tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-dark-400 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="relative z-10">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
