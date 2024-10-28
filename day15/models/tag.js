const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, {
      through: "PostTags",
      foreignKey: "tag_id",
    });
  };

  return Tag;
};
