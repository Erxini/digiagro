const express = require("express");
const DocumentoCampoController = require("../controllers/documentoCampoController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// 1. Obtener todos los documentos
router.get("/", DocumentoCampoController.getAllDocumentos);

// 2. Obtener documentos por ID de usuario
router.get("/usuario/:usuarioId", DocumentoCampoController.getDocumentosByUsuarioId);

// 3. Obtener un documento por ID
router.get("/:id", DocumentoCampoController.getDocumentoById);

// 4. Obtener documentos por ID de actividad
router.get("/actividad/:actividadId", DocumentoCampoController.getDocumentosByActividadId);

// 5. Obtener documentos por ID de tratamiento
router.get("/tratamiento/:tratamientoId", DocumentoCampoController.getDocumentosByTratamientoId);

// 6. Crear un nuevo documento (con carga de archivo)
router.post("/", DocumentoCampoController.handleFileUpload, DocumentoCampoController.createDocumento);

// 7. Actualizar un documento por ID (opcionalmente con carga de archivo)
router.put("/:id", DocumentoCampoController.handleFileUpload, DocumentoCampoController.updateDocumento);

// 8. Eliminar un documento por ID
router.delete("/:id", DocumentoCampoController.deleteDocumento);

// 9. Obtener documentos por tipo de documento
router.get("/tipo/:usuarioId/:tipoDocumento", DocumentoCampoController.getDocumentosByTipo);

module.exports = router;