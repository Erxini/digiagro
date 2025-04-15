const Usuario = require("./models/usuarios");
const Cultivo = require("./models/cultivos");
const Riego = require("./models/riegos");
const Produccion = require("./models/produccion");
const Suelo = require("./models/suelo");

// Relación Usuario -> Cultivo (Uno a Muchos)
Usuario.hasMany(Cultivo, { foreignKey: "id_usuario", onDelete: "CASCADE",});
Cultivo.belongsTo(Usuario, { foreignKey: "id_usuario",});

// Relación Cultivo -> Riego (Uno a Muchos)
Cultivo.hasMany(Riego, {foreignKey: "id_cultivo",onDelete: "CASCADE",});
Riego.belongsTo(Cultivo, {foreignKey: "id_cultivo",});

// Relación Cultivo -> Producción (Uno a Muchos)
Cultivo.hasMany(Produccion, {foreignKey: "id_cultivo", onDelete: "CASCADE",});
Produccion.belongsTo(Cultivo, {foreignKey: "id_cultivo",});

// Relación Cultivo -> Suelo (Uno a Muchos)
Cultivo.hasMany(Suelo, {foreignKey: "id_cultivo", onDelete: "CASCADE",});
Suelo.belongsTo(Cultivo, {foreignKey: "id_cultivo",});

module.exports = {
  Usuario,
  Cultivo,
  Riego,
  Produccion,
  Suelo,
};