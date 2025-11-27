const express = require('express');
const router = express.Router();
const { createGroup, listGroups, joinGroup, leaveGroup, sendMessage, getMessages } = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/authMiddleware');

// List all groups
router.get('/', listGroups);

// Create a new group
router.post('/', createGroup);

// Add user to a group
router.post('/:id/join', joinGroup);

// Leave a group (require authentication)
router.post('/:id/leave', authMiddleware, leaveGroup);

// Group messages (require authentication)
router.post('/:id/messages', authMiddleware, sendMessage);
router.get('/:id/messages', authMiddleware, getMessages);

module.exports = router;
