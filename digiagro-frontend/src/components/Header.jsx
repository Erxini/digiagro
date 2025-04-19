import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo_3.png';

function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  // Comprobamos si estamos en las rutas admin o principal
  const isAuthenticatedRoute = location.pathname === '/admin' || location.pathname === '/principal';
  
  // Si estamos autenticados y en una ruta autenticada, mostramos "Salir", de lo contrario "Login"
  const buttonText = isAuthenticatedRoute ? 'Salir' : 'Login';
  // Si estamos autenticados, ejecutamos logout al hacer clic, de lo contrario redirigimos a login
  const buttonAction = isAuthenticatedRoute ? logout : null;
  const buttonLink = isAuthenticatedRoute ? '/' : '/login';

  return (
    <header
      className="d-flex align-items-center justify-content-between px-4 fixed-top bg-primary-green"
      style={{ height: '120px' }}
    >
      <Link to="/">
        <img src={logo} alt="Logo" style={{ height: '90px', cursor: 'pointer' }} />
      </Link>
      <nav>
        <ul className="nav">
          <li className="nav-item">
            <Link
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '20px' }}
              to="/calendario"
            >
              Calendario
            </Link>
          </li>
          <li className="nav-item">
            <a
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '20px' }}
              href="#nosotros"
            >
              Nosotros
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link btn me-2 bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '20px' }}
              href="#galeria"
            >
              Meteorología
            </a>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link btn bg-secondary-gold text-accent-brown"
              style={{ padding: '5px 10px', fontSize: '20px' }}
              to={buttonLink}
              onClick={buttonAction}
            >
              {buttonText}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;