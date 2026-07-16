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

module.exports = { subscribe, unsubscribe, getSubscribers };