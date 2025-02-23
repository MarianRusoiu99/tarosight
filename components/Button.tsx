import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 