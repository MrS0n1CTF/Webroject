// auth.js - الكود النهائي مع وظائف Firebase

// 1. استيراد (Imports) العناصر والإعدادات الضرورية
import { auth, db } from './firebase-config.js'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebase/9.6.1/firebase-auth.js";
import { 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebase/9.6.1/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 2. جلب عناصر النماذج (Forms) وعناصر الرسائل 
    // =========================================================
    
    // عناصر النماذج والأزرار من index.html
    const loginForm = document.querySelector('#login-page form'); // نموذج الدخول
    const signupForm = document.querySelector('#signup-page form'); // نموذج التسجيل
    const authMessageElement = document.getElementById('auth-message'); // عنصر لعرض الرسائل (يجب إضافته لـ index.html)

    // عناصر التحويل بين الواجهات (الكود الأصلي)
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    if (signupPage) {
        signupPage.style.display = 'none';
    }

    // وظيفة عامة للتحويل بين الواجهات
    function toggleMode(isLogin) {
        if (isLogin) {
            loginPage.style.display = 'flex'; // استخدام flex كما في style.css
            signupPage.style.display = 'none';
        } else {
            loginPage.style.display = 'none';
            signupPage.style.display = 'block';
        }
        // مسح الرسائل القديمة عند التحويل
        if (authMessageElement) authMessageElement.textContent = ''; 
    }
    
    // ربط روابط التحويل
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMode(false); // تحويل للتسجيل
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMode(true); // تحويل للدخول
        });
    }

    // ربط الدالة العامة بـ window ليتم استدعاؤها من main.js عند الخروج
    window.toggleMode = toggleMode;


    // =========================================================
    // 3. وظيفة تسجيل الدخول (LOGIN)
    // =========================================================
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // جلب القيم من حقول الإدخال
            const email = loginForm.querySelector('#email').value.trim(); // تم افتراض أن حقل الإيميل يحمل ID: email
            const password = loginForm.querySelector('#password').value.trim();

            if (authMessageElement) authMessageElement.textContent = 'جاري تسجيل الدخول...';

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                // تم تسجيل الدخول بنجاح
                if (authMessageElement) authMessageElement.textContent = 'تم تسجيل الدخول بنجاح! جاري التحويل...';
                
                // الانتقال إلى صفحة لوحة التحكم (main.js سيتولى التحويل النهائي عبر onAuthStateChanged)
                window.location.href = 'dashboard.html'; 
                
            } catch (error) {
                // عرض رسالة الخطأ
                const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                if (authMessageElement) authMessageElement.textContent = `خطأ في الدخول: ${errorMessage}`;
                console.error("Login Error:", error);
            }
        });
    }

    // =========================================================
    // 4. وظيفة التسجيل (SIGNUP) مع إنشاء وثيقة المستخدم
    // =========================================================
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // جلب القيم من حقول الإدخال
            const username = signupForm.querySelector('#username').value.trim();
            const email = signupForm.querySelector('#email').value.trim();
            const password = signupForm.querySelector('#password').value.trim();
            const confirmPassword = signupForm.querySelector('#confirm_password').value.trim();

            if (password !== confirmPassword) {
                if (authMessageElement) authMessageElement.textContent = 'كلمة المرور وتأكيدها غير متطابقين.';
                return;
            }

            if (authMessageElement) authMessageElement.textContent = 'جاري إنشاء الحساب...';

            try {
                // 1. إنشاء المستخدم في Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // 2. إنشاء وثيقة المستخدم في Firestore
                await setDoc(doc(db, "Users", user.uid), {
                    Name: username, // تخزين الـ Alias الذي أدخله
                    Email: email,
                    Total_score: 0,
                    completedChallenges: []
                });

                if (authMessageElement) authMessageElement.textContent = 'تم إنشاء الحساب بنجاح! جاري التحويل...';
                
                // 3. الانتقال إلى لوحة التحكم
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                // عرض رسالة الخطأ
                const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                if (authMessageElement) authMessageElement.textContent = `خطأ في التسجيل: ${errorMessage}`;
                console.error("Signup Error:", error);
            }
        });
    }
    
    // =========================================================
    // 5. وظيفة تسجيل الخروج (LOGOUT)
    // =========================================================
    const logoutLink = document.querySelector('.logout-link'); // يجب أن يكون له هذا الـ class في navbar
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                // بعد الخروج، سيتم توجيه المستخدم تلقائياً إلى index.html عبر main.js
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Logout Error:", error);
                alert("حدث خطأ أثناء تسجيل الخروج.");
            }
        });
    }

});

// ملاحظة: تم إنشاء الدالة toggleMode على مستوى الـ window لتمكين main.js من استخدامها
