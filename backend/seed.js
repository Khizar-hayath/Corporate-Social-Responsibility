const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('./models/News');
const Project = require('./models/Project');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Sample news data
const sampleNews = [
  {
    title: 'New Community Development Program Launched',
    excerpt: 'We are excited to announce the launch of our new community development program...',
    content: 'Our new community development program aims to empower local communities through education, healthcare, and sustainable development initiatives. The program will focus on creating lasting impact through partnerships with local organizations and community leaders.',
    category: 'press',
    author: 'John Doe',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Community', 'Development', 'Program'],
    date: new Date()
  },
  {
    title: 'Impact Report: 2023 Achievements',
    excerpt: 'Our annual impact report highlights the significant progress made in 2023...',
    content: 'The 2023 Impact Report showcases our achievements across various sectors including education, healthcare, and environmental conservation. We are proud to have reached over 10,000 beneficiaries through our programs.',
    category: 'updates',
    author: 'Jane Smith',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Report', 'Impact', '2023'],
    date: new Date()
  },
  {
    title: 'Success Story: Local School Transformation',
    excerpt: 'How our education initiative helped transform a local school...',
    content: 'Through our education initiative, we have successfully transformed a local school by providing modern facilities, teacher training, and educational resources. The school has seen a 50% improvement in student performance.',
    category: 'stories',
    author: 'Mike Johnson',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Education', 'Success', 'School'],
    date: new Date()
  },
  {
    title: 'Volunteer Spotlight: Making a Difference',
    excerpt: 'Meet our dedicated volunteers who are making a real impact in communities...',
    content: 'Our volunteers are the backbone of our organization, dedicating their time and skills to various projects. This month, we highlight the contributions of Sarah Williams, who has been volunteering with us for over 5 years, focusing on environmental conservation projects.',
    category: 'stories',
    author: 'Emily Brown',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Volunteers', 'Spotlight', 'Community'],
    date: new Date()
  },
  {
    title: 'Partnership Announcement: Global Health Initiative',
    excerpt: 'We are proud to announce a new partnership to improve global health outcomes...',
    content: 'Our organization has partnered with the Global Health Foundation to launch a new initiative aimed at improving healthcare access in underserved communities. This partnership will leverage our combined resources and expertise to create sustainable health solutions.',
    category: 'press',
    author: 'David Wilson',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Partnership', 'Health', 'Global'],
    date: new Date()
  },
  {
    title: 'Environmental Conservation: Our Commitment',
    excerpt: 'Learn about our ongoing efforts to protect and preserve natural ecosystems...',
    content: 'Environmental conservation is a core part of our mission. Our team has been working tirelessly to protect endangered species, restore damaged ecosystems, and promote sustainable practices in communities we serve. This year alone, we have planted over 50,000 trees and established 10 new protected areas.',
    category: 'updates',
    author: 'Lisa Chen',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Environment', 'Conservation', 'Sustainability'],
    date: new Date()
  }
];

// Connect to MongoDB and seed data
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await News.deleteMany({});
    console.log('Cleared existing news data');
    
    await Project.deleteMany({});
    console.log('Cleared existing project data');
    
    // Create a dummy NGO user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const ngoUser = await User.create({
      email: 'ngo@example.com',
      password: hashedPassword,
      name: 'NGO Admin',
      organization: 'Global Impact NGO',
      userType: 'ngo'
    });
    console.log('Created dummy NGO user');
    
    // Create a dummy company user
    const companyUser = await User.create({
      email: 'company@example.com',
      password: hashedPassword,
      name: 'Company Admin',
      organization: 'Tech Solutions Inc',
      userType: 'company'
    });
    console.log('Created dummy company user');
    
    // Sample project data with createdBy field
    const sampleProjects = [
      {
        title: 'Clean Water Initiative',
        description: 'Providing access to clean and safe drinking water in rural communities through the installation of water filtration systems and wells.',
        category: 'health',
        status: 'Active',
        location: 'Rural villages in Sub-Saharan Africa',
        impact: '10,000+ beneficiaries',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Water', 'Health', 'Rural Development'],
        startDate: new Date('2023-01-15'),
        endDate: new Date('2024-12-31'),
        budget: 250000,
        createdBy: ngoUser._id
      },
      {
        title: 'Education for All',
        description: 'Improving access to quality education for children in underserved communities through school construction, teacher training, and educational resource provision.',
        category: 'education',
        status: 'Active',
        location: 'Urban slums in South Asia',
        impact: '5,000+ students',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Education', 'Children', 'Urban Development'],
        startDate: new Date('2022-06-01'),
        endDate: new Date('2025-05-31'),
        budget: 500000,
        createdBy: ngoUser._id
      },
      {
        title: 'Forest Conservation Program',
        description: 'Protecting and restoring forest ecosystems through community engagement, reforestation efforts, and sustainable resource management practices.',
        category: 'environment',
        status: 'Active',
        location: 'Amazon Rainforest, South America',
        impact: '50,000+ acres protected',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Forest', 'Conservation', 'Climate Change'],
        startDate: new Date('2021-03-10'),
        endDate: new Date('2026-03-09'),
        budget: 1000000,
        createdBy: ngoUser._id
      },
      {
        title: 'Youth Empowerment Initiative',
        description: 'Empowering young people through skills training, mentorship, and entrepreneurship support to create sustainable livelihoods and community leadership.',
        category: 'community',
        status: 'Planned',
        location: 'Urban centers in East Africa',
        impact: '2,000+ youth participants',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Youth', 'Empowerment', 'Skills Training'],
        startDate: new Date('2023-09-01'),
        endDate: new Date('2025-08-31'),
        budget: 300000,
        createdBy: ngoUser._id
      },
      {
        title: 'Maternal Health Program',
        description: 'Improving maternal and neonatal health outcomes through healthcare provider training, facility upgrades, and community health education.',
        category: 'health',
        status: 'Completed',
        location: 'Rural communities in Southeast Asia',
        impact: '15,000+ mothers and newborns',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Health', 'Maternal Care', 'Women'],
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-12-31'),
        budget: 750000,
        createdBy: ngoUser._id
      },
      {
        title: 'Digital Literacy Campaign',
        description: 'Bridging the digital divide by providing computer access, internet connectivity, and digital skills training to underserved communities.',
        category: 'education',
        status: 'Active',
        location: 'Urban and rural communities worldwide',
        impact: '20,000+ participants',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Digital', 'Education', 'Technology'],
        startDate: new Date('2022-03-15'),
        endDate: new Date('2024-03-14'),
        budget: 400000,
        createdBy: ngoUser._id
      }
    ];
    
    // Insert sample data
    await News.insertMany(sampleNews);
    console.log('Seeded sample news data');
    
    await Project.insertMany(sampleProjects);
    console.log('Seeded sample project data');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 