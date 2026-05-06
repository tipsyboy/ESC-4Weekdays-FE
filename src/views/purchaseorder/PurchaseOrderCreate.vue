<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Purchase Order Create</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">발주 요청 등록</h1>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="handleCancel">목록으로</ButtonComp>
          <ButtonComp color="secondary" icon="draft" :disabled="isSubmitting" @click="submitForm('DRAFT')">임시저장</ButtonComp>
          <ButtonComp color="primary" icon="approval" :disabled="isSubmitting" @click="submitForm('REQUEST')">승인요청</ButtonComp>
        </div>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-5 2xl:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-5">
        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">기본 정보</h2>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">요청자</span>
              <div class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="text-base font-semibold text-slate-900 dark:text-slate-50">{{ requesterName }}</div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">로그인 사용자 기준 자동 입력 예정</div>
              </div>
            </div>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">예정 입고일</span>
              <input v-model="form.expectedInboundDate" type="date" class="input-base" />
              <span class="text-xs text-slate-500 dark:text-slate-400">내부 목표 일정으로 사용합니다.</span>
            </label>

            <label class="flex flex-col gap-1.5 md:col-span-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">요청 메모</span>
              <textarea
                v-model.trim="form.requestMemo"
                rows="3"
                class="input-base resize-none"
                placeholder="발주 사유나 긴급 여부를 입력하세요"
              />
            </label>
          </div>
        </article>

        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">발주 구성</h2>
          </div>

          <div class="mt-5 space-y-4">
            <div class="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="flex items-center justify-between gap-3">
                  <div class="text-sm font-medium text-slate-900 dark:text-slate-50">공급업체</div>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                    @click="openVendorModal"
                  >
                    <span class="material-symbols-outlined text-base">search</span>
                    공급업체 찾기
                  </button>
                </div>

                <div
                  v-if="selectedVendor"
                  class="mt-3 flex items-start justify-between gap-3 rounded-xl px-4 py-3"
                  :class="selectedVendorCardClass(selectedVendor.status)"
                >
                  <div>
                    <div class="font-semibold" :class="selectedVendorTitleClass(selectedVendor.status)">{{ selectedVendor.name }}</div>
                    <div class="mt-1 text-xs" :class="selectedVendorMetaClass(selectedVendor.status)">
                      {{ selectedVendor.vendorCode }} · {{ vendorStatusLabel(selectedVendor.status) }} · {{ selectedVendor.managerName || '-' }}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-medium transition"
                    :class="selectedVendorActionClass(selectedVendor.status)"
                    @click="clearSelectedVendor"
                  >
                    해제
                  </button>
                </div>

                <div
                  v-else
                  class="mt-3 rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400"
                >
                  선택된 공급업체가 없습니다.
                </div>

                <span v-if="showError('vendorId')" class="mt-3 block text-sm text-rose-500">공급업체를 선택해주세요.</span>
              </div>

              <div class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <div class="text-sm font-medium text-slate-900 dark:text-slate-50">상품 선택</div>
                    <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {{ selectedVendor ? `${selectedVendor.name} 연결 상품 ${availableProducts.length}개` : '공급업체를 먼저 선택하세요.' }}
                    </div>
                  </div>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    :disabled="!selectedVendor || !availableProducts.length"
                    @click="isProductModalOpen = true"
                  >
                    <span class="material-symbols-outlined text-base">add_box</span>
                    상품 선택
                  </button>
                </div>

                <div v-if="form.items.length" class="mt-3 grid grid-cols-1 gap-2">
                  <div
                    v-for="item in form.items.slice(0, 2)"
                    :key="item.productId"
                    class="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60"
                  >
                    <div class="font-medium text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.productCode }}</div>
                  </div>
                </div>

                <div
                  v-else
                  class="mt-3 rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400"
                >
                  상품을 선택하세요.
                </div>
              </div>
            </div>

            <div v-if="form.items.length" class="space-y-3">
              <div
                v-for="item in form.items"
                :key="item.productId"
                class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="font-semibold text-slate-900 dark:text-slate-50">{{ item.productName }}</div>
                    <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.productCode }}</div>
                  </div>
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-slate-100"
                    @click="removeItem(item.productId)"
                  >
                    제거
                  </button>
                </div>

                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">수량</span>
                    <input v-model="item.quantity" class="input-base" inputmode="numeric" @blur="normalizeItem(item)" />
                  </label>
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">단가</span>
                    <input v-model="item.unitPrice" class="input-base" inputmode="numeric" @blur="normalizeItem(item)" />
                  </label>
                  <div class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">현재 재고</span>
                    <div class="input-base bg-zinc-100 text-slate-600 dark:bg-zinc-800/70 dark:text-slate-300">{{ item.stockQuantity ?? 0 }}개</div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">라인 금액</span>
                    <div class="input-base bg-zinc-100 font-semibold text-slate-900 dark:bg-zinc-800/70 dark:text-slate-50">
                      {{ formatPrice(lineAmount(item)) }}
                    </div>
                  </div>
                </div>

                <div class="mt-3 text-xs text-slate-500 dark:text-slate-400">라인 상태 {{ lineStatusLabel(item) }}</div>
              </div>
            </div>
            <div
              v-else
              class="rounded-2xl border border-dashed border-zinc-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400"
            >
              위에서 공급업체와 상품을 선택하면 발주 라인이 여기 이어집니다.
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-5">
        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">발주 요약</h2>
          </div>

          <div class="mt-4 space-y-3">
            <div class="rounded-2xl border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm text-slate-500 dark:text-slate-400">상품 수</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ form.items.length }}개</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm text-slate-500 dark:text-slate-400">총 수량</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ totalQuantity }}개</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm text-slate-500 dark:text-slate-400">총 발주 금액</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ formatPrice(totalAmount) }}</div>
            </div>
          </div>
        </article>
      </div>

      <VendorSelectModal
        :is-open="isVendorModalOpen"
        :vendors="vendors"
        @close="closeVendorModal"
        @select="handleVendorSelect"
      />

      <ProductSelectModal
        :is-open="isProductModalOpen"
        :products="modalProducts"
        @close="closeProductModal"
        @select="handleProductSelect"
      />
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import ProductSelectModal from '@/components/common/ProductSelectModal.vue'
import VendorSelectModal from '@/components/common/VendorSelectModal.vue'
import purchaseOrderApi from '@/api/purchaseorder/purchaseOrderApi.js'

