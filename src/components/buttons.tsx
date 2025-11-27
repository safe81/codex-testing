import React from 'react';
import { primaryButton, secondaryButton, ghostButton, successButton } from '../styles/buttonStyles';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export function PrimaryButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`${primaryButton} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`${secondaryButton} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function SuccessButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`${successButton} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function GhostButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`${ghostButton} ${className}`} {...props}>
      {children}
    </button>
  );
}
