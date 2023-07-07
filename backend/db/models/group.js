'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('public', 'private'),
      defaultValue: 'public'
    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    price: {
      type: DataTypes.DECIMAL(6,2),
      validate: {
        isDecimal: true
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Date.now()
    },
    endDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Group;
};
