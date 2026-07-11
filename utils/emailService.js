// BackEnd/src/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderNotification = async (orderData) => {
  onsole.log('📧 Attempting to send email...'); // ✅ ADD
  console.log('📧 Order data:', orderData); // ✅ ADD
  const { customerName, customerEmail, orderId, total, items, shippingAddress } = orderData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `🛍️ New Order! #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #B76E79; text-align: center;">🛍️ New Order Received!</h1>
        
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total:</strong> Rs. ${total}</p>
          <p><strong>Items:</strong> ${items} items</p>
        </div>

        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h2 style="margin-top: 0;">Customer Information</h2>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Address:</strong> ${shippingAddress}</p>
        </div>

        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h2 style="margin-top: 0;">Products</h2>
          ${orderData.products.map(p => `
            <p>${p.title} x ${p.quantity} = Rs. ${p.price * p.quantity}</p>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: #B76E79; color: white; border-radius: 8px;">
          <p style="margin: 0;">AS YOU WISH — Admin Panel</p>
          <p style="margin: 0; font-size: 12px;">Login to manage orders: <a href="https://your-domain.com/admin" style="color: white;">Admin Panel</a></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent to admin');
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

module.exports = { sendOrderNotification };