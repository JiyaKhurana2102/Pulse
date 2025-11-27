const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbotController');

// Simple campus guide chatbot
router.post('/', handleChat);

module.exports = router;