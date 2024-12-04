import React from 'react';
import { Toaster } from 'react-hot-toast';

const Notification = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          theme: {
            primary: '#4caf50',
          },
        },
        error: {
          duration: 4000,
          theme: {
            primary: '#f44336',
          },
        },
      }}
    />
  );
};

export default Notification;

