<template>
    <AppPageLayout>
        <template #header>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">로그인</h1>
        </template>

        <div class="flex flex-col items-center justify-center min-h-[70vh]">
            <div class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
                <div class="text-center mb-6">
                    <div
                        class="inline-flex items-center justify-center bg-primary text-white rounded-full size-14 mb-5">
                        <span class="material-symbols-outlined text-4xl mt-0.5">local_shipping</span>
                    </div>
                </div>
                <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    4Weekdays 로그인
                </h2>


                <form @submit.prevent="onLogin" class="flex flex-col gap-5 text-left">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            이메일
                        </label>
                        <input v-model="employeeId" type="text" placeholder="이메일을 입력하세요"
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            비밀번호
                        </label>
                        <input v-model="password" type="password" placeholder="비밀번호를 입력하세요"
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" />
                    </div>

                    <div class="flex items-center justify-end">
                        <div class="text-sm">
                            <a class="font-medium text-primary hover:text-primary/80" href="#">비밀번호 찾기</a>
                        </div>
                    </div>

                    <p v-if="error" class="text-red-500 text-sm text-center -mt-2">{{ error }}</p>

                    <button @click="onLogin()" type="submit"
                        class="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-lg hover:bg-primary/90 transition">
                        로그인
                    </button>
                </form>
            </div>
        </div>
    </AppPageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import MemberApi from '@/api/member/index.js'
import AppPageLayout from '@/layouts/AppPageLayout.vue'

const ui = useUIStore()
const auth = useAuthStore()
const router = useRouter()

const employeeId = ref('')
const password = ref('')
const error = ref('')

const onLogin = async () => {
    if (!employeeId.value || !password.value) {
        error.value = '이메일과 비밀번호를 모두 입력해주세요.'
        return
    }

    error.value = ''

    const req = {
        email: employeeId.value,
        password: password.value
    }

    try {
        const res = await MemberApi.memberLogin(req)

        if (res.status === 20000 || res.message === '요청에 성공하였습니다.') {
            auth.login()
            const role = res.results.role
            if (role === 'WORKER') {
                router.push('/task/Worker/view')
            } else if (role === 'ADMIN' || role === 'MANAGER') {
                router.push('/dashboard')
            } else {
                router.push('/')
            }
        } else {
            error.value = '로그인 실패'
        }
    } catch (e) {
        console.error('로그인 에러:', e)
        error.value = '로그인 실패'
    }
}
</script>
