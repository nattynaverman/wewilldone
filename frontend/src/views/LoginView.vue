<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/authService'

const router = useRouter()
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const formData = ref({
    identify: '',
    password: ''
})

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    try {
        loading.value = true
        error.value = ''

        // Validation
        if (!formData.value.identify || !formData.value.password) {
            error.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
            return
        }

        // Call API
        const response = await login(formData.value)
        console.log('Login response:', response)

        // Set token in LocalStorage
        localStorage.setItem('token', response.data.token)

        // Set data user in LocalStorage
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Redirect to dashboard/home
        router.push({ name: 'home' })

    } catch (err: any) {
        console.error('Login error:', err)
        error.value = err.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="w-screen h-screen relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="bg-blue-50 rounded-md p-10 shadow-lg shadow-blue-500/50">
                <h1 class="text-2xl font-bold text-center mb-5">เข้าสู่ระบบ</h1>

                <!-- error message -->
                <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {{ error }}
                </div>

                <form @submit.prevent="handleLogin" class="mb-8 font-semibold space-y-4">

                    <!-- Email/Username field -->
                    <div class="flex items-center gap-4">
                        <label for="identify" class="w-32 shrink-0">Email/Username:</label>
                        <input id="identify" v-model="formData.identify" type="text" :disabled="loading"
                            class="flex-1 px-3 py-2 border border-blue-300 rounded-sm focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800 disabled:bg-gray-100"
                            required>
                    </div>

                    <!-- Password field -->
                    <div class="flex items-center gap-4">
                        <label for="password" class="w-32 shrink-0">Password:</label>
                        <div class="flex-1 relative">
                            <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                                :disabled="loading"
                                class="w-full px-3 py-2 pr-10 border border-blue-300 rounded-sm focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800 disabled:bg-gray-100"
                                required>
                            <button type="button" @click="togglePassword" :disabled="loading"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800 focus:outline-none disabled:text-gray-300">
                                <!-- Eye Closed Icon -->
                                <svg v-if="!showPassword" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 640 512">
                                    <path
                                        d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                                </svg>

                                <!-- Eye Open Icon -->
                                <svg v-else class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path
                                        d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Login Buttun -->
                    <button type="submit" :disabled="loading"
                        class="block w-full p-2 bg-gradient-to-r from-pink-500 to-red-500 border rounded-md text-white font-semibold cursor-pointer hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                    </button>
                </form>

                <!-- Go To Register Page -->
                <div class="text-end text-red-500 font-semibold hover:underline">
                    <RouterLink :to='{ name: "register" }'>สมัครสมาชิก?</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>