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
      const cultivoToDelete = await CultivosService.getCultivoById(req.params.id);
      
      // Log para depuración
      console.log('Info del usuario que intenta eliminar cultivo:', req.user);
      console.log('Info del cultivo a eliminar:', cultivoToDelete.toJSON());
      
      // Obtener el ID del usuario (considerar ambas posibilidades)
      const userId = req.user.userId || req.user.id;
      
      // Verificar si el usuario es propietario del cultivo o es administrador
      if (req.user.rol !== 'Admin' && cultivoToDelete.id_usuario !== userId) {
        console.log('Permiso denegado: Usuario ID no coincide con el propietario del cultivo');
        return res.status(403).json({ error: "No tienes permiso para eliminar este cultivo" });
      }
      
      // Llamar al servicio para eliminar el cultivo y sus datos relacionados
      const resultado = await CultivosService.deleteCultivo(req.params.id);
      
      // Devolver respuesta detallada en lugar de status 204
      res.json({
        success: true,
        mensaje: resultado.mensaje,
        eliminados: resultado.eliminados,
        riegosEliminados: resultado.riegosEliminados,
        suelosEliminados: resultado.suelosEliminados,
        produccionEliminada: resultado.produccionEliminada
      });
      
    } catch (error) {
      console.error('Error al eliminar cultivo:', error);
      res.status(500).json({ error: error.message });
    }
  };
  // 6.Eliminar todos los cultivos
  const deleteAllCultivos = async (req, res) => {
    try {
      // Log para depuración - verificar la información del usuario
      console.log('Info del usuario que intenta eliminar cultivos:', req.user);
      console.log('Token recibido:', req.headers.authorization);

      // Si es administrador, puede eliminar todos los cultivos
      if (req.user && req.user.rol === 'Admin') {
        console.log('Usuario admin - eliminando todos los cultivos');
        const resultado = await CultivosService.deleteAllCultivos();
        return res.json({
          success: true,
          mensaje: `Se han eliminado todos los cultivos del sistema.`,
          eliminados: resultado
        });
      } 
      // Si es agricultor, solo elimina sus propios cultivos
      else if (req.user && req.user.rol === 'Agricultor') {
        console.log('Usuario agricultor - eliminando solo sus cultivos, ID:', req.user.userId || req.user.id);
        // Intentar con ambas posibles claves del ID (userId o id)
        const userId = req.user.userId || req.user.id;
        const resultado = await CultivosService.deleteAllCultivosDeUsuario(userId);
        return res.json({
          success: true,
          mensaje: resultado.mensaje,
          eliminados: resultado.eliminados,
          cultivosIds: resultado.cultivosIds
        });
      }
      else {
        console.log('Usuario sin permisos o no autenticado correctamente');
        return res.status(403).json({ 
          success: false,
          error: "No tienes permiso para eliminar cultivos" 
        });
      }
    } catch (error) {
      console.error('Error al eliminar cultivos:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  };
  // 7.Eliminar todos los cultivos de un usuario específico por ID
  const deleteUserCultivos = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(`Recibida solicitud para eliminar cultivos del usuario: ${userId}`);
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "Se requiere el ID del usuario"
        });
      }
      
      // Verificar que el usuario que realiza la solicitud sea el propietario o un administrador
      if (req.user && req.user.rol !== 'Admin' && req.user.userId !== parseInt(userId) && req.user.id !== parseInt(userId)) {
        console.log('Acceso denegado: el usuario no tiene permisos');
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para eliminar los cultivos de otro usuario"
        });
      }
      
      const resultado = await CultivosService.deleteAllCultivosDeUsuario(userId);
      console.log(`Resultado de eliminar cultivos del usuario ${userId}:`, resultado);
      
      return res.json({
        success: true,
        mensaje: resultado.mensaje,
        eliminados: resultado.eliminados,
        cultivosIds: resultado.cultivosIds
      });
    } catch (error) {
      console.error('Error al eliminar cultivos del usuario:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  };
  
module.exports = {
  getAllCultivos,
  getCultivoById,
  createCultivo,
  updateCultivo,
  deleteCultivo,
  deleteAllCultivos,
  deleteUserCultivos
};