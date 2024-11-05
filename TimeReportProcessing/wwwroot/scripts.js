document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.getElementById("taskForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const description = document.getElementById("description").value;
        let timeSpent = document.getElementById("timeSpent").value;
        if (/^\d{2}:\d{2}$/.test(timeSpent)) {
            timeSpent += ":00";
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
        const executionDate = task.executionDate;
        const description = task.description;
        const timeSpent = task.timeSpent;
        const userFullName = task.userFullName;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${executionDate.split("T")[0]}</td>
            <td>${description}</td>
            <td>${timeSpent}</td>
            <td>${userFullName}</td>
        `;
        tableBody.appendChild(row);

        if (timeSpent) {
            const [hours, minutes] = timeSpent.split(":").map(Number);
            totalMinutes += (hours || 0) * 60 + (minutes || 0);
        }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const totalRemainingMinutes = totalMinutes % 60;
    document.querySelector("#totalTime").textContent = `${totalHours}ч ${totalRemainingMinutes}мин`;
}
