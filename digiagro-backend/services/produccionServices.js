const Produccion = require("../database/models/produccion");
const Suelo = require("../database/models/suelo"); // Importa el modelo Suelo
const Cultivo = require("../database/models/cultivos"); // Importa el modelo Cultivo
const { Op } = require("sequelize"); // Importar Op de sequelize para usar operadores

  // 1. Obtener toda la producción
  const getAllProduccion = async () => {
    try {
      const producciones = await Produccion.findAll();
      return producciones;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 2. Obtener un registro de producción por ID
  const getProduccionById = async (id) => {
    try {
      const produccion = await Produccion.findByPk(id);
      if (!produccion) throw new Error("Producción no encontrada");
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 3. Crear un nuevo registro de producción
  const createProduccion = async (data) => {
    try {
      const produccion = await Produccion.create(data);
      return produccion;
    } catch (error) {
      throw new Error("Error al crear la producción: " + error.message);
    }
  };
  // 4. Modificar un registro de producción por ID
  const updateProduccion = async (id, data) => {
    try {
      const produccion = await Produccion.findByPk(id);
      if (!produccion) throw new Error("Producción no encontrada");
      await produccion.update(data);
      return produccion;
    } catch (error) {
      throw new Error("Error al modificar la producción: " + error.message);
    }
  };
  // 5. Obtener un registro de producción por cultivo y suelo
  const getProduccionByCultivoAndSuelo = async (cultivoId, sueloId) => {
    try {
      const produccion = await Produccion.findAll({
        include: [
          {
            model: Cultivo,
            include: [
              {
                model: Suelo,
                where: { id_suelo: sueloId }, // Filtra por id_suelo
              },
            ],
            where: { id_cultivo: cultivoId }, // Filtra por id_cultivo
          },
        ],
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 6. Obtener producción por cultivo y calidad
  const getProduccionByCultivoAndCalidad = async (cultivoId, calidad) => {
    try {
      const produccion = await Produccion.findAll({
        where: {
          id_cultivo: cultivoId,
          calidad: calidad,
        },
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 7. Obtener producción por cultivo
  const getProduccionByCultivo = async (cultivoId) => {
    try {
      const produccion = await Produccion.findAll({
        where: {
          id_cultivo: cultivoId,
        },
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 8. Obtener producción por fecha
  const getProduccionByFecha = async (fecha) => {
    try {
      const produccion = await Produccion.findAll({
        where: {
          fecha: {
            [Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`], // Rango de fechas para incluir todo el día
          },
        },
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 9. Obtener producción por calidad
  const getProduccionByCalidad = async (calidad) => {
    try {
      const produccion = await Produccion.findAll({
        where: {
          calidad: calidad,
        },
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 10. Obtener producción por cantidad
  const getProduccionByCantidad = async (cantidad) => {
    try {
      const produccion = await Produccion.findAll({
        where: {
          cantidad: cantidad,
        },
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 11. Obtener producción por calidad y cultivo
  const getProduccionByCalidadAndCultivo = async (calidad, cultivoId) => {
    try {
      const produccion = await Produccion.findAll({
        where: {
          calidad: calidad,
          id_cultivo: cultivoId,
        },
      });
      return produccion;
    } catch (error) {
      throw new Error("Error al obtener la producción: " + error.message);
    }
  };
  // 12. Eliminar un registro de producción por ID
  const deleteProduccion = async (id) => {
    try {
      const produccion = await Produccion.findByPk(id);
      if (!produccion) throw new Error("Producción no encontrada");
      await produccion.destroy();
      return produccion;
    } catch (error) {
      throw new Error("Error al eliminar la producción: " + error.message);
    }
  };
  // 13. Eliminar toda la producción
  const deleteAllProduccion = async () => {
    try {
      await Produccion.destroy({ where: {}, truncate: true });
      return "Producción eliminada correctamente";
    } catch (error) {
      throw new Error("Error al eliminar la producción: " + error.message);
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