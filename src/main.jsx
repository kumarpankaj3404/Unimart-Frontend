import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Tracking from './Pages/Tracking.jsx'
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import "./utils/fixLeafletIcon";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
