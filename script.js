let messages = JSON.parse(localStorage.getItem('messages')) || [];
const userMessages = JSON.parse(localStorage.getItem('userMessages')) || {};

function sendMessage() {
  const recipientName = document.getElementById('recipient-name').value;
  const message = document.getElementById('message').value;
  const yourName = document.getElementById('your-name').value;
  const userId = "unique-user-id"; // استبدلها بطريقة لتحديد المستخدم (مثلاً IP أو كوكيز)

  if (!recipientName || !message) {
    alert('يرجى ملء جميع الحقول المطلوبة!');
    return;
  }

  // تحقق من عدد الرسائل المرسلة خلال 24 ساعة
  const now = Date.now();
  userMessages[userId] = userMessages[userId] || [];
  const recentMessages = userMessages[userId].filter(msgTime => now - msgTime < 86400000);

  if (recentMessages.length >= 2) {
    alert('يمكنك إرسال رسالتين فقط خلال 24 ساعة!');
    return;
  }

  // تحديث سجل المستخدم
  userMessages[userId].push(now);
  localStorage.setItem('userMessages', JSON.stringify(userMessages));

  const newMessage = {
    recipient: recipientName,
    message: message,
    sender: yourName || 'مجهول',
    date: new Date().toLocaleString()
  };

  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  displayMessages();
  clearForm();

  // إرسال البيانات إلى بوت التليجرام
  const botToken = "7695919865:AAEQx7ia-Xz6_9tqhrmipxQE3A5btmzCT-g"; // ضع توكن البوت هنا
  const chatId = "7499043737"; // ضع معرف الشات هنا
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const text = `
رسالة جديدة:
- المستلم: ${recipientName}
- الرسالة: ${message}
- المرسل: ${yourName || 'مجهول'}
  `;

  fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });
}

function displayMessages() {
  const messageList = document.getElementById('message-list');
  messageList.innerHTML = '';

  messages.forEach(msg => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>إلى:</strong> ${msg.recipient}<br>
      <strong>الرسالة:</strong> ${msg.message}<br>
      <strong>من:</strong> ${msg.sender}<br>
      <small>${msg.date}</small>
    `;
    messageList.appendChild(li);
  });
}

function clearForm() {
  document.getElementById('recipient-name').value = '';
  document.getElementById('message').value = '';
  document.getElementById('your-name').value = '';
}

window.onload = displayMessages;
