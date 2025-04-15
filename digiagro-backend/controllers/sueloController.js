const SueloService = require("../services/sueloServices");

  // 1. Obtener todos los registros de suelo
  const getAllSuelo = async (req, res) => {
    try {
      const suelos = await SueloService.getAllSuelo();
      res.json(suelos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 2. Obtener un registro de suelo por ID
  const getSueloById = async (req, res) => {
    try {
      const suelo = await SueloService.getSueloById(req.params.id);
      if (!suelo) {
        return res.status(404).json({ error: "Suelo no encontrado" });
      }
      res.json(suelo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 3. Crear un nuevo registro de suelo
  const createSuelo = async (req, res) => {
    try {
      const suelo = await SueloService.createSuelo(req.body);
      res.status(201).json(suelo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // 4. Modificar un registro de suelo por ID
  const updateSuelo = async (req, res) => {
    try {
      const suelo = await SueloService.updateSuelo(req.params.id, req.body);
      if (!suelo) {
        return res.status(404).json({ error: "Suelo no encontrado" });
      }
      res.json(suelo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // 5. Obtener un registro por cultivo y suelo
  const getSueloByCultivoAndSuelo = async (req, res) => {
    try {
      const { id, sueloId } = req.params;
      const suelo = await SueloService.getSueloByCultivoAndSuelo(id, sueloId);
      if (!suelo) {
        return res.status(404).json({ error: "Suelo no encontrado" });
      }
      res.json(suelo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 6. Eliminar un registro de suelo por ID
  const deleteSuelo = async (req, res) => {
    try {
      const suelo = await SueloService.deleteSuelo(req.params.id);
      if (!suelo) {
        return res.status(404).json({ error: "Suelo no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 7. Eliminar todos los registros de suelo
  const deleteAllSuelo = async (req, res) => {
    try {
      await SueloService.deleteAllSuelo();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  getAllSuelo,
  getSueloById,
  createSuelo,
  updateSuelo,
  getSueloByCultivoAndSuelo,
  deleteSuelo,
  deleteAllSuelo,
};
