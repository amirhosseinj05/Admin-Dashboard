import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Global libraries first (Bootstrap styles/icons), then app styles last
// so our custom rules can override the framework defaults.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/responsive.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
