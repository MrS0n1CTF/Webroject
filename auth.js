// auth.js - التصحيح النهائي لوظيفة التبديل بين واجهات الدخول والتسجيل

document.addEventListener('DOMContentLoaded', () => {
    
    // جلب العناصر الأساسية (الصفحات)
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    
    // جلب أزرار/روابط التحويل
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.querySelector('#login-page form'); 
    const signupForm = document.querySelector('#signup-page form'); 
    const loginMessageElement = document.getElementById('login-message');
    const signupMessageElement = document.getElementById('signup-message');
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
        if (authMessageElement) authMessageElement.textContent = '';
    }
    
    // ** 2. تهيئة أولية: إخفاء صفحة التسجيل عند تحميل الصفحة **
    if (signupPage && signupPage) {
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
    
    // =========================================================
    // 3. وظيفة تسجيل الدخول (LOGIN) - حل مشكلة الدخول العشوائي
    // =========================================================
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع الإجراء الافتراضي لـ HTML
            
            // جلب القيم من النموذج المُرسل
            // ملاحظة: يجب أن يحتوي index.html على حقل ID='email' وليس 'username'
            const email = e.target.querySelector('#email').value.trim(); 
            const password = e.target.querySelector('#password').value.trim();

            if (authMessageElement) authMessageElement.textContent = 'Logging in';

            try {
                // التحقق من Firebase
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                if (authMessageElement) authMessageElement.textContent = 'Access Granted';
                window.location.href = 'dashboard.html'; 
                
            } catch (error) {
                const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                if (authMessageElement) authMessageElement.textContent = `Login Error ${errorMessage}`;
                console.error("Login Error:", error);
            }
        });
    }

    // =========================================================
    // 4. وظيفة التسجيل (SIGNUP)
    // =========================================================
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // جلب القيم
            const username = e.target.querySelector('#username').value.trim();
            const email = e.target.querySelector('#signup-email').value.trim();
            const password = e.target.querySelector('#signup-password').value.trim();
            const confirmPassword = e.target.querySelector('#confirm_password').value.trim();

            if (password !== confirmPassword) {
                if (authMessageElement) authMessageElement.textContent = 'Password does not match';
                return;
            }

            if (authMessageElement) authMessageElement.textContent = 'Account Creation in progress';

            try {
                // 1. إنشاء المستخدم في Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // 2. إنشاء وثيقة المستخدم في Firestore
                await setDoc(doc(db, "Users", user.uid), {
                    Name: username,
                    Email: email,
                    Total_score: 0,
                    completedChallenges: []
                });

                if (authMessageElement) authMessageElement.textContent = 'Account Created successfully';
                
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                if (authMessageElement) authMessageElement.textContent = `Error in signup${errorMessage}`;
                console.error("Signup Error:", error);
            }
        });
    }
    
    // =========================================================
    // 5. وظيفة تسجيل الخروج (LOGOUT)
    // =========================================================
    const logoutLink = document.querySelector('.logout-link'); 
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Logout Error:", error);
                alert("Error through");
            }
        });
    }


    // ملاحظة: الأكواد الخاصة بتسجيل الدخول الفعلي (Firebase Logic) يجب أن تكون موجودة هنا أيضاً
    // كما في الرد السابق الذي أضفنا فيه signInWithEmailAndPassword و createUserWithEmailAndPassword.

});