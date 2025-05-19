const sequelize = require("../db");
const { Model, DataTypes } = require('sequelize');

class Produccion extends Model { }

Produccion.init({
  id_produccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cultivo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cultivos',
      key: 'id_cultivo',
    },
    onDelete: 'CASCADE',
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  calidad: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  precio_venta: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  ganancia: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'produccion',
  tableName: 'produccion',
  timestamps: false,
});

module.exports = Produccion;