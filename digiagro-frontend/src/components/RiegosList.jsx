import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

const RiegosList = ({ riegos = [], onClose, onRefresh }) => {
  const { user } = useAuth();
  const isTecnico = user?.rol === 'Tec';
  
  const [sortedRiegos, setSortedRiegos] = useState([]);
  const [sortField, setSortField] = useState('id_riego');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiego, setSelectedRiego] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fecha: '',
    cantidad_agua: '',
    observaciones: ''
  });
  const [createForm, setCreateForm] = useState({
    id_cultivo: '',
    fecha: new Date().toISOString().split('T')[0],
    cantidad_agua: '',
    observaciones: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);
  
  const { del, put, post } = useApi();

  // Inicializar riegos ordenados cuando cambia la prop de riegos
  useEffect(() => {
    // Asegurarse de que riegos es un array
    const riegosArray = Array.isArray(riegos) ? riegos : [];
    
    if (riegosArray.length > 0) {
      handleSort(sortField, sortDirection);
    } else {
      setSortedRiegos([]);
    }
  }, [riegos]);

  // Función para ordenar riegos
  const handleSort = (field, direction = sortDirection) => {
    // Asegurarse de que riegos es un array
    const riegosArray = Array.isArray(riegos) ? riegos : [];
    
    const sortedData = [...riegosArray].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Convertir a minúsculas si es string para ordenamiento no sensible a mayúsculas
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setSortedRiegos(sortedData);
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

  // Filtrar riegos por término de búsqueda
  const filteredRiegos = sortedRiegos.filter(riego => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (riego.id_riego?.toString() || '').includes(term) ||
      (riego.id_cultivo?.toString() || '').includes(term) ||
      (riego.fecha ? new Date(riego.fecha).toLocaleDateString() : '').includes(term) ||
      (riego.cantidad_agua?.toString() || '').includes(term) ||
      ((riego.observaciones?.toLowerCase() || '')).includes(term)
    );
  });

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Eliminar riego
  const handleDeleteRiego = async () => {
    if (!selectedRiego) return;
    
    try {
      await del(`riegos/${selectedRiego.id_riego}`);
      setShowDeleteModal(false);
      setSelectedRiego(null);
      
      // Refrescar la lista de riegos después de eliminar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar riego:', error);
      alert('Error al eliminar el riego.');
    }
  };

  // Eliminar todos los riegos
  const handleDeleteAllRiegos = async () => {
    try {
      // Cerrar el modal de confirmación antes de iniciar la operación
      setShowDeleteAllModal(false);
      
      // Obtener el ID del usuario
      const userId = user?.id;
      if (!userId) {
        alert("Error: No se pudo identificar al usuario.");
        return;
      }
      
      // Determinar el endpoint según el rol del usuario
      const endpoint = user?.rol === 'Agricultor' ? `riegos/usuario/${userId}` : 'riegos';
      console.log(`Usando endpoint: ${endpoint}`);
      
      // Hacer la solicitud de eliminación
      const resultado = await del(endpoint);
      console.log('Respuesta del servidor:', resultado);
      
      // Considerar éxito incluso si la respuesta está vacía o no tiene el formato esperado
      const mensaje = user?.rol === 'Admin' 
        ? "Todos los riegos han sido eliminados correctamente." 
        : `Los riegos han sido eliminados correctamente.`;
      
      alert(mensaje);
      
      // Refrescar la lista de riegos después de eliminar
      if (onRefresh) await onRefresh();
      
    } catch (error) {
      console.error('Error al eliminar riegos:', error);
      alert('Error al eliminar los riegos: ' + (error.message || 'Error desconocido'));
    }
  };

  // Abrir modal de edición
  const handleEditRiego = (riego) => {
    setSelectedRiego(riego);
    setEditForm({
      fecha: riego.fecha ? new Date(riego.fecha).toISOString().split('T')[0] : '',
      cantidad_agua: riego.cantidad_agua || '',
      observaciones: riego.observaciones || ''
    });
    setShowEditModal(true);
  };

  // Actualizar riego
  const handleUpdateRiego = async () => {
    if (!selectedRiego) return;

    const errors = {};
    if (!editForm.fecha) errors.fecha = "La fecha es obligatoria";
    if (!editForm.cantidad_agua) errors.cantidad_agua = "La cantidad de agua es obligatoria";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedRiego = {
        ...selectedRiego,
        ...editForm,
        cantidad_agua: parseFloat(editForm.cantidad_agua)
      };
      await put(`riegos/${selectedRiego.id_riego}`, updatedRiego);
      setShowEditModal(false);
      setSelectedRiego(null);
      setFormErrors({});
      
      // Refrescar la lista de riegos después de actualizar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al actualizar riego:', error);
      alert('Error al actualizar el riego.');
    }
  };

  // Crear riego
  const handleCreateRiego = async () => {
    // Validar campos requeridos
    const errors = {};
    if (!createForm.id_cultivo) errors.id_cultivo = "El ID del cultivo es obligatorio";
    if (!createForm.fecha) errors.fecha = "La fecha es obligatoria";
    if (!createForm.cantidad_agua) errors.cantidad_agua = "La cantidad de agua es obligatoria";
    
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }
    
    try {
      // Aseguramos que estamos enviando los valores en el formato correcto
      const riegoData = {
        ...createForm,
        cantidad_agua: parseFloat(createForm.cantidad_agua)
      };
      
      await post('riegos', riegoData);
      setShowCreateModal(false);
      setCreateForm({
        id_cultivo: '',
        fecha: new Date().toISOString().split('T')[0],
        cantidad_agua: '',
        observaciones: ''
      });
      setCreateFormErrors({});
      
      // Refrescar la lista de riegos después de crear
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al crear riego:', error);
      alert('Error al crear el riego. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-tint me-2"></i>
          Lista de Riegos
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
                placeholder="Buscar riegos..."
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
              <option value="id_riego">Ordenar por ID</option>
              <option value="id_cultivo">Ordenar por Cultivo</option>
              <option value="fecha">Ordenar por Fecha</option>
              <option value="cantidad_agua">Ordenar por Cantidad de agua</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={toggleSortDirection}
            >
              <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} me-1`}></i>
              {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </Col>
        </Row>
        
        {filteredRiegos.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x mb-3 text-muted"></i>
            <p className="mb-0">No se encontraron riegos{searchTerm ? ' que coincidan con la búsqueda.' : '.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_riego')}>
                    ID_riego {renderSortIndicator('id_riego')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_cultivo')}>
                    Cultivo {renderSortIndicator('id_cultivo')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('fecha')}>
                    Fecha {renderSortIndicator('fecha')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('cantidad_agua')}>
                    Cantidad Agua (L) {renderSortIndicator('cantidad_agua')}
                  </th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiegos.map(riego => (
                  <tr key={riego.id_riego || Math.random()}>
                    <td>{riego.id_riego || '-'}</td>
                    <td>{riego.id_cultivo || '-'}</td>
                    <td>{formatDate(riego.fecha)}</td>
                    <td>{riego.cantidad_agua || '-'} L</td>
                    <td>{riego.observaciones ? riego.observaciones.substring(0, 30) + (riego.observaciones.length > 30 ? '...' : '') : '-'}</td>
                    <td>
                      {/* Mostrar botones de edición/eliminación solo si NO es técnico */}
                      {!isTecnico ? (
                        <>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="me-1"
                            onClick={() => {
                              setSelectedRiego(riego);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEditRiego(riego)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                        </>
                      ) : (
                        <span className="badge bg-info text-white">
                          <i className="fas fa-eye me-1"></i>Solo lectura
                        </span>
                      )}
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
              Mostrando {filteredRiegos.length} de {riegos?.length || 0} riegos
            </span>
            {/* Mostrar botón de eliminar todos solo si es administrador */}
            {user?.rol === 'Admin' && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => setShowDeleteAllModal(true)}
              >
                <i className="fas fa-trash-alt me-1"></i>
                Eliminar todos los riegos
              </Button>
            )}
          </div>
          <div>
            {/* Mostrar botón de crear solo si NO es técnico */}
            {!isTecnico && (
              <Button variant="primary" className="me-2" onClick={() => setShowCreateModal(true)}>
                <i className="fas fa-plus me-1"></i>
                Crear Riego
              </Button>
            )}
            <Button variant="primary" onClick={onRefresh}>
              <i className="fas fa-sync-alt me-1"></i>
              Actualizar
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Modal de confirmación para eliminar riego */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRiego && (
            <p>
              ¿Está seguro que desea eliminar el riego del cultivo <strong>{selectedRiego.id_cultivo}</strong> con ID <strong>{selectedRiego.id_riego}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteRiego}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar todos los riegos */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            {user?.rol === 'Admin' 
              ? '¡Atención! Eliminar todos los riegos' 
              : '¡Atención! Eliminar mis riegos'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          {user?.rol === 'Admin' ? (
            <>
              <p className="fw-bold">Esta acción eliminará TODOS los riegos del sistema.</p>
              <p>Esta operación es irreversible y podría afectar gravemente el funcionamiento de la aplicación.</p>
            </>
          ) : (
            <>
              <p className="fw-bold">Esta acción eliminará todos los riegos asociados a sus cultivos.</p>
              <p>Esta operación es irreversible y no afectará los riegos de otros usuarios.</p>
            </>
          )}
          <p>¿Está completamente seguro de que desea continuar?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAllRiegos}>
            {user?.rol === 'Admin' ? 'Sí, eliminar todos' : 'Sí, eliminar mis riegos'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición de riego */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Riego</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de riego</Form.Label>
              <Form.Control
                type="date"
                value={editForm.fecha}
                onChange={(e) => setEditForm({ ...editForm, fecha: e.target.value })}
                isInvalid={!!formErrors.fecha}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.fecha}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de agua (Litros)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={editForm.cantidad_agua}
                onChange={(e) => setEditForm({ ...editForm, cantidad_agua: e.target.value })}
                isInvalid={!!formErrors.cantidad_agua}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.cantidad_agua}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.observaciones}
                onChange={(e) => setEditForm({ ...editForm, observaciones: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateRiego}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de creación de riego */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Riego</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Cultivo</Form.Label>
              <Form.Control
                type="text"
                value={createForm.id_cultivo}
                onChange={(e) => setCreateForm({ ...createForm, id_cultivo: e.target.value })}
                isInvalid={!!createFormErrors.id_cultivo}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.id_cultivo}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de riego</Form.Label>
              <Form.Control
                type="date"
                value={createForm.fecha}
                onChange={(e) => setCreateForm({ ...createForm, fecha: e.target.value })}
                isInvalid={!!createFormErrors.fecha}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.fecha}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de agua (Litros)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={createForm.cantidad_agua}
                onChange={(e) => setCreateForm({ ...createForm, cantidad_agua: e.target.value })}
                isInvalid={!!createFormErrors.cantidad_agua}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.cantidad_agua}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={createForm.observaciones}
                onChange={(e) => setCreateForm({ ...createForm, observaciones: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateRiego}>
            Crear Riego
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de resultado de operación */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{resultSuccess ? 'Operación exitosa' : 'Error en la operación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            {resultSuccess ? (
              <i className="fas fa-check-circle fa-3x text-success"></i>
            ) : (
              <i className="fas fa-exclamation-triangle fa-3x text-danger"></i>
            )}
          </p>
          <p className="text-center fw-bold">{resultMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default RiegosList;