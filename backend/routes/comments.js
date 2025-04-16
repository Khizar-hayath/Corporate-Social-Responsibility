const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get comments for a project
router.get('/projects/:projectId/comments', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'newest';

    const comments = await Comment.getCommentsForProject(projectId, page, limit, sort);
    
    // If user is logged in, mark comments liked by the user
    if (req.user) {
      const userId = req.user.id;
      comments.forEach(comment => {
        comment.liked = comment.likedBy.includes(userId);
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            reply.liked = reply.likedBy.includes(userId);
          });
        }
      });
    }
    
    return res.json({ comments });
  } catch (err) {
    console.error('Error getting comments:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a project
router.post('/projects/:projectId/comments', auth.optional, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const { content, parentId, author } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = new Comment({
      projectId,
      content: content.trim(),
      author: author || 'Anonymous',
      userId: req.user ? req.user.id : null,
      parentId: parentId && isValidObjectId(parentId) ? parentId : null
    });

    await comment.save();
    
    // If it's a reply, populate the parent info
    if (comment.parentId) {
      await Comment.findByIdAndUpdate(
        comment.parentId,
        { $inc: { replyCount: 1 } }
      );
      
      // Return the saved comment
      return res.status(201).json(comment);
    } else {
      // If it's a top-level comment, populate its replies before returning
      const populatedComment = await Comment.findById(comment._id).populate({
        path: 'replies',
        match: { isDeleted: false },
        options: { sort: { createdAt: 1 } }
      });
      
      return res.status(201).json(populatedComment);
    }
  } catch (err) {
    console.error('Error adding comment:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a comment
router.put('/projects/:projectId/comments/:commentId', auth.required, async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    if (!isValidObjectId(projectId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is authorized to edit this comment
    if (!req.user.isAdmin && comment.userId && comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }
    
    comment.content = content.trim();
    comment.updatedAt = Date.now();
    
    await comment.save();
    
    return res.json(comment);
  } catch (err) {
    console.error('Error updating comment:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment
router.delete('/projects/:projectId/comments/:commentId', auth.required, async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    if (!isValidObjectId(projectId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is authorized to delete this comment
    if (!req.user.isAdmin && comment.userId && comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Soft delete by setting isDeleted flag
    comment.isDeleted = true;
    comment.content = '[deleted]';
    await comment.save();
    
    return res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a comment
router.post('/projects/:projectId/comments/:commentId/like', auth.required, async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    if (!isValidObjectId(projectId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const userId = req.user.id;
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user already liked the comment
    const index = comment.likedBy.indexOf(userId);
    let liked = false;
    
    if (index > -1) {
      // Unlike
      comment.likedBy.splice(index, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Like
      comment.likedBy.push(userId);
      comment.likes = comment.likes + 1;
      liked = true;
    }
    
    await comment.save();
    
    return res.json({ likes: comment.likes, liked });
  } catch (err) {
    console.error('Error liking comment:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 