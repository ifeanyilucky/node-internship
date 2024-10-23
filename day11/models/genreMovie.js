module.exports = (sequelize, DataTypes) => {
  const GenreMovie = sequelize.define('GenreMovie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return GenreMovie;
};
