require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Настройки
app.use(cors());
app.use(express.json());

// Раздаем твой сайт из этой же папки!
app.use(express.static('./')); 

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Эндпоинт, который ловит заявки с сайта
app.post('/api/send-lead', async (req, res) => {
    const { name, phone, task } = req.body;
    
    // Красивое сообщение для телеграма
    const text = `🔥 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📝 Задача: ${task}`;

    try {
        // Отправляем запрос серверам Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });
        
        if (response.ok) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
