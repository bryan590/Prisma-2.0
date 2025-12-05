import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'dark' | 'secondary' | 'accent';
  className?: string;
  icon?: boolean;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon = true,
  iconPosition = 'right',
  onClick 
}) => {
  let paddingClass = "px-6";
  
  if (variant === 'primary' && icon) {
    paddingClass = iconPosition === 'left' ? "pl-2 pr-6" : "pl-6 pr-2";
  } else if (variant === 'accent' && icon) {
    paddingClass = iconPosition === 'left' ? "pl-2 pr-6" : "pl-6 pr-2";
  } else if (variant === 'outline' || variant === 'dark' || variant === 'secondary') {
    paddingClass = "px-6";
  }

  const baseStyles = `inline-flex items-center justify-center ${paddingClass} py-2 rounded-full font-medium transition-all duration-300 text-sm md:text-base group select-none`;
  
  const variants = {
    primary: "bg-white border border-gray-200 text-greta-dark shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:border-greta-green/30",
    outline: "border border-greta-dark text-greta-dark hover:bg-greta-dark hover:text-white pr-6",
    dark: "bg-greta-dark text-white hover:bg-black shadow-lg", 
    secondary: "bg-gray-100 text-greta-dark hover:bg-gray-200 border border-transparent",
    accent: "bg-[#00D084] text-white hover:bg-[#00b06f] shadow-md hover:shadow-lg border border-transparent",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {icon && (variant === 'primary' || variant === 'accent') && iconPosition === 'left' && (
        <span className={`${variant === 'accent' ? 'bg-white text-greta-green' : 'bg-greta-green text-white'} rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 mr-3`}>
           <ArrowUpRight size={16} strokeWidth={2.5} />
        </span>
      )}
      
      <span>{children}</span>
      
      {icon && (variant === 'primary' || variant === 'accent') && iconPosition === 'right' && (
        <span className={`${variant === 'accent' ? 'bg-white text-greta-green' : 'bg-greta-green text-white'} rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 ml-3`}>
           <ArrowUpRight size={16} strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
};

export default Button;