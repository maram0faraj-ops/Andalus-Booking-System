// public/app.js (تحديث كامل)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const messageArea = document.getElementById('message-area');
    const logoutBtn = document.getElementById('logout-btn');
    const loggedInUserElement = document.getElementById('logged-in-user');
    const adminLink = document.getElementById('admin-link');

    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    // 1. **التحقق من المصادقة (JWT)**
    if (!token) {
        // إذا لم يكن هناك رمز، يتم التوجيه إلى صفحة الدخول
        window.location.href = 'login.html';
        return; 
    }

    // عرض رابط لوحة التحكم للمدير فقط
    if (userRole === 'Admin') {
        adminLink.style.display = 'inline-block';
    }
    
    // دالة لتسجيل الخروج ومسح الرمز
    const logoutUser = (message = 'تم تسجيل الخروج بنجاح.') => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        alert(message);
        window.location.href = 'login.html';
    };

    logoutBtn.addEventListener('click', () => {
        logoutUser();
    });

    const displayMessage = (message, isError = false) => {
        messageArea.textContent = message;
        messageArea.classList.remove('alert-success', 'alert-danger');
        messageArea.classList.add(isError ? 'alert-danger' : 'alert-success');
        messageArea.style.display = 'block';
    };

    // 2. جلب معلومات المستخدم لعرضها
    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const user = await response.json();
                loggedInUserElement.textContent = user.name;
            } else {
                // فشل جلب الملف الشخصي (Token منتهي الصلاحية مثلاً)
                logoutUser('انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مجدداً.');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // في حال فشل الاتصال بالخادم، لن نسجل الخروج، ولكن نعرض رسالة خطأ
            loggedInUserElement.textContent = ' (خطأ في الاتصال)';
        }
    };
    
    fetchUserProfile(); // يتم النداء عند تحميل الصفحة

    // 3. **إرسال نموذج الحجز مع الرمز المميز (JWT)**
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // إرفاق رمز JWT في رأس الطلب
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(`✅ ${result.message} رقم الحجز: ${result.reservationNumber}`);
                form.reset();
            } else if (response.status === 401) {
                // خطأ غير مصرح (الرمز منتهي الصلاحية أو غير صالح)
                logoutUser('انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مجدداً.');
            } else {
                // خطأ في التداخل أو الخادم
                displayMessage(`❌ خطأ في الحجز: ${result.message || 'حدث خطأ غير معروف.'}`, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            displayMessage('❌ فشل الاتصال بالخادم. تحقق من اتصالك.', true);
        }
    });
});