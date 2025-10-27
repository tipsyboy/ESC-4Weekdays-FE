<template>
    <AppPageLayout>
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">직원 관리</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">직원 목록을 조회하고 관리합니다.</p>
                </div>

                <div class="flex items-center gap-3">
                    <!-- 신규 직원 등록 -->
                    <RouterLink to="/employee/create" class="w-40">
                        <ButtonComp color="primary" icon="add">직원 등록</ButtonComp>
                    </RouterLink>

                    <!-- 검색창 -->
                    <SearchBarComp v-model="query" placeholder="직원 검색..." @search="handleSearch" />
                </div>
            </div>
        </template>

        <!-- 필터 버튼 영역 -->
        <div class="flex flex-wrap items-center gap-3 mb-8">
            <button v-for="filter in filters" :key="filter"
                class="flex items-center gap-2 rounded border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <span>{{ filter }}</span>
                <span class="material-symbols-outlined text-base">expand_more</span>
            </button>
        </div>

        <!-- 데이터 테이블 -->
        <TableComp :columns="columns" :data="filteredEmployees">
            <template #cell-name="{ row }">
                <span @click="goDetail(row)" class="text-sky-500 hover:underline">{{ row.name }}</span>
            </template>
            <!-- 상태 컬럼 -->
            <template #cell-status="{ row }">
                <BadgeComp :color="getStatusColor(row.status)" :label="getStatusLabel(row.status)" />
            </template>
            <!-- 권한 컬럼 -->
            <template #cell-role="{ row }">
                <BadgeComp :color="getStatusColor(row.role)" :label="getStatusLabel(row.role)" />
            </template>
        </TableComp>

        <!-- 페이지네이션 -->

        <div class="flex justify-center items-center gap-2">

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
import { getStatusLabel, getStatusColor } from '@/utils/statusMapper.js'
import member from '@/api/member'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'

const router = useRouter()

// 검색어 상태
const query = ref('')

// 필터 버튼
const filters = ['부서', '권한', '상태']

// 테이블 컬럼
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

const fetchEmployees = async () => {
    const res = await member.memberList(page.value, size.value)
    const data = res.results
    totalPages.value = data.totalPages

    employees.value = data.content.map((item) => ({
        id: item.id,
        email: item.email,
        name: item.name,
        phoneNumber: item.phoneNumber,
        role: item.role,
        status: item.status,
    }))
}

const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value) {
        page.value = newPage - 1
        fetchEmployees()
    }
}

const currentPage = computed(() => page.value + 1)

onMounted(() => {
    fetchEmployees()
})

// ✅ 검색 결과 필터링
const filteredEmployees = computed(() => {
    if (!query.value) return employees.value
    return employees.value.filter((emp) =>
        Object.values(emp).some((val) =>
            String(val).toLowerCase().includes(query.value.toLowerCase())
        )
    )
})

// 검색 실행
const handleSearch = () => {

    console.log('검색 실행:', query.value)
}
const goDetail = (row) => {
    router.push(`/employee/${row.id}`)
}
</script>
