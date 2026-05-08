<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
      @click.self="closeModal"
    >
      <div class="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-950">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Location Picker</div>
              <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">적치 위치 선택</h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {{ productName ? `${productName} · ` : '' }}빈 위치 또는 같은 상품이 있는 위치만 선택할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              @click="closeModal"
            >
              <span class="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        <div class="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[220px_1fr]">
          <aside class="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 lg:border-b-0 lg:border-r">
            <div class="text-sm font-semibold text-slate-900 dark:text-slate-50">구역 선택</div>
            <div class="mt-4 flex flex-wrap gap-2 lg:flex-col">
              <button
                v-for="zone in zoneCodes"
                :key="zone"
                type="button"
                class="rounded-2xl px-4 py-3 text-left text-sm font-semibold transition"
                :class="selectedZone === zone ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/40'"
                @click="selectedZone = zone"
              >
                {{ zone }} Zone
              </button>
            </div>
          </aside>

          <section class="min-h-0 overflow-y-auto p-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-lg font-semibold text-slate-900 dark:text-slate-50">{{ selectedZone }} Zone</div>
                <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Rack {{ rackCodes.length }}개 · Level {{ levelCodes.length }}개
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div
                  v-if="selectedLocation"
                  class="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  선택됨 · {{ selectedLocation.locationCode }}
                </div>
                <button
                  type="button"
                  class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  @click="clearSelection"
                >
                  선택 해제
                </button>
              </div>
            </div>

            <div class="mt-5">
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div class="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span class="rounded-full bg-white px-3 py-1 text-slate-500 dark:bg-slate-950 dark:text-slate-300">빈 위치</span>
                  <span class="rounded-full bg-sky-50 px-3 py-1 text-sky-700 dark:bg-sky-950/20 dark:text-sky-300">같은 상품 보관</span>
                  <span class="rounded-full bg-rose-50 px-3 py-1 text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">선택 불가</span>
                </div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <article
                    v-for="rackCode in rackCodes"
                    :key="`rack-${rackCode}`"
                    class="rounded-2xl border p-4 shadow-sm"
                    :class="rackCardClass(rackCode)"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="text-sm font-bold text-slate-900 dark:text-slate-50">Rack {{ rackCode }}</div>
                      <div class="text-[11px] uppercase tracking-[0.14em] text-slate-400">Levels</div>
                    </div>

                    <div class="mt-3 grid grid-cols-1 gap-2">
                      <button
                        v-for="levelCode in levelCodes"
                        :key="`${rackCode}-${levelCode}`"
                        type="button"
                        class="min-h-[72px] rounded-2xl border p-3 text-left transition"
                        :class="cellClass(locationByRackAndLevel[rackCode]?.[levelCode])"
                        :disabled="isBlockedLocation(locationByRackAndLevel[rackCode]?.[levelCode])"
                        @click="locationByRackAndLevel[rackCode]?.[levelCode] && !isBlockedLocation(locationByRackAndLevel[rackCode][levelCode]) && selectLocation(locationByRackAndLevel[rackCode][levelCode].id)"
                      >
                        <template v-if="locationByRackAndLevel[rackCode]?.[levelCode]">
                          <div class="flex items-start justify-between gap-3">
                            <div>
                              <div class="text-sm font-bold text-slate-900 dark:text-slate-50">
                                Level {{ levelCode }}
                              </div>
                              <div class="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                                {{ locationByRackAndLevel[rackCode][levelCode].locationCode }}
                              </div>
                              <div
                                class="mt-2 text-[11px] font-semibold"
                                :class="cellCaptionClass(locationByRackAndLevel[rackCode][levelCode])"
                              >
                                {{ cellCaption(locationByRackAndLevel[rackCode][levelCode]) }}
                              </div>
                            </div>
                            <span
                              class="material-symbols-outlined text-[18px]"
                              :class="selectedLocationId === locationByRackAndLevel[rackCode][levelCode].id ? 'text-emerald-600 dark:text-emerald-300' : isBlockedLocation(locationByRackAndLevel[rackCode][levelCode]) ? 'text-rose-300 dark:text-rose-800' : 'text-slate-300 dark:text-slate-600'"
                            >
                              {{ selectedLocationId === locationByRackAndLevel[rackCode][levelCode].id ? 'check_circle' : isBlockedLocation(locationByRackAndLevel[rackCode][levelCode]) ? 'block' : 'radio_button_unchecked' }}
                            </span>
                          </div>
                        </template>
                        <template v-else>
                          <div class="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 dark:text-slate-600">
                            Empty
                          </div>
                        </template>
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              @click="closeModal"
            >
              취소
            </button>
            <button
              type="button"
              class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-slate-700"
              :disabled="selectedLocationId == null"
              @click="confirmSelection"
            >
              위치 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  locations: {
    type: Array,
    default: () => [],
  },
  mapLocations: {
    type: Array,
    default: () => [],
  },
  productId: {
    type: [Number, null],
    default: null,
  },
  selectedLocationId: {
    type: [Number, null],
    default: null,
  },
  productName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'select'])

