document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.getElementById("taskForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const description = document.getElementById("description").value;
        let timeSpent = document.getElementById("timeSpent").value;
        if (/^\d{2}:\d{2}$/.test(timeSpent)) {
            timeSpent += ":00";  // добавляем секунды, если их нет
        }

        if (!description || !timeSpent) {
            alert("Все поля обязательны для заполнения.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: description,
                    timeSpent: timeSpent
                })
            });

            if (!response.ok) {
                const error = await response.text();
                alert("Ошибка: " + error);
                return;
            }

            // Обновляем список задач после успешного добавления
            loadTasks();
        } catch (error) {
            alert("Не удалось добавить задачу: " + error.message);
        }
    });
});

async function loadTasks() {
    const response = await fetch("http://localhost:5000/api/tasks");
    const tasks = await response.json();

    const tableBody = document.querySelector("#tasksTable tbody");
    tableBody.innerHTML = "";

    let totalMinutes = 0;

    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.ExecutionDate}</td>
            <td>${task.Description}</td>
            <td>${task.TimeSpent}</td>
            <td>${task.UserId}</td>
        `;
        tableBody.appendChild(row);

        const [hours, minutes] = task.TimeSpent.split(":").map(Number);
        totalMinutes += hours * 60 + minutes;
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const totalRemainingMinutes = totalMinutes % 60;
    document.getElementById("totalTime").textContent = `${totalHours}:${totalRemainingMinutes.toString().padStart(2, "0")}`;
}
