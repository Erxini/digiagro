const express = require("express");
const SueloController = require("../controllers/sueloController");

const router = express.Router();

// 1.Obtener todos los registros de suelo
router.get("/", SueloController.getAllSuelo);

// 2.Obtener un registro de suelo por ID
router.get("/:id", SueloController.getSueloById);

// 3.Crear un nuevo registro de suelo
router.post("/", SueloController.createSuelo);

// 4.Actualizar un registro de suelo por ID
router.put("/:id", SueloController.updateSuelo);

// 5.Obtener un registro por cultivo y suelo
router.get("/cultivo/:id/suelo/:sueloId", SueloController.getSueloByCultivoAndSuelo);

// 6.Eliminar un registro de suelo por ID
router.delete("/:id", SueloController.deleteSuelo);

// 7.Eliminar todos los registros de suelo
router.delete("/", SueloController.deleteAllSuelo);

module.exports = router;