const zoneCodes = computed(() => [...new Set((props.locations || []).map((location) => location.zoneCode))])
const selectedZone = ref('')

const syncSelectedZone = () => {
  const selectedLocation = (props.locations || []).find((location) => location.id === props.selectedLocationId)
  selectedZone.value = selectedLocation?.zoneCode || zoneCodes.value[0] || ''
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    syncSelectedZone()
  }
})

watch(zoneCodes, () => {
  if (!zoneCodes.value.includes(selectedZone.value)) {
    selectedZone.value = zoneCodes.value[0] || ''
  }
})

const activeLocations = computed(() => (props.locations || []).filter((location) => location.zoneCode === selectedZone.value))
const rackCodes = computed(() => [...new Set(activeLocations.value.map((location) => location.rackCode))].sort((a, b) => a.localeCompare(b)))
const levelCodes = computed(() => [...new Set(activeLocations.value.map((location) => location.levelCode))].sort((a, b) => b.localeCompare(a)))
const locationByRackAndLevel = computed(() => activeLocations.value.reduce((acc, location) => {
  if (!acc[location.rackCode]) acc[location.rackCode] = {}
  acc[location.rackCode][location.levelCode] = location
  return acc
}, {}))
const inventoryLocationMap = computed(() => (props.mapLocations || []).reduce((acc, location) => {
  acc[location.locationCode] = location
  return acc
}, {}))
const selectedLocation = computed(() => (props.locations || []).find((location) => location.id === props.selectedLocationId) || null)
const selectedRackCode = computed(() => selectedLocation.value?.rackCode || null)

const closeModal = () => emit('close')

const clearSelection = () => emit('select', null)

const selectLocation = (locationId) => emit('select', locationId)

const inventoryAtLocation = (location) => {
  if (!location) return null
  return inventoryLocationMap.value[location.locationCode] || null
}

const isBlockedLocation = (location) => {
  const inventory = inventoryAtLocation(location)
  if (!inventory) return false
  if (inventory.skuCount > 1) return true
  return props.productId != null && inventory.representativeProductId !== props.productId
}

const cellCaption = (location) => {
  const inventory = inventoryAtLocation(location)
  if (!inventory) return '빈 위치'
  if (inventory.skuCount > 1) return '혼재 위치'
  if (props.productId != null && inventory.representativeProductId === props.productId) return '같은 상품 보관'
  return '다른 상품 보관'
}

const cellCaptionClass = (location) => {
  const inventory = inventoryAtLocation(location)
  if (!inventory) return 'text-slate-400'
  if (inventory.skuCount > 1) return 'text-rose-500 dark:text-rose-300'
  if (props.productId != null && inventory.representativeProductId === props.productId) return 'text-sky-600 dark:text-sky-300'
  return 'text-rose-500 dark:text-rose-300'
}

const cellClass = (location) => {
  if (!location) {
    return 'border-dashed border-slate-200 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-950/40'
  }

  const hasInventory = Boolean(inventoryLocationMap.value[location.locationCode])
  const blocked = isBlockedLocation(location)

  if (props.selectedLocationId === location.id) {
    return 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-950/30 dark:ring-emerald-900'
  }

  if (blocked) {
    return 'cursor-not-allowed border-rose-200 bg-rose-50 opacity-70 dark:border-rose-900 dark:bg-rose-950/20'
  }

  if (hasInventory) {
    return 'border-sky-200 bg-sky-50 hover:border-emerald-300 hover:bg-emerald-50 dark:border-sky-900 dark:bg-sky-950/20 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30'
  }

  return 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30'
}

const rackCardClass = (rackCode) => {
  if (selectedRackCode.value === rackCode) {
    return 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20'
  }

  return 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
}

const confirmSelection = () => {
  if (props.selectedLocationId == null) return
  closeModal()
}
</script>
