import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { obtenerInfoCultivo, obtenerCultivosDisponibles } from '../services/externalApiService';

const Calendario = () => {
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState('');
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cultivosDisponibles, setCultivosDisponibles] = useState([]);

  // Cargamos la lista de cultivos disponibles al iniciar
  useEffect(() => {
    const cargarCultivos = async () => {
      try {
        setLoading(true);
        const cultivos = await obtenerCultivosDisponibles();
        setCultivosDisponibles(cultivos);
      } catch (err) {
        console.error('Error al cargar la lista de cultivos:', err);
        setError('No se pudo cargar la lista de cultivos disponibles');
      } finally {
        setLoading(false);
      }
    };
    
    cargarCultivos();
  }, []);

  const handleChange = async (e) => {
    const nombreCultivo = e.target.value;
    setCultivoSeleccionado(nombreCultivo);
    setInfo(null);
    setError('');

    if (!nombreCultivo) return;

    try {
      setLoading(true);
      const resultado = await obtenerInfoCultivo(nombreCultivo);
      setInfo(resultado);
    } catch (err) {
      console.error('Error al obtener datos del cultivo:', err);
      setError(`No se pudo obtener información sobre ${nombreCultivo}. Por favor, inténtelo de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  // Función para capitalizar el nombre del cultivo
  const capitalizarNombre = (nombre) => {
    if (!nombre) return '';
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  };

  return (
    <>
      <div style={{ marginTop: '130px', marginBottom: '2rem' }}>
        <Container fluid className="px-5">
          <Card className="shadow-sm mb-4 bg-secondary-light">
            <Card.Body>
              <h2 className="text-center mb-4 text-success fs-3">
                <i className="fas fa-seedling me-2"></i>
                Calendario de Cultivos
              </h2>
              <p className="text-muted text-center mb-4">
                Consulta información sobre periodos de siembra, abonado y recolección de diferentes cultivos.
                <br />
              </p>

              <Row className="justify-content-center mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Select
                      value={cultivoSeleccionado}
                      onChange={handleChange}
                      className="form-select mb-3"
                      disabled={loading || cultivosDisponibles.length === 0}
                    >
                      <option value="">Seleccionar cultivo</option>
                      {cultivosDisponibles.map((nombre) => (
                        <option key={nombre} value={nombre}>
                          {capitalizarNombre(nombre)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {error && (
                <Alert variant="warning" className="text-center">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {loading && (
                <div className="text-center p-4">
                  <Spinner animation="border" variant="success" role="status">
                    <span className="visually-hidden">Cargando información...</span>
                  </Spinner>
                  <p className="mt-2">Cargando información del cultivo...</p>
                </div>
              )}

              {info && (
                <Card className="shadow border-success">
                  <Row className="g-0">
                    <Col md={4}>
                      {info.imagen ? (
                        <img 
                          src={info.imagen} 
                          className="img-fluid rounded-start h-100 object-fit-cover" 
                          alt={info.nombre || cultivoSeleccionado} 
                          style={{ maxHeight: '300px' }}
                        />
                      ) : (
                        <div className="bg-light h-100 d-flex align-items-center justify-content-center">
                          <i className="fas fa-seedling fa-5x text-success"></i>
                        </div>
                      )}
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title className="fs-3 mb-4 border-bottom pb-2">
                          {info.nombre || capitalizarNombre(cultivoSeleccionado)}
                        </Card.Title>
                        
                        <div className="mb-3">
                          <h5 className="d-flex align-items-center">
                            <i className="fas fa-seedling me-2 text-success"></i> 
                            Siembra
                          </h5>
                          <p className="ms-4 mb-3">{info.siembra || "No disponible"}</p>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="d-flex align-items-center">
                            <i className="fas fa-hand-holding-water me-2 text-primary"></i>
                            Abonado
                          </h5>
                          <p className="ms-4 mb-3">{info.abonado || "No disponible"}</p>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="d-flex align-items-center">
                            <i className="fas fa-carrot me-2 text-warning"></i>
                            Recolección
                          </h5>
                          <p className="ms-4">{info.recoleccion || "No disponible"}</p>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                  
                  {info.fuentes && (
                    <div className="bg-light px-3 py-2 border-top">
                      <small className="text-muted d-block text-center">
                        <strong>Fuentes de información:</strong> {info.fuentes.join(' | ')}
                      </small>
                    </div>
                  )}
                </Card>
              )}

              {!cultivoSeleccionado && !loading && !error && !info && (
                <Alert variant="info" className="text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  Selecciona un cultivo para ver información sobre sus ciclos de cultivo.
                </Alert>
              )}
              
              <div className="text-center mt-4">
                <Badge bg="success" className="p-2">
                  <i className="fas fa-calendar-alt me-1"></i>
                  Datos actualizados: Abril 2025
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default Calendario;
