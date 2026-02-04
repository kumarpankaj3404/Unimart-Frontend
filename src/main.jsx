import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import "./utils/fixLeafletIcon";
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { SocketProvider } from "./context/SocketContext";
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>,
)
