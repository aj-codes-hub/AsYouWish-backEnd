// BackEnd/src/controllers/subscriberController.js
const Subscriber = require('../models/Subscriber');

// ✅ Subscribe
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        // Reactivate
        existing.isActive = true;
        await existing.save();
        return res.json({ message: 'Subscription reactivated successfully' });
      }
    }

    const subscriber = await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Unsubscribe
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found' });
    }

    subscriber.isActive = false;
    await subscriber.save();
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all subscribers (Admin only)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true })
      .sort({ subscribedAt: -1 });
    res.json({
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRandomSubscribers = async (req, res) => {
  try {
    const { count = 2 } = req.query;
    const limit = Math.min(parseInt(count) || 2, 50); // ✅ Max 50
    
    const subscribers = await Subscriber.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } }
    ]);
    
    res.json({
      count: subscribers.length,
      subscribers: subscribers.map(s => s.email),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unsubscribeByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found' });
    }

    res.send(`
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; }
            .icon { font-size: 50px; color: #B76E79; }
            h1 { color: #333; }
            p { color: #666; }
            .btn { display: inline-block; background: #B76E79; color: white; padding: 10px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📧</div>
            <h1>Unsubscribed Successfully</h1>
            <p>You have been unsubscribed from AS YOU WISH notifications.</p>
            <p>We're sorry to see you go!</p>
            <a href="${process.env.FRONTEND_URL || 'https://your-frontend.vercel.app'}" class="btn">Visit Website</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { subscribe, unsubscribe, getSubscribers, unsubscribeByEmail, getRandomSubscribers };