<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Vendor ASN Reply</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">ASN 회신 작성</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            발주 요청 내용을 확인한 뒤 실제 출하 예정 정보를 입력합니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="goBack">발주 요청 상세로</ButtonComp>
          <ButtonComp color="primary" icon="save" :disabled="isSubmitting || !purchaseOrder" @click="submitAsn">
            ASN 회신 저장
          </ButtonComp>
        </div>
      </div>
    </template>

    <section
      v-if="isLoading"
      class="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
    >
      발주 요청을 불러오는 중입니다.
    </section>

    <section
      v-else-if="errorMessage && !purchaseOrder"
      class="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-sm text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </section>

    <section v-else-if="purchaseOrder" class="space-y-6">
      <section class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">발주 기본 정보</h2>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="info-card">
              <div class="info-label">발주번호</div>
              <div class="info-value">{{ purchaseOrder.purchaseOrderNumber }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">공급업체</div>
              <div class="info-value">{{ purchaseOrder.vendorName }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">요청자</div>
              <div class="info-value">{{ purchaseOrder.requesterName || '-' }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">요청 납기일</div>
              <div class="info-value">{{ purchaseOrder.expectedInboundDate || '-' }}</div>
            </div>
            <div class="info-card md:col-span-2">
              <div class="info-label">발주 메모</div>
              <div class="info-value">{{ purchaseOrder.requestMemo || '-' }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">ASN 회신 정보</h2>
          </div>

          <div class="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <label class="flex flex-col gap-1.5 md:col-span-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">회신 결과</span>
              <select v-model="form.status" class="field-input">
                <option value="RECEIVED">수주 가능</option>
                <option value="REJECTED">수주 불가</option>
              </select>
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">도착 예정 일시</span>
              <input v-model="form.expectedArrivalAt" type="datetime-local" class="field-input" :disabled="form.status === 'REJECTED'" />
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">담당자</span>
              <input v-model.trim="form.contactName" class="field-input" />
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">차량 정보</span>
              <input
                v-model.trim="form.vehicleInfo"
                class="field-input"
                :disabled="form.status === 'REJECTED'"
                placeholder="예: 경기87바1234"
              />
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">출하 담당자 연락처</span>
              <input v-model.trim="form.contactPhoneNumber" class="field-input" />
            </label>

            <label class="flex flex-col gap-1.5 md:col-span-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">메모</span>
              <textarea
                v-model.trim="form.note"
                rows="3"
                class="field-input resize-none"
                :placeholder="form.status === 'REJECTED' ? '수주 불가 사유를 입력하세요' : '하차 유의사항이나 전달 메모를 입력하세요'"
              />
            </label>
          </div>
        </article>
      </section>

      <article
        v-if="form.status === 'RECEIVED'"
        class="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">품목별 회신</h2>
        </div>

        <div class="overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">상품명</th>
                <th class="px-6 py-4 text-left font-medium">상품코드</th>
                <th class="px-6 py-4 text-left font-medium">요청 수량</th>
                <th class="px-6 py-4 text-left font-medium">회신 수량</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in form.items"
                :key="item.productId"
                class="border-t border-slate-100 dark:border-slate-800"
              >
                <td class="px-6 py-5 font-medium text-slate-900 dark:text-slate-50">{{ item.productName }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.productCode }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ item.maxQuantity }}개</td>
                <td class="px-6 py-5">
                  <input
                    v-model="item.announcedQuantity"
                    inputmode="numeric"
                    class="field-input min-w-[120px]"
                    :placeholder="String(item.maxQuantity)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <div class="flex justify-end gap-3">
        <ButtonComp color="secondary" icon="close" @click="goBack">취소</ButtonComp>
        <ButtonComp color="primary" icon="save" :disabled="isSubmitting" @click="submitAsn">ASN 회신 저장</ButtonComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import purchaseOrderApi from '@/api/purchaseorder/purchaseOrderApi.js'
import asnApi from '@/api/asn/asnApi.js'
import vendorApi from '@/api/vendor/vendorApi.js'

const route = useRoute()
const router = useRouter()

const purchaseOrder = ref(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  status: 'RECEIVED',
  expectedArrivalAt: '',
  vehicleInfo: '',
  contactName: '',
  contactPhoneNumber: '',
  note: '',
  items: [],
})

const hydratePurchaseOrder = (data, vendor) => {
  purchaseOrder.value = data
  form.expectedArrivalAt = data.expectedInboundDate ? `${data.expectedInboundDate}T09:00` : ''
  form.vehicleInfo = ''
  form.contactName = vendor?.managerName || ''
  form.contactPhoneNumber = vendor?.phoneNumber || ''
  form.note = ''
  form.items = (data.items || []).map((item) => ({
    productId: item.productId,
    productCode: item.productCode,
    productName: item.productName,
    maxQuantity: item.quantity,
    announcedQuantity: String(item.quantity),
  }))
}

const loadPage = async () => {
  const purchaseOrderId = route.params.id
  if (!purchaseOrderId) {
    errorMessage.value = '회신할 발주 요청 정보가 없습니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const res = await purchaseOrderApi.getPurchaseOrderDetail(purchaseOrderId)

  if (!res.success) {
    purchaseOrder.value = null
    errorMessage.value = res.message || '발주 요청 조회에 실패했습니다.'
    isLoading.value = false
    return
  }

  const vendorRes = await vendorApi.getVendorDetail(res.results.vendorId)
  hydratePurchaseOrder(res.results, vendorRes.success ? vendorRes.results : null)
  isLoading.value = false
}

const goBack = () => {
  const purchaseOrderId = route.params.id
  if (purchaseOrderId) {
    router.push(`/vendor-portal/purchase-requests/${purchaseOrderId}`)
    return
  }

  router.push('/vendor-portal/asns')
}

const submitAsn = async () => {
  if (!purchaseOrder.value) {
    return
  }

  if (form.status === 'RECEIVED' && !form.expectedArrivalAt) {
    alert('도착 예정 일시를 입력해주세요.')
    return
  }

  if (!form.contactName.trim()) {
    alert('담당자 정보가 없습니다.')
    return
  }

  if (!form.contactPhoneNumber.trim()) {
    alert('출하 담당자 연락처를 입력해주세요.')
    return
  }

  const invalidItem = form.status === 'RECEIVED'
    ? form.items.find((item) => !String(item.announcedQuantity).trim())
    : null

  if (invalidItem) {
    alert('회신 수량을 입력해주세요.')
    return
  }

  if (form.status === 'REJECTED' && !form.note.trim()) {
    alert('수주 불가 사유를 입력해주세요.')
    return
  }

  isSubmitting.value = true

  const res = await asnApi.createAsn({
    purchaseOrderId: purchaseOrder.value.id,
    expectedArrivalAt: form.status === 'RECEIVED' ? `${form.expectedArrivalAt}:00` : null,
    status: form.status,
    vehicleInfo: form.status === 'RECEIVED' ? form.vehicleInfo.trim() : '',
    contactName: form.contactName.trim(),
    contactPhoneNumber: form.contactPhoneNumber.trim(),
    note: form.note.trim(),
    items: form.status === 'RECEIVED'
      ? form.items.map((item) => ({
          productId: item.productId,
          announcedQuantity: item.announcedQuantity,
        }))
      : [],
  })

  isSubmitting.value = false

  if (!res.success) {
    alert(res.message || 'ASN 등록에 실패했습니다.')
    return
  }

  alert(form.status === 'RECEIVED' ? 'ASN이 등록되고 입고서가 자동 생성되었습니다.' : '수주 불가 ASN이 등록되었습니다.')
  router.push(`/vendor-portal/purchase-requests/${purchaseOrder.value.id}`)
}

onMounted(loadPage)
</script>

<style scoped>
.field-input {
  @apply w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-slate-100 dark:focus:border-emerald-400;
}

.info-card {
  @apply rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950;
}

.info-label {
  @apply text-sm font-medium text-slate-500 dark:text-slate-400;
}

.info-value {
  @apply mt-2 text-base font-semibold text-slate-900 dark:text-slate-50;
}
</style>
