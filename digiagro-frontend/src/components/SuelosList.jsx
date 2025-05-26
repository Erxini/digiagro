import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

const SuelosList = ({ suelos = [], onClose, onRefresh }) => {
  const { user } = useAuth();
  const isTecnico = user?.rol === 'Tec';
  
  const [sortedSuelos, setSortedSuelos] = useState([]);
  const [sortField, setSortField] = useState('id_suelo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuelo, setSelectedSuelo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    ph: '',
    humedad: '',
    nutrientes: '',
    tipo_suelo: ''
  });
  const [createForm, setCreateForm] = useState({
    id_cultivo: '',
    ph: '',
    humedad: '',
    nutrientes: '',
    tipo_suelo: 'Arcilloso'
  });
  const [formErrors, setFormErrors] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  
  const { del, put, post } = useApi();

  // Inicializar suelos ordenados cuando cambia la prop de suelos
  useEffect(() => {
    // Asegurarse de que suelos es un array
    const suelosArray = Array.isArray(suelos) ? suelos : [];
    
    if (suelosArray.length > 0) {
      handleSort(sortField, sortDirection);
    } else {
      setSortedSuelos([]);
    }
  }, [suelos]);

  // Función para ordenar suelos
  const handleSort = (field, direction = sortDirection) => {
    // Asegurarse de que suelos es un array
    const suelosArray = Array.isArray(suelos) ? suelos : [];
    
    const sortedData = [...suelosArray].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Convertir a minúsculas si es string para ordenamiento no sensible a mayúsculas
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setSortedSuelos(sortedData);
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

  // Filtrar suelos por término de búsqueda
  const filteredSuelos = sortedSuelos.filter(suelo => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (suelo.id_suelo?.toString() || '').includes(term) ||
      (suelo.id_cultivo?.toString() || '').includes(term) ||
      (suelo.ph?.toString() || '').includes(term) ||
      (suelo.humedad?.toString() || '').includes(term) ||
      ((suelo.nutrientes?.toLowerCase() || '')).includes(term) ||
      ((suelo.tipo_suelo?.toLowerCase() || '')).includes(term)
    );
  });

  // Función para obtener un badge según el tipo de suelo
  const getTipoSueloBadge = (tipo) => {
    if (!tipo) return <span className="badge bg-light text-dark">N/A</span>;
    
    switch (tipo.toLowerCase()) {
      case 'arcilloso':
        return <span className="badge bg-danger-subtle text-dark">Arcilloso</span>;
      case 'arenoso':
        return <span className="badge bg-warning-subtle text-dark">Arenoso</span>;
      case 'limoso':
        return <span className="badge bg-success-subtle text-dark">Limoso</span>;
      case 'franco':
        return <span className="badge bg-info-subtle text-dark">Franco</span>;
      default:
        return <span className="badge bg-light text-dark">{tipo}</span>;
    }
  };

  // Eliminar suelo
  const handleDeleteSuelo = async () => {
    if (!selectedSuelo) return;
    
    try {
      await del(`suelo/${selectedSuelo.id_suelo}`);
      setShowDeleteModal(false);
      setSelectedSuelo(null);
      
      // Refrescar la lista de suelos después de eliminar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar análisis de suelo:', error);
      alert('Error al eliminar el análisis de suelo.');
    }
  };

  // Eliminar todos los suelos
  const handleDeleteAllSuelos = async () => {
    try {
      await del('suelo');
      setShowDeleteAllModal(false);
      
      // Refrescar la lista de suelos después de eliminar todos
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al eliminar todos los análisis de suelo:', error);
      alert('Error al eliminar todos los análisis de suelo.');
    }
  };

  // Abrir modal de edición
  const handleEditSuelo = (suelo) => {
    setSelectedSuelo(suelo);
    setEditForm({
      ph: suelo.ph || '',
      humedad: suelo.humedad || '',
      nutrientes: suelo.nutrientes || '',
      tipo_suelo: suelo.tipo_suelo || ''
    });
    setShowEditModal(true);
  };

  // Actualizar suelo
  const handleUpdateSuelo = async () => {
    if (!selectedSuelo) return;

    const errors = {};
    if (!editForm.ph) errors.ph = "El pH es obligatorio";
    if (!editForm.humedad) errors.humedad = "La humedad es obligatoria";
    if (!editForm.tipo_suelo) errors.tipo_suelo = "El tipo de suelo es obligatorio";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedSuelo = {
        ...selectedSuelo,
        ...editForm,
        ph: parseFloat(editForm.ph),
        humedad: parseFloat(editForm.humedad)
      };
      
      await put(`suelo/${selectedSuelo.id_suelo}`, updatedSuelo);
      setShowEditModal(false);
      setSelectedSuelo(null);
      setFormErrors({});
      
      // Refrescar la lista de suelos después de actualizar
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al actualizar análisis de suelo:', error);
      alert('Error al actualizar el análisis de suelo.');
    }
  };

  // Crear suelo
  const handleCreateSuelo = async () => {
    // Validar campos requeridos
    const errors = {};
    if (!createForm.id_cultivo) errors.id_cultivo = "El ID del cultivo es obligatorio";
    if (!createForm.ph) errors.ph = "El pH es obligatorio";
    if (!createForm.humedad) errors.humedad = "La humedad es obligatoria";
    if (!createForm.tipo_suelo) errors.tipo_suelo = "El tipo de suelo es obligatorio";
    
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }
    
    try {
      // Aseguramos que estamos enviando los valores en el formato correcto
      const sueloData = {
        ...createForm,
        ph: parseFloat(createForm.ph),
        humedad: parseFloat(createForm.humedad)
      };
      
      await post('suelo', sueloData);
      setShowCreateModal(false);
      setCreateForm({
        id_cultivo: '',
        ph: '',
        humedad: '',
        nutrientes: '',
        tipo_suelo: 'Arcilloso'
      });
      setCreateFormErrors({});
      
      // Refrescar la lista de suelos después de crear
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al crear análisis de suelo:', error);
      alert('Error al crear el análisis de suelo. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-accent-brown text-white">
        <h5 className="mb-0">
          <i className="fas fa-mountain me-2"></i>
          Análisis de Suelos
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
                placeholder="Buscar análisis de suelo..."
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
              <option value="id_suelo">Ordenar por ID</option>
              <option value="id_cultivo">Ordenar por Cultivo</option>
              <option value="ph">Ordenar por PH</option>
              <option value="humedad">Ordenar por Humedad</option>
              <option value="tipo_suelo">Ordenar por Tipo</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-accent-brown"
              className="w-100 text-accent-brown"
              onClick={toggleSortDirection}
            >
              <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} me-1`}></i>
              {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </Col>
        </Row>
        
        {filteredSuelos.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x mb-3 text-muted"></i>
            <p className="mb-0">No se encontraron análisis de suelo{searchTerm ? ' que coincidan con la búsqueda.' : '.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_suelo')}>
                    ID_suelo {renderSortIndicator('id_suelo')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('id_cultivo')}>
                    Cultivo {renderSortIndicator('id_cultivo')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('ph')}>
                    Tipo PH {renderSortIndicator('ph')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('humedad')}>
                    Humedad % {renderSortIndicator('humedad')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => handleSort('tipo_suelo')}>
                    Tipo {renderSortIndicator('tipo_suelo')}
                  </th>
                  <th>Nutrientes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuelos.map(suelo => (
                  <tr key={suelo.id_suelo || Math.random()}>
                    <td>{suelo.id_suelo || '-'}</td>
                    <td>{suelo.id_cultivo || '-'}</td>
                    <td>{suelo.ph || '-'}</td>
                    <td>{suelo.humedad || '-'}</td>
                    <td>{getTipoSueloBadge(suelo.tipo_suelo)}</td>
                    <td>{suelo.nutrientes ? suelo.nutrientes.substring(0, 30) + (suelo.nutrientes.length > 30 ? '...' : '') : '-'}</td>
                    <td>
                      {!isTecnico ? (
                        <>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="me-1"
                            onClick={() => {
                              setSelectedSuelo(suelo);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                          <Button 
                            variant="outline-accent-brown" 
                            size="sm"
                            onClick={() => handleEditSuelo(suelo)}
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
              Mostrando {filteredSuelos.length} de {suelos?.length || 0} análisis de suelo
            </span>
            {/* Mostrar botón de eliminar todos solo si NO es técnico */}
            {!isTecnico && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => setShowDeleteAllModal(true)}
              >
                <i className="fas fa-trash-alt me-1"></i>
                Eliminar todos los análisis
              </Button>
            )}
          </div>
          <div>
            {/* Mostrar botón de crear solo si NO es técnico */}
            {!isTecnico && (
              <Button variant="accent-brown" className="me-2 text-white" onClick={() => setShowCreateModal(true)}>
                <i className="fas fa-plus me-1"></i>
                Crear Análisis
              </Button>
            )}
            <Button variant="accent-brown" className="text-white" onClick={onRefresh}>
              <i className="fas fa-sync-alt me-1"></i>
              Actualizar
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Modal de confirmación para eliminar análisis de suelo */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSuelo && (
            <p>
              ¿Está seguro que desea eliminar el análisis de suelo del cultivo <strong>{selectedSuelo.id_cultivo}</strong> con ID <strong>{selectedSuelo.id_suelo}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteSuelo}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar todos los análisis de suelo */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>¡Atención! Eliminar todos los análisis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <p className="fw-bold">Esta acción eliminará TODOS los análisis de suelo del sistema.</p>
          <p>Esta operación es irreversible y podría afectar gravemente el funcionamiento de la aplicación.</p>
          <p>¿Está completamente seguro de que desea continuar?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAllSuelos}>
            Sí, eliminar todos
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición de análisis de suelo */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Análisis de Suelo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo PH</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={editForm.ph}
                onChange={(e) => setEditForm({ ...editForm, ph: e.target.value })}
                isInvalid={!!formErrors.ph}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.ph}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Humedad (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editForm.humedad}
                onChange={(e) => setEditForm({ ...editForm, humedad: e.target.value })}
                isInvalid={!!formErrors.humedad}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.humedad}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Nutrientes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editForm.nutrientes}
                onChange={(e) => setEditForm({ ...editForm, nutrientes: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo de suelo</Form.Label>
              <Form.Select
                value={editForm.tipo_suelo}
                onChange={(e) => setEditForm({ ...editForm, tipo_suelo: e.target.value })}
                isInvalid={!!formErrors.tipo_suelo}
              >
                <option value="Arcilloso">Arcilloso</option>
                <option value="Arenoso">Arenoso</option>
                <option value="Limoso">Limoso</option>
                <option value="Franco">Franco</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.tipo_suelo}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="accent-brown" className="text-white" onClick={handleUpdateSuelo}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de creación de análisis de suelo */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Análisis de Suelo</Modal.Title>
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
              <Form.Label>Tipo PH</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={createForm.ph}
                onChange={(e) => setCreateForm({ ...createForm, ph: e.target.value })}
                isInvalid={!!createFormErrors.ph}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.ph}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Humedad (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={createForm.humedad}
                onChange={(e) => setCreateForm({ ...createForm, humedad: e.target.value })}
                isInvalid={!!createFormErrors.humedad}
              />
              <Form.Control.Feedback type="invalid">
                {createFormErrors.humedad}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Nutrientes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={createForm.nutrientes}
                onChange={(e) => setCreateForm({ ...createForm, nutrientes: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo de suelo</Form.Label>
              <Form.Select
                value={createForm.tipo_suelo}
                onChange={(e) => setCreateForm({ ...createForm, tipo_suelo: e.target.value })}
                isInvalid={!!createFormErrors.tipo_suelo}
              >
                <option value="Arcilloso">Arcilloso</option>
                <option value="Arenoso">Arenoso</option>
                <option value="Limoso">Limoso</option>
                <option value="Franco">Franco</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {createFormErrors.tipo_suelo}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="accent-brown" className="text-white" onClick={handleCreateSuelo}>
            Crear Análisis
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default SuelosList;