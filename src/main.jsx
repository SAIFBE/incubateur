import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/index.js';
import './index.css';
import App from './App.jsx';
import './styles/theme-light.css';

const storedTheme = localStorage.getItem('cmc_incubator_theme');
const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
