// URL к API (замени на свой путь, если нужно)
const apiUrl = "http://localhost:5000/api/tasks";

// Функция для получения всех задач и отображения их в таблице
async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        
        
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error(error);
    }
}

async function createTask(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    const description = document.getElementById("description").value;
    const timeSpentInput = document.getElementById("timeSpent").value; // Получаем значение из input
    const userId = "1";

    // Преобразуем строку времени в TimeSpan (формат HH:mm)
    const [hours, minutes] = timeSpentInput.split(':').map(Number);
    const timeSpent = new Date(0, 0, 0, hours, minutes); // Создаём объект Date для удобного использования
    const timeSpentFormatted = timeSpent.toTimeString().slice(0, 5); // Получаем строку HH:mm

    const taskItem = {
        description: description,
        timeSpent: timeSpentFormatted, // Отправляем время в формате HH:mm
        userId: parseInt(userId)
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskItem)
        });

        fetchTasks(); // Обновляем список задач после добавления новой
        document.getElementById("taskForm").reset(); // Сброс формы
    } catch (error) {
        console.error("Ошибка при создании задачи:", error);
    }
}

// Функция для отображения задач в таблице
function displayTasks(tasks) {
    const taskTable = document.getElementById("taskTable");
    taskTable.innerHTML = ""; // Очистка таблицы

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.description || "Описание отсутствует"}</td>
            <td>${task.executionDate || "Дата не указана"}</td>
            <td>${task.timeSpent || "Не указано"}</td>
            <td>${task.UserFullName || "Неизвестный"}</td>
        `;

        taskTable.appendChild(row);
    });
}

// Добавляем обработчик для формы отправки
document.getElementById("taskForm").addEventListener("submit", createTask);

// Получаем задачи при загрузке страницы
fetchTasks();