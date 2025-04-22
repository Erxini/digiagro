import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import logo from '../assets/logo_10.png';
import '../App.css'; 

function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Determinar texto y acción del botón basado en si el usuario está autenticado
  const buttonText = isAuthenticated ? 'Salir' : 'Login';
  const buttonAction = isAuthenticated ? logout : null;
  const buttonLink = isAuthenticated ? '/' : '/login';

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