module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Movie, { foreignKey: 'movie_id' });
  };

  return Review;
};
