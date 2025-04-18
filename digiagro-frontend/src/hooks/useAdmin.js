import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para gestionar la lógica del panel de administración
 * @returns {Object} - Objeto con estados y funciones para el panel de administración
 */
export const useAdmin = () => {
  // Estados
  const [usersData, setUsersData] = useState(null);
  const [cultivosData, setCultivosData] = useState(null);
  const [produccionData, setProduccionData] = useState(null);
  const [activeSection, setActiveSection] = useState('usuarios');
  const [adminName, setAdminName] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');

  // Hooks
  const { get } = useApi();
  const { user } = useAuth();

  // Efecto para obtener los datos del usuario desde localStorage si no están disponibles a través del hook
  useEffect(() => {
    if (user && user.nombre) {
      setAdminName(user.nombre);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData.nombre) {
            setAdminName(userData.nombre);
          }
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error);
        }
      }
    }
  }, [user]);

  // Mostrar mensaje de alerta y ocultarlo después de 5 segundos
  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Obtener estadísticas iniciales
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      await listarUsuarios();
      await obtenerTodosCultivos();
      await obtenerTodasProducciones();
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setIsLoading(false);
    }
  };

  // Funciones principales para cargar datos
  const listarUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await get('usuarios');
      setUsersData(response);
      setLastUpdate(new Date().toLocaleString());
      setIsLoading(false);
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      showAlert('Error al listar usuarios', 'danger');
      setIsLoading(false);
    }
  };

  const obtenerTodosCultivos = async () => {
    try {
      const response = await get('cultivos');
      setCultivosData(response);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error al obtener cultivos:', error);
      showAlert('Error al obtener cultivos', 'danger');
    }
  };

  const obtenerTodasProducciones = async () => {
    try {
      const response = await get('produccion');
      setProduccionData(response);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error al obtener producciones:', error);
      showAlert('Error al obtener producciones', 'danger');
    }
  };

  // Cambiar la sección activa o cerrarla
  const changeSection = (section) => {
    setActiveSection(section);
  };

  // Refrescar todos los datos
  const refreshAllData = async () => {
    await fetchInitialData();
  };

  return {
    // Estados
    usersData,
    cultivosData,
    produccionData,
    activeSection,
    adminName,
    lastUpdate,
    isLoading,
    alertMessage,
    alertType,
    
    // Funciones
    listarUsuarios,
    obtenerTodosCultivos,
    obtenerTodasProducciones,
    showAlert,
    changeSection,
    refreshAllData,
    setAlertMessage
  };
};