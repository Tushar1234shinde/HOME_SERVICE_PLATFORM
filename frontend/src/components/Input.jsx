import React from 'react';
import './Input.css';

const Input = React.forwardRef(({ 
  label, 
  error, 
  id, 
  type = 'text', 
  fullWidth = true,
  className = '',
  leftIcon,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const inputContainerClass = `input-container ${fullWidth ? 'input-full' : ''} ${className}`;
  const inputClass = `input-field ${error ? 'input-error' : ''} ${leftIcon ? 'has-left-icon' : ''}`;

  return (
    <div className={inputContainerClass}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
        <input 
          id={inputId} 
          ref={ref} 
          type={type} 
          className={inputClass} 
          {...props} 
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
