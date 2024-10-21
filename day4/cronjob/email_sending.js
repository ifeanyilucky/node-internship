const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { EmailQueue, User, Email } = require('../models');
const { Op } = require('sequelize');

// Configure nodemailer with Mailtrap
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "username",
    pass: "password"
  }
});

async function sendEmails() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all email queue items for today
    const queueItems = await EmailQueue.findAll({
      where: {
        send_at: {
          [Op.gte]: today,
          [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 2 // Not sent
      },
      include: [
        { model: User },
        { model: Email }
      ]
    });

    for (const item of queueItems) {
      const { User: user, Email: email } = item;

      let emailBody = email.body.replace('{{{NAME}}}', user.name).replace('{{{EMAIL}}}', user.email);

      // Send email
      await transporter.sendMail({
        from: '"Your App" <noreply@yourapp.com>',
        to: user.email,
        subject: email.subject,
        html: emailBody
      });

      await item.update({ status: 1 }); //   1 is sent
    }

    console.log(`Sent ${queueItems.length} emails.`);
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}


cron.schedule('0 1 * * *', () => {
  console.log('Running email sending cron job');
  sendEmails();
});

module.exports = sendEmails;
