import "./styles/index.css";
// src/main.tsx (or src/index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App'; // Adjust path if different
import { OSShakeProvider } from './context/OSShakeContext'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OSShakeProvider> {/* Wrap your entire App with the OSShakeProvider */}
      <App />
    </OSShakeProvider>
  </React.StrictMode>,
);