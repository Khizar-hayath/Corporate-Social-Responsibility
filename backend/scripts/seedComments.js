const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const User = require('../models/User');
require('dotenv').config();

// Sample comment content
const commentContents = [
  "This project is exactly what our community needs right now!",
  "I'm excited to see how this initiative develops. Keep up the great work!",
  "Have you considered partnering with local schools for this project?",
  "The impact this could have on vulnerable populations is tremendous.",
  "I volunteered for a similar project last year and the results were amazing.",
  "How can individuals like me contribute to this cause beyond donations?",
  "The timeline seems ambitious, but I believe in your team's capability to deliver.",
  "This approach to the issue is innovative and refreshing.",
  "Will there be opportunities for remote volunteering?",
  "The focus on sustainability is what makes this project stand out.",
  "I appreciate the transparency in how funds will be allocated.",
  "Are you planning to expand this to other regions if successful?",
  "As someone who has benefited from similar programs, I can attest to their value.",
  "The educational component of this project is particularly important.",
  "Looking forward to attending the upcoming event related to this initiative!",
  "Have you considered applying for grants from the Green Foundation?",
  "The collaboration with other organizations will strengthen this project significantly.",
  "I'd like to offer my professional expertise to help with the technical aspects.",
  "How are you measuring the success and impact of this project?",
  "This project addresses a gap that has been overlooked for too long.",
  "The community engagement strategy is well thought out.",
  "I appreciate how inclusive this initiative is designed to be.",
  "Will there be regular updates on the progress?",
  "This could be a model for other communities facing similar challenges.",
  "I shared this with my network and everyone is excited about it!"
];

// Sample user names for anonymous comments
const anonymousNames = [
  "Community Member",
  "Interested Citizen",
  "Local Volunteer",
  "Sustainability Advocate",
  "Education Supporter",
  "Green Initiatives Fan",
  "Social Impact Enthusiast",
  "Healthcare Professional",
  "Tech for Good Supporter",
  "Small Business Owner"
];

// Function to get a random item from an array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Function to get a random date within the last 30 days
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
};

// Main seeding function
async function seedComments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all projects
    const projects = await Project.find();
    if (projects.length === 0) {
      console.log('No projects found. Please seed projects first.');
      process.exit(1);
    }

    // Get some users for authenticated comments
    const users = await User.find().limit(5);

    // Delete existing comments
    await Comment.deleteMany({});
    console.log('Existing comments deleted');

    const comments = [];
    
    // Create 20 random comments
    for (let i = 0; i < 20; i++) {
      // Decide if it's an authenticated comment (70% chance) or anonymous
      const isAuthenticated = Math.random() < 0.7;
      
      // Select a random project
      const project = getRandomItem(projects);
      
      // Create base comment
      const comment = new Comment({
        projectId: project._id,
        content: getRandomItem(commentContents),
        author: isAuthenticated ? (users.length > 0 ? getRandomItem(users).name : 'Registered User') : getRandomItem(anonymousNames),
        userId: isAuthenticated && users.length > 0 ? getRandomItem(users)._id : null,
        createdAt: getRandomDate(),
        updatedAt: getRandomDate()
      });
      
      // Randomly decide if it should have likes (50% chance)
      if (Math.random() < 0.5) {
        const likeCount = Math.floor(Math.random() * 10) + 1;
        comment.likes = likeCount;
        
        // Add random users who liked it
        if (users.length > 0) {
          const likedByUsers = [];
          for (let j = 0; j < Math.min(likeCount, users.length); j++) {
            const randomUser = getRandomItem(users);
            if (!likedByUsers.includes(randomUser._id)) {
              likedByUsers.push(randomUser._id);
            }
          }
          comment.likedBy = likedByUsers;
        }
      }
      
      await comment.save();
      comments.push(comment);
      console.log(`Comment ${i+1} created for project: ${project.title}`);
    }
    
    // Add replies to some comments (30% chance)
    for (const comment of comments) {
      if (Math.random() < 0.3) {
        // Create 1-2 replies
        const replyCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < replyCount; i++) {
          const isAuthenticatedReply = Math.random() < 0.7;
          
          const reply = new Comment({
            projectId: comment.projectId,
            content: getRandomItem(commentContents),
            author: isAuthenticatedReply ? (users.length > 0 ? getRandomItem(users).name : 'Registered User') : getRandomItem(anonymousNames),
            userId: isAuthenticatedReply && users.length > 0 ? getRandomItem(users)._id : null,
            parentId: comment._id,
            createdAt: new Date(Math.max(comment.createdAt.getTime() + 1000, getRandomDate().getTime())),
            updatedAt: new Date(Math.max(comment.createdAt.getTime() + 1000, getRandomDate().getTime()))
          });
          
          await reply.save();
          console.log(`Reply created for comment: ${comment._id}`);
        }
      }
    }

    console.log('Comment seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding comments:', error);
    process.exit(1);
  }
}

// Run the seed function
seedComments(); 