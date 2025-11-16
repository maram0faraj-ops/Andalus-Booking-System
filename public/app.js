// public/app.js - منطق إرسال النموذج

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const messageArea = document.getElementById('message-area');
    
    // دالة لعرض الرسائل باستخدام فئات Bootstrap Alerts
    const displayMessage = (message, isError = false, isInfo = false) => {
        messageArea.textContent = message;
        messageArea.classList.remove('alert-success', 'alert-danger', 'alert-info');
        
        if (isError) {
            messageArea.classList.add('alert-danger');
        } else if (isInfo) {
            messageArea.classList.add('alert-info');
        } else {
            messageArea.classList.add('alert-success');
        }
        
        messageArea.style.display = 'block';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // التحقق الأساسي من الأوقات
        if (data.startTime >= data.endTime) {
            return displayMessage('خطأ: وقت البدء يجب أن يكون قبل وقت الانتهاء.', true);
        }

        // عرض رسالة تحميل/معلومات أثناء الإرسال
        displayMessage('... جاري إرسال طلب الحجز ...', false, true);
        
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // نجاح الحجز
                displayMessage(`✅ ${result.message} رقم حجزك هو: ${result.reservationNumber}. سيصلك بريد تأكيد.`);
                form.reset(); 
            } else {
                // فشل الحجز (بسبب تداخل أو خطأ في الخادم)
                displayMessage(`❌ خطأ في الحجز: ${result.details || result.message}`, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            displayMessage('❌ حدث خطأ غير متوقع أثناء الاتصال بالخادم.', true);
        }
    });
});