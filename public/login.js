// public/login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const messageArea = document.getElementById('message-area');
    
    const displayMessage = (message, isError = false) => {
        messageArea.textContent = message;
        messageArea.classList.remove('alert-success', 'alert-danger');
        messageArea.classList.add(isError ? 'alert-danger' : 'alert-success');
        messageArea.style.display = 'block';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // النجاح: تخزين الرمز (Token) في التخزين المحلي (Local Storage)
                localStorage.setItem('userToken', result.token);
                localStorage.setItem('userRole', result.role);

                displayMessage(`✅ مرحبا بك يا ${result.name}. يتم التوجيه...`);

                // التوجيه إلى واجهة الحجز الرئيسية بعد ثانية واحدة
                setTimeout(() => {
                    // إذا كان مديراً، يوجه إلى لوحة التحكم، وإلا يوجه إلى نموذج الحجز
                    if (result.role === 'Admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);

            } else {
                displayMessage(`❌ خطأ في الدخول: ${result.message}`, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            displayMessage('❌ فشل الاتصال بالخادم.', true);
        }
    });
});