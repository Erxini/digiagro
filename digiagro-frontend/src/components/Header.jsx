import { Link } from 'react-router-dom';
import logo from '../assets/logo_3.png';

function Header() {
  return (
        <header
            className="d-flex align-items-center justify-content-between px-4 fixed-top"
            style={{ height: '120px', backgroundColor: '#4CAF50', color: 'black' }}
          >
            <Link to="/">
              <img src={logo} alt="Logo" style={{ height: '90px', cursor: 'pointer' }} />
            </Link>
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <a
                    className="nav-link btn me-2"
                    style={{ backgroundColor: '#DAA520', padding: '5px 10px', fontSize: '20px', color: '#A0522D' }}
                    href="#consejos"
                  >
                    Calendario
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link btn me-2"
                    style={{ backgroundColor: '#DAA520', padding: '5px 10px', fontSize: '20px', color: '#A0522D' }}
                    href="#nosotros"
                  >
                    Nosotros
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link btn me-2"
                    style={{ backgroundColor: '#DAA520', padding: '5px 10px', fontSize: '20px', color: '#A0522D' }}
                    href="#galeria"
                  >
                    Meteorología
                  </a>
                </li>
                <li className="nav-item">
            <Link
              className="nav-link btn"
              style={{ backgroundColor: '#DAA520', padding: '5px 10px', fontSize: '20px', color: '#A0522D' }}
              to="/login"
            >
              Login
            </Link>
          </li>
              </ul>
            </nav>
          </header>
  );
}

export default Header;