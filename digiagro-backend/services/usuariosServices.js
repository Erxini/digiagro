const Usuario = require("../database/models/usuarios");
//const { Op } = require("sequelize");
//const crypto = require("crypto");
//const argon2 = require("argon2");
//const enviarCorreo = require("../email");

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
      return await Usuario.create(usuarioData);
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
    // 7.Obtener un usuario por nombre y contraseña
  // const getLogin = async (nombre, password) => {
  //   try {
  //     const usuario = await Usuario.findOne({ where: { nombre: nombre, password: password } });
  //     if (!usuario) {
  //       throw new Error("Usuario no encontrado");
  //     }
  //     return usuario;
  //   } catch (error) {
  //     throw new Error("Error al mostrar el usuario por nombre y contraseña: " + error.message);
  //   }
  // };
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


module.exports = { 
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  getUsuarioByEmail,
  getUsuarioByRol,
  updateUsuario,
  //getLogin,
  deleteUsuario,
  deleteAllUsuarios
};