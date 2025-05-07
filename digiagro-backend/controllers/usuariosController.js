const {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  getUsuarioByEmail,
  getUsuarioByRol,
  updateUsuario,
  getLogin,
  deleteUsuario,
  deleteAllUsuarios,
  countUsuarios,
  recuperarPassword
} = require("../services/usuariosServices");


// 1. Obtener todos los usuarios
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await getUsuarioById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Obtener un usuario por email
const obtenerUsuarioPorEmail = async (req, res) => {
  try {
    const usuario = await getUsuarioByEmail(req.params.email);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Obtener usuarios por rol
const obtenerUsuariosPorRol = async (req, res) => {
  try {
    const usuarios = await getUsuarioByRol(req.params.rol);
    if (!usuarios) {
      return res.status(404).json({ error: "Usuarios no encontrados" });
    }
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  console.log(req.body)
  try {
    const usuario = await createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ error: error.message });
  }
};

// 6. Actualizar un usuario por ID
const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await updateUsuario(
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
const loginUsuario = async (req, res) => {
  try {
    const result = await getLogin(
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
const eliminarUsuario = async (req, res) => {
  try {
    await deleteUsuario(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Eliminar todos los usuarios
const eliminarTodosLosUsuarios = async (req, res) => {
  try {
    const excludeAdmins = req.query.excludeAdmins === 'true';
    await deleteAllUsuarios(excludeAdmins);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verificar si hay usuarios en la base de datos (para depuración)
const verificarUsuarios = async (req, res) => {
  try {
    const count = await countUsuarios();
    res.json({ 
      count: count,
      message: count > 0 ? "Hay usuarios en la base de datos" : "No hay usuarios en la base de datos"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para recuperar la contraseña de un usuario
const recuperarPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "El correo electrónico es obligatorio" });
    }
    
    const resultado = await recuperarPassword(email);
    
    // Respuesta exitosa con información adicional para desarrollo
    res.status(200).json({
      success: true,
      message: "Si el correo electrónico existe en nuestra base de datos, recibirás un correo con tu nueva contraseña",
      // Solo en desarrollo, incluir la URL de vista previa
      previewUrl: process.env.NODE_ENV !== 'production' ? resultado.previewUrl : undefined
    });
  } catch (error) {
    console.error("Error en recuperarPasswordController:", error);
    
    // Siempre devolver el mismo mensaje de éxito por seguridad
    // (no revelar si el email existe o no)
    res.status(200).json({
      success: true,
      message: "Si el correo electrónico existe en nuestra base de datos, recibirás un correo con tu nueva contraseña"
    });
  }
};

// 11. Editar perfil propio
const editarPerfilPropio = async (req, res) => {
  try {
    // El id del usuario viene del token de autenticación
    const userId = req.user.id;
    
    // No permitimos cambiar el rol desde aquí
    if (req.body.rol) {
      delete req.body.rol;
    }
    
    const usuario = await updateUsuario(userId, req.body);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    // Eliminamos la contraseña del objeto a devolver por seguridad
    const { password, ...usuarioSinPassword } = usuario.toJSON();
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 12. Eliminar cuenta propia
const eliminarCuentaPropia = async (req, res) => {
  try {
    // El id del usuario viene del token de autenticación
    const userId = req.user.id;
    
    await deleteUsuario(userId);
    res.status(200).json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  obtenerUsuariosPorRol,
  crearUsuario,
  actualizarUsuario,
  loginUsuario,
  eliminarUsuario,
  eliminarTodosLosUsuarios,
  verificarUsuarios,
  recuperarPasswordController,
  editarPerfilPropio,
  eliminarCuentaPropia
};