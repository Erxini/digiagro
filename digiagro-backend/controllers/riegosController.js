const RiegosService = require("../services/riegosService");

  // 1.Obtener todos los riegos
  const getAllRiegos = async (req, res) => {
    try {
      const riegos = await RiegosService.getAllRiegos();
      res.json(riegos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 2.Obtener un riego por ID
  const getRiegoById = async (req, res) => {
    try {
      const riego = await RiegosService.getRiegoById(req.params.id);
      res.json(riego);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  // 3.Crear un nuevo riego
  const createRiego = async (req, res) => {
    try {
      const riego = await RiegosService.createRiego(req.body);
      res.status(201).json(riego);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // 4.Actualizar un riego por ID
  const updateRiego = async (req, res) => {
    try {
      const riego = await RiegosService.updateRiego(req.params.id, req.body);
      res.json(riego);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
    
  // 5.Obtener riegos por cultivo ID
  const getRiegosByCultivoId = async (req, res) => {
    try {
      const riegos = await RiegosService.getRiegosByCultivoId(req.params.id);
      res.json(riegos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    };
  // 6.Modificar el riego por cultivo ID  
  const updateRiegoByCultivoId = async (req, res) => {
        try {
            const riego = await RiegosService.updateRiegoByCultivoId(req.params.id, req.body);
            res.json(riego);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
  // 7.Obtener riegos por fecha
  const getRiegosByFecha = async (req, res) => {
        try {
            const riegos = await RiegosService.getRiegosByFecha(req.params.fecha);
            res.json(riegos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
  // 8.Obtener riegos por cantidad de agua    
  const getRiegosByCantidadAgua = async (req, res) => {
    try {
      const riegos = await RiegosService.getRiegosByCantidadAgua(req.params.cantidad);
      if (!riegos.length) {
        return res.status(404).json({ error: "No se encontraron riegos con la cantidad de agua especificada" });
      }
      res.json(riegos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // 9.Eliminar un riego por ID
  const deleteRiego = async (req, res) => {
    try {
      await RiegosService.deleteRiego(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  
  // 10.Eliminar todos los riegos
  const deleteAllRiegos = async (req, res) => {
    try {
      await RiegosService.deleteAllRiegos();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = {
  getAllRiegos,
  getRiegoById,
  createRiego,
  updateRiego,
  getRiegosByCultivoId,
  updateRiegoByCultivoId,
  getRiegosByFecha,
  getRiegosByCantidadAgua,
  deleteRiego,
  deleteAllRiegos
};