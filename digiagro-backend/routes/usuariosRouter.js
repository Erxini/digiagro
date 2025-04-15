const express = require("express");
const UsuariosController = require("../controllers/usuariosController");

const router = express.Router();

// 1. Obtener todos los usuarios
router.get("/", UsuariosController.getAllUsuarios);

// 2. Obtener un usuario por ID
router.get("/:id", UsuariosController.getUsuarioById);

// 3. Obtener un usuario por email
router.get("/email/:email", UsuariosController.getUsuarioByEmail);

// 4. Obtener usuarios por rol
router.get("/rol/:rol", UsuariosController.getUsuarioByRol);

// 5. Crear un nuevo usuario
router.post("/", UsuariosController.createUsuario);

// 6. Actualizar un usuario por ID
router.put("/:id", UsuariosController.updateUsuario);

// 7. Obtener un usuario por nombre y contraseña
//router.post("/login", UsuariosController.getLogin);

// 8. Eliminar un usuario por ID
router.delete("/:id", UsuariosController.deleteUsuario);

// 9. Eliminar todos los usuarios
router.delete("/", UsuariosController.deleteAllUsuarios);

module.exports = router;