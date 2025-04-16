import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function CommentForm({ 
  onSubmit, 
  initialValue = '', 
  isEditing = false, 
  onCancel,
  parentId = null,
  placeholder = 'Add a comment...'
}) {
  const [content, setContent] = useState(initialValue);
  const { user, isAuthenticated } = useAuth();
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    setContent(initialValue);
    setCharCount(initialValue.length);
  }, [initialValue]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= maxChars) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  const handleAuthorChange = (e) => {
    setAuthorName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    // Use user name if logged in, otherwise use the entered author name
    const author = isAuthenticated ? (user?.name || 'Anonymous') : (authorName || 'Anonymous');
    
    onSubmit({
      content: content.trim(),
      parentId,
      author: author,
      userId: user?._id,
    });
    
    // Only clear if not editing
    if (!isEditing) {
      setContent('');
      setCharCount(0);
      setAuthorName('');
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="mb-2">
        {isEditing ? (
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Edit your comment
            </h3>
            <button 
              type="button"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiX />
            </button>
          </div>
        ) : parentId && (
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Reply to comment
          </h3>
        )}

        {/* Author input field for anonymous users */}
        {!isAuthenticated && !isEditing && (
          <div className="mb-3">
            <input
              type="text"
              value={authorName}
              onChange={handleAuthorChange}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        )}

        <textarea
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          autoFocus={isEditing}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {charCount}/{maxChars} characters
        </div>
        
        <div className="flex space-x-2">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={!content.trim()}
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
              content.trim() 
                ? 'bg-primary-600 hover:bg-primary-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend className="mr-1" />
            {isEditing ? 'Update' : parentId ? 'Reply' : 'Comment'}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default CommentForm; 