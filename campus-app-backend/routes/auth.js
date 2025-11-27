const express = require('express');
const router = express.Router();
const { signup, login, changePassword, refreshToken } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);
router.post('/refresh', refreshToken);

module.exports = router;
