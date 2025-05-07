const sequelize = require("../db");
const { Model, DataTypes } = require('sequelize');

class DocumentoCampo extends Model { }

DocumentoCampo.init({
  id_documento: {
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
  id_tratamiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tratamientos_campo',
      key: 'id_tratamiento',
    },
    onDelete: 'SET NULL',
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['factura', 'certificado', 'informe', 'inspeccion', 'otro']],
        msg: "El tipo de documento debe ser factura, certificado, informe, inspeccion u otro"
      }
    }
  },
  archivo_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mime_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  fecha_subida: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'documentoCampo',
  tableName: 'documentos_campo',
  // timestamps: true,
});

module.exports = DocumentoCampo;