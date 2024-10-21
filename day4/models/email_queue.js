'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmailQueue = sequelize.define('EmailQueue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'emails',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: {
        isIn: [[1, 2]] // 1: sent, 2: not sent
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    send_at: DataTypes.DATE,
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'email_queues',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  EmailQueue.associate = function(models) {
    EmailQueue.belongsTo(models.Email, { foreignKey: 'email_id' });
    EmailQueue.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return EmailQueue;
};
