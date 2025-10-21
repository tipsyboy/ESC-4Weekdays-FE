<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">상품 관리</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            상품 등록, 수정, 상태를 관리합니다
          </p>
        </div>
        <div class="flex items-center gap-2">
          <ButtonComp color="secondary" icon="refresh" @click="resetFilters">초기화</ButtonComp>
          <ButtonComp color="primary" icon="add" @click="goRegister">상품 등록</ButtonComp>
        </div>
      </div>
    </template>

    <!-- 본문 -->
    <section
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 md:p-8 space-y-6"
    >
      <!-- 🔹 필터 영역 -->
      <div
        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
               rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <!-- 브랜드 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">브랜드</label>
          <select
            v-model="filters.vendorName"
            @change="filterProductNames"
            class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">전체</option>
            <option value="자체 생산">자체 생산</option>
            <option v-for="v in vendorOptions" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>

        <!-- 상품명 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">상품명</label>
          <select
            v-model="filters.name"
            class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">전체</option>
            <option v-for="n in filteredProductNames" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- 가격 정렬 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">가격 정렬</label>
          <select
            v-model="filters.priceOrder"
            class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">기본 순서</option>
            <option value="asc">가격 낮은 순</option>
            <option value="desc">가격 높은 순</option>
          </select>
        </div>

        <!-- 상태 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">상태</label>
          <select
            v-model="filters.status"
            class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">전체</option>
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">품절</option>
            <option value="DISCONTINUED">단종</option>
          </select>
        </div>
      </div>

      <!-- 검색창 -->
      <SearchBarComp v-model="searchQuery" placeholder="상품명으로 검색" />

      <!-- 테이블 -->
      <TableComp :columns="columns" :data="filteredAndSortedList" class="min-h-[400px]">
        <template #cell="{ row, col }">
          <span
            v-if="col.key === 'productCode' || col.key === 'name'"
            class="text-indigo-600 hover:underline cursor-pointer"
            @click="goDetail(row)"
          >
            {{ row[col.key] }}
          </span>
          <span v-else>{{ row[col.key] }}</span>
        </template>
      </TableComp>

      <!-- 페이지네이션 -->
      <div class="flex justify-center items-center gap-2">
        <ButtonComp
          color="secondary"
          icon="arrow_back"
          :disabled="page === 0"
          @click="changePage(page - 1)"
        />
        <span class="text-sm text-slate-600">페이지 {{ page + 1 }} / {{ totalPages }}</span>
        <ButtonComp
          color="secondary"
          icon="arrow_forward"
          :disabled="page >= totalPages - 1"
          @click="changePage(page + 1)"
        />
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import TableComp from '@/components/common/TableComp.vue'

const router = useRouter()
const searchQuery = ref('')
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)
const productList = ref([])

const filters = ref({
  vendorName: '',
  name: '',
  priceOrder: '',
  status: '',
})

const columns = [
  { label: '상품코드', key: 'productCode' },
  { label: '상품명', key: 'name' },
  { label: '브랜드', key: 'vendorName' },
  { label: '단가(₩)', key: 'unitPrice' },
  { label: '유닛(낱개)', key: 'unit' },
  { label: '상태', key: 'statusLabel' },
]

const vendorOptions = ref([])
const productNames = ref([])
const filteredProductNames = ref([])

// ✅ 상품 데이터 로드
const fetchProducts = async () => {
  const res = await axios.get(`/api/products?page=${page.value}&size=${size.value}`)
  const data = res.data.results
  totalPages.value = data.totalPages

  const list = data.content.map(p => ({
    id: p.id,
    productCode: p.productCode,
    name: p.name,
    vendorName: p.vendor?.name || '자체 생산',
    unitPrice: p.unitPrice,
    unit: p.unit,
    statusLabel: p.status === 'ACTIVE' ? '활성' : p.status === 'INACTIVE' ? '품절' : '단종',
    status: p.status,
  }))

  productList.value = list
  vendorOptions.value = [...new Set(list.map(p => p.vendorName))]
  productNames.value = [...new Set(list.map(p => p.name))]
  filteredProductNames.value = [...productNames.value]
}

// ✅ 브랜드 선택 시 상품명 자동 필터링
const filterProductNames = () => {
  if (!filters.value.vendorName) {
    filteredProductNames.value = [...productNames.value]
  } else {
    const names = productList.value
      .filter(p => p.vendorName === filters.value.vendorName)
      .map(p => p.name)
    filteredProductNames.value = [...new Set(names)]
  }
  filters.value.name = ''
}

// ✅ 필터 초기화
const resetFilters = () => {
  filters.value = {
    vendorName: '',
    name: '',
    priceOrder: '',
    status: '',
  }
  searchQuery.value = ''
  filteredProductNames.value = [...productNames.value]
}

const filteredAndSortedList = computed(() => {
  let list = [...productList.value]

  if (filters.value.vendorName)
    list = list.filter(p => p.vendorName === filters.value.vendorName)
  if (filters.value.name)
    list = list.filter(p => p.name === filters.value.name)
  if (filters.value.status)
    list = list.filter(p => p.status === filters.value.status)
  if (searchQuery.value)
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

  if (filters.value.priceOrder === 'asc')
    list.sort((a, b) => a.unitPrice - b.unitPrice)
  else if (filters.value.priceOrder === 'desc')
    list.sort((a, b) => b.unitPrice - a.unitPrice)

  return list
})

const changePage = newPage => {
  if (newPage < 0 || newPage >= totalPages.value) return
  page.value = newPage
  fetchProducts()
}

const goDetail = row => router.push(`/product/${row.id}`)
const goRegister = () => router.push('/product/register')

onMounted(fetchProducts)
</script>
