import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Perfil = ({ onClose }) => {
  const { user, updateUserProfile, deleteUserAccount } = useAuth();
  
  // Estados para el formulario de edición
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    password: '',
    confirmPassword: ''
  });
  
  // Estados para mensajes y validación
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    // Validar teléfono (opcional)
    if (formData.telefono && !/^[0-9+\s-]{0,15}$/.test(formData.telefono)) {
      newErrors.telefono = 'El formato del teléfono no es válido';
    }
    
    // Validar contraseña y confirmación (solo si se está cambiando)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Preparar los datos para enviar (eliminar campos que no necesitamos)
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || null
      };
      
      // Añadir contraseña solo si se ha ingresado una nueva
      if (formData.password) {
        dataToSend.password = formData.password;
      }
      
      const result = await updateUserProfile(dataToSend);
      
      if (result.success) {
        setAlertVariant('success');
        setAlertMessage('Perfil actualizado correctamente');
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else {
        setAlertVariant('danger');
        setAlertMessage(result.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setAlertVariant('danger');
      setAlertMessage('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    }
  };

  // Manejar eliminación de cuenta
  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await deleteUserAccount();
      
      if (result.success) {
        // No necesitamos hacer nada aquí ya que el hook useAuth
        // redirigirá al usuario al login después de eliminar la cuenta
      } else {
        setShowDeleteModal(false);
        setAlertVariant('danger');
        setAlertMessage(result.error || 'Error al eliminar la cuenta');
        setIsSubmitting(false);
      }
    } catch (error) {
      setShowDeleteModal(false);
      setAlertVariant('danger');
      setAlertMessage('Error al eliminar la cuenta');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-user-circle me-2"></i>
          Mi Perfil
        </h5>
        <Button variant="outline-light" size="sm" onClick={onClose}>
          <i className="fas fa-times me-1"></i>
          Cerrar
        </Button>
      </Card.Header>
      
      <Card.Body>
        {alertMessage && (
          <Alert variant={alertVariant} dismissible onClose={() => setAlertMessage(null)}>
            {alertMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  isInvalid={!!errors.telefono}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.telefono}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Campo opcional
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  type="text"
                  value={user?.rol === 'Admin' ? 'Administrador' : user?.rol === 'Tec' ? 'Técnico' : 'Agricultor'}
                  disabled
                />
                <Form.Text className="text-muted">
                  El rol no se puede cambiar
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <hr className="my-4" />
          
          <h5>Cambiar Contraseña</h5>
          <p className="text-muted small">Deja estos campos en blanco si no deseas cambiar tu contraseña</p>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="fas fa-trash-alt me-1"></i>
              Eliminar mi cuenta
            </Button>
            
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-1"></i>
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
      
      {/* Modal de confirmación para eliminar cuenta */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Eliminar cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <p className="fw-bold">¿Estás seguro de que deseas eliminar tu cuenta?</p>
          <p>Esta acción no se puede deshacer. Se eliminarán todos tus datos, incluyendo:</p>
          <ul>
            <li>Información personal</li>
            <li>Registros de cultivos</li>
            <li>Registros de producción</li>
            <li>Cuadernos de campo</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar mi cuenta"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Perfil;