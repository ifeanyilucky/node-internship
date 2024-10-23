module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    director_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    main_genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Movie.associate = (models) => {
    Movie.belongsTo(models.Director, { foreignKey: 'director_id' });
    Movie.hasOne(models.Review, { foreignKey: 'movie_id' });
    Movie.belongsToMany(models.Actor, { through: models.MovieActor, foreignKey: 'movie_id' });
    Movie.belongsToMany(models.Genre, { through: models.GenreMovie, foreignKey: 'movie_id' });
  };

  return Movie;
};
