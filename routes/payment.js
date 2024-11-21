const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking'); // Import Booking model
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount, groundId, userId } = req.body;

  if (!amount || !groundId || !userId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: 'INR',
      receipt: `receipt_${groundId}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      groundId,
      userId,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
});

// Verify Razorpay payment and create booking
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, groundId, userId, amount } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    try {
      // Save booking in database
      const newBooking = new Booking({
        groundId,
        userId,
        amount,
        status: 'confirmed',
      });
      await newBooking.save();

      res.status(200).json({ success: true, message: 'Payment verified successfully', booking: newBooking });
    } catch (error) {
      console.error('Error saving booking:', error);
      res.status(500).json({ success: false, message: 'Error saving booking', error });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
