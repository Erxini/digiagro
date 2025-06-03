const Usuario = require("../database/models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const enviarCorreo = require("../email");
const crypto = require("crypto");

// Definir una clave secreta para JWT (en producción, guarda esto en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "digiagro_secret_key";
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
    
    // Verificación de contraseña temporal - Comprobación directa para los usuarios existentes
    // Esto es para compatibilidad con contraseñas almacenadas en texto plano
    let passwordMatch = false;
    
    // Primero intentamos comparación directa (para usuarios con contraseñas en texto plano)
    if (usuario.password === password) {
      passwordMatch = true;
      console.log("Autenticación exitosa mediante comparación directa de contraseña");
    } else {
      // Si no coincide, intentamos con bcrypt (para usuarios con contraseñas hasheadas)
      try {
        passwordMatch = await bcrypt.compare(password, usuario.password);
        console.log("Autenticación exitosa mediante bcrypt");
      } catch (err) {
        console.log("Error al comparar con bcrypt, posiblemente contraseña no hasheada:", err.message);
        passwordMatch = false;
      }
    }
    
    if (!passwordMatch) {
      throw new Error("Credenciales inválidas");
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Devolver usuario y token
    return {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || "",
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
const deleteAllUsuarios = async (excludeAdmins = false) => {
  try {
    if (excludeAdmins) {
      // Si excludeAdmins es true, excluir a los administradores
      return await Usuario.destroy({ 
        where: { 
          rol: { 
            [Op.ne]: 'Admin' 
          } 
        } 
      });
    } else {
      // Si excludeAdmins es false (o no se proporciona), eliminar todos
      return await Usuario.destroy({ where: {} });
    }
  } catch (error) {
    throw new Error("Error al eliminar todos los usuarios: " + error.message);
  }
};

// Nueva función para verificar un token JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    // Normalizamos el formato para asegurar consistencia
    // Si el token tiene userId pero no id, agregamos id
    if (decoded.userId && !decoded.id) {
      decoded.id = decoded.userId;
    }
    // Si el token tiene id pero no userId, agregamos userId
    else if (decoded.id && !decoded.userId) {
      decoded.userId = decoded.id;
    }
    
    return decoded;
  } catch (error) {
    console.error('Error al verificar token:', error);
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

// 10. Recuperar contraseña
const recuperarPassword = async (email) => {
  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email: email } });
    
    if (!usuario) {
      throw new Error("No existe ningún usuario con ese correo electrónico");
    }
    
    // Generar nueva contraseña aleatoria
    const nuevaPassword = crypto.randomBytes(4).toString('hex');
    
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);
    
    // Actualizar la contraseña del usuario
    await usuario.update({ password: hashedPassword });
    
    // Enviar correo con la nueva contraseña
    const resultado = await enviarCorreo(email, nuevaPassword);
    
    if (!resultado.success) {
      console.error("Error al enviar correo:", resultado.error);
      throw new Error("Error al enviar el correo de recuperación");
    }
    
    // Si estamos en desarrollo, mostrar la URL de vista previa del correo
    if (resultado.previewUrl) {
      console.log("⭐ ENLACE PARA VER EL CORREO (desarrollo): ", resultado.previewUrl);
    }
    
    return {
      success: true,
      mensaje: "Contraseña actualizada y correo enviado correctamente",
      previewUrl: resultado.previewUrl || null
    };
  } catch (error) {
    throw new Error("Error al recuperar la contraseña: " + error.message);
  }
};

// Nueva función para que un usuario elimine su propia cuenta
const deleteOwnAccount = async (userId) => {
  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    
    // Gracias a las relaciones CASCADE definidas en associations.js,
    // la eliminación del usuario borrará automáticamente todos sus:
    // - Cultivos (y por cascada también riegos, producciones y suelos)
    // - ActividadCampo
    // - TratamientoCampo
    // - DocumentoCampo
    
    return await usuario.destroy();
  } catch (error) {
    throw new Error("Error al eliminar la cuenta y datos asociados: " + error.message);
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
  countUsuarios,
  recuperarPassword,
  deleteOwnAccount
};