import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

// Limpiar localStorage al cargar la aplicación para forzar el inicio de sesión
// Solo mantener configuraciones que no sean de autenticación
const cleanAuthentication = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Llamar a la función de limpieza al cargar la página
cleanAuthentication();

// Exponer las librerías globalmente para que puedan ser utilizadas por otros componentes
window.jspdf = { jsPDF };
window.XLSX = XLSX;
window.FileSaver = FileSaver;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
