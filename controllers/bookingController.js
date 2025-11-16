// controllers/bookingController.js

const Booking = require('../models/BookingModel');
const { sendConfirmationEmail, sendAdminNotificationEmail } = require('../utils/emailService');

const generateReservationNumber = () => {
    return 'AND' + Math.floor(100000 + Math.random() * 900000).toString();
};

const createBooking = async (req, res) => {
    const { stageName, stagePhase, reservationDate, startTime, endTime, reserverName, reserverEmail, details } = req.body;

    if (!stageName || !reservationDate || !startTime || !endTime || !stagePhase) {
         return res.status(400).json({ message: 'الرجاء إدخال كافة الحقول المطلوبة للحجز.' });
    }

    try {
        // 1. التحقق من التداخل (المنطق لم يتغير)
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
                // رسالة الخطأ المحدثة
                details: `عفواً، ${stageName} محجوز بتاريخ ${new Date(reservationDate).toLocaleDateString('ar-EG')} للمرحلة: ${overlappingBooking.stagePhase}.`
            });
        }

        // 3. إنشاء الحجز (المنطق لم يتغير)
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
            reservationNumber
        });

        // 4. إرسال الإيميلات (المنطق لم يتغير)
        sendConfirmationEmail(reserverEmail, booking);
        sendAdminNotificationEmail(booking);

        res.status(201).json({
            message: 'تم الحجز بنجاح!',
            bookingId: booking._id,
            reservationNumber: booking.reservationNumber
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم أثناء عملية الحجز.', error: error.message });
    }
};

const getAllBookings = async (req, res) => {
    // جلب كل الحجوزات (بدون تغيير)
    try {
        const bookings = await Booking.find().sort({ reservationDate: 1, startTime: 1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

module.exports = {
    createBooking,
    getAllBookings
};