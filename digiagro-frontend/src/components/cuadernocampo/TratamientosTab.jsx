import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TratamientosTab = ({ 
  tratamientos, 
  actividades,
  createTratamiento, 
  updateTratamiento, 
  deleteTratamiento,
  showAlert, 
  isLoading 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTratamiento, setCurrentTratamiento] = useState(null);
  const [formData, setFormData] = useState({
    fecha: format(new Date(), 'yyyy-MM-dd'),
    id_actividad: '',
    producto: '',
    tipo_producto: 'convencional',
    cantidad_aplicada: '',
    unidad_medida: 'kg',
    superficie_tratada: '',
    unidad_superficie: 'ha',
    tecnico_responsable: '',
    observaciones: ''
  });
  
  // Filtros para tratamientos
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoProducto, setFilterTipoProducto] = useState('');
  const [actividadSeleccionada, setActividadSeleccionada] = useState('');
  
  // Inicializar modal para nuevo tratamiento
  const handleShowModal = () => {
    setCurrentTratamiento(null);
    setFormData({
      fecha: format(new Date(), 'yyyy-MM-dd'),
      id_actividad: '',
      producto: '',
      tipo_producto: 'convencional',
      cantidad_aplicada: '',
      unidad_medida: 'kg',
      superficie_tratada: '',
      unidad_superficie: 'ha',
      tecnico_responsable: '',
      observaciones: ''
    });
    setShowModal(true);
  };

  // Inicializar modal para editar tratamiento
  const handleEditModal = (tratamiento) => {
    setCurrentTratamiento(tratamiento);
    setFormData({
      fecha: format(new Date(tratamiento.fecha), 'yyyy-MM-dd'),
      id_actividad: tratamiento.id_actividad || '',
      producto: tratamiento.producto,
      tipo_producto: tratamiento.tipo_producto,
      cantidad_aplicada: tratamiento.cantidad_aplicada,
      unidad_medida: tratamiento.unidad_medida,
      superficie_tratada: tratamiento.superficie_tratada,
      unidad_superficie: tratamiento.unidad_superficie,
      tecnico_responsable: tratamiento.tecnico_responsable || '',
      observaciones: tratamiento.observaciones || ''
    });
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en campos numéricos
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  // Guardar tratamiento (nuevo o editado)
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      // Convertir ID de actividad a número si existe
      const dataToSend = {
        ...formData,
        id_actividad: formData.id_actividad ? parseInt(formData.id_actividad) : null
      };
      
      if (currentTratamiento) {
        await updateTratamiento(currentTratamiento.id_tratamiento, dataToSend);
      } else {
        await createTratamiento(dataToSend);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar tratamiento:', error);
    }
  };

  // Confirmar eliminación de tratamiento
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tratamiento?')) {
      try {
        await deleteTratamiento(id);
      } catch (error) {
        console.error('Error al eliminar tratamiento:', error);
      }
    }
  };

  // Filtrar tratamientos
  const filteredTratamientos = tratamientos.filter(trat => {
    // Filtrar por término de búsqueda
    const searchMatch = 
      trat.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trat.tecnico_responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trat.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por tipo de producto
    const tipoProductoMatch = filterTipoProducto ? trat.tipo_producto === filterTipoProducto : true;
    
    // Filtrar por actividad
    const actividadMatch = actividadSeleccionada ? 
      trat.id_actividad === parseInt(actividadSeleccionada) : true;
    
    return searchMatch && tipoProductoMatch && actividadMatch;
  });

  // Obtener nombre de actividad por id
  const getActividadNombre = (id) => {
    if (!id) return '-';
    const actividad = actividades.find(act => act.id_actividad === id);
    if (!actividad) return `ID: ${id}`;
    return `${actividad.tarea} de ${actividad.tipo_cultivo} (${format(new Date(actividad.fecha), 'dd/MM/yyyy', { locale: es })})`;
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Registro de Tratamientos</h3>
          <Button variant="success" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>Nuevo Tratamiento
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Filtros */}
        <Row className="mb-3 g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Buscar por producto o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={filterTipoProducto}
                onChange={(e) => setFilterTipoProducto(e.target.value)}
              >
                <option value="">Filtrar por tipo de producto</option>
                <option value="ecologico">Ecológico</option>
                <option value="convencional">Convencional</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={actividadSeleccionada}
                onChange={(e) => setActividadSeleccionada(e.target.value)}
              >
                <option value="">Filtrar por actividad</option>
                {actividades.map((act) => (
                  <option key={act.id_actividad} value={act.id_actividad}>
                    {format(new Date(act.fecha), 'dd/MM/yyyy')} - {act.tarea} de {act.tipo_cultivo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {isLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Cargando tratamientos...</p>
          </div>
        ) : filteredTratamientos.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x text-muted mb-3"></i>
            <p className="mb-0">No hay tratamientos registrados. Añade un nuevo tratamiento para comenzar.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Dosificación</th>
                  <th>Superficie</th>
                  <th>Actividad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTratamientos.map((trat) => (
                  <tr key={trat.id_tratamiento}>
                    <td>{format(new Date(trat.fecha), 'dd/MM/yyyy', { locale: es })}</td>
                    <td>{trat.producto}</td>
                    <td>
                      <Badge bg={trat.tipo_producto === 'ecologico' ? 'success' : 'info'} className="text-uppercase">
                        {trat.tipo_producto}
                      </Badge>
                    </td>
                    <td>{trat.cantidad_aplicada} {trat.unidad_medida}</td>
                    <td>{trat.superficie_tratada} {trat.unidad_superficie}</td>
                    <td>{getActividadNombre(trat.id_actividad)}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditModal(trat)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(trat.id_tratamiento)}>
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>

      {/* Modal para crear/editar tratamiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentTratamiento ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha de aplicación</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Actividad relacionada (opcional)</Form.Label>
                  <Form.Select
                    name="id_actividad"
                    value={formData.id_actividad}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una actividad...</option>
                    {actividades.map((act) => (
                      <option key={act.id_actividad} value={act.id_actividad}>
                        {format(new Date(act.fecha), 'dd/MM/yyyy')} - {act.tarea} de {act.tipo_cultivo} ({act.parcela})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Producto aplicado</Form.Label>
                  <Form.Control
                    type="text"
                    name="producto"
                    value={formData.producto}
                    onChange={handleChange}
                    placeholder="Nombre del producto o tratamiento"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tipo de producto</Form.Label>
                  <Form.Select
                    name="tipo_producto"
                    value={formData.tipo_producto}
                    onChange={handleChange}
                    required
                  >
                    <option value="convencional">Convencional</option>
                    <option value="ecologico">Ecológico</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cantidad aplicada</Form.Label>
                  <Row>
                    <Col sm={8}>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        name="cantidad_aplicada"
                        value={formData.cantidad_aplicada}
                        onChange={handleNumberChange}
                        placeholder="Cantidad"
                        required
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Select
                        name="unidad_medida"
                        value={formData.unidad_medida}
                        onChange={handleChange}
                        required
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Superficie tratada</Form.Label>
                  <Row>
                    <Col sm={8}>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        name="superficie_tratada"
                        value={formData.superficie_tratada}
                        onChange={handleNumberChange}
                        placeholder="Superficie"
                        required
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Select
                        name="unidad_superficie"
                        value={formData.unidad_superficie}
                        onChange={handleChange}
                        required
                      >
                        <option value="ha">ha</option>
                        <option value="m2">m²</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Técnico responsable</Form.Label>
                  <Form.Control
                    type="text"
                    name="tecnico_responsable"
                    value={formData.tecnico_responsable}
                    onChange={handleChange}
                    placeholder="Nombre del técnico o responsable (opcional)"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    placeholder="Detalles adicionales, condiciones meteorológicas, etc. (opcional)"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {currentTratamiento ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default TratamientosTab;