// BackEnd/src/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send email to all subscribers when new product uploaded
const sendProductNotificationToSubscribers = async (productData) => {
  try {
    const Subscriber = require('../models/Subscriber');
    const subscribers = await Subscriber.find({ isActive: true });
    
    if (subscribers.length === 0) {
      console.log('📧 No active subscribers');
      return;
    }

    console.log(`📧 Sending product notification to ${subscribers.length} subscribers`);

    const frontendUrl = process.env.FRONTEND_URL || 'https://your-frontend.vercel.app';
    const productUrl = `${frontendUrl}/product-detail/${productData._id}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: subscribers.map(s => s.email).join(','), // ✅ BCC to all subscribers
      subject: `🛍️ New Product: ${productData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #B76E79; text-align: center;">✨ New Arrival!</h1>
          
          <div style="text-align: center;">
            <img src="${productData.mainImage}" alt="${productData.title}" style="max-width: 100%; border-radius: 10px; margin: 15px 0;" />
            <h2 style="margin: 10px 0;">${productData.title}</h2>
            <p style="color: #555; font-size: 14px;">${productData.details || 'Discover our latest collection'}</p>
            <p style="font-size: 20px; font-weight: bold; color: #B76E79;">Rs. ${productData.price}</p>
            
            <a href="${productUrl}" style="display: inline-block; background: #B76E79; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; margin: 15px 0;">
              View Product →
            </a>
          </div>

          <hr style="margin: 20px 0;" />

          <div style="text-align: center; font-size: 12px; color: #999;">
            <p>You received this email because you subscribed to AS YOU WISH.</p>
            <p>
              <a href="${frontendUrl}/unsubscribe?email={{EMAIL}}" style="color: #B76E79;">
                Unsubscribe
              </a>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Product notification sent to all subscribers');
    
  } catch (error) {
    console.error('❌ Failed to send emails:', error);
  }
};

module.exports = { sendOrderNotification, sendProductNotificationToSubscribers };