// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // تأكد من أن الرابط في MONGO_URI صحيح ويحتوي على بيانات الاعتماد
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        
        // رسالة إضافية للمساعدة في التشخيص
        console.error('*** يرجى التحقق من صحة MONGO_URI وصلاحية عنوان IP في MongoDB Atlas Network Access. ***');
        
        process.exit(1); // إنهاء العملية في حالة الفشل
    }
};

module.exports = connectDB;