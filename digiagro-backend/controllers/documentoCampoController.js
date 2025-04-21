const DocumentoCampoService = require("../services/documentoCampoService");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// 1. Obtener todos los documentos
const getAllDocumentos = async (req, res) => {
  try {
    const documentos = await DocumentoCampoService.getAllDocumentos();
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Obtener documentos por ID de usuario
const getDocumentosByUsuarioId = async (req, res) => {
  try {
    const documentos = await DocumentoCampoService.getDocumentosByUsuarioId(req.params.usuarioId);
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Obtener un documento por ID
const getDocumentoById = async (req, res) => {
  try {
    const documento = await DocumentoCampoService.getDocumentoById(req.params.id);
    res.json(documento);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 4. Obtener documentos por ID de actividad
const getDocumentosByActividadId = async (req, res) => {
  try {
    const documentos = await DocumentoCampoService.getDocumentosByActividadId(req.params.actividadId);
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Obtener documentos por ID de tratamiento
const getDocumentosByTratamientoId = async (req, res) => {
  try {
    const documentos = await DocumentoCampoService.getDocumentosByTratamientoId(req.params.tratamientoId);
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Crear un nuevo documento
const createDocumento = async (req, res) => {
  try {
    const file = req.file; // Archivo subido por multer
    const documento = await DocumentoCampoService.createDocumento(req.body, file);
    res.status(201).json(documento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. Actualizar un documento por ID
const updateDocumento = async (req, res) => {
  try {
    const file = req.file; // Archivo subido por multer (si se proporciona uno nuevo)
    const documento = await DocumentoCampoService.updateDocumento(req.params.id, req.body, file);
    res.json(documento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 8. Eliminar un documento por ID
const deleteDocumento = async (req, res) => {
  try {
    await DocumentoCampoService.deleteDocumento(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 9. Obtener documentos por tipo de documento
const getDocumentosByTipo = async (req, res) => {
  try {
    const { usuarioId, tipoDocumento } = req.params;
    const documentos = await DocumentoCampoService.getDocumentosByTipo(usuarioId, tipoDocumento);
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware para manejar subida de archivos
const handleFileUpload = upload.single('archivo');

module.exports = {
  getAllDocumentos,
  getDocumentosByUsuarioId,
  getDocumentoById,
  getDocumentosByActividadId,
  getDocumentosByTratamientoId,
  createDocumento,
  updateDocumento,
  deleteDocumento,
  getDocumentosByTipo,
  handleFileUpload
};