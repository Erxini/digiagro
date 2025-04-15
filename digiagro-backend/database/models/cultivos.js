const sequelize = require("../db");
const { Model, DataTypes } = require('sequelize');

class Cultivo extends Model { }

Cultivo.init({
  id_cultivo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario',
    },
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  fecha_siembra: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: {
        args: [new Date().toISOString()],
        msg: "La fecha de siembra no puede ser mayor a la fecha actual",
      },
    },
  },
  fecha_cosecha: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfter: {
        args: [new Date().toISOString()],
        msg: "La fecha de cosecha no puede ser menor a la fecha de siembra",
      },
    },
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'cultivo',
  tableName: 'cultivos',
  timestamps: false,
});

module.exports = Cultivo;