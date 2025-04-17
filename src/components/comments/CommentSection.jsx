import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiMessageCircle, FiFilter, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import CommentSummary from './CommentSummary';
import api from '../../services/api';

function CommentSection({ projectId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('newest');
  const [activeComment, setActiveComment] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchComments = useCallback(async (pageNum = 1, sortBy = sort, reset = false) => {
    try {
      setLoading(true);
      
      const response = await api.get(
        `/api/projects/${projectId}/comments?page=${pageNum}&sort=${sortBy}`
      );
      
      const newComments = response.data.comments;
      setHasMore(newComments.length > 0);
      
      if (reset || pageNum === 1) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }
      
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [projectId, sort]);

  useEffect(() => {
    fetchComments(1, sort, true);
  }, [fetchComments, sort]);

  const handleSort = (sortOption) => {
    setSort(sortOption);
    setShowFilterMenu(false);
  };

  const handleAddComment = async (commentData) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/comments`, commentData);
      
      if (commentData.parentId) {
        // If it's a reply, we need to refresh the comments to get the updated replies
        // This ensures the virtual 'replies' field is properly populated
        fetchComments(1, sort, true);
      } else {
        // If it's a top-level comment, add it to the beginning
        setComments(prevComments => [response.data, ...prevComments]);
      }

      // Reset any active reply/edit state
      setActiveComment(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleReply = (comment) => {
    setActiveComment({
      id: comment._id,
      type: 'replying'
    });
  };

  const handleEdit = (comment) => {
    setActiveComment({
      id: comment._id,
      type: 'editing',
      content: comment.content
    });
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/api/projects/${projectId}/comments/${commentId}`);
        
        // Remove the comment from state
        setComments(prevComments => {
          // Check if it's a top-level comment
          const filteredComments = prevComments.filter(c => c._id !== commentId);
          
          // If lengths are the same, it might be a reply - search all replies
          if (filteredComments.length === prevComments.length) {
            return prevComments.map(comment => {
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: comment.replies.filter(r => r._id !== commentId)
                };
              }
              return comment;
            });
          }
          
          return filteredComments;
        });
      } catch (err) {
        console.error('Error deleting comment:', err);
        if (err.response?.status === 403) {
          setError('You can only delete your own comments.');
        } else {
          setError('Failed to delete comment. Please try again.');
        }
        
        // Clear error message after 3 seconds
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleUpdate = async (commentData) => {
    try {
      const response = await api.put(
        `/api/projects/${projectId}/comments/${activeComment.id}`, 
        { content: commentData.content }
      );
      
      // Update the comment in state
      setComments(prevComments => {
        // Check if it's a top-level comment
        const updatedComments = prevComments.map(c => {
          if (c._id === activeComment.id) {
            return { ...c, content: response.data.content };
          }
          
          // If not found at top level, check replies
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: c.replies.map(r => 
                r._id === activeComment.id 
                  ? { ...r, content: response.data.content }
                  : r
              )
            };
          }
          
          return c;
        });
        
        return updatedComments;
      });
      
      setActiveComment(null);
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/comments/${commentId}/like`);
      
      // Update the comment in state
      setComments(prevComments => {
        // Check if it's a top-level comment
        const updatedComments = prevComments.map(c => {
          if (c._id === commentId) {
            return { 
              ...c, 
              likes: response.data.likes,
              liked: response.data.liked
            };
          }
          
          // If not found at top level, check replies
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: c.replies.map(r => 
                r._id === commentId 
                  ? { 
                      ...r, 
                      likes: response.data.likes,
                      liked: response.data.liked
                    }
                  : r
              )
            };
          }
          
          return c;
        });
        
        return updatedComments;
      });
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1);
    }
  };

  // Get all comments including replies for summarization
  const allComments = useMemo(() => {
    const result = [...comments];
    
    // Add all replies to the array
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        result.push(...comment.replies);
      }
    });
    
    return result;
  }, [comments]);

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FiMessageCircle className="mr-2" />
          Comments ({comments.length})
        </h2>
        
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiFilter className="mr-1" />
            {sort === 'newest' ? 'Newest first' : sort === 'oldest' ? 'Oldest first' : 'Most liked'}
            <FiChevronDown className="ml-1" />
          </button>
          
          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => handleSort('newest')}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sort === 'newest'
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Newest first
                </button>
                <button
                  onClick={() => handleSort('oldest')}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sort === 'oldest'
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Oldest first
                </button>
                <button
                  onClick={() => handleSort('mostLiked')}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sort === 'mostLiked'
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Most liked
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
      
      {comments.length > 0 && (
        <CommentSummary comments={allComments} />
      )}
      
      <CommentForm onSubmit={handleAddComment} />
      
      {activeComment?.type === 'replying' && (
        <div className="ml-8 mb-4">
          <CommentForm
            onSubmit={handleAddComment}
            onCancel={() => setActiveComment(null)}
            parentId={activeComment.id}
            placeholder="Write a reply..."
          />
        </div>
      )}
      
      {comments.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id}>
              {activeComment?.id === comment._id && activeComment?.type === 'editing' ? (
                <CommentForm
                  onSubmit={handleUpdate}
                  initialValue={activeComment.content}
                  isEditing
                  onCancel={() => setActiveComment(null)}
                />
              ) : (
                <CommentItem 
                  comment={comment}
                  onReply={handleReply}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onLike={handleLike}
                />
              )}
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  loading
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {loading ? 'Loading...' : 'Load more comments'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection; 