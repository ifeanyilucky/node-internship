const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, { foreignKey: "post_id" });
    Comment.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Comment;
};
