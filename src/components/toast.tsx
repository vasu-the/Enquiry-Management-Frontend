import React from 'react';

const Toast: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => {
  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
      {message}
    </div>
  );
};

export default Toast;
