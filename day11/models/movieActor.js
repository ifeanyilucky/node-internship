module.exports = (sequelize, DataTypes) => {
  const MovieActor = sequelize.define('MovieActor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return MovieActor;
};
