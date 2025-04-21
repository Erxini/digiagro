const express = require("express");
const TratamientoCampoController = require("../controllers/tratamientoCampoController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// 1. Obtener todos los tratamientos
router.get("/", TratamientoCampoController.getAllTratamientos);

// 2. Obtener tratamientos por ID de usuario
router.get("/usuario/:usuarioId", TratamientoCampoController.getTratamientosByUsuarioId);

// 3. Obtener un tratamiento por ID
router.get("/:id", TratamientoCampoController.getTratamientoById);

// 4. Obtener tratamientos por ID de actividad
router.get("/actividad/:actividadId", TratamientoCampoController.getTratamientosByActividadId);

// 5. Crear un nuevo tratamiento
router.post("/", TratamientoCampoController.createTratamiento);

// 6. Actualizar un tratamiento por ID
router.put("/:id", TratamientoCampoController.updateTratamiento);

// 7. Eliminar un tratamiento por ID
router.delete("/:id", TratamientoCampoController.deleteTratamiento);

// 8. Obtener tratamientos por tipo de producto
router.get("/tipo-producto/:usuarioId/:tipoProducto", TratamientoCampoController.getTratamientosByTipoProducto);

// 9. Obtener tratamientos por rango de fechas
router.get("/fechas/:usuarioId/:fechaInicio/:fechaFin", TratamientoCampoController.getTratamientosByFechaRange);

module.exports = router;