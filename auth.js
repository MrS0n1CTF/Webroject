// auth.js - التصحيح النهائي لوظيفة التبديل بين واجهات الدخول والتسجيل

// =========================================================
// auth.js - يجب أن يبدأ هكذا
// =========================================================

// 1. IMPORT FIREBASE INSTANCES (من ملف الإعدادات الخاص بك)
import { auth, db } from './firebase-config.js'; 
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';


// ... الآن، سيتمكن المتصفح من التعرف على الدوال داخل الدالة التالية ...

    // ... باقي الكود يعمل هنا ...

// auth.js - التصحيح النهائي لوظيفة التبديل بين واجهات الدخول والتسجيل

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
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

    // ** 3. ربط أحداث النقر (بدون تكرار) **
    // ربط رابط 'Signup'
    if (showSignupLink) {
        showSignupLink.addEventListener('click' , (e) => {
            e.preventDefault();
            //window.toggleMode(false);
            body.classList.add('show-signup');
        });
    }
    
    // ربط رابط 'Login'
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            //window.toggleMode(true);
            body.classList.remove('show-signup');
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

            if (loginMessageElement) loginMessageElement.textContent = 'Logging in';

            try {
                // التحقق من Firebase
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                if (loginMessageElement) loginMessageElement.textContent = 'Access Granted';
                window.location.href = 'dashboard.html'; 
                
            } catch (error) {
                const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                if (loginMessageElement) loginMessageElement.textContent = `Login Error ${errorMessage}`;
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
                if (signupMessageElement) signupMessageElement.textContent = 'Password does not match';
                return;
            }

            if (signupMessageElement) signupMessageElement.textContent = 'Account Creation in progress';

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

                if (signupMessageElement) signupMessageElement.textContent = 'Account Created successfully';
                
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                if (signupMessageElement) signupMessageElement.textContent = `Error in signup${errorMessage}`;
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