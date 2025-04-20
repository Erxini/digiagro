import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import logo from '../assets/logo_10.png';
import '../App.css'; 

function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Comprobamos si estamos en las rutas admin o principal
  const isAuthenticatedRoute = location.pathname === '/admin' || location.pathname === '/principal';
  
  // Si estamos autenticados y en una ruta autenticada, mostramos "Salir", de lo contrario "Login"
  const buttonText = isAuthenticatedRoute ? 'Salir' : 'Login';
  // Si estamos autenticados, ejecutamos logout al hacer clic, de lo contrario redirigimos a login
  const buttonAction = isAuthenticatedRoute ? logout : null;
  const buttonLink = isAuthenticatedRoute ? '/' : '/login';

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
      
      {/* Botón hamburguesa visible solo en pantallas pequeñas */}
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
          <li className="nav-item">
            <a
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '15px' }}
              href="#cuadernocampo"
            >
              Cuaderno de Campo
            </a>
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
            <li className="nav-item mb-2">
              <a
                className="nav-link btn w-100 bg-secondary-gold text-accent-brown"
                style={{ padding: '10px', fontSize: '16px' }}
                href="#cuadernocampo"
                onClick={() => setMenuOpen(false)}
              >
                Cuaderno de Campo
              </a>
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