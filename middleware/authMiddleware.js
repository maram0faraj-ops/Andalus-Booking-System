// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); 

/**
 * @desc دالة وسيطة لحماية المسارات والتحقق من صلاحية رمز JWT
 * @access Protected
 */
const protect = async (req, res, next) => {
    let token;

    // 1. التحقق مما إذا كان رمز JWT موجودًا في رأس الطلب (Authorization: Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // استخراج الرمز (Token) من السلسلة (مثلاً: "Bearer eyJhbGc...")
            token = req.headers.authorization.split(' ')[1];

            // 2. التحقق من صلاحية الرمز وتوقيعه باستخدام JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. البحث عن المستخدم وإرفاقه بطلب (Request)
            // نبحث عن المستخدم باستخدام ID الموجود في الرمز ونستبعد كلمة المرور
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'المستخدم غير موجود أو غير صالح' });
            }

            next(); // الرمز صحيح والمستخدم موجود، انتقل للدالة التالية
        } catch (error) {
            console.error('JWT Error:', error);
            // فشل التحقق من الرمز (مثل انتهاء الصلاحية أو التوقيع غير صحيح)
            return res.status(401).json({ message: 'غير مصرح لك بالدخول، الرمز غير صالح أو منتهي الصلاحية' });
        }
    }

    if (!token) {
        // لا يوجد رمز مصادقة في رأس الطلب
        return res.status(401).json({ message: 'غير مصرح لك بالدخول، لا يوجد رمز مصادقة (Token)' });
    }
};

/**
 * @desc دالة وسيطة للتحقق من دور المستخدم (Admin Role)
 * @access Restricted to Admin
 */
const admin = (req, res, next) => {
    // هذه الدالة تعمل فقط بعد نجاح دالة 'protect'
    if (req.user && req.user.role === 'Admin') {
        next(); // المستخدم لديه دور "Admin"، اسمح بالوصول
    } else {
        // المستخدم لديه دور "Teacher" أو "General"
        res.status(403).json({ message: 'صلاحيات محدودة، هذه المنطقة للمدير فقط' });
    }
};

module.exports = { protect, admin };