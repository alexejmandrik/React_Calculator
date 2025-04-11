import React from 'react';

interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
  additionalClassName?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, additionalClassName = '' }) => {
  const baseClass = "button";
  let typeClass = "button-default";
  if (['+', '-', '*', '/', '='].includes(label)) { typeClass = "button-operator"; }
  else if (['C', '⌫'].includes(label)) { typeClass = "button-special"; }
  const finalClassName = `${baseClass} ${typeClass} ${additionalClassName}`.trim();


  const handleClick = () => {
    console.log(`Button clicked: ${label}`);
    onClick(label);
  };

  return (
    <button
      onClick={handleClick} 
      className={finalClassName}
      aria-label={`Calculator button ${label}`}
    >
      {label}
    </button>
  );
};

export default Button;