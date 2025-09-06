import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Assuming a global css file exists for tailwind or other base styles
// import './index.css'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
