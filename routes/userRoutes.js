// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth'); // استيراد دالة الحماية

// مسارات عامة (غير محمية)
router.post('/register', registerUser);
router.post('/login', authUser);

// مسارات محمية (لجلب ملف المستخدم الشخصي)
router.get('/profile', protect, getUserProfile); 

module.exports = router;