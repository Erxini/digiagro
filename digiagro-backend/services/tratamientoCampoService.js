const TratamientoCampo = require("../database/models/tratamientoCampo");
const { Op } = require("sequelize");

// 1. Obtener todos los tratamientos
const getAllTratamientos = async () => {
  try {
    return await TratamientoCampo.findAll();
  } catch (error) {
    throw new Error("Error al obtener los tratamientos: " + error.message);
  }
};

// 2. Obtener tratamientos por ID de usuario
const getTratamientosByUsuarioId = async (usuarioId) => {
  try {
    return await TratamientoCampo.findAll({
      where: {
        id_usuario: usuarioId
      },
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los tratamientos del usuario: " + error.message);
  }
};

// 3. Obtener un tratamiento por ID
const getTratamientoById = async (id) => {
  try {
    const tratamiento = await TratamientoCampo.findByPk(id);
    if (!tratamiento) throw new Error("Tratamiento no encontrado");
    return tratamiento;
  } catch (error) {
    throw new Error("Error al obtener el tratamiento: " + error.message);
  }
};

// 4. Obtener tratamientos por ID de actividad
const getTratamientosByActividadId = async (actividadId) => {
  try {
    return await TratamientoCampo.findAll({
      where: {
        id_actividad: actividadId
      },
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los tratamientos por actividad: " + error.message);
  }
};

// 5. Crear un nuevo tratamiento
const createTratamiento = async (data) => {
  try {
    // Si se proporciona superficie y cantidad, calcular automáticamente la dosis por área
    if (data.superficie_tratada && data.cantidad_aplicada) {
      const superficie = data.superficie_tratada;
      const cantidad = data.cantidad_aplicada;
      
      // Convertir superficie a hectáreas si es necesario
      let superficieEnHa = superficie;
      if (data.unidad_superficie === 'm2') {
        superficieEnHa = superficie / 10000; // Convertir m² a hectáreas
      }
      
      // Calcular dosis por hectárea
      data.dosis_por_area = cantidad / superficieEnHa;
    }
    
    return await TratamientoCampo.create(data);
  } catch (error) {
    throw new Error("Error al crear el tratamiento: " + error.message);
  }
};

// 6. Actualizar un tratamiento por ID
const updateTratamiento = async (id, data) => {
  try {
    const tratamiento = await TratamientoCampo.findByPk(id);
    if (!tratamiento) throw new Error("Tratamiento no encontrado");
    
    // Recalcular dosis por área si se actualizan los valores relevantes
    if ((data.superficie_tratada || tratamiento.superficie_tratada) && 
        (data.cantidad_aplicada || tratamiento.cantidad_aplicada)) {
      const superficie = data.superficie_tratada || tratamiento.superficie_tratada;
      const cantidad = data.cantidad_aplicada || tratamiento.cantidad_aplicada;
      const unidadSuperficie = data.unidad_superficie || tratamiento.unidad_superficie;
      
      // Convertir superficie a hectáreas si es necesario
      let superficieEnHa = superficie;
      if (unidadSuperficie === 'm2') {
        superficieEnHa = superficie / 10000; // Convertir m² a hectáreas
      }
      
      // Calcular dosis por hectárea
      data.dosis_por_area = cantidad / superficieEnHa;
    }
    
    await tratamiento.update(data);
    return tratamiento;
  } catch (error) {
    throw new Error("Error al modificar el tratamiento: " + error.message);
  }
};

// 7. Eliminar un tratamiento por ID
const deleteTratamiento = async (id) => {
  try {
    // En lugar de buscar y luego destruir, usar directamente destroy con where
    const result = await TratamientoCampo.destroy({
      where: { id_tratamiento: id }
    });
    
    if (result === 0) throw new Error("Tratamiento no encontrado");
    return { success: true, message: "Tratamiento eliminado correctamente" };
  } catch (error) {
    throw new Error("Error al eliminar el tratamiento: " + error.message);
  }
};

// 8. Obtener tratamientos por tipo de producto
const getTratamientosByTipoProducto = async (usuarioId, tipoProducto) => {
  try {
    return await TratamientoCampo.findAll({
      where: {
        id_usuario: usuarioId,
        tipo_producto: tipoProducto
      },
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los tratamientos por tipo de producto: " + error.message);
  }
};

// 9. Obtener tratamientos por rango de fechas
const getTratamientosByFechaRange = async (usuarioId, fechaInicio, fechaFin) => {
  try {
    return await TratamientoCampo.findAll({
      where: {
        id_usuario: usuarioId,
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      order: [['fecha', 'ASC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los tratamientos por rango de fechas: " + error.message);
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