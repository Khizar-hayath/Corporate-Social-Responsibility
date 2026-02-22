const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const News = require('../models/News');
const auth = require('../middleware/auth');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all news articles with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const status = req.query.status || 'published';
    
    const filter = { status };
    if (category) filter.category = category;
    
    const total = await News.countDocuments(filter);
    const news = await News.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email');
    
    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single news article by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid news ID' });
    }
    
    const news = await News.findById(id).populate('user', 'name email');
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    res.json(news);
  } catch (err) {
    console.error('Error fetching news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new news article
router.post('/', auth.required, async (req, res) => {
  try {
    // Check if user is admin or NGO
    if (req.user.userType !== 'admin' && req.user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Access denied. Admin or NGO only.' });
    }
    
    const {
      title,
      excerpt,
      content,
      category,
      author,
      image,
      tags = [],
      status = 'published'
    } = req.body;
    
    // Validate required fields
    if (!title || !content || !category || !author || !image) {
      return res.status(400).json({ 
        message: 'Missing required fields. Title, content, category, author, and image are required.' 
      });
    }
    
    const news = new News({
      title,
      excerpt,
      content,
      category,
      author,
      image,
      tags,
      status,
      user: req.user.id
    });
    
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    console.error('Error creating news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a news article
router.put('/:id', auth.required, async (req, res) => {
  try {
    // Check if user is admin or NGO
    if (req.user.userType !== 'admin' && req.user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Access denied. Admin or NGO only.' });
    }
    
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid news ID' });
    }
    
    // Find the news article first
    const newsArticle = await News.findById(id);
    if (!newsArticle) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    // If user is NGO, they can only edit their own news articles
    if (req.user.userType === 'ngo' && newsArticle.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own news articles.' });
    }
    
    const {
      title,
      excerpt,
      content,
      category,
      author,
      image,
      tags,
      status
    } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (author) updateData.author = author;
    if (image) updateData.image = image;
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;
    
    const news = await News.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    res.json(news);
  } catch (err) {
    console.error('Error updating news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a news article
router.delete('/:id', auth.required, async (req, res) => {
  try {
    // Check if user is admin or NGO
    if (req.user.userType !== 'admin' && req.user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Access denied. Admin or NGO only.' });
    }
    
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid news ID' });
    }
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    // If user is NGO, they can only delete their own news articles
    if (req.user.userType === 'ngo' && news.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own news articles.' });
    }
    
    await News.findByIdAndDelete(id);
    res.json({ message: 'News article deleted successfully' });
  } catch (err) {
    console.error('Error deleting news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 