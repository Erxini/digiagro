import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import logo from '../assets/logo_10.png';
import '../App.css'; 

function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // Inicializar authState como false para mostrar siempre "Acceso" al cargar la página
  const [authState, setAuthState] = useState(false);
  
  // Determinar texto y acción del botón basado en si el usuario está autenticado
  const buttonText = authState ? 'Salir' : 'Acceso';
  const buttonAction = authState ? logout : null;
  const buttonLink = authState ? '/' : '/login';

  // Verificar si estamos en una página que no sea la principal
  const showGestionButton = authState && 
    !['/principal', '/', '/login'].includes(location.pathname);

  // Efecto para verificar el estado de autenticación después de la carga inicial
  useEffect(() => {
    // Pequeño retraso para asegurar que la autenticación se verifique después de la carga inicial
    const timer = setTimeout(() => {
      setAuthState(isAuthenticated);
    }, 100);
    
    // Función para manejar cambios en el estado de autenticación
    const handleAuthChange = (event) => {
      console.log("Evento de autenticación recibido:", event.detail);
      setAuthState(event.detail.isAuthenticated);
    };
    
    // Suscribirse al evento personalizado
    window.addEventListener('authStateChanged', handleAuthChange);
    
    // Limpieza al desmontar
    return () => {
      clearTimeout(timer);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between px-4 fixed-top bg-primary-green"
      style={{ height: '125px' }}
    >
      <Link to="/">
        <img src={logo} alt="Logo" style={{ height: '90px', cursor: 'pointer', marginTop: '35px' }} />
      </Link>
      
      {/* Botón hamburguesa visible en pantallas pequeñas */}
      <button 
        className="navbar-toggler d-md-none"
        type="button"
        onClick={toggleMenu}
        aria-expanded={menuOpen ? "true" : "false"}
        aria-label="Toggle navigation"
        style={{ background: 'none', border: 'none', color: 'white' }}
      >
        <i className="fas fa-bars fa-2x text-secondary-gold"></i>
      </button>

      {/* Navegación normal para pantallas >= sm */}
      <nav className="d-none d-md-block">
        <ul className="nav justify-content-end" style={{ listStyle: 'none', paddingTop: '65px' }}>
          {/* Botón de Gestión para usuarios autenticados (solo visible si no estamos en /principal) */}
          {showGestionButton && (
            <li className="nav-item">
              <Link
                className="nav-link btn me-2 bg-success text-white"
                style={{ padding: '5px 10px', fontSize: '15px' }}
                to="/principal"
              >
                <i className="fas fa-tachometer-alt me-1"></i>
                Gestión
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '15px' }}
              to="/cuaderno"
            >
              Cuaderno de Campo
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '15px' }}
              to="/calendario"
            >
              Calendario
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '15px' }}
              to="/meteorologia"
            >
              Meteorología
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link btn bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '15px' }}
              to={buttonLink}
              onClick={buttonAction}
            >
              {buttonText}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Menú hamburguesa desplegado para pantallas pequeñas */}
      {menuOpen && (
        <div className="position-absolute bg-primary-green p-3 shadow-lg" 
             style={{ 
               top: '125px', 
               left: 0, 
               right: 0, 
               zIndex: 1000,
               animation: 'fadeIn 0.3s ease-in-out'
             }}>
          <ul className="nav flex-column" style={{ listStyle: 'none' }}>
            {/* Botón de Gestión para usuarios autenticados en versión móvil */}
            {showGestionButton && (
              <li className="nav-item mb-2">
                <Link
                  className="nav-link btn w-100 bg-success text-white"
                  style={{ padding: '10px', fontSize: '16px' }}
                  to="/principal"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-tachometer-alt me-1"></i>
                  Gestión
                </Link>
              </li>
            )}
            <li className="nav-item mb-2">
              <Link
                className="nav-link btn w-100 bg-secondary-gold text-accent-brown"
                style={{ padding: '10px', fontSize: '16px' }}
                to="/cuaderno"
                onClick={() => setMenuOpen(false)}
              >
                Cuaderno de Campo
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link btn w-100 bg-secondary-gold text-accent-brown"
                style={{ padding: '10px', fontSize: '16px' }}
                to="/calendario"
                onClick={() => setMenuOpen(false)}
              >
                Calendario
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link btn w-100 bg-secondary-gold text-accent-brown"
                style={{ padding: '10px', fontSize: '16px' }}
                to="/meteorologia"
                onClick={() => setMenuOpen(false)}
              >
                Meteorología
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link btn w-100 bg-secondary-gold text-accent-brown"
                style={{ padding: '10px', fontSize: '16px' }}
                to={buttonLink}
                onClick={(e) => {
                  setMenuOpen(false);
                  if (buttonAction) buttonAction(e);
                }}
              >
                {buttonText}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;