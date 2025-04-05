const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { auth } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Get all news articles
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const news = await News.find(query).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news articles' });
  }
});

// Get single news article
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Error fetching news article' });
  }
});

// Create news article (admin or NGO)
router.post('/', auth, checkRole(['admin', 'ngo']), async (req, res) => {
  try {
    const news = new News({
      ...req.body,
      author: req.user.name || req.body.author,
      user: req.user.id
    });
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(400).json({ message: 'Error creating news article' });
  }
});

// Update news article (admin or original author)
router.put('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    if (req.user.userType !== 'admin' && news.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this news article' });
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(400).json({ message: 'Error updating news article' });
  }
});

// Delete news article (admin or original author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    if (req.user.userType !== 'admin' && news.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this news article' });
    }

    await news.deleteOne();
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ message: 'Error deleting news article' });
  }
});

module.exports = router; 