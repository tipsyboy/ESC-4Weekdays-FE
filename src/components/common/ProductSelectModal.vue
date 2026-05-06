<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
      @click.self="closeModal"
    >
      <div class="flex w-11/12 max-h-[82vh] max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
        <div class="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
            <span class="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
          <h2 class="flex-1 text-lg font-semibold text-gray-900 dark:text-white">상품 선택</h2>
          <button
            type="button"
            class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
            @click="closeModal"
          >
            <span class="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-5">
          <div class="space-y-4">
            <div>
              <label for="productKeyword" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                상품 검색
              </label>
              <input
                id="productKeyword"
                v-model.trim="keyword"
                type="text"
                placeholder="상품명 또는 상품코드 입력"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">검색 없이도 목록을 볼 수 있고, 검색하면 결과를 좁힐 수 있습니다.</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in statusFilters"
                :key="filter.value"
                type="button"
                class="rounded-full px-3 py-1.5 text-xs font-medium transition"
                :class="selectedStatus === filter.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 text-slate-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-slate-200 dark:hover:bg-zinc-600'"
                @click="selectedStatus = filter.value"
              >
                {{ filter.label }}
              </button>
            </div>

            <div v-if="filteredProducts.length" class="space-y-2.5">
              <div class="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-700/40">
                <div class="font-medium text-slate-700 dark:text-slate-200">검색 결과</div>
                <div class="text-slate-500 dark:text-slate-400">{{ filteredProducts.length }}건</div>
              </div>

              <button
                v-for="product in pagedProducts"
                :key="product.id"
                type="button"
                class="flex w-full items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-700/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                @click="selectProduct(product)"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <div class="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{{ product.name }}</div>
                    <span class="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-700 dark:text-slate-200">
                      {{ product.vendorName || '공급업체 미지정' }}
                    </span>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400">
                      재고 {{ product.stockQuantity ?? 0 }} / 안전 {{ product.safetyStock ?? 0 }}
                    </span>
                  </div>
                  <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{{ product.productCode }}</span>
                    <span>·</span>
                    <span>{{ product.category || '-' }}</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1.5">
                  <span
                    class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    :class="statusPillClass(product.status)"
                  >
                    {{ statusLabel(product.status) }}
                  </span>
                  <span class="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm dark:bg-zinc-900 dark:text-emerald-300">
                    선택
                  </span>
                </div>
              </button>

              <div class="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-700/40">
                <div class="text-slate-500 dark:text-slate-400">
                  {{ filteredProducts.length === 0 ? 0 : currentPage * pageSize + 1 }}-{{ pageEndIndex }} / {{ filteredProducts.length }}
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                    :disabled="currentPage === 0"
                    @click="movePage(currentPage - 1)"
                  >
                    이전
                  </button>
                  <div class="text-xs text-slate-500 dark:text-slate-400">{{ totalPages }} 페이지 중 {{ currentPage + 1 }}</div>
                  <button
                    type="button"
                    class="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                    :disabled="currentPage >= totalPages - 1"
                    @click="movePage(currentPage + 1)"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>

            <div
              v-else
              class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center text-sm text-slate-500 dark:border-zinc-600 dark:bg-zinc-700/40 dark:text-slate-400"
            >
              검색 결과가 없습니다.
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3.5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <button
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            @click="resetKeyword"
          >
            초기화
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            @click="closeModal"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  products: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'select'])

const keyword = ref('')
const selectedStatus = ref('ALL')
const currentPage = ref(0)
const pageSize = 8

const statusFilters = [
  { value: 'ALL', label: '전체' },
  { value: 'SELLING', label: '판매중' },
  { value: 'PAUSED', label: '일시중지' },
  { value: 'DISCONTINUED', label: '단종' },
]

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      keyword.value = ''
      selectedStatus.value = 'ALL'
      currentPage.value = 0
    }
  },
)

const filteredProducts = computed(() => {
  const normalized = keyword.value.trim().toLowerCase()

  return props.products.filter((product) => {
    const keywordMatched =
      !normalized ||
      String(product.name || '').toLowerCase().includes(normalized) ||
      String(product.productCode || '').toLowerCase().includes(normalized)

    const statusMatched = selectedStatus.value === 'ALL' || product.status === selectedStatus.value

    return keywordMatched && statusMatched
  })
})

const totalPages = computed(() =>
  filteredProducts.value.length ? Math.ceil(filteredProducts.value.length / pageSize) : 1,
)

const pagedProducts = computed(() => {
  const start = currentPage.value * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const pageEndIndex = computed(() =>
  Math.min((currentPage.value + 1) * pageSize, filteredProducts.value.length),
)

watch([keyword, selectedStatus], () => {
  currentPage.value = 0
})

const movePage = (page) => {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
}

const statusLabel = (status) => {
  if (status === 'SELLING') return '판매중'
  if (status === 'PAUSED') return '일시중지'
  return '단종'
}

const statusPillClass = (status) => {
  if (status === 'SELLING') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
  if (status === 'PAUSED') return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200'
  return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100'
}

const closeModal = () => {
  emit('close')
}

const selectProduct = (product) => {
  emit('select', product)
  closeModal()
}

const resetKeyword = () => {
  keyword.value = ''
  selectedStatus.value = 'ALL'
  currentPage.value = 0
}
</script>
