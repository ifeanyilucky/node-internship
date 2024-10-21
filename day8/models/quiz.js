const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Quiz extends Model {
        static associate(models) {
            Quiz.belongsTo(models.User, {foreignKey: 'user_id'});
        }
    }
    Quiz.init({
        title: DataTypes.STRING,
        id: DataTypes.INTEGER,
        type: DataTypes.ENUM('multiple_choice', 'multiple_selection_choice', 'long_text', 'description', 'true_false'),
        question: DataTypes.STRING,
        answers: DataTypes.JSON,
        correct_answer: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Quiz',
    });
    return Quiz;
}
    