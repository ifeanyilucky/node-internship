const cron = require('node-cron');
const { User, Email, EmailQueue } = require('../models');
const { Op } = require('sequelize');

async function scheduleEmails() {
  try {
    // Get all active users
    const activeUsers = await User.findAll({
      where: { status: 1 } // 1 is the status for active users
    });

    const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    const useOddIds = [1, 3, 5].includes(today); // Monday, Wednesday, Friday

    // Get appropriate emails
    const emails = await Email.findAll({
      where: {
        status: 1, // Active emails only
        id: {
          [Op.mod]: [2, useOddIds ? 1 : 0] // Odd or even IDs
        }
      }
    });

    const bulkEmailQueueData = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    for (const email of emails) {
      for (const user of activeUsers) {
        bulkEmailQueueData.push({
          email_id: email.id,
          user_id: user.id,
          status: 2, 
          send_at: tomorrow,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await EmailQueue.bulkCreate(bulkEmailQueueData);

    console.log(`Scheduled ${bulkEmailQueueData.length} emails for ${activeUsers.length} users.`);
  } catch (error) {
    console.error('Error scheduling emails:', error);
  }
}

cron.schedule('0 0 * * *', () => {
  console.log('Running email scheduling cron job');
  scheduleEmails();
});

module.exports = scheduleEmails;
