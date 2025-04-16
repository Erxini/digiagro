import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Principal = () => {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');

  // Efecto para obtener los datos del usuario desde localStorage si no están disponibles a través del hook
  useEffect(() => {
    if (user && user.nombre) {
      setUserName(user.nombre);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData.nombre) {
            setUserName(userData.nombre);
          }
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error);
        }
      }
    }
  }, [user]);

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1 className="text-center mb-4">Panel Principal</h1>
      <h4 className="text-center mb-4 text-success">Bienvenido: {userName || 'Usuario'}</h4>
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Información de Usuario</Card.Header>
            <Card.Body>
              <p>Has accedido como usuario. Desde aquí podrás gestionar tus cultivos y acceder a las funcionalidades de DigiAgro.</p>
              <p>Pronto estarán disponibles más opciones en este panel.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Próximamente</Card.Header>
            <Card.Body>
              <p>Estamos trabajando para añadir nuevas funcionalidades:</p>
              <ul>
                <li>Gestión de cultivos personales</li>
                <li>Monitoreo de riegos</li>
                <li>Estadísticas de producción</li>
                <li>Análisis de suelos</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Principal;