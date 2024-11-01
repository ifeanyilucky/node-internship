const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const moment = require("moment");

// GET /api/v1/booked - Get available time slots
router.get("/api/v1/booked", async (req, res) => {
  try {
    const db = req.app.get("db");
    const { date } = req.query;

    // Get the date's start and end
    const startDate = moment(date).startOf("day").toDate();
    const endDate = moment(date).endOf("day").toDate();

    // Get day of week (0-6, where 0 is Sunday)
    const dayOfWeek = moment(date).day();

    // Check if it's a weekend (0 is Sunday, 6 is Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.json({ availableSlots: [], isWeekend: true });
    }

    const availability = await db.Availability.findOne({
      where: {
        dayOfWeek,
        isAvailable: true,
      },
    });

    if (!availability) {
      return res.json({ availableSlots: [] });
    }

    // Get all booked appointments for the date
    const bookedSlots = await db.Schedule.findAll({
      where: {
        startTime: {
          [Op.between]: [startDate, endDate],
        },
        status: "confirmed",
      },
      order: [["startTime", "ASC"]],
    });

    // Generate time slots based on availability
    const availableSlots = [];
    let currentTime = moment(date)
      .hour(availability.startHour)
      .minute(availability.startMinute)
      .second(0);

    const endTime = moment(date)
      .hour(availability.endHour)
      .minute(availability.endMinute)
      .second(0);

    // Generate 30-minute slots
    while (currentTime.isBefore(endTime)) {
      const slotStart = currentTime.toDate();
      const slotEnd = currentTime.clone().add(30, "minutes").toDate();

      // Check if slot conflicts with any booked appointments
      const isSlotAvailable = !bookedSlots.some((booking) => {
        const bookingStart = moment(booking.startTime);
        const bookingEnd = moment(booking.endTime);
        return (
          moment(slotStart).isBetween(
            bookingStart,
            bookingEnd,
            undefined,
            "[)"
          ) ||
          moment(slotEnd).isBetween(
            bookingStart,
            bookingEnd,
            undefined,
            "(]"
          ) ||
          bookingStart.isBetween(
            moment(slotStart),
            moment(slotEnd),
            undefined,
            "[]"
          )
        );
      });

      if (isSlotAvailable) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd,
        });
      }

      currentTime.add(30, "minutes");
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/v1/schedule - Create a new appointment
router.post("/api/v1/schedule", async (req, res) => {
  try {
    const db = req.app.get("db");
    const { startTime, endTime, clientName, clientEmail } = req.body;

    // Validate the time slot is available
    const conflictingBooking = await db.Schedule.findOne({
      where: {
        [Op.and]: [
          {
            startTime: {
              [Op.lt]: new Date(endTime),
            },
          },
          {
            endTime: {
              [Op.gt]: new Date(startTime),
            },
          },
          {
            status: "confirmed",
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: "Time slot is already booked" });
    }

    const schedule = await db.Schedule.create({
      startTime,
      endTime,
      clientName,
      clientEmail,
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/v1/availability - Get all availability settings
router.get("/api/v1/availability", async (req, res) => {
  try {
    const db = req.app.get("db");
    const availability = await db.Availability.findAll({
      attributes: ["dayOfWeek", "isAvailable"],
      order: [["dayOfWeek", "ASC"]],
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
