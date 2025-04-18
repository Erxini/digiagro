import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import CultivosList from './CultivosList';
import ProduccionList from './ProduccionList';
import RiegosList from './RiegosList';
import SuelosList from './SuelosList';
import { usePrincipal } from '../hooks/usePrincipal';

const Principal = () => {
  const { 
    cultivosData, 
    riegosData,
    sueloData,
    produccionData,
    activeSection,
    userName,
    lastUpdate,
    isLoading,
    alertMessage,
    alertType,
    obtenerCultivos,
    obtenerRiegos,
    obtenerSuelos,
    obtenerProducciones,
    showAlert,
    changeSection,
    setAlertMessage
  } = usePrincipal();

  // Renderizado de las cards de estadísticas
  const renderStats = () => {
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="success" text="white">
            <Card.Body>
              <Card.Title><i className="fas fa-seedling mr-2"></i> Cultivos</Card.Title>
              <h2>{cultivosData ? cultivosData.length : 0}</h2>
              <Card.Text>Total de cultivos registrados</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="primary" text="white">
            <Card.Body>
              <Card.Title><i className="fas fa-tint mr-2"></i> Riegos</Card.Title>
              <h2>{riegosData ? riegosData.length : 0}</h2>
              <Card.Text>Total de riegos registrados</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="accent-brown" text="light">
            <Card.Body>
              <Card.Title><i className="fas fa-mountain mr-2"></i> Suelos</Card.Title>
              <h2>{sueloData ? sueloData.length : 0}</h2>
              <Card.Text>Total de análisis de suelo</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="warning" text="dark">
            <Card.Body>
              <Card.Title><i className="fas fa-chart-line mr-2"></i> Producción</Card.Title>
              <h2>{produccionData ? produccionData.length : 0}</h2>
              <Card.Text>Total de registros de producción</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    );
  };

  // Renderizado condicional según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'cultivos':
        return (
          <CultivosList 
            cultivos={cultivosData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerCultivos}
          />
        );
      
      case 'riegos':
        return (
          <RiegosList 
            riegos={riegosData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerRiegos}
          />
        );
      
      case 'suelos':
        return (
          <SuelosList 
            suelos={sueloData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerSuelos}
          />
        );
      
      case 'produccion':
        return (
          <ProduccionList 
            producciones={produccionData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerProducciones}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Container fluid className="px-4" style={{ marginTop: '130px', marginBottom: '2rem' }}>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col>
              <h1 className="mb-0">Profesionales</h1>
              <p className="text-muted">Gestión de DigiAgro para usuarios</p>
            </Col>
            <Col className="text-end">
              <h4 className="text-success">
                <i className="fas fa-user me-2"></i>
                Bienvenido/a: {userName || 'Usuario'}
              </h4>
              <p className="text-muted">
                <i className="fas fa-calendar me-2"></i>
                {new Date().toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {alertMessage && (
        <Alert variant={alertType} dismissible onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos, por favor espere...</p>
        </div>
      ) : (
        <>
          {renderStats()}
          
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="mb-4">
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'cultivos' ? 'success' : 'outline-success'} 
                    className="w-100"
                    onClick={() => changeSection('cultivos')}
                  >
                    <i className="fas fa-seedling me-2"></i>
                    Gestión de Cultivos
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'riegos' ? 'primary' : 'outline-primary'} 
                    className="w-100"
                    onClick={() => changeSection('riegos')}
                  >
                    <i className="fas fa-tint me-2"></i>
                    Gestión de Riegos
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'suelos' ? 'accent-brown' : 'outline-accent-brown'} 
                    className={`w-100 ${activeSection === 'suelos' ? 'text-light' : 'text-accent-brown'}`}
                    onClick={() => changeSection('suelos')}
                  >
                    <i className="fas fa-mountain me-2"></i>
                    Gestión de Suelos
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'produccion' ? 'warning' : 'outline-warning'} 
                    className="w-100"
                    onClick={() => changeSection('produccion')}
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    Gestión de Producción
                  </Button>
                </Col>
              </Row>
              
              {renderContent()}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Principal;