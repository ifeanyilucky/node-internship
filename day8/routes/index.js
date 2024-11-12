var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Route to render the quiz page
router.get("/quiz", function (req, res, next) {
  res.render("quiz");
});

// API endpoint for quiz data
router.get("/quiz/data", function (req, res) {
  // Example quiz data - replace with your actual data source
  const quizData = [
    {
      id: 1,
      type: "multiple_choice",
      question: "What is the capital of France?",
      answers: JSON.stringify([
        { answer: "Paris" },
        { answer: "London" },
        { answer: "Berlin" },
      ]),
    },
    {
      id: 2,
      type: "true_false",
      question: "The sky is blue",
      answers: JSON.stringify([]),
    },
  ];

  res.json(quizData);
});

module.exports = router;
