const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');

router.get('/', quizController.getAllQuiz);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;