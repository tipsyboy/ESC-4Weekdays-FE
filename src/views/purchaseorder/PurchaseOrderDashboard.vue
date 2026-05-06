<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Purchase Order</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">발주</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            발주 요청, 내부 승인, 실제 발주 전달 완료까지 관리합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="refresh" @click="refreshAll">목록 새로고침</ButtonComp>
          <ButtonComp color="primary" icon="note_add" @click="router.push('/purchase-orders/create')">발주 요청 등록</ButtonComp>
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

    <section class="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">발주 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">발주 탭은 실제 공급업체 전달 완료 시점까지만 관리합니다.</p>
            </div>

            <div class="flex w-full flex-col gap-3 xl:w-auto xl:items-end">
              <div class="flex flex-wrap items-center gap-2">
                <ButtonComp color="secondary" icon="filter_alt" @click="isSearchModalOpen = true">상세 검색</ButtonComp>
                <ButtonComp v-if="hasActiveSearch" color="secondary" icon="filter_alt_off" @click="resetSearch">검색 초기화</ButtonComp>
                <select
                  v-model="sortOption"
                  class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="updatedAt:desc">최근 수정순</option>
                  <option value="requestedAt:desc">요청일 최신순</option>
                  <option value="expectedInboundDate:asc">예정 입고일 빠른순</option>
                  <option value="orderedAt:desc">발주 전달일 최신순</option>
                </select>
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
        </div>

        <div v-if="hasActiveSearch" class="flex flex-wrap gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            v-for="chip in activeSearchChips"
            :key="chip.key"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
            @click="removeSearchChip(chip.key)"
          >
            {{ chip.label }}: {{ chip.value }}
            <span class="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>

        <div class="overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">발주서</th>
                <th class="px-6 py-4 text-left font-medium">공급업체</th>
                <th class="px-6 py-4 text-left font-medium">요청자</th>
                <th class="px-6 py-4 text-left font-medium">품목/금액</th>
                <th class="px-6 py-4 text-left font-medium">상태</th>
                <th class="px-6 py-4 text-left font-medium">예정 입고일</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="listLoading">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">목록을 불러오는 중입니다.</td>
              </tr>
              <tr v-else-if="listError">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-rose-500">{{ listError }}</td>
              </tr>
              <tr
                v-for="purchaseOrder in purchaseOrders"
                :key="purchaseOrder.id"
                class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                @click="goDetail(purchaseOrder.id)"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ purchaseOrder.purchaseOrderNumber }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(purchaseOrder.requestedAt) }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ purchaseOrder.vendorName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ purchaseOrder.requesterName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {{ purchaseOrder.totalQuantity }}개 · {{ formatPrice(purchaseOrder.totalAmount) }}
                </td>
                <td class="px-6 py-5">
                  <BadgeComp :color="statusMeta(purchaseOrder.status).color" :label="statusMeta(purchaseOrder.status).label" />
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ purchaseOrder.expectedInboundDate || '-' }}</td>
              </tr>
              <tr v-if="!listLoading && !listError && !purchaseOrders.length">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">조건에 맞는 발주가 없습니다.</td>
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
              :disabled="currentPage === 0 || listLoading"
              @click="movePage(currentPage - 1)"
            >
              이전
            </button>
            <div class="text-slate-500 dark:text-slate-400">{{ totalPages }} 페이지 중 {{ totalPages === 0 ? 0 : currentPage + 1 }}</div>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              :disabled="currentPage >= totalPages - 1 || listLoading || totalPages === 0"
              @click="movePage(currentPage + 1)"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">승인 대기</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">관리자 확인이 필요한 발주 요청</p>
            </div>
            <BadgeComp color="warning" :label="`${approvalPendingOrders.length}건`" />
          </div>

          <div v-if="approvalPendingOrders.length" class="mt-5 space-y-3">
            <div
              v-for="item in approvalPendingOrders"
              :key="item.id"
              class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              @click="goDetail(item.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.purchaseOrderNumber }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorName }} · {{ item.requesterName }}</div>
                  <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ item.requestMemo || '요청 메모 없음' }}</div>
                </div>
                <BadgeComp color="warning" label="승인대기" />
              </div>
            </div>
          </div>

          <div
            v-else
            class="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
          >
            현재 승인 대기 중인 발주가 없습니다.
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">발주 완료 대기열</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">ASN으로 이어질 준비가 된 발주를 확인합니다.</p>
            </div>
            <ButtonComp color="secondary" icon="arrow_forward" @click="router.push('/asns')">ASN 보기</ButtonComp>
          </div>

          <div v-if="orderedBridgeOrders.length" class="mt-5 space-y-3">
            <div
              v-for="item in orderedBridgeOrders"
              :key="item.id"
              class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              @click="goDetail(item.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.purchaseOrderNumber }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorName }} · {{ item.requesterName }}</div>
                  <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">예정 입고일 {{ item.expectedInboundDate || '-' }}</div>
                </div>
                <BadgeComp color="primary" label="ASN 준비" />
              </div>
            </div>
          </div>

          <div
            v-else
            class="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
          >
            아직 ASN으로 넘길 발주 완료 건이 없습니다.
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">최근 변경</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">최근 등록 또는 상태 변경된 발주</p>
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in recentChanges"
              :key="item.id"
              class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              @click="goDetail(item.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.purchaseOrderNumber }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorName }} · {{ statusMeta(item.status).label }}</div>
                </div>
                <div class="text-xs text-slate-400">{{ formatDate(item.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <PurchaseOrderSearchModal
      :is-open="isSearchModalOpen"
      :initial-params="searchParams"
      @close="isSearchModalOpen = false"
      @search="applySearch"
    />
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import purchaseOrderApi from '@/api/purchaseorder/purchaseOrderApi.js'
import PurchaseOrderSearchModal from '@/views/purchaseorder/PurchaseOrderSearchModal.vue'

const router = useRouter()
const purchaseOrders = ref([])
const isSearchModalOpen = ref(false)
const selectedStatus = ref('ALL')
const sortOption = ref('updatedAt:desc')
const currentPage = ref(0)
const pageSize = 8
const listLoading = ref(false)
const listError = ref('')
const totalElements = ref(0)
const totalPages = ref(0)

const searchParams = reactive({
  vendorName: '',
  requesterName: '',
  status: '',
  expectedInboundDate: '',
  approverName: '',
  purchaseOrderNumber: '',
  memoKeyword: '',
})

const statusTabs = [
  { value: 'ALL', label: '전체' },
  { value: 'DRAFT', label: '작성중' },
  { value: 'APPROVAL_PENDING', label: '승인대기' },
  { value: 'APPROVED', label: '승인완료' },
  { value: 'ORDERED', label: '발주완료' },
]

const statusMeta = (status) => {
  const map = {
    DRAFT: { label: '작성중', color: 'gray' },
    APPROVAL_PENDING: { label: '승인대기', color: 'warning' },
    APPROVED: { label: '승인완료', color: 'success' },
    REJECTED: { label: '반려', color: 'danger' },
    CANCELED: { label: '취소', color: 'gray' },
    ORDERED: { label: '발주완료', color: 'primary' },
  }

  return map[status] || map.DRAFT
}

const formatPrice = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`
const formatDateTime = (value) => value?.replace('T', ' ').slice(0, 16) || '-'
const formatDate = (value) => value?.slice(0, 10) || '-'

const buildListParams = () => {
  const [sortBy, sortDirection] = sortOption.value.split(':')

  return {
    page: currentPage.value,
    size: pageSize,
    vendorName: searchParams.vendorName || undefined,
    requesterName: searchParams.requesterName || undefined,
    status: searchParams.status || (selectedStatus.value !== 'ALL' ? selectedStatus.value : undefined),
    expectedInboundDate: searchParams.expectedInboundDate || undefined,
    approverName: searchParams.approverName || undefined,
    purchaseOrderNumber: searchParams.purchaseOrderNumber || undefined,
    memoKeyword: searchParams.memoKeyword || undefined,
    sortBy,
    sortDirection,
  }
}

const refreshAll = async () => {
  listLoading.value = true
  listError.value = ''

  const res = await purchaseOrderApi.getPurchaseOrders(buildListParams())

  if (!res.success) {
    purchaseOrders.value = []
    totalElements.value = 0
    totalPages.value = 0
    listError.value = res.message || '발주 목록 조회에 실패했습니다.'
    listLoading.value = false
    return
  }

  purchaseOrders.value = res.results?.content || []
  totalElements.value = res.results?.totalElements || 0
  totalPages.value = res.results?.totalPages || 0
  listLoading.value = false
}

onMounted(refreshAll)

const hasActiveSearch = computed(() =>
  Object.values(searchParams).some((value) => String(value || '').trim() !== ''),
)

const activeSearchChips = computed(() => {
  const labels = {
    vendorName: '공급업체',
    requesterName: '요청자',
    status: '상태',
    expectedInboundDate: '예정 입고일',
    approverName: '승인자',
    purchaseOrderNumber: '발주서',
    memoKeyword: '메모',
  }

  return Object.entries(searchParams)
    .filter(([, value]) => String(value || '').trim() !== '')
    .map(([key, value]) => ({
      key,
      label: labels[key],
      value: key === 'status' ? statusMeta(value).label : value,
    }))
})

const applySearch = (params) => {
  Object.assign(searchParams, params)
  currentPage.value = 0
  refreshAll()
}

const removeSearchChip = (key) => {
  searchParams[key] = ''
  currentPage.value = 0
  refreshAll()
}

const resetSearch = () => {
  Object.assign(searchParams, {
    vendorName: '',
    requesterName: '',
    status: '',
    expectedInboundDate: '',
    approverName: '',
    purchaseOrderNumber: '',
    memoKeyword: '',
  })
  currentPage.value = 0
  refreshAll()
}

const approvalPendingOrders = computed(() =>
  purchaseOrders.value.filter((item) => item.status === 'APPROVAL_PENDING').slice(0, 3),
)

const orderedBridgeOrders = computed(() =>
  purchaseOrders.value.filter((item) => item.status === 'ORDERED').slice(0, 3),
)

const recentChanges = computed(() =>
  purchaseOrders.value.slice(0, 4),
)

const pageEndIndex = computed(() => {
  const end = (currentPage.value + 1) * pageSize
  return Math.min(end, totalElements.value)
})

watch([sortOption, selectedStatus], () => {
  currentPage.value = 0
  refreshAll()
})

const movePage = (page) => {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  refreshAll()
}

const goDetail = (id) => {
  router.push(`/purchase-orders/${id}`)
}

const summaryCards = computed(() => [
  { title: '작성중', value: `${purchaseOrders.value.filter((item) => item.status === 'DRAFT').length}`, description: '아직 제출되지 않은 발주 초안', icon: 'draft' },
  { title: '승인 대기', value: `${purchaseOrders.value.filter((item) => item.status === 'APPROVAL_PENDING').length}`, description: '매니저 확인이 필요한 요청', icon: 'approval' },
  { title: '승인 완료', value: `${purchaseOrders.value.filter((item) => item.status === 'APPROVED').length}`, description: '발주 전달 전 최종 확인 대상', icon: 'check_circle' },
  { title: '반려', value: `${purchaseOrders.value.filter((item) => item.status === 'REJECTED').length}`, description: '재확인이나 재작성 필요한 요청', icon: 'assignment_late' },
])
</script>
