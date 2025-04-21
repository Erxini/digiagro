import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Alert, Spinner } from 'react-bootstrap';
import { useCuadernoCampo } from '../hooks/useCuadernoCampo';
import { useAuth } from '../hooks/useAuth';
import ActividadesTab from './cuadernocampo/ActividadesTab';
import TratamientosTab from './cuadernocampo/TratamientosTab';
import DocumentosTab from './cuadernocampo/DocumentosTab';
import InformesTab from './cuadernocampo/InformesTab';
import './Cuaderno.css';

const CuadernoCampo = () => {
  const { userData } = useAuth();
  const {
    actividades,
    tratamientos,
    documentos,
    isLoading,
    error,
    alertMessage,
    activeSection,
    changeSection,
    showAlert,
    createActividad,
    updateActividad,
    deleteActividad,
    createTratamiento,
    updateTratamiento,
    deleteTratamiento,
    uploadDocumento,
    updateDocumento,
    deleteDocumento,
    generarInformePDF,
    exportarExcel
  } = useCuadernoCampo();

  // Estado para manejar la pestaña activa
  const [key, setKey] = useState(activeSection);

  // Manejar cambio de pestaña
  const handleTabChange = (k) => {
    setKey(k);
    changeSection(k);
  };

  return (
    <Container className="cuaderno-container mt-4">
      <div className="cuaderno-page">
        <div className="cuaderno-content">
          <h1 className="cuaderno-title">Mi Cuaderno de Campo</h1>
          <p>Bienvenido {userData?.nombre}, aquí puedes gestionar tu cuaderno de campo digital.</p>
          
          {isLoading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Cargando datos del cuaderno...</p>
            </div>
          )}
          
          {error && (
            <Alert variant="danger" className="mt-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}
          
          {alertMessage.text && (
            <Alert variant={alertMessage.type} className="mt-3">
              {alertMessage.type === 'success' ? (
                <i className="fas fa-check-circle me-2"></i>
              ) : alertMessage.type === 'danger' ? (
                <i className="fas fa-exclamation-triangle me-2"></i>
              ) : (
                <i className="fas fa-info-circle me-2"></i>
              )}
              {alertMessage.text}
            </Alert>
          )}
          
          <div className="cuaderno-tabs mt-4">
            <Tab.Container id="cuaderno-tabs" activeKey={key} onSelect={handleTabChange}>
              <Row>
                <Col sm={12}>
                  <Nav variant="tabs" className="cuaderno-nav-tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="actividades" className="cuaderno-nav-link">
                        <i className="fas fa-tasks me-2"></i>
                        Actividades
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tratamientos" className="cuaderno-nav-link">
                        <i className="fas fa-seedling me-2"></i>
                        Tratamientos
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="documentos" className="cuaderno-nav-link">
                        <i className="fas fa-file-alt me-2"></i>
                        Documentos
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="informes" className="cuaderno-nav-link">
                        <i className="fas fa-chart-bar me-2"></i>
                        Informes
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={12}>
                  <Tab.Content className="mt-3">
                    <Tab.Pane eventKey="actividades">
                      <ActividadesTab 
                        actividades={actividades} 
                        createActividad={createActividad}
                        updateActividad={updateActividad}
                        deleteActividad={deleteActividad}
                        showAlert={showAlert}
                        isLoading={isLoading}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="tratamientos">
                      <TratamientosTab 
                        tratamientos={tratamientos}
                        actividades={actividades}
                        createTratamiento={createTratamiento}
                        updateTratamiento={updateTratamiento}
                        deleteTratamiento={deleteTratamiento}
                        showAlert={showAlert}
                        isLoading={isLoading}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="documentos">
                      <DocumentosTab 
                        documentos={documentos}
                        actividades={actividades}
                        tratamientos={tratamientos}
                        uploadDocumento={uploadDocumento}
                        updateDocumento={updateDocumento}
                        deleteDocumento={deleteDocumento}
                        showAlert={showAlert}
                        isLoading={isLoading}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="informes">
                      <InformesTab 
                        actividades={actividades}
                        tratamientos={tratamientos}
                        documentos={documentos}
                        generarInformePDF={generarInformePDF}
                        exportarExcel={exportarExcel}
                        isLoading={isLoading}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CuadernoCampo;