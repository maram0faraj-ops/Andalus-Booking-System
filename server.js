// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // لتمكين تحليل طلبات JSON
app.use(cors()); // لتمكين CORS

// ربط المسارات
app.use('/api/bookings', require('./routes/bookingRoutes'));
// server.js (تأكد من هذا السطر)
app.use('/api/users', require('./routes/userRoutes'));
// تقديم الملفات الثابتة (الواجهة الأمامية)
app.use(express.static(path.join(__dirname, 'public')));

// مسار Fallback لتقديم صفحة الحجز الرئيسية (index.html)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));