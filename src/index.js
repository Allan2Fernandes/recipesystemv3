import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StandardErrorBoundary from "./ErrorHandling/StandardErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StandardErrorBoundary>
        <App />
    </StandardErrorBoundary>
);
