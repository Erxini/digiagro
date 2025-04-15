const CultivosService = require("../services/cultivosServices");

  // 1.Obtener todos los cultivos
  const getAllCultivos = async (req, res) => {
    try {
      const cultivos = await CultivosService.getAllCultivos();
      res.json(cultivos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 2.Obtener un cultivo por ID
  const getCultivoById = async (req, res) => {
    try {
      const cultivo = await CultivosService.getCultivoById(req.params.id);
      res.json(cultivo);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  // 3.Crear un nuevo cultivo
  const createCultivo = async (req, res) => {
    try {
      const cultivo = await CultivosService.createCultivo(req.body);
      res.status(201).json(cultivo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // 4.Actualizar un cultivo por ID
  const updateCultivo = async (req, res) => {
    try {
      const cultivo = await CultivosService.updateCultivo(req.params.id, req.body);
      res.json(cultivo);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  // 5.Eliminar un cultivo por ID
  const deleteCultivo = async (req, res) => {
    try {
      await CultivosService.deleteCultivo(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  // 6.Eliminar todos los cultivos
  const deleteAllCultivos = async (req, res) => {
    try {
      await CultivosService.deleteAllCultivos();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = {
  getAllCultivos,
  getCultivoById,
  createCultivo,
  updateCultivo,
  deleteCultivo,
  deleteAllCultivos
};