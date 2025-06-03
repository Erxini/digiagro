import { useState, useEffect } from 'react';

/**
 * Hook personalizado para realizar peticiones HTTP a la API
 * @param {string} baseUrl - URL base para las peticiones (por defecto la API de DigiAgro)
 * @returns {Object} - Objeto con estados y funciones para realizar peticiones HTTP
 */
export const useApi = (baseUrl = 'http://localhost:3000/digiagro') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Cargar token desde localStorage al inicializar el hook
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  /**
   * Obtener las cabeceras de autenticación
   */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Obtener el token más actualizado
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  /**
   * Obtener el ID del usuario autenticado
   */
  const getUserId = () => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        console.log('Info de usuario en localStorage:', user);
        // Intentar con diferentes propiedades posibles para el ID
        const userId = user.id || user.userId || user.id_usuario;
        console.log('ID de usuario detectado:', userId);
        return userId;
      } catch (e) {
        console.error('Error al obtener el ID del usuario:', e);
      }
    }
    return null;
  };

  /**
   * Realizar una petición GET
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones adicionales para fetch
   */
  const get = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Realizando GET a ${baseUrl}/${endpoint}`);
      
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        ...options
      });
      
      // Capturar el texto de la respuesta primero
      const responseText = await response.text();
      console.log(`Respuesta recibida de ${endpoint}:`, responseText);
      
      // Si no hay contenido en la respuesta
      if (!responseText || responseText.trim() === '') {
        console.log('La respuesta está vacía');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return [];
      }
      
      // Intentar parsear la respuesta como JSON
      let resultData;
      try {
        resultData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error al parsear respuesta JSON:', e);
        return [];
      }
      
      // Actualizar el estado data con el resultado
      setData(resultData);
      return resultData;
    } catch (err) {
      console.error('Error en la petición GET:', err);
      setError(err.message || 'Error desconocido');
      return []; // Devolvemos un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realizar una petición POST
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales para fetch
   * @param {boolean} includeUserId - Si se debe incluir automáticamente el ID del usuario
   */
  const post = async (endpoint, body, options = {}, includeUserId = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si se debe incluir el ID del usuario y el endpoint es relevante
      let dataToSend = { ...body };
      if (includeUserId || 
          endpoint.includes('cultivos') || 
          endpoint.includes('riegos') || 
          endpoint.includes('suelo') || 
          endpoint.includes('produccion') || 
          endpoint.includes('tratamiento')) {
        const userId = getUserId();
        if (userId && !dataToSend.id_usuario) {
          dataToSend.id_usuario = userId;
        }
      }
      
      console.log(`Realizando POST a ${baseUrl}/${endpoint} con datos:`, dataToSend);
      
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(dataToSend),
        ...options
      });
      
      // Capturar el texto de la respuesta primero para poder inspeccionarlo
      const responseText = await response.text();
      console.log(`Respuesta recibida de ${endpoint}:`, responseText);
      
      // Si no hay contenido, devolvemos un objeto vacío o null
      if (!responseText) {
        console.log('La respuesta está vacía');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.status === 204 ? {} : null;
      }
      
      // Intentamos parsear la respuesta como JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error al parsear la respuesta como JSON:', e);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }
      
      // Si la respuesta no es exitosa, lanzamos el error
      if (!response.ok) {
        const errorMessage = responseData.error || `Error ${response.status}: ${response.statusText}`;
        console.error('Error en la petición:', errorMessage);
        throw new Error(errorMessage);
      }
      
      setData(responseData);
      return responseData;
    } catch (err) {
      console.error('Error completo en la petición POST:', err);
      setError(err.message || 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realizar una petición PUT
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales para fetch
   * @param {boolean} includeUserId - Si se debe incluir automáticamente el ID del usuario
   */
  const put = async (endpoint, body, options = {}, includeUserId = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si se debe incluir el ID del usuario y el endpoint es relevante
      let dataToSend = { ...body };
      if (includeUserId || 
          endpoint.includes('cultivos') || 
          endpoint.includes('riegos') || 
          endpoint.includes('suelo') || 
          endpoint.includes('produccion') || 
          endpoint.includes('tratamiento')) {
        const userId = getUserId();
        if (userId && !dataToSend.id_usuario) {
          dataToSend.id_usuario = userId;
        }
      }
      
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(dataToSend),
        ...options
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición');
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realizar una petición DELETE
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones adicionales para fetch
   */
  const del = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Realizando DELETE a ${baseUrl}/${endpoint}`);
      console.log('Headers de autenticación:', getAuthHeaders());
      
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        ...options
      });
      
      console.log(`Respuesta DELETE de ${endpoint} - Status:`, response.status);
      
      // Intentar leer la respuesta como texto primero
      const responseText = await response.text();
      console.log(`Respuesta completa DELETE de ${endpoint}:`, responseText);
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        // Intentar parsear el error como JSON si existe
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            console.error('Error al parsear respuesta de error:', e);
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Para respuestas 204 No Content
      if (response.status === 204) {
        console.log('Operación DELETE exitosa (204 No Content)');
        setData({});
        return {};
      }
      
      // Si hay contenido en la respuesta, intentamos parsearlo
      if (responseText && responseText.trim() !== '') {
        try {
          const result = JSON.parse(responseText);
          setData(result);
          return result;
        } catch (e) {
          console.error('Error al parsear respuesta JSON:', e);
          return {};
        }
      }
      
      return {};
    } catch (err) {
      console.error('Error en la petición DELETE:', err);
      setError(err.message || 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getUserId,
    get,
    post,
    put,
    del
  };
};