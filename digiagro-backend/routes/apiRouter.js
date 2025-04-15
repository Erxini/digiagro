const apirouter = require("express").Router();

const usuarioRouter = require("./usuariosRouter");
const cultivoRouter = require("./cultivosRouter");
const riegoRouter = require("./riegosRouter");
const produccionRouter = require("./produccionRouter");
const sueloRouter = require("./sueloRouter");

// Rutas para cada entidad
apirouter.use("/usuarios", usuarioRouter);
apirouter.use("/cultivos", cultivoRouter);
apirouter.use("/riegos", riegoRouter);
apirouter.use("/produccion", produccionRouter);
apirouter.use("/suelo", sueloRouter);

module.exports = apirouter;
