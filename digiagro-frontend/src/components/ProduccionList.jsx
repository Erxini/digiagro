import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

// Constantes para evitar la traducción automática
const CALIDAD_ALTO = "Alto/a";
const CALIDAD_MEDIO = "Medio/a";
const CALIDAD_BAJO = "Bajo/a";

const ProduccionList = ({ producciones, onClose, onRefresh }) => {
  // Añadir control de acceso basado en rol
  const { user } = useAuth();
  const isTecnico = user?.rol === 'Tec';
  
  const [sortedProducciones, setSortedProducciones] = useState([]);
  const [sortField, setSortField] = useState('id_produccion');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduccion, setSelectedProduccion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id_cultivo: '',
    cantidad: '',
    fecha: '',
    calidad: '',
    precio_venta: '',
    ganancia: ''
  });
  const [createForm, setCreateForm] = useState({
    id_cultivo: '',
    cantidad: '',
    fecha: new Date().toISOString().split('T')[0],
    calidad: '',
    precio_venta: '',
    ganancia: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  
  const { del, put, post } = useApi();

  useEffect(() => {
    if (producciones && producciones.length > 0) {
      handleSort(sortField, sortDirection);
    } else {
      setSortedProducciones([]);
    }
  }, [producciones]);

  const handleSort = (field, direction = sortDirection) => {
    if (!producciones) return;
    
    const sortedData = [...producciones].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setSortedProducciones(sortedData);
    setSortField(field);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    handleSort(sortField, newDirection);
  };

  const renderSortIndicator = (field) => {
    if (sortField === field) {
      return <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>;
    }
    return <i className="fas fa-sort ms-1 text-muted"></i>;
  };

  const filteredProducciones = sortedProducciones.filter(produccion => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      produccion.id_produccion.toString().includes(term) ||
      produccion.id_cultivo.toString().includes(term) ||
      produccion.cantidad.toString().includes(term) ||
      (new Date(produccion.fecha).toLocaleDateString()).includes(term) ||
      (produccion.calidad && produccion.calidad.toLowerCase().includes(term))
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getCalidadBadge = (calidad) => {
    if (!calidad) return <span className="badge bg-secondary-subtle text-dark">No especificada</span>;
    
    // Normalizamos el valor de calidad a minúsculas para una comparación insensible a mayúsculas/minúsculas
    const calidadLower = typeof calidad === 'string' ? calidad.toLowerCase() : '';
    
    // Verificamos por partes del texto para evitar problemas de traducción
    if (calidadLower === 'alto' || calidadLower === 'alta') {
      return <span className="badge bg-success-subtle text-dark">{CALIDAD_ALTO}</span>;
    }
    
    if (calidadLower === 'medio' || calidadLower === 'media' || calidadLower.includes('medi')) {
      // Usamos un span con el atributo translate="no" y cambiamos al masculino que no es traducido
      return <span className="badge bg-warning-subtle text-dark" translate="no">{CALIDAD_MEDIO}</span>;
    }
    
    if (calidadLower === 'bajo' || calidadLower === 'baja') {
      return <span className="badge bg-danger-subtle text-dark">{CALIDAD_BAJO}</span>;
    }
    
    return <span className="badge bg-info-subtle text-dark">{calidad}</span>;
  };

  const handleDeleteProduccion = async () => {
    if (!selectedProduccion) return;
    
    try {
      await del(`produccion/${selectedProduccion.id_produccion}`);
      setShowDeleteModal(false);
      setSelectedProduccion(null);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar producción:', error);
      alert('Error al eliminar la producción.');
    }
  };

  const handleDeleteAllProducciones = async () => {
    try {
      await del('produccion');
      setShowDeleteAllModal(false);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar todas las producciones:', error);
      alert('Error al eliminar todas las producciones.');
    }
  };

  const handleEditProduccion = (produccion) => {
    setSelectedProduccion(produccion);
    setEditForm({
      id_cultivo: produccion.id_cultivo.toString(),
      cantidad: produccion.cantidad.toString(),
      fecha: produccion.fecha ? new Date(produccion.fecha).toISOString().split('T')[0] : '',
      calidad: produccion.calidad || '',
      precio_venta: produccion.precio_venta.toString() || '',
      ganancia: produccion.ganancia.toString() || ''
    });
    setShowEditModal(true);
  };

  // Función para calcular automáticamente la ganancia
  const calculateGanancia = (cantidad, precioVenta) => {
    const cantidadNum = parseFloat(cantidad) || 0;
    const precioNum = parseFloat(precioVenta) || 0;
    return (cantidadNum * precioNum).toFixed(2);
  };

  // Actualizar handlers para incluir cálculo automático de ganancia
  const handleEditPrecioChange = (e) => {
    const nuevoPrecio = e.target.value;
    const nuevaGanancia = calculateGanancia(editForm.cantidad, nuevoPrecio);
    setEditForm({ 
      ...editForm, 
      precio_venta: nuevoPrecio,
      ganancia: nuevaGanancia
    });
  };

  const handleEditCantidadChange = (e) => {
    const nuevaCantidad = e.target.value;
    const nuevaGanancia = calculateGanancia(nuevaCantidad, editForm.precio_venta);
    setEditForm({ 
      ...editForm, 
      cantidad: nuevaCantidad,
      ganancia: nuevaGanancia
    });
  };

  const handleUpdateProduccion = async () => {
    if (!selectedProduccion) return;

    const errors = {};
    if (!editForm.id_cultivo) errors.id_cultivo = "El ID del cultivo es obligatorio";
    if (!editForm.cantidad) errors.cantidad = "La cantidad es obligatoria";
    if (!editForm.fecha) errors.fecha = "La fecha es obligatoria";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedProduccion = {
        ...selectedProduccion,
        id_cultivo: parseInt(editForm.id_cultivo),
        cantidad: parseFloat(editForm.cantidad),
        fecha: editForm.fecha,
        calidad: editForm.calidad,
        precio_venta: parseFloat(editForm.precio_venta),
        ganancia: parseFloat(editForm.ganancia)
      };
      await put(`produccion/${selectedProduccion.id_produccion}`, updatedProduccion);
      setShowEditModal(false);
      setSelectedProduccion(null);
      setFormErrors({});
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al actualizar producción:', error);
      alert('Error al actualizar la producción.');
    }
  };

  const handleCreateProduccion = async () => {
    const errors = {};
    if (!createForm.id_cultivo) errors.id_cultivo = "El ID del cultivo es obligatorio";
    if (!createForm.cantidad) errors.cantidad = "La cantidad es obligatoria";
    if (!createForm.fecha) errors.fecha = "La fecha es obligatoria";
    
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }

    try {
      const newProduccion = {
        id_cultivo: parseInt(createForm.id_cultivo),
        cantidad: parseFloat(createForm.cantidad),
        fecha: createForm.fecha,
        calidad: createForm.calidad,
        precio_venta: parseFloat(createForm.precio_venta),
        ganancia: parseFloat(createForm.ganancia)
      };
      
      await post('produccion', newProduccion);
      setShowCreateModal(false);
      setCreateForm({
        id_cultivo: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
        calidad: '',
        precio_venta: '',
        ganancia: ''
      });
      setCreateFormErrors({});
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al crear producción:', error);
      alert('Error al crear la producción.');
    }
  };

  const handleCreateCantidadChange = (e) => {
    const nuevaCantidad = e.target.value;
    const nuevaGanancia = calculateGanancia(nuevaCantidad, createForm.precio_venta);
    setCreateForm({ 
      ...createForm, 
      cantidad: nuevaCantidad,
      ganancia: nuevaGanancia
    });
  };

  const handleCreatePrecioChange = (e) => {
    const nuevoPrecio = e.target.value;
    const nuevaGanancia = calculateGanancia(createForm.cantidad, nuevoPrecio);
    setCreateForm({ 
      ...createForm, 
      precio_venta: nuevoPrecio,
      ganancia: nuevaGanancia
    });
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-warning text-dark">
        <h5 className="mb-0">
          <i className="fas fa-chart-line me-2"></i>
          Registro de Producciones
        </h5>
        <Button variant="outline-dark" size="sm" onClick={onClose}>
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
                placeholder="Buscar producciones..."
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
              <option value="id_produccion">Ordenar por ID</option>
              <option value="id_cultivo">Ordenar por Cultivo</option>
              <option value="cantidad">Ordenar por Cantidad</option>
              <option value="fecha">Ordenar por Fecha</option>
              <option value="calidad">Ordenar por Calidad</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-warning"
              className="w-100"
              onClick={toggleSortDirection}
            >
              <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} me-1`}></i>
              {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </Col>
        </Row>
        
        {filteredProducciones.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x mb-3 text-muted"></i>
            <p className="mb-0">No se encontraron producciones{searchTerm ? ' que coincidan con la búsqueda.' : '.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_produccion')}>
                    ID_produccion {renderSortIndicator('id_produccion')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_cultivo')}>
                    ID Cultivo {renderSortIndicator('id_cultivo')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('cantidad')}>
                    Cantidad {renderSortIndicator('cantidad')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('fecha')}>
                    Fecha {renderSortIndicator('fecha')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('calidad')}>
                    Calidad {renderSortIndicator('calidad')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('precio_venta')}>
                    Precio/Kg {renderSortIndicator('precio_venta')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('ganancia')}>
                    Ganancia {renderSortIndicator('ganancia')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducciones.map(produccion => (
                  <tr key={produccion.id_produccion}>
                    <td>{produccion.id_produccion}</td>
                    <td>{produccion.id_cultivo}</td>
                    <td>{produccion.cantidad} kg</td>
                    <td>{formatDate(produccion.fecha)}</td>
                    <td>{getCalidadBadge(produccion.calidad)}</td>
                    <td>{produccion.precio_venta} €</td>
                    <td>{produccion.ganancia} €</td>
                    <td>
                      {!isTecnico ? (
                        <>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="me-1"
                            onClick={() => {
                              setSelectedProduccion(produccion);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEditProduccion(produccion)}
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
              Mostrando {filteredProducciones.length} de {producciones?.length || 0} producciones
            </span>
            {/* Mostrar botón de eliminar todos solo si es administrador */}
            {user?.rol === 'Admin' && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => setShowDeleteAllModal(true)}
              >
                <i className="fas fa-trash-alt me-1"></i>
                Eliminar todos los registros
              </Button>
            )}
          </div>
          <div>
            {/* Mostrar botón de crear solo si NO es técnico */}
            {!isTecnico && (
              <Button variant="warning" className="me-2" onClick={() => setShowCreateModal(true)}>
                <i className="fas fa-plus me-1"></i>
                Crear Producción
              </Button>
            )}
            <Button variant="warning" onClick={onRefresh}>
              <i className="fas fa-sync-alt me-1"></i>
              Actualizar
            </Button>
          </div>
        </div>
      </Card.Body>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduccion && (
            <p>
              ¿Está seguro que desea eliminar la producción con ID <strong>{selectedProduccion.id_produccion}</strong> del cultivo con ID <strong>{selectedProduccion.id_cultivo}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProduccion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>¡Atención! Eliminar todas las producciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <p className="fw-bold">Esta acción eliminará TODOS los registros de producción del sistema.</p>
          <p>Esta operación es irreversible y podría afectar gravemente el funcionamiento de la aplicación.</p>
          <p>¿Está completamente seguro de que desea continuar?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAllProducciones}>
            Sí, eliminar todos
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Cultivo</Form.Label>
              <Form.Control
                type="number"
                value={editForm.id_cultivo}
                onChange={(e) => setEditForm({ ...editForm, id_cultivo: e.target.value })}
                isInvalid={!!formErrors.id_cultivo}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.id_cultivo}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cantidad (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.cantidad}
                onChange={(e) => setEditForm({ ...editForm, cantidad: e.target.value })}
                isInvalid={!!formErrors.cantidad}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.cantidad}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
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
              <Form.Label>Calidad</Form.Label>
              <Form.Select
                value={editForm.calidad}
                onChange={(e) => setEditForm({ ...editForm, calidad: e.target.value })}
              >
                <option value="">No especificada</option>
                <option value={CALIDAD_ALTO}>{CALIDAD_ALTO}</option>
                <option value={CALIDAD_MEDIO} translate="no">{CALIDAD_MEDIO}</option>
                <option value={CALIDAD_BAJO}>{CALIDAD_BAJO}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio de Venta</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.precio_venta}
                onChange={handleEditPrecioChange}
                isInvalid={!!formErrors.precio_venta}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.precio_venta}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ganancia</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.ganancia}
                onChange={(e) => setEditForm({ ...editForm, ganancia: e.target.value })}
                isInvalid={!!formErrors.ganancia}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.ganancia}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateProduccion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Producción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Cultivo</Form.Label>
              <Form.Control
                type="number"
                value={createForm.id_cultivo}
                onChange={(e) => setCreateForm({ ...createForm, id_cultivo: e.target.value })}
                isInvalid={!!createFormErrors.id_cultivo}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.id_cultivo}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cantidad (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={createForm.cantidad}
                onChange={(e) => setCreateForm({ ...createForm, cantidad: e.target.value })}
                isInvalid={!!createFormErrors.cantidad}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.cantidad}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
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
              <Form.Label>Calidad</Form.Label>
              <Form.Select
                value={createForm.calidad}
                onChange={(e) => setCreateForm({ ...createForm, calidad: e.target.value })}
              >
                <option value="">No especificada</option>
                <option value={CALIDAD_ALTO}>{CALIDAD_ALTO}</option>
                <option value={CALIDAD_MEDIO} translate="no">{CALIDAD_MEDIO}</option>
                <option value={CALIDAD_BAJO}>{CALIDAD_BAJO}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio de Venta</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={createForm.precio_venta}
                onChange={handleCreatePrecioChange}
                isInvalid={!!createFormErrors.precio_venta}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.precio_venta}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ganancia</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={createForm.ganancia}
                onChange={(e) => setCreateForm({ ...createForm, ganancia: e.target.value })}
                isInvalid={!!createFormErrors.ganancia}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.ganancia}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleCreateProduccion}>
            Crear Producción
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ProduccionList;