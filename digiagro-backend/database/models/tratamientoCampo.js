const sequelize = require("../db");
const { Model, DataTypes } = require('sequelize');

class TratamientoCampo extends Model { }

TratamientoCampo.init({
  id_tratamiento: {
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
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'actividades_campo',
      key: 'id_actividad',
    },
    onDelete: 'SET NULL',
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  producto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo_producto: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: {
        args: [['ecologico', 'convencional']],
        msg: "El tipo de producto debe ser ecológico o convencional"
      }
    }
  },
  cantidad_aplicada: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unidad_medida: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: {
        args: [['kg', 'g', 'l', 'ml']],
        msg: "La unidad de medida debe ser kg, g, l o ml"
      }
    }
  },
  superficie_tratada: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unidad_superficie: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: {
        args: [['m2', 'ha']],
        msg: "La unidad de superficie debe ser m2 o ha"
      }
    }
  },
  dosis_por_area: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  tecnico_responsable: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'tratamientoCampo',
  tableName: 'tratamientos_campo',
  timestamps: true,
});

module.exports = TratamientoCampo;