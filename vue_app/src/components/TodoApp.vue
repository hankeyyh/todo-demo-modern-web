<script setup lang="ts">
import { ref, watch } from 'vue'

interface Task {
  text: string
  completed: boolean
}

// 从localStorage加载任务
const tasks = ref<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'))

// 添加新任务
const newTask = ref('')
function addTask() {
  const taskText = newTask.value.trim()
  if (taskText) {
    tasks.value.push({ text: taskText, completed: false })
    newTask.value = ''
  }
}

// 清空所有任务
function clearTasks() {
  tasks.value = []
}

// 监听任务变化并保存到localStorage
watch(tasks, (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks))
}, { deep: true })
</script>

<template>
  <div class="todo-container">
    <h1>Todo List</h1>
    <div class="input-container">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task"
      />
      <button @click="addTask">Add Task</button>
    </div>
    <button @click="clearTasks" class="clear-btn">Clear All Tasks</button>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <label>
          <input
            type="checkbox"
            v-model="task.completed"
          />
          <span :class="{ completed: task.completed }">{{ task.text }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 22px);
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.9;
}

#addTaskButton {
  background-color: #4CAF50;
  color: white;
  margin-bottom: 10px;
}

#addTaskButton:hover {
  background-color: #45a049;
}

.clear-btn {
  background-color: #f44336;
  color: white;
  margin-top: 10px;
}

.clear-btn:hover {
  background-color: #d32f2f;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

li {
  background-color: #fff;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

@media only screen and (max-width: 600px) {
  .todo-container {
    padding: 10px;
  }
}
</style>