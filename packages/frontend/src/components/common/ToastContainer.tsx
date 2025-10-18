import React from 'react';
import { ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer: React.FC = () => {
  return (
    <ReactToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        marginTop: '20px',
      }}
      toastStyle={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        minHeight: '64px',
      }}
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
      )}
    />
  );
};

export default ToastContainer;