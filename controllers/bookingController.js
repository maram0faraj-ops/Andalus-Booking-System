// controllers/bookingController.js

const Booking = require('../models/BookingModel');
const User = require('../models/UserModel'); // نحتاجه لجلب اسم الإداري
const { sendConfirmationEmail, sendAdminNotificationEmail } = require('../utils/emailService');

const generateReservationNumber = () => {
    return 'AND' + Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @desc حجز قاعة جديدة
 * @route POST /api/bookings
 * @access Protected
 */
const createBooking = async (req, res) => {
    // تم إضافة حقل user إلى الطلب بواسطة دالة protect
    const userId = req.user._id; 
    const { stageName, reservationDate, startTime, endTime, details } = req.body;
    
    // جلب بيانات المستخدم كاملة من قاعدة البيانات
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'المستخدم الذي يحاول الحجز غير موجود.' });
    }

    // نستخدم بيانات المستخدم بدلاً من الحقول النصية (phase, name, email)
    const stagePhase = user.phase;
    const reserverName = user.name;
    const reserverEmail = user.email;

    // 1. التحقق من التداخل
    try {
        const existingBookings = await Booking.find({
            stageName,
            reservationDate: new Date(reservationDate)
        });

        const newStart = startTime; 
        const newEnd = endTime;     

        const overlappingBooking = existingBookings.find(booking => {
            const existingStart = booking.startTime;
            const existingEnd = booking.endTime;

            return (newStart < existingEnd && newEnd > existingStart);
        });

        // 2. الرفض إذا وُجد تداخل
        if (overlappingBooking) {
            return res.status(400).json({
                message: `الموقع محجوز مسبقًا!`,
                details: `عفواً، ${stageName} محجوز بتاريخ ${new Date(reservationDate).toLocaleDateString('ar-EG')} للمرحلة: ${overlappingBooking.stagePhase}.`
            });
        }

        // 3. إنشاء الحجز
        const reservationNumber = generateReservationNumber();

        const booking = await Booking.create({
            stageName,
            stagePhase,
            reservationDate: new Date(reservationDate),
            startTime,
            endTime,
            reserverName,
            reserverEmail,
            details,
            reservationNumber,
            user: userId // ربط الحجز بالـ user ID
        });

        // 4. إرسال الإيميلات
        sendConfirmationEmail(reserverEmail, booking);
        sendAdminNotificationEmail(booking);

        res.status(201).json({
            message: 'تم الحجز بنجاح!',
            reservationNumber: booking.reservationNumber
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم أثناء عملية الحجز.', error: error.message });
    }
};

/**
 * @desc جلب جميع الحجوزات أو حجوزات المستخدم
 * @route GET /api/bookings
 * @access Protected (Admin/Teacher)
 */
const getAllBookings = async (req, res) => {
    // 1. تحديد شروط البحث
    let filter = {};
    
    // إذا كان الدور ليس Admin، يتم تصفية الحجوزات حسب المستخدم الحالي
    if (req.user.role !== 'Admin') {
        filter = { user: req.user._id };
    }

    try {
        // 2. جلب الحجوزات بناءً على الفلتر
        const bookings = await Booking.find(filter)
            .sort({ reservationDate: 1, startTime: 1 })
            .populate('user', 'name email'); // جلب اسم وبريد المستخدم من نموذج User

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// ... يمكنك إضافة دالة للحذف أو التعديل هنا

module.exports = {
    createBooking,
    getAllBookings
};