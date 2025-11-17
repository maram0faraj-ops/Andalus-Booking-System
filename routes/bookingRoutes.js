// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings } = require('../controllers/bookingController');
// استيراد دوال الحماية الجديدة
const { protect, admin } = require('../middleware/auth'); 

// 1. مسار الحجز: يتطلب مصادقة (JWT)
// يمكن لجميع المستخدمين المسجلين إجراء حجز
router.post('/', protect, createBooking);

// 2. مسار جلب الحجوزات: يتطلب مصادقة (JWT)
// منطق التصفية (Admin/Teacher) يتم تنفيذه داخل getAllBookings
router.get('/', protect, getAllBookings); 

module.exports = router;