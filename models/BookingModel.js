// models/BookingModel.js

const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    stageName: { 
        type: String,
        required: [true, 'Stage name is required'],
        // قائمة القاعات المحدثة
        enum: ['المسرح', 'مصادر التعلم', 'قاعة بلنسية', 'الصالة الرياضية بنين', 'الصالة الرياضية بنات']
    },
    stagePhase: { 
        type: String,
        required: [true, 'Phase is required'],
        // قائمة المراحل المحدثة (التي ستظهر في القائمة المنسدلة)
        enum: ['رياض أطفال', 'طفولة مبكرة', 'ابتدائي عليا', 'المتوسط', 'الثانوي', 'الإدارة العامة']
    },
    reservationDate: { 
        type: Date,
        required: [true, 'Reservation date is required'],
    },
    startTime: { 
        type: String,
        required: [true, 'Start time is required'],
    },
    endTime: { 
        type: String,
        required: [true, 'End time is required'],
    },
    reserverName: {
        type: String,
        required: [true, 'Reserver name is required'],
    },
    reserverEmail: {
        type: String,
        required: [true, 'Reserver email is required'],
    },
    details: {
        type: String,
    },
    reservationNumber: {
        type: String,
        unique: true
    }
}, {
    timestamps: true, 
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;