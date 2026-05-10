import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Simple error boundary
const ErrorBoundary = ({ children }) => {
  return children;
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Force splash removal after 5 seconds
setTimeout(() => {
  const splash = document.getElementById('loading-splash');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  }
}, 5000);
