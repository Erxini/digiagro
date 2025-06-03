const express = require("express");
const CultivosController = require("../controllers/cultivosController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 1.Obtener todos los cultivos
router.get("/", authMiddleware, CultivosController.getAllCultivos);

// 2.Obtener un cultivo por ID
router.get("/:id", authMiddleware, CultivosController.getCultivoById);

// 3.Crear un nuevo cultivo
router.post("/", authMiddleware, CultivosController.createCultivo);

// 4.Actualizar un cultivo por ID
router.put("/:id", authMiddleware, CultivosController.updateCultivo);

// 5.Eliminar un cultivo por ID
router.delete("/:id", authMiddleware, CultivosController.deleteCultivo);

// 6.Eliminar todos los cultivos
router.delete("/", authMiddleware, CultivosController.deleteAllCultivos);

// 7.Eliminar todos los cultivos de un usuario específico
router.delete("/usuario/:userId", authMiddleware, CultivosController.deleteUserCultivos);

module.exports = router;