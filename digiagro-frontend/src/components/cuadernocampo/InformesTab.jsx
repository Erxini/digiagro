import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert, ListGroup, Table } from 'react-bootstrap';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const InformesTab = ({ 
  actividades, 
  tratamientos, 
  documentos,
  generarInformePDF, 
  exportarExcel,
  isLoading 
}) => {
  const [filtros, setFiltros] = useState({
    fechaInicio: format(subMonths(new Date(), 3), 'yyyy-MM-dd'), 
    fechaFin: format(new Date(), 'yyyy-MM-dd'),
    tipoCultivo: '',
    tipoActividad: '',
    incluyeTratamientos: true,
    incluyeDocumentos: true,
    incluirActividades: true // Aseguramos que siempre incluya actividades por defecto
  });

  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [generando, setGenerando] = useState(false);

  // Cultivos únicos para el selector
  const cultivosUnicos = [...new Set(actividades.map(act => act.tipo_cultivo))];
  
  // Tareas únicas para el selector
  const tareasUnicas = [...new Set(actividades.map(act => act.tarea))];

  // Manejar cambios en filtros de formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Generar vista previa del informe
  const handleVistaPrevia = () => {
    setGenerando(true);
    
    // Filtrar datos según criterios
    const actividadesFiltradas = actividades.filter(act => {
      const fechaActividad = new Date(act.fecha);
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);
      
      // Validar rango de fechas
      const fechaValida = fechaActividad >= fechaInicio && fechaActividad <= fechaFin;
      
      // Validar tipo de cultivo si está seleccionado
      const cultivoValido = filtros.tipoCultivo ? act.tipo_cultivo === filtros.tipoCultivo : true;
      
      // Validar tipo de actividad si está seleccionado
      const tareaValida = filtros.tipoActividad ? act.tarea === filtros.tipoActividad : true;
      
      return fechaValida && cultivoValido && tareaValida;
    });
    
    // Si se incluyen tratamientos, filtrar por las mismas fechas
    let tratamientosFiltrados = [];
    if (filtros.incluyeTratamientos) {
      tratamientosFiltrados = tratamientos.filter(trat => {
        const fechaTratamiento = new Date(trat.fecha);
        const fechaInicio = new Date(filtros.fechaInicio);
        const fechaFin = new Date(filtros.fechaFin);
        
        // Relacionar con actividades filtradas si es posible
        const relacionadoConActividad = trat.id_actividad ? 
          actividadesFiltradas.some(act => act.id_actividad === trat.id_actividad) : 
          true;
          
        // Validar rango de fechas
        const fechaValida = fechaTratamiento >= fechaInicio && fechaTratamiento <= fechaFin;
        
        return fechaValida && relacionadoConActividad;
      });
    }
    
    // Si se incluyen documentos, filtrar
    let documentosFiltrados = [];
    if (filtros.incluyeDocumentos) {
      documentosFiltrados = documentos.filter(doc => {
        const fechaDocumento = new Date(doc.fecha_subida);
        const fechaInicio = new Date(filtros.fechaInicio);
        const fechaFin = new Date(filtros.fechaFin);
        
        // Relacionar con actividades o tratamientos filtrados si es posible
        const relacionadoConActividad = doc.id_actividad ? 
          actividadesFiltradas.some(act => act.id_actividad === doc.id_actividad) : 
          true;
          
        const relacionadoConTratamiento = doc.id_tratamiento ? 
          tratamientosFiltrados.some(trat => trat.id_tratamiento === doc.id_tratamiento) : 
          true;
          
        // Validar rango de fechas
        const fechaValida = fechaDocumento >= fechaInicio && fechaDocumento <= fechaFin;
        
        return fechaValida && (relacionadoConActividad || relacionadoConTratamiento);
      });
    }
    
    // Establecer vista previa
    setVistaPrevia({
      actividades: actividadesFiltradas,
      tratamientos: tratamientosFiltrados,
      documentos: documentosFiltrados,
      totalActividades: actividadesFiltradas.length,
      totalTratamientos: tratamientosFiltrados.length,
      totalDocumentos: documentosFiltrados.length
    });
    
    setGenerando(false);
  };

  // Generar PDF con los datos filtrados
  const handleGenerarPDF = () => {
    if (!vistaPrevia) {
      handleVistaPrevia();
      return; // Esperamos a que se genere la vista previa antes de continuar
    }
    
    // Pasamos tanto los datos filtrados como los filtros de configuración
    generarInformePDF({
      incluirActividades: filtros.incluirActividades,
      incluirTratamientos: filtros.incluyeTratamientos,
      incluirDocumentos: filtros.incluyeDocumentos,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      tipoCultivo: filtros.tipoCultivo,
      tipoActividad: filtros.tipoActividad,
      datos: vistaPrevia
    });
  };

  // Exportar a Excel los datos filtrados
  const handleExportarExcel = () => {
    if (!vistaPrevia) {
      handleVistaPrevia();
      return;
    }
    
    exportarExcel(vistaPrevia, `cuaderno_campo_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <h3 className="mb-0">Informes y Exportación</h3>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Filtros de informe</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row className="mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Fecha inicio</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaInicio"
                          value={filtros.fechaInicio}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Fecha fin</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaFin"
                          value={filtros.fechaFin}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de cultivo</Form.Label>
                    <Form.Select
                      name="tipoCultivo"
                      value={filtros.tipoCultivo}
                      onChange={handleChange}
                    >
                      <option value="">Todos los cultivos</option>
                      {cultivosUnicos.map((cultivo, index) => (
                        <option key={index} value={cultivo}>
                          {cultivo}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de actividad</Form.Label>
                    <Form.Select
                      name="tipoActividad"
                      value={filtros.tipoActividad}
                      onChange={handleChange}
                    >
                      <option value="">Todas las actividades</option>
                      {tareasUnicas.map((tarea, index) => (
                        <option key={index} value={tarea}>
                          {tarea.charAt(0).toUpperCase() + tarea.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      id="incluye-actividades"
                      label="Incluir actividades"
                      name="incluirActividades"
                      checked={filtros.incluirActividades}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      id="incluye-tratamientos"
                      label="Incluir tratamientos"
                      name="incluyeTratamientos"
                      checked={filtros.incluyeTratamientos}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      id="incluye-documentos"
                      label="Incluir documentación"
                      name="incluyeDocumentos"
                      checked={filtros.incluyeDocumentos}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      onClick={handleVistaPrevia}
                      disabled={isLoading || generando}
                    >
                      {generando ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Generando...
                        </>
                      ) : (
                        'Vista previa'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Vista previa del informe</h5>
                  {vistaPrevia && (
                    <div>
                      <Button variant="success" size="sm" className="me-2" onClick={handleGenerarPDF}>
                        <i className="fas fa-file-pdf me-1"></i>
                        Generar  PDF
                      </Button>
                      <Button variant="info" size="sm" onClick={handleExportarExcel}>
                        <i className="fas fa-file-excel me-1"></i>
                        Exportar Excel
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Header>
              <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {isLoading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-2">Cargando datos...</p>
                  </div>
                ) : !vistaPrevia ? (
                  <Alert variant="info">
                    <i className="fas fa-info-circle me-2"></i>
                    Selecciona filtros y presiona "Vista previa" para generar un informe
                  </Alert>
                ) : vistaPrevia.totalActividades === 0 && (!filtros.incluyeTratamientos || vistaPrevia.totalTratamientos === 0) && (!filtros.incluyeDocumentos || vistaPrevia.totalDocumentos === 0) ? (
                  <Alert variant="warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    No se encontraron registros con los filtros seleccionados
                  </Alert>
                ) : (
                  <>
                    <div className="mb-4">
                      <h5>Resumen</h5>
                      <Table bordered size="sm" className="mb-3">
                        <tbody>
                          <tr>
                            <th style={{ width: '50%' }}>Período</th>
                            <td>
                              {format(new Date(filtros.fechaInicio), 'dd/MM/yyyy', { locale: es })} - {format(new Date(filtros.fechaFin), 'dd/MM/yyyy', { locale: es })}
                            </td>
                          </tr>
                          {filtros.incluirActividades && (
                            <tr>
                              <th>Total de actividades</th>
                              <td>{vistaPrevia.totalActividades}</td>
                            </tr>
                          )}
                          {filtros.incluyeTratamientos && (
                            <tr>
                              <th>Total de tratamientos</th>
                              <td>{vistaPrevia.totalTratamientos}</td>
                            </tr>
                          )}
                          {filtros.incluyeDocumentos && (
                            <tr>
                              <th>Total de documentos</th>
                              <td>{vistaPrevia.totalDocumentos}</td>
                            </tr>
                          )}
                          {filtros.tipoCultivo && (
                            <tr>
                              <th>Cultivo seleccionado</th>
                              <td>{filtros.tipoCultivo}</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    
                    {filtros.incluirActividades && vistaPrevia.totalActividades > 0 && (
                      <div className="mb-4">
                        <h5>Actividades ({vistaPrevia.totalActividades})</h5>
                        <ListGroup variant="flush" className="border rounded mb-3">
                          {vistaPrevia.actividades.slice(0, 5).map((act) => (
                            <ListGroup.Item key={act.id_actividad} className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{format(new Date(act.fecha), 'dd/MM/yyyy', { locale: es })}</strong> - {act.tarea} de {act.tipo_cultivo}
                              </div>
                              <span className="badge bg-secondary rounded-pill">{act.parcela}</span>
                            </ListGroup.Item>
                          ))}
                          {vistaPrevia.actividades.length > 5 && (
                            <ListGroup.Item className="text-center text-muted">
                              ...y {vistaPrevia.actividades.length - 5} más
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </div>
                    )}
                    
                    {filtros.incluyeTratamientos && vistaPrevia.totalTratamientos > 0 && (
                      <div className="mb-4">
                        <h5>Tratamientos ({vistaPrevia.totalTratamientos})</h5>
                        <ListGroup variant="flush" className="border rounded mb-3">
                          {vistaPrevia.tratamientos.slice(0, 5).map((trat) => (
                            <ListGroup.Item key={trat.id_tratamiento} className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{format(new Date(trat.fecha), 'dd/MM/yyyy', { locale: es })}</strong> - {trat.producto}
                              </div>
                              <span className={`badge ${trat.tipo_producto === 'ecologico' ? 'bg-success' : 'bg-info'} rounded-pill`}>
                                {trat.tipo_producto}
                              </span>
                            </ListGroup.Item>
                          ))}
                          {vistaPrevia.tratamientos.length > 5 && (
                            <ListGroup.Item className="text-center text-muted">
                              ...y {vistaPrevia.tratamientos.length - 5} más
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </div>
                    )}
                    
                    {filtros.incluyeDocumentos && vistaPrevia.totalDocumentos > 0 && (
                      <div>
                        <h5>Documentos ({vistaPrevia.totalDocumentos})</h5>
                        <ListGroup variant="flush" className="border rounded">
                          {vistaPrevia.documentos.slice(0, 5).map((doc) => (
                            <ListGroup.Item key={doc.id_documento} className="d-flex justify-content-between align-items-center">
                              <div>
                                <i className="fas fa-file me-2"></i>
                                {doc.nombre}
                              </div>
                              <span className="badge bg-primary rounded-pill">
                                {doc.tipo_documento}
                              </span>
                            </ListGroup.Item>
                          ))}
                          {vistaPrevia.documentos.length > 5 && (
                            <ListGroup.Item className="text-center text-muted">
                              ...y {vistaPrevia.documentos.length - 5} más
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InformesTab;