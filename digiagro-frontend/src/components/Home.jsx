import React from 'react';
import campo1 from '../assets/campo_1.jpg';
import campo2 from '../assets/campo_2.jpg';
import campo3 from '../assets/campo_3.jpeg';

function Home() {
  return (
    <>
      {/* Mensaje de bienvenida */}
      <div
        className="text-center py-4"
        style={{
          marginTop: '100px',
          padding: '20px 0',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>DIGIAGRO</h1>
        <p style={{ fontSize: '1.2rem' }}>Plataforma Para La Digitalización Agrícola En Pymes</p>
      </div>

      {/* Main Content */}
      <main className="container my-5">
        {/* Section 1 */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <h2>Eficiencia</h2>
            <p>
              En Digiagro, nos dedicamos a la digitalización agrícola, ayudando a las pequeñas y medianas empresas a optimizar sus procesos y mejorar su productividad. Nuestra plataforma ofrece herramientas avanzadas para la gestión de cultivos, seguimiento de datos meteorológicos y dosificación hídrica.
            </p>
          </div>
          <div className="col-md-6">
            <img src={campo1} alt="Descripción" className="img-fluid rounded" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <h2>Digitalización</h2>
            <p>
              En Digiagro, entendemos la importancia de la digitalización en el sector agrícola. Nuestra plataforma está diseñada para facilitar la adopción de tecnologías avanzadas, permitiendo a los agricultores tomar decisiones basadas en datos.
            </p>
          </div>
          <div className="col-md-6 order-md-1 mb-4">
            <img src={campo2} alt="Descripción" className="img-fluid rounded" />
          </div>
        </div>

        {/* Section 3 */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2>Ecología</h2>
            <p>
              En Digiagro, nos preocupamos por el medio ambiente. Nuestra plataforma promueve prácticas agrícolas sostenibles, ayudando a los agricultores a reducir su huella de carbono y a utilizar recursos de manera más eficiente.
            </p>
          </div>
          <div className="col-md-6 mt-4">
            <img src={campo3} alt="Descripción" className="img-fluid rounded" />
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;