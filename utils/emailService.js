// utils/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // أو الخدمة التي اخترتها
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendConfirmationEmail = (toEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: `✅ تأكيد حجز قاعة الأندلس رقم ${bookingDetails.reservationNumber}`,
        html: `
            <h3>تم تأكيد حجزك بنجاح!</h3>
            <p><strong>رقم الحجز:</strong> ${bookingDetails.reservationNumber}</p>
            <p><strong>القاعة:</strong> ${bookingDetails.stageName}</p>
            <p><strong>التاريخ:</strong> ${new Date(bookingDetails.reservationDate).toLocaleDateString('ar-EG')}</p>
            <p><strong>الوقت:</strong> من ${bookingDetails.startTime} إلى ${bookingDetails.endTime}</p>
            <p><strong>المرحلة الطالبة:</strong> ${bookingDetails.stagePhase}</p>
            <hr>
            <p>شكراً لتعاونكم.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending confirmation email:', error);
        } else {
            console.log('Confirmation email sent:', info.response);
        }
    });
};

const sendAdminNotificationEmail = (bookingDetails) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `🔔 حجز قاعة جديد - رقم ${bookingDetails.reservationNumber}`,
        html: `
            <h3>تفاصيل الحجز الجديد</h3>
            <ul>
                <li><strong>رقم الحجز:</strong> ${bookingDetails.reservationNumber}</li>
                <li><strong>القاعة:</strong> ${bookingDetails.stageName}</li>
                <li><strong>التاريخ:</strong> ${new Date(bookingDetails.reservationDate).toLocaleDateString('ar-EG')}</li>
                <li><strong>الوقت:</strong> من ${bookingDetails.startTime} إلى ${bookingDetails.endTime}</li>
                <li><strong>المرحلة:</strong> ${bookingDetails.stagePhase}</li>
                <li><strong>المدخل:</strong> ${bookingDetails.reserverName} (${bookingDetails.reserverEmail})</li>
                <li><strong>الغرض:</strong> ${bookingDetails.details || 'لا يوجد'}</li>
            </ul>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending admin email:', error);
        } else {
            console.log('Admin notification email sent:', info.response);
        }
    });
};

module.exports = {
    sendConfirmationEmail,
    sendAdminNotificationEmail
};