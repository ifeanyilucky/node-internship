var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/calendar", function (req, res, next) {
  res.render("calendar", { title: "Appointment Calendar" });
});

module.exports = router;
