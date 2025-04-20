import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Accordion, Form, InputGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CultivosList from './CultivosList';
import ProduccionList from './ProduccionList';
import RiegosList from './RiegosList';
import SuelosList from './SuelosList';
import { usePrincipal } from '../hooks/usePrincipal';
import { useApi } from '../hooks/useApi';

// Definimos constantes simples con términos que indican ambos géneros
const CALIDAD_ALTO = "Alto/a";
const CALIDAD_MEDIO = "Medio/a"; 
const CALIDAD_BAJO = "Bajo/a";

// Mapa para nombres descriptivos de los filtros
const NOMBRE_FILTROS = {
  cultivo: "Cultivo",
  fecha: "Fecha",
  calidad: "Calidad",
  cantidad: "Cantidad",
  cultivoCalidad: "Cultivo y Calidad"
};

const Principal = () => {
  // Estado para los filtros de producción
  const [showFilters, setShowFilters] = useState(false); // Cambiado a false para que los filtros estén inicialmente colapsados
  const [cultivoFilter, setCultivoFilter] = useState('');
  const [fechaFilter, setFechaFilter] = useState('');
  const [calidadFilter, setCalidadFilter] = useState('');
  const [cantidadFilter, setCantidadFilter] = useState('');
  const [filteredProduccionData, setFilteredProduccionData] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const { get } = useApi();
  const navigate = useNavigate();

  const { 
    cultivosData, 
    riegosData,
    sueloData,
    produccionData,
    activeSection,
    userName,
    lastUpdate,
    isLoading,
    alertMessage,
    alertType,
    obtenerCultivos,
    obtenerRiegos,
    obtenerSuelos,
    obtenerProducciones,
    showAlert,
    changeSection,
    setAlertMessage
  } = usePrincipal();

  // Función para aplicar filtros
  const aplicarFiltro = async (tipo) => {
    setIsFiltering(true);
    setActiveFilter(tipo);

    try {
      let ruta = '';
      let resultado = null;

      switch (tipo) {
        case 'cultivo':
          if (!cultivoFilter) return;
          ruta = `produccion/cultivo/${cultivoFilter}`;
          break;
        case 'fecha':
          if (!fechaFilter) return;
          // Formato de fecha YYYY-MM-DD
          ruta = `produccion/fecha/${fechaFilter}`;
          break;
        case 'calidad':
          if (!calidadFilter) return;
          ruta = `produccion/calidad/${calidadFilter}`;
          break;
        case 'cantidad':
          if (!cantidadFilter) return;
          ruta = `produccion/cantidad/${cantidadFilter}`;
          break;
        case 'cultivoCalidad':
          if (!cultivoFilter || !calidadFilter) return;
          ruta = `produccion/cultivo/${cultivoFilter}/calidad/${calidadFilter}`;
          break;
        default:
          break;
      }

      if (!ruta) {
        setIsFiltering(false);
        return;
      }

      // Realizamos la petición al backend
      try {
        resultado = await get(ruta);
        console.log("Respuesta filtro:", resultado);
        
        // Si el resultado es un array directamente (sin propiedad data)
        if (Array.isArray(resultado)) {
          setFilteredProduccionData(resultado);
          showAlert(`Se encontraron ${resultado.length} registros`, 'success');
        } 
        // Si el resultado tiene una propiedad data que es un array
        else if (resultado && Array.isArray(resultado.data)) {
          setFilteredProduccionData(resultado.data);
          showAlert(`Se encontraron ${resultado.data.length} registros`, 'success');
        } 
        // En cualquier otro caso, establecemos un array vacío
        else {
          setFilteredProduccionData([]);
          showAlert('No se encontraron registros con los filtros aplicados', 'warning');
        }
      } catch (error) {
        console.error('Error al realizar la petición:', error);
        setFilteredProduccionData([]);
        showAlert('Error al obtener datos filtrados', 'danger');
      }
    } catch (error) {
      console.error('Error general en aplicarFiltro:', error);
      setFilteredProduccionData([]);
      showAlert('Error al procesar los filtros', 'danger');
    } finally {
      setIsFiltering(false);
    }
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setCultivoFilter('');
    setFechaFilter('');
    setCalidadFilter('');
    setCantidadFilter('');
    setFilteredProduccionData(null);
    setActiveFilter(null);
  };

  // Función para obtener el nombre descriptivo del filtro
  const getNombreFiltro = (tipoFiltro) => {
    return NOMBRE_FILTROS[tipoFiltro] || tipoFiltro;
  };

  // Renderizado de las cards de estadísticas
  const renderStats = () => {
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="success" text="white">
            <Card.Body>
              <Card.Title><i className="fas fa-seedling mr-2"></i> Cultivos</Card.Title>
              <h2>{cultivosData ? cultivosData.length : 0}</h2>
              <Card.Text>Total de cultivos registrados</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="primary" text="white">
            <Card.Body>
              <Card.Title><i className="fas fa-tint mr-2"></i> Riegos</Card.Title>
              <h2>{riegosData ? riegosData.length : 0}</h2>
              <Card.Text>Total de riegos registrados</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="accent-brown" text="light">
            <Card.Body>
              <Card.Title><i className="fas fa-mountain mr-2"></i> Suelos</Card.Title>
              <h2>{sueloData ? sueloData.length : 0}</h2>
              <Card.Text>Total de análisis de suelo</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3 h-100" bg="warning" text="dark">
            <Card.Body>
              <Card.Title><i className="fas fa-chart-line mr-2"></i> Producción</Card.Title>
              <h2>{produccionData ? produccionData.length : 0}</h2>
              <Card.Text>Total de registros de producción</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>Última actualización: {lastUpdate}</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    );
  };

  // Renderizado condicional según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'cultivos':
        return (
          <CultivosList 
            cultivos={cultivosData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerCultivos}
          />
        );
      
      case 'riegos':
        return (
          <RiegosList 
            riegos={riegosData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerRiegos}
          />
        );
      
      case 'suelos':
        return (
          <SuelosList 
            suelos={sueloData} 
            onClose={() => changeSection(null)} 
            onRefresh={obtenerSuelos}
          />
        );
      
      case 'produccion':
        return (
          <>
            <ProduccionList 
              producciones={filteredProduccionData || produccionData} 
              onClose={() => {
                changeSection(null);
                limpiarFiltros();
              }}
              onRefresh={() => {
                obtenerProducciones();
                limpiarFiltros();
              }}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container fluid className="px-4" style={{ marginTop: '130px', marginBottom: '2rem' }}>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col>
              <h1 className="mb-0">Profesionales</h1>
              <p className="text-muted">Gestión de DigiAgro para usuarios</p>
            </Col>
            <Col className="text-end">
              <h4 className="text-success">
                <i className="fas fa-user me-2"></i>
                Bienvenido/a: {userName || 'Usuario'}
              </h4>
              <p className="text-muted">
                <i className="fas fa-calendar me-2"></i>
                {new Date().toLocaleDateString()}
              </p>
              {/* Botón "Administrar Usuarios" solo visible para administradores */}
              {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).rol === 'Admin' && (
                <Button 
                  variant="danger" 
                  className="mt-2"
                  onClick={() => navigate('/admin')}
                >
                  <i className="fas fa-users-cog me-2"></i>
                  Administrar Usuarios
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {alertMessage && (
        <Alert variant={alertType} dismissible onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos, por favor espere...</p>
        </div>
      ) : (
        <>
          {renderStats()}
          
          {/* NUEVA UBICACIÓN: Capa de filtros entre estadísticas y botones de navegación */}
          <Card className="shadow-sm mb-4 border-warning">
            <Card.Header className="bg-warning bg-opacity-75 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark">
                <i className="fas fa-filter me-2"></i>
                Filtros de Producción
              </h5>
              <Button 
                variant={showFilters ? "outline-dark" : "dark"} 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
            </Card.Header>
            
            {showFilters && (
              <Card.Body>
                {activeFilter && (
                  <div className="mb-3">
                    <Badge bg="warning" className="p-2 mb-3">
                      Filtro activo: {getNombreFiltro(activeFilter)}
                      {activeFilter === 'cultivo' && <span className="ms-1">ID: {cultivoFilter}</span>}
                      {activeFilter === 'fecha' && <span className="ms-1">Fecha: {fechaFilter}</span>}
                      {activeFilter === 'calidad' && <span className="ms-1">Valor: {calidadFilter}</span>}
                      {activeFilter === 'cantidad' && <span className="ms-1">Cantidad: {cantidadFilter} kg</span>}
                      {activeFilter === 'cultivoCalidad' && (
                        <span className="ms-1">
                          ID: {cultivoFilter}, Calidad: {calidadFilter}
                        </span>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        className="ms-2 p-0 text-dark"
                        onClick={limpiarFiltros}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </Badge>
                  </div>
                )}

                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <i className="fas fa-seedling me-2"></i>
                      Filtrar por Cultivo
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>ID del Cultivo</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            placeholder="Ingrese ID del cultivo"
                            value={cultivoFilter}
                            onChange={(e) => setCultivoFilter(e.target.value)}
                          />
                          <Button 
                            variant="outline-warning" 
                            onClick={() => aplicarFiltro('cultivo')}
                            disabled={isFiltering || !cultivoFilter}
                          >
                            {isFiltering && activeFilter === 'cultivo' ? (
                              <span>
                                <span className="spinner-border spinner-border-sm me-1" /> Filtrando...
                              </span>
                            ) : (
                              <span>Aplicar</span>
                            )}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <i className="fas fa-calendar-alt me-2"></i>
                      Filtrar por Fecha
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Producción</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="date"
                            value={fechaFilter}
                            onChange={(e) => setFechaFilter(e.target.value)}
                          />
                          <Button 
                            variant="outline-warning" 
                            onClick={() => aplicarFiltro('fecha')}
                            disabled={isFiltering || !fechaFilter}
                          >
                            {isFiltering && activeFilter === 'fecha' ? (
                              <span>
                                <span className="spinner-border spinner-border-sm me-1" /> Filtrando...
                              </span>
                            ) : (
                              <span>Aplicar</span>
                            )}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <i className="fas fa-star me-2"></i>
                      Filtrar por Calidad
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Seleccione Calidad</Form.Label>
                        <InputGroup>
                          <Form.Select
                            value={calidadFilter}
                            onChange={(e) => setCalidadFilter(e.target.value)}
                          >
                            <option value="">Seleccionar...</option>
                            <option value={CALIDAD_ALTO}>{CALIDAD_ALTO}</option>
                            <option value={CALIDAD_MEDIO}>{CALIDAD_MEDIO}</option>
                            <option value={CALIDAD_BAJO}>{CALIDAD_BAJO}</option>
                          </Form.Select>
                          <Button 
                            variant="outline-warning" 
                            onClick={() => aplicarFiltro('calidad')}
                            disabled={isFiltering || !calidadFilter}
                          >
                            {isFiltering && activeFilter === 'calidad' ? (
                              <span>
                                <span className="spinner-border spinner-border-sm me-1" /> Filtrando...
                              </span>
                            ) : (
                              <span>Aplicar</span>
                            )}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header>
                      <i className="fas fa-weight me-2"></i>
                      Filtrar por Cantidad
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Cantidad (kg)</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            placeholder="Ingrese cantidad en kg"
                            value={cantidadFilter}
                            onChange={(e) => setCantidadFilter(e.target.value)}
                            step="0.01"
                          />
                          <Button 
                            variant="outline-warning" 
                            onClick={() => aplicarFiltro('cantidad')}
                            disabled={isFiltering || !cantidadFilter}
                          >
                            {isFiltering && activeFilter === 'cantidad' ? (
                              <span>
                                <span className="spinner-border spinner-border-sm me-1" /> Filtrando...
                              </span>
                            ) : (
                              <span>Aplicar</span>
                            )}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4">
                    <Accordion.Header>
                      <i className="fas fa-filter me-2"></i>
                      Filtrado combinado
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>ID del Cultivo</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Ingrese ID del cultivo"
                              value={cultivoFilter}
                              onChange={(e) => setCultivoFilter(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Calidad</Form.Label>
                            <Form.Select
                              value={calidadFilter}
                              onChange={(e) => setCalidadFilter(e.target.value)}
                            >
                              <option value="">Seleccionar...</option>
                              <option value={CALIDAD_ALTO}>{CALIDAD_ALTO}</option>
                              <option value={CALIDAD_MEDIO}>{CALIDAD_MEDIO}</option>
                              <option value={CALIDAD_BAJO}>{CALIDAD_BAJO}</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button 
                        variant="warning" 
                        onClick={() => aplicarFiltro('cultivoCalidad')}
                        disabled={isFiltering || !cultivoFilter || !calidadFilter}
                        className="w-100"
                      >
                        {isFiltering && activeFilter === 'cultivoCalidad' ? (
                          <span>
                            <span className="spinner-border spinner-border-sm me-1" /> Filtrando...
                          </span>
                        ) : (
                          <span>Aplicar Filtro Combinado</span>
                        )}
                      </Button>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <div className="d-flex justify-content-between mt-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={limpiarFiltros}
                  >
                    <i className="fas fa-undo me-1"></i>
                    Limpiar Filtros
                  </Button>
                  <Button 
                    variant="warning" 
                    onClick={obtenerProducciones}
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Recargar Datos
                  </Button>
                </div>
              </Card.Body>
            )}
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="mb-4">
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'cultivos' ? 'success' : 'outline-success'} 
                    className="w-100"
                    onClick={() => changeSection('cultivos')}
                  >
                    <i className="fas fa-seedling me-2"></i>
                    Gestión de Cultivos
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'riegos' ? 'primary' : 'outline-primary'} 
                    className="w-100"
                    onClick={() => changeSection('riegos')}
                  >
                    <i className="fas fa-tint me-2"></i>
                    Gestión de Riegos
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'suelos' ? 'accent-brown' : 'outline-accent-brown'} 
                    className={`w-100 ${activeSection === 'suelos' ? 'text-light' : 'text-accent-brown'}`}
                    onClick={() => changeSection('suelos')}
                  >
                    <i className="fas fa-mountain me-2"></i>
                    Gestión de Suelos
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant={activeSection === 'produccion' ? 'warning' : 'outline-warning'} 
                    className="w-100"
                    onClick={() => changeSection('produccion')}
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    Gestión de Producción
                  </Button>
                </Col>
              </Row>
              
              {renderContent()}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Principal;