import { useState, useEffect } from 'react';
import { useApi } from './useApi';

/**
 * Hook personalizado para gestionar la lógica del panel principal del usuario
 * @returns {Object} - Objeto con estados y funciones para el panel principal
 */
export const usePrincipal = () => {
  const { get } = useApi();
  
  // Estados
  const [cultivosData, setCultivosData] = useState([]);
  const [riegosData, setRiegosData] = useState([]);
  const [sueloData, setSueloData] = useState([]);
  const [produccionData, setProduccionData] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [userName, setUserName] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('info');

  // Obtener información del usuario desde localStorage si no está disponible a través del hook
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.nombre || 'Usuario');
    }
  }, []);

  // Cargar todos los datos iniciales
  useEffect(() => {
    fetchAllData();
  }, []);

  // Función para cargar todos los datos en paralelo
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Ejecutamos las llamadas en paralelo para mejorar el rendimiento
      const [cultivosResult, riegosResult, suelosResult, produccionResult] = await Promise.all([
        get('cultivos'),
        get('riegos'),
        get('suelo'),
        get('produccion')
      ]);
      
      // Actualizamos todos los estados
      setCultivosData(cultivosResult);
      setRiegosData(riegosResult);
      setSueloData(suelosResult);
      setProduccionData(produccionResult);

      // Actualizamos la fecha de la última actualización
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showAlert('Error al cargar los datos. Por favor, intente nuevamente.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar alertas
  const showAlert = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    
    // Limpiar la alerta después de 5 segundos
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Obtener cultivos
  const obtenerCultivos = async () => {
    try {
      const result = await get('cultivos');
      setCultivosData(result);
      setLastUpdate(new Date().toLocaleString());
      return result; // Devolvemos el resultado para uso opcional
    } catch (error) {
      console.error('Error al obtener cultivos:', error);
      showAlert('Error al actualizar cultivos', 'danger');
      return null;
    }
  };

  // Obtener riegos
  const obtenerRiegos = async () => {
    try {
      const result = await get('riegos');
      setRiegosData(result);
      setLastUpdate(new Date().toLocaleString());
      return result;
    } catch (error) {
      console.error('Error al obtener riegos:', error);
      showAlert('Error al actualizar riegos', 'danger');
      return null;
    }
  };

  // Obtener suelos
  const obtenerSuelos = async () => {
    try {
      const result = await get('suelo');
      setSueloData(result);
      setLastUpdate(new Date().toLocaleString());
      return result;
    } catch (error) {
      console.error('Error al obtener suelos:', error);
      showAlert('Error al actualizar suelos', 'danger');
      return null;
    }
  };

  // Obtener producciones
  const obtenerProducciones = async () => {
    try {
      const result = await get('produccion');
      setProduccionData(result);
      setLastUpdate(new Date().toLocaleString());
      return result;
    } catch (error) {
      console.error('Error al obtener producciones:', error);
      showAlert('Error al actualizar producciones', 'danger');
      return null;
    }
  };

  // Cambiar sección activa
  const changeSection = (section) => {
    setActiveSection(section);
  };

  // Actualizar todos los datos relacionados (función nueva para sincronización)
  const refreshAllRelatedData = async () => {
    try {
      showAlert('Actualizando datos...', 'info');
      await Promise.all([
        obtenerCultivos(),
        obtenerRiegos(),
        obtenerSuelos(),
        obtenerProducciones()
      ]);
      showAlert('Todos los datos actualizados correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar todos los datos:', error);
      showAlert('Error al actualizar los datos', 'danger');
    }
  };

  return {
    // Estados
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
    
    // Funciones
    obtenerCultivos,
    obtenerRiegos,
    obtenerSuelos,
    obtenerProducciones,
    showAlert,
    changeSection,
    setAlertMessage,
    refreshAllRelatedData // Exportamos la nueva función
  };
};