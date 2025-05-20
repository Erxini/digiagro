const ActividadCampo = require("../database/models/actividadCampo");
const { Op } = require("sequelize");

// 1. Obtener todas las actividades
const getAllActividades = async () => {
  try {
    return await ActividadCampo.findAll();
  } catch (error) {
    throw new Error("Error al obtener las actividades: " + error.message);
  }
};

// 2. Obtener actividades por ID de usuario
const getActividadesByUsuarioId = async (usuarioId) => {
  try {
    return await ActividadCampo.findAll({
      where: {
        id_usuario: usuarioId
      },
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener las actividades del usuario: " + error.message);
  }
};

// 3. Obtener una actividad por ID
const getActividadById = async (id) => {
  try {
    const actividad = await ActividadCampo.findByPk(id);
    if (!actividad) throw new Error("Actividad no encontrada");
    return actividad;
  } catch (error) {
    throw new Error("Error al obtener la actividad: " + error.message);
  }
};

// 4. Crear una nueva actividad
const createActividad = async (data) => {
  try {
    return await ActividadCampo.create(data);
  } catch (error) {
    throw new Error("Error al crear la actividad: " + error.message);
  }
};

// 5. Actualizar una actividad por ID
const updateActividad = async (id, data) => {
  try {
    const actividad = await ActividadCampo.findByPk(id);
    if (!actividad) throw new Error("Actividad no encontrada");
    await actividad.update(data);
    return actividad;
  } catch (error) {
    throw new Error("Error al modificar la actividad: " + error.message);
  }
};

// 6. Eliminar una actividad por ID
const deleteActividad = async (id) => {
  try {
    // En lugar de buscar y luego destruir, usar directamente destroy con where
    const result = await ActividadCampo.destroy({
      where: { id_actividad: id }
    });
    
    if (result === 0) throw new Error("Actividad no encontrada");
    return { success: true, message: "Actividad eliminada correctamente" };
  } catch (error) {
    throw new Error("Error al eliminar la actividad: " + error.message);
  }
};

// 7. Obtener actividades por rango de fechas
const getActividadesByFechaRange = async (usuarioId, fechaInicio, fechaFin) => {
  try {
    return await ActividadCampo.findAll({
      where: {
        id_usuario: usuarioId,
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      order: [['fecha', 'ASC']]
    });
  } catch (error) {
    throw new Error("Error al obtener las actividades por rango de fechas: " + error.message);
  }
};

// 8. Obtener actividades por tipo de cultivo
const getActividadesByTipoCultivo = async (usuarioId, tipoCultivo) => {
  try {
    return await ActividadCampo.findAll({
      where: {
        id_usuario: usuarioId,
        tipo_cultivo: tipoCultivo
      },
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener las actividades por tipo de cultivo: " + error.message);
  }
};

// 9. Obtener actividades por tipo de tarea
const getActividadesByTarea = async (usuarioId, tarea) => {
  try {
    return await ActividadCampo.findAll({
      where: {
        id_usuario: usuarioId,
        tarea: tarea
      },
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener las actividades por tipo de tarea: " + error.message);
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