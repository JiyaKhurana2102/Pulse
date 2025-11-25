const express = require('express');
const router = express.Router();
const { createGroup, listGroups, joinGroup } = require('../controllers/groupController');

// List all groups
router.get('/', listGroups);

// Create a new group
router.post('/', createGroup);

// Add user to a group
router.post('/:id/join', joinGroup);

router.post('/:groupId/join', joinGroup);


module.exports = router;
