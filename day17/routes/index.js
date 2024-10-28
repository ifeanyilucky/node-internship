var express = require("express");
var router = express.Router();
const moment = require("moment-timezone");
const { Op } = require("sequelize");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET calendar page. */
router.get("/calendar", function (req, res, next) {
  res.render("calendar");
});

router.get("/success", function (req, res, next) {
  res.render("success");
});
/* GET available time slots */
router.get("/api/available-slots", async function (req, res) {
  const { date, timezone } = req.query;
  const db = req.app.get("db");

  // Convert date to UTC
  const startOfDay = moment.tz(date, timezone).startOf("day").utc();
  const endOfDay = moment.tz(date, timezone).endOf("day").utc();

  const businessStart = 9;
  const businessEnd = 17;
  const slotDuration = 60; // minutes

  const slots = [];
  let currentSlot = moment
    .tz(date, timezone)
    .hour(businessStart)
    .startOf("hour");
  const dayEnd = moment.tz(date, timezone).hour(businessEnd).startOf("hour");

  while (currentSlot.isBefore(dayEnd)) {
    slots.push(currentSlot.format());
    currentSlot = currentSlot.add(slotDuration, "minutes");
  }

  // Get booked appointments
  const bookedSlots = await db.Appointment.findAll({
    where: {
      startTime: {
        [Op.between]: [startOfDay.format(), endOfDay.format()],
      },
      status: {
        [Op.ne]: "cancelled",
      },
    },
  });

  // Filter out booked slots
  const bookedTimes = bookedSlots.map((apt) =>
    moment(apt.startTime).tz(timezone).format()
  );
  const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot));

  res.json(availableSlots);
});

/* POST create appointment */
router.post("/api/appointments", async function (req, res) {
  try {
    const db = req.app.get("db");
    const { selectedTime, timezone, fullName, email, company, phone, notes } =
      req.body;

    // Convert selected time to UTC for storage
    const startTime = moment.tz(selectedTime, timezone).utc();
    const endTime = moment.tz(selectedTime, timezone).add(1, "hour").utc();

    const appointment = await db.Appointment.create({
      startTime: startTime.format(),
      endTime: endTime.format(),
      fullName,
      email,
      company,
      phone,
      notes,
      timezone,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

module.exports = router;
