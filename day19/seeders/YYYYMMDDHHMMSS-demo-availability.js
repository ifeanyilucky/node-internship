"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    // Create availability for Monday through Friday, 9 AM to 5 PM
    const availabilities = [
      {
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: true,
      },
      {
        dayOfWeek: 2,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: true,
      },
      {
        dayOfWeek: 3,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: true,
      },
      {
        dayOfWeek: 4,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: true,
      },
      {
        dayOfWeek: 5,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: true,
      },
      // Weekend days are not available
      {
        dayOfWeek: 0,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: false,
      },
      {
        dayOfWeek: 6,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        isAvailable: false,
      },
    ].map((a) => ({
      ...a,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Availabilities", availabilities, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Availabilities", null, {});
  },
};
