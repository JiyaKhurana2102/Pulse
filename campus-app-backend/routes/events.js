const express = require('express');
const router = express.Router();

// Import controllers
const {
  createEvent,
  listEventsInGroup,
  rsvpEvent
} = require('../controllers/eventController');

// Create a new event
router.post('/', createEvent);

// List all events in a group
router.get('/group/:id', listEventsInGroup);

// RSVP to an event
router.post('/:id/rsvp', rsvpEvent);

module.exports = router;
