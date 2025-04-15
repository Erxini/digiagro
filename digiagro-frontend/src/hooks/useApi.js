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
   * Realizar una petición GET
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones adicionales para fetch
   */
  const get = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Incluir automáticamente el token
          ...options.headers
        },
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
   * Realizar una petición POST
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales para fetch
   */
  const post = async (endpoint, body, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Incluir automáticamente el token
          ...options.headers
        },
        body: JSON.stringify(body),
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
   * Realizar una petición PUT
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales para fetch
   */
  const put = async (endpoint, body, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Incluir automáticamente el token
          ...options.headers
        },
        body: JSON.stringify(body),
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
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Incluir automáticamente el token
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición');
      }
      
      // Para respuestas 204 No Content
      if (response.status === 204) {
        setData({});
        return {};
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

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    del
  };
};