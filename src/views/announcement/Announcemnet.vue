<template>
    <AppPageLayout>
        <!-- 헤더 -->
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">공지사항</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        운영 및 작업 관련 공지사항을 관리합니다.
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <ButtonComp v-if="auth.isAdmin" color="primary" icon="add" @click="goCreate">신규 공지</ButtonComp>
                </div>
            </div>
        </template>

        <!-- 본문 -->
        <section class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 md:p-8 space-y-6">
            <!-- 🔹 필터 영역 -->
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
               rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <SearchBarComp v-model="searchQuery" placeholder="제목으로 검색" class="md:col-span-1" />
                <div class="flex items-center gap-2">
                    <input type="date" v-model="filters.startDate"
                        class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                    <span>~</span>
                    <input type="date" v-model="filters.endDate"
                        class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
            </div>

            <TableComp :columns="columns" :data="filteredList" class="min-h-[400px]">
                <template #cell="{ row, col }">
                    <!-- 제목 컬럼 -->
                    <span v-if="col.key === 'title'" class="text-indigo-600 hover:underline cursor-pointer"
                        @click="goDetail(row)">
                        {{ row[col.key] }}
                    </span>

                    <!-- 번호 컬럼: pinned면 '중요' 버튼 -->
                    <template v-else-if="col.key === 'id'">
                        <div class="flex justify-center">
                            <ButtonComp v-if="row.pinned" color="danger" size="sm"
                                class="font-semibold cursor-default select-none">
                                중요
                            </ButtonComp>
                            <span v-else class="text-center w-full">{{ row[col.key] }}</span>
                        </div>
                    </template>

                    <!-- 기본 -->
                    <span v-else>{{ row[col.key] }}</span>
                </template>
            </TableComp>

            <!-- 페이지네이션 -->
            <div class="flex justify-center items-center gap-2">
                <ButtonComp color="secondary" icon="arrow_back" :disabled="page === 0" @click="changePage(page - 1)" />
                <span class="text-sm text-slate-600">페이지 {{ page + 1 }} / {{ totalPages }}</span>
                <ButtonComp color="secondary" icon="arrow_forward" :disabled="page >= totalPages - 1"
                    @click="changePage(page + 1)" />
            </div>
        </section>
    </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import announcementApi from '@/api/announcement/index.js'
import { formatDate } from '@/utils/date.js'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const searchQuery = ref('')
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)
const announcementList = ref([])
const auth = useAuthStore()

const filters = ref({
    startDate: '',
    endDate: '',
})

const columns = [
    { label: '번호', key: 'id', width: '10%' },
    { label: '제목', key: 'title', width: '50%' },
    { label: '작성자', key: 'name', width: '20%' },
    { label: '작성일', key: 'createdAt', width: '20%' },
]

// ✅ 공지사항 데이터 로드
const fetchAnnouncements = async () => {
    const res = await announcementApi.announcementList(page.value, size.value)
    const data = res.results
    totalPages.value = data.totalPages
    console.log(res)
    const list = data.content.filter(item => item.active !== false).map(item => ({
        id: item.id,
        title: item.title,
        name: item.name,
        createdAt: formatDate(item.createdAt),
        pinned: item.pinned
    }))

    announcementList.value = list
}

const filteredList = computed(() => {
    let list = [...announcementList.value]

    if (searchQuery.value) {
        list = list.filter(item =>
            item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (filters.value.startDate && filters.value.endDate) {
        const start = new Date(filters.value.startDate)
        const end = new Date(filters.value.endDate)
        end.setHours(23, 59, 59, 999); // endDate의 시간을 마지막으로 설정

        list = list.filter(item => {
            const itemDate = new Date(item.createdAt)
            return itemDate >= start && itemDate <= end
        })
    }

    return list
})

const changePage = newPage => {
    if (newPage < 0 || newPage >= totalPages.value) return
    page.value = newPage
    fetchAnnouncements()
}

const goDetail = row => router.push(`/announcement/${row.id}`)
const goCreate = () => router.push('/announcement/create')

onMounted(fetchAnnouncements)
</script>
