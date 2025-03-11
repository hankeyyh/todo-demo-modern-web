// 获取 DOM 元素
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
// 获取清空任务按钮
const clearTasksButton = document.getElementById('clearTasksButton'); 

// 从本地存储加载任务
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 渲染任务列表
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.classList.add('completed');
        }
        li.appendChild(checkbox);
        li.appendChild(taskText);
        taskList.appendChild(li);
    });
}

// 保存任务到本地存储
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 添加新任务
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

// 清空所有任务
function clearTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
}

// 绑定事件
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
// 为清空任务按钮绑定点击事件
clearTasksButton.addEventListener('click', clearTasks); 

// 初始化渲染
renderTasks();