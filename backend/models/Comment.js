const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable virtuals when converting to JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for getting replies for a comment
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
  options: { sort: { createdAt: -1 } }
});

// Update the updatedAt timestamp on save
CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get comments for a project with pagination
CommentSchema.statics.getCommentsForProject = async function(projectId, page = 1, limit = 10, sort = 'newest') {
  const skip = (page - 1) * limit;
  
  let sortOption = {};
  switch (sort) {
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'mostLiked':
      sortOption = { likes: -1, createdAt: -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }
  
  // Get only top-level comments (not replies)
  const comments = await this.find({ 
    projectId, 
    parentId: null,
    isDeleted: false 
  })
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'replies',
      match: { isDeleted: false },
      options: { sort: { createdAt: 1 } }
    });
  
  return comments;
};

module.exports = mongoose.model('Comment', CommentSchema);
