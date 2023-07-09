'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
      Attendance.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  Attendance.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
    },
    status: {
      type: DataTypes.ENUM('accepted', 'declined', 'undecided'),
      allowNull: false,
      defaultValue: 'undecided'
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Attendance;
};
