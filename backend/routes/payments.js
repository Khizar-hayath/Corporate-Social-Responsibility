const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');

// Lazy initialization of Razorpay instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
};

// Check Razorpay configuration
const isRazorpayConfigured = () => {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

// Helper function to verify Razorpay signature
const verifySignature = (orderId, paymentId, signature, secret) => {
  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload.toString())
    .digest('hex');
  return generatedSignature === signature;
};

// Export webhook handler separately for raw body parsing
const handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Webhook secret is optional - webhooks are not required for basic payment functionality
    if (!webhookSecret) {
      console.warn('⚠️  Webhook secret not configured. Webhook events will not be processed.');
      console.warn('   To enable webhooks, set RAZORPAY_WEBHOOK_SECRET in your .env file.');
      return res.status(503).json({ 
        message: 'Webhook not configured. This is optional and not required for basic payments.' 
      });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body.toString())
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(event);
        break;
      case 'subscription.charged':
        await handleSubscriptionCharged(event);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Helper functions for webhook events
async function handlePaymentCaptured(event) {
  try {
    const payment = event.payload.payment.entity;
    const donation = await Donation.findOne({ 
      razorpayOrderId: payment.order_id 
    });

    if (donation && donation.status !== 'completed') {
      donation.razorpayPaymentId = payment.id;
      donation.status = 'completed';
      donation.paidAt = new Date();
      await donation.save();
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(event) {
  try {
    const payment = event.payload.payment.entity;
    const donation = await Donation.findOne({ 
      razorpayOrderId: payment.order_id 
    });

    if (donation) {
      donation.status = 'failed';
      await donation.save();
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionCreated(event) {
  try {
    const subscription = event.payload.subscription.entity;
    // Handle subscription creation if needed
    console.log('Subscription created:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionCharged(event) {
  try {
    const payment = event.payload.payment.entity;
    // Create new donation record for recurring payment
    const newDonation = new Donation({
      donorName: payment.notes?.donorName || 'Recurring Donor',
      donorEmail: payment.notes?.donorEmail || '',
      amount: payment.amount,
      currency: payment.currency,
      donationType: 'monthly',
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
      subscriptionId: payment.subscription_id,
      status: 'completed',
      paidAt: new Date()
    });
    await newDonation.save();
  } catch (error) {
    console.error('Error handling subscription charged:', error);
  }
}

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!isRazorpayConfigured()) {
      return res.status(503).json({ 
        message: 'Payment service is not configured. Please contact administrator.' 
      });
    }

    const { amount, donationType, donorName, donorEmail, donorPhone } = req.body;

    // Validation
    if (!amount || amount < 1) {
      return res.status(400).json({ 
        message: 'Invalid donation amount. Minimum amount is ₹1' 
      });
    }

    if (!donationType || !['one-time', 'monthly'].includes(donationType)) {
      return res.status(400).json({ 
        message: 'Invalid donation type' 
      });
    }

    if (!donorName || !donorEmail) {
      return res.status(400).json({ 
        message: 'Donor name and email are required' 
      });
    }

    // Convert rupees to paise (Razorpay uses paise for INR)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order options
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `donation_${Date.now()}`,
      notes: {
        donationType,
        donorName,
        donorEmail,
        donorPhone: donorPhone || ''
      }
    };

    // Get Razorpay instance and create order
    let razorpay;
    try {
      razorpay = getRazorpayInstance();
    } catch (error) {
      return res.status(503).json({ 
        message: 'Payment service is not available. Please contact administrator.' 
      });
    }
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save donation record in database
    const donation = new Donation({
      donorName,
      donorEmail,
      donorPhone,
      amount: amountInPaise,
      currency: 'INR',
      donationType,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });

    await donation.save();

    // Return order details to frontend
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID // Frontend needs this for checkout
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      message: 'Failed to create payment order',
      error: error.message 
    });
  }
});

// Verify payment and update donation record
router.post('/verify', async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!isRazorpayConfigured()) {
      return res.status(503).json({ 
        message: 'Payment service is not configured. Please contact administrator.' 
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        message: 'Missing payment verification data' 
      });
    }

    // Find donation record
    const donation = await Donation.findOne({ 
      razorpayOrderId: razorpay_order_id 
    });

    if (!donation) {
      return res.status(404).json({ 
        message: 'Donation record not found' 
      });
    }

    // Verify signature
    const isValidSignature = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValidSignature) {
      // Update donation status to failed
      donation.status = 'failed';
      await donation.save();
      
      return res.status(400).json({ 
        message: 'Payment verification failed: Invalid signature' 
      });
    }

    // Update donation record
    donation.razorpayPaymentId = razorpay_payment_id;
    donation.razorpaySignature = razorpay_signature;
    donation.status = 'completed';
    donation.paidAt = new Date();
    
    await donation.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      donation: {
        id: donation._id,
        amount: donation.amount / 100, // Convert paise to rupees
        status: donation.status,
        paymentId: donation.razorpayPaymentId
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      message: 'Payment verification failed',
      error: error.message 
    });
  }
});

// Webhook handler - registered separately in server.js with raw body parsing
router.post('/webhook', handleWebhook);

// Get donation history (public endpoint)
router.get('/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ status: 'completed' })
      .select('donorName amount currency donationType createdAt paidAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Donation.countDocuments({ status: 'completed' });

    // Convert amount from paise to rupees
    const donationsWithRupees = donations.map(donation => ({
      ...donation.toObject(),
      amount: donation.amount / 100
    }));

    res.json({
      donations: donationsWithRupees,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch donation history',
      error: error.message 
    });
  }
});

module.exports = router;
module.exports.handleWebhook = handleWebhook;
