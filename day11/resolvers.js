const resolvers = {
  Query: {
    movies: async (_, __, { db }) => {
      return db.Movie.findAll({
        include: [
          { model: db.Review },
          { model: db.Director },
          { model: db.Actor },
          { model: db.Genre }
        ]
      });
    },

    reviews: async (_, __, { db }) => {
      return db.Review.findAll({ include: [{ model: db.Movie }] });
    },

    directors: async (_, __, { db }) => {
      return db.Director.findAll({ include: [{ model: db.Movie }] });
    },

    actors: async (_, __, { db }) => {
      return db.Actor.findAll({ include: [{ model: db.Movie }] });
    },

    moviesWithMinReviews: async (_, { minReviews }, { db }) => {
      return db.Movie.findAll({
        include: [
          {
            model: db.Review,
            required: true,
            where: {
              id: {
                [db.Sequelize.Op.gte]: minReviews
              }
            }
          },
          { model: db.Director },
          { model: db.Actor },
          { model: db.Genre }
        ]
      });
    },
  },

  Mutation: {
    addActorToGenreMovies: async (_, { actorId, genreName }, { db }) => {
      const actor = await db.Actor.findByPk(actorId);
      if (!actor) {
        throw new Error('Actor not found');
      }

      const genre = await db.Genre.findOne({ where: { name: genreName } });
      if (!genre) {
        throw new Error('Genre not found');
      }

      const movies = await db.Movie.findAll({
        include: [
          {
            model: db.Genre,
            where: { id: genre.id }
          }
        ]
      });

      for (const movie of movies) {
        await db.MovieActor.findOrCreate({
          where: {
            actor_id: actor.id,
            movie_id: movie.id
          }
        });
      }

      return movies;
    },
  },

  Movie: {
    actors: async (movie, _, { db }) => {
      return db.Actor.findAll({
        include: [
          {
            model: db.Movie,
            where: { id: movie.id }
          }
        ]
      });
    },
  },
};

module.exports = resolvers;
