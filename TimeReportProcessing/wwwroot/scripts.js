const apiUrl = '/api/tasks';

async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Ошибка при получении задач');

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error(error);
    }
}

async function addTask(task) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) throw new Error('Ошибка при добавлении задачи');

        const newTask = await response.json();
        return newTask;
    } catch (error) {
        console.error(error);
    }
}

function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${ String(hours).padStart(2, '0') }:${ String(minutes).padStart(2, '0') }`;
}

function renderTasks(tasks) {
    const tasksBody = document.getElementById('tasksBody');
    tasksBody.innerHTML = '';

    let totalMinutes = 0;

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.executionDate}</td>
            <td>${task.description}</td>
            <td>${task.timeSpent}</td>
            <td>Иванов И.И.</td>
        `;
        tasksBody.appendChild(row);

        const [hours, minutes] = task.timeSpent.split(':').map(Number);
        totalMinutes += hours * 60 + minutes;
    });

    document.getElementById('totalTime').innerText = formatTime(totalMinutes);
}

document.getElementById('taskForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const timeSpent = document.getElementById('timeSpent').value;

    const newTask = {
        description: description,
        executionDate: new Date().toLocaleDateString('ru-RU'),
        timeSpent: timeSpent,
        userId: 1 
    };

    const addedTask = await addTask(newTask);
    if (addedTask) {
        fetchTasks();
        this.reset();
    }
});

fetchTasks();