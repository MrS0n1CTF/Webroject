// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // جلب العناصر الأساسية
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    
    // جلب أزرار/روابط التحويل
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    if (signupPage) {
        signupPage.style.display = 'none';
    }

    if (showSignupLink) {
        showSignupLink.addEventListener('click' , (e) => {
            e.preventDefault();
            loginPage.style.display = 'none';
            signupPage.style.display = 'block';
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupPage.style.display = 'none';
            loginPage.style.display = 'block';
        });
    }
    
    // 1. وظيفة التحويل إلى صفحة التسجيل
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault(); // منع الرابط من تحديث الصفحة
        loginForm.style.display = 'none'; // إخفاء نموذج تسجيل الدخول
        signupForm.style.display = 'block'; // إظهار نموذج التسجيل
    });

    // 2. وظيفة التحويل إلى صفحة تسجيل الدخول
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); // منع الرابط من تحديث الصفحة
        signupForm.style.display = 'none'; // إخفاء نموذج التسجيل
        loginForm.style.display = 'block'; // إظهار نموذج تسجيل الدخول
    });
});