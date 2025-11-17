// models/BookingModel.js (التحديث الكامل لنظام المستخدمين المتعددين)

const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    // حقل فريد لكل حجز
    reservationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    // اسم القاعة المحجوزة
    stageName: {
        type: String,
        required: true,
    },
    // التاريخ والوقت
    reservationDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    // تفاصيل الحجز
    stagePhase: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    
    // ********** حقول ربط المستخدم **********
    
    // يمثل المستخدم الذي قام بإنشاء هذا الحجز (المُرسِل)
    user: {
        type: mongoose.Schema.Types.ObjectId, // نوع يربط بين نموذجين
        required: true,
        ref: 'User', // يشير إلى اسم النموذج الذي أنشأناه في UserModel.js
    },
    
    // نحتفظ بهذه الحقول لتسهيل الإشعارات، لكن يمكن جلبها من نموذج المستخدم
    // تم الاحتفاظ بها لتتوافق مع نظام الإشعارات الحالي.
    reserverName: {
        type: String,
        required: true,
    },
    reserverEmail: {
        type: String,
        required: true,
    },
    
    // **************************************
    
    // حالة الموافقة
    isApproved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // لإضافة حقلي createdAt و updatedAt
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;