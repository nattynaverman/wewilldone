<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllTodos, createTodo, updateTodo, deleteTodo, type Todo } from '../api/todoService'

const router = useRouter()
const todos = ref<Todo[]>([])
const loading = ref(false)
const logoutBtn = ref(false)
const error = ref('')
const newTodoTitle = ref('')
const filter = ref<'all' | 'pending' | 'completed'>('all')

// Get user info
const user = JSON.parse(localStorage.getItem('user') || '{}')

// Computed properties for filtered todos
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'pending':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const pendingCount = computed(() => todos.value.filter(todo => !todo.completed).length)
const completedCount = computed(() => todos.value.filter(todo => todo.completed).length)

// Load todos
const loadTodos = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await getAllTodos()
    todos.value = response.data
  } catch (err: any) {
    console.error('Load todos error:', err)
    error.value = 'ไม่สามารถโหลดรายการงานได้'

    if (err.response?.status === 401) {
      // Token expired
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({ name: 'login' })
    }
  } finally {
    loading.value = false
  }
}

// Add new todo
const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    const response = await createTodo({ title: newTodoTitle.value.trim() })
    todos.value.unshift(response.data)
    newTodoTitle.value = ''
    error.value = ''
  } catch (err: any) {
    console.error('Add todo error:', err)
    error.value = 'ไม่สามารถเพิ่มงานใหม่ได้'
  }
}

// Toggle todo completion
const toggleTodo = async (todo: Todo) => {
  try {
    const response = await updateTodo(todo.id, { completed: !todo.completed })
    const index = todos.value.findIndex(t => t.id === todo.id)
    if (index !== -1) {
      todos.value[index] = response.data
    }
    error.value = ''
  } catch (err: any) {
    console.error('Toggle todo error:', err)
    error.value = 'ไม่สามารถอัปเดตงานได้'
  }
}

// Delete todo
const removeTodo = async (todoId: string) => {
  if (!confirm('คุณต้องการลบงานนี้หรือไม่?')) return

  try {
    await deleteTodo(todoId)
    todos.value = todos.value.filter(todo => todo.id !== todoId)
    error.value = ''
  } catch (err: any) {
    console.error('Delete todo error:', err)
    error.value = 'ไม่สามารถลบงานได้'
  }
}

// Logout
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push({ name: 'login' })
}

// Load todos on component mount
onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push({ name: 'login' })
    return
  }
  loadTodos()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">WeWillDone</h1>
        </div>

        <div class="relative flex items-center gap-4">
          <button @click="logoutBtn = !logoutBtn"
            class="text-xl font-bold text-white px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer">{{
              user.username[0].toUpperCase() }}</button>
          <button v-show="logoutBtn" @click="logout"
            class="absolute w-32 top-14 -right-3 px-4 py-2 cursor-pointer bg-blue-100 text-gray-700 rounded-md hover:bg-red-500 hover:text-white transition-colors shadow-lg shadow-blue-500/50 hover:shadow-red-500/50">
            ออกจากระบบ
          </button>
        </div>

      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ todos.length }}</div>
          <div class="text-sm text-gray-600">งานทั้งหมด</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ pendingCount }}</div>
          <div class="text-sm text-gray-600">ยังไม่เสร็จ</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
          <div class="text-sm text-gray-600">เสร็จแล้ว</div>
        </div>
      </div>

      <!-- Add Todo Form -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">เพิ่มงานใหม่</h2>
        <form @submit.prevent="addTodo" class="flex gap-4">
          <input v-model="newTodoTitle" type="text" placeholder="งานที่ต้องทำ..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <button type="submit" :disabled="!newTodoTitle.trim()"
            class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
            เพิ่ม
          </button>
        </form>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow-sm p-1 mb-6 flex">
        <button @click="filter = 'all'" :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer',
          filter === 'all' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
        ]">
          งานทั้งหมด
        </button>
        <button @click="filter = 'pending'" :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer',
          filter === 'pending' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-gray-800'
        ]">
          ยังไม่เสร็จ
        </button>
        <button @click="filter = 'completed'" :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer',
          filter === 'completed' ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-gray-800'
        ]">
          เสร็จแล้ว
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-600">กำลังโหลด...</div>
      </div>

      <!-- Todo List -->
      <div v-else-if="filteredTodos.length > 0" class="space-y-3">
        <div v-for="todo in filteredTodos" :key="todo.id"
          class="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <!-- Checkbox -->
          <input type="checkbox" :checked="todo.completed" @change="toggleTodo(todo)"
            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">

          <!-- Todo Title -->
          <span :class="[
            'flex-1 text-left',
            todo.completed ? 'text-gray-500' : 'text-gray-800'
          ]">
            {{ todo.title }}
          </span>

          <!-- Created Date -->
          <span class="text-xs text-gray-400">
            {{ new Date(todo.createdAt).toLocaleDateString('th-TH') }}
          </span>

          <!-- Delete Button -->
          <button @click="removeTodo(todo.id)" class="p-1 cursor-pointer">
            <svg class="w-5 h-5 fill-red-500 hover:fill-red-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 fill-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ filter === 'all' ? 'ยังไม่มีงาน' :
            filter === 'pending' ? 'ไม่มีงานที่ยังไม่เสร็จ' : 'ไม่มีงานที่เสร็จแล้ว' }}
        </h3>
        <p class="text-gray-500">
          {{ filter === 'all' ? 'ยังไม่มีงานเพิ่มงานใหม่ข้างบน' : 'ไม่มีงานในตัวกรองนี้' }}
        </p>
      </div>
    </main>
  </div>
</template>