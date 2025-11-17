// public/register.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
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
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(`✅ تم تسجيل المستخدم ${result.name} بنجاح! يتم التوجيه لتسجيل الدخول.`);
                // تخزين الرمز لتسجيل الدخول التلقائي أو التوجيه
                localStorage.setItem('userToken', result.token);
                localStorage.setItem('userRole', result.role);
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);

            } else {
                displayMessage(`❌ فشل التسجيل: ${result.message}`, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            displayMessage('❌ فشل الاتصال بالخادم.', true);
        }
    });
});