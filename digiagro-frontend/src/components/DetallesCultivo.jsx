import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Spinner, Alert, ListGroup, Badge, Button, Image, Overlay } from 'react-bootstrap';
import { obtenerInfoCultivo } from '../services/externalApiService';

/**
 * Componente que muestra detalles de un cultivo 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.cultivoTipo - Nombre del cultivo a mostrar
 * @param {function} props.onClose - Función para cerrar el componente
 * @returns {JSX.Element} - Componente DetallesCultivo
 */
const DetallesCultivo = ({ cultivoTipo, onClose }) => {
  const [cultivoInfo, setCultivoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enfocado, setEnfocado] = useState(false);
  const [imagenExpandida, setImagenExpandida] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchCultivoInfo = async () => {
      if (!cultivoTipo) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const info = await obtenerInfoCultivo(cultivoTipo);
        setCultivoInfo(info);
        // Aplicamos enfoque automáticamente después de cargar los datos
        setTimeout(() => setEnfocado(true), 300);
      } catch (err) {
        console.error('Error al obtener información del cultivo:', err);
        setError('No se pudo obtener información para este cultivo. Por favor, inténtelo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCultivoInfo();
    
    // Efecto de desenfoque al desmontar el componente
    return () => setEnfocado(false);
  }, [cultivoTipo]);

  // Manejador para expandir/contraer la imagen
  const toggleImagenExpandida = () => {
    setImagenExpandida(!imagenExpandida);
  };

  // Manejador para cerrar la imagen expandida con Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && imagenExpandida) {
        setImagenExpandida(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [imagenExpandida]);

  if (isLoading) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h5 className="mb-0">
            Cargando información de {cultivoTipo}
          </h5>
          <Button variant="outline-light" size="sm" onClick={onClose}>
            <i className="fas fa-times me-1"></i>
            Cerrar
          </Button>
        </Card.Header>
        <Card.Body className="text-center p-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Consultando bases de datos agrícolas...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h5 className="mb-0">
            {cultivoTipo}
          </h5>
          <Button variant="outline-light" size="sm" onClick={onClose}>
            <i className="fas fa-times me-1"></i>
            Cerrar
          </Button>
        </Card.Header>
        <Card.Body>
          <Alert variant="danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // Si no hay información del cultivo, mostramos un mensaje
  if (!cultivoInfo) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h5 className="mb-0">
            {cultivoTipo}
          </h5>
          <Button variant="outline-light" size="sm" onClick={onClose}>
            <i className="fas fa-times me-1"></i>
            Cerrar
          </Button>
        </Card.Header>
        <Card.Body>
          <Alert variant="warning">
            No se encontró información para este cultivo.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // Capitalizar primera letra del nombre
  const nombreMostrado = cultivoInfo.nombre 
    ? cultivoInfo.nombre.charAt(0).toUpperCase() + cultivoInfo.nombre.slice(1) 
    : cultivoTipo.charAt(0).toUpperCase() + cultivoTipo.slice(1);

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
        <h5 className="mb-0">
          {nombreMostrado}
          {cultivoInfo?.nombreCientifico && (
            <small className="ms-2 fst-italic">({cultivoInfo.nombreCientifico})</small>
          )}
        </h5>
        <Button variant="outline-light" size="sm" onClick={onClose}>
          <i className="fas fa-times me-1"></i>
          Cerrar
        </Button>
      </Card.Header>
      
      <Card.Body>
        <Row>
          {cultivoInfo?.imagen && (
            <Col md={4} className="mb-3 mb-md-0">
              <div className="position-relative">
                <Image 
                  src={cultivoInfo.imagen} 
                  alt={nombreMostrado} 
                  thumbnail
                  className="w-100" 
                  style={{height: '250px', objectFit: 'cover'}}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${window.location.origin}/src/assets/logo_3.png`;
                  }}
                  onClick={toggleImagenExpandida}
                  ref={imageRef}
                />
                <div className="mt-2 text-muted small">
                  <i className="fas fa-camera me-1"></i>
                  Imagen de referencia
                </div>
                <Overlay target={imageRef.current} show={imagenExpandida} placement="right">
                  {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div
                      {...props}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 10px',
                        color: 'black',
                        borderRadius: 3,
                        ...props.style,
                      }}
                    >
                      <Image 
                        src={cultivoInfo.imagen} 
                        alt={nombreMostrado} 
                        thumbnail
                        className="w-100" 
                        style={{height: '500px', objectFit: 'cover'}}
                      />
                    </div>
                  )}
                </Overlay>
              </div>
            </Col>
          )}
          
          <Col md={cultivoInfo?.imagen ? 8 : 12}>
            {cultivoInfo?.descripcion && (
              <Card.Text className="mb-3">
                {cultivoInfo.descripcion}
              </Card.Text>
            )}
            
            <h6 className="text-success mb-3">
              <i className="fas fa-info-circle me-2"></i>
              Información de cultivo
            </h6>
            
            <ListGroup variant="flush" className="border-top border-bottom mb-3">
              <ListGroup.Item>
                <strong>Siembra: </strong> {cultivoInfo?.siembra}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Riego: </strong> {cultivoInfo?.riego}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Abonado: </strong> {cultivoInfo?.abonado}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Recolección: </strong> {cultivoInfo?.recoleccion}
              </ListGroup.Item>
              {cultivoInfo?.ciclo && (
                <ListGroup.Item>
                  <strong>Ciclo: </strong> {cultivoInfo.ciclo}
                </ListGroup.Item>
              )}
            </ListGroup>
            
            {cultivoInfo?.fuentes && cultivoInfo.fuentes.length > 0 && (
              <>
                <h6 className="text-muted mt-4 mb-2">
                  <i className="fas fa-book me-2"></i>
                  Fuentes de información
                </h6>
                <div>
                  {cultivoInfo.fuentes.map((fuente, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                      {fuente}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
      
      <Card.Footer className="bg-light">
        <small className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Los datos mostrados pueden variar según la región y variedad específica del cultivo.
        </small>
      </Card.Footer>
    </Card>
  );
};

export default DetallesCultivo;