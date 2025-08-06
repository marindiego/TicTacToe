import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const variantStyles = {
    primary: 'bg-[var(--primary)] hover:bg-blue-300',
    secondary: 'bg-[var(--secondary)] hover:bg-orange-300',
    tertiary : 'bg-[var(--tertiary)] hover:bg-gray-400',
  };

const Button = ({ children, className = '', variant = 'primary', ...props }: ButtonProps) => {
  const baseStyles = 'btn text-black font-bold rounded-2xl border-0';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;