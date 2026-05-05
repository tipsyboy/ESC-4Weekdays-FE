<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Vendor</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">공급업체 관리</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            공급업체 기준정보를 관리하는 화면입니다. 공급업체명, 코드, 거래 상태, 담당자, 연락처를 우선 관리합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="refresh" @click="loadVendors">목록 새로고침</ButtonComp>
          <ButtonComp color="primary" icon="add_business" @click="router.push('/vendors/create')">공급업체 등록</ButtonComp>
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
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">공급업체 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">거래 상태와 기본 연락 정보를 확인합니다.</p>
            </div>

          <div class="flex flex-wrap items-center gap-2">
            <ButtonComp color="secondary" icon="filter_alt" @click="isSearchModalOpen = true">상세 검색</ButtonComp>
            <ButtonComp v-if="hasActiveSearch" color="secondary" icon="filter_alt_off" @click="resetSearch">검색 초기화</ButtonComp>
            <select
              v-model="sortOption"
              class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="updatedAt:desc">최근 수정순</option>
              <option value="createdAt:desc">최근 등록순</option>
              <option value="name:asc">이름 오름차순</option>
              <option value="name:desc">이름 내림차순</option>
            </select>
          </div>
        </div>

        <div v-if="hasActiveSearch" class="flex flex-wrap gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            v-for="chip in activeSearchChips"
            :key="chip.key"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200 dark:hover:bg-cyan-950/50"
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
                <th class="px-6 py-4 text-left font-medium">공급업체</th>
                <th class="px-6 py-4 text-left font-medium">코드</th>
                <th class="px-6 py-4 text-left font-medium">담당자</th>
                <th class="px-6 py-4 text-left font-medium">연락처</th>
                <th class="px-6 py-4 text-left font-medium">상태</th>
                <th class="px-6 py-4 text-left font-medium">수정일</th>
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
                v-for="vendor in pagedVendors"
                :key="vendor.id"
                class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                @click="goDetail(vendor.id)"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ vendor.name }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ vendor.email || '-' }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ vendor.vendorCode }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ vendor.managerName || '-' }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ vendor.phoneNumber || '-' }}</td>
                <td class="px-6 py-5">
                  <BadgeComp :color="statusMeta(vendor.status).color" :label="statusMeta(vendor.status).label" />
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ formatDate(vendor.updatedAt) }}</td>
              </tr>
              <tr v-if="!listLoading && !listError && pagedVendors.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">표시할 공급업체가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            총 {{ totalElements }}건 중 {{ pageStart }}-{{ pageEnd }}건
          </div>

          <div class="flex items-center gap-2">
            <button
              class="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              :disabled="currentPage === 0 || listLoading"
              @click="movePage(currentPage - 1)"
            >
              이전
            </button>
            <button
              v-for="page in pageNumbers"
              :key="page"
              class="rounded-full px-3 py-2 text-sm font-medium"
              :class="pageButtonClass(page - 1)"
              :disabled="listLoading"
              @click="movePage(page - 1)"
            >
              {{ page }}
            </button>
            <button
              class="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              :disabled="currentPage >= totalPages - 1 || listLoading || totalPages === 0"
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
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">거래 대기 업체</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">거래 시작 전 확인이 필요한 공급업체</p>
            </div>
            <span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
              {{ pendingVendors.length }}건
            </span>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in pendingVendors"
              :key="item.id"
              class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              @click="goDetail(item.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.name }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorCode }} · {{ item.managerName || '-' }}</div>
                </div>
                <BadgeComp :color="statusMeta(item.status).color" :label="statusMeta(item.status).label" />
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">최근 변경</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">최근 등록 또는 수정된 공급업체</p>
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in recentChanges"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.name }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorCode }} · {{ statusMeta(item.status).label }}</div>
                </div>
                <div class="text-xs text-slate-400">{{ formatDate(item.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <VendorSearchModal
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
import VendorSearchModal from '@/views/vendor/VendorSearchModal.vue'
import vendorApi from '@/api/vendor/vendorApi.js'

const router = useRouter()
const isSearchModalOpen = ref(false)
const sortOption = ref('updatedAt:desc')
const summaryVendors = ref([])
const pagedVendors = ref([])
const currentPage = ref(0)
const pageSize = 8
const totalPages = ref(0)
const totalElements = ref(0)
const listLoading = ref(false)
const listError = ref('')
const searchParams = reactive({
  name: '',
  vendorCode: '',
  managerName: '',
  phoneNumber: '',
  email: '',
  status: '',
})

const statusMeta = (status) => {
  if (status === 'TRADING') return { label: '거래중', color: 'success' }
  if (status === 'PENDING') return { label: '거래대기', color: 'warning' }
  return { label: '거래중지', color: 'gray' }
}

const formatDate = (value) => value?.slice(0, 10) || '-'

const loadVendorSummary = async () => {
  const res = await vendorApi.getVendors({
    page: 0,
    size: 1000,
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  })

  if (!res.success) return
  summaryVendors.value = res.results.content || []
}

const loadVendorPage = async () => {
  listLoading.value = true
  listError.value = ''

  const [sortBy, sortDirection] = sortOption.value.split(':')
  const params = {
    page: currentPage.value,
    size: pageSize,
    sortBy,
    sortDirection,
  }

  if (searchParams.name) params.name = searchParams.name
  if (searchParams.vendorCode) params.vendorCode = searchParams.vendorCode
  if (searchParams.managerName) params.managerName = searchParams.managerName
  if (searchParams.phoneNumber) params.phoneNumber = searchParams.phoneNumber
  if (searchParams.email) params.email = searchParams.email
  if (searchParams.status) params.status = searchParams.status

  const res = await vendorApi.getVendors(params)

  if (!res.success) {
    listError.value = res.message
    pagedVendors.value = []
    totalPages.value = 0
    totalElements.value = 0
    listLoading.value = false
    return
  }

  pagedVendors.value = res.results.content || []
  totalPages.value = res.results.totalPages || 0
  totalElements.value = res.results.totalElements || 0
  listLoading.value = false
}

const loadVendors = async () => {
  await Promise.all([loadVendorSummary(), loadVendorPage()])
}

onMounted(loadVendors)

const summaryCards = computed(() => [
  { title: '전체 공급업체', value: `${summaryVendors.value.length}`, description: '현재 등록된 공급업체 수', icon: 'storefront' },
  { title: '거래중 업체', value: `${summaryVendors.value.filter((vendor) => vendor.status === 'TRADING').length}`, description: '현재 거래 가능한 공급업체', icon: 'check_circle' },
  { title: '거래대기 업체', value: `${summaryVendors.value.filter((vendor) => vendor.status === 'PENDING').length}`, description: '검토 또는 초기 등록 단계', icon: 'hourglass_top' },
  { title: '거래중지 업체', value: `${summaryVendors.value.filter((vendor) => vendor.status === 'STOPPED').length}`, description: '현재 신규 거래 중지 상태', icon: 'pause_circle' },
])

const hasActiveSearch = computed(() =>
  Object.values(searchParams).some((value) => String(value || '').trim() !== ''),
)

const activeSearchChips = computed(() => {
  const chips = []

  if (searchParams.name) chips.push({ key: 'name', label: '공급업체명', value: searchParams.name })
  if (searchParams.vendorCode) chips.push({ key: 'vendorCode', label: '공급업체 코드', value: searchParams.vendorCode })
  if (searchParams.managerName) chips.push({ key: 'managerName', label: '담당자', value: searchParams.managerName })
  if (searchParams.phoneNumber) chips.push({ key: 'phoneNumber', label: '연락처', value: searchParams.phoneNumber })
  if (searchParams.email) chips.push({ key: 'email', label: '이메일', value: searchParams.email })
  if (searchParams.status) chips.push({ key: 'status', label: '상태', value: statusMeta(searchParams.status).label })

  return chips
})

const pendingVendors = computed(() => summaryVendors.value.filter((vendor) => vendor.status === 'PENDING'))

const recentChanges = computed(() =>
  [...summaryVendors.value]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3),
)

const pageButtonClass = (page) =>
  currentPage.value === page
    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
    : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'

const pageNumbers = computed(() => {
  if (totalPages.value === 0) return []

  const start = Math.max(0, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 5)
  const adjustedStart = Math.max(0, end - 5)

  return Array.from({ length: end - adjustedStart }, (_, index) => adjustedStart + index + 1)
})

const pageStart = computed(() => {
  if (totalElements.value === 0) return 0
  return currentPage.value * pageSize + 1
})

const pageEnd = computed(() => {
  if (totalElements.value === 0) return 0
  return Math.min((currentPage.value + 1) * pageSize, totalElements.value)
})

const movePage = (page) => {
  currentPage.value = page
}

const applySearch = async (params) => {
  Object.assign(searchParams, params)
  currentPage.value = 0
  await loadVendorPage()
}

const resetSearch = async () => {
  Object.assign(searchParams, {
    name: '',
    vendorCode: '',
    managerName: '',
    phoneNumber: '',
    email: '',
    status: '',
  })
  currentPage.value = 0
  await loadVendorPage()
}

const removeSearchChip = async (key) => {
  searchParams[key] = ''
  currentPage.value = 0
  await loadVendorPage()
}

const goDetail = (id) => {
  router.push(`/vendors/${id}`)
}

watch(sortOption, async () => {
  currentPage.value = 0
  await loadVendorPage()
})

watch(currentPage, async () => {
  await loadVendorPage()
})
</script>
