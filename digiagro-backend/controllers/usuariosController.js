const UsuariosService = require("../services/usuariosServices");
const { Usuarios } = require("../database/models/usuarios");
//const argon2 = require("argon2");
//const jwt = require("jwt-simple");
//const moment = require('moment');
  // 1. Obtener todos los usuarios
  const getAllUsuarios = async (req, res) => {
    try {
      const usuarios = await UsuariosService.getAllUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 2. Obtener un usuario por ID
  const getUsuarioById = async (req, res) => {
    try {
      const usuario = await UsuariosService.getUsuarioById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 3. Obtener un usuario por email
  const getUsuarioByEmail = async (req, res) => {
    try {
      const usuario = await UsuariosService.getUsuarioByEmail(req.params.email);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 4. Obtener usuarios por rol
  const getUsuarioByRol = async (req, res) => {
    try {
      const usuarios = await UsuariosService.getUsuarioByRol(req.params.rol);
      if (!usuarios) {
        return res.status(404).json({ error: "Usuarios no encontrados" });
      }
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 5. Crear un nuevo usuario
  const createUsuario = async (req, res) => {
    console.log(req.body)
    try {
      const usuario = await UsuariosService.createUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  };

  // 6. Actualizar un usuario por ID
  const updateUsuario = async (req, res) => {
    try {
      const usuario = await UsuariosService.updateUsuario(
        req.params.id,
        req.body
      );
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // 7. Autenticar usuario (login)
  const getLogin = async (req, res) => {
    try {
      const result = await UsuariosService.getLogin(
        req.body.email,
        req.body.password
      );
      
      // Ahora devolvemos el usuario y el token
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  // 8. Eliminar un usuario por ID
  const deleteUsuario = async (req, res) => {
    try {
      await UsuariosService.deleteUsuario(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 9. Eliminar todos los usuarios
  const deleteAllUsuarios = async (req, res) => {
    try {
      const excludeAdmins = req.query.excludeAdmins === 'true';
      await UsuariosService.deleteAllUsuarios(excludeAdmins);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Verificar si hay usuarios en la base de datos (para depuración)
  const checkUsuarios = async (req, res) => {
    try {
      const count = await UsuariosService.countUsuarios();
      res.json({ 
        count: count,
        message: count > 0 ? "Hay usuarios en la base de datos" : "No hay usuarios en la base de datos"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  getUsuarioByRol,
  createUsuario,
  updateUsuario,
  getLogin,
  deleteUsuario,
  deleteAllUsuarios,
  checkUsuarios
};