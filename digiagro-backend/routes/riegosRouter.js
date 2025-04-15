const express = require("express");
const RiegosController = require("../controllers/riegosController");

const router = express.Router();

// 1.Obtener todos los riegos
router.get("/", RiegosController.getAllRiegos);

// 2.Obtener un riego por ID
router.get("/:id", RiegosController.getRiegoById);

// 3.Crear un nuevo riego
router.post("/", RiegosController.createRiego);

// 4.Actualizar un riego por ID
router.put("/:id", RiegosController.updateRiego);

// 5.Obtener riegos por cultivo ID
router.get("/cultivo/:id", RiegosController.getRiegosByCultivoId);

// 6.Modificar el riego por cultivo ID
router.put("/cultivo/:id", RiegosController.updateRiegoByCultivoId);

// 7.Obtener riegos por fecha
router.get("/fecha/:fecha",RiegosController.getRiegosByFecha);

// 8.Obtener riegos por cantidad de agua
router.get("/cantidad/:cantidad", RiegosController.getRiegosByCantidadAgua);

// 9.Eliminar un riego por ID
router.delete("/:id", RiegosController.deleteRiego);

// 10.Eliminar todos los riegos
router.delete("/", RiegosController.deleteAllRiegos);

module.exports = router;