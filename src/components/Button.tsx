import React from 'react';
import { Link } from 'react-router-dom';
type ButtonProps = {
  children: React.ReactNode;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'outline';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};
export function Button({
  children,
  to,
  type = 'button',
  variant = 'outline',
  className = '',
  onClick,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 uppercase tracking-wide text-sm border-2 border-text/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage';
  const variantClasses = 'text-text hover:bg-sage/10';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const classes = `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`;
  if (to) {
    return <Link to={to} className={classes} {...props}>
        {children}
      </Link>;
  }
  return <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>;
}