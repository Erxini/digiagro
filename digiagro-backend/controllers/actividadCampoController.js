const ActividadCampoService = require("../services/actividadCampoService");

// 1. Obtener todas las actividades
const getAllActividades = async (req, res) => {
  try {
    const actividades = await ActividadCampoService.getAllActividades();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Obtener actividades por ID de usuario
const getActividadesByUsuarioId = async (req, res) => {
  try {
    const actividades = await ActividadCampoService.getActividadesByUsuarioId(req.params.usuarioId);
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Obtener una actividad por ID
const getActividadById = async (req, res) => {
  try {
    const actividad = await ActividadCampoService.getActividadById(req.params.id);
    res.json(actividad);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 4. Crear una nueva actividad
const createActividad = async (req, res) => {
  try {
    const actividad = await ActividadCampoService.createActividad(req.body);
    res.status(201).json(actividad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Actualizar una actividad por ID
const updateActividad = async (req, res) => {
  try {
    const actividad = await ActividadCampoService.updateActividad(req.params.id, req.body);
    res.json(actividad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Eliminar una actividad por ID
const deleteActividad = async (req, res) => {
  try {
    await ActividadCampoService.deleteActividad(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 7. Obtener actividades por rango de fechas
const getActividadesByFechaRange = async (req, res) => {
  try {
    const { usuarioId, fechaInicio, fechaFin } = req.params;
    const actividades = await ActividadCampoService.getActividadesByFechaRange(usuarioId, fechaInicio, fechaFin);
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Obtener actividades por tipo de cultivo
const getActividadesByTipoCultivo = async (req, res) => {
  try {
    const { usuarioId, tipoCultivo } = req.params;
    const actividades = await ActividadCampoService.getActividadesByTipoCultivo(usuarioId, tipoCultivo);
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Obtener actividades por tipo de tarea
const getActividadesByTarea = async (req, res) => {
  try {
    const { usuarioId, tarea } = req.params;
    const actividades = await ActividadCampoService.getActividadesByTarea(usuarioId, tarea);
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllActividades,
  getActividadesByUsuarioId,
  getActividadById,
  createActividad,
  updateActividad,
  deleteActividad,
  getActividadesByFechaRange,
  getActividadesByTipoCultivo,
  getActividadesByTarea
};