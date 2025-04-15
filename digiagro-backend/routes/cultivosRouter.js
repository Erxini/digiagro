const express = require("express");
const CultivosController = require("../controllers/cultivosController");

const router = express.Router();

// 1.Obtener todos los cultivos
router.get("/", CultivosController.getAllCultivos);

// 2.Obtener un cultivo por ID
router.get("/:id", CultivosController.getCultivoById);

// 3.Crear un nuevo cultivo
router.post("/", CultivosController.createCultivo);

// 4.Actualizar un cultivo por ID
router.put("/:id", CultivosController.updateCultivo);

// 5.Eliminar un cultivo por ID
router.delete("/:id", CultivosController.deleteCultivo);

// 6.Eliminar todos los cultivos
router.delete("/", CultivosController.deleteAllCultivos);

module.exports = router;