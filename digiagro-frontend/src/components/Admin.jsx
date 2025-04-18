import React from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import UsuariosList from './UsuariosList';
import CultivosList from './CultivosList';
import ProduccionList from './ProduccionList';
import { useAdmin } from '../hooks/useAdmin';

const Admin = () => {
  const { 
    usersData,
    cultivosData, 
    produccionData,
    activeSection,
    adminName,
    lastUpdate,
    isLoading,
    alertMessage,
    alertType,
    listarUsuarios,
    obtenerTodosCultivos,
    obtenerTodasProducciones,
    showAlert,
    changeSection,
    setAlertMessage
  } = useAdmin();

  // Renderizado de las cards de estadísticas
  const renderStats = () => {
    return (
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center mb-3 h-100" bg="accent-brown" text="light">
            <Card.Body>
              <Card.Title><i className="fas fa-users mr-2"></i> Usuarios</Card.Title>
              <h2>{usersData ? usersData.length : 0}</h2>
              <Card.Text>Total de usuarios registrados</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
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
        <Col md={4}>
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
      case 'usuarios':
        return (
          <UsuariosList 
            usuarios={usersData} 
            onClose={() => changeSection(null)} 
            onRefresh={listarUsuarios}
          />
        );
      
      case 'cultivos':
        return (
          <CultivosList 
            cultivos={cultivosData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerTodosCultivos}
          />
        );
      
      case 'produccion':
        return (
          <ProduccionList 
            producciones={produccionData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerTodasProducciones}
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
              <h1 className="mb-0">Panel de Administración</h1>
              <p className="text-muted">Gestión completa de DigiAgro</p>
            </Col>
            <Col className="text-end">
              <h4 className="text-success">
                <i className="fas fa-user-shield me-2"></i>
                Bienvenido/a: {adminName || 'Administrador'}
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
                <Col md={4}>
                  <Button 
                    variant={activeSection === 'usuarios' ? 'accent-brown' : 'outline-accent-brown'} 
                    className={`w-100 ${activeSection === 'usuarios' ? 'text-light' : 'text-accent-brown'}`}
                    onClick={() => changeSection('usuarios')}
                  >
                    <i className="fas fa-users me-2"></i>
                    Gestión de Usuarios
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant={activeSection === 'cultivos' ? 'success' : 'outline-success'} 
                    className="w-100"
                    onClick={() => changeSection('cultivos')}
                  >
                    <i className="fas fa-seedling me-2"></i>
                    Gestión de Cultivos
                  </Button>
                </Col>
                <Col md={4}>
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

export default Admin;