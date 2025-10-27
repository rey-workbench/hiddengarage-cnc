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
    <div className={`space-y-3 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <i className={`${icon} text-primary-400`} />}
          <div>
            <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
            {subtitle && (
              <p className="text-xs text-dark-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
