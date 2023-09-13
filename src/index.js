import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ErrorBoundary} from "react-error-boundary";
import ErrorPage from "./ErrorHandling/ErrorPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <ErrorBoundary fallback={<ErrorPage/>}>
            <App />
        </ErrorBoundary>
    </StrictMode>

);
