import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ActividadesTab = ({ actividades, createActividad, updateActividad, deleteActividad, showAlert, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentActividad, setCurrentActividad] = useState(null);
  const [formData, setFormData] = useState({
    fecha: format(new Date(), 'yyyy-MM-dd'),
    tipo_cultivo: '',
    parcela: '',
    tarea: '',
    descripcion: ''
  });
  
  // Filtros para actividades
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTarea, setFilterTarea] = useState('');
  const [filterCultivo, setFilterCultivo] = useState('');
  
  // Opciones para los selectores
  const opcionesTareas = ['siembra', 'cosecha', 'tratamiento', 'poda', 'abonado', 'riego', 'otra'];
  
  // Lista de cultivos únicos para el filtro
  const cultivosUnicos = [...new Set(actividades.map(act => act.tipo_cultivo))];

  // Inicializar modal para nueva actividad
  const handleShowModal = () => {
    setCurrentActividad(null);
    setFormData({
      fecha: format(new Date(), 'yyyy-MM-dd'),
      tipo_cultivo: '',
      parcela: '',
      tarea: '',
      descripcion: ''
    });
    setShowModal(true);
  };

  // Inicializar modal para editar actividad
  const handleEditModal = (actividad) => {
    setCurrentActividad(actividad);
    setFormData({
      fecha: format(new Date(actividad.fecha), 'yyyy-MM-dd'),
      tipo_cultivo: actividad.tipo_cultivo,
      parcela: actividad.parcela,
      tarea: actividad.tarea,
      descripcion: actividad.descripcion || ''
    });
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar actividad (nueva o editada)
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      if (currentActividad) {
        await updateActividad(currentActividad.id_actividad, formData);
      } else {
        await createActividad(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar actividad:', error);
    }
  };

  // Confirmar eliminación de actividad
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await deleteActividad(id);
      } catch (error) {
        console.error('Error al eliminar actividad:', error);
      }
    }
  };

  // Filtrar actividades
  const filteredActividades = actividades.filter(act => {
    // Filtrar por término de búsqueda
    const searchMatch = 
      act.tipo_cultivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.parcela.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por tarea
    const tareaMatch = filterTarea ? act.tarea === filterTarea : true;
    
    // Filtrar por tipo de cultivo
    const cultivoMatch = filterCultivo ? act.tipo_cultivo === filterCultivo : true;
    
    return searchMatch && tareaMatch && cultivoMatch;
  });

  // Obtener color para el badge según el tipo de tarea
  const getBadgeVariant = (tarea) => {
    switch (tarea) {
      case 'siembra': return 'primary';
      case 'cosecha': return 'success';
      case 'tratamiento': return 'warning';
      case 'poda': return 'info';
      case 'abonado': return 'secondary';
      case 'riego': return 'primary';
      default: return 'dark';
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Registro de Actividades Agrícolas</h3>
          <Button variant="success" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>Nueva Actividad
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
                placeholder="Buscar por cultivo, parcela o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={filterTarea}
                onChange={(e) => setFilterTarea(e.target.value)}
              >
                <option value="">Filtrar por tarea</option>
                {opcionesTareas.map((tarea) => (
                  <option key={tarea} value={tarea}>
                    {tarea.charAt(0).toUpperCase() + tarea.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={filterCultivo}
                onChange={(e) => setFilterCultivo(e.target.value)}
              >
                <option value="">Filtrar por tipo de cultivo</option>
                {cultivosUnicos.map((cultivo) => (
                  <option key={cultivo} value={cultivo}>
                    {cultivo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {isLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Cargando actividades...</p>
          </div>
        ) : filteredActividades.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x text-muted mb-3"></i>
            <p className="mb-0">No hay actividades registradas. Añade una nueva actividad para comenzar.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cultivo</th>
                  <th>Parcela</th>
                  <th>Tarea</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredActividades.map((act) => (
                  <tr key={act.id_actividad}>
                    <td>{format(new Date(act.fecha), 'dd/MM/yyyy', { locale: es })}</td>
                    <td>{act.tipo_cultivo}</td>
                    <td>{act.parcela}</td>
                    <td>
                      <Badge bg={getBadgeVariant(act.tarea)} className="text-uppercase">
                        {act.tarea}
                      </Badge>
                    </td>
                    <td>{act.descripcion || '-'}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditModal(act)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(act.id_actividad)}>
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

      {/* Modal para crear/editar actividad */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentActividad ? 'Editar Actividad' : 'Nueva Actividad'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Tipo de Cultivo</Form.Label>
                  <Form.Control
                    type="text"
                    name="tipo_cultivo"
                    value={formData.tipo_cultivo}
                    onChange={handleChange}
                    placeholder="Ej: Tomate, Olivo, Trigo..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Parcela</Form.Label>
                  <Form.Control
                    type="text"
                    name="parcela"
                    value={formData.parcela}
                    onChange={handleChange}
                    placeholder="Identificador o nombre de la parcela"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Tarea</Form.Label>
                  <Form.Select
                    name="tarea"
                    value={formData.tarea}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar tarea...</option>
                    {opcionesTareas.map((tarea) => (
                      <option key={tarea} value={tarea}>
                        {tarea.charAt(0).toUpperCase() + tarea.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Detalles adicionales de la actividad"
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
              {currentActividad ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default ActividadesTab;