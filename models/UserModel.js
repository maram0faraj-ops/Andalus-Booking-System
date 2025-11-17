// models/UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الرجاء إدخال الاسم'],
    },
    email: {
        type: String,
        required: [true, 'الرجاء إدخال البريد الإلكتروني'],
        unique: true, // البريد الإلكتروني يجب أن يكون فريداً
    },
    password: {
        type: String,
        required: [true, 'الرجاء إدخال كلمة المرور'],
    },
    // الدور: Admin يستطيع رؤية كل الحجوزات، Teacher يرى حجوزاته فقط
    role: {
        type: String,
        enum: ['Admin', 'Teacher', 'General'], 
        default: 'Teacher',
    },
    phase: {
        type: String,
        required: [true, 'الرجاء تحديد المرحلة التابع لها المستخدم'],
    },
}, {
    timestamps: true,
});

// ********** دوال أمان (Hooks) **********

// 1. تشفير كلمة المرور قبل الحفظ (Pre-save hook)
userSchema.pre('save', async function (next) {
    // إذا لم تتغير كلمة المرور، انتقل للخطوة التالية
    if (!this.isModified('password')) {
        next();
    }
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 2. مقارنة كلمة المرور للدخول (Instance method)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 3. دالة لإنشاء رمز JWT (Instance method)
userSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // انتهاء صلاحية الرمز بعد 30 يوم
    });
};


const User = mongoose.model('User', userSchema);
module.exports = User;
