function Footer() {
  return (
    <footer className="bg-warning bg-gradient py-4 px-3 bg-opacity-50 w-100">
      <div className="container">
        <div className="row">
          {/* Columna 1 */}
          <div className="col-md-4 text-start">
            <h5>Redes Sociales</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark d-flex align-items-center"
                >
                  <i className="fab fa-linkedin me-2"></i> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark d-flex align-items-center"
                >
                  <i className="fab fa-facebook me-2"></i> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark d-flex align-items-center"
                >
                  <i className="fab fa-instagram me-2"></i> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark d-flex align-items-center"
                >
                  <i className="fab fa-youtube me-2"></i> Youtube
                </a>
              </li>
              <li>
                <a
                  href="https://www.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark d-flex align-items-center"
                >
                  <i className="fab fa-whatsapp me-2"></i> WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div className="col-md-4 text-start">
            <h5>Contacto</h5>
            <ul className="list-unstyled">
              <li>Digiagro</li>
              <li>Talavera de la Reina</li>
              <li>Avd. Real Fábrica de Sedas, s/n</li>
              <li>Teléfono: 925808080</li>
              <li>digiagro@digiagro.com</li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="col-md-4 text-start">
            <h5>Páginas de Interés</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://apliagri.castillalamancha.es/pac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark text-decoration-none"
                >
                  https://apliagri.castillalamancha.es
                </a>
              </li>
              <li>
                <a
                  href="https://www.fedeto.es/lonja/cereales.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark text-decoration-none"
                >
                  https://www.fedeto.es
                </a>
              </li>
              <li>
                <a
                  href="https://agroecologia.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark text-decoration-none"
                >
                  https://agroecologia.net
                </a>
              </li>
              <li>
                <a
                  href="https://www.mapa.gob.es/es/alimentacion/temas/produccion-eco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark text-decoration-none"
                >
                  https://www.mapa.gob.es
                </a>
              </li>
              <li>
                <a
                  href="https://www.aemet.es/es/eltiempo/prediccion/espana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark text-decoration-none"
                >
                  https://www.aemet.es
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;