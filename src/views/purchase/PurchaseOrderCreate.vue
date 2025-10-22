<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">신규 발주 등록</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            새로운 발주를 등록합니다
          </p>
        </div>
        <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
      </div>
    </template>

    <section
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 md:p-8 backdrop-blur-sm space-y-8"
    >
      <div class="space-y-5">
        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">공급업체</span>
          <select
            v-model="form.vendorId"
            @change="onVendorChange"
            class="w-full h-10 px-3 text-sm rounded-md font-sans
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
          >
            <option disabled value="">공급업체를 선택하세요</option>
            <option v-for="v in vendorList" :key="v.id" :value="v.id">{{ v.name }}</option>
          </select>
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">발주일</span>
            <input
              v-model="form.orderDate"
              type="datetime-local"
              class="w-full h-10 px-3 text-sm rounded-md
                     bg-background-light dark:bg-background-dark
                     border border-primary/20 dark:border-primary/30
                     focus:ring-2 focus:ring-primary/50 focus:border-primary
                     outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">입고 예정일</span>
            <input
              v-model="form.expectedDate"
              type="datetime-local"
              class="w-full h-10 px-3 text-sm rounded-md
                     bg-background-light dark:bg-background-dark
                     border border-primary/20 dark:border-primary/30
                     focus:ring-2 focus:ring-primary/50 focus:border-primary
                     outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>
        </div>

        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">비고</span>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="비고 입력 (선택사항)"
            class="w-full px-3 py-2 text-sm rounded-md resize-none
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white placeholder-zinc-400"
          />
        </label>
      </div>

      <!-- 발주 품목 -->
      <div>
        <h2 class="text-lg font-semibold mb-3 text-slate-900 dark:text-white">발주 품목 목록</h2>

        <TableComp :columns="itemColumns" :data="form.items" empty-text="등록된 발주 품목이 없습니다.">
          <template #cell-productId="{ row }">
            <select
              v-model="row.productId"
              @change="updateUnitPrice(row)"
              class="w-full px-2 py-1 text-sm text-left font-sans rounded
                     bg-background-light dark:bg-background-dark
                     border border-primary/20 dark:border-primary/30
                     focus:ring-1 focus:ring-primary/50 focus:border-primary
                     outline-none transition-all text-slate-800 dark:text-white"
              :disabled="!vendorProducts.length"
            >
              <option disabled value="">상품 선택</option>
              <option v-for="p in vendorProducts" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </template>

          <template #cell-unitPrice="{ row }">
            <span class="block text-right font-mono text-slate-700 dark:text-slate-300">
              {{ formatWon(row.unitPrice || 0) }}
            </span>
          </template>

          <template #cell-orderedQuantity="{ row }">
            <input
              v-model.number="row.orderedQuantity"
              type="number"
              min="1"
              class="w-full px-2 py-1 text-sm text-right font-mono rounded
                     bg-background-light dark:bg-background-dark
                     border border-primary/20 dark:border-primary/30
                     focus:ring-1 focus:ring-primary/50 focus:border-primary
                     outline-none transition-all text-slate-800 dark:text-white"
            />
          </template>

          <template #cell-total="{ row }">
            <span class="block text-right font-mono text-primary font-semibold">
              {{ formatWon(row.unitPrice * row.orderedQuantity || 0) }}
            </span>
          </template>

          <template #actions="{ index }">
            <ButtonComp color="danger" icon="delete" size="sm" @click="removeItem(index)" />
          </template>
        </TableComp>

        <div class="mt-4">
          <ButtonComp color="secondary" icon="add" @click="addItem" type="button">품목 추가</ButtonComp>
        </div>
      </div>

      <div class="flex justify-end border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <p class="text-lg font-semibold text-slate-900 dark:text-white">
          총 발주 금액:
          <span class="text-primary">{{ formatWon(totalAmount) }}</span>
        </p>
      </div>

      <div class="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <ButtonComp color="secondary" @click="$router.back()">취소</ButtonComp>
        <ButtonComp color="primary" @click="submitOrder">발주 등록</ButtonComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/purchase'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import { formatWon } from '@/utils/format.js'

const router = useRouter()

const form = ref({
  vendorId: '',
  orderDate: '',
  expectedDate: '',
  description: '',
  items: [],
})

const vendorList = ref([])
const vendorProducts = ref([])

// 테이블 컬럼
const itemColumns = [
  { key: 'productId', label: '상품명', width: '35%' },
  { key: 'unitPrice', label: '단가', align: 'right', width: '15%' },
  { key: 'orderedQuantity', label: '수량', align: 'right', width: '15%' },
  { key: 'total', label: '금액', align: 'right', width: '20%' },
  { key: 'actions', label: '', align: 'center', width: '10%' },
]

// 합계 계산
const totalAmount = computed(() =>
  form.value.items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.orderedQuantity || 0), 0)
)

// 품목 추가/삭제
const addItem = () => form.value.items.push({ productId: '', unitPrice: 0, orderedQuantity: 1 })
const removeItem = (index) => form.value.items.splice(index, 1)

// 공급업체 변경 시 초기화
const onVendorChange = async () => {
  if (!form.value.vendorId) return
  form.value.items = [] // 품목 초기화
  vendorProducts.value = []
  await loadVendorProducts()
}

// 상품 단가 자동 반영
const updateUnitPrice = (row) => {
  const product = vendorProducts.value.find((p) => p.id === row.productId)
  row.unitPrice = product ? product.unitPrice : 0
}

// API
const loadVendors = async () => {
  const res = await api.getVendors()
  if (res.isSuccess) vendorList.value = res.result
}

const loadVendorProducts = async () => {
  const res = await api.getVendorProducts(form.value.vendorId)
  if (res.isSuccess) vendorProducts.value = res.result
}

// 등록
const submitOrder = async () => {
  if (!form.value.vendorId) return alert('공급업체를 선택해주세요.')
  if (!form.value.expectedDate) return alert('입고 예정일을 입력해주세요.')
  if (!form.value.items.length) return alert('발주 품목을 추가해주세요.')

  const res = await api.addPurchaseOrder(form.value)
  if (res.success || res.isSuccess) {
    alert('발주가 등록되었습니다.')
    router.push('/purchase')
  } else {
    alert('발주 등록에 실패했습니다.')
  }
}

onMounted(loadVendors)
</script>
