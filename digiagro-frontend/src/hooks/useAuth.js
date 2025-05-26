import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from './useApi';

/**
 * Hook personalizado para gestionar la autenticación de usuarios
 * @returns {Object} - Objeto con estados y funciones para la autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [loginFieldErrors, setLoginFieldErrors] = useState({});
  const { post, put, del, error } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Referencia para el temporizador de inactividad
  const inactivityTimerRef = useRef(null);
  // Duración de la sesión en milisegundos (60 minutos = 3600000 ms)
  const SESSION_TIMEOUT = 60 * 60 * 1000;

  // Función para reiniciar el temporizador de inactividad
  const resetInactivityTimer = () => {
    // Limpiar el temporizador anterior si existe
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Solo configurar un nuevo temporizador si el usuario está autenticado
    if (isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        console.log('Sesión cerrada por inactividad (60 minutos)');
        logout();
      }, SESSION_TIMEOUT);
    }
  };

  // Función para guardar la marca de tiempo al cerrar la sesión o recargar la página
  const setLogoutTimestamp = () => {
    const timestamp = new Date().getTime();
    sessionStorage.setItem('logoutTimestamp', timestamp);
  };

  // Función para comprobar si la sesión debe considerarse expirada
  const isSessionExpired = () => {
    // La sesión se considera expirada si:
    // 1. No hay datos en localStorage, o
    // 2. La página fue cerrada o recargada (hay una marca de tiempo en sessionStorage)
    return sessionStorage.getItem('logoutTimestamp') !== null;
  };

  // Efecto para configurar los listeners de eventos que reinician el temporizador
  useEffect(() => {
    // Eventos de usuario que indican actividad
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Función que maneja cualquier evento de actividad
    const handleUserActivity = () => {
      resetInactivityTimer();
    };
    
    // Configurar listeners solo si el usuario está autenticado
    if (isAuthenticated) {
      // Añadir listeners para cada tipo de evento
      activityEvents.forEach(eventType => {
        window.addEventListener(eventType, handleUserActivity);
      });
      
      // Configurar el temporizador inicial
      resetInactivityTimer();
      
      // Limpiar al desmontar el componente
      return () => {
        // Eliminar todos los listeners
        activityEvents.forEach(eventType => {
          window.removeEventListener(eventType, handleUserActivity);
        });
        
        // Limpiar el temporizador
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [isAuthenticated]); // Este efecto se ejecuta cuando cambia isAuthenticated

  // Efecto para manejar el cierre o recarga de la ventana/pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        // Establecer la marca de tiempo cuando el usuario cierra o recarga la pestaña/navegador
        setLogoutTimestamp();
      }
    };

    // Registrar el evento para cuando el usuario cierre o recargue la ventana
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated]);

  // Efecto para cerrar sesión al cargar la página si se detecta que fue cerrada o recargada anteriormente
  useEffect(() => {
    // Verificar si la sesión debe ser invalidada al cargar
    if (isSessionExpired()) {
      // Limpiar la marca de tiempo
      sessionStorage.removeItem('logoutTimestamp');
      
      // Si teníamos una sesión activa, cerrarla
      if (localStorage.getItem('token') && localStorage.getItem('user')) {
        console.log('Sesión cerrada debido a cierre previo o recarga de la página');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        
        // Redirigir al home al recargar
        if (location.pathname !== '/') {
          navigate('/');
        }
      }
    }
  }, [navigate, location.pathname]);

  // Comprobar si hay un usuario y token en localStorage al cargar la página
  useEffect(() => {
    const checkAuthState = () => {
      // Si la sesión está marcada como expirada, no restaurar datos
      if (isSessionExpired()) {
        return;
      }
      
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
          
          // Verificar si userData tiene las propiedades esperadas
          if (!userData.nombre || !userData.email || !userData.rol) {
            console.warn('Datos de usuario incompletos en localStorage');
          }
        } catch (err) {
          console.error('Error al recuperar datos del usuario:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        // Asegurarnos de que isAuthenticated sea false si no hay datos en localStorage
        setIsAuthenticated(false);
      }
    };
    
    // Verificar el estado inicial
    checkAuthState();
    
    // También podemos escuchar cambios en el localStorage
    const handleStorageChange = () => {
      checkAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    setAuthError(null);
    setLoginFieldErrors({}); // Limpiar errores de campo al intentar un nuevo login
    
    try {
      console.log('Enviando credenciales al servidor:', credentials);
      const response = await post('usuarios/login', credentials);
      
      if (response && response.usuario && response.token) {
        // Validar que tengamos todos los datos necesarios del usuario
        if (!response.usuario.nombre || !response.usuario.email || !response.usuario.rol) {
          console.warn('La respuesta del servidor no incluye todos los datos requeridos del usuario');
        }
        
        console.log('Datos del usuario recibidos:', response.usuario); // Para depuración
        
        // Limpiar cualquier marca de cierre de sesión previa
        sessionStorage.removeItem('logoutTimestamp');
        
        // Guardar usuario y token por separado
        localStorage.setItem('user', JSON.stringify(response.usuario));
        localStorage.setItem('token', response.token);
        
        setUser(response.usuario);
        setToken(response.token);
        setIsAuthenticated(true);
        
        // Emitir evento personalizado para notificar cambios en la autenticación
        const authEvent = new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: true } 
        });
        window.dispatchEvent(authEvent);
        
        // Redirigir después de inicio de sesión exitoso
        navigate('/principal');
        
        return true;
      } else {
        console.error('Respuesta incompleta del servidor:', response);
        // En lugar de mostrar un error general, marcamos este como un error de credenciales
        setLoginFieldErrors({
          password: 'Contraseña incorrecta'
        });
        return false;
      }
    } catch (err) {
      console.error('Error completo al iniciar sesión:', err);
      
      // Siempre establecer el error de contraseña para fallos de autenticación
      if (error) {
        setLoginFieldErrors({
          password: 'Contraseña incorrecta'
        });
      } else {
        setLoginFieldErrors({
          password: 'Contraseña incorrecta'
        });
      }
      
      return false;
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    setAuthError(null);
    
    try {
      const result = await post('usuarios', userData);
      
      if (result) {
        return true;
      }
      
      return false;
    } catch (err) {
      setAuthError(error || 'Error al registrar el usuario');
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar el temporizador de inactividad
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('logoutTimestamp'); // Limpiar la marca de cierre
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Emitir evento personalizado para notificar cambios en la autenticación
    const authEvent = new CustomEvent('authStateChanged', { 
      detail: { isAuthenticated: false } 
    });
    window.dispatchEvent(authEvent);
    
    navigate('/');
  };

  // Obtener el token para incluirlo en las cabeceras de las peticiones
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Función para recuperar contraseña
  const recuperarPassword = async (email) => {
    setAuthError(null);
    
    try {
      const response = await post('usuarios/recuperar-password', { email });
      return response;
    } catch (err) {
      setAuthError(error || 'Error al procesar la solicitud');
      return false;
    }
  };

  // Función para editar perfil de usuario
  const updateUserProfile = async (userData) => {
    setAuthError(null);
    
    try {
      const updatedUser = await put('usuarios/perfil', userData);
      
      if (updatedUser) {
        // Actualizar el usuario en el estado y localStorage
        const newUserData = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
        return { success: true, data: updatedUser };
      }
      
      return { success: false, error: 'No se pudo actualizar el perfil' };
    } catch (err) {
      setAuthError(error || 'Error al actualizar el perfil');
      return { success: false, error: error || 'Error al actualizar el perfil' };
    }
  };

  // Función para eliminar la cuenta del usuario
  const deleteUserAccount = async () => {
    setAuthError(null);
    
    try {
      const response = await del('usuarios/perfil');
      
      if (response) {
        // Cerrar sesión después de eliminar la cuenta
        logout();
        return { success: true };
      }
      
      return { success: false, error: 'No se pudo eliminar la cuenta' };
    } catch (err) {
      setAuthError(error || 'Error al eliminar la cuenta');
      return { success: false, error: error || 'Error al eliminar la cuenta' };
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    authError,
    loginFieldErrors,
    login,
    register,
    logout,
    recuperarPassword,
    getAuthHeader,
    resetInactivityTimer,
    updateUserProfile,
    deleteUserAccount
  };
};