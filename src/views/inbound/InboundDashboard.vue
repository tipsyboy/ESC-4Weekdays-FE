<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Inbound</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">입고</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            ASN 확인 이후 실제 입고 등록, 검수, 부분입고와 완료 처리를 관리합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="refresh" @click="loadInbounds">목록 새로고침</ButtonComp>
          <ButtonComp color="primary" icon="checklist" :disabled="!inboundRows.length" @click="openFirstInbound">입고 처리 보기</ButtonComp>
        </div>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.title"
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.title }}</span>
          <span class="material-symbols-outlined text-slate-400">{{ card.icon }}</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ card.value }}</div>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ card.description }}</p>
      </article>
    </section>

    <section class="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">입고 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">입고예정부터 완료까지 현재 처리 현황을 확인합니다.</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="tab in statusTabs"
                :key="tab.value"
                type="button"
                class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                :class="selectedStatus === tab.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
                @click="selectedStatus = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">입고번호</th>
                <th class="px-6 py-4 text-left font-medium">발주/ASN</th>
                <th class="px-6 py-4 text-left font-medium">공급업체</th>
                <th class="px-6 py-4 text-left font-medium">예정/실제</th>
                <th class="px-6 py-4 text-left font-medium">상태</th>
                <th class="px-6 py-4 text-left font-medium">검수 결과</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="inbound in filteredInbounds"
                :key="inbound.id"
                class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                @click="router.push(`/inbounds/${inbound.id}`)"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ inbound.inboundNumber }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ inbound.dock }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                  <div>{{ inbound.purchaseOrderNumber }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ inbound.asnNumber }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ inbound.vendorName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                  <div>{{ formatDateTime(inbound.expectedInboundAt) }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">실제 {{ formatDateTime(inbound.receivedAt) }}</div>
                </td>
                <td class="px-6 py-5">
                  <BadgeComp :color="statusMeta(inbound.status).color" :label="statusMeta(inbound.status).label" />
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {{ inbound.receivedQuantity }}/{{ inbound.expectedQuantity }}개
                  <span class="mt-1 block text-xs text-slate-500 dark:text-slate-400">불량 {{ inbound.defectQuantity }}개</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 text-sm dark:border-slate-800">
          <div class="text-slate-500 dark:text-slate-400">
            전체 {{ totalElements }}건 중
            {{ totalElements === 0 ? 0 : currentPage * pageSize + 1 }}-{{ pageEndIndex }}건 표시
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              :disabled="currentPage === 0"
              @click="movePage(currentPage - 1)"
            >
              이전
            </button>
            <div class="text-slate-500 dark:text-slate-400">{{ totalPages }} 페이지 중 {{ totalPages === 0 ? 0 : currentPage + 1 }}</div>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              :disabled="currentPage >= totalPages - 1 || totalPages === 0"
              @click="movePage(currentPage + 1)"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">오늘 우선 처리</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">도착했지만 아직 완료되지 않은 입고</p>
            </div>
            <BadgeComp color="warning" :label="`${todayPriorityRows.length}건`" />
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in todayPriorityRows"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.inboundNumber }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorName }} · {{ item.dock }}</div>
                  <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">예정 {{ item.expectedQuantity }}개 / 현재 {{ item.receivedQuantity }}개</div>
                </div>
                <BadgeComp :color="statusMeta(item.status).color" :label="statusMeta(item.status).label" />
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">다음 연결</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">입고 완료 후 재고 반영으로 이어집니다.</p>
            </div>
            <BadgeComp color="success" label="다음 단계" />
          </div>

          <div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            1차에서는 입고 완료까지 관리하고, 이후 재고 탭에서 위치별 재고 반영과 이력을 이어서 처리합니다.
          </div>
        </article>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import inboundApi from '@/api/inbound/inboundApi.js'

const router = useRouter()
const selectedStatus = ref('ALL')

const inboundRows = ref([])
const currentPage = ref(0)
const pageSize = 10
const totalElements = ref(0)
const totalPages = ref(0)
const summary = ref({
  totalCount: 0,
  plannedCount: 0,
  receivingCount: 0,
  partialCount: 0,
  completedCount: 0,
})

const statusTabs = [
  { value: 'ALL', label: '전체' },
  { value: 'PLANNED', label: '입고예정' },
  { value: 'RECEIVING', label: '입고중' },
  { value: 'PARTIAL', label: '부분입고' },
  { value: 'COMPLETED', label: '입고완료' },
]

const statusMeta = (status) => {
  const map = {
    PLANNED: { label: '입고예정', color: 'info' },
    RECEIVING: { label: '입고중', color: 'warning' },
    PARTIAL: { label: '부분입고', color: 'secondary' },
    COMPLETED: { label: '입고완료', color: 'success' },
  }

  return map[status] || map.PLANNED
}

const formatDateTime = (value) => {
  if (!value) return '-'

  return String(value)
    .replace('T', ' ')
    .slice(0, 16)
}

const loadInbounds = async () => {
  const res = await inboundApi.getInbounds({
    page: currentPage.value,
    size: pageSize,
  })
  if (!res.success) {
    alert(res.message || '입고 목록 조회에 실패했습니다.')
    return
  }

  inboundRows.value = res.results?.content || []
  totalElements.value = res.results?.totalElements || 0
  totalPages.value = res.results?.totalPages || 0
  summary.value = res.results?.summary || {
    totalCount: 0,
    plannedCount: 0,
    receivingCount: 0,
    partialCount: 0,
    completedCount: 0,
  }
}

onMounted(loadInbounds)

const filteredInbounds = computed(() => {
  if (selectedStatus.value === 'ALL') return inboundRows.value
  return inboundRows.value.filter((item) => item.status === selectedStatus.value)
})

const todayPriorityRows = computed(() =>
  inboundRows.value.filter((item) => ['PLANNED', 'RECEIVING', 'PARTIAL'].includes(item.status)).slice(0, 3),
)

const pageEndIndex = computed(() =>
  totalElements.value === 0 ? 0 : Math.min((currentPage.value + 1) * pageSize, totalElements.value),
)

const summaryCards = computed(() => [
  { title: '전체 입고', value: `${summary.value.totalCount}`, description: '현재 관리 중인 입고 문서', icon: 'inbox' },
  { title: '입고예정', value: `${summary.value.plannedCount}`, description: 'ASN 확인 후 생성된 예정 건', icon: 'event_note' },
  { title: '부분입고', value: `${summary.value.partialCount}`, description: '추가 입고 확인이 필요한 건', icon: 'difference' },
  { title: '입고완료', value: `${summary.value.completedCount}`, description: '검수와 수량 반영이 끝난 건', icon: 'inventory' },
])

const openFirstInbound = () => {
  if (!inboundRows.value.length) return
  router.push(`/inbounds/${inboundRows.value[0].id}`)
}

const movePage = async (page) => {
  if (page < 0 || page >= totalPages.value) {
    return
  }

  currentPage.value = page
  await loadInbounds()
}
</script>
