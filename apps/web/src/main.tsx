import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@dzone/shared-i18n';
import '@dzone/shared-styles/src/variables.css';
import '@dzone/shared-styles/src/global.css';
import App from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
