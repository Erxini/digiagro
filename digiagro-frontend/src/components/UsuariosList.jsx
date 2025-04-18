import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';

const UsuariosList = ({ usuarios, onClose, onRefresh }) => {
  const [sortedUsuarios, setSortedUsuarios] = useState([]);
  const [sortField, setSortField] = useState('id_usuario');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: ''
  });
  const [createForm, setCreateForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'Agri'
  });
  const [formErrors, setFormErrors] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  
  const { del, put, post } = useApi();

  // Inicializar usuarios ordenados cuando cambia la prop de usuarios
  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      handleSort(sortField, sortDirection);
    } else {
      setSortedUsuarios([]);
    }
  }, [usuarios]);

  // Función para ordenar usuarios
  const handleSort = (field, direction = sortDirection) => {
    if (!usuarios) return;
    
    const sortedData = [...usuarios].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setSortedUsuarios(sortedData);
    setSortField(field);
  };

  // Cambiar dirección de ordenamiento
  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    handleSort(sortField, newDirection);
  };

  // Renderizar indicador de ordenamiento
  const renderSortIndicator = (field) => {
    if (sortField === field) {
      return <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>;
    }
    return <i className="fas fa-sort ms-1 text-muted"></i>;
  };

  // Filtrar usuarios por término de búsqueda
  const filteredUsuarios = sortedUsuarios.filter(usuario => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      usuario.id_usuario.toString().includes(term) ||
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term) ||
      (usuario.telefono && usuario.telefono.toLowerCase().includes(term)) ||
      usuario.rol.toLowerCase().includes(term)
    );
  });

  // Función para mapear el rol a un texto más descriptivo y un color
  const getRolBadge = (rol) => {
    switch (rol) {
      case 'Admin':
        return <span className="badge bg-danger-subtle text-dark">Administrador</span>;
      case 'Tec':
        return <span className="badge bg-primary-subtle text-dark">Técnico</span>;
      case 'Agri':
        return <span className="badge bg-success-subtle text-dark">Agricultor</span>;
      default:
        return <span className="badge bg-secondary">{rol}</span>;
    }
  };

  // Eliminar usuario
  const handleDeleteUsuario = async () => {
    if (!selectedUsuario) return;
    
    try {
      await del(`usuarios/${selectedUsuario.id_usuario}`);
      setShowDeleteModal(false);
      setSelectedUsuario(null);
      
      // Refrescar la lista de usuarios después de eliminar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario.');
    }
  };

  // Eliminar todos los usuarios
  const handleDeleteAllUsuarios = async () => {
    try {
      await del('usuarios');
      setShowDeleteAllModal(false);
      
      // Refrescar la lista de usuarios después de eliminar todos
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar todos los usuarios:', error);
      alert('Error al eliminar todos los usuarios.');
    }
  };

  // Abrir modal de edición
  const handleEditUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setEditForm({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono || '',
      rol: usuario.rol
    });
    setShowEditModal(true);
  };

  // Actualizar usuario
  const handleUpdateUsuario = async () => {
    if (!selectedUsuario) return;

    // Validar formulario
    const errors = {};
    if (!editForm.nombre) errors.nombre = "El nombre es obligatorio";
    if (!editForm.email) errors.email = "El email es obligatorio";
    
    // Verificación para evitar que un administrador cambie su rol
    if (selectedUsuario.rol === 'Admin' && editForm.rol !== 'Admin') {
      errors.rol = "No se puede cambiar el rol de un administrador";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await put(`usuarios/${selectedUsuario.id_usuario}`, editForm);
      setShowEditModal(false);
      setSelectedUsuario(null);
      setFormErrors({});
      
      // Refrescar la lista de usuarios después de actualizar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario.');
    }
  };

  // Crear usuario
  const handleCreateUsuario = async () => {
    try {
      await post('usuarios', createForm);
      setShowCreateModal(false);
      setCreateForm({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        rol: 'Agri'
      });
      
      // Refrescar la lista de usuarios después de crear
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear el usuario.');
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0">
          <i className="fas fa-users me-2"></i>
          Lista de Usuarios
        </h5>
        <Button variant="outline-secondary" size="sm" onClick={onClose}>
          <i className="fas fa-times me-1"></i>
          Cerrar
        </Button>
      </Card.Header>
      
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="id_usuario">Ordenar por ID</option>
              <option value="nombre">Ordenar por Nombre</option>
              <option value="email">Ordenar por Email</option>
              <option value="telefono">Ordenar por Teléfono</option>
              <option value="rol">Ordenar por Rol</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-accent-brown"
              className="w-100"
              onClick={toggleSortDirection}
            >
              <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} me-1`}></i>
              {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </Col>
        </Row>
        
        {filteredUsuarios.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x mb-3 text-muted"></i>
            <p className="mb-0">No se encontraron usuarios{searchTerm ? ' que coincidan con la búsqueda.' : '.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_usuario')}>
                    ID {renderSortIndicator('id_usuario')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('nombre')}>
                    Nombre {renderSortIndicator('nombre')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('email')}>
                    Email {renderSortIndicator('email')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('telefono')}>
                    Teléfono {renderSortIndicator('telefono')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('rol')}>
                    Rol {renderSortIndicator('rol')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map(usuario => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono || "-"}</td>
                    <td>{getRolBadge(usuario.rol)}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="me-1"
                        onClick={() => {
                          setSelectedUsuario(usuario);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEditUsuario(usuario)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span className="text-muted me-3">
              Mostrando {filteredUsuarios.length} de {usuarios?.length || 0} usuarios
            </span>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => setShowDeleteAllModal(true)}
            >
              <i className="fas fa-trash-alt me-1"></i>
              Eliminar todos los usuarios
            </Button>
          </div>
          <div>
            <Button variant="accent-brown" className="text-white me-2" onClick={() => setShowCreateModal(true)}>
              <i className="fas fa-user-plus me-1"></i>
              Crear Usuario
            </Button>
            <Button variant="accent-brown" className="text-white" onClick={onRefresh}>
              <i className="fas fa-sync-alt me-1"></i>
              Actualizar
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Modal de confirmación para eliminar usuario */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUsuario && (
            <p>
              ¿Está seguro que desea eliminar al usuario <strong>{selectedUsuario.nombre}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUsuario}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar todos los usuarios */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>¡Atención! Eliminar todos los usuarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <p className="fw-bold">Esta acción eliminará TODOS los usuarios del sistema.</p>
          <p>Esta operación es irreversible y podría afectar gravemente el funcionamiento de la aplicación.</p>
          <p>¿Está completamente seguro de que desea continuar?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAllUsuarios}>
            Sí, eliminar todos
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición de usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                isInvalid={!!formErrors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={editForm.telefono}
                onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={editForm.rol}
                onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
              >
                <option value="Admin">Administrador</option>
                <option value="Tec">Técnico</option>
                <option value="Agri">Agricultor</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateUsuario}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de creación de usuario */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={createForm.nombre}
                onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                isInvalid={!!createFormErrors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                isInvalid={!!createFormErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                isInvalid={!!createFormErrors.password}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={createForm.telefono}
                onChange={(e) => setCreateForm({ ...createForm, telefono: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={createForm.rol}
                onChange={(e) => setCreateForm({ ...createForm, rol: e.target.value })}
              >
                <option value="Admin">Administrador</option>
                <option value="Tec">Técnico</option>
                <option value="Agri">Agricultor</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateUsuario}>
            Crear Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default UsuariosList;