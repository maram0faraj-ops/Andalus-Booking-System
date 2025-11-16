// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
// استيراد دوال التحكم (Controllers)
const { createBooking, getAllBookings } = require('../controllers/bookingController');
// استيراد دالة الحماية من ملف middleware/authMiddleware.js
const { protectAdmin } = require('../middleware/authMiddleware'); 

// 1. المسار العام: لإنشاء حجز جديد (POST /api/bookings)
// لا يحتاج لحماية، يمكن لأي مستخدم الوصول إليه لطلب حجز.
router.post('/', createBooking);

// 2. المسار الخاص بالمدير: لجلب كل الحجوزات (GET /api/bookings)
// نطبق دالة protectAdmin أولاً. إذا كان المفتاح السري صحيحًا، ينتقل الطلب إلى getAllBookings.
router.get('/', protectAdmin, getAllBookings); 

module.exports = router;