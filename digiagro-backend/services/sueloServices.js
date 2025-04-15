const Suelo = require("../database/models/suelo");

  // 1. Obtener todos los registros de suelo
  const getAllSuelo = async () => {
    try {
      const suelos = await Suelo.findAll();
      return suelos;
    } catch (error) {
      throw new Error("Error al obtener los suelos: " + error.message);
    }
  };
  // 2. Obtener un registro de suelo por ID
  const getSueloById = async (id) => {
    try {
      const suelo = await Suelo.findByPk(id);
      if (!suelo) throw new Error("Suelo no encontrado");
      return suelo;
    } catch (error) {
      throw new Error("Error al obtener el suelo: " + error.message);
    }
  };
  // 3. Crear un nuevo registro de suelo
  const createSuelo = async (data) => {
    try {
      const suelo = await Suelo.create(data);
      return suelo;
    } catch (error) {
      throw new Error("Error al crear el suelo: " + error.message);
    }
  };
  // 4. Modificar un registro de suelo por ID
  const updateSuelo = async (id, data) => {
    try {
      const suelo = await Suelo.findByPk(id);
      if (!suelo) throw new Error("Suelo no encontrado");
      await suelo.update(data);
      return suelo;
    } catch (error) {
      throw new Error("Error al modificar el suelo: " + error.message);
    }
  };
  // 5. Obtener un registro por cultivo y suelo
  const getSueloByCultivoAndSuelo = async (cultivoId, sueloId) => {
    try {
      const suelo = await Suelo.findAll({
        where: {
          id_cultivo: cultivoId,
          id_suelo: sueloId,
        },
      });
      return suelo;
    } catch (error) {
      throw new Error("Error al obtener el suelo: " + error.message);
    }
  };
  // 6. Eliminar un registro de suelo por ID
  const deleteSuelo = async (id) => {
    try {
      const suelo = await Suelo.findByPk(id);
      if (!suelo) throw new Error("Suelo no encontrado");
      await suelo.destroy();
      return suelo;
    } catch (error) {
      throw new Error("Error al eliminar el suelo: " + error.message);
    }
  };
  // 7. Eliminar todos los registros de suelo
  const deleteAllSuelo = async () => {
    try {
      await Suelo.destroy({ where: {}, truncate: true });
    } catch (error) {
      throw new Error("Error al eliminar todos los suelos: " + error.message);
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