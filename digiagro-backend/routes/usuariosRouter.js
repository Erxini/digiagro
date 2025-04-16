const express = require("express");
const UsuariosController = require("../controllers/usuariosController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Rutas públicas
// 5. Crear un nuevo usuario (registro)
router.post("/", UsuariosController.createUsuario);

// 7. Autenticar usuario (login)
router.post("/login", UsuariosController.getLogin);

// Ruta para verificar si hay usuarios en la base de datos (solo para depuración)
router.get("/check", UsuariosController.checkUsuarios);

// Rutas protegidas - requieren autenticación
// 1. Obtener todos los usuarios - solo para administradores
router.get("/", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.getAllUsuarios);

// 2. Obtener un usuario por ID - solo el propio usuario o administradores
router.get("/:id", authMiddleware, UsuariosController.getUsuarioById);

// 3. Obtener un usuario por email - solo el propio usuario o administradores
router.get("/email/:email", authMiddleware, UsuariosController.getUsuarioByEmail);

// 4. Obtener usuarios por rol - solo administradores
router.get("/rol/:rol", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.getUsuarioByRol);

// 6. Actualizar un usuario por ID - solo el propio usuario o administradores
router.put("/:id", authMiddleware, UsuariosController.updateUsuario);

// 8. Eliminar un usuario por ID - solo administradores
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.deleteUsuario);

// 9. Eliminar todos los usuarios - solo administradores
router.delete("/", authMiddleware, roleMiddleware(["Admin"]), UsuariosController.deleteAllUsuarios);

module.exports = router;