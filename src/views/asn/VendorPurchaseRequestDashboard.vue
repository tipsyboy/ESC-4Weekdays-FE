<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Vendor Purchase Request</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">발주 요청 목록</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            로그인한 공급업체 계정 기준으로 전달된 발주 요청과 ASN 회신 여부를 확인합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="refresh" @click="loadPage">목록 새로고침</ButtonComp>
        </div>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.title"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.title }}</span>
          <span class="material-symbols-outlined text-slate-400">{{ card.icon }}</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ card.value }}</div>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ card.description }}</p>
      </article>
    </section>

    <section class="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">전달된 발주 요청</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">발주 완료된 건만 노출하고, ASN 회신 여부를 함께 보여줍니다.</p>
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
              <th class="px-6 py-4 text-left font-medium">발주서</th>
              <th class="px-6 py-4 text-left font-medium">요청자</th>
              <th class="px-6 py-4 text-left font-medium">요청 납기일</th>
              <th class="px-6 py-4 text-left font-medium">품목 / 수량</th>
              <th class="px-6 py-4 text-left font-medium">회신 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                목록을 불러오는 중입니다.
              </td>
            </tr>
            <tr v-else-if="errorMessage">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-rose-500">
                {{ errorMessage }}
              </td>
            </tr>
            <tr
              v-for="purchaseOrder in filteredPurchaseOrders"
              :key="purchaseOrder.id"
              class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
              @click="goDetail(purchaseOrder.id)"
            >
              <td class="px-6 py-5">
                <div class="font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.purchaseOrderNumber }}</div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(purchaseOrder.orderedAt || purchaseOrder.updatedAt) }}</div>
              </td>
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ purchaseOrder.requesterName || '-' }}</td>
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ purchaseOrder.expectedInboundDate || '-' }}</td>
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                {{ purchaseOrder.itemCount ?? purchaseOrder.items?.length ?? 0 }}종 / {{ purchaseOrder.totalQuantity || 0 }}개
              </td>
              <td class="px-6 py-5">
                <BadgeComp :color="replyStatusMeta(purchaseOrder).color" :label="replyStatusMeta(purchaseOrder).label" />
              </td>
            </tr>
            <tr v-if="!isLoading && !errorMessage && !filteredPurchaseOrders.length">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                조건에 맞는 발주 요청이 없습니다.
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
            :disabled="currentPage === 0 || isLoading"
            @click="movePage(currentPage - 1)"
          >
            이전
          </button>
          <div class="text-slate-500 dark:text-slate-400">{{ totalPages }} 페이지 중 {{ totalPages === 0 ? 0 : currentPage + 1 }}</div>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            :disabled="currentPage >= totalPages - 1 || isLoading || totalPages === 0"
            @click="movePage(currentPage + 1)"
          >
            다음
          </button>
        </div>
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
import vendorApi from '@/api/vendor/vendorApi.js'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

const purchaseOrders = ref([])
const selectedStatus = ref('ALL')
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(0)
const pageSize = 10
const totalElements = ref(0)
const totalPages = ref(0)
const summary = ref({
  totalCount: 0,
  noneCount: 0,
  doneCount: 0,
  rejectedCount: 0,
})

const statusTabs = [
  { value: 'ALL', label: '전체' },
  { value: 'NONE', label: '미회신' },
  { value: 'DONE', label: '회신완료' },
  { value: 'REJECTED', label: '회신불가' },
]

const hydratedPurchaseOrders = computed(() => purchaseOrders.value)
const pageEndIndex = computed(() =>
  totalElements.value === 0 ? 0 : Math.min((currentPage.value + 1) * pageSize, totalElements.value),
)

const filteredPurchaseOrders = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return hydratedPurchaseOrders.value
  }

  return hydratedPurchaseOrders.value.filter((item) => item.replyStatus === selectedStatus.value)
})

const summaryCards = computed(() => [
  {
    title: '전달된 발주',
    value: `${summary.value.totalCount}`,
    description: '현재 업체에 전달된 발주 완료 건',
    icon: 'receipt_long',
  },
  {
    title: '미회신',
    value: `${summary.value.noneCount}`,
    description: '아직 ASN 회신이 없는 건',
    icon: 'hourglass_empty',
  },
  {
    title: '회신완료',
    value: `${summary.value.doneCount}`,
    description: 'ASN 회신이 완료된 건',
    icon: 'task_alt',
  },
  {
    title: '회신불가',
    value: `${summary.value.rejectedCount}`,
    description: '수량 부족 등으로 수주가 어려운 건',
    icon: 'block',
  },
])

const replyStatusMeta = (purchaseOrder) => {
  const map = {
    NONE: { label: '미회신', color: 'warning' },
    DONE: { label: '회신완료', color: 'success' },
    REJECTED: { label: '회신불가', color: 'danger' },
  }

  return map[purchaseOrder.replyStatus] || map.NONE
}

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadPurchaseOrders = async (vendorId) => {
  isLoading.value = true
  errorMessage.value = ''

  const purchaseOrderRes = await vendorApi.getVendorPurchaseOrders(vendorId, {
    page: currentPage.value,
    size: pageSize,
  })
  if (!purchaseOrderRes.success) {
    purchaseOrders.value = []
    totalElements.value = 0
    totalPages.value = 0
    summary.value = { totalCount: 0, noneCount: 0, doneCount: 0 }
    errorMessage.value = purchaseOrderRes.message || '발주 요청 목록 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  purchaseOrders.value = (purchaseOrderRes.results?.content || []).filter((item) => item.status === 'ORDERED')
  totalElements.value = purchaseOrderRes.results?.totalElements || 0
  totalPages.value = purchaseOrderRes.results?.totalPages || 0
  summary.value = purchaseOrderRes.results?.summary || { totalCount: 0, noneCount: 0, doneCount: 0 }
  isLoading.value = false
}

const loadPage = async () => {
  if (!authStore.vendorId) {
    purchaseOrders.value = []
    totalElements.value = 0
    totalPages.value = 0
    summary.value = { totalCount: 0, noneCount: 0, doneCount: 0, rejectedCount: 0 }
    errorMessage.value = '연결된 공급업체 계정 정보가 없습니다.'
    return
  }

  await loadPurchaseOrders(authStore.vendorId)
}

const goDetail = (purchaseOrderId) => {
  router.push({
    name: 'vendorPurchaseRequestWorkspace',
    params: { id: String(purchaseOrderId) },
  })
}

const movePage = async (page) => {
  if (page < 0 || page >= totalPages.value || !authStore.vendorId) {
    return
  }

  currentPage.value = page
  await loadPurchaseOrders(authStore.vendorId)
}

onMounted(loadPage)
</script>
