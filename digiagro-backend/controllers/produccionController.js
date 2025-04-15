const ProduccionService = require("../services/produccionServices");

  // 1. Obtener toda la producción
  const getAllProduccion = async (req, res) => {
    try {
      const producciones = await ProduccionService.getAllProduccion();
      if (!producciones.length) {
        return res.status(404).json({ error: "No se encontraron producciones" });
      }
      res.json(producciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 2. Obtener un registro de producción por ID
  const getProduccionById = async (req, res) => {
    try {
      const produccion = await ProduccionService.getProduccionById(req.params.id);
      if (!produccion) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 3. Crear un nuevo registro de producción
  const createProduccion = async (req, res) => {
    try {
      const produccion = await ProduccionService.createProduccion(req.body);
      res.status(201).json(produccion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // 4. Modificar un registro de producción por ID
  const updateProduccion = async (req, res) => {
    try {
      const produccion = await ProduccionService.updateProduccion(req.params.id, req.body);
      if (!produccion) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // 5. Obtener un registro de producción por cultivo y suelo
  const getProduccionByCultivoAndSuelo = async (req, res) => {
    try {
      const { cultivoId, sueloId } = req.params; // Extraer correctamente los parámetros
      const produccion = await ProduccionService.getProduccionByCultivoAndSuelo(cultivoId, sueloId);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 6. Obtener producción por cultivo y calidad
  const getProduccionByCultivoAndCalidad = async (req, res) => {
    try {
      const { cultivoId, calidad } = req.params;
      const produccion = await ProduccionService.getProduccionByCultivoAndCalidad(cultivoId, calidad);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 7. Obtener producción por cultivo
  const getProduccionByCultivo = async (req, res) => {
    try {
      const { cultivoId } = req.params;
      const produccion = await ProduccionService.getProduccionByCultivo(cultivoId);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 8. Obtener producción por fecha
  const getProduccionByFecha = async (req, res) => {
    try {
      const produccion = await ProduccionService.getProduccionByFecha(req.params.fecha);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 9. Obtener producción por calidad
  const getProduccionByCalidad = async (req, res) => {
    try {
      const produccion = await ProduccionService.getProduccionByCalidad(req.params.calidad);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 10. Obtener producción por cantidad
  const getProduccionByCantidad = async (req, res) => {
    try {
      const produccion = await ProduccionService.getProduccionByCantidad(req.params.cantidad);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 11. Obtener producción por calidad y cultivo
  const getProduccionByCalidadAndCultivo = async (req, res) => {
    try {
      const { calidad, cultivoId } = req.params;
      const produccion = await ProduccionService.getProduccionByCalidadAndCultivo(calidad, cultivoId);
      if (!produccion.length) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.json(produccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 12. Eliminar un registro de producción por ID
  const deleteProduccion = async (req, res) => {
    try {
      const produccion = await ProduccionService.deleteProduccion(req.params.id);
      if (!produccion) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 13. Eliminar toda la producción
  const deleteAllProduccion = async (req, res) => {
    try {
      await ProduccionService.deleteAllProduccion();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  getAllProduccion,
  getProduccionById,
  createProduccion,
  updateProduccion,
  getProduccionByCultivoAndSuelo,
  getProduccionByCultivoAndCalidad,
  getProduccionByCultivo,
  getProduccionByFecha,
  getProduccionByCalidad,
  getProduccionByCantidad,
  getProduccionByCalidadAndCultivo,
  deleteProduccion,
  deleteAllProduccion,
};