const router = useRouter()
const isSubmitting = ref(false)
const isVendorModalOpen = ref(false)
const isProductModalOpen = ref(false)
const submitted = ref(false)
const vendors = ref([])
const productCatalog = ref({})
const requesterName = '김현우'
const today = () => new Date().toISOString().slice(0, 10)

const form = reactive({
  requesterName,
  vendorId: '',
  expectedInboundDate: today(),
  requestMemo: '',
  items: [],
})

const touched = reactive({
  vendorId: false,
})

const loadMeta = async () => {
  const res = await purchaseOrderApi.getPurchaseOrderFormMeta()
  vendors.value = res.results?.vendors || []
  productCatalog.value = res.results?.productCatalog || {}
}

onMounted(loadMeta)

const errors = computed(() => ({
  vendorId: !form.vendorId,
  items: !form.items.length || hasInvalidItem.value,
}))

const showError = (field) => (submitted.value || touched[field]) && errors.value[field]

const selectedVendor = computed(() =>
  vendors.value.find((item) => String(item.id) === String(form.vendorId)) || null,
)

const availableProducts = computed(() => {
  if (!form.vendorId) return []
  return productCatalog.value[form.vendorId] || []
})

const modalProducts = computed(() =>
  availableProducts.value.map((product) => ({
    id: product.productId,
    name: product.productName,
    productCode: product.productCode,
    vendorName: selectedVendor.value?.name || '',
    category: '발주 가능 상품',
    stockQuantity: product.stockQuantity,
    safetyStock: 0,
    status: 'SELLING',
    unitPrice: product.unitPrice,
  })),
)

const addItem = (product) => {
  const exists = form.items.some((item) => item.productId === product.productId)
  if (exists) return

  form.items.push({
    productId: product.productId,
    productCode: product.productCode,
    productName: product.productName,
    quantity: '1',
    unitPrice: String(product.unitPrice),
    stockQuantity: product.stockQuantity,
  })
}

const removeItem = (productId) => {
  form.items = form.items.filter((item) => item.productId !== productId)
}

const normalizeItem = (item) => {
  item.quantity = String(Math.max(1, Number(item.quantity || 1)))
  item.unitPrice = String(Math.max(1, Number(item.unitPrice || 1)))
}

