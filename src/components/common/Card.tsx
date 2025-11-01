import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card = ({ children, variant = 'default', className, ...props }: CardProps) => {
  const variants = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
  };

  return (
    <div className={clsx('rounded-lg p-6', variants[variant], className)} {...props}>
      {children}
    </div>
  );
};
