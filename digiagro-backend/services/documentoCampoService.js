const DocumentoCampo = require("../database/models/documentoCampo");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

// Directorio para almacenamiento de archivos
const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Asegurar que el directorio existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 1. Obtener todos los documentos
const getAllDocumentos = async () => {
  try {
    return await DocumentoCampo.findAll();
  } catch (error) {
    throw new Error("Error al obtener los documentos: " + error.message);
  }
};

// 2. Obtener documentos por ID de usuario
const getDocumentosByUsuarioId = async (usuarioId) => {
  try {
    return await DocumentoCampo.findAll({
      where: {
        id_usuario: usuarioId
      },
      order: [['fecha_subida', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los documentos del usuario: " + error.message);
  }
};

// 3. Obtener un documento por ID
const getDocumentoById = async (id) => {
  try {
    const documento = await DocumentoCampo.findByPk(id);
    if (!documento) throw new Error("Documento no encontrado");
    return documento;
  } catch (error) {
    throw new Error("Error al obtener el documento: " + error.message);
  }
};

// 4. Obtener documentos por ID de actividad
const getDocumentosByActividadId = async (actividadId) => {
  try {
    return await DocumentoCampo.findAll({
      where: {
        id_actividad: actividadId
      },
      order: [['fecha_subida', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los documentos por actividad: " + error.message);
  }
};

// 5. Obtener documentos por ID de tratamiento
const getDocumentosByTratamientoId = async (tratamientoId) => {
  try {
    return await DocumentoCampo.findAll({
      where: {
        id_tratamiento: tratamientoId
      },
      order: [['fecha_subida', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los documentos por tratamiento: " + error.message);
  }
};

// 6. Crear un nuevo documento
const createDocumento = async (data, file) => {
  try {
    // Si se proporciona un archivo, guardarlo en el sistema de archivos
    let archivoUrl = null;
    
    if (file) {
      // Crear nombre de archivo único usando timestamp
      const timestamp = new Date().getTime();
      const extension = path.extname(file.originalname);
      const fileName = `${timestamp}-${file.originalname.replace(/\s/g, '_')}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Guardar archivo en el directorio de uploads
      fs.writeFileSync(filePath, file.buffer);
      
      // Guardar la URL relativa del archivo
      archivoUrl = `/uploads/${fileName}`;
      
      // Actualizar los datos con la URL del archivo
      data.archivo_url = archivoUrl;
      data.mime_type = file.mimetype;
    }
    
    return await DocumentoCampo.create(data);
  } catch (error) {
    throw new Error("Error al crear el documento: " + error.message);
  }
};

// 7. Actualizar un documento por ID
const updateDocumento = async (id, data, file) => {
  try {
    const documento = await DocumentoCampo.findByPk(id);
    if (!documento) throw new Error("Documento no encontrado");
    
    // Si se proporciona un archivo nuevo, eliminar el anterior y guardar el nuevo
    if (file) {
      // Eliminar archivo anterior si existe y no es una URL externa
      if (documento.archivo_url && documento.archivo_url.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, "..", documento.archivo_url);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      // Crear nombre de archivo único usando timestamp
      const timestamp = new Date().getTime();
      const extension = path.extname(file.originalname);
      const fileName = `${timestamp}-${file.originalname.replace(/\s/g, '_')}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Guardar archivo en el directorio de uploads
      fs.writeFileSync(filePath, file.buffer);
      
      // Guardar la URL relativa del archivo
      const archivoUrl = `/uploads/${fileName}`;
      
      // Actualizar los datos con la URL del archivo
      data.archivo_url = archivoUrl;
      data.mime_type = file.mimetype;
    }
    
    await documento.update(data);
    return documento;
  } catch (error) {
    throw new Error("Error al modificar el documento: " + error.message);
  }
};

// 8. Eliminar un documento por ID
const deleteDocumento = async (id) => {
  try {
    // Primero buscamos el documento para obtener información del archivo
    const documento = await DocumentoCampo.findByPk(id);
    if (!documento) throw new Error("Documento no encontrado");
    
    // Guardamos la ruta del archivo para eliminarlo después
    const archivoUrl = documento.archivo_url;
    
    // Eliminar el registro de la base de datos usando destroy directo para evitar problemas
    const result = await DocumentoCampo.destroy({
      where: { id_documento: id }
    });
    
    if (result === 0) throw new Error("No se pudo eliminar el documento");
    
    // Eliminar archivo del sistema de archivos si existe y no es una URL externa
    if (archivoUrl && archivoUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, "..", archivoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return { success: true, message: "Documento eliminado correctamente" };
  } catch (error) {
    throw new Error("Error al eliminar el documento: " + error.message);
  }
};

// 9. Obtener documentos por tipo de documento
const getDocumentosByTipo = async (usuarioId, tipoDocumento) => {
  try {
    return await DocumentoCampo.findAll({
      where: {
        id_usuario: usuarioId,
        tipo_documento: tipoDocumento
      },
      order: [['fecha_subida', 'DESC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los documentos por tipo: " + error.message);
  }
};

module.exports = {
  getAllDocumentos,
  getDocumentosByUsuarioId,
  getDocumentoById,
  getDocumentosByActividadId,
  getDocumentosByTratamientoId,
  createDocumento,
  updateDocumento,
  deleteDocumento,
  getDocumentosByTipo
};