const lineAmount = (item) => Number(item.quantity || 0) * Number(item.unitPrice || 0)
const totalAmount = computed(() => form.items.reduce((sum, item) => sum + lineAmount(item), 0))
const totalQuantity = computed(() => form.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0))
const formatPrice = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`

const vendorStatusLabel = (status) => {
  if (status === 'TRADING') return '거래중'
  if (status === 'PENDING') return '거래대기'
  return '거래중지'
}

const selectedVendorCardClass = (status) => {
  if (status === 'TRADING') return 'bg-emerald-50 dark:bg-emerald-950/40'
  if (status === 'PENDING') return 'bg-amber-50 dark:bg-amber-950/40'
  return 'bg-rose-50 dark:bg-rose-950/30'
}

const selectedVendorTitleClass = (status) => {
  if (status === 'TRADING') return 'text-emerald-950 dark:text-emerald-100'
  if (status === 'PENDING') return 'text-amber-950 dark:text-amber-100'
  return 'text-rose-950 dark:text-rose-100'
}

const selectedVendorMetaClass = (status) => {
  if (status === 'TRADING') return 'text-emerald-700 dark:text-emerald-200'
  if (status === 'PENDING') return 'text-amber-700 dark:text-amber-200'
  return 'text-rose-700 dark:text-rose-200'
}

const selectedVendorActionClass = (status) => {
  if (status === 'TRADING') return 'text-emerald-700 hover:bg-white/80 hover:text-emerald-950 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-100'
  if (status === 'PENDING') return 'text-amber-700 hover:bg-white/80 hover:text-amber-950 dark:hover:bg-amber-900/40 dark:hover:text-amber-100'
  return 'text-rose-700 hover:bg-white/80 hover:text-rose-950 dark:hover:bg-rose-900/40 dark:hover:text-rose-100'
}

const hasInvalidItem = computed(() =>
  form.items.some((item) => Number(item.quantity || 0) <= 0 || Number(item.unitPrice || 0) <= 0),
)

const lineStatusLabel = (item) => {
  if (Number(item.quantity || 0) > Number(item.stockQuantity || 0)) {
    return '재고 초과 요청'
  }
  return '정상'
}

const serializeForm = () => JSON.stringify({
  requesterName: form.requesterName,
  vendorId: form.vendorId,
  expectedInboundDate: form.expectedInboundDate,
  requestMemo: form.requestMemo,
  items: form.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  })),
})

const initialSnapshot = JSON.stringify({
  requesterName,
  vendorId: '',
  expectedInboundDate: today(),
  requestMemo: '',
  items: [],
})

const isDirty = computed(() => serializeForm() !== initialSnapshot)

const openVendorModal = () => {
  isVendorModalOpen.value = true
}

const closeVendorModal = () => {
  touched.vendorId = true
  isVendorModalOpen.value = false
}

const handleVendorSelect = (vendor) => {
  const nextVendorId = String(vendor.id)

  if (form.vendorId && form.vendorId !== nextVendorId && form.items.length) {
    const confirmed = window.confirm('공급업체를 변경하면 현재 담은 발주 라인이 초기화됩니다. 계속할까요?')
    if (!confirmed) return
  }

  form.vendorId = nextVendorId
  form.items = []
  touched.vendorId = true
  isVendorModalOpen.value = false
}

const clearSelectedVendor = () => {
  if (form.items.length && !window.confirm('공급업체를 해제하면 담아둔 발주 라인이 초기화됩니다. 계속할까요?')) {
    return
  }

  form.vendorId = ''
  form.items = []
}

const closeProductModal = () => {
  isProductModalOpen.value = false
}

const handleProductSelect = (product) => {
  addItem({
    productId: product.id,
    productCode: product.productCode,
    productName: product.name,
    unitPrice: product.unitPrice,
    stockQuantity: product.stockQuantity,
  })
  isProductModalOpen.value = false
}

const handleCancel = () => {
  if (isDirty.value && !window.confirm('작성 중인 내용이 있습니다. 목록으로 이동할까요?')) {
    return
  }

  isVendorModalOpen.value = false
  isProductModalOpen.value = false
  router.push('/purchase-orders')
}

const submitForm = async (submitType) => {
  submitted.value = true
  form.items.forEach(normalizeItem)

  if (Object.values(errors.value).some(Boolean)) {
    alert('공급업체와 발주 라인 정보를 확인해주세요.')
    return
  }

  isSubmitting.value = true

  const res = await purchaseOrderApi.createPurchaseOrder({
    ...form,
    submitType,
  })

  isSubmitting.value = false

  if (!res.success) {
    alert(res.message || '발주 등록에 실패했습니다.')
    return
  }

  router.push(`/purchase-orders/${res.results.id}`)
}
</script>
