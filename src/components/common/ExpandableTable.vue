<template>
  <div
    class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
  >
    <table class="w-full border-collapse">
      <!-- 헤더 -->
      <thead class="bg-zinc-50 dark:bg-zinc-800/70">
        <tr>
          <th class="w-12 px-6 py-3"></th>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              col.align === 'right' ? 'text-right' : 'text-left',
              'px-6 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300',
            ]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <!-- 본문 -->
      <tbody class="divide-y divide-zinc-200 dark:divide-zinc-700">
        <template v-for="row in rows" :key="row.id || row.productId">
          <!-- 상위 행 -->
          <tr
            @click="toggleExpand(row.id || row.productId)"
            class="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
          >
            <td class="px-6 py-4">
              <span
                class="material-symbols-outlined text-zinc-400 transition-transform duration-200 group-hover:text-primary"
                :class="{ 'rotate-90': expandedIds.has(row.id || row.productId) }"
              >
                chevron_right
              </span>
            </td>

            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-6 py-4 text-sm',
                col.align === 'right' ? 'text-right' : 'text-left',
                col.bold ? 'font-semibold' : 'font-medium',
                col.color === 'primary'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-900 dark:text-zinc-100',
              ]"
            >
              <!-- 각 컬럼별 커스텀 slot -->
              <slot :name="`cell-${col.key}`" :row="row">
                <!-- linkKey와 linkPath가 있으면 링크로 표시 -->
                <RouterLink
                  v-if="col.key === linkKey && linkPath"
                  :to="`${linkPath}/${
                    linkIdKey && row[linkIdKey] != null
                      ? row[linkIdKey] // 🔹 linkIdKey 있으면 이걸 우선 사용 (예: productId)
                      : row.id || row[linkKey] // 🔹 없으면 기존 로직 그대로
                  }`"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                  @click.stop
                >
                  {{ row[col.key] }}
                </RouterLink>
                <span v-else>{{ formatValue(row[col.key]) }}</span>
              </slot>
            </td>
          </tr>

          <!-- 하위 행 -->
          <tr
            v-show="expandedIds.has(row.id || row.productId)"
            class="transition-all duration-300 ease-in-out"
            :class="
              expandedIds.has(row.id || row.productId)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            "
          >
            <td colspan="100%" class="p-0">
              <div
                class="bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-700"
              >
                <table class="min-w-full">
                  <thead class="bg-zinc-100 dark:bg-zinc-800/80">
                    <tr>
                      <th
                        v-for="subCol in subColumns"
                        :key="subCol.key"
                        :class="[
                          'px-6 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300',
                          subCol.align === 'right' ? 'text-right' : 'text-left',
                        ]"
                      >
                        {{ subCol.label }}
                      </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-zinc-200 dark:divide-zinc-700">
                    <tr
                      v-for="(subItem, subIdx) in row[subKey] || []"
                      :key="subItem.id || subIdx"
                      class="hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <slot name="sub-row" :subItem="subItem" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  subColumns: { type: Array, default: () => [] },
  subKey: { type: String, default: 'inventories' },
  expandedIds: { type: Set, default: () => new Set() },
  linkKey: { type: String, default: null }, // 추가: 링크를 적용할 컬럼 키
  linkIdKey: { type: String, default: null },
  linkPath: { type: String, default: null }, // 추가: 링크 경로
})

const emit = defineEmits(['toggle-expand'])

const toggleExpand = (id) => {
  emit('toggle-expand', id)
}

const formatValue = (val) => {
  if (val === null || val === undefined || val === '') return '-'
  if (typeof val === 'number') return val.toLocaleString('ko-KR')
  if (typeof val === 'string' && /\d{4}-\d{2}-\d{2}/.test(val)) {
    return new Date(val).toLocaleDateString('ko-KR')
  }
  return val
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}
</style>
