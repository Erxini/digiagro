const express = require("express");
const usuariosRouter = require("./usuariosRouter");
const cultivosRouter = require("./cultivosRouter");
const produccionRouter = require("./produccionRouter");
const sueloRouter = require("./sueloRouter");
const riegosRouter = require("./riegosRouter");

// Importar rutas del cuaderno de campo
const actividadesCampoRouter = require("./actividadesCampoRouter");
const tratamientosCampoRouter = require("./tratamientosCampoRouter");
const documentosCampoRouter = require("./documentosCampoRouter");

const router = express.Router();

// Rutas de usuarios
router.use('/usuarios', usuariosRouter);
// Rutas de cultivos
router.use('/cultivos', cultivosRouter);
// Rutas de producción
router.use('/produccion', produccionRouter);
// Rutas de suelo
router.use('/suelo', sueloRouter);
// Rutas de riegos
router.use('/riegos', riegosRouter);

// Rutas del cuaderno de campo
router.use('/actividades-campo', actividadesCampoRouter);
router.use('/tratamientos-campo', tratamientosCampoRouter);
router.use('/documentos-campo', documentosCampoRouter);

module.exports = router;
