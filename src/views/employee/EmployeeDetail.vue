<template>
    <AppPageLayout>
        <!-- 헤더 -->
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">직원 상세</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">직원 상세 정보 & 수정이 가능합니다.</p>
                </div>
                <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
            </div>
        </template>

        <!-- 직원 상세 카드 -->
        <div class="max-w-xl mx-auto mt-8 bg-white border border-gray-200 rounded-lg p-8">
            <div class="space-y-5">
                <!-- 이메일 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <div class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-800 text-sm">
                        {{ employee.email }}
                    </div>
                </div>

                <!-- 이름 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    <div v-if="!isEditMode"
                        class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-800 text-sm">
                        {{ employee.name }}
                    </div>
                    <input v-else v-model="editableEmployee.name" type="text"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <!-- 전화번호 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    <div v-if="!isEditMode"
                        class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-800 text-sm">
                        {{ employee.phoneNumber }}
                    </div>
                    <input v-else v-model="editableEmployee.phoneNumber" type="text"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <!-- 권한 밑에 추가 -->
                <div v-if="isEditMode">
                    <label class="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                    <input v-model="editableEmployee.password" type="password"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="비밀번호를 변경하려면 입력하세요" />
                </div>

                <!-- 권한 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">권한</label>
                    <div v-if="!isEditMode"
                        class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-800 text-sm">
                        {{ employee.role }}
                    </div>
                    <select v-else v-model="editableEmployee.role"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="WORKER">WORKER</option>
                    </select>
                </div>

                <!-- 상태 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <div v-if="!isEditMode"
                        class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm font-medium"
                        :class="getStatusColor(employee.status)">
                        {{ getStatusLabel(employee.status) }}
                    </div>
                    <select v-else v-model="editableEmployee.status"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="ACTIVE">재직</option>
                        <option value="INACTIVE">휴직</option>
                        <option value="LOCK">퇴사</option>
                    </select>
                </div>

                <!-- 가입일시 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">가입일시</label>
                    <div class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-800 text-sm">
                        {{ formatDate(employee.joinAt) }}
                    </div>
                </div>
            </div>

            <!-- 버튼 영역 -->
            <div class="mt-8 flex justify-end gap-3">
                <ButtonComp v-if="!isEditMode && auth.isAdmin" color="primary" icon="edit" @click="toggleEditMode">
                    수정
                </ButtonComp>
                <ButtonComp v-if="isEditMode" color="primary" icon="save" @click="saveEmployee">
                    저장
                </ButtonComp>
                <ButtonComp color="secondary" icon="close"
                    @click="isEditMode ? toggleEditMode() : $router.push('/employee')">
                    취소
                </ButtonComp>
            </div>
        </div>
    </AppPageLayout>
</template>

<script setup>
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import member from '@/api/member'
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'
import { formatDate } from '@/utils/date.js'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const employee = ref({})
const editableEmployee = ref({})
const isEditMode = ref(false)

const employeeId = route.params.id

const fetchEmployee = async () => {
    try {
        const response = await member.memberDetail(employeeId)
        employee.value = response.results
    } catch (error) {
        console.error('직원 정보 조회 오류:', error)
    }
}

onMounted(fetchEmployee)

const toggleEditMode = () => {
    if (isEditMode.value) {
        isEditMode.value = false
    } else {
        editableEmployee.value = { ...employee.value }
        isEditMode.value = true
    }
}

const saveEmployee = async () => {
    try {
        const response = await member.memberEdit(employeeId, editableEmployee.value)
        if (response.success) {
            employee.value = { ...editableEmployee.value }
            isEditMode.value = false
            alert('직원 정보가 수정되었습니다.')
        } else {
            alert(response.message || '직원 정보 수정에 실패했습니다.')
        }
    } catch (error) {
        console.error('직원 정보 수정 오류:', error)
        alert('직원 정보 수정 중 오류가 발생했습니다.')
    }
}
</script>
