import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' };
export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const base = 'btn';
  const ghost = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800';
  return <button className={`${variant === 'primary' ? base : ghost} ${className}`} {...props} />;
}
export default Button;