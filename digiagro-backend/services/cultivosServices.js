const Cultivo = require("../database/models/cultivos");
const Riego = require("../database/models/riegos");
const Suelo = require("../database/models/suelo");
const Produccion = require("../database/models/produccion");
const sequelize = require("../database/db");

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
      // Iniciar una transacción para asegurar la integridad de los datos
      const t = await sequelize.transaction();
      
      try {
        // Verificar que el cultivo existe
        const cultivo = await Cultivo.findByPk(id, { transaction: t });
        if (!cultivo) {
          await t.rollback();
          throw new Error("Cultivo no encontrado");
        }
        
        console.log(`Iniciando eliminación del cultivo ID: ${id} y todos sus datos asociados`);
        
        // Contar y eliminar registros relacionados explícitamente dentro de la transacción
        const riegosCount = await Riego.count({ where: { id_cultivo: id }, transaction: t });
        const suelosCount = await Suelo.count({ where: { id_cultivo: id }, transaction: t });
        const produccionCount = await Produccion.count({ where: { id_cultivo: id }, transaction: t });
        
        console.log(`Datos a eliminar para cultivo ${id}: ${riegosCount} riegos, ${suelosCount} suelos, ${produccionCount} registros de producción`);
        
        // Eliminar riegos asociados
        await Riego.destroy({ 
          where: { id_cultivo: id },
          transaction: t
        });
        
        // Eliminar suelos asociados
        await Suelo.destroy({ 
          where: { id_cultivo: id },
          transaction: t
        });
        
        // Eliminar producciones asociadas
        await Produccion.destroy({ 
          where: { id_cultivo: id }, 
          transaction: t
        });
        
        // Verificar que se han eliminado correctamente
        const riegosRestantes = await Riego.count({ where: { id_cultivo: id }, transaction: t });
        const suelosRestantes = await Suelo.count({ where: { id_cultivo: id }, transaction: t });
        const produccionRestante = await Produccion.count({ where: { id_cultivo: id }, transaction: t });
        
        if (riegosRestantes > 0 || suelosRestantes > 0 || produccionRestante > 0) {
          console.error(`No se eliminaron todos los datos asociados. Riegos: ${riegosRestantes}, Suelos: ${suelosRestantes}, Producción: ${produccionRestante}`);
          throw new Error("No se pudieron eliminar todos los datos asociados al cultivo");
        }
        
        // Eliminar el cultivo
        await cultivo.destroy({ transaction: t });
        
        // Confirmar transacción
        await t.commit();
        
        console.log(`Cultivo ${id} y todos sus datos asociados eliminados correctamente`);
        return {
          mensaje: `Cultivo y todos sus datos asociados (${riegosCount} riegos, ${suelosCount} suelos, ${produccionCount} producción) eliminados correctamente`,
          eliminados: 1,
          riegosEliminados: riegosCount,
          suelosEliminados: suelosCount,
          produccionEliminada: produccionCount
        };
      } catch (error) {
        // Si ocurre algún error, deshacer todos los cambios
        await t.rollback();
        console.error(`Error al eliminar cultivo ${id}: ${error.message}`);
        throw new Error("Error al eliminar el cultivo: " + error.message);
      }
    };
    // 6.Eliminar todos los cultivos
    const deleteAllCultivos = async () => {
      const t = await sequelize.transaction();
      
      try {
        // Primero eliminar todos los registros relacionados
        await Promise.all([
          Riego.destroy({ where: {}, transaction: t }),
          Suelo.destroy({ where: {}, transaction: t }),
          Produccion.destroy({ where: {}, transaction: t })
        ]);
        
        // Luego eliminar todos los cultivos
        const result = await Cultivo.destroy({ where: {}, transaction: t });
        
        await t.commit();
        return result;
      } catch (error) {
        await t.rollback();
        throw new Error("Error al eliminar todos los cultivos: " + error.message);
      }
    };
    
    // 7.Eliminar todos los cultivos de un usuario específico
    const deleteAllCultivosDeUsuario = async (userId) => {
      const t = await sequelize.transaction();
      
      try {
        console.log(`Iniciando eliminación de cultivos y datos relacionados para usuario ${userId}`);
        
        // Primero, obtener todos los IDs de cultivos del usuario
        const cultivosDelUsuario = await Cultivo.findAll({
          where: { id_usuario: userId },
          attributes: ['id_cultivo'],
          transaction: t,
          raw: true
        });
        
        // Extraer los IDs de cultivos
        const cultivosIds = cultivosDelUsuario.map(c => c.id_cultivo);
        console.log(`Cultivos encontrados para el usuario ${userId}: ${cultivosIds.length > 0 ? cultivosIds.join(', ') : 'ninguno'}`);
        
        // Si no hay cultivos para el usuario, terminar
        if (cultivosIds.length === 0) {
          await t.commit(); // Confirmar la transacción vacía
          return {
            eliminados: 0,
            mensaje: "No se encontraron cultivos para eliminar.",
            cultivosIds: []
          };
        }
        
        // Contadores para el informe
        let riegosCount = 0;
        let suelosCount = 0;
        let produccionCount = 0;

        // Eliminar riegos asociados
        const riegosEliminados = await Riego.destroy({
          where: { id_cultivo: cultivosIds },
          transaction: t
        });
        riegosCount = riegosEliminados;
        console.log(`${riegosCount} riegos eliminados`);
        
        // Eliminar suelos asociados
        const suelosEliminados = await Suelo.destroy({
          where: { id_cultivo: cultivosIds },
          transaction: t
        });
        suelosCount = suelosEliminados;
        console.log(`${suelosCount} registros de suelo eliminados`);
        
        // Eliminar producciones asociadas
        const produccionEliminada = await Produccion.destroy({
          where: { id_cultivo: cultivosIds },
          transaction: t
        });
        produccionCount = produccionEliminada;
        console.log(`${produccionCount} registros de producción eliminados`);
        
        // Finalmente, eliminar los cultivos
        const cultivosEliminados = await Cultivo.destroy({
          where: { id_usuario: userId },
          transaction: t
        });
        console.log(`${cultivosEliminados} cultivos eliminados`);
        
        // Verificar que todo se haya eliminado correctamente
        const remainingCultivos = await Cultivo.count({
          where: { id_usuario: userId },
          transaction: t
        });
        
        if (remainingCultivos > 0) {
          throw new Error(`No se pudieron eliminar todos los cultivos. Quedan ${remainingCultivos}`);
        }
        
        // Confirmar todos los cambios
        await t.commit();
        console.log(`Eliminación completada exitosamente para el usuario ${userId}`);
        
        return {
          eliminados: cultivosEliminados,
          riegosEliminados: riegosCount,
          suelosEliminados: suelosCount,
          produccionEliminada: produccionCount,
          mensaje: `Se eliminaron ${cultivosEliminados} cultivos y sus datos asociados (${riegosCount} riegos, ${suelosCount} registros de suelo, ${produccionCount} registros de producción).`,
          cultivosIds: cultivosIds
        };
      } catch (error) {
        // Si ocurre algún error, deshacer todos los cambios
        await t.rollback();
        console.error(`Error en la eliminación en cascada: ${error.message}`);
        throw new Error("Error al eliminar los cultivos del usuario: " + error.message);
      }
    };

module.exports =  { 
    getAllCultivos,
    getCultivoById,
    createCultivo,
    updateCultivo,
    deleteCultivo,
    deleteAllCultivos,
    deleteAllCultivosDeUsuario
  };