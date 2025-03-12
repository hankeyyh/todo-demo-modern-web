<script setup lang="ts">
import { ref, watch } from 'vue'

interface Task {
  text: string
  completed: boolean
  id: number // 添加 id 用于唯一标识
}

// 从localStorage加载任务，并确保每个任务都有唯一id
const tasks = ref<Task[]>(
  JSON.parse(localStorage.getItem('tasks') || '[]').map((task: any, index: number) => ({
    ...task,
    id: task.id || Date.now() + index
  }))
)

// 添加新任务
const newTask = ref('')
function addTask() {
  const taskText = newTask.value.trim()
  if (taskText) {
    tasks.value.push({ 
      text: taskText, 
      completed: false,
      id: Date.now()
    })
    newTask.value = ''
  }
}

// 清空所有任务
function clearTasks() {
  tasks.value = []
}

// 拖拽相关
const draggedTask = ref<Task | null>(null)
const draggedIndex = ref<number>(-1)

function onDragStart(task: Task, index: number) {
  draggedTask.value = task
  draggedIndex.value = index
}

function onDragEnter(event: DragEvent, index: number) {
  if (!draggedTask.value || draggedIndex.value === index) return
  
  // 重新排序任务列表
  const newTasks = [...tasks.value]
  const draggedItem = newTasks[draggedIndex.value]
  newTasks.splice(draggedIndex.value, 1)
  newTasks.splice(index, 0, draggedItem)
  
  tasks.value = newTasks
  draggedIndex.value = index
}

// 监听任务变化并保存到localStorage
watch(tasks, (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks))
}, { deep: true })
</script>

<template>
  <div class="app-container">
    <div class="content-container">
      <h1>Todo List</h1>
      <input
        type="text"
        id="taskInput"
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task"
      />
      <button id="addTaskButton" @click="addTask">Add Task</button>
      <button id="clearTasksButton" @click="clearTasks">Clear All Tasks</button>
      <TransitionGroup tag="ul" id="taskList" name="task-list">
        <li
          v-for="(task, index) in tasks"
          :key="task.id"
          draggable="true"
          @dragstart="onDragStart(task, index)"
          @dragenter.prevent="onDragEnter($event, index)"
          @dragover.prevent
          :class="{ 'is-dragging': draggedTask === task }"
        >
          <input
            type="checkbox"
            v-model="task.completed"
          />
          <span :class="{ completed: task.completed }">{{ task.text }}</span>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100%; /* 设置高度为 100% */
  background-color: #fff;
  padding: 0; /* 去除内边距 */
}

.content-container {
  width: 100%;
  height: 100%; /* 设置高度为 100% */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 修改为顶部对齐 */
  justify-content: flex-start; 
  padding: 20px; /* 适当添加内边距 */
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

#taskInput {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;
}

#addTaskButton {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
}

#addTaskButton:hover {
  background-color: #45a049;
}

#taskList {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  width: 100%;
  position: relative;
}

#taskList li {
  background-color: #fff;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  border: 1px solid #ddd;
  color: #333;
  cursor: move; /* 添加这行，让鼠标变成手形状 */
  user-select: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

#taskList li.is-dragging {
  /* 修改为仅对背景应用透明度 */
  background-color: rgba(248, 248, 248, 0.5); 
  z-index: 2;
}

#taskList li input[type="checkbox"] {
  margin-right: 10px;
  margin-top: 3px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

#clearTasksButton {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
}

#clearTasksButton:hover {
  background-color: #d32f2f;
}

@media only screen and (max-width: 600px) {
  .app-container {
    padding: 10px;
  }
}

/* 过渡动画 */
.task-list-move {
  transition: transform 0.3s ease;
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>