import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for toast events
    const handleToast = (event) => {
      const { type, message, duration = 3000 } = event.detail;
      const id = Date.now();
      
      setToasts(prev => [...prev, { id, type, message }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'info':
        return '#17a2b8';
      default:
        return '#17a2b8';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '12px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: getBackgroundColor(toast.type),
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <span style={{ fontSize: '20px' }}>
            {getIcon(toast.type)}
          </span>
          <span style={{ flex: 1, fontSize: '14px' }}>
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
            }}
          >
            <FaTimes />
          </button>
        </div>
      ))}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to trigger toasts
// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success: (message, duration) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message, duration } }));
  },
  error: (message, duration) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message, duration } }));
  },
  info: (message, duration) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', message, duration } }));
  },
};
