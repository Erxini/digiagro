import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';

/**
 * Hook personalizado para gestionar la lógica del panel principal del usuario
 * @returns {Object} - Objeto con estados y funciones para el panel principal
 */
export const usePrincipal = () => {
  const { user } = useAuth();
  const { get } = useApi();
  
  // Estados
  const [cultivosData, setCultivosData] = useState([]);
  const [riegosData, setRiegosData] = useState([]);
  const [sueloData, setSueloData] = useState([]);
  const [produccionData, setProduccionData] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('info');

  // Obtener información del usuario desde localStorage si no está disponible a través del hook
  useEffect(() => {
    if (user) {
      setUserName(user.nombre || '');
      setUserId(user.id || null);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData) {
            setUserName(userData.nombre || '');
            setUserId(userData.id || null);
          }
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error);
        }
      }
    }
  }, [user]);

  // Obtener datos iniciales cuando el componente se monta y cuando cambia el userId
  useEffect(() => {
    if (userId) {
      fetchInitialData();
    }
  }, [userId]);

  // Función para cargar todos los datos iniciales
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        obtenerCultivos(),
        obtenerRiegos(),
        obtenerSuelos(),
        obtenerProducciones()
      ]);
    } catch (error) {
      console.error('Error al obtener datos iniciales:', error);
      showAlert('Error al cargar los datos. Por favor, intente nuevamente.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar alertas
  const showAlert = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Función para cambiar la sección activa
  const changeSection = (section) => {
    setActiveSection(section);
  };

  // Función para obtener los cultivos del usuario actual
  const obtenerCultivos = async () => {
    if (!userId) return;
    
    try {
      const response = await get(`cultivos?usuarioId=${userId}`);
      if (Array.isArray(response)) {
        setCultivosData(response);
        setLastUpdate(new Date().toLocaleString());
      } else {
        setCultivosData([]);
        console.warn('La respuesta de cultivos no es un array:', response);
      }
    } catch (error) {
      console.error('Error al obtener cultivos:', error);
      showAlert('Error al obtener los cultivos.', 'danger');
      setCultivosData([]);
    }
  };

  // Función para obtener los riegos del usuario actual
  const obtenerRiegos = async () => {
    if (!userId) return;
    
    try {
      const response = await get(`riegos?usuarioId=${userId}`);
      if (Array.isArray(response)) {
        setRiegosData(response);
        setLastUpdate(new Date().toLocaleString());
      } else {
        setRiegosData([]);
        console.warn('La respuesta de riegos no es un array:', response);
      }
    } catch (error) {
      console.error('Error al obtener riegos:', error);
      showAlert('Error al obtener los riegos.', 'danger');
      setRiegosData([]);
    }
  };

  // Función para obtener los datos de suelo del usuario actual
  const obtenerSuelos = async () => {
    if (!userId) return;
    
    try {
      const response = await get(`suelo?usuarioId=${userId}`);
      if (Array.isArray(response)) {
        setSueloData(response);
        setLastUpdate(new Date().toLocaleString());
      } else {
        setSueloData([]);
        console.warn('La respuesta de suelos no es un array:', response);
      }
    } catch (error) {
      console.error('Error al obtener datos de suelo:', error);
      showAlert('Error al obtener datos de suelo.', 'danger');
      setSueloData([]);
    }
  };

  // Función para obtener las producciones del usuario actual
  const obtenerProducciones = async () => {
    if (!userId) return;
    
    try {
      const response = await get(`produccion?usuarioId=${userId}`);
      if (Array.isArray(response)) {
        setProduccionData(response);
        setLastUpdate(new Date().toLocaleString());
      } else {
        setProduccionData([]);
        console.warn('La respuesta de producciones no es un array:', response);
      }
    } catch (error) {
      console.error('Error al obtener datos de producción:', error);
      showAlert('Error al obtener datos de producción.', 'danger');
      setProduccionData([]);
    }
  };

  // Refrescar todos los datos
  const refreshAllData = async () => {
    await fetchInitialData();
  };

  return {
    // Estados
    cultivosData,
    riegosData,
    sueloData,
    produccionData,
    activeSection,
    userName,
    userId,
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
    refreshAllData,
    setAlertMessage
  };
};