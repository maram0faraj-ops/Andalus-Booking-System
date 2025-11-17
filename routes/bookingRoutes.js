// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings } = require('../controllers/bookingController');

// يجب التأكد من صحة المسار واسم الملف هنا:
// إذا كان الملف هو auth.js، فالاستدعاء صحيح
const { protect, admin } = require('../middleware/auth'); 

// ... باقي المسارات ...

// 2. مسار جلب الحجوزات: يتطلب مصادقة (JWT)
// منطق التصفية (Admin/Teacher) يتم تنفيذه داخل getAllBookings
router.get('/', protect, getAllBookings); 

module.exports = router;