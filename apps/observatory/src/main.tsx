import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import '@touchstone/themes/styles.css';
import '@touchstone/atoms/styles.css';
import '@touchstone/molecules/styles.css';
import '@touchstone/organisms/styles.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('root element missing');

document.body.style.margin = '0';
document.body.style.minHeight = '100vh';
document.body.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
