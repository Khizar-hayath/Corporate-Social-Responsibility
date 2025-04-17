# Seed Scripts

This directory contains scripts to seed the database with sample data.

## Available Scripts

### seedComments.js

This script populates the database with 20 sample comments spread across all projects. Some comments will have replies and likes.

#### How to Run

From the project root:
```bash
npm run seed:comments
```

From the backend directory:
```bash
npm run seed:comments
```

#### What it does

1. Connects to the MongoDB database specified in your `.env` file
2. Retrieves all projects from the database
3. Retrieves some users to associate with authenticated comments
4. Creates 20 random comments distributed across the projects
5. Adds likes to some comments
6. Adds replies to approximately 30% of the comments

#### Requirements

- The database must already contain projects
- The database should have some user accounts for associating comments with authenticated users
- Your `.env` file must be properly configured with the MongoDB connection string

#### Customization

You can modify the script to:
- Change the number of comments generated
- Adjust the likelihood of replies and likes
- Add more sample comment content
- Change the distribution of comments across projects 