module.exports = (sequelize, DataTypes) => {
  const Director = sequelize.define('Director', {
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

  Director.associate = (models) => {
    Director.hasMany(models.Movie, { foreignKey: 'director_id' });
  };

  return Director;
};