import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  const cardClass = `card glass-panel ${hoverable ? 'card-hoverable' : ''} ${className}`;
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
