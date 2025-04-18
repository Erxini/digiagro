import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Badge, Alert } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import UsuariosList from './UsuariosList';

const Admin = () => {
  const { user } = useAuth();
  // Estados para almacenar datos y formularios
  const [usersData, setUsersData] = useState(null);
  const [cultivosData, setCultivosData] = useState(null);
  const [produccionData, setProduccionData] = useState(null);
  const [cultivoNombre, setCultivoNombre] = useState('');
  const [cultivoId, setCultivoId] = useState('');
  const [produccionCultivo, setProduccionCultivo] = useState('');
  const [produccionCantidad, setProduccionCantidad] = useState('');
  const [produccionCalidad, setProduccionCalidad] = useState('');
  const [produccionId, setProduccionId] = useState('');
  const [activeSection, setActiveSection] = useState('usuarios');
  const [adminName, setAdminName] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');

  // Hook para realizar peticiones a la API
  const { get, del, put } = useApi();

  // Efecto para obtener los datos del usuario desde localStorage si no están disponibles a través del hook
  useEffect(() => {
    if (user && user.nombre) {
      setAdminName(user.nombre);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData.nombre) {
            setAdminName(userData.nombre);
          }
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error);
        }
      }
    }
  }, [user]);

  // Mostrar mensaje de alerta y ocultarlo después de 5 segundos
  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Obtener estadísticas iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await listarUsuarios();
        await obtenerTodosCultivos();
        await obtenerTodasProducciones();
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Funciones para gestionar usuarios
  const listarUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await get('usuarios');
      setUsersData(response);
      setLastUpdate(new Date().toLocaleString());
      setIsLoading(false);
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      showAlert('Error al listar usuarios', 'danger');
      setIsLoading(false);
    }
  };

  // Funciones para gestionar cultivos
  const obtenerCultivoPorNombre = async () => {
    if (!cultivoNombre) {
      alert('Por favor, introduce un nombre de cultivo');
      return;
    }
    try {
      const response = await get(`/api/cultivos/nombre/${cultivoNombre}`);
      setCultivosData(response);
    } catch (error) {
      console.error('Error al obtener cultivo:', error);
      alert('Error al obtener cultivo');
    }
  };

  const obtenerTodosCultivos = async () => {
    try {
      const response = await get('cultivos');
      setCultivosData(response);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error al obtener cultivos:', error);
      showAlert('Error al obtener cultivos', 'danger');
    }
  };

  const eliminarTodosCultivos = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los cultivos? Esta acción no se puede deshacer.')) {
      try {
        await del('/api/cultivos');
        alert('Todos los cultivos han sido eliminados correctamente');
        setCultivosData([]); // Limpiar la lista de cultivos
      } catch (error) {
        console.error('Error al eliminar todos los cultivos:', error);
        alert('Error al eliminar todos los cultivos');
      }
    }
  };

  // Funciones para gestionar producción
  const obtenerProduccionPorCultivoYCantidad = async () => {
    if (!produccionCultivo || !produccionCantidad) {
      alert('Por favor, introduce un cultivo y una cantidad');
      return;
    }
    try {
      const response = await get(`/api/produccion/cultivo/${produccionCultivo}/cantidad/${produccionCantidad}`);
      setProduccionData(response);
    } catch (error) {
      console.error('Error al obtener producción:', error);
      alert('Error al obtener producción');
    }
  };

  const obtenerProduccionPorCultivoYCalidad = async () => {
    if (!produccionCultivo || !produccionCalidad) {
      alert('Por favor, introduce un cultivo y una calidad');
      return;
    }
    try {
      const response = await get(`/api/produccion/cultivo/${produccionCultivo}/calidad/${produccionCalidad}`);
      setProduccionData(response);
    } catch (error) {
      console.error('Error al obtener producción:', error);
      alert('Error al obtener producción');
    }
  };

  const obtenerTodasProducciones = async () => {
    try {
      const response = await get('produccion');
      setProduccionData(response);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error al obtener producciones:', error);
      showAlert('Error al obtener producciones', 'danger');
    }
  };

  const eliminarProduccion = async () => {
    if (!produccionId) {
      alert('Por favor, introduce un ID de producción');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar esta producción?')) {
      try {
        await del(`/api/produccion/${produccionId}`);
        alert('Producción eliminada correctamente');
        obtenerTodasProducciones(); // Actualizar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar producción:', error);
        alert('Error al eliminar producción');
      }
    }
  };

  const eliminarTodasProducciones = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODAS las producciones? Esta acción no se puede deshacer.')) {
      try {
        await del('/api/produccion');
        alert('Todas las producciones han sido eliminadas correctamente');
        setProduccionData([]); // Limpiar la lista de producciones
      } catch (error) {
        console.error('Error al eliminar todas las producciones:', error);
        alert('Error al eliminar todas las producciones');
      }
    }
  };

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
            onClose={() => setActiveSection(null)} 
            onRefresh={listarUsuarios}
          />
        );
      
      case 'cultivos':
        return (
          <Card className="mb-4">
            <Card.Header as="h5">Gestión de Cultivos</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Nombre del cultivo"
                      value={cultivoNombre}
                      onChange={(e) => setCultivoNombre(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Button variant="success" onClick={obtenerCultivoPorNombre} className="w-100">
                    Buscar por nombre
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button variant="success" onClick={obtenerTodosCultivos} className="w-100 mb-2">
                    Obtener todos los cultivos
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="success" onClick={eliminarTodosCultivos} className="w-100">
                    Eliminar todos los cultivos
                  </Button>
                </Col>
              </Row>
              
              {cultivosData && (
                <div className="mt-4">
                  <h6>Resultados:</h6>
                  <pre className="bg-light p-3 rounded" style={{ paddingLeft: '300px', paddingRight: '300px' }}>
                    {JSON.stringify(cultivosData, null, 2)}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      
      case 'produccion':
        return (
          <Card className="mb-4">
            <Card.Header as="h5">Gestión de Producción</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="ID del cultivo"
                      value={produccionCultivo}
                      onChange={(e) => setProduccionCultivo(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Cantidad"
                      value={produccionCantidad}
                      onChange={(e) => setProduccionCantidad(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Button variant="warning" onClick={obtenerProduccionPorCultivoYCantidad} className="w-100">
                    Buscar por cultivo y cantidad
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="ID del cultivo"
                      value={produccionCultivo}
                      onChange={(e) => setProduccionCultivo(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Calidad"
                      value={produccionCalidad}
                      onChange={(e) => setProduccionCalidad(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Button variant="warning" onClick={obtenerProduccionPorCultivoYCalidad} className="w-100">
                    Buscar por cultivo y calidad
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button variant="warning" onClick={obtenerTodasProducciones} className="w-100 mb-2">
                    Obtener todas las producciones
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="ID de producción"
                      value={produccionId}
                      onChange={(e) => setProduccionId(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Button variant="warning" onClick={eliminarProduccion} className="w-100">
                    Eliminar producción
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="warning" onClick={eliminarTodasProducciones} className="w-100">
                    Eliminar todas las producciones
                  </Button>
                </Col>
              </Row>
              
              {produccionData && (
                <div className="mt-4">
                  <h6>Resultados:</h6>
                  <pre className="bg-light p-3 rounded" style={{ paddingLeft: '300px', paddingRight: '300px' }}>
                    {JSON.stringify(produccionData, null, 2)}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
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
                    onClick={() => setActiveSection('usuarios')}
                  >
                    <i className="fas fa-users me-2"></i>
                    Gestión de Usuarios
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant={activeSection === 'cultivos' ? 'success' : 'outline-success'} 
                    className="w-100"
                    onClick={() => setActiveSection('cultivos')}
                  >
                    <i className="fas fa-seedling me-2"></i>
                    Gestión de Cultivos
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant={activeSection === 'produccion' ? 'warning' : 'outline-warning'} 
                    className="w-100"
                    onClick={() => setActiveSection('produccion')}
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