const usuariosServices = require('../services/usuariosServices');

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
    }
    
    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];
    
    // Verificar y decodificar el token
    const decoded = usuariosServices.verifyToken(token);
    
    // Añadir la información del usuario al objeto de solicitud
    req.user = decoded;
    
    // Continuar con la siguiente función en la cadena
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// Middleware para verificar roles
const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }
    
    // Si roles es un string, convertirlo a array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso.' });
    }
    
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };