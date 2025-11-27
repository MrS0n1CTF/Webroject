// main.js - الكود الموحد والنهائي

// 1. IMPORT FIREBASE INSTANCES (تأكد من وجود هذا الملف)
import { auth, db } from './firebase-config.js'; 

// 2. IMPORT REQUIRED FIREBASE SDK FUNCTIONS 
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot,
    doc, 
    getDoc,
    updateDoc, 
    arrayUnion
} from "https://www.gstatic.com/firebase/9.6.1/firebase-firestore.js"; // ** التعديل هنا: إكمال رابط Firestore SDK **

import { 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebase/9.6.1/firebase-auth.js"; // ** التعديل هنا: إكمال رابط Auth SDK **


// 3. تعريف عناصر الواجهة
// ** التعديل هنا: يجب استخدام الـ IDs الصحيحة من ملفات HTML (مثل dashboard.html) **
// ملاحظة: بما أننا نستخدم صفحات منفصلة (index.html, dashboard.html)، فقد لا تحتاج لـ loginContainer هنا.
// لكن سنفترض أننا نستخدم طريقة إخفاء وإظهار.
const loginContainer = document.getElementById('login-page'); // ** (تم التعديل) استخدمنا ID صفحة الدخول في index.html **
const dashboardContainer = document.querySelector('.main-container'); // ** (تم التعديل) اسم الـ Container في dashboard.html **
const scoreboardTableBody = document.querySelector('#scoreboard-table tbody'); 


// =========================================================
// DASHBOARD FUNCTIONS
// =========================================================

function loadDashboard(user) {
    // ** التعديل هنا: استخدام خاصية display-name إن وجدت، وإلا البريد **
    const userName = user.displayName || user.email; 
    const welcomeElement = document.getElementById('welcome-user');
    
    if (welcomeElement) {
        welcomeElement.textContent = `مرحباً بك في غرفة العمليات، ${userName}!`; 
    }
    
    // تشغيل الدوال (يجب تمرير user.uid لمعرفة التحديات المكتملة)
    displayChallenges(user.uid);
    updateScoreboard();
}

// main.js - دالة displayChallenges مع الربط الصحيح

function displayChallenges(userId) {
    // ** التعديل هنا: استخدام ID المنطقة المخصصة لعرض التحديات في challenges.html أو dashboard.html **
    const challengesArea = document.getElementById('challenges-area'); 
    if (!challengesArea) return; 

    const challengesQuery = query(collection(db, "Challenges"), orderBy("Points", "asc"));

    onSnapshot(challengesQuery, async (querySnapshot) => {
        let allChallengesHTML = ''; 
        
        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);
        // ** ملاحظة: تأكد أن completedChallenges في Firestore هو مصفوفة (Array) **
        const completedChallenges = userDoc.exists() ? (userDoc.data().completedChallenges || []) : [];
        
        // لا نحتاج لـ challengeDataList إذا لم نستخدمها
        // const challengeDataList = []; 
        
        querySnapshot.forEach((doc) => {
            const challenge = doc.data();
            const challengeId = doc.id;
            const isCompleted = completedChallenges.includes(challengeId);

            const statusText = isCompleted ? 'تم الاختراق بنجاح ✔️' : 'في انتظار العمل...';
            // ** تم توحيد الألوان باستخدام الـ CSS Variables إن أمكن، وإلا تركها كما هي **
            const statusColor = isCompleted ? '#32cd32' : '#ff00ff'; 
            const buttonDisabled = isCompleted ? 'disabled' : '';
            
            const challengeHTML = `
            <div class="challenge-card">
                <h3>${challenge.Name} (${challenge.Points} نقاط)</h3>
                <p>${challenge.Description}</p>
                <input type="text" id="flag-input-${challengeId}" placeholder="أدخل Flag الحل هنا..." ${buttonDisabled}>
                
                <button data-challenge-id="${challengeId}" class="submit-flag-btn" ${buttonDisabled}>إرسال الحل</button>
                <p id="message-${challengeId}" class="challenge-message" style="color: ${statusColor};">${statusText}</p>
            </div>`;
            
            allChallengesHTML += challengeHTML;
        });
        
        challengesArea.innerHTML = allChallengesHTML;

        // ربط الـ Event Listeners (هذا الربط صحيح وآمن جداً)
        challengesArea.querySelectorAll('.submit-flag-btn').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-challenge-id');
                    // استدعاء الدالة العامة الآمنة
                    window.submitFlag(id); 
                });
            }
        });
    });
}


function updateScoreboard() {
    // ** التعديل هنا: التأكد من الـ ID الصحيح (يفترض أنك تستخدم scoreboard-table) **
    const scoreboardTableBody = document.querySelector('#ctf-scoreboard-table tbody');
    if (!scoreboardTableBody) return; 

    const usersQuery = query(collection(db, "Users"), orderBy("Total_score", "desc"));
    
    onSnapshot(usersQuery, (querySnapshot) => {
        let html = ''; // ابدأ من HTML فارغ للجسم
        let rank = 1;

        querySnapshot.forEach((doc) => { // ** تم تصحيح خطأ إغلاق القوس **
            const user = doc.data();
            const nameDisplay = user.Name || user.email || 'مستخدم غير معروف';
            
            html += `<tr><td>#${rank}</td><td>${nameDisplay}</td><td>${user.Total_score || 0}</td></tr>`;
            rank++;
        });

        scoreboardTableBody.innerHTML = html;
    });
}


