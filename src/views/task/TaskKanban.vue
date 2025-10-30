<template>
    <AppPageLayout>
        <!-- Header -->
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">작업 관리</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        물류센터 내 모든 작업을 단계별로 조회하고 관리합니다.
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <RouterLink to="/task/create" class="w-40">
                        <ButtonComp color="primary" icon="add">신규 작업</ButtonComp>
                    </RouterLink>
                    <SearchBarComp v-model="query" placeholder="작업 검색..." @search="handleSearch" />
                </div>
            </div>
        </template>

        <!-- 🔹 칸반 보드 -->
        <section
            class="flex gap-6 overflow-x-auto pb-4 h-[80vh] scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600">
            <div v-for="(column, index) in columns" :key="column.status"
                class="flex-shrink-0 w-[360px] h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 flex flex-col">
                <!-- 컬럼 헤더 -->
                <h2
                    class="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-3">
                    {{ column.label }}
                    <BadgeComp :color="column.color" :label="column.list.length.toString()" />
                </h2>

                <!-- 작업 리스트 (드래그앤드롭 가능) -->
                <div class="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                    @dragover.prevent @drop="onDrop(column.status)">
                    <div v-for="task in column.list" :key="task.id"
                        class="p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 hover:shadow-md transition-all cursor-grab"
                        draggable="true" @dragstart="onDragStart(task)">
                        <RouterLink :to="`/task/detail/${task.id}`"
                            class="font-semibold text-primary hover:underline block truncate">
                            {{ categoryLabel(task.category) }}
                        </RouterLink>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            담당자: {{ task.workerName || '미할당' }}
                        </p>
                        <p class="text-xs text-slate-400 dark:text-slate-500">
                            요약: {{ statusLabel(task.inboundSummary) }}
                        </p>
                    </div>

                    <p v-if="column.list.length === 0" class="text-sm text-slate-400 text-center italic mt-3">
                        작업이 없습니다.
                    </p>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <template #footer>
            <p class="text-xs text-gray-400 text-right">최근 업데이트: {{ lastUpdated }}</p>
        </template>
    </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import api from '@/plugin/axiosInterceptor'           // ✅ axios 인스턴스
import taskApi from '@/api/task'  // ✅ task API wrapper

// ✅ 한글 매핑
const categoryMap = {
    INSPECTION: '입고 검수',
    PUTAWAY: '입고 적치',
    PICKING: '출고 피킹',
    PACKING: '출고 포장',
}

const statusMap = {
    PENDING: '할당 대기',
    ASSIGNED: '할당됨',
    IN_PROGRESS: '진행 중',
    COMPLETED: '완료',
    CANCELLED: '취소됨',
}

const categoryLabel = (key) => categoryMap[key] || key
const statusLabel = (key) => statusMap[key] || key

const query = ref('')
const lastUpdated = ref('2025-10-27 16:00')

// ✅ 상태별 컬럼
const columns = ref([
    { label: '할당 대기 (Pending)', status: 'PENDING', color: 'gray', list: [] },
    { label: '할당됨 (Assigned)', status: 'ASSIGNED', color: 'blue', list: [] },
    { label: '진행 중 (In Progress)', status: 'IN_PROGRESS', color: 'yellow', list: [] },
    { label: '완료됨 (Completed)', status: 'COMPLETED', color: 'green', list: [] },
    { label: '취소됨 (Cancelled)', status: 'CANCELLED', color: 'red', list: [] },
])

// ✅ 전체 작업 불러오기
const fetchTasks = async () => {
    try {
        const res = await taskApi.taskList(0, 100)
        const data = res.results
        if (data && data.content) groupTasks(data.content)
    } catch (error) {
        console.error('작업 목록 불러오기 실패:', error)
    }
}

// ✅ 상태별 그룹화
const groupTasks = (tasks) => {
    columns.value.forEach((col) => {
        col.list = tasks.filter((t) => t.status === col.status)
    })
}

// ✅ 검색 (필터링 예정)
const handleSearch = () => {
    console.log('검색 실행:', query.value)
}

// ✅ 드래그앤드롭 상태 변경
let draggedTask = null

const onDragStart = (task) => {
    draggedTask = task
}

const onDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) return

    try {
        let endpoint = ''

        if (newStatus === 'ASSIGNED') {
            endpoint = `/api/tasks/${draggedTask.id}/assign`
        } else if (newStatus === 'IN_PROGRESS') {
            endpoint = `/api/tasks/${draggedTask.id}/start`
        } else if (newStatus === 'COMPLETED') {
            endpoint = `/api/tasks/${draggedTask.id}/complete`
        } else if (newStatus === 'CANCELLED') {
            endpoint = `/api/tasks/${draggedTask.id}/cancel?reason=관리자취소`
        }

        if (!endpoint) return

        await api.post(endpoint)

        // 상태 업데이트
        draggedTask.status = newStatus
        groupTasks([
            ...columns.value.flatMap((c) => c.list).map((t) =>
                t.id === draggedTask.id ? { ...t, status: newStatus } : t
            ),
        ])
    } catch (err) {
        console.error('상태 변경 실패:', err)
    } finally {
        draggedTask = null
    }
}

onMounted(fetchTasks)
</script>
