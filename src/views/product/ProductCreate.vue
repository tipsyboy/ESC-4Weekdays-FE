<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Product Create</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">상품 등록</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            상품 기본정보와 공급업체 연결 정보를 등록합니다. 1차에서는 운영에 필요한 최소 항목만 먼저 관리합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="handleCancel">목록으로</ButtonComp>
          <ButtonComp color="primary" icon="save" :disabled="isSubmitting" @click="submitForm">저장</ButtonComp>
        </div>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-6">
        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">기본 정보</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">상품 식별과 공급업체 연결에 필요한 항목입니다.</p>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label class="flex flex-col gap-1.5 md:col-span-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">상품명</span>
              <input
                v-model.trim="form.name"
                class="input-base"
                placeholder="예: 무선 바코드 스캐너"
                @blur="touchField('name')"
              />
              <span v-if="showError('name')" class="text-sm text-rose-500">상품명을 입력해주세요.</span>
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">카테고리</span>
              <input
                v-model.trim="form.category"
                class="input-base"
                placeholder="예: 입출고 장비"
                @blur="touchField('category')"
              />
              <span v-if="showError('category')" class="text-sm text-rose-500">카테고리를 입력해주세요.</span>
            </label>

            <div class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">공급업체</span>
              <div class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div
                  v-if="selectedVendor"
                  class="flex items-start justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/40"
                >
                  <div>
                    <div class="font-semibold text-slate-900 dark:text-slate-50">{{ selectedVendor.name }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {{ selectedVendor.vendorCode }} · {{ statusLabel(selectedVendor.status) }} · {{ selectedVendor.managerName || '-' }}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-900 dark:hover:bg-zinc-900 dark:hover:text-slate-100"
                    @click="clearSelectedVendor"
                  >
                    해제
                  </button>
                </div>
                <div
                  v-else
                  class="rounded-xl border border-dashed border-zinc-300 px-4 py-4 text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400"
                >
                  선택된 공급업체가 없습니다.
                </div>

                <div class="mt-3 flex gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                    @click="openVendorModal"
                  >
                    <span class="material-symbols-outlined text-base">search</span>
                    공급업체 찾기
                  </button>
                </div>
              </div>
              <span v-if="showError('vendorId')" class="text-sm text-rose-500">공급업체를 선택해주세요.</span>
            </div>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">단가</span>
              <input
                v-model="form.unitPrice"
                class="input-base"
                inputmode="numeric"
                placeholder="예: 12000"
                @blur="touchField('unitPrice')"
              />
              <span v-if="showError('unitPrice')" class="text-sm text-rose-500">단가를 입력해주세요.</span>
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">박스당 수량</span>
              <input
                v-model="form.boxQuantity"
                class="input-base"
                inputmode="numeric"
                placeholder="예: 20"
                @blur="touchField('boxQuantity')"
              />
              <span v-if="showError('boxQuantity')" class="text-sm text-rose-500">박스당 수량을 입력해주세요.</span>
            </label>
          </div>

          <div class="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div class="text-sm font-medium text-slate-700 dark:text-slate-300">상품 이미지 등록</div>
            <div class="mt-3 flex items-center gap-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 dark:border-zinc-700 dark:bg-zinc-950/40">
              <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-white dark:bg-zinc-900">
                <span class="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">image</span>
              </div>
              <div>
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">이미지 등록 예정</div>
                <div class="mt-1 text-xs text-slate-400 dark:text-slate-500">현재는 null 허용, 추후 업로드 기능 연결</div>
              </div>
            </div>
          </div>
        </article>

      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">운영 정보</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">재고 기준과 기본 운영 상태를 입력합니다.</p>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-6">
            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">현재 재고</span>
              <input
                v-model="form.stockQuantity"
                class="input-base"
                inputmode="numeric"
                placeholder="예: 0"
              />
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">안전재고</span>
              <input
                v-model="form.safetyStock"
                class="input-base"
                inputmode="numeric"
                placeholder="예: 30"
                @blur="touchField('safetyStock')"
              />
              <span v-if="showError('safetyStock')" class="text-sm text-rose-500">안전재고를 입력해주세요.</span>
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">리드타임(일)</span>
              <input
                v-model="form.leadTimeDays"
                class="input-base"
                inputmode="numeric"
                placeholder="예: 3"
                @blur="touchField('leadTimeDays')"
              />
              <span v-if="showError('leadTimeDays')" class="text-sm text-rose-500">리드타임을 입력해주세요.</span>
            </label>

            <div class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">판매 상태</span>
              <div class="input-base cursor-not-allowed bg-zinc-100 text-slate-500 dark:bg-zinc-800/70 dark:text-slate-400">
                판매중
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">초기 상품은 기본적으로 판매중 상태로 등록합니다.</span>
            </div>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">설명</span>
              <textarea
                v-model.trim="form.description"
                class="input-base resize-none"
                rows="4"
                placeholder="상품 운영 메모나 특징을 입력하세요"
              />
            </label>
          </div>
        </article>
      </div>
    </section>

    <VendorSelectModal
        :is-open="isVendorModalOpen"
        :vendors="vendors"
        @close="closeVendorModal"
        @select="handleVendorSelect"
    />
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import VendorSelectModal from '@/components/common/VendorSelectModal.vue'
import vendorApi from '@/api/vendor/vendorApi.js'
import productApi from '@/api/product/productApi.js'

const router = useRouter()
const vendors = ref([])
const isSubmitting = ref(false)
const submitted = ref(false)
const isVendorModalOpen = ref(false)

const form = reactive({
  name: '',
  category: '',
  vendorId: '',
  unitPrice: '',
  boxQuantity: '',
  stockQuantity: '0',
  safetyStock: '',
  leadTimeDays: '',
  status: 'SELLING',
  description: '',
})

const touched = reactive({
  name: false,
  category: false,
  vendorId: false,
  unitPrice: false,
  boxQuantity: false,
  safetyStock: false,
  leadTimeDays: false,
})

const errors = computed(() => ({
  name: !form.name.trim(),
  category: !form.category.trim(),
  vendorId: !form.vendorId,
  unitPrice: !String(form.unitPrice).trim(),
  boxQuantity: !String(form.boxQuantity).trim(),
  safetyStock: !String(form.safetyStock).trim(),
  leadTimeDays: !String(form.leadTimeDays).trim(),
}))

const showError = (field) => (submitted.value || touched[field]) && errors.value[field]

const touchField = (field) => {
  touched[field] = true
}

const isDirty = computed(() =>
  Boolean(
    form.name.trim() ||
    form.category.trim() ||
    form.vendorId ||
    String(form.unitPrice).trim() ||
    String(form.boxQuantity).trim() ||
    String(form.safetyStock).trim() ||
    String(form.leadTimeDays).trim() ||
    form.description.trim() ||
    String(form.stockQuantity).trim() !== '0',
  ),
)

const selectedVendor = computed(() =>
  vendors.value.find((item) => String(item.id) === String(form.vendorId)) || null,
)

const statusLabel = (status) => {
  if (status === 'TRADING') return '거래중'
  if (status === 'PENDING') return '거래대기'
  return '거래중지'
}

const loadVendors = async () => {
  const res = await vendorApi.getVendors({
    page: 0,
    size: 1000,
    sortBy: 'name',
    sortDirection: 'asc',
  })
  vendors.value = res.results?.content || []
}

onMounted(loadVendors)

const openVendorModal = () => {
  isVendorModalOpen.value = true
}

const closeVendorModal = () => {
  touchField('vendorId')
  isVendorModalOpen.value = false
}

const handleVendorSelect = (vendor) => {
  form.vendorId = String(vendor.id)
  touched.vendorId = true
  isVendorModalOpen.value = false
}

const clearSelectedVendor = () => {
  form.vendorId = ''
}

const handleCancel = () => {
  if (isDirty.value && !window.confirm('작성 중인 내용이 있습니다. 목록으로 이동할까요?')) {
    return
  }

  isVendorModalOpen.value = false
  router.push('/products')
}

const submitForm = async () => {
  submitted.value = true

  if (Object.values(errors.value).some(Boolean)) {
    return
  }

  const vendor = vendors.value.find((item) => String(item.id) === String(form.vendorId))
  if (!vendor) {
    return
  }

  isSubmitting.value = true

  const res = await productApi.createProduct({
    ...form,
    status: 'SELLING',
    vendorName: vendor.name,
  })

  isSubmitting.value = false

  if (!res.success) {
    alert(res.message || '상품 등록에 실패했습니다.')
    return
  }

  router.push(`/products/${res.results.id}`)
}
</script>
