import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { post, error } = useApi();
  const navigate = useNavigate();

  // Comprobar si hay un usuario y token en localStorage al cargar la página
  useEffect(() => {
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
      }
    }
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    setAuthError(null);
    
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
        
        // Redirigir según el rol (asegurándonos de realizar la comparación correcta)
        console.log('Rol del usuario:', response.usuario.rol);
        if (response.usuario.rol === 'Admin') {
          console.log('Redirigiendo a /admin');
          navigate('/admin');
        } else {
          console.log('Redirigiendo a /principal');
          navigate('/principal');
        }
        
        return true;
      } else {
        console.error('Respuesta incompleta del servidor:', response);
        setAuthError('Respuesta incompleta del servidor');
        return false;
      }
    } catch (err) {
      console.error('Error completo al iniciar sesión:', err);
      setAuthError(error || 'Error al iniciar sesión');
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
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
    login,
    register,
    logout,
    getAuthHeader
  };
};