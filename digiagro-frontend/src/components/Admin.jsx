import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

const Admin = () => {
  const { user } = useAuth();
  // Estados para almacenar datos y formularios
  const [usersData, setUsersData] = useState(null);
  const [cultivosData, setCultivosData] = useState(null);
  const [produccionData, setProduccionData] = useState(null);
  const [searchUserName, setSearchUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [cultivoNombre, setCultivoNombre] = useState('');
  const [cultivoId, setCultivoId] = useState('');
  const [produccionCultivo, setProduccionCultivo] = useState('');
  const [produccionCantidad, setProduccionCantidad] = useState('');
  const [produccionCalidad, setProduccionCalidad] = useState('');
  const [produccionId, setProduccionId] = useState('');
  const [activeSection, setActiveSection] = useState('usuarios');
  const [adminName, setAdminName] = useState('');

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

  // Funciones para gestionar usuarios
  const listarUsuarios = async () => {
    try {
      const response = await get('/api/usuarios');
      setUsersData(response);
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      alert('Error al listar usuarios');
    }
  };

  const buscarUsuarioPorNombre = async () => {
    if (!searchUserName) {
      alert('Por favor, introduce un nombre de usuario');
      return;
    }
    try {
      const response = await get(`/api/usuarios/nombre/${searchUserName}`);
      setUsersData(response);
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      alert('Error al buscar usuario');
    }
  };

  const editarUsuario = async () => {
    if (!userId) {
      alert('Por favor, introduce un ID de usuario');
      return;
    }
    // Esta función redirigirá a un formulario de edición o mostrará un modal
    alert('Función para editar usuario con ID: ' + userId);
  };

  const eliminarUsuario = async () => {
    if (!userId) {
      alert('Por favor, introduce un ID de usuario');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await del(`/api/usuarios/${userId}`);
        alert('Usuario eliminado correctamente');
        listarUsuarios(); // Actualizar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const eliminarTodosUsuarios = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los usuarios? Esta acción no se puede deshacer.')) {
      try {
        await del('/api/usuarios');
        alert('Todos los usuarios han sido eliminados correctamente');
        setUsersData([]); // Limpiar la lista de usuarios
      } catch (error) {
        console.error('Error al eliminar todos los usuarios:', error);
        alert('Error al eliminar todos los usuarios');
      }
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
      const response = await get('/api/cultivos');
      setCultivosData(response);
    } catch (error) {
      console.error('Error al obtener cultivos:', error);
      alert('Error al obtener cultivos');
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
      const response = await get('/api/produccion');
      setProduccionData(response);
    } catch (error) {
      console.error('Error al obtener producciones:', error);
      alert('Error al obtener producciones');
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

  // Renderizado condicional según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        return (
          <Card className="mb-4">
            <Card.Header as="h5">Gestión de Usuarios</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Button variant="primary" onClick={listarUsuarios} className="w-100 mb-2">
                    Listar todos los usuarios
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Nombre de usuario"
                      value={searchUserName}
                      onChange={(e) => setSearchUserName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Button variant="info" onClick={buscarUsuarioPorNombre} className="w-100">
                    Buscar por nombre
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="ID de usuario"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2">
                    <Button variant="warning" onClick={editarUsuario} className="flex-grow-1">
                      Editar
                    </Button>
                    <Button variant="danger" onClick={eliminarUsuario} className="flex-grow-1">
                      Eliminar
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="danger" onClick={eliminarTodosUsuarios} className="w-100">
                    Eliminar todos los usuarios
                  </Button>
                </Col>
              </Row>
              
              {usersData && (
                <div className="mt-4">
                  <h6>Resultados:</h6>
                  <pre className="bg-light p-3 rounded" style={{ paddingLeft: '300px', paddingRight: '300px' }}>
                    {JSON.stringify(usersData, null, 2)}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
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
                  <Button variant="info" onClick={obtenerCultivoPorNombre} className="w-100">
                    Buscar por nombre
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button variant="primary" onClick={obtenerTodosCultivos} className="w-100 mb-2">
                    Obtener todos los cultivos
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="danger" onClick={eliminarTodosCultivos} className="w-100">
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
                  <Button variant="info" onClick={obtenerProduccionPorCultivoYCantidad} className="w-100">
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
                  <Button variant="info" onClick={obtenerProduccionPorCultivoYCalidad} className="w-100">
                    Buscar por cultivo y calidad
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button variant="primary" onClick={obtenerTodasProducciones} className="w-100 mb-2">
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
                  <Button variant="danger" onClick={eliminarProduccion} className="w-100">
                    Eliminar producción
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="danger" onClick={eliminarTodasProducciones} className="w-100">
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
    <Container style={{ marginTop: '2rem', marginBottom: '2rem', paddingLeft: '300px', paddingRight: '300px' }}>
      <h1 className="text-center mb-4">Panel de Administración</h1>
      <h4 className="text-center mb-4 text-success">Bienvenido/a: {adminName || 'Administrador'}</h4>
      
      <Row className="mb-4">
        <Col md={4}>
          <Button 
            variant={activeSection === 'usuarios' ? 'primary' : 'outline-primary'} 
            className="w-100"
            onClick={() => setActiveSection('usuarios')}
          >
            Gestión de Usuarios
          </Button>
        </Col>
        <Col md={4}>
          <Button 
            variant={activeSection === 'cultivos' ? 'primary' : 'outline-primary'} 
            className="w-100"
            onClick={() => setActiveSection('cultivos')}
          >
            Gestión de Cultivos
          </Button>
        </Col>
        <Col md={4}>
          <Button 
            variant={activeSection === 'produccion' ? 'primary' : 'outline-primary'} 
            className="w-100"
            onClick={() => setActiveSection('produccion')}
          >
            Gestión de Producción
          </Button>
        </Col>
      </Row>
      
      {renderContent()}
    </Container>
  );
};

export default Admin;