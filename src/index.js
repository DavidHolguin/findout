import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres que tu app funcione offline y se cargue más rápido, puedes cambiar
// unregister() por register(). Ten en cuenta que esto viene con algunas advertencias.
// Aprende más sobre service workers: https://cra.link/PWA
serviceWorkerRegistration.register();