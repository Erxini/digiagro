import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';

export const useCuadernoCampo = () => {
  const { user } = useAuth(); // Cambiado de userData a user para usar la propiedad correcta
  const { get, post, put, remove } = useApi();
  
  // Añadimos log para depuración
  console.log("Estado de usuario en useCuadernoCampo:", user);
  
  const [actividades, setActividades] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ text: '', type: '' });
  
  // Estado para distintas secciones del cuaderno
  const [activeSection, setActiveSection] = useState('actividades');
  
  // Mostrar mensaje de alerta
  const showAlert = (text, type = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage({ text: '', type: '' });
    }, 5000);
  };
  
  // Cambiar la sección activa
  const changeSection = (section) => {
    setActiveSection(section);
  };
  
  // Cargar datos iniciales
  const fetchInitialData = async () => {
    if (!user || !user.id) return;
    
    try {
      setIsLoading(true);
      await fetchActividades();
      await fetchTratamientos();
      await fetchDocumentos();
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos iniciales del cuaderno:', error);
      setError(error.message || 'Error al cargar datos del cuaderno');
      setIsLoading(false);
    }
  };
  
  // Obtener actividades del usuario
  const fetchActividades = useCallback(async () => {
    try {
      const response = await get(`actividades-campo/usuario/${user.id}`);
      setActividades(response);
      return response;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      setError(error.message || 'Error al obtener actividades');
      showAlert('Error al cargar actividades', 'danger');
      throw error;
    }
  }, [user, get]);
  
  // Obtener tratamientos del usuario
  const fetchTratamientos = useCallback(async () => {
    try {
      const response = await get(`tratamientos-campo/usuario/${user.id}`);
      setTratamientos(response);
      return response;
    } catch (error) {
      console.error('Error al obtener tratamientos:', error);
      setError(error.message || 'Error al obtener tratamientos');
      showAlert('Error al cargar tratamientos', 'danger');
      throw error;
    }
  }, [user, get]);
  
  // Obtener documentos del usuario
  const fetchDocumentos = useCallback(async () => {
    try {
      const response = await get(`documentos-campo/usuario/${user.id}`);
      setDocumentos(response);
      return response;
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      setError(error.message || 'Error al obtener documentos');
      showAlert('Error al cargar documentos', 'danger');
      throw error;
    }
  }, [user, get]);
  
  // Crear una nueva actividad
  const createActividad = async (actividadData) => {
    try {
      // Log para depuración
      console.log("Estado de usuario al crear actividad:", user);
      console.log("Datos de usuario disponibles:", JSON.parse(localStorage.getItem('user')));
      
      // Verificar que user existe y tiene id
      if (!user || !user.id) {
        // Si user no es válido, pero hay datos en localStorage, usar esos
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id) {
          // Asegurar que el id_usuario esté incluido usando los datos almacenados
          const dataToSend = { ...actividadData, id_usuario: storedUser.id };
          const response = await post('actividades-campo', dataToSend);
          await fetchActividades();
          showAlert('Actividad creada correctamente', 'success');
          return response;
        } else {
          throw new Error('No se ha podido identificar al usuario. Por favor, inicia sesión nuevamente.');
        }
      }
      
      // Si llegamos aquí, user es válido
      const dataToSend = { ...actividadData, id_usuario: user.id };
      const response = await post('actividades-campo', dataToSend);
      await fetchActividades();
      showAlert('Actividad creada correctamente', 'success');
      return response;
    } catch (error) {
      console.error('Error al crear actividad:', error);
      setError(error.message || 'Error al crear actividad');
      showAlert('Error al crear la actividad: ' + (error.message || 'Usuario no identificado'), 'danger');
      throw error;
    }
  };
  
  // Crear un nuevo tratamiento
  const createTratamiento = async (tratamientoData) => {
    try {
      // Log para depuración
      console.log("Estado de usuario al crear tratamiento:", user);
      console.log("Datos de usuario disponibles:", JSON.parse(localStorage.getItem('user')));
      
      // Verificar que user existe y tiene id_usuario
      if (!user || !user.id) {
        // Si user no es válido, pero hay datos en localStorage, usar esos
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id) {
          // Asegurar que el id_usuario esté incluido usando los datos almacenados
          const dataToSend = { ...tratamientoData, id_usuario: storedUser.id };
          const response = await post('tratamientos-campo', dataToSend);
          await fetchTratamientos();
          showAlert('Tratamiento creado correctamente', 'success');
          return response;
        } else {
          throw new Error('No se ha podido identificar al usuario. Por favor, inicia sesión nuevamente.');
        }
      }
      
      // Si llegamos aquí, user es válido
      const dataToSend = { ...tratamientoData, id_usuario: user.id };
      const response = await post('tratamientos-campo', dataToSend);
      await fetchTratamientos();
      showAlert('Tratamiento creado correctamente', 'success');
      return response;
    } catch (error) {
      console.error('Error al crear tratamiento:', error);
      setError(error.message || 'Error al crear tratamiento');
      showAlert('Error al crear el tratamiento: ' + (error.message || 'Usuario no identificado'), 'danger');
      throw error;
    }
  };
  
  // Actualizar una actividad existente
  const updateActividad = async (id, actividadData) => {
    try {
      const response = await put(`actividades-campo/${id}`, actividadData);
      await fetchActividades();
      showAlert('Actividad actualizada correctamente', 'success');
      return response;
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      setError(error.message || 'Error al actualizar actividad');
      showAlert('Error al actualizar la actividad', 'danger');
      throw error;
    }
  };
  
  // Eliminar una actividad
  const deleteActividad = async (id) => {
    try {
      await remove(`actividades-campo/${id}`);
      await fetchActividades();
      showAlert('Actividad eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      setError(error.message || 'Error al eliminar actividad');
      showAlert('Error al eliminar la actividad', 'danger');
      throw error;
    }
  };
  
  // Actualizar un tratamiento existente
  const updateTratamiento = async (id, tratamientoData) => {
    try {
      const response = await put(`tratamientos-campo/${id}`, tratamientoData);
      await fetchTratamientos();
      showAlert('Tratamiento actualizado correctamente', 'success');
      return response;
    } catch (error) {
      console.error('Error al actualizar tratamiento:', error);
      setError(error.message || 'Error al actualizar tratamiento');
      showAlert('Error al actualizar el tratamiento', 'danger');
      throw error;
    }
  };
  
  // Eliminar un tratamiento
  const deleteTratamiento = async (id) => {
    try {
      await remove(`tratamientos-campo/${id}`);
      await fetchTratamientos();
      showAlert('Tratamiento eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar tratamiento:', error);
      setError(error.message || 'Error al eliminar tratamiento');
      showAlert('Error al eliminar el tratamiento', 'danger');
      throw error;
    }
  };
  
  // Subir un nuevo documento
  const uploadDocumento = async (documentoData, archivo) => {
    try {
      // Log para depuración
      console.log("Estado de usuario al subir documento:", user);
      console.log("Datos de usuario disponibles:", JSON.parse(localStorage.getItem('user')));
      console.log("Datos del documento a enviar:", documentoData);
      
      // Verificar que user existe y tiene id
      let userId;
      
      if (!user || !user.id) {
        // Si user no es válido, pero hay datos en localStorage, usar esos
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id) {
          userId = storedUser.id;
        } else {
          throw new Error('No se ha podido identificar al usuario. Por favor, inicia sesión nuevamente.');
        }
      } else {
        userId = user.id;
      }
      
      const formData = new FormData();
      
      // Añadir archivo al formulario si existe
      if (archivo) {
        formData.append('archivo', archivo);
      }
      
      // Añadir todos los campos de datos
      formData.append('id_usuario', userId);
      
      // Procesar cada campo de documentoData, asegurando que los valores nulos se manejen correctamente
      Object.keys(documentoData).forEach(key => {
        // Si el valor es null o undefined, no lo incluyas en formData o envíalo explícitamente como 'null'
        if (documentoData[key] === null || documentoData[key] === undefined || documentoData[key] === '') {
          if (key === 'id_actividad' || key === 'id_tratamiento') {
            formData.append(key, 'null'); // Enviar un valor explícito que el backend interpretará como null
          }
          // No añadir otros campos con valores nulos
        } else {
          formData.append(key, documentoData[key]);
        }
      });
      
      console.log("URL API base:", import.meta.env.VITE_API_URL);
      
      // Utilizar una URL base fija si la variable de entorno no está disponible
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Realizar solicitud con formData
      const response = await fetch(`${baseUrl}/digiagro/documentos-campo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ error: 'Error en la respuesta del servidor' }));
        throw new Error(errorData.error || 'Error al subir documento');
      }
      
      await fetchDocumentos();
      showAlert('Documento subido correctamente', 'success');
      return await response.json().catch(() => ({}));
    } catch (error) {
      console.error('Error al subir documento:', error);
      setError(error.message || 'Error al subir documento');
      showAlert('Error al subir el documento: ' + (error.message || 'Usuario no identificado'), 'danger');
      throw error;
    }
  };
  
  // Actualizar un documento existente
  const updateDocumento = async (id, documentoData, archivo) => {
    try {
      // Log para depuración
      console.log("Datos del documento a actualizar:", documentoData);
      
      const formData = new FormData();
      
      // Añadir archivo al formulario si existe
      if (archivo) {
        formData.append('archivo', archivo);
      }
      
      // Procesar cada campo de documentoData, asegurando que los valores nulos se manejen correctamente
      Object.keys(documentoData).forEach(key => {
        // Si el valor es null o undefined, no lo incluyas en formData o envíalo explícitamente como 'null'
        if (documentoData[key] === null || documentoData[key] === undefined || documentoData[key] === '') {
          if (key === 'id_actividad' || key === 'id_tratamiento') {
            formData.append(key, 'null'); // Enviar un valor explícito que el backend interpretará como null
          }
          // No añadir otros campos con valores nulos
        } else {
          formData.append(key, documentoData[key]);
        }
      });
      
      // Utilizar una URL base fija si la variable de entorno no está disponible
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Realizar solicitud con formData
      const response = await fetch(`${baseUrl}/digiagro/documentos-campo/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ error: 'Error en la respuesta del servidor' }));
        throw new Error(errorData.error || 'Error al actualizar documento');
      }
      
      await fetchDocumentos();
      showAlert('Documento actualizado correctamente', 'success');
      return await response.json().catch(() => ({}));
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      setError(error.message || 'Error al actualizar documento');
      showAlert('Error al actualizar el documento', 'danger');
      throw error;
    }
  };
  
  // Eliminar un documento
  const deleteDocumento = async (id) => {
    try {
      await remove(`documentos-campo/${id}`);
      await fetchDocumentos();
      showAlert('Documento eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      setError(error.message || 'Error al eliminar documento');
      showAlert('Error al eliminar el documento', 'danger');
      throw error;
    }
  };
  
  // Generar informe en PDF
  const generarInformePDF = async (filtros) => {
    try {
      console.log('Generando informe PDF con filtros:', filtros);
      console.log('Datos de tratamientos para el PDF:', tratamientos);
      console.log('Datos de documentos para el PDF:', documentos);
      
      // Verificar si jsPDF está disponible
      if (!window.jspdf || !window.jspdf.jsPDF) {
        showAlert('Error al generar PDF: Librería jsPDF no disponible', 'warning');
        return;
      }
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Fecha formateada para el informe (formato día/mes/año)
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.getDate() + '/' + (fechaActual.getMonth() + 1) + '/' + fechaActual.getFullYear();
      
      // Título
      doc.setFontSize(22);
      doc.text('DigiAgro - Cuaderno de Campo', 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text('Informe generado el ' + fechaFormateada, 105, 30, { align: 'center' });
      
      doc.setFontSize(12);
      const nombreUsuario = user && user.nombre ? user.nombre : 'Usuario';
      doc.text('Usuario: ' + nombreUsuario, 20, 40);
      
      let yPos = 50;
      
      // Si se han solicitado tratamientos
      if (filtros.incluirTratamientos) {
        doc.setFontSize(16);
        doc.text('Tratamientos aplicados', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        
        if (tratamientos && tratamientos.length > 0) {
          tratamientos.forEach(tratamiento => {
            // Formatear la fecha como día/mes/año
            const fecha = new Date(tratamiento.fecha);
            const fechaTrat = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
            
            // Información principal del tratamiento
            doc.text('• ' + fechaTrat + ' - ' + tratamiento.producto + ' (' + tratamiento.tipo_producto + ')', 30, yPos);
            yPos += 5;
            
            // Detalles adicionales del tratamiento
            if (tratamiento.cantidad_aplicada) {
              const unidadMedida = tratamiento.unidad_medida || '';
              doc.text('  Cantidad: ' + tratamiento.cantidad_aplicada + ' ' + unidadMedida, 35, yPos);
              yPos += 5;
            }
            
            if (tratamiento.superficie_tratada) {
              const unidadSuperficie = tratamiento.unidad_superficie || '';
              doc.text('  Superficie: ' + tratamiento.superficie_tratada + ' ' + unidadSuperficie, 35, yPos);
              yPos += 5;
            }
            
            if (tratamiento.tecnico_responsable) {
              doc.text('  Técnico: ' + tratamiento.tecnico_responsable, 35, yPos);
              yPos += 5;
            }
            
            if (tratamiento.observaciones) {
              doc.text('  Observaciones: ' + tratamiento.observaciones, 35, yPos);
              yPos += 5;
            }
            
            yPos += 3; // Espacio entre tratamientos
            
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
          });
        } else {
          doc.text("No hay tratamientos registrados", 30, yPos);
          yPos += 6;
        }
        
        yPos += 10;
      }
      
      // Si se han solicitado documentos
      if (filtros.incluirDocumentos) {
        doc.setFontSize(16);
        doc.text('Documentos registrados', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        
        if (documentos && documentos.length > 0) {
          documentos.forEach(documento => {
            // Formatear la fecha como día/mes/año
            const fecha = new Date(documento.fecha_subida);
            const fechaDoc = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
            
            const nombreDoc = documento.nombre || 'Sin nombre';
            const tipoDoc = documento.tipo_documento || 'Sin tipo';
            
            // Información principal del documento
            doc.text('• ' + fechaDoc + ' - ' + nombreDoc + ' (' + tipoDoc + ')', 30, yPos);
            yPos += 5;
            
            // Detalles adicionales del documento
            if (documento.descripcion) {
              doc.text('  Descripción: ' + documento.descripcion, 35, yPos);
              yPos += 5;
            }
            
            if (documento.archivo_url) {
              const nombreArchivo = documento.archivo_url.split('/').pop();
              doc.text('  Archivo: ' + nombreArchivo, 35, yPos);
              yPos += 5;
            }
            
            yPos += 3; // Espacio entre documentos
            
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
          });
        } else {
          doc.text("No hay documentos registrados", 30, yPos);
          yPos += 6;
        }
        
        yPos += 10;
      }
      
      // Si se han solicitado actividades
      if (filtros.incluirActividades) {
        // Si ya hay contenido anterior, añadir espacio
        if (filtros.incluirTratamientos || filtros.incluirDocumentos) {
          yPos += 5;
        }
        
        doc.setFontSize(16);
        doc.text('Actividades registradas', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        
        if (actividades && actividades.length > 0) {
          actividades.forEach(actividad => {
            // Formatear la fecha como día/mes/año
            const fecha = new Date(actividad.fecha);
            const fechaAct = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
            
            // Información principal de la actividad
            doc.text('• ' + fechaAct + ' - ' + actividad.tarea + ' de ' + actividad.tipo_cultivo, 30, yPos);
            yPos += 5;
            
            // Detalles adicionales de la actividad
            if (actividad.parcela) {
              doc.text('  Parcela: ' + actividad.parcela, 35, yPos);
              yPos += 5;
            }
            
            if (actividad.superficie) {
              doc.text('  Superficie: ' + actividad.superficie + ' ha', 35, yPos);
              yPos += 5;
            }
            
            if (actividad.tiempo_dedicado) {
              doc.text('  Tiempo: ' + actividad.tiempo_dedicado + ' horas', 35, yPos);
              yPos += 5;
            }
            
            if (actividad.observaciones) {
              doc.text('  Observaciones: ' + actividad.observaciones, 35, yPos);
              yPos += 5;
            }
            
            yPos += 3; // Espacio entre actividades
            
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
          });
        } else {
          doc.text("No hay actividades registradas", 30, yPos);
          yPos += 6;
        }
      }
      
      // Añadir pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text('Página ' + i + ' de ' + pageCount + ' - DigiAgro © ' + new Date().getFullYear(), 105, 290, { align: 'center' });
      }
      
      // Guardar el PDF
      const fileName = 'cuaderno_campo_' + new Date().toISOString().split('T')[0] + '.pdf';
      doc.save(fileName);
      
      showAlert('Informe PDF generado correctamente', 'success');
      return fileName;
    } catch (error) {
      console.error('Error al generar informe PDF:', error);
      showAlert('Error al generar el informe PDF. Asegúrate de tener instalada la librería jsPDF.', 'danger');
      throw error;
    }
  };
  
  // Exportar datos a Excel
  const exportarExcel = async (datos, nombreArchivo) => {
    try {
      console.log('Exportando datos a Excel:', datos);
      
      // Verificar si XLSX está disponible
      if (!window.XLSX) {
        showAlert('Error al exportar a Excel: Librería XLSX no disponible', 'warning');
        return;
      }
      
      const XLSX = window.XLSX;
      
      // Preparar datos para exportación
      let datosExportar = [];
      
      if (datos.tipo === 'actividades') {
        // Formatear actividades para Excel
        datosExportar = actividades.map(act => ({
          Fecha: new Date(act.fecha).toLocaleDateString('es-ES'),
          Tarea: act.tarea,
          'Tipo de Cultivo': act.tipo_cultivo,
          Parcela: act.parcela || 'No especificado',
          'Superficie (ha)': act.superficie || 'No especificado',
          'Tiempo Dedicado (horas)': act.tiempo_dedicado || 'No especificado',
          'Personal Involucrado': act.personal_involucrado || 'No especificado',
          Observaciones: act.observaciones || ''
        }));
      } else if (datos.tipo === 'tratamientos') {
        // Formatear tratamientos para Excel
        datosExportar = tratamientos.map(trat => ({
          Fecha: new Date(trat.fecha).toLocaleDateString('es-ES'),
          Producto: trat.producto,
          'Tipo de Producto': trat.tipo_producto,
          'Cantidad Aplicada': `${trat.cantidad_aplicada} ${trat.unidad_medida}`,
          'Superficie Tratada': `${trat.superficie_tratada} ${trat.unidad_superficie}`,
          'Técnico Responsable': trat.tecnico_responsable || 'No especificado',
          Observaciones: trat.observaciones || ''
        }));
      } else if (datos.tipo === 'documentos') {
        // Formatear documentos para Excel
        datosExportar = documentos.map(doc => ({
          Nombre: doc.nombre,
          'Tipo de Documento': doc.tipo_documento,
          'Fecha de Subida': new Date(doc.fecha_subida).toLocaleDateString('es-ES'),
          Descripción: doc.descripcion || ''
        }));
      } else if (datos.tipo === 'todo') {
        // Crear múltiples hojas para un reporte completo
        const workbook = XLSX.utils.book_new();
        
        // Hoja de actividades
        if (actividades.length > 0) {
          const actividadesData = actividades.map(act => ({
            Fecha: new Date(act.fecha).toLocaleDateString('es-ES'),
            Tarea: act.tarea,
            'Tipo de Cultivo': act.tipo_cultivo,
            Parcela: act.parcela || 'No especificado',
            Observaciones: act.observaciones || ''
          }));
          const wsActividades = XLSX.utils.json_to_sheet(actividadesData);
          XLSX.utils.book_append_sheet(workbook, wsActividades, 'Actividades');
        }
        
        // Hoja de tratamientos
        if (tratamientos.length > 0) {
          const tratamientosData = tratamientos.map(trat => ({
            Fecha: new Date(trat.fecha).toLocaleDateString('es-ES'),
            Producto: trat.producto,
            'Tipo de Producto': trat.tipo_producto,
            'Cantidad Aplicada': `${trat.cantidad_aplicada} ${trat.unidad_medida}`,
            Observaciones: trat.observaciones || ''
          }));
          const wsTratamientos = XLSX.utils.json_to_sheet(tratamientosData);
          XLSX.utils.book_append_sheet(workbook, wsTratamientos, 'Tratamientos');
        }
        
        // Hoja de documentos
        if (documentos.length > 0) {
          const documentosData = documentos.map(doc => ({
            Nombre: doc.nombre,
            'Tipo de Documento': doc.tipo_documento,
            'Fecha de Subida': new Date(doc.fecha_subida).toLocaleDateString('es-ES'),
            Descripción: doc.descripcion || ''
          }));
          const wsDocumentos = XLSX.utils.json_to_sheet(documentosData);
          XLSX.utils.book_append_sheet(workbook, wsDocumentos, 'Documentos');
        }
        
        // Guardar libro completo
        const excelFileName = nombreArchivo || `cuaderno_campo_completo_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, excelFileName);
        showAlert('Archivo Excel generado correctamente', 'success');
        return excelFileName;
      }
      
      // En caso de un solo tipo de datos (no todo)
      if (datos.tipo !== 'todo') {
        // Crear libro y hoja
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(datosExportar);
        XLSX.utils.book_append_sheet(workbook, worksheet, datos.tipo.charAt(0).toUpperCase() + datos.tipo.slice(1));
        
        // Guardar archivo
        const excelFileName = nombreArchivo || `${datos.tipo}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, excelFileName);
        showAlert('Archivo Excel generado correctamente', 'success');
        return excelFileName;
      }
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      showAlert('Error al exportar a Excel. Asegúrate de tener instaladas las librerías necesarias.', 'danger');
      throw error;
    }
  };
  
  // Cargar datos iniciales cuando cambia el usuario
  useEffect(() => {
    if (user && user.id) {
      fetchInitialData();
    }
  }, [user]);
  
  return {
    // Estados
    actividades,
    tratamientos,
    documentos,
    isLoading,
    error,
    alertMessage,
    activeSection,
    
    // Funciones para cambiar la interfaz
    showAlert,
    changeSection,
    
    // CRUD de actividades
    fetchActividades,
    createActividad,
    updateActividad,
    deleteActividad,
    
    // CRUD de tratamientos
    fetchTratamientos,
    createTratamiento,
    updateTratamiento,
    deleteTratamiento,
    
    // CRUD de documentos
    fetchDocumentos,
    uploadDocumento,
    updateDocumento,
    deleteDocumento,
    
    // Funciones para informes y exportación
    generarInformePDF,
    exportarExcel
  };
};