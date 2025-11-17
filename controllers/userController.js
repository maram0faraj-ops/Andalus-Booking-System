// controllers/userController.js

const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// دالة مساعدة لإنشاء وإرسال الرمز المميز (JWT)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', 
    });
};

/**
 * @desc تسجيل مستخدم جديد
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = async (req, res) => {
    const { name, email, password, role, phase } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'هذا المستخدم مسجل مسبقاً.' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password, 
            role,
            phase,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), 
        });
    } catch (error) {
        // إذا كان هناك خطأ في التحقق من صحة البيانات (validation error) من MongoDB
        res.status(500).json({ message: 'فشل في عملية التسجيل.', error: error.message });
    }
};

/**
 * @desc مصادقة المستخدم والحصول على رمز JWT
 * @route POST /api/users/login
 * @access Public
 */
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // التحقق من وجود المستخدم وصحة كلمة المرور
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phase: user.phase,
            token: generateToken(user._id), 
        });
    } else {
        res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }
};

/**
 * @desc جلب معلومات المستخدم الحالي
 * @route GET /api/users/profile
 * @access Protected
 */
const getUserProfile = async (req, res) => {
    // req.user تم تعريفه بواسطة دالة 'protect'
    res.json(req.user);
};


module.exports = { authUser, registerUser, getUserProfile };