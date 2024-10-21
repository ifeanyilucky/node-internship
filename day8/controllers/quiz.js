const { Quiz } = require('../models');

exports.getAllQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findAll();
        res.json(quiz);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.update(req.body, {where: {id: req.params.id}});
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.destroy({where: {id: req.params.id}});
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

 