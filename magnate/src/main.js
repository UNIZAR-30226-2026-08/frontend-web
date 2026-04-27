import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// import './index.css'
import './styles/global.css';
import App from './App';
createRoot(document.getElementById('root')).render(
//<StrictMode>
_jsx(BrowserRouter, { children: _jsx(App, {}) })
//</StrictMode>,
);
