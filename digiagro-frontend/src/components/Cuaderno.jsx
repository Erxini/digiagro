import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Cuaderno.css';

const Cuaderno = () => {
  const [tipoNormativa, setTipoNormativa] = useState('ecologico');
  const [calculadora, setCalculadora] = useState({
    producto: '',
    superficie: 0,
    cultivo: '',
    tipoProducto: 'ecologico',
  });
  const [resultado, setResultado] = useState(null);

  // Datos de ejemplo de productos permitidos
  const productosPermitidos = {
    ecologico: [
      { 
        nombre: 'Azufre', 
        descripcion: 'Fungicida de origen natural permitido en agricultura ecológica.',
        dosis: 5, // kg por hectárea
        cultivos: ['tomate', 'vid', 'frutales'] 
      },
      { 
        nombre: 'Bacillus thuringiensis', 
        descripcion: 'Insecticida biológico eficaz contra larvas de lepidópteros.',
        dosis: 0.5, // kg por hectárea
        cultivos: ['hortalizas', 'frutales', 'olivo'] 
      },
      { 
        nombre: 'Cobre (hidróxido)', 
        descripcion: 'Fungicida para el control de enfermedades en cultivos ecológicos.',
        dosis: 2, // kg por hectárea
        cultivos: ['patata', 'tomate', 'vid', 'frutales'] 
      },
      { 
        nombre: 'Jabón potásico', 
        descripcion: 'Insecticida y fungicida para control de plagas de cuerpo blando.',
        dosis: 10, // litros por hectárea
        cultivos: ['hortalizas', 'frutales', 'ornamentales'] 
      },
      { 
        nombre: 'Extracto de ortiga', 
        descripcion: 'Fortificante vegetal que refuerza las defensas naturales de las plantas.',
        dosis: 3, // litros por hectárea
        cultivos: ['hortalizas', 'aromáticas', 'ornamentales'] 
      }
    ],
    convencional: [
      { 
        nombre: 'Glifosato', 
        descripcion: 'Herbicida sistémico no selectivo utilizado para eliminar hierbas y arbustos.',
        dosis: 3, // litros por hectárea
        cultivos: ['cereales', 'frutales', 'viñedos'] 
      },
      { 
        nombre: 'Mancozeb', 
        descripcion: 'Fungicida de contacto para prevención de enfermedades fúngicas.',
        dosis: 2, // kg por hectárea
        cultivos: ['tomate', 'patata', 'vid', 'frutales'] 
      },
      { 
        nombre: 'Deltametrina', 
        descripcion: 'Insecticida piretroide para el control de insectos plaga.',
        dosis: 0.125, // litros por hectárea
        cultivos: ['hortalizas', 'frutales', 'cereales', 'cítricos'] 
      },
      { 
        nombre: 'Penconazol', 
        descripcion: 'Fungicida sistémico para control de oídio y otras enfermedades fúngicas.',
        dosis: 0.25, // litros por hectárea
        cultivos: ['cucurbitáceas', 'vid', 'frutales', 'ornamentales'] 
      },
      { 
        nombre: 'Clorpirifos', 
        descripcion: 'Insecticida organofosforado de amplio espectro para control de plagas.',
        dosis: 2, // litros por hectárea
        cultivos: ['cítricos', 'frutales', 'olivo'] 
      }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalculadora({
      ...calculadora,
      [name]: name === 'superficie' ? parseFloat(value) || 0 : value
    });
  };

  const calcularDosis = () => {
    const { producto, superficie, tipoProducto } = calculadora;
    const productoSeleccionado = productosPermitidos[tipoProducto].find(p => p.nombre === producto);
    
    if (!productoSeleccionado) {
      setResultado({
        error: 'Producto no encontrado. Por favor, selecciona un producto válido.'
      });
      return;
    }

    // Convertir superficie de metros cuadrados a hectáreas (1 hectárea = 10000 m²)
    const hectareas = superficie / 10000;
    const cantidadTotal = productoSeleccionado.dosis * hectareas;
    
    setResultado({
      producto: productoSeleccionado,
      superficie,
      cantidadTotal,
      unidad: productoSeleccionado.nombre.includes('Extracto') || 
              productoSeleccionado.nombre.includes('Glifosato') || 
              productoSeleccionado.nombre.includes('Deltametrina') || 
              productoSeleccionado.nombre.includes('Penconazol') || 
              productoSeleccionado.nombre.includes('Clorpirifos') ? 'litros' : 'kg'
    });
  };

  return (
    <Container className="cuaderno-container">
      <div className="cuaderno-page">
        <div className="cuaderno-content">
          {/* <h1 className="cuaderno-title">Cuaderno de Campo Digital</h1> */}
          
          <section className="cuaderno-section">
          <h1 className="cuaderno-title">¿Qué es un Cuaderno de Campo?</h1>
            <p>
              El Cuaderno de Campo es un registro obligatorio para la gestión agrícola que documenta
              todas las operaciones realizadas en los cultivos. Este documento es fundamental para:
            </p>
            <ul>
              <li>Cumplir con la normativa europea sobre trazabilidad agrícola</li>
              <li>Registrar el uso de productos fitosanitarios</li>
              <li>Documentar prácticas de cultivo sostenibles</li>
              <li>Optimizar la gestión de recursos en la explotación</li>
            </ul>
            
            <div className="text-center">
              <img 
                src="/src/assets/campo_5.jpg" 
                alt="Campo agrícola" 
                className="imagen-seccion" 
              />
            </div>
          </section>

          <section className="cuaderno-section">
            <h2>Normativa sobre Productos Permitidos</h2>
            
            <div className="normativa-tabs">
              <button 
                className={`normativa-tab ${tipoNormativa === 'ecologico' ? 'active' : ''}`} 
                onClick={() => setTipoNormativa('ecologico')}
              >
                Agricultura Ecológica
              </button>
              <button 
                className={`normativa-tab ${tipoNormativa === 'convencional' ? 'active' : ''}`} 
                onClick={() => setTipoNormativa('convencional')}
              >
                Agricultura Convencional
              </button>
            </div>
            
            <div className={`normativa-content bg-${tipoNormativa}`}>
              {tipoNormativa === 'ecologico' ? (
                <>
                  <h3>Normativa EU para Agricultura Ecológica</h3>
                  <p>
                    La agricultura ecológica en la Unión Europea está regulada principalmente por el 
                    Reglamento (UE) 2018/848, que establece los principios, objetivos y normas generales 
                    de la producción ecológica y define cómo los productos ecológicos deben ser etiquetados.
                  </p>
                  <p>
                    Los productos permitidos para la agricultura ecológica deben:
                  </p>
                  <ul>
                    <li>Ser de origen natural (minerales, vegetales o animales)</li>
                    <li>No contener sustancias sintéticas ni organismos modificados genéticamente</li>
                    <li>Estar incluidos en la lista positiva del Anexo I del Reglamento (CE) 889/2008</li>
                    <li>Utilizarse según las dosis y condiciones especificadas en la normativa</li>
                  </ul>
                  
                  <h4>Productos Autorizados:</h4>
                  <div className="producto-list">
                    {productosPermitidos.ecologico.map((producto, index) => (
                      <div key={index} className="producto-item">
                        <h5>{producto.nombre}</h5>
                        <p>{producto.descripcion}</p>
                        <p>
                          <strong>Dosis máxima:</strong> {producto.dosis} {producto.nombre.includes('Extracto') ? 'litros' : 'kg'}/hectárea
                        </p>
                        <p>
                          <strong>Cultivos autorizados:</strong> {producto.cultivos.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3>Normativa EU para Agricultura Convencional</h3>
                  <p>
                    La agricultura convencional en la Unión Europea está regulada principalmente por el 
                    Reglamento (CE) 1107/2009 sobre la comercialización de productos fitosanitarios y la 
                    Directiva 2009/128/CE que establece el marco para un uso sostenible de los plaguicidas.
                  </p>
                  <p>
                    Para los productos fitosanitarios convencionales:
                  </p>
                  <ul>
                    <li>Deben estar autorizados por las autoridades competentes del país</li>
                    <li>Deben utilizarse de acuerdo con las Buenas Prácticas Agrícolas</li>
                    <li>Están sujetos a un Límite Máximo de Residuos (LMR) en alimentos</li>
                    <li>Su aplicación debe ser registrada en el cuaderno de campo</li>
                  </ul>
                  
                  <h4>Productos Autorizados:</h4>
                  <div className="producto-list">
                    {productosPermitidos.convencional.map((producto, index) => (
                      <div key={index} className="producto-item">
                        <h5>{producto.nombre}</h5>
                        <p>{producto.descripcion}</p>
                        <p>
                          <strong>Dosis máxima:</strong> {producto.dosis} {
                            producto.nombre.includes('Glifosato') || 
                            producto.nombre.includes('Deltametrina') || 
                            producto.nombre.includes('Penconazol') || 
                            producto.nombre.includes('Clorpirifos') ? 'litros' : 'kg'
                          }/hectárea
                        </p>
                        <p>
                          <strong>Cultivos autorizados:</strong> {producto.cultivos.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
          
          <section className="cuaderno-section">
            <h2>Calculadora de Dosis</h2>
            <p>
              Utiliza esta calculadora para determinar la cantidad exacta de producto a aplicar 
              según la superficie de tu cultivo:
            </p>
            
            <div className="calculadora">
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de agricultura</Form.Label>
                      <Form.Select 
                        name="tipoProducto"
                        value={calculadora.tipoProducto} 
                        onChange={handleInputChange}
                      >
                        <option value="ecologico">Ecológica</option>
                        <option value="convencional">Convencional</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Producto</Form.Label>
                      <Form.Select 
                        name="producto"
                        value={calculadora.producto} 
                        onChange={handleInputChange}
                      >
                        <option value="">Selecciona un producto</option>
                        {productosPermitidos[calculadora.tipoProducto].map((producto, index) => (
                          <option key={index} value={producto.nombre}>
                            {producto.nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Superficie (m²)</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="superficie"
                        value={calculadora.superficie} 
                        onChange={handleInputChange}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cultivo</Form.Label>
                      <Form.Select 
                        name="cultivo"
                        value={calculadora.cultivo} 
                        onChange={handleInputChange}
                      >
                        <option value="">Selecciona un cultivo</option>
                        <option value="tomate">Tomate</option>
                        <option value="patata">Patata</option>
                        <option value="vid">Uva</option>
                        <option value="frutales">Frutales</option>
                        <option value="hortalizas">Hortalizas</option>
                        <option value="cereales">Cereales</option>
                        <option value="olivo">Olivo</option>
                        <option value="cítricos">Cítricos</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    onClick={calcularDosis}
                    disabled={!calculadora.producto || !calculadora.superficie}
                  >
                    Calcular Dosis
                  </Button>
                </div>
              </Form>
              
              {resultado && !resultado.error && (
                <div className="resultado">
                  <h4>Resultado:</h4>
                  <p>Para una superficie de {resultado.superficie} m², necesitas:</p>
                  <Alert variant="success">
                    <strong>{resultado.cantidadTotal.toFixed(2)} {resultado.unidad}</strong> de {resultado.producto.nombre}
                  </Alert>
                  <p>
                    <strong>Dosis por hectárea:</strong> {resultado.producto.dosis} {resultado.unidad}/ha
                  </p>
                  <p>
                    <strong>Recomendaciones:</strong> Aplicar según las indicaciones del fabricante y
                    respetando los plazos de seguridad. Utilizar el equipo de protección adecuado durante 
                    la aplicación.
                  </p>
                </div>
              )}
              
              {resultado && resultado.error && (
                <Alert variant="danger" className="mt-3">
                  {resultado.error}
                </Alert>
              )}
            </div>
          </section>
          
          <section className="cuaderno-section">
            <h2>Buenas Prácticas Agrícolas</h2>
            <p>
              Para garantizar una agricultura sostenible y responsable, te recomendamos seguir estas buenas prácticas:
            </p>
            <ul>
              <li>Realizar análisis de suelo periódicos para aplicar los productos adecuados</li>
              <li>Respetar los plazos de seguridad antes de la cosecha</li>
              <li>Alternar productos para evitar la aparición de resistencias</li>
              <li>Aplicar los productos en las condiciones meteorológicas adecuadas</li>
              <li>Mantener un registro detallado de todas las aplicaciones realizadas</li>
              <li>Gestionar los envases vacíos a través de los sistemas de recogida autorizados</li>
            </ul>
            
            <div className="text-center">
              <img 
                src="/src/assets/campo_6.jpg" 
                alt="Agricultura sostenible" 
                className="imagen-seccion" 
              />
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default Cuaderno;