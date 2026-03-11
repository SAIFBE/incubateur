import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title, message, type = 'success', duration = 3000 }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast-message toast-${toast.type} animate-fade-in`}>
              <div className="toast-icon">
                {toast.type === 'success' && '✓'}
                {toast.type === 'error' && '✕'}
                {toast.type === 'info' && 'i'}
              </div>
              <div className="toast-content">
                {toast.title && <h4 className="toast-title">{toast.title}</h4>}
                {toast.message && <p className="toast-desc">{toast.message}</p>}
              </div>
              <button 
                className="toast-close" 
                onClick={() => removeToast(toast.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
      
      <style>{`
        .toast-container {
          position: fixed;
          bottom: var(--spacing-lg);
          right: var(--spacing-lg);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          pointer-events: none;
        }
        
        .toast-message {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-left: 4px solid var(--color-primary);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          width: 320px;
          pointer-events: auto;
          backdrop-filter: blur(10px);
        }
        
        .toast-success { border-left-color: var(--color-success); }
        .toast-error { border-left-color: var(--color-danger); }
        .toast-info { border-left-color: var(--color-info); }
        
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-weight: bold;
          font-size: 0.75rem;
          color: white;
          flex-shrink: 0;
        }
        
        .toast-success .toast-icon { background: var(--color-success); }
        .toast-error .toast-icon { background: var(--color-danger); }
        .toast-info .toast-icon { background: var(--color-info); }
        
        .toast-content {
          flex: 1;
        }
        
        .toast-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0 0 2px 0;
        }
        
        .toast-desc {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin: 0;
        }
        
        .toast-close {
          background: transparent;
          border: none;
          color: var(--color-text-tertiary);
          cursor: pointer;
          font-size: 0.875rem;
          padding: 4px;
          border-radius: var(--radius-sm);
        }
        
        .toast-close:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
