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
      console.log('Info del usuario que intenta eliminar riegos:', req.user);
      console.log('Token recibido:', req.headers.authorization);

      // Si es administrador, puede eliminar todos los riegos
      if (req.user && req.user.rol === 'Admin') {
        console.log('Usuario admin - eliminando todos los riegos');
        const resultado = await RiegosService.deleteAllRiegos();
        return res.json({
          success: true,
          mensaje: "Se han eliminado todos los riegos del sistema.",
          eliminados: true
        });
      } 
      // Si es agricultor, solo elimina los riegos asociados a sus cultivos
      else if (req.user && req.user.rol === 'Agricultor') {
        console.log('Usuario agricultor - eliminando solo sus riegos, ID:', req.user.userId || req.user.id);
        // Intentar con ambas posibles claves del ID (userId o id)
        const userId = req.user.userId || req.user.id;
        const resultado = await RiegosService.deleteRiegosByUsuario(userId);
        return res.json({
          success: true,
          mensaje: resultado.mensaje,
          eliminados: resultado.eliminados
        });
      }
      else {
        console.log('Usuario sin permisos o no autenticado correctamente');
        return res.status(403).json({ 
          success: false,
          error: "No tienes permiso para eliminar riegos" 
        });
      }
    } catch (error) {
      console.error('Error al eliminar riegos:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  };
  
  // 11.Eliminar riegos de un usuario específico por ID
  const deleteRiegosByUsuario = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(`Solicitud para eliminar riegos del usuario con ID: ${userId}`);
      console.log('Datos del usuario que hace la solicitud:', req.user);
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "Se requiere el ID del usuario"
        });
      }
      
      // Verificar que el usuario que realiza la solicitud sea el propietario o un administrador
      if (req.user && req.user.rol !== 'Admin' && req.user.userId !== parseInt(userId) && req.user.id !== parseInt(userId)) {
        console.log(`Acceso denegado: el usuario ${req.user.id || req.user.userId} (${req.user.rol}) no puede eliminar riegos del usuario ${userId}`);
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para eliminar los riegos de otro usuario"
        });
      }
      
      const resultado = await RiegosService.deleteRiegosByUsuario(userId);
      console.log(`Resultado de eliminar riegos del usuario ${userId}:`, resultado);
      
      return res.json({
        success: true,
        mensaje: resultado.mensaje,
        eliminados: resultado.eliminados
      });
    } catch (error) {
      console.error('Error al eliminar riegos del usuario:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
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
  deleteAllRiegos,
  deleteRiegosByUsuario
};