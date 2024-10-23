module.exports = (sequelize, DataTypes) => {
  const Actor = sequelize.define('Actor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Actor.associate = (models) => {
    Actor.belongsToMany(models.Movie, { through: models.MovieActor, foreignKey: 'actor_id' });
  };

  return Actor;
};