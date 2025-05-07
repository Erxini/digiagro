const sequelize = require("../db");
const { Model, DataTypes } = require('sequelize');

class ActividadCampo extends Model { }

ActividadCampo.init({
  id_actividad: {
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
    onDelete: 'CASCADE',
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  tipo_cultivo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  parcela: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tarea: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isIn: {
        args: [['siembra', 'cosecha', 'tratamiento', 'poda', 'abonado', 'riego', 'otra']],
        msg: "La tarea debe ser: siembra, cosecha, tratamiento, poda, abonado, riego u otra"
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'actividadCampo',
  tableName: 'actividades_campo',
  // timestamps: true,
});

module.exports = ActividadCampo;