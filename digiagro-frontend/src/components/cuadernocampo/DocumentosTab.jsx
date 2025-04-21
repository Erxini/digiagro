import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DocumentosTab = ({ 
  documentos,
  actividades,
  tratamientos, 
  uploadDocumento, 
  updateDocumento, 
  deleteDocumento, 
  showAlert, 
  isLoading 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_documento: 'informe',
    id_actividad: '',
    id_tratamiento: '',
    descripcion: ''
  });
  const [archivo, setArchivo] = useState(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoDocumento, setFilterTipoDocumento] = useState('');
  
  // Opciones para el selector de tipo de documento
  const opcionesTiposDocumento = ['factura', 'certificado', 'informe', 'inspeccion', 'otro'];

  // Manejador para abrir modal de creación
  const handleShowModal = () => {
    setCurrentDocumento(null);
    setFormData({
      nombre: '',
      tipo_documento: 'informe',
      id_actividad: '',
      id_tratamiento: '',
      descripcion: ''
    });
    setArchivo(null);
    setShowModal(true);
  };

  // Manejador para abrir modal de edición
  const handleEditModal = (documento) => {
    setCurrentDocumento(documento);
    setFormData({
      nombre: documento.nombre,
      tipo_documento: documento.tipo_documento,
      id_actividad: documento.id_actividad || '',
      id_tratamiento: documento.id_tratamiento || '',
      descripcion: documento.descripcion || ''
    });
    setArchivo(null); // No podemos mostrar el archivo anterior
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  // Guardar documento
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      // Si no hay archivo seleccionado y es un nuevo documento
      if (!archivo && !currentDocumento) {
        showAlert('Debes seleccionar un archivo', 'warning');
        return;
      }
      
      // Asegurar que los IDs sean números válidos o explícitamente null
      const dataToSend = {
        ...formData,
        id_actividad: formData.id_actividad && formData.id_actividad !== '' ? parseInt(formData.id_actividad) : null,
        id_tratamiento: formData.id_tratamiento && formData.id_tratamiento !== '' ? parseInt(formData.id_tratamiento) : null,
      };
      
      console.log('Datos a enviar:', dataToSend);
      
      if (currentDocumento) {
        await updateDocumento(currentDocumento.id_documento, dataToSend, archivo);
      } else {
        await uploadDocumento(dataToSend, archivo);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar documento:', error);
    }
  };

  // Confirmar eliminación
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      try {
        await deleteDocumento(id);
      } catch (error) {
        console.error('Error al eliminar documento:', error);
      }
    }
  };

  // Filtrar documentos
  const filteredDocumentos = documentos.filter(doc => {
    const searchMatch = 
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const tipoMatch = filterTipoDocumento ? doc.tipo_documento === filterTipoDocumento : true;
    
    return searchMatch && tipoMatch;
  });

  // Obtener nombre de actividad asociada
  const getActividadNombre = (id) => {
    if (!id) return '-';
    const actividad = actividades.find(act => act.id_actividad === id);
    if (!actividad) return `ID: ${id}`;
    return `${actividad.tarea} de ${actividad.tipo_cultivo} (${format(new Date(actividad.fecha), 'dd/MM/yyyy', { locale: es })})`;
  };

  // Obtener nombre de tratamiento asociado
  const getTratamientoNombre = (id) => {
    if (!id) return '-';
    const tratamiento = tratamientos.find(trat => trat.id_tratamiento === id);
    if (!tratamiento) return `ID: ${id}`;
    return `${tratamiento.producto} (${format(new Date(tratamiento.fecha), 'dd/MM/yyyy', { locale: es })})`;
  };

  // Obtener icono según tipo de documento
  const getDocumentoIcon = (tipo) => {
    switch (tipo) {
      case 'factura': return 'fas fa-file-invoice-dollar';
      case 'certificado': return 'fas fa-certificate';
      case 'informe': return 'fas fa-file-alt';
      case 'inspeccion': return 'fas fa-clipboard-check';
      default: return 'fas fa-file';
    }
  };

  // Obtener variante de color según tipo de documento
  const getDocumentoVariant = (tipo) => {
    switch (tipo) {
      case 'factura': return 'primary';
      case 'certificado': return 'success';
      case 'informe': return 'info';
      case 'inspeccion': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Documentación</h3>
          <Button variant="success" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>Nuevo Documento
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Filtros */}
        <Row className="mb-3 g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Select
                value={filterTipoDocumento}
                onChange={(e) => setFilterTipoDocumento(e.target.value)}
              >
                <option value="">Filtrar por tipo de documento</option>
                {opcionesTiposDocumento.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {isLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Cargando documentos...</p>
          </div>
        ) : filteredDocumentos.length === 0 ? (
          <div className="text-center p-4 bg-light rounded">
            <i className="fas fa-info-circle fa-2x text-muted mb-3"></i>
            <p className="mb-0">No hay documentos registrados. Añade un nuevo documento para comenzar.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Fecha de subida</th>
                  <th>Actividad relacionada</th>
                  <th>Tratamiento relacionado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocumentos.map((doc) => (
                  <tr key={doc.id_documento}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`${getDocumentoIcon(doc.tipo_documento)} me-2`}></i>
                        <a href={doc.archivo_url} target="_blank" rel="noopener noreferrer">
                          {doc.nombre}
                        </a>
                      </div>
                    </td>
                    <td>
                      <Badge bg={getDocumentoVariant(doc.tipo_documento)} className="text-uppercase">
                        {doc.tipo_documento}
                      </Badge>
                    </td>
                    <td>{format(new Date(doc.fecha_subida), 'dd/MM/yyyy', { locale: es })}</td>
                    <td>{getActividadNombre(doc.id_actividad)}</td>
                    <td>{getTratamientoNombre(doc.id_tratamiento)}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditModal(doc)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" className="me-1" onClick={() => handleDelete(doc.id_documento)}>
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                      <Button variant="outline-info" size="sm" as="a" href={doc.archivo_url} target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-download"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>

      {/* Modal para crear/editar documento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentDocumento ? 'Editar Documento' : 'Nuevo Documento'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Nombre del documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre descriptivo para el documento"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tipo de documento</Form.Label>
                  <Form.Select
                    name="tipo_documento"
                    value={formData.tipo_documento}
                    onChange={handleChange}
                    required
                  >
                    {opcionesTiposDocumento.map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Archivo {!currentDocumento && "*"}</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required={!currentDocumento}
                  />
                  <Form.Text className="text-muted">
                    {currentDocumento ? 'Sube un nuevo archivo solo si deseas reemplazar el existente' : 'Formatos admitidos: PDF, JPEG, PNG, DOC, DOCX'}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Actividad relacionada (opcional)</Form.Label>
                  <Form.Select
                    name="id_actividad"
                    value={formData.id_actividad}
                    onChange={handleChange}
                  >
                    <option value="">Sin actividad relacionada</option>
                    {actividades.map((act) => (
                      <option key={act.id_actividad} value={act.id_actividad}>
                        {format(new Date(act.fecha), 'dd/MM/yyyy')} - {act.tarea} de {act.tipo_cultivo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tratamiento relacionado (opcional)</Form.Label>
                  <Form.Select
                    name="id_tratamiento"
                    value={formData.id_tratamiento}
                    onChange={handleChange}
                  >
                    <option value="">Sin tratamiento relacionado</option>
                    {tratamientos.map((trat) => (
                      <option key={trat.id_tratamiento} value={trat.id_tratamiento}>
                        {format(new Date(trat.fecha), 'dd/MM/yyyy')} - {trat.producto}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Descripción (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Información adicional sobre este documento"
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
              {currentDocumento ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default DocumentosTab;