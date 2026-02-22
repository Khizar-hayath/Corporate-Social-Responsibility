import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiThumbsUp, FiMessageSquare, FiMoreVertical, FiTrash2, FiEdit, FiFlag } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

function CommentItem({ comment, onReply, onDelete, onEdit, onLike }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showReplies, setShowReplies] = useState(true); // Default to showing replies
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuth();
  
  const isAuthor = user && user._id === comment.userId;
  const isAdmin = user && user.userType === 'admin';
  const canModify = isAuthor || isAdmin;

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  
  // For debugging
  console.log('Comment:', comment._id, 'Replies:', comment.replies ? comment.replies.length : 0);

  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 mb-4"
    >
      <div className="flex justify-between">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-primary-500 flex items-center justify-center text-white font-semibold mr-2">
            {comment.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{comment.author}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          {isAuthor && (
            <button 
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 mr-2"
              title="Delete comment"
            >
              <FiTrash2 />
            </button>
          )}
          
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FiMoreVertical />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 z-10 border border-gray-200 dark:border-gray-700">
              {canModify && (
                <>
                  <button 
                    onClick={() => {
                      onEdit(comment);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                  <button 
                    onClick={() => {
                      onDelete(comment._id);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FiTrash2 className="mr-2" /> Delete
                  </button>
                </>
              )}
              {!canModify && (
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => setShowOptions(false)}
                >
                  <FiFlag className="mr-2" /> Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-gray-800 dark:text-gray-200 mt-1 mb-3">
        {comment.content}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <button 
            onClick={() => onLike(comment._id)}
            className={`flex items-center mr-4 ${
              comment.liked ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
            } hover:text-primary-600 transition-colors`}
          >
            <FiThumbsUp className="mr-1" /> 
            <span>{comment.likes || 0}</span>
          </button>
          
          <button 
            onClick={() => onReply(comment)}
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
          >
            <FiMessageSquare className="mr-1" /> 
            Reply {hasReplies && `(${comment.replies.length})`}
          </button>
          
          {hasReplies && (
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="ml-4 text-sm text-primary-600 hover:text-primary-700"
            >
              {showReplies ? 'Hide replies' : 'Show replies'}
            </button>
          )}
        </div>
      </div>
      
      {hasReplies && showReplies && (
        <div className="ml-8 mt-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default CommentItem; 