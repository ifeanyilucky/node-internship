const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Quiz extends Model {
        static associate(models) {
        }
    }
    Quiz.init({
        title: DataTypes.STRING,
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: DataTypes.ENUM('multiple_choice', 'multiple_selection_choice', 'long_text', 'description', 'true_false', 'short_answer'),
        question: DataTypes.STRING,
        answers: DataTypes.JSON,
        correct_answer: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Quiz',
        tableName: 'quizzes',
    });
    return Quiz;
}
    