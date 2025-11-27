// auth.js - التصحيح النهائي لوظيفة التبديل بين واجهات الدخول والتسجيل

document.addEventListener('DOMContentLoaded', () => {
    
    // جلب العناصر الأساسية (الصفحات)
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    
    // جلب أزرار/روابط التحويل
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    // ** 1. وظيفة موحدة للتحويل بين الواجهات **
    // (تم جعلها دالة عامة (Window.toggleMode) لكي يمكن لـ main.js استخدامها)
    window.toggleMode = function(isLogin) {
        if (loginPage && signupPage) {
            if (isLogin) {
                // إظهار الدخول وإخفاء التسجيل (لاحظ استخدام 'flex' ليتوافق مع style.css)
                loginPage.style.display = 'flex'; 
                signupPage.style.display = 'none';
            } else {
                // إظهار التسجيل وإخفاء الدخول
                loginPage.style.display = 'none';
                signupPage.style.display = 'block'; // استخدام 'block' أو 'flex' حسب تنسيقك
            }
            // يمكن هنا مسح رسائل الأخطاء إن وجدت
            // const authMessageElement = document.getElementById('auth-message');
            // if (authMessageElement) authMessageElement.textContent = '';
        }
    }
    
    // ** 2. تهيئة أولية: إخفاء صفحة التسجيل عند تحميل الصفحة **
    if (signupPage) {
        // نستخدم toggleMode للتأكد من الحالة الابتدائية
        window.toggleMode(true); 
    }

    // ** 3. ربط أحداث النقر (بدون تكرار) **
    
    // ربط رابط 'Signup'
    if (showSignupLink) {
        showSignupLink.addEventListener('click' , (e) => {
            e.preventDefault();
            window.toggleMode(false); // تحويل إلى التسجيل
        });
    }
    
    // ربط رابط 'Login'
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleMode(true); // تحويل إلى الدخول
        });
    }
    
    // ملاحظة: الأكواد الخاصة بتسجيل الدخول الفعلي (Firebase Logic) يجب أن تكون موجودة هنا أيضاً
    // كما في الرد السابق الذي أضفنا فيه signInWithEmailAndPassword و createUserWithEmailAndPassword.

});
