<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">상품 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            전체 {{ pagination.totalElements.toLocaleString() }}개의 상품
          </p>
        </div>
        <div class="flex items-center gap-2">
          <ButtonComp color="secondary" icon="filter_list" @click="openFilterModal"
            >상세 검색</ButtonComp
          >
          <ButtonComp v-if="auth.isAdmin" color="primary" icon="add" @click="goRegister"
            >상품 등록</ButtonComp
          >
        </div>
      </div>
    </template>

    <section
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 md:p-8 space-y-6"
    >
      <TableComp :columns="columns" :data="productList" class="min-h-[400px]">
        <template #cell="{ row, col }">
          <span
            v-if="col.key === 'productCode' || col.key === 'name'"
            class="text-indigo-600 hover:underline cursor-pointer"
            @click="goDetail(row)"
          >
            {{ row[col.key] }}
          </span>
          <span
            v-else-if="col.key === 'statusLabel'"
            :class="[
              'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
              row.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : row.status === 'INACTIVE'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800',
            ]"
          >
            {{ row[col.key] }}
          </span>
          <span v-else>{{ row[col.key] }}</span>
        </template>
      </TableComp>

      <!-- 페이지네이션 -->
      <div class="flex items-center justify-center gap-2">
        <!-- 첫 페이지 -->
        <ButtonComp
          color="secondary"
          icon="first_page"
          :disabled="pagination.page === 0"
          @click="goToFirstPage"
        />

        <!-- 이전 페이지 -->
        <ButtonComp
          color="secondary"
          icon="arrow_back"
          :disabled="pagination.page === 0"
          @click="goToPreviousPage"
        />

        <!-- 페이지 번호들 -->
        <button
          v-for="pageNum in pageNumbers"
          :key="pageNum"
          @click="goToPage(pageNum)"
          :class="[
            'min-w-[40px] h-10 px-4 rounded-lg font-medium text-sm transition-colors',
            pageNum === pagination.page
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700',
          ]"
        >
          {{ pageNum + 1 }}
        </button>

        <!-- 다음 페이지 -->
        <ButtonComp
          color="secondary"
          icon="arrow_forward"
          :disabled="pagination.page >= pagination.totalPages - 1"
          @click="goToNextPage"
        />

        <!-- 마지막 페이지 -->
        <ButtonComp
          color="secondary"
          icon="last_page"
          :disabled="pagination.page >= pagination.totalPages - 1"
          @click="goToLastPage"
        />
      </div>
    </section>

    <ProductSearchModal
      :is-open="state.isFilterModalOpen"
      :initial-params="searchForm"
      @close="closeFilterModal"
      @search="handleSearch"
    />
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import ProductApi from '@/api/product/index.js'
import { useAuthStore } from '@/stores/authStore'
import ProductSearchModal from '@/views/product/ProductSearchModal.vue'

const router = useRouter()
const auth = useAuthStore()
const columns = [
  { label: '상품코드', key: 'productCode' },
  { label: '상품명', key: 'name' },
  { label: '상태', key: 'statusLabel' },
  { label: '브랜드', key: 'vendorName' },
  { label: '단가(₩)', key: 'unitPrice' },
  { label: '유닛(낱개)', key: 'unit' },
]
const pagination = reactive({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0,
})
const productList = ref([])
const state = reactive({
  isFilterModalOpen: false,
})
const searchForm = reactive({
  vendorName: '',
  productCode: '',
  productName: '',
  status: null,
  minPrice: null,
  maxPrice: null,
  registeredFrom: '',
  registeredTo: ''
})

onMounted(() => {
  fetchProducts()
})

const fetchProducts = async (pageNum = 0, params = {}) => {
  const result = await ProductApi.searchProducts(pageNum, pagination.size, params)
  console.log(result)
  const pageData = result.page
  productList.value = result.content.map((p) => ({
    id: p.id,
    productCode: p.productCode,
    name: p.name,
    vendorName: p.vendorName,
    unitPrice: p.unitPrice,
    unit: p.unit,
    statusLabel: p.status === 'ACTIVE' ? '활성' : p.status === 'INACTIVE' ? '품절' : '단종',
    status: p.status,
  }))

  Object.assign(pagination, {
    page: pageData.number,
    totalPages: pageData.totalPages,
    totalElements: pageData.totalElements,
  })
}

const openFilterModal = () => {
  state.isFilterModalOpen = true
}
const goDetail = (row) => router.push(`/product/${row.id}`)
const goRegister = () => router.push('/product/register')

const pageNumbers = computed(() => {
  const pages = []
  const maxPagesToShow = 5

  let startPage = Math.max(0, pagination.page - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(pagination.totalPages - 1, startPage + maxPagesToShow - 1)

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (pageNum) => {
  fetchProducts(pageNum, searchForm)
}

const goToFirstPage = () => {
  fetchProducts(0, searchForm)
}

const goToLastPage = () => {
  fetchProducts(pagination.totalPages - 1, searchForm)
}

const goToPreviousPage = () => {
  if (pagination.page > 0) {
    fetchProducts(pagination.page - 1, searchForm)
  }
}

const goToNextPage = () => {
  if (pagination.page < pagination.totalPages - 1) {
    fetchProducts(pagination.page + 1, searchForm)
  }
}

const closeFilterModal = () => {
  state.isFilterModalOpen = false
}

const handleSearch = (params) => {
  Object.assign(searchForm, params)
  fetchProducts(0, searchForm)
}
</script>
