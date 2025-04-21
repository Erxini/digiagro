const Usuario = require("./models/usuarios");
const Cultivo = require("./models/cultivos");
const Riego = require("./models/riegos");
const Produccion = require("./models/produccion");
const Suelo = require("./models/suelo");
const ActividadCampo = require("./models/actividadCampo");
const TratamientoCampo = require("./models/tratamientoCampo");
const DocumentoCampo = require("./models/documentoCampo");

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

// Relaciones para el Cuaderno de Campo
// Usuario -> ActividadCampo (Uno a Muchos)
Usuario.hasMany(ActividadCampo, {foreignKey: "id_usuario", onDelete: "CASCADE",});
ActividadCampo.belongsTo(Usuario, {foreignKey: "id_usuario",});

// Usuario -> TratamientoCampo (Uno a Muchos)
Usuario.hasMany(TratamientoCampo, {foreignKey: "id_usuario", onDelete: "CASCADE",});
TratamientoCampo.belongsTo(Usuario, {foreignKey: "id_usuario",});

// ActividadCampo -> TratamientoCampo (Uno a Muchos)
ActividadCampo.hasMany(TratamientoCampo, {foreignKey: "id_actividad", onDelete: "SET NULL",});
TratamientoCampo.belongsTo(ActividadCampo, {foreignKey: "id_actividad",});

// Usuario -> DocumentoCampo (Uno a Muchos)
Usuario.hasMany(DocumentoCampo, {foreignKey: "id_usuario", onDelete: "CASCADE",});
DocumentoCampo.belongsTo(Usuario, {foreignKey: "id_usuario",});

// ActividadCampo -> DocumentoCampo (Uno a Muchos)
ActividadCampo.hasMany(DocumentoCampo, {foreignKey: "id_actividad", onDelete: "SET NULL",});
DocumentoCampo.belongsTo(ActividadCampo, {foreignKey: "id_actividad",});

// TratamientoCampo -> DocumentoCampo (Uno a Muchos)
TratamientoCampo.hasMany(DocumentoCampo, {foreignKey: "id_tratamiento", onDelete: "SET NULL",});
DocumentoCampo.belongsTo(TratamientoCampo, {foreignKey: "id_tratamiento",});

module.exports = {
  Usuario,
  Cultivo,
  Riego,
  Produccion,
  Suelo,
  ActividadCampo,
  TratamientoCampo,
  DocumentoCampo
};