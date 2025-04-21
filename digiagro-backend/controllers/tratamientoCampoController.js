const TratamientoCampoService = require("../services/tratamientoCampoService");

// 1. Obtener todos los tratamientos
const getAllTratamientos = async (req, res) => {
  try {
    const tratamientos = await TratamientoCampoService.getAllTratamientos();
    res.json(tratamientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Obtener tratamientos por ID de usuario
const getTratamientosByUsuarioId = async (req, res) => {
  try {
    const tratamientos = await TratamientoCampoService.getTratamientosByUsuarioId(req.params.usuarioId);
    res.json(tratamientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Obtener un tratamiento por ID
const getTratamientoById = async (req, res) => {
  try {
    const tratamiento = await TratamientoCampoService.getTratamientoById(req.params.id);
    res.json(tratamiento);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 4. Obtener tratamientos por ID de actividad
const getTratamientosByActividadId = async (req, res) => {
  try {
    const tratamientos = await TratamientoCampoService.getTratamientosByActividadId(req.params.actividadId);
    res.json(tratamientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Crear un nuevo tratamiento
const createTratamiento = async (req, res) => {
  try {
    const tratamiento = await TratamientoCampoService.createTratamiento(req.body);
    res.status(201).json(tratamiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Actualizar un tratamiento por ID
const updateTratamiento = async (req, res) => {
  try {
    const tratamiento = await TratamientoCampoService.updateTratamiento(req.params.id, req.body);
    res.json(tratamiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. Eliminar un tratamiento por ID
const deleteTratamiento = async (req, res) => {
  try {
    await TratamientoCampoService.deleteTratamiento(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 8. Obtener tratamientos por tipo de producto
const getTratamientosByTipoProducto = async (req, res) => {
  try {
    const { usuarioId, tipoProducto } = req.params;
    const tratamientos = await TratamientoCampoService.getTratamientosByTipoProducto(usuarioId, tipoProducto);
    res.json(tratamientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Obtener tratamientos por rango de fechas
const getTratamientosByFechaRange = async (req, res) => {
  try {
    const { usuarioId, fechaInicio, fechaFin } = req.params;
    const tratamientos = await TratamientoCampoService.getTratamientosByFechaRange(usuarioId, fechaInicio, fechaFin);
    res.json(tratamientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTratamientos,
  getTratamientosByUsuarioId,
  getTratamientoById,
  getTratamientosByActividadId,
  createTratamiento,
  updateTratamiento,
  deleteTratamiento,
  getTratamientosByTipoProducto,
  getTratamientosByFechaRange
};