//flag{You_are_a_shining_star}
//e9e7546f45344086a1670bd4acee52a80657a13b9505d617a8c65ba67f472c09

//flag{You_are_really_an_ethical_hacker}
//4d3dd0dbf74ef04f2b26f1299a6effa32a0231fd3856275ae452457e8bb7566e

// main.js - إضافة دالة التحقق من Flag والربط الآمن

// ** تم دمج الـ Imports هنا في النقطة 2 لتجنب التكرار **

// يجب أن تكون الدالة عامة (Global) لكي نستخدمها بأمان في الربط
window.submitFlag = async function(challengeId) { 
    
    const user = auth.currentUser;
    // ** التعديل هنا: يجب إظهار رسالة إذا لم يكن المستخدم مسجلاً للدخول **
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً لإرسال الحل.");
        return;
    }

    // 1. جلب عناصر الإدخال والرسالة
    const inputElement = document.getElementById(`flag-input-${challengeId}`);
    const messageElement = document.getElementById(`message-${challengeId}`);
    const submittedFlag = inputElement ? inputElement.value.trim() : '';

    // رسالة مؤقتة
    messageElement.textContent = "جاري التحقق...";
    messageElement.style.color = '#ff9500'; // لون برتقالي للانتظار
    
    try {
        // 2. جلب بيانات التحدي الصحيحة من Firestore
        const challengeDocRef = doc(db, "Challenges", challengeId);
        const challengeDoc = await getDoc(challengeDocRef);
        
        if (!challengeDoc.exists()) {
            messageElement.textContent = "خطأ: التحدي غير موجود.";
            messageElement.style.color = '#ff0000';
            return;
        }

        const challengeData = challengeDoc.data();
        // ** التعديل هنا: التأكد من أنك تستخدم مفتاح 'Flag' بالضبط من قاعدة البيانات **
        const correctFlag = challengeData.Flag; 
        
        // 3. التحقق من وجود قيمة Flag في القاعدة
        if (!correctFlag || typeof correctFlag !== 'string') {
            messageElement.textContent = "خطأ في التحدي: لم يتم تعريف قيمة Flag في قاعدة البيانات.";
            messageElement.style.color = '#ff0000';
            return; 
        }

        // 4. جلب بيانات المستخدم (يجب أن تكون داخل try/catch)
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // جلب قائمة التحديات المكتملة (مع قيمة افتراضية [])
        const completedChallenges = userDoc.exists() ? (userDoc.data().completedChallenges || []) : [];

        // 5. التحقق من أن المستخدم لم يحل التحدي بالفعل 
        if (completedChallenges.includes(challengeId)) {
            messageElement.textContent = "لقد قمت بحل هذا التحدي بالفعل! 🚫";
            messageElement.style.color = '#ff0000';
            return;
        }

        // 6. مقارنة الـ Flag
        if (submittedFlag.toLowerCase() === correctFlag.toLowerCase()) {
            // ====== الـ FLAG صحيح ======
            
            //  الحل النهائي لمشكلة النقاط في مكانها الصحيح هنا 
            const currentTotalScore = userDoc.exists() ? (userDoc.data().Total_score || 0) : 0; // ** تم إضافة التحقق من userDoc.exists() **
            
            await updateDoc(userDocRef, {
                Total_score: currentTotalScore + challengeData.Points,
                completedChallenges: arrayUnion(challengeId)
            });
            
            // ** تم تعطيل الزر والإدخال بعد الإرسال الناجح **
            inputElement.disabled = true;
            inputElement.value = submittedFlag; // إبقاء القيمة الصحيحة في الحقل
            const submitButton = document.querySelector(`.submit-flag-btn[data-challenge-id="${challengeId}"]`);
            if (submitButton) submitButton.disabled = true;
            
            messageElement.textContent = "تهانينا! Flag صحيح. تم إضافة النقاط. ✅";
            messageElement.style.color = '#00ff41';
            
            // تحديث لوحة النقاط (ستتحدث الواجهة تلقائياً بسبب onSnapshot)
            
        } else {
            // ====== الـ FLAG خاطئ ======
            messageElement.textContent = "Flag خاطئ. حاول مرة أخرى. ❌";
            messageElement.style.color = '#ff0000';
        }
        
    } catch (error) {
        console.error("Error submitting flag: ", error);
        messageElement.textContent = "حدث خطأ أثناء الاتصال بالخادم. (راجع Console)";
        messageElement.style.color = '#ff0000';
    }
};




// =========================================================
// AUTH STATE LISTENER - ENTRY POINT (حل مشكلة عدم التحويل)
// =========================================================

// هذا هو الجزء الذي يحل مشكلة عدم التحويل للـ Dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        // المستخدم سجل دخوله: إخفاء Login وإظهار Dashboard
        if (loginContainer) loginContainer.style.display = 'none';
        if (dashboardContainer) dashboardContainer.style.display = 'block';
        
        // تحميل البيانات
        loadDashboard(user); 
        
    } else {
        // المستخدم خرج: إظهار Login وإخفاء Dashboard
        // ** تم تصحيح display لـ loginContainer ليتوافق مع نمط Flex في style.css **
        if (loginContainer) loginContainer.style.display = 'flex'; 
        if (dashboardContainer) dashboardContainer.style.display = 'none';
        
        // إعادة واجهة الدخول لوضعية "تسجيل الدخول" (عبر الدالة في auth.js)
        // ** ملاحظة: تأكد من تعريف الدالة toggleMode في auth.js **
        if (window.toggleMode) {
             window.toggleMode(true); 
        }
    }
});
