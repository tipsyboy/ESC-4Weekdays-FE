<template>
    <AppPageLayout>
        <!-- 헤더 -->
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">직원 관리</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        직원 목록을 조회하고 관리합니다.
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <!-- 신규 직원 등록 -->
                    <RouterLink to="/employee/create" class="w-40">
                        <ButtonComp color="primary" icon="add">직원 등록</ButtonComp>
                    </RouterLink>
                </div>
            </div>
        </template>

        <!-- 🔹 검색 / 필터 영역 -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6 
             bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 
             rounded-lg p-4">
            <!-- 왼쪽: 검색 조건 -->
            <div class="flex flex-wrap items-center gap-3">
                <!-- 이름 검색 (짧게) -->
                <div class="relative">
                    <SearchBarComp v-model="searchParams.name" placeholder="이름 검색" class="w-[200px]" />
                </div>

                <!-- 권한 필터 -->
                <div class="relative">
                    <button @click="toggleRoleDropdown" class="flex items-center justify-between gap-1 border border-zinc-300 dark:border-zinc-700 
                   rounded-lg px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 
                   bg-white dark:bg-zinc-800 min-w-[120px]">
                        <span>{{ selectedRoleLabel }}</span>
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </button>

                    <!-- 드롭다운 -->
                    <div v-if="showRoleDropdown" class="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-800 
                   border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-md">
                        <div v-for="role in roles" :key="role.value" @click="selectRole(role)"
                            class="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm cursor-pointer">
                            {{ role.label }}
                        </div>
                    </div>
                </div>

                <!-- 상태 필터 -->
                <div class="relative">
                    <button @click="toggleStatusDropdown" class="flex items-center justify-between gap-1 border border-zinc-300 dark:border-zinc-700 
                   rounded-lg px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 
                   bg-white dark:bg-zinc-800 min-w-[120px]">
                        <span>{{ selectedStatusLabel }}</span>
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </button>

                    <!-- 드롭다운 -->
                    <div v-if="showStatusDropdown" class="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-800 
                   border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-md">
                        <div v-for="status in statuses" :key="status.value" @click="selectStatus(status)"
                            class="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm cursor-pointer">
                            {{ status.label }}
                        </div>
                    </div>
                </div>

                <!-- 날짜 필터 -->
                <div class="flex items-center gap-2">
                    <input type="date" v-model="searchParams.fromDate" class="border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 
                   bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                    <span class="text-sm text-slate-500">~</span>
                    <input type="date" v-model="searchParams.toDate" class="border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 
                   bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
            </div>

            <div class="flex justify-end">

                <!-- 오른쪽: 검색 버튼 -->
                <ButtonComp color="secondary" icon="refresh" class="px-5" @click="handleReset">
                    초기화
                </ButtonComp>
                <ButtonComp color="primary" icon="search" class="px-5" @click="handleSearch">
                    검색
                </ButtonComp>
            </div>
        </div>

        <!-- 데이터 테이블 -->
        <TableComp :columns="columns" :data="employees" class="min-h-[400px]">
            <template #cell-name="{ row }">
                <span @click="goDetail(row)" class="text-sky-500 hover:underline cursor-pointer">
                    {{ row.name }}
                </span>
            </template>

            <template #cell-status="{ row }">
                <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
            </template>

            <template #cell-role="{ row }">
                <BadgeComp :color="getStatusColor(row.role)" :label="getStatusLabel(row.role)" />
            </template>
        </TableComp>

        <!-- 페이지네이션 -->
        <div class="flex justify-center items-center gap-2 mt-6">
            <ButtonComp color="secondary" icon="arrow_back" :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)" />
            <span class="text-sm text-slate-600">페이지 {{ currentPage }} / {{ totalPages }}</span>
            <ButtonComp color="secondary" icon="arrow_forward" :disabled="currentPage >= totalPages"
                @click="handlePageChange(currentPage + 1)" />
        </div>
    </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import member from '@/api/member'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'

const router = useRouter()

// 🔍 검색 조건
const searchParams = ref({
    name: '',
    role: '',
    status: '',
    fromDate: '',
    toDate: ''
})

// 드롭다운 상태 관리
const showRoleDropdown = ref(false)
const showStatusDropdown = ref(false)

// 필터 옵션
const roles = [
    { label: '권한(전체)', value: '' },
    { label: '관리자', value: 'ADMIN' },
    { label: '매니저', value: 'MANAGER' },
    { label: '직원', value: 'WORKER' },
]

const statuses = [
    { label: '상태(전체)', value: '' },
    { label: '재직', value: 'ACTIVE' },
    { label: '휴직', value: 'INACTIVE' },
    { label: '퇴사', value: 'LOCK' },
]

// 선택 표시
const selectedRoleLabel = computed(() => {
    return roles.find(r => r.value === searchParams.value.role)?.label || '권한(전체)'
})
const selectedStatusLabel = computed(() => {
    return statuses.find(s => s.value === searchParams.value.status)?.label || '상태(전체)'
})

// 드롭다운 토글
const toggleRoleDropdown = () => {
    showRoleDropdown.value = !showRoleDropdown.value
    showStatusDropdown.value = false
}
const toggleStatusDropdown = () => {
    showStatusDropdown.value = !showStatusDropdown.value
    showRoleDropdown.value = false
}
const selectRole = (role) => {
    searchParams.value.role = role.value
    showRoleDropdown.value = false
}
const selectStatus = (status) => {
    searchParams.value.status = status.value
    showStatusDropdown.value = false
}

// 테이블 & 페이지 상태
const columns = [
    { key: 'email', label: '이메일', width: '20%' },
    { key: 'name', label: '이름', width: '10%' },
    { key: 'phoneNumber', label: '전화번호', width: '15%', align: 'center' },
    { key: 'role', label: '권한', width: '10%', align: 'center' },
    { key: 'status', label: '상태', width: '10%', align: 'center' },
]

const page = ref(0)
const size = ref(10)
const totalPages = ref(1)
const employees = ref([])

const currentPage = computed(() => page.value + 1)

// ✅ 기본 목록 조회
const fetchEmployees = async () => {
    const res = await member.memberList(page.value, size.value)
    const data = res.results
    totalPages.value = data.totalPages
    employees.value = data.content.map(item => ({
        id: item.id,
        email: item.email,
        name: item.name,
        phoneNumber: item.phoneNumber,
        role: item.role,
        status: item.status
    }))
}

// ✅ 검색 실행
const handleSearch = async () => {
    const res = await member.MemberSearch(page.value, size.value, searchParams.value)
    const data = res.results
    totalPages.value = data.totalPages
    employees.value = data.content.map(item => ({
        id: item.id,
        email: item.email,
        name: item.name,
        phoneNumber: item.phoneNumber,
        role: item.role,
        status: item.status
    }))
}

// ✅ 페이지 이동
const handlePageChange = async (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value) {
        page.value = newPage - 1
        await handleSearch()
    }
}

const handleReset = () => {
    // 검색 조건 초기화
    searchParams.value = {
        name: '',
        role: '',
        status: '',
        fromDate: '',
        toDate: ''
    }

    // 드롭다운 닫기
    showRoleDropdown.value = false
    showStatusDropdown.value = false

    // 페이지 초기화
    page.value = 0

    // 전체 직원 목록 다시 불러오기
    fetchEmployees()
}
const goDetail = (row) => router.push(`/employee/${row.id}`)

onMounted(fetchEmployees)
</script>
