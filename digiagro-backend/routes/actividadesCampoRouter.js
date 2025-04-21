const express = require("express");
const ActividadCampoController = require("../controllers/actividadCampoController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// 1. Obtener todas las actividades
router.get("/", ActividadCampoController.getAllActividades);

// 2. Obtener actividades por ID de usuario
router.get("/usuario/:usuarioId", ActividadCampoController.getActividadesByUsuarioId);

// 3. Obtener una actividad por ID
router.get("/:id", ActividadCampoController.getActividadById);

// 4. Crear una nueva actividad
router.post("/", ActividadCampoController.createActividad);

// 5. Actualizar una actividad por ID
router.put("/:id", ActividadCampoController.updateActividad);

// 6. Eliminar una actividad por ID
router.delete("/:id", ActividadCampoController.deleteActividad);

// 7. Obtener actividades por rango de fechas
router.get("/fechas/:usuarioId/:fechaInicio/:fechaFin", ActividadCampoController.getActividadesByFechaRange);

// 8. Obtener actividades por tipo de cultivo
router.get("/tipo-cultivo/:usuarioId/:tipoCultivo", ActividadCampoController.getActividadesByTipoCultivo);

// 9. Obtener actividades por tipo de tarea
router.get("/tarea/:usuarioId/:tarea", ActividadCampoController.getActividadesByTarea);

module.exports = router;