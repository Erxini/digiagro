const sequelize = require("../db");
const { Model, DataTypes } = require('sequelize');

class Riego extends Model { }

Riego.init({
  id_riego: {
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
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  cantidad_agua: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'riego',
  tableName: 'riegos',
  timestamps: false,
});

module.exports = Riego;