// public/app.js - منطق إرسال النموذج

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const messageArea = document.getElementById('message-area');
    
    const displayMessage = (message, isError = false) => {
        messageArea.textContent = message;
        messageArea.style.backgroundColor = isError ? '#fdd' : '#dfd';
        messageArea.style.color = isError ? 'red' : 'green';
        messageArea.style.display = 'block';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.startTime >= data.endTime) {
            return displayMessage('خطأ: وقت البدء يجب أن يكون قبل وقت الانتهاء.', true);
        }

        // إخفاء الرسائل القديمة أثناء الإرسال
        displayMessage('... جاري إرسال طلب الحجز ...', false);
        messageArea.style.backgroundColor = '#ffc';
        messageArea.style.color = '#333';
        
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(`✅ ${result.message} رقم حجزك هو: ${result.reservationNumber}. سيصلك بريد تأكيد.`);
                form.reset(); 
            } else {
                // رسالة الرفض في حالة التداخل
                displayMessage(`❌ خطأ في الحجز: ${result.details || result.message}`, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            displayMessage('❌ حدث خطأ غير متوقع أثناء الاتصال بالخادم.', true);
        }
    });
});