<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">ASN</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">ASN</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            공급업체가 보낸 출하 예정 정보와 입고 예정 연결 상태를 관리합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="refresh" @click="loadAsns">목록 새로고침</ButtonComp>
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
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">ASN 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">공급업체 회신과 자동 생성된 입고 연결 상태를 관리합니다.</p>
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
                <th class="px-6 py-4 text-left font-medium">ASN</th>
                <th class="px-6 py-4 text-left font-medium">발주서</th>
                <th class="px-6 py-4 text-left font-medium">공급업체</th>
                <th class="px-6 py-4 text-left font-medium">예정 도착</th>
                <th class="px-6 py-4 text-left font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="asn in filteredAsns"
                :key="asn.id"
                class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                @click="router.push(`/asns/${asn.id}`)"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ asn.asnNumber }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ asn.vehicleInfo || '-' }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ asn.purchaseOrderNumber }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ asn.vendorName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ formatDateTime(asn.expectedArrivalAt) }}</td>
                <td class="px-6 py-5">
                  <BadgeComp :color="statusMeta(asn.status).color" :label="statusMeta(asn.status).label" />
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
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">ASN 대기</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">공급업체 회신을 기다리는 건</p>
            </div>
            <BadgeComp color="info" :label="`${waitingAsns.length}건`" />
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in waitingAsns"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.vendorName }}</div>
              <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.purchaseOrderNumber }}</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">도착 예정 {{ formatDateTime(item.expectedArrivalAt) }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">입고 예정 생성 대상</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">수주 불가로 회신된 발주 건</p>
            </div>
            <BadgeComp color="danger" :label="`${rejectedAsns.length}건`" />
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in rejectedAsns"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.asnNumber }}</div>
              <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorName }} · {{ item.contactName }}</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ item.note }}</div>
            </div>
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
import asnApi from '@/api/asn/asnApi.js'

const router = useRouter()
const asns = ref([])
const selectedStatus = ref('ALL')
const currentPage = ref(0)
const pageSize = 10
const totalElements = ref(0)
const totalPages = ref(0)
const summary = ref({
  totalCount: 0,
  waitingCount: 0,
  receivedCount: 0,
  scheduledCount: 0,
  rejectedCount: 0,
})

const statusTabs = [
  { value: 'ALL', label: '전체' },
  { value: 'WAITING', label: '대기' },
  { value: 'RECEIVED', label: '확인' },
  { value: 'SCHEDULED', label: '입고예정' },
  { value: 'REJECTED', label: '회신불가' },
]

const statusMeta = (status) => {
  const map = {
    WAITING: { label: '대기', color: 'info' },
    RECEIVED: { label: '확인', color: 'warning' },
    REJECTED: { label: '회신불가', color: 'danger' },
    SCHEDULED: { label: '입고예정', color: 'success' },
  }

  return map[status] || map.WAITING
}

const formatDateTime = (value) => {
  if (!value) return '-'

  return String(value)
    .replace('T', ' ')
    .slice(0, 16)
}

const loadAsns = async () => {
  const res = await asnApi.getAsns({
    page: currentPage.value,
    size: pageSize,
  })
  asns.value = res.results?.content || []
  totalElements.value = res.results?.totalElements || 0
  totalPages.value = res.results?.totalPages || 0
  summary.value = res.results?.summary || {
    totalCount: 0,
    waitingCount: 0,
    receivedCount: 0,
    scheduledCount: 0,
    rejectedCount: 0,
  }
}

onMounted(loadAsns)

const filteredAsns = computed(() => {
  if (selectedStatus.value === 'ALL') return asns.value
  return asns.value.filter((item) => item.status === selectedStatus.value)
})

const waitingAsns = computed(() => asns.value.filter((item) => item.status === 'WAITING').slice(0, 3))
const rejectedAsns = computed(() => asns.value.filter((item) => item.status === 'REJECTED').slice(0, 3))
const pageEndIndex = computed(() =>
  totalElements.value === 0 ? 0 : Math.min((currentPage.value + 1) * pageSize, totalElements.value),
)

const summaryCards = computed(() => [
  { title: '전체 ASN', value: `${summary.value.totalCount}`, description: '공급업체 회신 관리 대상', icon: 'local_shipping' },
  { title: '대기', value: `${summary.value.waitingCount}`, description: '아직 회신이 없는 발주', icon: 'hourglass' },
  { title: '입고연결', value: `${summary.value.scheduledCount}`, description: 'ASN 수신 후 입고서가 자동 생성된 건', icon: 'event_available' },
  { title: '회신불가', value: `${summary.value.rejectedCount}`, description: '수주 불가로 회신된 건', icon: 'block' },
])

const movePage = async (page) => {
  if (page < 0 || page >= totalPages.value) {
    return
  }

  currentPage.value = page
  await loadAsns()
}
</script>
