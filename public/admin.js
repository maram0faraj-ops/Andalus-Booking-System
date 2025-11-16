// public/admin.js - منطق عرض البيانات للمدير

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#bookings-table tbody');
    const loadingMessage = document.getElementById('loading-message');
    const refreshButton = document.getElementById('refresh-button');

    // **ملاحظة أمان:** في تطبيق حقيقي، يجب أن يتم إدخال هذا المفتاح عبر نموذج Login، 
    // وليس تضمينه مباشرة في الكود. لكننا نستخدم هذه الطريقة لتبسيط مرحلة الاختبار.
    // يجب أن تتطابق هذه القيمة تماماً مع القيمة في ملف .env
    const ADMIN_KEY = "Andalus-Admin2025!"; 

    const fetchBookings = async () => {
        loadingMessage.textContent = '... جاري تحميل بيانات الحجوزات ...';
        loadingMessage.style.display = 'block';
        tableBody.innerHTML = ''; 

        try {
            const response = await fetch('/api/bookings', {
                method: 'GET',
                headers: {
                    // إضافة المفتاح السري المطلوب من قبل protectAdmin
                    'X-Admin-Key': ADMIN_KEY 
                }
            }); 
            
            const bookings = await response.json();

            loadingMessage.style.display = 'none';

            if (response.status === 401) {
                 // رسالة الخطأ في حالة فشل المصادقة
                 loadingMessage.style.color = 'red';
                 loadingMessage.textContent = `❌ خطأ في المصادقة (401): المفتاح السري غير صحيح. لا يمكن الوصول للوحة التحكم.`;
                 return;
            }

            if (bookings.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="10">لا توجد حجوزات حاليًا في النظام.</td></tr>';
                return;
            }

            bookings.forEach(booking => {
                const row = tableBody.insertRow();
                
                const date = new Date(booking.reservationDate).toLocaleDateString('ar-EG');
                const creationDate = new Date(booking.createdAt).toLocaleString('ar-EG');

                row.insertCell().textContent = booking.reservationNumber;
                row.insertCell().textContent = booking.stageName;
                row.insertCell().textContent = date;
                row.insertCell().textContent = booking.startTime;
                row.insertCell().textContent = booking.endTime;
                row.insertCell().textContent = booking.stagePhase;
                row.insertCell().textContent = booking.reserverName;
                row.insertCell().textContent = booking.reserverEmail;
                row.insertCell().textContent = booking.details || '-';
                row.insertCell().textContent = creationDate;
            });
        } catch (error) {
            loadingMessage.textContent = '❌ فشل الاتصال بالخادم أو جلب البيانات.';
            console.error('Fetch error:', error);
        }
    };

    refreshButton.addEventListener('click', fetchBookings);
    
    // جلب البيانات عند تحميل الصفحة لأول مرة
    fetchBookings();
});