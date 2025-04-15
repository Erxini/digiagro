const express = require("express");
const ProduccionController = require("../controllers/produccionController");

const router = express.Router();

// 1.Obtener toda la producción
router.get("/", ProduccionController.getAllProduccion);

// 2.Obtener un registro de producción por ID
router.get("/:id", ProduccionController.getProduccionById);

// 3.Crear un nuevo registro de producción
router.post("/", ProduccionController.createProduccion);

// 4.Modificar un registro de producción por ID
router.put("/:id", ProduccionController.updateProduccion);

// 5. Obtener un registro de producción por cultivo y suelo
router.get("/cultivo/:cultivoId/suelo/:sueloId", ProduccionController.getProduccionByCultivoAndSuelo);

// 6. Obtener producción por cultivo y calidad
router.get("/cultivo/:cultivoId/calidad/:calidad", ProduccionController.getProduccionByCultivoAndCalidad);

// 7. Obtener producción por cultivo
router.get("/cultivo/:cultivoId", ProduccionController.getProduccionByCultivo);

// 8. Obtener producción por fecha
router.get("/fecha/:fecha", ProduccionController.getProduccionByFecha);

// 9.Obtener producción por calidad
router.get("/calidad/:calidad", ProduccionController.getProduccionByCalidad);

// 10.Obtener producción por cantidad
router.get("/cantidad/:cantidad", ProduccionController.getProduccionByCantidad);

// 11. Obtener producción por calidad y cultivo
router.get("/calidad/:calidad/cultivo/:cultivoId", ProduccionController.getProduccionByCalidadAndCultivo);

// 12.Eliminar un registro de producción por ID
router.delete("/:id", ProduccionController.deleteProduccion);

// 13.Eliminar toda la producción
router.delete("/", ProduccionController.deleteAllProduccion);

// Obtener producción por calidad y fecha?

module.exports = router;