'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      })
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: 'eventId',
        otherKey: 'userId'
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Venues',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('public', 'private'),
      defaultValue: 'public',
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Event;
};
