<template>
    <AppPageLayout>
        <!-- 헤더 -->
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900">작업 일정 캘린더</h1>
                    <p class="text-sm text-slate-500 mt-1">
                        입고 · 적치 · 출고 작업 일정을 한눈에 확인합니다.
                    </p>
                </div>
            </div>
        </template>

        <!-- 📅 캘린더 -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mt-6 shadow-sm">
            <!-- 월 이동 -->
            <div class="flex items-center justify-between mb-4">
                <ButtonComp size="sm" color="secondary" @click="prevMonth">이전 달</ButtonComp>
                <h2 class="text-lg font-semibold text-gray-800">{{ currentMonthLabel }}</h2>
                <ButtonComp size="sm" color="secondary" @click="nextMonth">다음 달</ButtonComp>
            </div>

            <!-- 요일 헤더 -->
            <div class="grid grid-cols-7 text-center border-t border-l border-gray-200">
                <div v-for="day in weekDays" :key="day"
                    class="py-2 border-r border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
                    {{ day }}
                </div>

                <!-- 날짜 셀 -->
                <div v-for="(day, idx) in calendarDays" :key="idx"
                    class="relative h-24 border-r border-b border-gray-200 p-1 text-left text-sm transition-colors duration-150 ease-in-out hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm cursor-pointer"
                    :class="{ 'bg-blue-50 ring-1 ring-blue-300': isToday(day) }" @click="openTaskList">
                    <div class="text-gray-700 font-medium mb-1" v-if="day">
                        {{ day.getDate() }}
                    </div>

                    <!-- 일정 목록 -->
                    <div v-if="day">
                        <div v-for="(task, index) in visibleTasks(day)" :key="task.id"
                            class="truncate text-xs px-2 py-1 rounded mb-1 cursor-pointer text-left"
                            :class="eventColor(task.type)">
                            {{ taskTypeLabel(task.type) }} 작업
                        </div>

                        <!-- ✅ 더보기 배지 -->
                        <div v-if="hiddenCount(day) > 0"
                            class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 cursor-pointer text-center">
                            +{{ hiddenCount(day) }} 더보기
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ✅ 오늘 일정 -->
        <div class="bg-white rounded-lg border border-gray-200 mt-6 shadow-sm">
            <div class="p-4 border-b border-gray-100">
                <h3 class="font-semibold text-gray-800">오늘의 작업 일정</h3>
            </div>
            <div v-if="todayTasks.length" class="divide-y divide-gray-100">
                <div v-for="task in todayTasks" :key="task.id"
                    class="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer" @click="openTaskList">
                    <div class="flex items-center gap-3">
                        <BadgeComp :type="statusColor(task.type)">
                            {{ taskTypeLabel(task.type) }}
                        </BadgeComp>
                        <span class="text-gray-800 text-sm">{{ taskTypeLabel(task.type) }} 작업</span>
                    </div>
                    <span class="text-gray-500 text-sm">{{ formatDate(task.date) }}</span>
                </div>
            </div>
            <div v-else class="p-4 text-gray-500 text-sm text-center">
                오늘 예정된 작업이 없습니다.
            </div>
        </div>
    </AppPageLayout>
</template>

<script setup>
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/format.js'
import { getStatusColor as statusColor } from '@/utils/statusMapper.js'

const router = useRouter()
const today = new Date()
const currentMonth = ref(new Date(today))
const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const tasks = ref([
    { id: 3, type: 'outbound', date: '2025-10-17', status: 'completed' },
    { id: 4, type: 'inbound', date: '2025-10-18', status: 'waiting' },
    { id: 5, type: 'outbound', date: '2025-10-18', status: 'pending' },
    { id: 6, type: 'placement', date: '2025-10-18', status: 'waiting' },
    { id: 7, type: 'inbound', date: '2025-10-19', status: 'completed' },
    { id: 9, type: 'outbound', date: '2025-10-19', status: 'waiting' },
    { id: 10, type: 'outbound', date: '2025-10-20', status: 'completed' },
    { id: 11, type: 'placement', date: '2025-10-20', status: 'waiting' },
    { id: 13, type: 'placement', date: '2025-10-21', status: 'waiting' },
    { id: 14, type: 'inbound', date: '2025-10-21', status: 'waiting' },
    { id: 15, type: 'outbound', date: '2025-10-21', status: 'waiting' },
])

// ✅ 월 표시
const currentMonthLabel = computed(() =>
    currentMonth.value.toLocaleString('ko-KR', { year: 'numeric', month: 'long' })
)

// ✅ 달 이동
const prevMonth = () => {
    const d = new Date(currentMonth.value)
    d.setMonth(d.getMonth() - 1)
    currentMonth.value = d
}
const nextMonth = () => {
    const d = new Date(currentMonth.value)
    d.setMonth(d.getMonth() + 1)
    currentMonth.value = d
}

// ✅ 날짜 유틸
const toDateKey = (dateObj) => {
    if (!dateObj) return ''
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

// ✅ 달력 날짜 생성
const calendarDays = computed(() => {
    const start = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
    const end = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0)
    const days = []
    for (let i = 0; i < start.getDay(); i++) days.push(null)
    for (let d = 1; d <= end.getDate(); d++) {
        days.push(new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), d))
    }
    return days
})

// ✅ 하루 일정
const tasksForDay = (day) => {
    if (!day) return []
    return tasks.value.filter((t) => t.date === toDateKey(day))
}

// ✅ 오늘 일정
const todayTasks = computed(() =>
    tasks.value.filter((t) => t.date === toDateKey(today))
)

// ✅ 오늘 여부
const isToday = (date) => toDateKey(date) === toDateKey(today)

// ✅ 하루 셀 표시 제한
const MAX_VISIBLE = 1
const visibleTasks = (day) => tasksForDay(day).slice(0, MAX_VISIBLE)
const hiddenCount = (day) => {
    const total = tasksForDay(day).length
    return total > MAX_VISIBLE ? total - MAX_VISIBLE : 0
}

// ✅ 색상
const eventColor = (type) => {
    switch (type) {
        case 'inbound':
            return 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
        case 'placement':
            return 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200'
        case 'outbound':
            return 'bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200'
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
    }
}

// ✅ 라벨
const taskTypeLabel = (type) => {
    switch (type) {
        case 'inbound':
            return '입고'
        case 'placement':
            return '적치'
        case 'outbound':
            return '출고'
        default:
            return '기타'
    }
}

// ✅ 클릭 → TaskList로 이동
const openTaskList = () => {
    router.push('/task/list')
}
</script>