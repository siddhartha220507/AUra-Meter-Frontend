import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // YE BOHT ZAROORI HAI
import { Toaster } from 'react-hot-toast';
import { AuraProvider } from './context/AuraContext';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Router wrap hona chahiye yahan */}
    <BrowserRouter>
      <AuraProvider>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#16162a', // Premium dark
              color: '#fff',
              border: '0.5px solid rgba(255,255,255,0.1)',
            }
          }} 
        />
        <App />
      </AuraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);