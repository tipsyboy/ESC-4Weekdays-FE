<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Vendor Portal</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">ASN</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            발주서 회신으로 생성된 ASN 문서와 입고 연결 상태를 확인합니다.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <label v-if="authStore.isAdmin" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span class="font-medium">공급업체</span>
            <select
              v-model="selectedVendorId"
              class="h-10 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-emerald-950"
              :disabled="isVendorLoading"
              @change="handleVendorChange"
            >
              <option value="">업체 선택</option>
              <option v-for="vendor in vendorOptions" :key="vendor.id" :value="String(vendor.id)">
                {{ vendor.name }}
              </option>
            </select>
          </label>
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
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">ASN 목록</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">생성된 ASN 문서를 기준으로 회신 결과를 확인합니다.</p>
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
              <th class="px-6 py-4 text-left font-medium">예정 도착</th>
              <th class="px-6 py-4 text-left font-medium">출하 담당</th>
              <th class="px-6 py-4 text-left font-medium">상태</th>
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
              v-for="asn in filteredAsns"
              :key="asn.id"
              class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
              @click="goDetail(asn)"
            >
              <td class="px-6 py-5">
                <div class="font-semibold text-slate-900 dark:text-slate-50">{{ asn.asnNumber }}</div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ asn.vehicleInfo || '-' }}</div>
              </td>
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ asn.purchaseOrderNumber }}</td>
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ asn.status === 'REJECTED' ? '-' : formatDateTime(asn.expectedArrivalAt) }}</td>
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ asn.contactName || '-' }}</td>
              <td class="px-6 py-5">
                <BadgeComp :color="statusMeta(asn.status).color" :label="statusMeta(asn.status).label" />
              </td>
            </tr>
            <tr v-if="!isLoading && !errorMessage && !filteredAsns.length">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                조건에 맞는 ASN이 없습니다.
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
import vendorPortalApi from '@/api/vendorPortal/vendorPortalApi.js'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

const asns = ref([])
const vendorOptions = ref([])
const selectedVendorId = ref('')
const selectedStatus = ref('ALL')
const isLoading = ref(false)
const isVendorLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(0)
const pageSize = 10
const totalElements = ref(0)
const totalPages = ref(0)

const activeVendorId = computed(() =>
  authStore.isAdmin ? selectedVendorId.value : authStore.vendorId,
)
const filteredAsns = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return asns.value
  }

  return asns.value.filter((item) => item.status === selectedStatus.value)
})
const pageEndIndex = computed(() =>
  totalElements.value === 0 ? 0 : Math.min((currentPage.value + 1) * pageSize, totalElements.value),
)
const summaryCards = computed(() => [
  { title: '전체 ASN', value: `${totalElements.value}`, description: '생성된 ASN 문서', icon: 'local_shipping' },
  { title: '입고예정', value: `${asns.value.filter((item) => item.status === 'SCHEDULED').length}`, description: '입고 연결이 완료된 건', icon: 'event_available' },
  { title: '회신불가', value: `${asns.value.filter((item) => item.status === 'REJECTED').length}`, description: '수주 불가로 회신된 건', icon: 'block' },
  { title: '확인대상', value: `${asns.value.filter((item) => item.status === 'RECEIVED').length}`, description: '내부 확인이 필요한 건', icon: 'task_alt' },
])

const statusTabs = [
  { value: 'ALL', label: '전체' },
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

const loadAsns = async (vendorId) => {
  isLoading.value = true
  errorMessage.value = ''

  const res = await vendorPortalApi.getAsns({
    vendorId: authStore.isAdmin ? vendorId : undefined,
    page: currentPage.value,
    size: pageSize,
  })

  if (!res.success) {
    asns.value = []
    totalElements.value = 0
    totalPages.value = 0
    errorMessage.value = res.message || 'ASN 목록 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  asns.value = res.results?.content || []
  totalElements.value = res.results?.totalElements || 0
  totalPages.value = res.results?.totalPages || 0
  isLoading.value = false
}

const loadVendorOptions = async () => {
  if (!authStore.isAdmin) {
    return
  }

  isVendorLoading.value = true
  const res = await vendorApi.getVendors({
    page: 0,
    size: 200,
    sortBy: 'name',
    sortDirection: 'asc',
  })
  vendorOptions.value = res.success ? (res.results?.content || []) : []
  selectedVendorId.value = selectedVendorId.value || String(vendorOptions.value[0]?.id || '')
  isVendorLoading.value = false
}

const loadPage = async () => {
  const vendorId = activeVendorId.value
  if (!vendorId) {
    asns.value = []
    totalElements.value = 0
    totalPages.value = 0
    errorMessage.value = authStore.isAdmin ? '조회할 공급업체를 선택하세요.' : '연결된 공급업체 계정 정보가 없습니다.'
    return
  }

  await loadAsns(vendorId)
}

const handleVendorChange = async () => {
  currentPage.value = 0
  await loadPage()
}

const movePage = async (page) => {
  if (page < 0 || page >= totalPages.value) {
    return
  }

  currentPage.value = page
  await loadPage()
}

const goDetail = (asn) => {
  router.push({
    name: 'vendorAsnWorkspace',
    params: { id: String(asn.purchaseOrderId) },
  })
}

onMounted(async () => {
  await loadVendorOptions()
  await loadPage()
})
</script>
