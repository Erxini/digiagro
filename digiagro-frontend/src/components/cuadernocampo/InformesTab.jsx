import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert, ListGroup, Table, Badge } from 'react-bootstrap';
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
  
  // Nuevos estados para la selección individual de elementos
  const [elementosSeleccionados, setElementosSeleccionados] = useState({
    actividades: [],
    tratamientos: [],
    documentos: []
  });
  
  // Estado para controlar si se muestran todos los elementos o solo los seleccionados
  const [verTodos, setVerTodos] = useState(true);
  
  // Contadores de elementos seleccionados
  const [contadorSeleccionados, setContadorSeleccionados] = useState({
    actividades: 0,
    tratamientos: 0,
    documentos: 0
  });

  // Cultivos únicos para el selector
  const cultivosUnicos = [...new Set(actividades.map(act => act.tipo_cultivo))];
  
  // Tareas únicas para el selector
  const tareasUnicas = [...new Set(actividades.map(act => act.tarea))];
  
  // Inicializar selecciones cuando se carga la vista previa
  useEffect(() => {
    if (vistaPrevia) {
      // Por defecto seleccionamos todos los elementos cuando se carga la vista previa
      const actividadesIds = vistaPrevia.actividades.map(act => act.id_actividad);
      const tratamientosIds = vistaPrevia.tratamientos.map(trat => trat.id_tratamiento);
      const documentosIds = vistaPrevia.documentos.map(doc => doc.id_documento);
      
      setElementosSeleccionados({
        actividades: actividadesIds,
        tratamientos: tratamientosIds,
        documentos: documentosIds
      });
      
      setContadorSeleccionados({
        actividades: actividadesIds.length,
        tratamientos: tratamientosIds.length,
        documentos: documentosIds.length
      });
    }
  }, [vistaPrevia]);

  // Manejar cambios en filtros de formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Manejar selección individual de un elemento
  const handleSeleccionElemento = (tipo, id, isChecked) => {
    setElementosSeleccionados(prev => {
      let nuevaSeleccion;
      
      if (isChecked) {
        // Agregar a la selección
        nuevaSeleccion = {
          ...prev,
          [tipo]: [...prev[tipo], id]
        };
      } else {
        // Quitar de la selección
        nuevaSeleccion = {
          ...prev,
          [tipo]: prev[tipo].filter(itemId => itemId !== id)
        };
      }
      
      // Actualizar contador
      setContadorSeleccionados(prevCount => ({
        ...prevCount,
        [tipo]: nuevaSeleccion[tipo].length
      }));
      
      return nuevaSeleccion;
    });
  };
  
  // Seleccionar o deseleccionar todos los elementos de un tipo
  const seleccionarTodos = (tipo, seleccionar) => {
    if (!vistaPrevia) return;
    
    let idsArray = [];
    if (seleccionar) {
      // Seleccionar todos
      switch (tipo) {
        case 'actividades':
          idsArray = vistaPrevia.actividades.map(act => act.id_actividad);
          break;
        case 'tratamientos':
          idsArray = vistaPrevia.tratamientos.map(trat => trat.id_tratamiento);
          break;
        case 'documentos':
          idsArray = vistaPrevia.documentos.map(doc => doc.id_documento);
          break;
        default:
          idsArray = [];
      }
    }
    
    setElementosSeleccionados(prev => ({
      ...prev,
      [tipo]: idsArray
    }));
    
    setContadorSeleccionados(prev => ({
      ...prev,
      [tipo]: idsArray.length
    }));
  };
  
  // Alternar entre ver todos los elementos o solo los seleccionados
  const toggleVerTodos = () => {
    setVerTodos(prev => !prev);
  };

  // Generar vista previa del informe
  const handleVistaPrevia = () => {
    setGenerando(true);
    
    // Añadir logs para depuración
    console.log("Documentos recibidos en InformesTab:", documentos);
    console.log("Configuración de filtros:", filtros);
    
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
    
    // SOLUCIÓN SIMPLIFICADA PARA DOCUMENTOS - Usar todos los documentos disponibles
    let documentosFiltrados = [];
    if (filtros.incluyeDocumentos) {
      console.log("======= NUEVO ENFOQUE PARA DOCUMENTOS =======");
      
      // Verificamos si hay documentos disponibles
      if (!documentos || documentos.length === 0) {
        console.log("No hay documentos disponibles");
      } else {
        console.log(`Total de documentos disponibles: ${documentos.length}`);
        
        // Usamos todos los documentos disponibles sin filtrar
        documentosFiltrados = documentos;
        
        // Mostramos información para diagnóstico
        documentosFiltrados.slice(0, 5).forEach((doc, idx) => {
          console.log(`Documento ${idx+1} para vista previa:`, {
            id: doc.id_documento,
            nombre: doc.nombre,
            tipo: doc.tipo_documento,
            fecha: doc.fecha_subida ? new Date(doc.fecha_subida).toISOString() : 'Sin fecha'
          });
        });
      }
    } else {
      console.log("No se solicitó incluir documentos");
    }
    
    console.log("Documentos para vista previa:", documentosFiltrados.length);
    
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

  // Generar PDF con los datos filtrados y elementos seleccionados
  const handleGenerarPDF = () => {
    if (!vistaPrevia) {
      handleVistaPrevia();
      return; // Esperamos a que se genere la vista previa antes de continuar
    }
    
    // Filtrar los elementos seleccionados de cada tipo
    const actividadesSeleccionadas = vistaPrevia.actividades.filter(act => 
      elementosSeleccionados.actividades.includes(act.id_actividad)
    );
    
    const tratamientosSeleccionados = vistaPrevia.tratamientos.filter(trat => 
      elementosSeleccionados.tratamientos.includes(trat.id_tratamiento)
    );
    
    const documentosSeleccionados = documentos.filter(doc => 
      elementosSeleccionados.documentos.includes(doc.id_documento)
    );
    
    console.log("Elementos seleccionados para PDF:", {
      actividades: actividadesSeleccionadas.length,
      tratamientos: tratamientosSeleccionados.length,
      documentos: documentosSeleccionados.length
    });
    
    // Generar el PDF con los elementos seleccionados
    generarInformePDF({
      incluirActividades: filtros.incluirActividades,
      incluirTratamientos: filtros.incluyeTratamientos,
      incluirDocumentos: filtros.incluyeDocumentos,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      tipoCultivo: filtros.tipoCultivo,
      tipoActividad: filtros.tipoActividad,
      datos: {
        actividades: actividadesSeleccionadas,
        tratamientos: tratamientosSeleccionados,
        documentos: documentosSeleccionados
      },
      elementosSeleccionados: true // Indicar que estamos usando elementos seleccionados
    });
  };

  // Exportar a Excel los datos filtrados y elementos seleccionados
  const handleExportarExcel = () => {
    if (!vistaPrevia) {
      handleVistaPrevia();
      return;
    }
    
    // Filtrar los elementos seleccionados
    const actividadesSeleccionadas = vistaPrevia.actividades.filter(act => 
      elementosSeleccionados.actividades.includes(act.id_actividad)
    );
    
    const tratamientosSeleccionados = vistaPrevia.tratamientos.filter(trat => 
      elementosSeleccionados.tratamientos.includes(trat.id_tratamiento)
    );
    
    const documentosSeleccionados = vistaPrevia.documentos.filter(doc => 
      elementosSeleccionados.documentos.includes(doc.id_documento)
    );
    
    // Crear los datos filtrados
    const datosParaExcel = {
      actividades: actividadesSeleccionadas,
      tratamientos: tratamientosSeleccionados,
      documentos: documentosSeleccionados,
      totalActividades: actividadesSeleccionadas.length,
      totalTratamientos: tratamientosSeleccionados.length,
      totalDocumentos: documentosSeleccionados.length
    };
    
    exportarExcel(datosParaExcel, `cuaderno_campo_${format(new Date(), 'yyyy-MM-dd')}`);
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
                              <td>
                                {vistaPrevia.totalActividades} 
                                <Badge bg="success" className="ms-2">
                                  {contadorSeleccionados.actividades} seleccionados
                                </Badge>
                              </td>
                            </tr>
                          )}
                          {filtros.incluyeTratamientos && (
                            <tr>
                              <th>Total de tratamientos</th>
                              <td>
                                {vistaPrevia.totalTratamientos}
                                <Badge bg="success" className="ms-2">
                                  {contadorSeleccionados.tratamientos} seleccionados
                                </Badge>
                              </td>
                            </tr>
                          )}
                          {filtros.incluyeDocumentos && (
                            <tr>
                              <th>Total de documentos</th>
                              <td>
                                {vistaPrevia.totalDocumentos}
                                <Badge bg="success" className="ms-2">
                                  {contadorSeleccionados.documentos} seleccionados
                                </Badge>
                              </td>
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
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5>Actividades ({vistaPrevia.totalActividades})</h5>
                          <div>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => seleccionarTodos('actividades', true)}
                              className="me-1"
                            >
                              Seleccionar todos
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              onClick={() => seleccionarTodos('actividades', false)}
                            >
                              Deseleccionar todos
                            </Button>
                          </div>
                        </div>
                        <ListGroup variant="flush" className="border rounded mb-3">
                          {vistaPrevia.actividades.map((act) => (
                            <ListGroup.Item key={act.id_actividad} className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <Form.Check 
                                  type="checkbox"
                                  id={`actividad-${act.id_actividad}`}
                                  className="me-2"
                                  checked={elementosSeleccionados.actividades.includes(act.id_actividad)}
                                  onChange={(e) => handleSeleccionElemento('actividades', act.id_actividad, e.target.checked)}
                                />
                                <div>
                                  <strong>{format(new Date(act.fecha), 'dd/MM/yyyy', { locale: es })}</strong> - {act.tarea} de {act.tipo_cultivo}
                                </div>
                              </div>
                              <span className="badge bg-secondary rounded-pill">{act.parcela}</span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                    
                    {filtros.incluyeTratamientos && vistaPrevia.totalTratamientos > 0 && (
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5>Tratamientos ({vistaPrevia.totalTratamientos})</h5>
                          <div>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => seleccionarTodos('tratamientos', true)}
                              className="me-1"
                            >
                              Seleccionar todos
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              onClick={() => seleccionarTodos('tratamientos', false)}
                            >
                              Deseleccionar todos
                            </Button>
                          </div>
                        </div>
                        <ListGroup variant="flush" className="border rounded mb-3">
                          {vistaPrevia.tratamientos.map((trat) => (
                            <ListGroup.Item key={trat.id_tratamiento} className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <Form.Check 
                                  type="checkbox"
                                  id={`tratamiento-${trat.id_tratamiento}`}
                                  className="me-2"
                                  checked={elementosSeleccionados.tratamientos.includes(trat.id_tratamiento)}
                                  onChange={(e) => handleSeleccionElemento('tratamientos', trat.id_tratamiento, e.target.checked)}
                                />
                                <div>
                                  <strong>{format(new Date(trat.fecha), 'dd/MM/yyyy', { locale: es })}</strong> - {trat.producto}
                                </div>
                              </div>
                              <span className={`badge ${trat.tipo_producto === 'ecologico' ? 'bg-success' : 'bg-info'} rounded-pill`}>
                                {trat.tipo_producto}
                              </span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                    
                    {filtros.incluyeDocumentos && vistaPrevia.totalDocumentos > 0 && (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5>Documentos ({vistaPrevia.totalDocumentos})</h5>
                          <div>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => seleccionarTodos('documentos', true)}
                              className="me-1"
                            >
                              Seleccionar todos
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              onClick={() => seleccionarTodos('documentos', false)}
                            >
                              Deseleccionar todos
                            </Button>
                          </div>
                        </div>
                        <ListGroup variant="flush" className="border rounded">
                          {vistaPrevia.documentos.map((doc) => (
                            <ListGroup.Item key={doc.id_documento} className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <Form.Check 
                                  type="checkbox"
                                  id={`documento-${doc.id_documento}`}
                                  className="me-2"
                                  checked={elementosSeleccionados.documentos.includes(doc.id_documento)}
                                  onChange={(e) => handleSeleccionElemento('documentos', doc.id_documento, e.target.checked)}
                                />
                                <div>
                                  <i className="fas fa-file me-2"></i>
                                  {doc.nombre}
                                </div>
                              </div>
                              <span className="badge bg-primary rounded-pill">
                                {doc.tipo_documento}
                              </span>
                            </ListGroup.Item>
                          ))}
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