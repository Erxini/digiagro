const express = require("express");
const UsuariosController = require("../controllers/usuariosController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Rutas públicas
// 5. Crear un nuevo usuario (registro)
router.post("/", UsuariosController.crearUsuario);

// 7. Autenticar usuario (login)
router.post("/login", UsuariosController.loginUsuario);

// 10. Recuperar contraseña
router.post("/recuperar-password", UsuariosController.recuperarPasswordController);

// Ruta para verificar si hay usuarios en la base de datos (solo para depuración)
router.get("/check", UsuariosController.verificarUsuarios);

// Rutas protegidas - requieren autenticación
// 1. Obtener todos los usuarios - solo para administradores
router.get("/", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.obtenerTodosLosUsuarios);

// 11. Editar mi perfil - para cualquier usuario autenticado
router.put("/perfil", authMiddleware, UsuariosController.editarPerfilPropio);

// 12. Eliminar mi cuenta - para cualquier usuario autenticado
router.delete("/perfil", authMiddleware, UsuariosController.eliminarCuentaPropia);

// 2. Obtener un usuario por ID - solo el propio usuario o administradores
router.get("/:id", authMiddleware, UsuariosController.obtenerUsuarioPorId);

// 3. Obtener un usuario por email - solo el propio usuario o administradores
router.get("/email/:email", authMiddleware, UsuariosController.obtenerUsuarioPorEmail);

// 4. Obtener usuarios por rol - solo administradores
router.get("/rol/:rol", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.obtenerUsuariosPorRol);

// 6. Actualizar un usuario por ID - solo el propio usuario o administradores
router.put("/:id", authMiddleware, UsuariosController.actualizarUsuario);

// 8. Eliminar un usuario por ID - solo administradores
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.eliminarUsuario);

// 9. Eliminar todos los usuarios - solo administradores
router.delete("/", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.eliminarTodosLosUsuarios);

module.exports = router;