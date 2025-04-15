const Cultivo = require("../database/models/cultivos");

    // 1.Obtener todos los cultivos
    const getAllCultivos = async () => {
      try {
        return await Cultivo.findAll();
      } catch (error) {
        throw new Error("Error al mostrar todos los cultivos: " + error.message);
      }
    };
    // 2.Obtener un cultivo por ID
    const getCultivoById = async (id) => {
      try {
        const cultivo = await Cultivo.findByPk(id);
        if (!cultivo) {
          throw new Error("Cultivo no encontrado");
        }
        return cultivo;
      } catch (error) {
        throw new Error("Error al mostrar el cultivo por ID: " + error.message);
      }
    }; 
    // 3.Crear un nuevo cultivo
    const createCultivo = async (cultivoData) => {
      try {
        return await Cultivo.create(cultivoData);
      } catch (error) {
        throw new Error("Error al crear el cultivo: " + error.message);
      }
    };
  
    // 4.Modificar un cultivo por ID
    const updateCultivo = async (id, cultivoData) => {
      try {
        const cultivo = await Cultivo.findByPk(id);
        if (!cultivo) {
          throw new Error("Cultivo no encontrado");
        }
        return await cultivo.update(cultivoData);
      } catch (error) {
        throw new Error("Error al modificar el cultivo: " + error.message);
      }
    };
 
    // 5.Eliminar un cultivo por ID de suelo
    const deleteCultivo = async (id) => {
      try {
        const cultivo = await Cultivo.findByPk(id);
        if (!cultivo) {
          throw new Error("Cultivo no encontrado");
        }
        return await cultivo.destroy();
      } catch (error) {
        throw new Error("Error al eliminar el cultivo: " + error.message);
      }
    };
    // 6.Eliminar todos los cultivos
    const deleteAllCultivos = async () => {
      try {
        return await Cultivo.destroy({ where: {} });
      } catch (error) {
        throw new Error("Error al eliminar todos los cultivos: " + error.message);
      }
    };

module.exports =  { 
    getAllCultivos,
    getCultivoById,
    createCultivo,
    updateCultivo,
    deleteCultivo,
    deleteAllCultivos,
  };