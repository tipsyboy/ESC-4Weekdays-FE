<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Product</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">상품 관리</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            공급업체와 연결된 상품 기준정보를 관리합니다. 상품코드, 카테고리, 재고 기준, 거래 공급업체를 우선 확인합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="refresh" @click="refreshAll">목록 새로고침</ButtonComp>
          <ButtonComp color="primary" icon="add_box" @click="router.push('/products/create')">상품 등록</ButtonComp>
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
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">상품 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">공급업체 연결과 운영 상태를 함께 확인합니다.</p>
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
                  <option value="createdAt:desc">최근 등록순</option>
                  <option value="name:asc">상품명 오름차순</option>
                  <option value="name:desc">상품명 내림차순</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="hasActiveSearch" class="mt-4 flex flex-wrap gap-2">
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
        </div>

        <div class="overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">상품</th>
                <th class="px-6 py-4 text-left font-medium">공급업체</th>
                <th class="px-6 py-4 text-left font-medium">카테고리</th>
                <th class="px-6 py-4 text-left font-medium">재고</th>
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
                v-for="product in pagedProducts"
                :key="product.id"
                class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                @click="goDetail(product.id)"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ product.name }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ product.productCode }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ product.vendorName || '-' }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ product.category }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {{ product.stockQuantity }} / 안전재고 {{ product.safetyStock }}
                </td>
                <td class="px-6 py-5">
                  <BadgeComp :color="statusMeta(product.status).color" :label="statusMeta(product.status).label" />
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ formatDate(product.updatedAt) }}</td>
              </tr>
              <tr v-if="!listLoading && !listError && pagedProducts.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">표시할 상품이 없습니다.</td>
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
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">재고 주의 상품</h2>
            </div>
            <span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">
              {{ warningProducts.length }}건
            </span>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in warningProducts"
              :key="item.id"
              class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              @click="goDetail(item.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.name }}</div>
                    <div class="text-xs font-medium text-rose-600 dark:text-rose-300">
                      현재 {{ item.stockQuantity }} / 기준 {{ item.safetyStock }}
                    </div>
                  </div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.vendorName }} · {{ item.category }}</div>
                </div>
                <BadgeComp color="danger" label="보충 필요" />
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-50">최근 등록/수정 상품</h2>
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in recentProducts"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.name }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.productCode }} · {{ item.category }}</div>
                </div>
                <div class="text-xs text-slate-400">{{ formatDate(item.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <ProductSearchModal
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
import ProductSearchModal from '@/views/product/ProductSearchModal.vue'
import productApi from '@/api/product/productApi.js'

const router = useRouter()
const summaryProducts = ref([])
const pagedProducts = ref([])
const isSearchModalOpen = ref(false)
const sortOption = ref('updatedAt:desc')
const currentPage = ref(0)
const pageSize = 8
const totalPages = ref(0)
const totalElements = ref(0)
const listLoading = ref(false)
const listError = ref('')
const searchParams = reactive({
  vendorName: '',
  productCode: '',
  productName: '',
  category: '',
  status: '',
})

const statusMeta = (status) => {
  if (status === 'SELLING') return { label: '판매중', color: 'success' }
  if (status === 'PAUSED') return { label: '일시중지', color: 'warning' }
  return { label: '단종', color: 'gray' }
}

const formatDate = (value) => value?.slice(0, 10) || '-'

const buildListParams = () => {
  const [sortBy, sortDirection] = sortOption.value.split(':')

  return {
    page: currentPage.value,
    size: pageSize,
    sortBy,
    sortDirection,
    ...searchParams,
  }
}

const loadProductSummary = async () => {
  const res = await productApi.getProducts({
    page: 0,
    size: 1000,
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  })

  if (!res.success) return
  summaryProducts.value = res.results?.content || []
}

const loadProducts = async () => {
  listLoading.value = true
  listError.value = ''

  const res = await productApi.getProducts(buildListParams())

  if (!res.success) {
    pagedProducts.value = []
    totalPages.value = 0
    totalElements.value = 0
    listError.value = res.message || '상품 목록 조회에 실패했습니다.'
    listLoading.value = false
    return
  }

  pagedProducts.value = res.results?.content || []
  totalPages.value = res.results?.totalPages || 0
  totalElements.value = res.results?.totalElements || 0
  listLoading.value = false
}

const refreshAll = async () => {
  await Promise.all([loadProductSummary(), loadProducts()])
}

onMounted(async () => {
  await refreshAll()
})

watch(sortOption, () => {
  currentPage.value = 0
  loadProducts()
})

const summaryCards = computed(() => [
  { title: '전체 상품', value: `${summaryProducts.value.length}`, description: '현재 관리 대상 상품 수', icon: 'inventory_2' },
  { title: '판매중 상품', value: `${summaryProducts.value.filter((item) => item.status === 'SELLING').length}`, description: '현재 판매 가능한 상품', icon: 'verified' },
  { title: '재고 주의 상품', value: `${summaryProducts.value.filter((item) => item.stockQuantity <= item.safetyStock).length}`, description: '보충 또는 확인이 필요한 항목', icon: 'warning' },
  { title: '단종 상품', value: `${summaryProducts.value.filter((item) => item.status === 'DISCONTINUED').length}`, description: '판매 종료 또는 교체 예정', icon: 'block' },
])

const hasActiveSearch = computed(() =>
  Object.values(searchParams).some((value) => String(value || '').trim() !== ''),
)

const activeSearchChips = computed(() => {
  const chips = []

  if (searchParams.vendorName) chips.push({ key: 'vendorName', label: '공급업체', value: searchParams.vendorName })
  if (searchParams.productCode) chips.push({ key: 'productCode', label: '상품 코드', value: searchParams.productCode })
  if (searchParams.productName) chips.push({ key: 'productName', label: '상품명', value: searchParams.productName })
  if (searchParams.category) chips.push({ key: 'category', label: '카테고리', value: searchParams.category })
  if (searchParams.status) chips.push({ key: 'status', label: '상태', value: statusLabel(searchParams.status) })

  return chips
})

const statusLabel = (status) => {
  if (status === 'SELLING') return '판매중'
  if (status === 'PAUSED') return '일시중지'
  return '단종'
}

const warningProducts = computed(() =>
  summaryProducts.value
    .filter((item) => item.stockQuantity <= item.safetyStock)
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 3),
)

const recentProducts = computed(() =>
  [...summaryProducts.value]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3),
)

const applySearch = (params) => {
  Object.assign(searchParams, params)
  currentPage.value = 0
  loadProducts()
}

const resetSearch = () => {
  Object.assign(searchParams, {
    vendorName: '',
    productCode: '',
    productName: '',
    category: '',
    status: '',
  })
  currentPage.value = 0
  loadProducts()
}

const removeSearchChip = (key) => {
  searchParams[key] = ''
  currentPage.value = 0
  loadProducts()
}

const goDetail = (id) => {
  router.push(`/products/${id}`)
}

const movePage = (page) => {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  loadProducts()
}

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value + 1

  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  let start = Math.max(current - 2, 1)
  let end = Math.min(start + 4, total)

  if (end - start < 4) {
    start = Math.max(end - 4, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const pageButtonClass = (page) => {
  return page === currentPage.value
    ? 'bg-emerald-600 text-white shadow-sm'
    : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'
}

const pageStart = computed(() => {
  if (totalElements.value === 0) return 0
  return currentPage.value * pageSize + 1
})

const pageEnd = computed(() => {
  if (totalElements.value === 0) return 0
  return Math.min((currentPage.value + 1) * pageSize, totalElements.value)
})
</script>
