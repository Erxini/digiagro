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
  const [loginFieldErrors, setLoginFieldErrors] = useState({}); // Nuevo estado para errores específicos de campos
  const { post, error } = useApi();
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

  // Comprobar si hay un usuario y token en localStorage al cargar la página
  useEffect(() => {
    const checkAuthState = () => {
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

  return {
    user,
    token,
    isAuthenticated,
    authError,
    loginFieldErrors, // Exportar el nuevo estado
    login,
    register,
    logout,
    getAuthHeader,
    resetInactivityTimer // Exportamos esta función para poder usarla desde fuera si es necesario
  };
};