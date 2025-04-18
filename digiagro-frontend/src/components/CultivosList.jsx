import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';

const CultivosList = ({ cultivos, onClose, onRefresh }) => {
  const [sortedCultivos, setSortedCultivos] = useState([]);
  const [sortField, setSortField] = useState('id_cultivo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCultivo, setSelectedCultivo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    tipo: '',
    fecha_siembra: '',
    fecha_cosecha: '',
    estado: '',
    ubicacion: ''
  });
  const [createForm, setCreateForm] = useState({
    id_usuario: '',
    tipo: '',
    fecha_siembra: new Date().toISOString().split('T')[0],
    fecha_cosecha: '',
    estado: 'Activo',
    ubicacion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  
  const { del, put, post } = useApi();

  // Inicializar cultivos ordenados cuando cambia la prop de cultivos
  useEffect(() => {
    if (cultivos && cultivos.length > 0) {
      handleSort(sortField, sortDirection);
    } else {
      setSortedCultivos([]);
    }
  }, [cultivos]);

  // Función para ordenar cultivos
  const handleSort = (field, direction = sortDirection) => {
    if (!cultivos) return;
    
    const sortedData = [...cultivos].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Convertir a minúsculas si es string para ordenamiento no sensible a mayúsculas
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setSortedCultivos(sortedData);
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

  // Filtrar cultivos por término de búsqueda
  const filteredCultivos = sortedCultivos.filter(cultivo => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cultivo.id_cultivo.toString().includes(term) ||
      cultivo.id_usuario.toString().includes(term) ||
      cultivo.tipo.toLowerCase().includes(term) ||
      (new Date(cultivo.fecha_siembra).toLocaleDateString()).includes(term) ||
      (cultivo.fecha_cosecha && new Date(cultivo.fecha_cosecha).toLocaleDateString().includes(term)) ||
      cultivo.estado.toLowerCase().includes(term) ||
      cultivo.ubicacion.toLowerCase().includes(term)
    );
  });

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Función para obtener un badge según el estado
  const getEstadoBadge = (estado) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return <span className="badge bg-success-subtle text-dark">Activo</span>;
      case 'cosechado':
        return <span className="badge bg-warning-subtle text-dark">Cosechado</span>;
      case 'en crecimiento':
        return <span className="badge bg-info-subtle text-dark">En crecimiento</span>;
      case 'problemas':
        return <span className="badge bg-danger-subtle text-dark">Problemas</span>;
      default:
        return <span className="badge bg-secondary-subtle text-dark">{estado}</span>;
    }
  };

  // Eliminar cultivo
  const handleDeleteCultivo = async () => {
    if (!selectedCultivo) return;
    
    try {
      await del(`cultivos/${selectedCultivo.id_cultivo}`);
      setShowDeleteModal(false);
      setSelectedCultivo(null);
      
      // Refrescar la lista de cultivos después de eliminar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar cultivo:', error);
      alert('Error al eliminar el cultivo.');
    }
  };

  // Eliminar todos los cultivos
  const handleDeleteAllCultivos = async () => {
    try {
      await del('cultivos');
      setShowDeleteAllModal(false);
      
      // Refrescar la lista de cultivos después de eliminar todos
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar todos los cultivos:', error);
      alert('Error al eliminar todos los cultivos.');
    }
  };

  // Abrir modal de edición
  const handleEditCultivo = (cultivo) => {
    setSelectedCultivo(cultivo);
    setEditForm({
      tipo: cultivo.tipo || '',
      fecha_siembra: cultivo.fecha_siembra ? new Date(cultivo.fecha_siembra).toISOString().split('T')[0] : '',
      fecha_cosecha: cultivo.fecha_cosecha ? new Date(cultivo.fecha_cosecha).toISOString().split('T')[0] : '',
      estado: cultivo.estado || '',
      ubicacion: cultivo.ubicacion || ''
    });
    setShowEditModal(true);
  };

  // Actualizar cultivo
  const handleUpdateCultivo = async () => {
    if (!selectedCultivo) return;

    try {
      const updatedCultivo = {
        ...selectedCultivo,
        ...editForm
      };
      await put(`cultivos/${selectedCultivo.id_cultivo}`, updatedCultivo);
      setShowEditModal(false);
      setSelectedCultivo(null);
      
      // Refrescar la lista de cultivos después de actualizar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al actualizar cultivo:', error);
      alert('Error al actualizar el cultivo.');
    }
  };

  // Crear cultivo
  const handleCreateCultivo = async () => {
    try {
      await post('cultivos', createForm);
      setShowCreateModal(false);
      setCreateForm({
        id_usuario: '',
        tipo: '',
        fecha_siembra: new Date().toISOString().split('T')[0],
        fecha_cosecha: '',
        estado: 'Activo',
        ubicacion: ''
      });
      
      // Refrescar la lista de cultivos después de crear
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al crear cultivo:', error);
      alert('Error al crear el cultivo.');
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
        <h5 className="mb-0">
          <i className="fas fa-seedling me-2"></i>
          Lista de Cultivos
        </h5>
        <Button variant="outline-light" size="sm" onClick={onClose}>
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
                placeholder="Buscar cultivos..."
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
              <option value="id_cultivo">Ordenar por ID</option>
              <option value="id_usuario">Ordenar por Usuario</option>
              <option value="tipo">Ordenar por Tipo</option>
              <option value="fecha_siembra">Ordenar por Fecha siembra</option>
              <option value="estado">Ordenar por Estado</option>
              <option value="ubicacion">Ordenar por Ubicación</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-success"
              className="w-100"
              onClick={toggleSortDirection}
            >
              <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} me-1`}></i>
              {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </Col>
        </Row>
        
        {filteredCultivos.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x mb-3 text-muted"></i>
            <p className="mb-0">No se encontraron cultivos{searchTerm ? ' que coincidan con la búsqueda.' : '.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_cultivo')}>
                    ID_cultivo {renderSortIndicator('id_cultivo')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_usuario')}>
                    Usuario {renderSortIndicator('id_usuario')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('tipo')}>
                    Tipo {renderSortIndicator('tipo')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('fecha_siembra')}>
                    Fecha siembra {renderSortIndicator('fecha_siembra')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('fecha_cosecha')}>
                    Fecha cosecha {renderSortIndicator('fecha_cosecha')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('estado')}>
                    Estado {renderSortIndicator('estado')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('ubicacion')}>
                    Ubicación {renderSortIndicator('ubicacion')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCultivos.map(cultivo => (
                  <tr key={cultivo.id_cultivo}>
                    <td>{cultivo.id_cultivo}</td>
                    <td>{cultivo.id_usuario}</td>
                    <td>{cultivo.tipo}</td>
                    <td>{formatDate(cultivo.fecha_siembra)}</td>
                    <td>{formatDate(cultivo.fecha_cosecha)}</td>
                    <td>{getEstadoBadge(cultivo.estado)}</td>
                    <td>{cultivo.ubicacion}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="me-1"
                        onClick={() => {
                          setSelectedCultivo(cultivo);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEditCultivo(cultivo)}
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
              Mostrando {filteredCultivos.length} de {cultivos?.length || 0} cultivos
            </span>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => setShowDeleteAllModal(true)}
            >
              <i className="fas fa-trash-alt me-1"></i>
              Eliminar todos los cultivos
            </Button>
          </div>
          <div>
            <Button variant="success" className="me-2" onClick={() => setShowCreateModal(true)}>
              <i className="fas fa-plus me-1"></i>
              Crear Cultivo
            </Button>
            <Button variant="success" onClick={onRefresh}>
              <i className="fas fa-sync-alt me-1"></i>
              Actualizar
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Modal de confirmación para eliminar cultivo */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCultivo && (
            <p>
              ¿Está seguro que desea eliminar el cultivo de tipo <strong>{selectedCultivo.tipo}</strong> con ID <strong>{selectedCultivo.id_cultivo}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteCultivo}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar todos los cultivos */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>¡Atención! Eliminar todos los cultivos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <p className="fw-bold">Esta acción eliminará TODOS los cultivos del sistema.</p>
          <p>Esta operación es irreversible y podría afectar gravemente el funcionamiento de la aplicación.</p>
          <p>¿Está completamente seguro de que desea continuar?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAllCultivos}>
            Sí, eliminar todos
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición de cultivo */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cultivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de cultivo</Form.Label>
              <Form.Control
                type="text"
                value={editForm.tipo}
                onChange={(e) => setEditForm({ ...editForm, tipo: e.target.value })}
                isInvalid={!!formErrors.tipo}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.tipo}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de siembra</Form.Label>
              <Form.Control
                type="date"
                value={editForm.fecha_siembra}
                onChange={(e) => setEditForm({ ...editForm, fecha_siembra: e.target.value })}
                isInvalid={!!formErrors.fecha_siembra}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.fecha_siembra}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de cosecha (opcional)</Form.Label>
              <Form.Control
                type="date"
                value={editForm.fecha_cosecha}
                onChange={(e) => setEditForm({ ...editForm, fecha_cosecha: e.target.value })}
                isInvalid={!!formErrors.fecha_cosecha}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.fecha_cosecha}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={editForm.estado}
                onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
              >
                <option value="Activo">Activo</option>
                <option value="En crecimiento">En crecimiento</option>
                <option value="Cosechado">Cosechado</option>
                <option value="Problemas">Problemas</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={editForm.ubicacion}
                onChange={(e) => setEditForm({ ...editForm, ubicacion: e.target.value })}
                isInvalid={!!formErrors.ubicacion}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.ubicacion}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleUpdateCultivo}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de creación de cultivo */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Cultivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Usuario</Form.Label>
              <Form.Control
                type="text"
                value={createForm.id_usuario}
                onChange={(e) => setCreateForm({ ...createForm, id_usuario: e.target.value })}
                isInvalid={!!createFormErrors.id_usuario}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.id_usuario}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de cultivo</Form.Label>
              <Form.Control
                type="text"
                value={createForm.tipo}
                onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
                isInvalid={!!createFormErrors.tipo}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.tipo}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de siembra</Form.Label>
              <Form.Control
                type="date"
                value={createForm.fecha_siembra}
                onChange={(e) => setCreateForm({ ...createForm, fecha_siembra: e.target.value })}
                isInvalid={!!createFormErrors.fecha_siembra}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.fecha_siembra}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de cosecha (opcional)</Form.Label>
              <Form.Control
                type="date"
                value={createForm.fecha_cosecha}
                onChange={(e) => setCreateForm({ ...createForm, fecha_cosecha: e.target.value })}
                isInvalid={!!createFormErrors.fecha_cosecha}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.fecha_cosecha}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={createForm.estado}
                onChange={(e) => setCreateForm({ ...createForm, estado: e.target.value })}
              >
                <option value="Activo">Activo</option>
                <option value="En crecimiento">En crecimiento</option>
                <option value="Cosechado">Cosechado</option>
                <option value="Problemas">Problemas</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={createForm.ubicacion}
                onChange={(e) => setCreateForm({ ...createForm, ubicacion: e.target.value })}
                isInvalid={!!createFormErrors.ubicacion}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.ubicacion}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleCreateCultivo}>
            Crear Cultivo
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default CultivosList;