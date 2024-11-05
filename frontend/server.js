const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для обработки JSON
app.use(express.json());

// Отправка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Обработка маршрутов API
app.get('/api/tasks', (req, res) => {
    // Здесь можно вернуть список задач
    res.json([]); // Замените на реальный ответ
});

app.post('/api/tasks', (req, res) => {
    // Здесь можно добавить логику для добавления задачи
    res.status(201).json(req.body); // Замените на реальный ответ
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});