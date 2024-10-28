const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  Post.associate = (models) => {
    Post.hasMany(models.Comment, { foreignKey: "post_id" });
    Post.belongsToMany(models.Tag, {
      through: "PostTags",
      foreignKey: "post_id",
    });
  };

  return Post;
};
