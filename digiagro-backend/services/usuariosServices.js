const Usuario = require("../database/models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Definir una clave secreta para JWT (en producción, guarda esto en variables de entorno)
const JWT_SECRET = "digiagro_secret_key"; // ¡Cambia esto en producción!
const SALT_ROUNDS = 10; // Número de rondas para el algoritmo de hashing

// 1.Obtener todos los usuarios
const getAllUsuarios = async () => {
  try {
    return await Usuario.findAll();
  } catch (error) {
    throw new Error("Error al mostrar todos los usuarios: " + error.message);
  }
};

// 2.Obtener un usuario por ID
const getUsuarioById = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (error) {
    throw new Error("Error al mostrar el usuario por ID: " + error.message);
  }
};

// 3.Obtener un usuario por email
const getUsuarioByEmail = async (email) => {
  try {
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (error) {
    throw new Error("Error al mostrar el usuario por email: " + error.message);
  }
};

// 4.Obtener un usuario por rol
const getUsuarioByRol = async (rol) => {
  try {
    const usuario = await Usuario.findOne({ where: { rol: rol } });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (error) {
    throw new Error("Error al mostrar el usuario por rol: " + error.message);
  }
};

// 5.Crear un nuevo usuario
const createUsuario = async (usuarioData) => {
  try {
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(usuarioData.password, SALT_ROUNDS);
    
    // Reemplazar la contraseña en texto plano con la hasheada
    const secureUserData = {
      ...usuarioData,
      password: hashedPassword
    };
    
    return await Usuario.create(secureUserData);
  } catch (error) {
    throw new Error("Error al crear el usuario: " + error.message);
  }
};

// 6.Modificar un usuario por ID
const updateUsuario = async (id, usuarioData) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return await usuario.update(usuarioData);
  } catch (error) {
    throw new Error("Error al modificar el usuario: " + error.message);
  }
};

// 7.Autenticar usuario (login)
const getLogin = async (email, password) => {
  try {
    // Buscar usuario solo por email
    const usuario = await Usuario.findOne({ where: { email: email } });
    
    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }
    
    // Verificar la contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    
    if (!passwordMatch) {
      throw new Error("Credenciales inválidas");
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Devolver usuario y token
    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    };
  } catch (error) {
    throw new Error("Error durante el inicio de sesión: " + error.message);
  }
};

// 8.Eliminar un usuario por ID
const deleteUsuario = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return await usuario.destroy();
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
};

// 9.Eliminar todos los usuarios
const deleteAllUsuarios = async () => {
  try {
    return await Usuario.destroy({ where: {}, truncate: true });
  } catch (error) {
    throw new Error("Error al eliminar todos los usuarios: " + error.message);
  }
};

// Nueva función para verificar un token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
}

// Contar usuarios (para depuración)
const countUsuarios = async () => {
  try {
    return await Usuario.count();
  } catch (error) {
    throw new Error("Error al contar usuarios: " + error.message);
  }
};

module.exports = { 
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  getUsuarioByEmail,
  getUsuarioByRol,
  updateUsuario,
  getLogin,
  deleteUsuario,
  deleteAllUsuarios,
  verifyToken,
  countUsuarios
};