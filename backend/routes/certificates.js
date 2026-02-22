const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Validate a certificate code for a specific project
router.post('/validate', async (req, res) => {
  try {
    const { code, projectId, name } = req.body;
    
    // Validation
    if (!code || !projectId || !name) {
      return res.status(400).json({ 
        message: 'Please provide a certificate code, project ID, and your name' 
      });
    }
    
    if (code.length !== 5) {
      return res.status(400).json({ message: 'Certificate code must be 5 characters' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if certificate code is valid
    const certificate = await Certificate.findOne({ 
      code, 
      projectId,
      used: false 
    });
    
    if (!certificate) {
      return res.status(404).json({ 
        message: 'Invalid or already used certificate code' 
      });
    }
    
    // Certificate is valid, return success
    res.json({ 
      valid: true,
      projectTitle: project.title,
      message: 'Certificate code is valid. You can now download your certificate.'
    });
  } catch (err) {
    console.error('Error validating certificate:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim a certificate (mark as used)
router.post('/claim', async (req, res) => {
  try {
    const { code, projectId, name } = req.body;
    
    // Validation
    if (!code || !projectId || !name) {
      return res.status(400).json({ 
        message: 'Please provide a certificate code, project ID, and your name' 
      });
    }
    
    // Check if certificate code is valid
    const certificate = await Certificate.findOne({ 
      code, 
      projectId,
      used: false 
    });
    
    if (!certificate) {
      return res.status(404).json({ 
        message: 'Invalid or already used certificate code' 
      });
    }
    
    // Mark certificate as used
    certificate.used = true;
    certificate.claimedBy = name;
    certificate.claimedAt = Date.now();
    await certificate.save();
    
    // Get project details for the certificate
    const project = await Project.findById(projectId);
    
    res.json({ 
      success: true,
      certificate: {
        name: name,
        projectTitle: project.title,
        projectOrganization: project.organization || 'CSR Platform',
        date: new Date().toLocaleDateString(),
        code: code
      },
      message: 'Certificate claimed successfully'
    });
  } catch (err) {
    console.error('Error claiming certificate:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create a new certificate code for a project (requires admin access)
router.post('/', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const { projectId, count = 1 } = req.body;
    
    // Validation
    if (!projectId) {
      return res.status(400).json({ message: 'Please provide a project ID' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Generate X number of certificate codes
    const certificates = [];
    for (let i = 0; i < count; i++) {
      // Generate a random 5-character code
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      
      // Create new certificate
      const certificate = new Certificate({
        code,
        projectId
      });
      
      await certificate.save();
      certificates.push(certificate);
    }
    
    res.status(201).json({ 
      success: true,
      certificates,
      message: `${count} certificate code${count > 1 ? 's' : ''} created successfully`
    });
  } catch (err) {
    console.error('Error creating certificate:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all certificates for a project (requires admin access)
router.get('/project/:projectId', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get all certificates for the project
    const certificates = await Certificate.find({ projectId });
    
    res.json(certificates);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 