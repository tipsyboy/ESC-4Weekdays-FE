<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
      @click.self="closeModal"
    >
      <div class="flex w-11/12 max-h-[82vh] max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
        <div class="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-zinc-700">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
            <span class="material-symbols-outlined text-[22px]">storefront</span>
          </div>
          <h2 class="flex-1 text-xl font-semibold text-gray-900 dark:text-white">공급업체 선택</h2>
          <button
            type="button"
            class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
            @click="closeModal"
          >
            <span class="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>

        <div class="overflow-y-auto px-6 py-6">
          <div class="space-y-5">
            <div>
              <label for="vendorKeyword" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                공급업체 검색
              </label>
              <input
                id="vendorKeyword"
                v-model.trim="keyword"
                type="text"
                placeholder="공급업체명 또는 코드 입력"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">2글자 이상 입력하면 결과를 표시합니다.</p>
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

            <div
              v-if="!hasKeyword"
              class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center dark:border-zinc-600 dark:bg-zinc-700/40"
            >
              <div class="text-sm font-medium text-slate-700 dark:text-slate-200">검색어를 입력하세요</div>
              <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">검색 전에는 업체 목록을 표시하지 않습니다.</div>
            </div>

            <div
              v-else-if="!hasEnoughKeyword"
              class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center dark:border-zinc-600 dark:bg-zinc-700/40"
            >
              <div class="text-sm font-medium text-slate-700 dark:text-slate-200">검색어가 너무 짧습니다</div>
              <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">2글자 이상 입력해주세요.</div>
            </div>

            <div v-else-if="filteredVendors.length" class="space-y-3">
              <div class="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-700/40">
                <div class="font-medium text-slate-700 dark:text-slate-200">검색 결과</div>
                <div class="text-slate-500 dark:text-slate-400">{{ filteredVendors.length }}건</div>
              </div>

              <button
                v-for="vendor in filteredVendors"
                :key="vendor.id"
                type="button"
                class="flex w-full items-start justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-700/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                @click="selectVendor(vendor)"
              >
                <div>
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ vendor.name }}</div>
                  <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ vendor.vendorCode }}</div>
                  <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {{ vendor.managerName || '-' }} · {{ vendor.phoneNumber || '-' }}
                  </div>
                  <div class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {{ formatVendorAddress(vendor.address) }}
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    :class="statusPillClass(vendor.status)"
                  >
                    {{ statusLabel(vendor.status) }}
                  </span>
                  <span class="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm dark:bg-zinc-900 dark:text-emerald-300">
                    선택
                  </span>
                </div>
              </button>
            </div>

            <div
              v-else
              class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center text-sm text-slate-500 dark:border-zinc-600 dark:bg-zinc-700/40 dark:text-slate-400"
            >
              검색 결과가 없습니다.
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800/50">
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
  vendors: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'select'])

const keyword = ref('')
const selectedStatus = ref('ALL')

const statusFilters = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVE', label: '거래중' },
  { value: 'INACTIVE', label: '거래대기' },
  { value: 'SUSPENDED', label: '거래중지' },
]

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      keyword.value = ''
      selectedStatus.value = 'ALL'
    }
  },
)

const hasKeyword = computed(() => keyword.value.trim().length > 0)
const hasEnoughKeyword = computed(() => keyword.value.trim().length >= 2)

const filteredVendors = computed(() => {
  const normalized = keyword.value.trim().toLowerCase()

  if (normalized.length < 2) {
    return []
  }

  return props.vendors.filter((vendor) => {
    const keywordMatched =
      String(vendor.name || '').toLowerCase().includes(normalized) ||
      String(vendor.vendorCode || '').toLowerCase().includes(normalized)

    const statusMatched = selectedStatus.value === 'ALL' || vendor.status === selectedStatus.value

    return keywordMatched && statusMatched
  })
})

const statusLabel = (status) => {
  if (status === 'ACTIVE') return '거래중'
  if (status === 'INACTIVE') return '거래대기'
  return '거래중지'
}

const statusPillClass = (status) => {
  if (status === 'ACTIVE') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
  if (status === 'INACTIVE') return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200'
  return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100'
}

const closeModal = () => {
  emit('close')
}

const selectVendor = (vendor) => {
  emit('select', vendor)
  closeModal()
}

const resetKeyword = () => {
  keyword.value = ''
  selectedStatus.value = 'ALL'
}

const formatVendorAddress = (address) => {
  if (!address) return '주소 정보 없음'

  const parts = [address.city, address.street, address.detail].filter(Boolean)
  return parts.length ? parts.join(' ') : '주소 정보 없음'
}
</script>
