// middleware/authMiddleware.js

const protectAdmin = (req, res, next) => {
    // 1. المفتاح يُرسل عادةً في رأس (Header) الطلب باسم 'Authorization' أو 'X-Admin-Key'
    const adminKey = req.headers['x-admin-key'];

    // 2. التحقق من وجود المفتاح ومطابقته للمفتاح السري في .env
    if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
        // المفتاح صحيح، انتقل للمسار التالي (جلب البيانات)
        next();
    } else {
        // المفتاح غير موجود أو غير صحيح
        res.status(401).json({ 
            message: 'غير مصرح لك بالوصول إلى لوحة التحكم.', 
            error: 'Authentication failed' 
        });
    }
};

module.exports = { protectAdmin };