import React from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UsuariosList from './UsuariosList';
import { useAdmin } from '../hooks/useAdmin';

const Admin = () => {
  const navigate = useNavigate();
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

  // Función para volver a la pantalla principal
  const volverAPrincipal = () => {
    navigate('/principal');
  };

  // Renderizado de las cards de estadísticas
  const renderStats = () => {
    return (
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
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
              <Button 
                variant="primary" 
                className="mt-2"
                onClick={volverAPrincipal}
                style={{ backgroundColor: 'var(--success-green)', borderColor: 'var(--success-green)' }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Volver al Inicio
              </Button>
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
              <Row className="mb-4 justify-content-center">
                <Col md={6}>
                  <Button 
                    variant={activeSection === 'usuarios' ? 'accent-brown' : 'outline-accent-brown'} 
                    className={`w-100 ${activeSection === 'usuarios' ? 'text-light' : 'text-accent-brown'}`}
                    onClick={() => changeSection('usuarios')}
                  >
                    <i className="fas fa-users me-2"></i>
                    Gestión de Usuarios
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